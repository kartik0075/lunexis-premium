"use client"

export interface GeolocationPosition {
  latitude: number
  longitude: number
  accuracy: number
  altitude?: number
  altitudeAccuracy?: number
  heading?: number
  speed?: number
  timestamp: number
}

export interface GeofenceRegion {
  id: string
  latitude: number
  longitude: number
  radius: number
  name?: string
}

export interface LocationUpdate {
  position: GeolocationPosition
  triggeredRegions: GeofenceRegion[]
  timestamp: number
}

export class GeolocationService {
  private watchId: number | null = null
  private geofences: GeofenceRegion[] = []
  private callbacks: ((update: LocationUpdate) => void)[] = []
  private lastPosition: GeolocationPosition | null = null
  private isTracking = false

  // Start location tracking
  async startTracking(options?: PositionOptions): Promise<void> {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by this browser")
    }

    if (this.isTracking) {
      return
    }

    // Request permission first
    const permission = await this.requestPermission()
    if (permission !== "granted") {
      throw new Error("Location permission denied")
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
      ...options,
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const geoPosition: GeolocationPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
          heading: position.coords.heading || undefined,
          speed: position.coords.speed || undefined,
          timestamp: position.timestamp,
        }

        this.handleLocationUpdate(geoPosition)
      },
      (error) => {
        console.error("Geolocation error:", error)
        this.handleLocationError(error)
      },
      defaultOptions,
    )

    this.isTracking = true
  }

  // Stop location tracking
  stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
    this.isTracking = false
  }

  // Get current position once
  async getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by this browser")
    }

    const permission = await this.requestPermission()
    if (permission !== "granted") {
      throw new Error("Location permission denied")
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const geoPosition: GeolocationPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined,
            timestamp: position.timestamp,
          }
          resolve(geoPosition)
        },
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
          ...options,
        },
      )
    })
  }

  // Request location permission
  private async requestPermission(): Promise<PermissionState> {
    if ("permissions" in navigator) {
      const permission = await navigator.permissions.query({ name: "geolocation" })
      return permission.state
    }
    return "granted" // Fallback for browsers without permissions API
  }

  // Add geofence region
  addGeofence(region: GeofenceRegion): void {
    this.geofences.push(region)
  }

  // Remove geofence region
  removeGeofence(regionId: string): void {
    this.geofences = this.geofences.filter((region) => region.id !== regionId)
  }

  // Clear all geofences
  clearGeofences(): void {
    this.geofences = []
  }

  // Get all geofences
  getGeofences(): GeofenceRegion[] {
    return [...this.geofences]
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // Check if position is within geofence
  private isWithinGeofence(position: GeolocationPosition, region: GeofenceRegion): boolean {
    const distance = this.calculateDistance(position.latitude, position.longitude, region.latitude, region.longitude)
    return distance <= region.radius
  }

  // Handle location updates
  private handleLocationUpdate(position: GeolocationPosition): void {
    const triggeredRegions: GeofenceRegion[] = []

    // Check which geofences are triggered
    for (const region of this.geofences) {
      if (this.isWithinGeofence(position, region)) {
        triggeredRegions.push(region)
      }
    }

    const update: LocationUpdate = {
      position,
      triggeredRegions,
      timestamp: Date.now(),
    }

    this.lastPosition = position

    // Notify all callbacks
    this.callbacks.forEach((callback) => {
      try {
        callback(update)
      } catch (error) {
        console.error("Error in location callback:", error)
      }
    })
  }

  // Handle location errors
  private handleLocationError(error: GeolocationPositionError): void {
    let message = "Unknown location error"

    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "Location access denied by user"
        break
      case error.POSITION_UNAVAILABLE:
        message = "Location information unavailable"
        break
      case error.TIMEOUT:
        message = "Location request timed out"
        break
    }

    console.error("Geolocation error:", message)
  }

  // Subscribe to location updates
  onLocationUpdate(callback: (update: LocationUpdate) => void): () => void {
    this.callbacks.push(callback)

    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback)
      if (index !== -1) {
        this.callbacks.splice(index, 1)
      }
    }
  }

  // Get last known position
  getLastPosition(): GeolocationPosition | null {
    return this.lastPosition
  }

  // Check if tracking is active
  isTrackingActive(): boolean {
    return this.isTracking
  }

  // Reverse geocoding (get address from coordinates)
  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      // Using a free geocoding service (you might want to use Google Maps API or similar)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
      )

      if (!response.ok) {
        throw new Error("Geocoding request failed")
      }

      const data = await response.json()
      return data.display_name || data.locality || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    } catch (error) {
      console.error("Reverse geocoding error:", error)
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    }
  }

  // Forward geocoding (get coordinates from address)
  async geocode(address: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      // Using a free geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      )

      if (!response.ok) {
        throw new Error("Geocoding request failed")
      }

      const data = await response.json()
      if (data.length > 0) {
        return {
          latitude: Number.parseFloat(data[0].lat),
          longitude: Number.parseFloat(data[0].lon),
        }
      }

      return null
    } catch (error) {
      console.error("Geocoding error:", error)
      return null
    }
  }

  // Get nearby places (POI)
  async getNearbyPlaces(latitude: number, longitude: number, radius = 1000): Promise<any[]> {
    try {
      // This would typically use Google Places API or similar
      // For demo purposes, returning mock data
      return [
        {
          id: "1",
          name: "Coffee Shop",
          type: "cafe",
          distance: 150,
          latitude: latitude + 0.001,
          longitude: longitude + 0.001,
        },
        {
          id: "2",
          name: "Park",
          type: "park",
          distance: 300,
          latitude: latitude - 0.002,
          longitude: longitude + 0.001,
        },
      ]
    } catch (error) {
      console.error("Error fetching nearby places:", error)
      return []
    }
  }
}

export const geolocationService = new GeolocationService()
