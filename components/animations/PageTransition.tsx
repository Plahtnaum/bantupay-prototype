'use client'
import { motion } from 'framer-motion'

interface PageTransitionProps {
  children: React.ReactNode
  direction?: 'up' | 'right'
}

const variants = {
  up: {
    initial: { y: 24, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit:    { y: -12, opacity: 0 },
  },
  right: {
    initial: { x: 32, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit:    { x: -20, opacity: 0 },
  },
}

export function PageTransition({ children, direction = 'right' }: PageTransitionProps) {
  const v = variants[direction]
  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{ type: 'spring', stiffness: 400, damping: 38 }}
    >
      {children}
    </motion.div>
  )
}
