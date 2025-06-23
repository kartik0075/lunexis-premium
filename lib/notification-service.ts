"use client"

export interface NotificationOptions {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  tag?: string
  data?: any
  actions?: NotificationAction[]
  requireInteraction?: boolean
  silent?: boolean
  vibrate?: number[]
}

export interface NotificationAction {
  action: string
  title: string
  icon?: string
}

export interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export class NotificationService {
  private registration: ServiceWorkerRegistration | null = null
  private subscription: globalThis.PushSubscription | null = null

  // Initialize service worker and notifications
  async initialize(): Promise<void> {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service Worker not supported")
    }

    if (!("Notification" in window)) {
      throw new Error("Notifications not supported")
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register("/sw.js")
      console.log("Service Worker registered:", this.registration)

      // Request notification permission
      await this.requestPermission()

      // Set up push subscription
      await this.setupPushSubscription()
    } catch (error) {
      console.error("Failed to initialize notifications:", error)
      throw error
    }
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      throw new Error("Notifications not supported")
    }

    let permission = Notification.permission

    if (permission === "default") {
      permission = await Notification.requestPermission()
    }

    if (permission !== "granted") {
      throw new Error("Notification permission denied")
    }

    return permission
  }

  // Show local notification
  async showNotification(options: NotificationOptions): Promise<void> {
    if (!this.registration) {
      throw new Error("Service Worker not registered")
    }

    const permission = await this.requestPermission()
    if (permission !== "granted") {
      throw new Error("Notification permission denied")
    }

    const notificationOptions: globalThis.NotificationOptions = {
      body: options.body,
      icon: options.icon || "/icons/icon-192x192.png",
      badge: options.badge || "/icons/badge-72x72.png",
      image: options.image,
      tag: options.tag,
      data: options.data,
      actions: options.actions,
      requireInteraction: options.requireInteraction,
      silent: options.silent,
      vibrate: options.vibrate || [200, 100, 200],
    }

    await this.registration.showNotification(options.title, notificationOptions)
  }

  // Setup push subscription
  private async setupPushSubscription(): Promise<void> {
    if (!this.registration) {
      throw new Error("Service Worker not registered")
    }

    try {
      // Check if already subscribed
      this.subscription = await this.registration.pushManager.getSubscription()

      if (!this.subscription) {
        // Create new subscription
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!vapidPublicKey) {
          console.warn("VAPID public key not configured")
          return
        }

        this.subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey),
        })

        // Send subscription to server
        await this.sendSubscriptionToServer(this.subscription)
      }
    } catch (error) {
      console.error("Failed to setup push subscription:", error)
    }
  }

  // Convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Send subscription to server
  private async sendSubscriptionToServer(subscription: globalThis.PushSubscription): Promise<void> {
    try {
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: this.arrayBufferToBase64(subscription.getKey("p256dh")!),
              auth: this.arrayBufferToBase64(subscription.getKey("auth")!),
            },
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send subscription to server")
      }
    } catch (error) {
      console.error("Error sending subscription to server:", error)
    }
  }

  // Convert ArrayBuffer to base64
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ""
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }

  // Unsubscribe from push notifications
  async unsubscribe(): Promise<void> {
    if (this.subscription) {
      await this.subscription.unsubscribe()
      this.subscription = null

      // Notify server
      try {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
      } catch (error) {
        console.error("Error notifying server of unsubscription:", error)
      }
    }
  }

  // Get current subscription
  getSubscription(): globalThis.PushSubscription | null {
    return this.subscription
  }

  // Check if notifications are supported and enabled
  isSupported(): boolean {
    return "serviceWorker" in navigator && "Notification" in window && "PushManager" in window
  }

  // Check notification permission status
  getPermissionStatus(): NotificationPermission {
    return Notification.permission
  }

  // Show memory trigger notification
  async showMemoryTriggerNotification(triggerName: string, location?: string): Promise<void> {
    await this.showNotification({
      title: "✨ Memory Trigger Activated",
      body: `${triggerName}${location ? ` at ${location}` : ""}. Tap to create a memory!`,
      icon: "/icons/memory-trigger.png",
      tag: "memory-trigger",
      data: { type: "memory_trigger", triggerName, location },
      actions: [
        { action: "create", title: "Create Memory", icon: "/icons/create.png" },
        { action: "dismiss", title: "Dismiss", icon: "/icons/dismiss.png" },
      ],
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200],
    })
  }

  // Show chat message notification
  async showChatNotification(senderName: string, message: string, chatId: string): Promise<void> {
    await this.showNotification({
      title: `💬 ${senderName}`,
      body: message,
      icon: "/icons/chat.png",
      tag: `chat-${chatId}`,
      data: { type: "chat_message", chatId, senderName },
      actions: [
        { action: "reply", title: "Reply", icon: "/icons/reply.png" },
        { action: "view", title: "View Chat", icon: "/icons/view.png" },
      ],
    })
  }

  // Show time capsule unlock notification
  async showCapsuleUnlockNotification(capsuleTitle: string, capsuleId: string): Promise<void> {
    await this.showNotification({
      title: "🔓 Time Capsule Unlocked!",
      body: `"${capsuleTitle}" is now available to view`,
      icon: "/icons/time-capsule.png",
      tag: `capsule-${capsuleId}`,
      data: { type: "capsule_unlock", capsuleId, capsuleTitle },
      actions: [
        { action: "view", title: "View Capsule", icon: "/icons/view.png" },
        { action: "share", title: "Share", icon: "/icons/share.png" },
      ],
      requireInteraction: true,
      vibrate: [300, 100, 300, 100, 300],
    })
  }

  // Show live stream notification
  async showLiveStreamNotification(streamerName: string, streamTitle: string, streamId: string): Promise<void> {
    await this.showNotification({
      title: `🔴 ${streamerName} is live!`,
      body: streamTitle,
      icon: "/icons/live-stream.png",
      tag: `stream-${streamId}`,
      data: { type: "live_stream", streamId, streamerName },
      actions: [
        { action: "watch", title: "Watch Now", icon: "/icons/play.png" },
        { action: "later", title: "Watch Later", icon: "/icons/bookmark.png" },
      ],
    })
  }
}

export const notificationService = new NotificationService()
