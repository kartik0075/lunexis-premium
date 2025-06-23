"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { mediaService, type MediaMetadata } from "../../lib/media-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, ImageIcon, Video, Mic, FileText, X, Check, AlertCircle } from "lucide-react"

interface MediaUploaderProps {
  onUploadComplete: (media: MediaMetadata[]) => void
  acceptedTypes?: string[]
  maxFiles?: number
  maxSize?: number
  bucket?: string
  folder?: string
}

interface UploadProgress {
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
  result?: MediaMetadata
  error?: string
}

export function MediaUploader({
  onUploadComplete,
  acceptedTypes = ["image/*", "video/*", "audio/*"],
  maxFiles = 10,
  maxSize = 100 * 1024 * 1024, // 100MB
  bucket = "images",
  folder = "",
}: MediaUploaderProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const fileArray = Array.from(files).slice(0, maxFiles)
      const newUploads: UploadProgress[] = fileArray.map((file) => ({
        file,
        progress: 0,
        status: "uploading",
      }))

      setUploads((prev) => [...prev, ...newUploads])

      // Start uploads
      fileArray.forEach((file, index) => {
        uploadFile(file, uploads.length + index)
      })
    },
    [maxFiles, uploads.length],
  )

  const uploadFile = async (file: File, index: number) => {
    try {
      const result = await mediaService.uploadFile({
        file,
        bucket,
        folder,
        maxSize,
        allowedTypes: acceptedTypes,
        onProgress: (progress) => {
          setUploads((prev) => prev.map((upload, i) => (i === index ? { ...upload, progress } : upload)))
        },
      })

      setUploads((prev) =>
        prev.map((upload, i) => (i === index ? { ...upload, status: "completed", result, progress: 100 } : upload)),
      )
    } catch (error) {
      setUploads((prev) =>
        prev.map((upload, i) =>
          i === index
            ? {
                ...upload,
                status: "error",
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : upload,
        ),
      )
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeUpload = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index))
  }

  const completedUploads = uploads.filter((upload) => upload.status === "completed" && upload.result)

  const handleComplete = () => {
    const results = completedUploads.map((upload) => upload.result!).filter(Boolean)
    onUploadComplete(results)
    setUploads([])
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-5 h-5" />
    if (file.type.startsWith("video/")) return <Video className="w-5 h-5" />
    if (file.type.startsWith("audio/")) return <Mic className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragging ? "border-purple-500 bg-purple-500/10" : "border-slate-600 hover:border-slate-500"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Drop files here or click to browse</h3>
          <p className="text-slate-400 text-sm mb-4">
            Support for {acceptedTypes.join(", ")} up to {formatFileSize(maxSize)}
          </p>
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </Button>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium">Uploading Files ({uploads.length})</h4>
          {uploads.map((upload, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-purple-400">{getFileIcon(upload.file)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white font-medium truncate">{upload.file.name}</p>
                      <div className="flex items-center gap-2">
                        {upload.status === "completed" && <Check className="w-4 h-4 text-green-400" />}
                        {upload.status === "error" && <AlertCircle className="w-4 h-4 text-red-400" />}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUpload(index)}
                          className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                      <span>{formatFileSize(upload.file.size)}</span>
                      <Badge variant="outline" className="text-xs border-slate-600">
                        {upload.file.type}
                      </Badge>
                    </div>

                    {upload.status === "uploading" && <Progress value={upload.progress} className="h-2" />}

                    {upload.status === "error" && <p className="text-red-400 text-sm">{upload.error}</p>}

                    {upload.status === "completed" && upload.result && (
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <Check className="w-3 h-3" />
                        <span>Upload completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {completedUploads.length > 0 && (
            <Button onClick={handleComplete} className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
              Complete Upload ({completedUploads.length} files)
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
