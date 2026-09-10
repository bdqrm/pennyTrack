import { useEffect, useRef, useState } from 'react'

export function useCountUp(target, duration = 600) {
  const [value, setValue] = useState(0)
  const displayRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const end = Number(target) || 0
    const from = displayRef.current
    if (from === end) return undefined

    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = from + (end - from) * eased
      displayRef.current = current
      setValue(current)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else displayRef.current = end
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}