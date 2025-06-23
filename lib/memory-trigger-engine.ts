"use client"

import type {
  MemoryTrigger,
  TriggerAction,
  LocationTrigger,
  DateTrigger,
  TriggerNotification,
  CapsuleLocation,
} from "../types/time-capsule"

interface NotificationAction {
  id: string
  label: string
  action: string
  data?: any
}

export class MemoryTriggerEngine {
  private triggers: MemoryTrigger[] = []
  private activeLocationWatchers: Map<string, number> = new Map()
  private activeDateWatchers: Map<string, number> = new Map()
  private notificationCallbacks: ((notification: TriggerNotification) => void)[] = []

  constructor() {
    this.initializeEngine()
  }

  private initializeEngine() {
    // Initialize geolocation watching if supported
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      this.startLocationMonitoring()
    }

    // Initialize date monitoring
    this.startDateMonitoring()
  }

  // Location-based triggers
  private startLocationMonitoring() {
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentLocation: CapsuleLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: "", // Would be resolved via reverse geocoding
          city: "",
          country: "",
        }
        this.checkLocationTriggers(currentLocation)
      },
      (error) => {
        console.warn("Location monitoring error:", error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // 1 minute
      },
    )

    this.activeLocationWatchers.set("main", watchId)
  }

  private checkLocationTriggers(currentLocation: CapsuleLocation) {
    const locationTriggers = this.triggers.filter((trigger) =>
      trigger.conditions.some((condition) => condition.type === "location"),
    ) as LocationTrigger[]

    locationTriggers.forEach((trigger) => {
      if (!trigger.isActive) return

      const locationCondition = trigger.conditions.find((c) => c.type === "location")
      if (!locationCondition) return

      const distance = this.calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        trigger.location.latitude,
        trigger.location.longitude,
      )

      const isWithinRadius = distance <= trigger.radius

      if (isWithinRadius && this.shouldTrigger(trigger)) {
        this.executeTrigger(trigger, {
          type: "location_entered",
          location: currentLocation,
          distance: distance,
        })
      }
    })
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // Date-based triggers
  private startDateMonitoring() {
    // Check date triggers every minute
    const intervalId = setInterval(() => {
      this.checkDateTriggers()
    }, 60000)

    this.activeDateWatchers.set("main", intervalId)
  }

  private checkDateTriggers() {
    const now = new Date()
    const dateTriggers = this.triggers.filter((trigger) =>
      trigger.conditions.some((condition) => condition.type === "date"),
    ) as DateTrigger[]

    dateTriggers.forEach((trigger) => {
      if (!trigger.isActive) return

      if (this.isDateTriggerReady(trigger, now) && this.shouldTrigger(trigger)) {
        this.executeTrigger(trigger, {
          type: "date_anniversary",
          date: now.toISOString(),
          triggerDate: trigger.triggerDate,
        })
      }
    })
  }

  private isDateTriggerReady(trigger: DateTrigger, currentDate: Date): boolean {
    const triggerDate = new Date(trigger.triggerDate)

    if (!trigger.isRecurring) {
      // One-time trigger
      return this.isSameDay(currentDate, triggerDate) && !trigger.lastTriggered
    }

    // Recurring trigger
    if (!trigger.recurrencePattern) return false

    const { type, interval } = trigger.recurrencePattern
    const lastTriggered = trigger.lastTriggered ? new Date(trigger.lastTriggered) : null

    switch (type) {
      case "daily":
        return !lastTriggered || this.daysDifference(lastTriggered, currentDate) >= interval

      case "weekly":
        return !lastTriggered || this.weeksDifference(lastTriggered, currentDate) >= interval

      case "monthly":
        return !lastTriggered || this.monthsDifference(lastTriggered, currentDate) >= interval

      case "yearly":
        return (
          this.isSameMonthDay(currentDate, triggerDate) &&
          (!lastTriggered || currentDate.getFullYear() > lastTriggered.getFullYear())
        )

      default:
        return false
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  private isSameMonthDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth()
  }

  private daysDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  private weeksDifference(date1: Date, date2: Date): number {
    return Math.floor(this.daysDifference(date1, date2) / 7)
  }

  private monthsDifference(date1: Date, date2: Date): number {
    return (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth())
  }

  // Trigger execution
  private shouldTrigger(trigger: MemoryTrigger): boolean {
    const now = new Date()
    const settings = trigger.settings

    // Check quiet hours
    if (settings.quietHours) {
      const currentTime = now.getHours() * 100 + now.getMinutes()
      const startTime = Number.parseInt(settings.quietHours.start.replace(":", ""))
      const endTime = Number.parseInt(settings.quietHours.end.replace(":", ""))

      if (currentTime >= startTime && currentTime <= endTime) {
        return false
      }
    }

    // Check enabled days
    if (settings.enabledDays && settings.enabledDays.length > 0) {
      const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
      const currentDay = dayNames[now.getDay()]

      if (!settings.enabledDays.includes(currentDay)) {
        return false
      }
    }

    // Check daily trigger limit
    const today = now.toDateString()
    const todayTriggers = this.getTriggerCountForDate(trigger.id, today)

    if (todayTriggers >= settings.maxTriggersPerDay) {
      return false
    }

    return true
  }

  private getTriggerCountForDate(triggerId: string, date: string): number {
    // This would typically query a database
    // For now, return 0 as a placeholder
    return 0
  }

  private async executeTrigger(trigger: MemoryTrigger, context: any) {
    try {
      // Update trigger metadata
      trigger.lastTriggered = new Date().toISOString()
      trigger.triggerCount += 1

      // Execute all actions
      for (const action of trigger.actions) {
        await this.executeAction(action, trigger, context)
      }

      // Save trigger state (would typically save to database)
      this.saveTriggerState(trigger)
    } catch (error) {
      console.error("Error executing trigger:", error)
    }
  }

  private async executeAction(action: TriggerAction, trigger: MemoryTrigger, context: any) {
    // Apply delay if specified
    if (action.delay && action.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, action.delay * 1000))
    }

    switch (action.type) {
      case "notify":
        this.sendNotification(action, trigger, context)
        break

      case "create_memory":
        this.suggestMemoryCreation(action, trigger, context)
        break

      case "unlock_capsule":
        this.unlockCapsule(action, trigger, context)
        break

      case "remind":
        this.scheduleReminder(action, trigger, context)
        break

      case "suggest_content":
        this.suggestContent(action, trigger, context)
        break

      case "play_audio":
        this.playAmbientAudio(action, trigger, context)
        break

      default:
        console.warn("Unknown action type:", action.type)
    }
  }

  private sendNotification(action: TriggerAction, trigger: MemoryTrigger, context: any) {
    const notification: TriggerNotification = {
      id: `notification_${Date.now()}`,
      triggerId: trigger.id,
      userId: trigger.userId,
      title: this.generateNotificationTitle(trigger, context),
      message: this.generateNotificationMessage(trigger, context),
      type: context.type,
      data: { trigger, context, action },
      isRead: false,
      createdAt: new Date().toISOString(),
      actions: this.generateNotificationActions(trigger, context),
    }

    // Send notification to all registered callbacks
    this.notificationCallbacks.forEach((callback) => {
      try {
        callback(notification)
      } catch (error) {
        console.error("Error in notification callback:", error)
      }
    })
  }

  private generateNotificationTitle(trigger: MemoryTrigger, context: any): string {
    switch (context.type) {
      case "location_entered":
        return `📍 Memory Trigger: ${trigger.name}`
      case "date_anniversary":
        return `📅 Anniversary: ${trigger.name}`
      default:
        return `✨ ${trigger.name}`
    }
  }

  private generateNotificationMessage(trigger: MemoryTrigger, context: any): string {
    switch (context.type) {
      case "location_entered":
        return `You're near a special place! Would you like to create a new memory or revisit old ones?`
      case "date_anniversary":
        return `Today marks a special date. Time to reflect and create new memories!`
      default:
        return trigger.description
    }
  }

  private generateNotificationActions(trigger: MemoryTrigger, context: any): NotificationAction[] {
    const actions: NotificationAction[] = [
      {
        id: "dismiss",
        label: "Dismiss",
        action: "dismiss",
      },
    ]

    if (context.type === "location_entered" || context.type === "date_anniversary") {
      actions.unshift({
        id: "create_memory",
        label: "Create Memory",
        action: "create_memory",
        data: { trigger, context },
      })
    }

    return actions
  }

  private suggestMemoryCreation(action: TriggerAction, trigger: MemoryTrigger, context: any) {
    // This would integrate with the Time Capsule creation flow
    const suggestion = {
      triggerId: trigger.id,
      suggestedTitle: this.generateMemoryTitle(trigger, context),
      suggestedMood: this.inferMoodFromTrigger(trigger, context),
      suggestedTags: trigger.metadata.tags,
      context: context,
    }

    // Emit memory creation suggestion event
    this.emitEvent("memory_suggestion", suggestion)
  }

  private generateMemoryTitle(trigger: MemoryTrigger, context: any): string {
    const now = new Date()

    switch (context.type) {
      case "location_entered":
        return `Memory at ${context.location.address || "Special Place"} - ${now.toLocaleDateString()}`
      case "date_anniversary":
        return `${trigger.name} - ${now.getFullYear()}`
      default:
        return `Memory from ${trigger.name}`
    }
  }

  private inferMoodFromTrigger(trigger: MemoryTrigger, context: any): string {
    // Simple mood inference based on trigger name and context
    const name = trigger.name.toLowerCase()

    if (name.includes("birthday") || name.includes("celebration")) return "joyful"
    if (name.includes("graduation") || name.includes("achievement")) return "excited"
    if (name.includes("anniversary") || name.includes("wedding")) return "romantic"
    if (name.includes("travel") || name.includes("adventure")) return "adventurous"
    if (name.includes("memorial") || name.includes("remember")) return "reflective"

    return "nostalgic"
  }

  private unlockCapsule(action: TriggerAction, trigger: MemoryTrigger, context: any) {
    if (action.config.capsuleId) {
      this.emitEvent("unlock_capsule", {
        capsuleId: action.config.capsuleId,
        triggerId: trigger.id,
        context: context,
      })
    }
  }

  private scheduleReminder(action: TriggerAction, trigger: MemoryTrigger, context: any) {
    const reminderTime = action.config.reminderTime || 3600000 // 1 hour default

    setTimeout(() => {
      this.sendNotification(
        {
          ...action,
          type: "notify",
        },
        trigger,
        {
          ...context,
          type: "reminder",
        },
      )
    }, reminderTime)
  }

  private suggestContent(action: TriggerAction, trigger: MemoryTrigger, context: any) {
    const suggestions = this.generateContentSuggestions(trigger, context)

    this.emitEvent("content_suggestions", {
      triggerId: trigger.id,
      suggestions: suggestions,
      context: context,
    })
  }

  private generateContentSuggestions(trigger: MemoryTrigger, context: any): string[] {
    const suggestions: string[] = []

    switch (context.type) {
      case "location_entered":
        suggestions.push(
          "Take a photo of this special place",
          "Record a voice note about your feelings here",
          "Write about what this location means to you",
        )
        break
      case "date_anniversary":
        suggestions.push(
          "Reflect on how you've grown since last year",
          "Share a favorite memory from this day",
          "Set intentions for the year ahead",
        )
        break
    }

    return suggestions
  }

  private playAmbientAudio(action: TriggerAction, trigger: MemoryTrigger, context: any) {
    if (action.config.audioUrl) {
      this.emitEvent("play_ambient_audio", {
        audioUrl: action.config.audioUrl,
        volume: action.config.volume || 0.5,
        loop: action.config.loop || false,
        triggerId: trigger.id,
      })
    }
  }

  private saveTriggerState(trigger: MemoryTrigger) {
    // This would typically save to a database
    // For now, just update the local state
    const index = this.triggers.findIndex((t) => t.id === trigger.id)
    if (index !== -1) {
      this.triggers[index] = trigger
    }
  }

  private emitEvent(eventType: string, data: any) {
    // Emit custom events that can be listened to by other parts of the app
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(`memory_trigger_${eventType}`, {
          detail: data,
        }),
      )
    }
  }

  // Public API methods
  public addTrigger(trigger: MemoryTrigger) {
    this.triggers.push(trigger)
    this.saveTriggerState(trigger)
  }

  public removeTrigger(triggerId: string) {
    this.triggers = this.triggers.filter((t) => t.id !== triggerId)
  }

  public updateTrigger(triggerId: string, updates: Partial<MemoryTrigger>) {
    const index = this.triggers.findIndex((t) => t.id === triggerId)
    if (index !== -1) {
      this.triggers[index] = { ...this.triggers[index], ...updates }
      this.saveTriggerState(this.triggers[index])
    }
  }

  public getTriggers(): MemoryTrigger[] {
    return [...this.triggers]
  }

  public getActiveTriggers(): MemoryTrigger[] {
    return this.triggers.filter((t) => t.isActive)
  }

  public onNotification(callback: (notification: TriggerNotification) => void) {
    this.notificationCallbacks.push(callback)
  }

  public removeNotificationCallback(callback: (notification: TriggerNotification) => void) {
    const index = this.notificationCallbacks.indexOf(callback)
    if (index !== -1) {
      this.notificationCallbacks.splice(index, 1)
    }
  }

  public cleanup() {
    // Stop all location watchers
    this.activeLocationWatchers.forEach((watchId) => {
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId)
      }
    })
    this.activeLocationWatchers.clear()

    // Stop all date watchers
    this.activeDateWatchers.forEach((intervalId) => {
      clearInterval(intervalId)
    })
    this.activeDateWatchers.clear()

    // Clear callbacks
    this.notificationCallbacks = []
  }
}

// Singleton instance
export const memoryTriggerEngine = new MemoryTriggerEngine()
