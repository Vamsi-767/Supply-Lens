import { useEffect, useRef, useState } from 'react'

/**
 * Animated counter — counts up on first load, then adds $1 every 60 seconds
 */
export default function AnimatedNumber({ value, prefix = '', suffix = '', duration = 1500, live = false }) {
  const [display, setDisplay] = useState(0)
  const [liveOffset, setLiveOffset] = useState(0)
  const animRef = useRef(null)
  const hasAnimated = useRef(false)

  // Animate from 0 to value only on first mount
  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const numValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0
    const startTime = performance.now()

    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(numValue * eased)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  // Update display if API value changes (without re-animating from 0)
  useEffect(() => {
    if (hasAnimated.current) {
      const numValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0
      setDisplay(numValue)
    }
  }, [value])

  // Live: add $1 every 60 seconds for revenue, +1 for counts
  useEffect(() => {
    if (!live) return
    const interval = setInterval(() => {
      setLiveOffset((prev) => prev + 1)
    }, 60000)
    return () => clearInterval(interval)
  }, [live])

  const finalValue = display + liveOffset
  const isDecimal = String(value).includes('.') || suffix === '%'
  const formatted = isDecimal
    ? finalValue.toFixed(1)
    : Math.round(Math.max(0, finalValue)).toLocaleString()

  return <span>{prefix}{formatted}{suffix}</span>
}
