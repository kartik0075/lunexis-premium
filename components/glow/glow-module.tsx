"use client"

import { useState } from "react"
import { GlowFeed } from "./glow-feed"
import { GlowUpload } from "./glow-upload"
import type { GlowUploadData } from "../../types/glow"

interface GlowModuleProps {
  onBack: () => void
}

export function GlowModule({ onBack }: GlowModuleProps) {
  const [currentView, setCurrentView] = useState<"feed" | "upload">("feed")

  const handleCreateGlow = () => {
    setCurrentView("upload")
  }

  const handleBackToFeed = () => {
    setCurrentView("feed")
  }

  const handlePublishGlow = (data: GlowUploadData) => {
    console.log("Publishing Glow:", data)
    // TODO: Upload to backend
    setCurrentView("feed")
  }

  if (currentView === "upload") {
    return <GlowUpload onBack={handleBackToFeed} onPublish={handlePublishGlow} />
  }

  return <GlowFeed onBack={onBack} onCreateGlow={handleCreateGlow} />
}
