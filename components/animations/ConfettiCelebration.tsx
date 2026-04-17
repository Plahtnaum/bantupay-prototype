'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
}

const COLORS = ['#FC690A', '#D4560A', '#FF8A3D', '#FFF3EC', '#16A34A', '#FBBF24', '#EC4899']

interface ConfettiCelebrationProps {
  active: boolean
  count?: number
}

export function ConfettiCelebration({ active, count = 60 }: ConfettiCelebrationProps) {
  const particles: Particle[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 40 + Math.random() * 20, // % from center-ish
    y: -5,
    vx: (Math.random() - 0.5) * 6,
    vy: 3 + Math.random() * 5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
  }))

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-[300] overflow-hidden">
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ x: `${p.x + Math.random() * 60 - 30}vw`, y: '-10px', rotate: p.rotation, opacity: 1 }}
              animate={{
                y: '110vh',
                x: `${p.x + p.vx * 20 + Math.random() * 40 - 20}vw`,
                rotate: p.rotation + p.rotationSpeed * 60,
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 1.8 + Math.random() * 1.2, ease: 'easeIn', delay: Math.random() * 0.4 }}
              style={{ position: 'absolute', width: p.size, height: p.size * 0.5, backgroundColor: p.color, borderRadius: 2 }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
