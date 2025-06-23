"use client"

import { useState, useEffect, useCallback } from "react"
import type { MemoryTrigger, TriggerNotification } from "../types/time-capsule"
import { memoryTriggerEngine } from "../lib/memory-trigger-engine"

export function useMemoryTriggers() {
  const [triggers, setTriggers] = useState<MemoryTrigger[]>([])
  const [notifications, setNotifications] = useState<TriggerNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load triggers from storage/database
  const loadTriggers = useCallback(async () => {
    try {
      setIsLoading(true)
      // In a real app, this would fetch from Supabase
      const storedTriggers = localStorage.getItem("lunexis_memory_triggers")
      if (storedTriggers) {
        const parsedTriggers = JSON.parse(storedTriggers)
        setTriggers(parsedTriggers)

        // Add triggers to the engine
        parsedTriggers.forEach((trigger: MemoryTrigger) => {
          memoryTriggerEngine.addTrigger(trigger)
        })
      }
    } catch (err) {
      setError("Failed to load memory triggers")
      console.error("Error loading triggers:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save triggers to storage/database
  const saveTriggers = useCallback(async (updatedTriggers: MemoryTrigger[]) => {
    try {
      // In a real app, this would save to Supabase
      localStorage.setItem("lunexis_memory_triggers", JSON.stringify(updatedTriggers))
      setTriggers(updatedTriggers)
    } catch (err) {
      setError("Failed to save memory triggers")
      console.error("Error saving triggers:", err)
    }
  }, [])

  // Create a new trigger
  const createTrigger = useCallback(
    async (triggerData: Partial<MemoryTrigger>) => {
      try {
        const newTrigger: MemoryTrigger = {
          id: `trigger_${Date.now()}`,
          userId: "current_user", // Would come from auth context
          triggerCount: 0,
          createdAt: new Date().toISOString(),
          ...triggerData,
        } as MemoryTrigger

        const updatedTriggers = [...triggers, newTrigger]
        await saveTriggers(updatedTriggers)

        // Add to engine
        memoryTriggerEngine.addTrigger(newTrigger)

        return newTrigger
      } catch (err) {
        setError("Failed to create memory trigger")
        throw err
      }
    },
    [triggers, saveTriggers],
  )

  // Update an existing trigger
  const updateTrigger = useCallback(
    async (triggerId: string, updates: Partial<MemoryTrigger>) => {
      try {
        const updatedTriggers = triggers.map((trigger) =>
          trigger.id === triggerId
            ? { ...trigger, ...updates, metadata: { ...trigger.metadata, lastModified: new Date().toISOString() } }
            : trigger,
        )

        await saveTriggers(updatedTriggers)

        // Update in engine
        memoryTriggerEngine.updateTrigger(triggerId, updates)

        return updatedTriggers.find((t) => t.id === triggerId)
      } catch (err) {
        setError("Failed to update memory trigger")
        throw err
      }
    },
    [triggers, saveTriggers],
  )

  // Delete a trigger
  const deleteTrigger = useCallback(
    async (triggerId: string) => {
      try {
        const updatedTriggers = triggers.filter((trigger) => trigger.id !== triggerId)
        await saveTriggers(updatedTriggers)

        // Remove from engine
        memoryTriggerEngine.removeTrigger(triggerId)
      } catch (err) {
        setError("Failed to delete memory trigger")
        throw err
      }
    },
    [triggers, saveTriggers],
  )

  // Toggle trigger active state
  const toggleTrigger = useCallback(
    async (triggerId: string) => {
      const trigger = triggers.find((t) => t.id === triggerId)
      if (trigger) {
        await updateTrigger(triggerId, { isActive: !trigger.isActive })
      }
    },
    [triggers, updateTrigger],
  )

  // Handle notifications from the trigger engine
  const handleNotification = useCallback((notification: TriggerNotification) => {
    setNotifications((prev) => [notification, ...prev])

    // Store notifications in localStorage
    const storedNotifications = localStorage.getItem("lunexis_trigger_notifications")
    const existingNotifications = storedNotifications ? JSON.parse(storedNotifications) : []
    const updatedNotifications = [notification, ...existingNotifications].slice(0, 50) // Keep last 50
    localStorage.setItem("lunexis_trigger_notifications", JSON.stringify(updatedNotifications))
  }, [])

  // Mark notification as read
  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    )
  }, [])

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([])
    localStorage.removeItem("lunexis_trigger_notifications")
  }, [])

  // Get trigger statistics
  const getTriggerStats = useCallback(() => {
    const totalTriggers = triggers.length
    const activeTriggers = triggers.filter((t) => t.isActive).length
    const totalActivations = triggers.reduce((sum, trigger) => sum + trigger.triggerCount, 0)
    const averageSuccessRate =
      triggers.length > 0
        ? triggers.reduce((sum, trigger) => sum + trigger.metadata.successRate, 0) / triggers.length
        : 0

    const triggersByType = triggers.reduce(
      (acc, trigger) => {
        trigger.conditions.forEach((condition) => {
          acc[condition.type] = (acc[condition.type] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalTriggers,
      activeTriggers,
      totalActivations,
      averageSuccessRate,
      triggersByType,
      unreadNotifications: notifications.filter((n) => !n.isRead).length,
    }
  }, [triggers, notifications])

  // Initialize
  useEffect(() => {
    loadTriggers()

    // Load stored notifications
    const storedNotifications = localStorage.getItem("lunexis_trigger_notifications")
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications))
    }

    // Set up notification listener
    memoryTriggerEngine.onNotification(handleNotification)

    // Set up event listeners for trigger engine events
    const handleMemorySuggestion = (event: CustomEvent) => {
      // Handle memory creation suggestions
      console.log("Memory suggestion:", event.detail)
    }

    const handleCapsuleUnlock = (event: CustomEvent) => {
      // Handle capsule unlock events
      console.log("Capsule unlock:", event.detail)
    }

    const handleContentSuggestions = (event: CustomEvent) => {
      // Handle content suggestions
      console.log("Content suggestions:", event.detail)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("memory_trigger_memory_suggestion", handleMemorySuggestion as EventListener)
      window.addEventListener("memory_trigger_unlock_capsule", handleCapsuleUnlock as EventListener)
      window.addEventListener("memory_trigger_content_suggestions", handleContentSuggestions as EventListener)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("memory_trigger_memory_suggestion", handleMemorySuggestion as EventListener)
        window.removeEventListener("memory_trigger_unlock_capsule", handleCapsuleUnlock as EventListener)
        window.removeEventListener("memory_trigger_content_suggestions", handleContentSuggestions as EventListener)
      }
      memoryTriggerEngine.removeNotificationCallback(handleNotification)
    }
  }, [loadTriggers, handleNotification])

  return {
    triggers,
    notifications,
    isLoading,
    error,
    createTrigger,
    updateTrigger,
    deleteTrigger,
    toggleTrigger,
    markNotificationRead,
    clearNotifications,
    getTriggerStats,
    refreshTriggers: loadTriggers,
  }
}
