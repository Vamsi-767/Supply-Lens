import { useEffect, useRef, useState } from 'react'

/**
 * Animated counter that counts up to the target number
 * with optional prefix/suffix and live real-time updates
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

  // Live: increment by small random amounts every 2-4 seconds
  useEffect(() => {
    if (!live) return
    const interval = setInterval(() => {
      setLiveOffset((prev) => {
        const numValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0
        // Add small increment (0.1% to 0.5% of value)
        const increment = Math.max(1, numValue * (0.001 + Math.random() * 0.004))
        // Sometimes subtract a tiny bit too for realism
        const change = Math.random() > 0.3 ? increment : -increment * 0.3
        return prev + change
      })
    }, 2000 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [live, value])

  const finalValue = display + liveOffset
  const isDecimal = String(value).includes('.') || suffix === '%'
  const formatted = isDecimal
    ? finalValue.toFixed(1)
    : Math.round(Math.max(0, finalValue)).toLocaleString()

  return <span>{prefix}{formatted}{suffix}</span>
}
