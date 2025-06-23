"use client"

import { useState, useRef } from "react"
import type {
  MemoryTrigger,
  TriggerCondition,
  TriggerAction,
  CapsuleLocation,
  RecurrencePattern,
} from "../../types/time-capsule"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { MapPin, Calendar, Bell, X, Save, ArrowLeft, Target, Volume2, Sparkles, Heart, AlertCircle } from "lucide-react"

interface TriggerCreatorProps {
  onSave: (trigger: Partial<MemoryTrigger>) => void
  onCancel: () => void
  editingTrigger?: MemoryTrigger
}

export function TriggerCreator({ onSave, onCancel, editingTrigger }: TriggerCreatorProps) {
  const [name, setName] = useState(editingTrigger?.name || "")
  const [description, setDescription] = useState(editingTrigger?.description || "")
  const [triggerType, setTriggerType] = useState<"location" | "date">("location")
  const [conditions, setConditions] = useState<TriggerCondition[]>(editingTrigger?.conditions || [])
  const [actions, setActions] = useState<TriggerAction[]>(editingTrigger?.actions || [])
  const [isActive, setIsActive] = useState(editingTrigger?.isActive ?? true)
  const [currentStep, setCurrentStep] = useState(1)

  // Location-specific state
  const [selectedLocation, setSelectedLocation] = useState<CapsuleLocation | null>(null)
  const [radius, setRadius] = useState(100) // meters
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)

  // Date-specific state
  const [triggerDate, setTriggerDate] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>({
    type: "yearly",
    interval: 1,
  })
  const [timeOfDay, setTimeOfDay] = useState("09:00")

  // Settings
  const [maxTriggersPerDay, setMaxTriggersPerDay] = useState(3)
  const [quietHours, setQuietHours] = useState({ start: "22:00", end: "08:00" })
  const [enabledDays, setEnabledDays] = useState<string[]>([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ])
  const [requireConfirmation, setRequireConfirmation] = useState(true)
  const [autoCreateMemories, setAutoCreateMemories] = useState(false)

  const mapRef = useRef<HTMLDivElement>(null)

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.")
      return
    }

    setUseCurrentLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: CapsuleLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: "Current Location",
          city: "",
          country: "",
        }
        setSelectedLocation(location)
        setUseCurrentLocation(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        setUseCurrentLocation(false)
        alert("Unable to get your current location. Please try again.")
      },
    )
  }

  const handleAddCondition = () => {
    const newCondition: TriggerCondition = {
      id: `condition_${Date.now()}`,
      type: triggerType,
      operator: triggerType === "location" ? "within_radius" : "on_date",
      value: triggerType === "location" ? selectedLocation : triggerDate,
      description: `${triggerType} trigger condition`,
      isActive: true,
    }

    setConditions([...conditions, newCondition])
  }

  const handleRemoveCondition = (conditionId: string) => {
    setConditions(conditions.filter((c) => c.id !== conditionId))
  }

  const handleAddAction = (actionType: string) => {
    const newAction: TriggerAction = {
      id: `action_${Date.now()}`,
      type: actionType as any,
      config: {},
      description: `${actionType} action`,
      priority: "medium",
    }

    switch (actionType) {
      case "notify":
        newAction.config = {
          title: "Memory Trigger Activated",
          message: "A special moment is happening!",
          sound: true,
        }
        break
      case "create_memory":
        newAction.config = {
          autoFill: true,
          suggestContent: true,
        }
        break
      case "unlock_capsule":
        newAction.config = {
          capsuleId: "",
        }
        break
      case "play_audio":
        newAction.config = {
          audioUrl: "",
          volume: 0.5,
          loop: false,
        }
        break
    }

    setActions([...actions, newAction])
  }

  const handleRemoveAction = (actionId: string) => {
    setActions(actions.filter((a) => a.id !== actionId))
  }

  const handleUpdateAction = (actionId: string, updates: Partial<TriggerAction>) => {
    setActions(actions.map((action) => (action.id === actionId ? { ...action, ...updates } : action)))
  }

  const handleSave = () => {
    const triggerData: Partial<MemoryTrigger> = {
      name,
      description,
      conditions,
      actions,
      isActive,
      settings: {
        maxTriggersPerDay,
        quietHours,
        enabledDays,
        requireConfirmation,
        autoCreateMemories,
        notificationStyle: "standard",
      },
      metadata: {
        associatedCapsules: [],
        successRate: 0,
        lastModified: new Date().toISOString(),
        tags: [],
      },
    }

    onSave(triggerData)
  }

  const actionTypes = [
    { id: "notify", name: "Send Notification", icon: Bell, description: "Alert you when triggered" },
    { id: "create_memory", name: "Suggest Memory", icon: Sparkles, description: "Prompt to create a new memory" },
    { id: "unlock_capsule", name: "Unlock Capsule", icon: Heart, description: "Unlock a specific time capsule" },
    { id: "play_audio", name: "Play Audio", icon: Volume2, description: "Play ambient sound or music" },
  ]

  const dayNames = [
    { id: "monday", name: "Mon" },
    { id: "tuesday", name: "Tue" },
    { id: "wednesday", name: "Wed" },
    { id: "thursday", name: "Thu" },
    { id: "friday", name: "Fri" },
    { id: "saturday", name: "Sat" },
    { id: "sunday", name: "Sun" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {editingTrigger ? "Edit Memory Trigger" : "Create Memory Trigger"}
            </h1>
            <p className="text-slate-400">Set up automatic memory prompts based on location or date</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onCancel} className="border-slate-600 text-slate-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Save className="w-4 h-4 mr-2" />
              {editingTrigger ? "Update" : "Create"} Trigger
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && <div className="w-12 h-0.5 bg-slate-700 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        <Tabs value={`step-${currentStep}`} onValueChange={(value) => setCurrentStep(Number(value.split("-")[1]))}>
          {/* Step 1: Basic Information */}
          <TabsContent value="step-1">
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">Trigger Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., 'Birthday Reminder' or 'Coffee Shop Memories'"
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe when and why this trigger should activate..."
                    className="bg-slate-800/50 border-slate-600 text-white min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="text-slate-300 text-sm font-medium mb-3 block">Trigger Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant={triggerType === "location" ? "default" : "outline"}
                      onClick={() => setTriggerType("location")}
                      className={`h-auto p-4 ${
                        triggerType === "location"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : "border-slate-600 text-slate-300"
                      }`}
                    >
                      <div className="text-center">
                        <MapPin className="w-8 h-8 mx-auto mb-2" />
                        <div className="font-medium">Location-Based</div>
                        <div className="text-xs opacity-70">Trigger when you visit specific places</div>
                      </div>
                    </Button>

                    <Button
                      variant={triggerType === "date" ? "default" : "outline"}
                      onClick={() => setTriggerType("date")}
                      className={`h-auto p-4 ${
                        triggerType === "date"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : "border-slate-600 text-slate-300"
                      }`}
                    >
                      <div className="text-center">
                        <Calendar className="w-8 h-8 mx-auto mb-2" />
                        <div className="font-medium">Date-Based</div>
                        <div className="text-xs opacity-70">Trigger on specific dates or anniversaries</div>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={isActive} onCheckedChange={setIsActive} />
                    <label className="text-slate-300 text-sm">Active</label>
                  </div>
                  <Button onClick={() => setCurrentStep(2)} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Next: Configure Trigger
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: Configure Trigger */}
          <TabsContent value="step-2">
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  {triggerType === "location" ? <MapPin className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                  Configure {triggerType === "location" ? "Location" : "Date"} Trigger
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {triggerType === "location" ? (
                  <>
                    <div>
                      <label className="text-slate-300 text-sm font-medium mb-3 block">Location</label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter address or place name..."
                            className="bg-slate-800/50 border-slate-600 text-white flex-1"
                            value={selectedLocation?.address || ""}
                            onChange={(e) =>
                              setSelectedLocation((prev) => (prev ? { ...prev, address: e.target.value } : null))
                            }
                          />
                          <Button
                            onClick={handleGetCurrentLocation}
                            disabled={useCurrentLocation}
                            variant="outline"
                            className="border-slate-600 text-slate-300"
                          >
                            {useCurrentLocation ? "Getting..." : "Use Current"}
                          </Button>
                        </div>

                        {selectedLocation && (
                          <div className="bg-slate-800/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-purple-400" />
                              <span className="text-white font-medium">Selected Location</span>
                            </div>
                            <p className="text-slate-300 text-sm">{selectedLocation.address}</p>
                            <p className="text-slate-500 text-xs">
                              {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                            </p>
                          </div>
                        )}

                        {/* Map placeholder */}
                        <div
                          ref={mapRef}
                          className="w-full h-48 bg-slate-800/50 rounded-lg border border-slate-600 flex items-center justify-center"
                        >
                          <div className="text-center text-slate-400">
                            <MapPin className="w-8 h-8 mx-auto mb-2" />
                            <p>Interactive map would appear here</p>
                            <p className="text-xs">Click to select location</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm font-medium mb-2 block">
                        Trigger Radius: {radius} meters
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="1000"
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>10m</span>
                        <span>1km</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-slate-300 text-sm font-medium mb-2 block">Trigger Date</label>
                      <Input
                        type="date"
                        value={triggerDate}
                        onChange={(e) => setTriggerDate(e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm font-medium mb-2 block">Time of Day</label>
                      <Input
                        type="time"
                        value={timeOfDay}
                        onChange={(e) => setTimeOfDay(e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
                      <label className="text-slate-300 text-sm">Recurring trigger</label>
                    </div>

                    {isRecurring && (
                      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg">
                        <div>
                          <label className="text-slate-300 text-sm font-medium mb-2 block">Recurrence Pattern</label>
                          <select
                            value={recurrencePattern.type}
                            onChange={(e) => setRecurrencePattern((prev) => ({ ...prev, type: e.target.value as any }))}
                            className="w-full bg-slate-700/50 border border-slate-600 text-white rounded px-3 py-2"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-slate-300 text-sm font-medium mb-2 block">
                            Every {recurrencePattern.interval} {recurrencePattern.type.slice(0, -2)}(s)
                          </label>
                          <Input
                            type="number"
                            min="1"
                            value={recurrencePattern.interval}
                            onChange={(e) =>
                              setRecurrencePattern((prev) => ({ ...prev, interval: Number(e.target.value) }))
                            }
                            className="bg-slate-800/50 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-between">
                  <Button onClick={() => setCurrentStep(1)} variant="outline" className="border-slate-600">
                    Previous
                  </Button>
                  <Button onClick={() => setCurrentStep(3)} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Next: Add Actions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Actions */}
          <TabsContent value="step-3">
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-slate-300 font-medium mb-3">What should happen when this trigger activates?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {actionTypes.map((type) => (
                      <Button
                        key={type.id}
                        variant="outline"
                        onClick={() => handleAddAction(type.id)}
                        className="h-auto p-4 border-slate-600 text-slate-300 hover:bg-slate-800 flex-col"
                      >
                        <type.icon className="w-6 h-6 mb-2" />
                        <div className="text-center">
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs opacity-70">{type.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {actions.length > 0 && (
                  <div>
                    <h3 className="text-slate-300 font-medium mb-3">Configured Actions ({actions.length})</h3>
                    <div className="space-y-3">
                      {actions.map((action) => (
                        <Card key={action.id} className="bg-slate-800/50 border-slate-700/50">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                {action.type === "notify" && <Bell className="w-5 h-5 text-white" />}
                                {action.type === "create_memory" && <Sparkles className="w-5 h-5 text-white" />}
                                {action.type === "unlock_capsule" && <Heart className="w-5 h-5 text-white" />}
                                {action.type === "play_audio" && <Volume2 className="w-5 h-5 text-white" />}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-white font-medium capitalize">{action.type.replace("_", " ")}</h4>
                                  <Badge variant="outline" className="border-slate-600 text-slate-400">
                                    {action.priority}
                                  </Badge>
                                </div>

                                {action.type === "notify" && (
                                  <div className="space-y-2">
                                    <Input
                                      placeholder="Notification title..."
                                      value={action.config.title || ""}
                                      onChange={(e) =>
                                        handleUpdateAction(action.id, {
                                          config: { ...action.config, title: e.target.value },
                                        })
                                      }
                                      className="bg-slate-700/50 border-slate-600 text-white text-sm"
                                    />
                                    <Input
                                      placeholder="Notification message..."
                                      value={action.config.message || ""}
                                      onChange={(e) =>
                                        handleUpdateAction(action.id, {
                                          config: { ...action.config, message: e.target.value },
                                        })
                                      }
                                      className="bg-slate-700/50 border-slate-600 text-white text-sm"
                                    />
                                  </div>
                                )}

                                {action.type === "unlock_capsule" && (
                                  <Input
                                    placeholder="Capsule ID to unlock..."
                                    value={action.config.capsuleId || ""}
                                    onChange={(e) =>
                                      handleUpdateAction(action.id, {
                                        config: { ...action.config, capsuleId: e.target.value },
                                      })
                                    }
                                    className="bg-slate-700/50 border-slate-600 text-white text-sm"
                                  />
                                )}

                                {action.type === "play_audio" && (
                                  <div className="space-y-2">
                                    <Input
                                      placeholder="Audio URL..."
                                      value={action.config.audioUrl || ""}
                                      onChange={(e) =>
                                        handleUpdateAction(action.id, {
                                          config: { ...action.config, audioUrl: e.target.value },
                                        })
                                      }
                                      className="bg-slate-700/50 border-slate-600 text-white text-sm"
                                    />
                                    <div className="flex items-center gap-2">
                                      <label className="text-slate-400 text-xs">Volume:</label>
                                      <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={action.config.volume || 0.5}
                                        onChange={(e) =>
                                          handleUpdateAction(action.id, {
                                            config: { ...action.config, volume: Number(e.target.value) },
                                          })
                                        }
                                        className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveAction(action.id)}
                                className="text-slate-400 hover:text-red-400"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button onClick={() => setCurrentStep(2)} variant="outline" className="border-slate-600">
                    Previous
                  </Button>
                  <Button onClick={() => setCurrentStep(4)} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Next: Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 4: Settings */}
          <TabsContent value="step-4">
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Trigger Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">
                    Maximum triggers per day: {maxTriggersPerDay}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={maxTriggersPerDay}
                    onChange={(e) => setMaxTriggersPerDay(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 text-sm font-medium mb-3 block">Quiet Hours</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 text-xs mb-1 block">Start</label>
                      <Input
                        type="time"
                        value={quietHours.start}
                        onChange={(e) => setQuietHours((prev) => ({ ...prev, start: e.target.value }))}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs mb-1 block">End</label>
                      <Input
                        type="time"
                        value={quietHours.end}
                        onChange={(e) => setQuietHours((prev) => ({ ...prev, end: e.target.value }))}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 text-sm font-medium mb-3 block">Active Days</label>
                  <div className="flex flex-wrap gap-2">
                    {dayNames.map((day) => (
                      <Button
                        key={day.id}
                        variant={enabledDays.includes(day.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (enabledDays.includes(day.id)) {
                            setEnabledDays(enabledDays.filter((d) => d !== day.id))
                          } else {
                            setEnabledDays([...enabledDays, day.id])
                          }
                        }}
                        className={
                          enabledDays.includes(day.id)
                            ? "bg-gradient-to-r from-purple-500 to-pink-500"
                            : "border-slate-600 text-slate-300"
                        }
                      >
                        {day.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-slate-300 text-sm font-medium">Require Confirmation</label>
                      <p className="text-slate-500 text-xs">Ask before executing trigger actions</p>
                    </div>
                    <Switch checked={requireConfirmation} onCheckedChange={setRequireConfirmation} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-slate-300 text-sm font-medium">Auto-Create Memories</label>
                      <p className="text-slate-500 text-xs">Automatically suggest memory creation</p>
                    </div>
                    <Switch checked={autoCreateMemories} onCheckedChange={setAutoCreateMemories} />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button onClick={() => setCurrentStep(3)} variant="outline" className="border-slate-600">
                    Previous
                  </Button>
                  <Button onClick={handleSave} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <Save className="w-4 h-4 mr-2" />
                    {editingTrigger ? "Update" : "Create"} Trigger
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
