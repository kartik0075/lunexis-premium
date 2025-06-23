"use client"

import { useEffect, useRef, useState } from "react"
import type { UserMoodStatus, AmbientEffect, ParticleConfig } from "../../types/ambient-mood"

interface AmbientEffectsProps {
  moodStatus: UserMoodStatus
  isActive: boolean
}

interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  shape: string
  opacity: number
  life: number
  maxLife: number
}

export function AmbientEffects({ moodStatus, isActive }: AmbientEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    if (!isActive || !moodStatus.ambientSettings.enableEffects) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Initialize particles
    if (moodStatus.ambientSettings.enableParticles && moodStatus.currentMood.particles) {
      initializeParticles(moodStatus.currentMood.particles)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Render background effects
      renderBackgroundEffects(ctx, moodStatus)

      // Render particles
      if (moodStatus.ambientSettings.enableParticles) {
        updateAndRenderParticles(ctx)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [moodStatus, isActive, dimensions])

  const initializeParticles = (config: ParticleConfig) => {
    const particles: Particle[] = []
    const count = Math.floor(config.count * (moodStatus.ambientSettings.particleCount / 100))

    for (let i = 0; i < count; i++) {
      particles.push(createParticle(config))
    }

    particlesRef.current = particles
  }

  const createParticle = (config: ParticleConfig): Particle => {
    const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)]
    const color = config.colors[Math.floor(Math.random() * config.colors.length)]
    const size = config.size.min + Math.random() * (config.size.max - config.size.min)
    const speed = config.speed.min + Math.random() * (config.speed.max - config.speed.min)

    return {
      id: Math.random().toString(36),
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size,
      color,
      shape,
      opacity: 0.3 + Math.random() * 0.7,
      life: 0,
      maxLife: 300 + Math.random() * 200,
    }
  }

  const updateAndRenderParticles = (ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current
    const config = moodStatus.currentMood.particles

    if (!config) return

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]

      // Update particle position based on behavior
      switch (config.behavior) {
        case "float":
          particle.y -= particle.vy
          particle.x += Math.sin(particle.life * 0.01) * 0.5
          break
        case "orbit":
          const centerX = dimensions.width / 2
          const centerY = dimensions.height / 2
          const angle = particle.life * 0.02
          const radius = 100 + particle.size * 10
          particle.x = centerX + Math.cos(angle) * radius
          particle.y = centerY + Math.sin(angle) * radius
          break
        case "cascade":
          particle.y += particle.vy
          particle.x += particle.vx
          break
        case "dance":
          particle.x += Math.sin(particle.life * 0.05) * particle.vx
          particle.y += Math.cos(particle.life * 0.03) * particle.vy
          break
      }

      // Update life
      particle.life++

      // Wrap around screen edges
      if (particle.x < 0) particle.x = dimensions.width
      if (particle.x > dimensions.width) particle.x = 0
      if (particle.y < 0) particle.y = dimensions.height
      if (particle.y > dimensions.height) particle.y = 0

      // Remove dead particles
      if (particle.life > particle.maxLife) {
        particles.splice(i, 1)
        particles.push(createParticle(config))
        continue
      }

      // Render particle
      renderParticle(ctx, particle)
    }
  }

  const renderParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save()
    ctx.globalAlpha = particle.opacity * (moodStatus.ambientSettings.effectIntensity / 10)
    ctx.fillStyle = particle.color

    ctx.translate(particle.x, particle.y)

    switch (particle.shape) {
      case "circle":
        ctx.beginPath()
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
        ctx.fill()
        break
      case "star":
        renderStar(ctx, particle.size)
        break
      case "diamond":
        renderDiamond(ctx, particle.size)
        break
      case "heart":
        renderHeart(ctx, particle.size)
        break
    }

    ctx.restore()
  }

  const renderStar = (ctx: CanvasRenderingContext2D, size: number) => {
    const spikes = 5
    const outerRadius = size
    const innerRadius = size * 0.5

    ctx.beginPath()
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (i * Math.PI) / spikes
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()
  }

  const renderDiamond = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.beginPath()
    ctx.moveTo(0, -size)
    ctx.lineTo(size, 0)
    ctx.lineTo(0, size)
    ctx.lineTo(-size, 0)
    ctx.closePath()
    ctx.fill()
  }

  const renderHeart = (ctx: CanvasRenderingContext2D, size: number) => {
    const scale = size / 10
    ctx.beginPath()
    ctx.moveTo(0, 3 * scale)
    ctx.bezierCurveTo(-5 * scale, -2 * scale, -10 * scale, 1 * scale, 0, 8 * scale)
    ctx.bezierCurveTo(10 * scale, 1 * scale, 5 * scale, -2 * scale, 0, 3 * scale)
    ctx.fill()
  }

  const renderBackgroundEffects = (ctx: CanvasRenderingContext2D, moodStatus: UserMoodStatus) => {
    const effects = moodStatus.currentMood.effects
    const intensity = moodStatus.ambientSettings.effectIntensity / 10

    effects.forEach((effect) => {
      switch (effect.type) {
        case "gradient":
          renderGradientEffect(ctx, effect, intensity)
          break
        case "glow":
          renderGlowEffect(ctx, effect, intensity)
          break
        case "pulse":
          renderPulseEffect(ctx, effect, intensity)
          break
        case "wave":
          renderWaveEffect(ctx, effect, intensity)
          break
      }
    })
  }

  const renderGradientEffect = (ctx: CanvasRenderingContext2D, effect: AmbientEffect, intensity: number) => {
    const gradient = ctx.createLinearGradient(0, 0, dimensions.width, dimensions.height)
    effect.config.colors.forEach((color, index) => {
      gradient.addColorStop(index / (effect.config.colors.length - 1), color)
    })

    ctx.save()
    ctx.globalAlpha = 0.1 * intensity
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, dimensions.width, dimensions.height)
    ctx.restore()
  }

  const renderGlowEffect = (ctx: CanvasRenderingContext2D, effect: AmbientEffect, intensity: number) => {
    const time = Date.now() * 0.001
    const centerX = dimensions.width / 2
    const centerY = dimensions.height / 2
    const radius = 200 + Math.sin(time) * 50

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    effect.config.colors.forEach((color, index) => {
      gradient.addColorStop(index / (effect.config.colors.length - 1), color + "20")
    })

    ctx.save()
    ctx.globalAlpha = 0.3 * intensity
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, dimensions.width, dimensions.height)
    ctx.restore()
  }

  const renderPulseEffect = (ctx: CanvasRenderingContext2D, effect: AmbientEffect, intensity: number) => {
    const time = Date.now() * 0.003
    const pulse = (Math.sin(time) + 1) / 2

    ctx.save()
    ctx.globalAlpha = 0.1 * intensity * pulse
    ctx.fillStyle = effect.config.colors[0]
    ctx.fillRect(0, 0, dimensions.width, dimensions.height)
    ctx.restore()
  }

  const renderWaveEffect = (ctx: CanvasRenderingContext2D, effect: AmbientEffect, intensity: number) => {
    const time = Date.now() * 0.002
    const waveHeight = 50
    const frequency = 0.01

    ctx.save()
    ctx.globalAlpha = 0.2 * intensity

    for (let x = 0; x < dimensions.width; x += 10) {
      const y = dimensions.height / 2 + Math.sin(x * frequency + time) * waveHeight
      const gradient = ctx.createLinearGradient(x, y - waveHeight, x, y + waveHeight)

      effect.config.colors.forEach((color, index) => {
        gradient.addColorStop(index / (effect.config.colors.length - 1), color + "40")
      })

      ctx.fillStyle = gradient
      ctx.fillRect(x, y - waveHeight, 10, waveHeight * 2)
    }

    ctx.restore()
  }

  if (!isActive || !moodStatus.ambientSettings.enableEffects) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        mixBlendMode: "screen",
        opacity: moodStatus.ambientSettings.effectIntensity / 10,
      }}
    />
  )
}
