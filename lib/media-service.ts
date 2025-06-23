"use client"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface MediaUploadOptions {
  file: File
  bucket: string
  folder?: string
  onProgress?: (progress: number) => void
  maxSize?: number
  allowedTypes?: string[]
}

export interface MediaMetadata {
  id: string
  url: string
  publicUrl: string
  fileName: string
  fileSize: number
  mimeType: string
  duration?: number
  dimensions?: { width: number; height: number }
  thumbnail?: string
  uploadedAt: string
}

export class MediaService {
  private readonly BUCKETS = {
    IMAGES: "images",
    VIDEOS: "videos",
    AUDIO: "audio",
    DOCUMENTS: "documents",
    THUMBNAILS: "thumbnails",
  }

  // File Upload with Progress
  async uploadFile(options: MediaUploadOptions): Promise<MediaMetadata> {
    const { file, bucket, folder = "", onProgress, maxSize = 100 * 1024 * 1024, allowedTypes } = options

    // Validate file size
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`)
    }

    // Validate file type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed`)
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    try {
      // Upload file with progress tracking
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) throw error

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath)

      // Extract metadata
      const metadata = await this.extractMediaMetadata(file, publicUrl)

      // Save metadata to database
      const mediaRecord = await this.saveMediaMetadata({
        fileName,
        filePath: data.path,
        fileSize: file.size,
        mimeType: file.type,
        bucket,
        publicUrl,
        ...metadata,
      })

      return {
        id: mediaRecord.id,
        url: data.path,
        publicUrl,
        fileName,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        ...metadata,
      }
    } catch (error) {
      console.error("Upload failed:", error)
      throw error
    }
  }

  // Extract metadata from media files
  private async extractMediaMetadata(file: File, url: string): Promise<Partial<MediaMetadata>> {
    const metadata: Partial<MediaMetadata> = {}

    if (file.type.startsWith("image/")) {
      const dimensions = await this.getImageDimensions(file)
      metadata.dimensions = dimensions

      // Generate thumbnail for images
      const thumbnail = await this.generateImageThumbnail(file)
      if (thumbnail) {
        const thumbnailUpload = await this.uploadFile({
          file: thumbnail,
          bucket: this.BUCKETS.THUMBNAILS,
          folder: "images",
        })
        metadata.thumbnail = thumbnailUpload.publicUrl
      }
    } else if (file.type.startsWith("video/")) {
      const videoMetadata = await this.getVideoMetadata(file)
      metadata.duration = videoMetadata.duration
      metadata.dimensions = videoMetadata.dimensions

      // Generate video thumbnail
      const thumbnail = await this.generateVideoThumbnail(file)
      if (thumbnail) {
        const thumbnailUpload = await this.uploadFile({
          file: thumbnail,
          bucket: this.BUCKETS.THUMBNAILS,
          folder: "videos",
        })
        metadata.thumbnail = thumbnailUpload.publicUrl
      }
    } else if (file.type.startsWith("audio/")) {
      const duration = await this.getAudioDuration(file)
      metadata.duration = duration
    }

    return metadata
  }

  // Image processing utilities
  private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  private generateImageThumbnail(file: File, maxSize = 300): Promise<File | null> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        const { width, height } = img
        const ratio = Math.min(maxSize / width, maxSize / height)

        canvas.width = width * ratio
        canvas.height = height * ratio

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const thumbnailFile = new File([blob], `thumb_${file.name}`, { type: "image/jpeg" })
              resolve(thumbnailFile)
            } else {
              resolve(null)
            }
          },
          "image/jpeg",
          0.8,
        )
      }

      img.onerror = () => resolve(null)
      img.src = URL.createObjectURL(file)
    })
  }

  // Video processing utilities
  private getVideoMetadata(file: File): Promise<{ duration: number; dimensions: { width: number; height: number } }> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video")
      video.preload = "metadata"

      video.onloadedmetadata = () => {
        resolve({
          duration: video.duration,
          dimensions: { width: video.videoWidth, height: video.videoHeight },
        })
      }

      video.onerror = reject
      video.src = URL.createObjectURL(file)
    })
  }

  private generateVideoThumbnail(file: File): Promise<File | null> {
    return new Promise((resolve) => {
      const video = document.createElement("video")
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      video.onloadedmetadata = () => {
        video.currentTime = Math.min(1, video.duration / 2) // Capture at 1 second or middle
      }

      video.onseeked = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx?.drawImage(video, 0, 0)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const thumbnailFile = new File([blob], `thumb_${file.name}.jpg`, { type: "image/jpeg" })
              resolve(thumbnailFile)
            } else {
              resolve(null)
            }
          },
          "image/jpeg",
          0.8,
        )
      }

      video.onerror = () => resolve(null)
      video.src = URL.createObjectURL(file)
    })
  }

  // Audio processing utilities
  private getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = document.createElement("audio")
      audio.preload = "metadata"

      audio.onloadedmetadata = () => {
        resolve(audio.duration)
      }

      audio.onerror = reject
      audio.src = URL.createObjectURL(file)
    })
  }

  // Database operations
  private async saveMediaMetadata(metadata: any) {
    const { data, error } = await supabase.from("media_files").insert([metadata]).select().single()

    if (error) throw error
    return data
  }

  // Batch upload for multiple files
  async uploadMultipleFiles(files: File[], options: Omit<MediaUploadOptions, "file">): Promise<MediaMetadata[]> {
    const uploads = files.map((file) => this.uploadFile({ ...options, file }))
    return Promise.all(uploads)
  }

  // Delete media file
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) throw error

    // Also remove from database
    await supabase.from("media_files").delete().eq("file_path", path)
  }

  // Get media file info
  async getMediaInfo(id: string): Promise<MediaMetadata | null> {
    const { data, error } = await supabase.from("media_files").select("*").eq("id", id).single()

    if (error) return null
    return data
  }

  // Stream video with quality options
  getVideoStreamUrl(path: string, quality?: "low" | "medium" | "high"): string {
    const { data } = supabase.storage.from(this.BUCKETS.VIDEOS).getPublicUrl(path)

    // In a real implementation, you'd have different quality versions
    return data.publicUrl
  }

  // Audio streaming
  getAudioStreamUrl(path: string): string {
    const { data } = supabase.storage.from(this.BUCKETS.AUDIO).getPublicUrl(path)

    return data.publicUrl
  }
}

export const mediaService = new MediaService()
