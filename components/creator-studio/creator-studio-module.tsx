"use client"

import { useState } from "react"
import type { CreatorProject, ProjectType } from "../../types/creator-studio"
import { ProjectManager } from "./project-manager"
import { CreatorStudioInterface } from "./creator-studio-interface"

export function CreatorStudioModule() {
  const [currentView, setCurrentView] = useState<"manager" | "editor">("manager")
  const [selectedProject, setSelectedProject] = useState<CreatorProject | null>(null)

  const handleSelectProject = (project: CreatorProject) => {
    setSelectedProject(project)
    setCurrentView("editor")
  }

  const handleCreateProject = (type: ProjectType) => {
    // Create a new project with the specified type
    const newProject: CreatorProject = {
      id: `project_${Date.now()}`,
      userId: "user_1",
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Project`,
      description: `A new ${type} project created in Creator Studio`,
      type,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastEditedAt: new Date().toISOString(),
      thumbnail: "/placeholder.svg?height=200&width=300",
      duration: type === "orbit_setup" ? undefined : 0,
      settings: {
        resolution:
          type === "glow"
            ? { width: 1080, height: 1920, label: "1080x1920 (9:16)" }
            : { width: 1920, height: 1080, label: "1920x1080 (16:9)" },
        frameRate: type === "orbit_setup" ? 60 : 30,
        aspectRatio: type === "glow" ? "9:16" : "16:9",
        colorSpace: "sRGB",
        bitrate: 5000,
        quality: "high",
        autoSave: true,
        backupEnabled: true,
        collaborationEnabled: false,
        versionControl: true,
      },
      assets: [],
      timeline: [],
      effects: [],
      transitions: [],
      audio: [],
      collaborators: [],
      versions: [],
      metadata: {
        totalDuration: 0,
        totalAssets: 0,
        totalEffects: 0,
        totalTracks: 0,
        exportCount: 0,
        viewCount: 0,
        likeCount: 0,
        shareCount: 0,
        performance: {
          renderSpeed: 1.0,
          memoryUsage: 1.0,
          gpuUsage: 50,
          previewQuality: 80,
          realTimePlayback: true,
        },
      },
      exportSettings: {
        format: "mp4",
        resolution:
          type === "glow"
            ? { width: 1080, height: 1920, label: "1080x1920" }
            : { width: 1920, height: 1080, label: "1920x1080" },
        frameRate: type === "orbit_setup" ? 60 : 30,
        bitrate: 5000,
        quality: 85,
        codec: "H.264",
        audioCodec: "AAC",
        audioBitrate: 256,
        includeAlpha: false,
        colorSpace: "sRGB",
        destination: [type === "glow" ? "glow" : type === "vision" ? "vision" : "orbit"],
        metadata: {
          title: `New ${type} Project`,
          description: `Created with LUNEXIS Creator Studio`,
          tags: [type, "creative", "lunexis"],
          category: "creative",
          mood: "neutral",
          visibility: "private",
          allowComments: true,
          allowDownload: false,
        },
      },
      tags: [type, "creative"],
      category: "creative",
      isPublic: false,
    }

    setSelectedProject(newProject)
    setCurrentView("editor")
  }

  const handleBackToManager = () => {
    setCurrentView("manager")
    setSelectedProject(null)
  }

  const handleSaveProject = (project: CreatorProject) => {
    // Save project logic would go here
    console.log("Saving project:", project.title)
  }

  const handleExportProject = (project: CreatorProject) => {
    // Export project logic would go here
    console.log("Exporting project:", project.title)
  }

  if (currentView === "editor" && selectedProject) {
    return (
      <CreatorStudioInterface
        project={selectedProject}
        onBack={handleBackToManager}
        onSave={handleSaveProject}
        onExport={handleExportProject}
      />
    )
  }

  return <ProjectManager onSelectProject={handleSelectProject} onCreateProject={handleCreateProject} />
}
