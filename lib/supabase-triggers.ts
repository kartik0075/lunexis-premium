"use client"

import { createClient } from "@supabase/supabase-js"
import type { MemoryTrigger, TriggerNotification } from "../types/time-capsule"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export class SupabaseTriggerService {
  // Memory Triggers CRUD operations
  async getTriggers(userId: string): Promise<MemoryTrigger[]> {
    const { data, error } = await supabase
      .from("memory_triggers")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching triggers:", error)
      throw error
    }

    return data || []
  }

  async createTrigger(trigger: Partial<MemoryTrigger>): Promise<MemoryTrigger> {
    const { data, error } = await supabase
      .from("memory_triggers")
      .insert([
        {
          user_id: trigger.userId,
          name: trigger.name,
          description: trigger.description,
          conditions: trigger.conditions,
          actions: trigger.actions,
          is_active: trigger.isActive,
          settings: trigger.settings,
          metadata: trigger.metadata,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating trigger:", error)
      throw error
    }

    return data
  }

  async updateTrigger(triggerId: string, updates: Partial<MemoryTrigger>): Promise<MemoryTrigger> {
    const { data, error } = await supabase
      .from("memory_triggers")
      .update({
        name: updates.name,
        description: updates.description,
        conditions: updates.conditions,
        actions: updates.actions,
        is_active: updates.isActive,
        settings: updates.settings,
        metadata: updates.metadata,
        last_triggered: updates.lastTriggered,
        trigger_count: updates.triggerCount,
      })
      .eq("id", triggerId)
      .select()
      .single()

    if (error) {
      console.error("Error updating trigger:", error)
      throw error
    }

    return data
  }

  async deleteTrigger(triggerId: string): Promise<void> {
    const { error } = await supabase.from("memory_triggers").delete().eq("id", triggerId)

    if (error) {
      console.error("Error deleting trigger:", error)
      throw error
    }
  }

  // Trigger Notifications CRUD operations
  async getNotifications(userId: string): Promise<TriggerNotification[]> {
    const { data, error } = await supabase
      .from("trigger_notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error fetching notifications:", error)
      throw error
    }

    return data || []
  }

  async createNotification(notification: Partial<TriggerNotification>): Promise<TriggerNotification> {
    const { data, error } = await supabase
      .from("trigger_notifications")
      .insert([
        {
          trigger_id: notification.triggerId,
          user_id: notification.userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          data: notification.data,
          is_read: notification.isRead || false,
          actions: notification.actions,
          expires_at: notification.expiresAt,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating notification:", error)
      throw error
    }

    return data
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    const { error } = await supabase.from("trigger_notifications").update({ is_read: true }).eq("id", notificationId)

    if (error) {
      console.error("Error marking notification as read:", error)
      throw error
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase.from("trigger_notifications").delete().eq("id", notificationId)

    if (error) {
      console.error("Error deleting notification:", error)
      throw error
    }
  }

  // Location-based trigger helpers
  async findNearbyTriggers(latitude: number, longitude: number, radius = 1000): Promise<MemoryTrigger[]> {
    // This would use PostGIS functions in a real implementation
    // For now, we'll fetch all location triggers and filter client-side
    const { data, error } = await supabase
      .from("memory_triggers")
      .select("*")
      .contains("conditions", [{ type: "location" }])
      .eq("is_active", true)

    if (error) {
      console.error("Error fetching nearby triggers:", error)
      throw error
    }

    // Filter by distance (simplified calculation)
    return (data || []).filter((trigger) => {
      const locationCondition = trigger.conditions.find((c: any) => c.type === "location")
      if (!locationCondition) return false

      const distance = this.calculateDistance(
        latitude,
        longitude,
        locationCondition.value.latitude,
        locationCondition.value.longitude,
      )

      return distance <= radius
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

  // Analytics and reporting
  async getTriggerAnalytics(userId: string): Promise<any> {
    const { data, error } = await supabase.rpc("get_trigger_analytics", { user_id: userId })

    if (error) {
      console.error("Error fetching trigger analytics:", error)
      throw error
    }

    return data
  }

  // Real-time subscriptions
  subscribeTriggerChanges(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel("memory_triggers")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "memory_triggers",
          filter: `user_id=eq.${userId}`,
        },
        callback,
      )
      .subscribe()
  }

  subscribeNotificationChanges(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel("trigger_notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trigger_notifications",
          filter: `user_id=eq.${userId}`,
        },
        callback,
      )
      .subscribe()
  }
}

export const supabaseTriggerService = new SupabaseTriggerService()
