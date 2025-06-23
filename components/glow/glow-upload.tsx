"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { GlowUploadData, GlowEffect } from "../../types/glow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  ArrowLeft,
  Upload,
  Camera,
  Video,
  Music,
  Sparkles,
  Palette,
  Wand2,
  Eye,
  EyeOff,
  Play,
  Pause,
} from "lucide-react"

interface GlowUploadProps {
  onBack: () => void
  onPublish: (data: GlowUploadData) => void
}

const availableEffects: GlowEffect[] = [
  { id: "galaxy", name: "Galaxy Glow", type: "filter", intensity: 0.7, color: "#8B5CF6" },
  { id: "stardust", name: "Stardust", type: "overlay", intensity: 0.5 },
  { id: "moonlight", name: "Moonlight", type: "filter", intensity: 0.8, color: "#60A5FA" },
  { id: "lightning", name: "Lightning", type: "overlay", intensity: 0.9, color: "#F59E0B" },
  { id: "neon", name: "Neon Glow", type: "filter", intensity: 0.6, color: "#EF4444" },
  { id: "cosmic", name: "Cosmic Waves", type: "overlay", intensity: 0.4, color: "#06B6D4" },
]

const moodOptions = ["calm", "hyper", "inspired", "dreamy", "energetic", "nostalgic", "cosmic"]

export function GlowUpload({ onBack, onPublish }: GlowUploadProps) {
  const [uploadData, setUploadData] = useState<GlowUploadData>({
    videoFile: null,
    thumbnail: "",
    title: "",
    description: "",
    moodTags: [],
    effects: [],
    music: null,
    isPrivate: false,
  })

  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [activeTab, setActiveTab] = useState("upload")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setUploadData((prev) => ({ ...prev, videoFile: file }))
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleMoodToggle = (mood: string) => {
    setUploadData((prev) => ({
      ...prev,
      moodTags: prev.moodTags.includes(mood) ? prev.moodTags.filter((m) => m !== mood) : [...prev.moodTags, mood],
    }))
  }

  const handleEffectToggle = (effect: GlowEffect) => {
    setUploadData((prev) => ({
      ...prev,
      effects: prev.effects.find((e) => e.id === effect.id)
        ? prev.effects.filter((e) => e.id !== effect.id)
        : [...prev.effects, effect],
    }))
  }

  const handleEffectIntensityChange = (effectId: string, intensity: number) => {
    setUploadData((prev) => ({
      ...prev,
      effects: prev.effects.map((effect) =>
        effect.id === effectId ? { ...effect, intensity: intensity / 100 } : effect,
      ),
    }))
  }

  const handlePublish = () => {
    if (!uploadData.videoFile || !uploadData.title) {
      alert("Please select a video and add a title")
      return
    }
    onPublish(uploadData)
  }

  const startRecording = () => {
    setIsRecording(true)
    // TODO: Implement camera recording
  }

  const stopRecording = () => {
    setIsRecording(false)
    // TODO: Stop camera recording
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
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">Create Glow</span>
          </div>

          <Button
            onClick={handlePublish}
            disabled={!uploadData.videoFile || !uploadData.title}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Publish
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Upload & Preview */}
          <div className="space-y-6">
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Video Source
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="record">Record</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="mt-4">
                    <div className="space-y-4">
                      <div
                        className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-300 mb-2">Click to upload your video</p>
                        <p className="text-slate-500 text-sm">MP4, MOV, AVI up to 100MB</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="record" className="mt-4">
                    <div className="space-y-4">
                      <div className="bg-slate-800 rounded-lg p-8 text-center">
                        <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-300 mb-4">Record directly from your camera</p>
                        <Button
                          onClick={isRecording ? stopRecording : startRecording}
                          className={`${
                            isRecording
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          }`}
                        >
                          {isRecording ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Stop Recording ({recordingTime}s)
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Start Recording
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Video Preview */}
            {previewUrl && (
              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[9/16] bg-black rounded-lg overflow-hidden relative max-w-xs mx-auto">
                    <video
                      ref={videoRef}
                      src={previewUrl}
                      controls
                      className="w-full h-full object-cover"
                      style={{
                        filter: uploadData.effects
                          .filter((e) => e.type === "filter")
                          .map((e) => `hue-rotate(${e.intensity * 360}deg) saturate(${1 + e.intensity})`)
                          .join(" "),
                      }}
                    />
                    {/* Effect Overlays */}
                    {uploadData.effects
                      .filter((e) => e.type === "overlay")
                      .map((effect) => (
                        <div
                          key={effect.id}
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle, ${effect.color || "#8B5CF6"}${Math.round(
                              effect.intensity * 30,
                            ).toString(16)} 0%, transparent 70%)`,
                            opacity: effect.intensity,
                          }}
                        />
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Side - Details & Effects */}
          <div className="space-y-6">
            {/* Basic Details */}
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-slate-300">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={uploadData.title}
                    onChange={(e) => setUploadData((prev) => ({ ...prev, title: e.target.value }))}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    placeholder="Give your Glow a cosmic title..."
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-slate-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={uploadData.description}
                    onChange={(e) => setUploadData((prev) => ({ ...prev, description: e.target.value }))}
                    className="bg-slate-800/50 border-slate-600 text-white resize-none"
                    placeholder="Share your cosmic story..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadData((prev) => ({ ...prev, isPrivate: !prev.isPrivate }))}
                    className={`border-slate-600 ${
                      uploadData.isPrivate ? "bg-slate-700 text-white" : "text-slate-300"
                    }`}
                  >
                    {uploadData.isPrivate ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {uploadData.isPrivate ? "Private" : "Public"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mood Tags */}
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Mood Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {moodOptions.map((mood) => (
                    <Badge
                      key={mood}
                      variant="outline"
                      className={`cursor-pointer transition-all capitalize ${
                        uploadData.moodTags.includes(mood)
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/50"
                          : "border-slate-600 text-slate-400 hover:border-slate-500"
                      }`}
                      onClick={() => handleMoodToggle(mood)}
                    >
                      #{mood}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Effects */}
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Cosmic Effects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableEffects.map((effect) => {
                  const isActive = uploadData.effects.find((e) => e.id === effect.id)
                  const activeEffect = uploadData.effects.find((e) => e.id === effect.id)

                  return (
                    <div key={effect.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEffectToggle(effect)}
                            className={`${
                              isActive
                                ? "bg-purple-500/20 text-purple-300 border-purple-500/50"
                                : "border-slate-600 text-slate-400"
                            }`}
                          >
                            <Palette className="w-4 h-4 mr-2" />
                            {effect.name}
                          </Button>
                        </div>
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-500 capitalize">
                          {effect.type}
                        </Badge>
                      </div>

                      {isActive && activeEffect && (
                        <div className="ml-4">
                          <Label className="text-slate-400 text-sm">Intensity</Label>
                          <Slider
                            value={[activeEffect.intensity * 100]}
                            onValueChange={([value]) => handleEffectIntensityChange(effect.id, value)}
                            max={100}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Music */}
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Background Music
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
                  <Music className="w-4 h-4 mr-2" />
                  Browse Cosmic Sounds
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
