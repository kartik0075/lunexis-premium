"use client"

import { useState } from "react"
import type { VisionVideo } from "../../types/vision"
import { VisionPlayer } from "./vision-player"
import { VisionInfo } from "./vision-info"
import { VisionComments } from "./vision-comments"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Play } from "lucide-react"

// Mock Vision video data
const mockVisionVideo: VisionVideo = {
  id: "vision_1",
  userId: "user_1",
  title: "Journey Through Digital Galaxies: AI Art & Emotional Creativity",
  description: `In this comprehensive exploration, we dive deep into the intersection of artificial intelligence and creative expression. 

Join me as we journey through digital galaxies, examining how AI-generated art can evoke profound emotional responses and inspire new forms of creativity. We'll explore the technical aspects of AI art generation, the philosophical implications of machine creativity, and the future of human-AI collaboration in the creative process.

This video covers:
- The evolution of AI art from simple algorithms to complex neural networks
- How emotional resonance is achieved in digital art
- The role of human creativity in guiding AI systems
- Practical techniques for creating emotionally impactful AI art
- The future implications for artists and creators

Whether you're an artist, technologist, or simply curious about the intersection of AI and creativity, this journey will provide insights into one of the most fascinating developments of our digital age.

#AIArt #DigitalCreativity #TechArt #FutureOfArt #MachineLearning #CreativeAI`,
  videoUrl: "/placeholder-video.mp4",
  thumbnailUrl: "/placeholder.svg?height=720&width=1280",
  duration: 932, // 15:32
  createdAt: "2024-01-14T16:00:00Z",
  views: 89247,
  likes: 8924,
  dislikes: 156,
  comments: 892,
  shares: 234,
  isLiked: false,
  isDisliked: false,
  moodTags: ["inspired", "educational", "creative", "cosmic"],
  chapters: [
    {
      id: "chapter_1",
      title: "Introduction to Digital Cosmos",
      startTime: 0,
      endTime: 225,
      thumbnail: "/placeholder.svg?height=90&width=160",
    },
    {
      id: "chapter_2",
      title: "AI Art Generation Process",
      startTime: 225,
      endTime: 500,
      thumbnail: "/placeholder.svg?height=90&width=160",
    },
    {
      id: "chapter_3",
      title: "Emotional Resonance in Digital Art",
      startTime: 500,
      endTime: 730,
      thumbnail: "/placeholder.svg?height=90&width=160",
    },
    {
      id: "chapter_4",
      title: "Future Implications & Collaboration",
      startTime: 730,
      endTime: 932,
      thumbnail: "/placeholder.svg?height=90&width=160",
    },
  ],
  quality: [
    { label: "4K", value: "2160p", url: "/placeholder-video-4k.mp4" },
    { label: "1080p", value: "1080p", url: "/placeholder-video-1080p.mp4" },
    { label: "720p", value: "720p", url: "/placeholder-video-720p.mp4" },
    { label: "480p", value: "480p", url: "/placeholder-video-480p.mp4" },
  ],
  captions: [
    { language: "en", label: "English", url: "/captions-en.vtt" },
    { language: "es", label: "Spanish", url: "/captions-es.vtt" },
  ],
  user: {
    id: "user_1",
    username: "nebula_creator",
    displayName: "Nebula Creator",
    avatar: "/placeholder.svg?height=50&width=50",
    isVerified: true,
    subscribers: 125000,
  },
}

// Mock related videos
const mockRelatedVideos: VisionVideo[] = [
  {
    ...mockVisionVideo,
    id: "vision_2",
    title: "The Art of Cosmic Storytelling",
    description: "Exploring narrative techniques in digital art...",
    thumbnailUrl: "/placeholder.svg?height=180&width=320",
    duration: 678,
    views: 45623,
    likes: 4562,
    moodTags: ["creative", "inspired"],
  },
  {
    ...mockVisionVideo,
    id: "vision_3",
    title: "Building Emotional AI Systems",
    description: "How to create AI that understands emotion...",
    thumbnailUrl: "/placeholder.svg?height=180&width=320",
    duration: 1245,
    views: 78934,
    likes: 7893,
    moodTags: ["educational", "inspired"],
  },
]

interface VisionPageProps {
  videoId: string
  onBack: () => void
}

export function VisionPage({ videoId, onBack }: VisionPageProps) {
  const [video] = useState<VisionVideo>(mockVisionVideo)
  const [relatedVideos] = useState<VisionVideo[]>(mockRelatedVideos)

  const handleLike = (id: string) => {
    console.log("Like video:", id)
    // TODO: Implement like functionality
  }

  const handleDislike = (id: string) => {
    console.log("Dislike video:", id)
    // TODO: Implement dislike functionality
  }

  const handleShare = (id: string) => {
    console.log("Share video:", id)
    // TODO: Implement share functionality
  }

  const handleSubscribe = (userId: string) => {
    console.log("Subscribe to user:", userId)
    // TODO: Implement subscribe functionality
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">Vision</span>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Video Player */}
            <VisionPlayer
              video={video}
              onLike={handleLike}
              onDislike={handleDislike}
              onShare={handleShare}
              onSubscribe={handleSubscribe}
            />

            {/* Video Info */}
            <VisionInfo
              video={video}
              onLike={handleLike}
              onDislike={handleDislike}
              onShare={handleShare}
              onSubscribe={handleSubscribe}
            />

            {/* Comments */}
            <VisionComments videoId={video.id} totalComments={video.comments} />
          </div>

          {/* Sidebar - Related Videos */}
          <div className="xl:col-span-1">
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50 sticky top-24">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-4">Related Videos</h3>
                <div className="space-y-4">
                  {relatedVideos.map((relatedVideo) => (
                    <div
                      key={relatedVideo.id}
                      className="flex gap-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={relatedVideo.thumbnailUrl || "/placeholder.svg"}
                          alt={relatedVideo.title}
                          className="w-24 h-14 object-cover rounded"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                          {formatDuration(relatedVideo.duration)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-medium line-clamp-2 mb-1">{relatedVideo.title}</h4>
                        <div className="text-slate-400 text-xs space-y-1">
                          <div>{relatedVideo.user.displayName}</div>
                          <div>{formatNumber(relatedVideo.views)} views</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
