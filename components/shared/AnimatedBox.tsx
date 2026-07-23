'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface AnimatedBoxProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  delay?: number
  duration?: number
  y?: number
  opacity?: number
  whileInView?: boolean
}

export function AnimatedBox({
  children, className, style,
  delay = 0, duration = 0.5, y = 16, opacity = 0,
  whileInView = false,
}: AnimatedBoxProps) {
  const [reduceMotion, setReduceMotion] = useState(false)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => { if (mounted.current) setReduceMotion(e.matches) }
    mq.addEventListener('change', handler)
    return () => { mounted.current = false; mq.removeEventListener('change', handler) }
  }, [])

  if (reduceMotion) {
    return <div className={className} style={style}>{children}</div>
  }

  const props = whileInView
    ? { initial: { opacity, y }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-50px' as const } }
    : { initial: { opacity, y }, animate: { opacity: 1, y: 0 } }

  return (
    <motion.div {...props} transition={{ duration, delay }} className={className} style={style}>
      {children}
    </motion.div>
  )
}
