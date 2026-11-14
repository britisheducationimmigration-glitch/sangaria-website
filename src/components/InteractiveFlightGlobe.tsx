import { useEffect, useRef, useState } from 'react'

export interface FlightDestination {
  slug: string
  code: string
  city: string
  country: string
  lat: number
  lng: number
  color: string
}

export const FLIGHT_DESTINATIONS: FlightDestination[] = [
  { slug: 'canada', code: 'YYZ', city: 'Toronto', country: 'Canada', lat: 43.65, lng: -79.38, color: '#fb7185' },
  { slug: 'uk', code: 'LHR', city: 'London', country: 'UK', lat: 51.5, lng: -0.12, color: '#38bdf8' },
  { slug: 'australia', code: 'MEL', city: 'Melbourne', country: 'Australia', lat: -37.81, lng: 144.96, color: '#fbbf24' },
  { slug: 'usa', code: 'JFK', city: 'New York', country: 'USA', lat: 40.71, lng: -74.0, color: '#a78bfa' },
  { slug: 'germany', code: 'BER', city: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.4, color: '#34d399' },
  { slug: 'new-zealand', code: 'AKL', city: 'Auckland', country: 'New Zealand', lat: -36.85, lng: 174.76, color: '#f472b6' },
  { slug: 'europe', code: 'CDG', city: 'Paris', country: 'Europe', lat: 48.85, lng: 2.35, color: '#22d3ee' },
]

// Sangaria, Rajasthan coordinates
const SANGARIA = { code: 'SNG', city: 'Sangaria', lat: 29.7985, lng: 74.4642 }

function project3D(lat: number, lng: number, rotY: number, rotX: number, radius: number, cx: number, cy: number) {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lng + rotY) * Math.PI) / 180

  const x0 = radius * Math.sin(phi) * Math.cos(theta)
  const y0 = radius * Math.cos(phi)
  const z0 = radius * Math.sin(phi) * Math.sin(theta)

  const tilt = (rotX * Math.PI) / 180
  const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt)
  const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt)

  return {
    x: cx + x0,
    y: cy - y,
    z,
    visible: z > -radius * 0.18,
  }
}

export function InteractiveFlightGlobe({
  selectedCountry = 'canada',
  className = '',
}: {
  selectedCountry?: string
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId = 0
    let rotY = -55
    let tick = 0
    let isVisible = false
    let isIntersecting = false
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = parent.clientWidth || 480
      const h = parent.clientHeight || 480
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      const parent = canvas.parentElement
      const w = parent?.clientWidth || 480
      const h = parent?.clientHeight || 480
      ctx.clearRect(0, 0, w, h)

      const cx = w * 0.5
      const cy = h * 0.52
      const radius = Math.min(w, h) * 0.42
      const rotX = 18

      // Outer atmospheric glow
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.65, cx, cy, radius * 1.28)
      glow.addColorStop(0, 'rgba(43, 97, 153, 0.26)')
      glow.addColorStop(0.6, 'rgba(225, 29, 72, 0.10)')
      glow.addColorStop(1, 'rgba(7, 17, 32, 0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 1.28, 0, Math.PI * 2)
      ctx.fill()

      // Globe sphere base
      const sphereGrad = ctx.createRadialGradient(
        cx - radius * 0.3,
        cy - radius * 0.3,
        radius * 0.1,
        cx,
        cy,
        radius,
      )
      sphereGrad.addColorStop(0, 'rgba(22, 50, 86, 0.55)')
      sphereGrad.addColorStop(0.75, 'rgba(13, 31, 56, 0.72)')
      sphereGrad.addColorStop(1, 'rgba(7, 17, 32, 0.9)')
      ctx.fillStyle = sphereGrad
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fill()

      // Subtle rim border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.stroke()

      // Latitude / Longitude dot matrix
      for (let lat = -60; lat <= 75; lat += 15) {
        const lngStep = lat === 0 ? 10 : 14
        for (let lng = -180; lng < 180; lng += lngStep) {
          const p = project3D(lat, lng, rotY, rotX, radius, cx, cy)
          if (p.z > 0) {
            const alpha = Math.min(0.45, (p.z / radius) * 0.42)
            ctx.fillStyle = `rgba(228, 236, 247, ${alpha.toFixed(2)})`
            ctx.beginPath()
            ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // Project Sangaria origin
      const originPt = project3D(SANGARIA.lat, SANGARIA.lng, rotY, rotX, radius, cx, cy)

      // Draw flight arcs from Sangaria to all destinations
      FLIGHT_DESTINATIONS.forEach((dest, idx) => {
        const destPt = project3D(dest.lat, dest.lng, rotY, rotX, radius, cx, cy)
        if (!originPt.visible && !destPt.visible) return

        const isHighlighted = selectedCountry === dest.slug || (!selectedCountry && idx === 0)
        const midX = (originPt.x + destPt.x) * 0.5
        const midY = (originPt.y + destPt.y) * 0.5
        const dist = Math.hypot(destPt.x - originPt.x, destPt.y - originPt.y)
        const ctrlX = midX
        const ctrlY = midY - Math.max(28, dist * 0.42)

        // Flight path arc
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(originPt.x, originPt.y)
        ctx.quadraticCurveTo(ctrlX, ctrlY, destPt.x, destPt.y)
        ctx.strokeStyle = isHighlighted ? dest.color : 'rgba(255, 255, 255, 0.22)'
        ctx.lineWidth = isHighlighted ? 2.2 : 1.15
        ctx.setLineDash([4, 4])
        ctx.stroke()
        ctx.restore()

        // Animated flight pulse moving along the quadratic curve
        const t = ((tick * 0.0065 + idx * 0.17) % 1)
        const px = (1 - t) * (1 - t) * originPt.x + 2 * (1 - t) * t * ctrlX + t * t * destPt.x
        const py = (1 - t) * (1 - t) * originPt.y + 2 * (1 - t) * t * ctrlY + t * t * destPt.y

        ctx.fillStyle = isHighlighted ? '#ffffff' : dest.color
        ctx.beginPath()
        ctx.arc(px, py, isHighlighted ? 3.2 : 2.1, 0, Math.PI * 2)
        ctx.fill()

        // Destination beacon
        if (destPt.visible) {
          ctx.fillStyle = dest.color
          ctx.beginPath()
          ctx.arc(destPt.x, destPt.y, isHighlighted ? 4.2 : 2.8, 0, Math.PI * 2)
          ctx.fill()

          if (isHighlighted) {
            ctx.strokeStyle = dest.color
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.arc(destPt.x, destPt.y, 7 + Math.sin(tick * 0.08) * 2.5, 0, Math.PI * 2)
            ctx.stroke()

            ctx.font = '700 10px "JetBrains Mono", monospace'
            ctx.fillStyle = '#ffffff'
            ctx.fillText(`${dest.code} · ${dest.city}`, destPt.x + 8, destPt.y + 3)
          }
        }
      })

      // Draw Sangaria Origin Hub Beacon
      if (originPt.visible) {
        ctx.fillStyle = '#e11d48'
        ctx.beginPath()
        ctx.arc(originPt.x, originPt.y, 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = 'rgba(251, 113, 133, 0.85)'
        ctx.lineWidth = 1.8
        ctx.beginPath()
        ctx.arc(originPt.x, originPt.y, 9 + Math.sin(tick * 0.1) * 3, 0, Math.PI * 2)
        ctx.stroke()

        ctx.font = '700 10px "JetBrains Mono", monospace'
        ctx.fillStyle = '#fde047'
        ctx.fillText('📍 SANGARIA (SNG)', originPt.x - 42, originPt.y - 12)
      }

      if (!prefersReducedMotion && isVisible) {
        rotY += 0.18
        tick += 1
        animationFrameId = window.requestAnimationFrame(draw)
      }
    }

    let observer: IntersectionObserver | null = null
    let handleVisibilityChange: (() => void) | null = null
    const start = () => {
      isVisible = true
      if (!animationFrameId) draw()
    }
    const stop = () => {
      isVisible = false
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId)
        animationFrameId = 0
      }
    }

    resize()
    window.addEventListener('resize', resize)
    if (prefersReducedMotion) {
      draw()
    } else if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        isIntersecting = entry.isIntersecting
        if (isIntersecting && document.visibilityState !== 'hidden') start()
        else stop()
      }, { threshold: 0.01 })
      observer.observe(canvas)
      handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') stop()
        else if (isIntersecting) start()
      }
      document.addEventListener('visibilitychange', handleVisibilityChange)
    } else {
      start()
    }

    return () => {
      observer?.disconnect()
      if (handleVisibilityChange) document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('resize', resize)
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId)
    }
  }, [selectedCountry])

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="h-full w-full block" />
    </div>
  )
}

export function AnimatedStatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const match = value.match(/^([^0-9]*)([0-9]+(?:[.,][0-9]+)?)(.*)$/)
    if (!match) {
      setDisplay(value)
      return
    }

    const prefix = match[1] || ''
    const rawNum = match[2].replace(/,/g, '')
    const hasComma = match[2].includes(',')
    const decimals = rawNum.includes('.') ? rawNum.split('.')[1].length : 0
    const target = parseFloat(rawNum)
    const suffix = match[3] || ''

    if (Number.isNaN(target)) {
      setDisplay(value)
      return
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      setDisplay(value)
      return
    }

    let frameId = 0
    let animated = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          animated = true
          const duration = 1100
          const start = performance.now()

          const step = (now: number) => {
            const progress = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = target * eased
            let formatted = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString()
            if (hasComma && decimals === 0) {
              formatted = Math.round(current).toLocaleString('en-IN')
            }
            setDisplay(`${prefix}${formatted}${suffix}`)
            if (progress < 1) {
              frameId = window.requestAnimationFrame(step)
            } else {
              setDisplay(value)
            }
          }

          frameId = window.requestAnimationFrame(step)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [value])

  return <span ref={ref}>{display}</span>
}

