"use client"

import { useState } from "react"
import { VisionPage } from "./vision-page"
import { VisionUpload } from "./vision-upload"
import type { VisionUploadData } from "../../types/vision"

interface VisionModuleProps {
  onBack: () => void
  initialVideoId?: string
}

export function VisionModule({ onBack, initialVideoId }: VisionModuleProps) {
  const [currentView, setCurrentView] = useState<"video" | "upload">(initialVideoId ? "video" : "video")
  const [currentVideoId, setCurrentVideoId] = useState(initialVideoId || "vision_1")

  const handleCreateVision = () => {
    setCurrentView("upload")
  }

  const handleBackToVideo = () => {
    setCurrentView("video")
  }

  const handlePublishVision = (data: VisionUploadData) => {
    console.log("Publishing Vision:", data)
    // TODO: Upload to backend
    setCurrentView("video")
  }

  if (currentView === "upload") {
    return <VisionUpload onBack={handleBackToVideo} onPublish={handlePublishVision} />
  }

  return <VisionPage videoId={currentVideoId} onBack={onBack} />
}
