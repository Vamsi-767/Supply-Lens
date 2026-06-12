import { useEffect, useRef, useState } from 'react'

/**
 * Animated counter — counts up on load, then small live increments every 20s
 */
export default function AnimatedNumber({ value, prefix = '', suffix = '', duration = 1500, live = false }) {
  const [display, setDisplay] = useState(0)
  const [liveOffset, setLiveOffset] = useState(0)
  const animRef = useRef(null)
  const prevValue = useRef(0)

  useEffect(() => {
    const numValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0
    const start = prevValue.current
    const end = numValue
    const startTime = performance.now()

    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = start + (end - start) * eased
      setDisplay(current)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        prevValue.current = end
      }
    }

    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [value, duration])

  // Live: small $1-2 increment every 20 seconds (realistic for small business)
  useEffect(() => {
    if (!live) return
    const interval = setInterval(() => {
      setLiveOffset((prev) => {
        // Add $1-2 for revenue, or +1 for counts
        const increment = suffix === '%' ? 0.1 : (prefix === '$' ? (1 + Math.random()) : 1)
        return prev + increment
      })
    }, 20000)
    return () => clearInterval(interval)
  }, [live, value, prefix, suffix])

  const finalValue = display + liveOffset
  const isDecimal = String(value).includes('.') || suffix === '%'
  const formatted = isDecimal
    ? finalValue.toFixed(1)
    : Math.round(Math.max(0, finalValue)).toLocaleString()

  return <span>{prefix}{formatted}{suffix}</span>
}
