"use client"

import { useState } from "react"
import { OrbitStreamPage } from "./orbit-stream-page"
import { OrbitSetup } from "./orbit-setup"
import type { OrbitUploadData } from "../../types/orbit"

interface OrbitModuleProps {
  onBack: () => void
  initialStreamId?: string
}

export function OrbitModule({ onBack, initialStreamId }: OrbitModuleProps) {
  const [currentView, setCurrentView] = useState<"stream" | "setup">(initialStreamId ? "stream" : "setup")
  const [currentStreamId, setCurrentStreamId] = useState(initialStreamId || "orbit_1")

  const handleGoLive = (data: OrbitUploadData) => {
    console.log("Going live with:", data)
    // TODO: Start stream with backend
    setCurrentView("stream")
  }

  const handleBackToSetup = () => {
    setCurrentView("setup")
  }

  if (currentView === "setup") {
    return <OrbitSetup onBack={onBack} onGoLive={handleGoLive} />
  }

  return <OrbitStreamPage streamId={currentStreamId} onBack={onBack} />
}
