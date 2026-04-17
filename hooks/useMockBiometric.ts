'use client'
import { useState } from 'react'
import { haptics } from '@/lib/haptics'

export function useMockBiometric() {
  const [pending, setPending] = useState(false)

  const prompt = async (): Promise<boolean> => {
    setPending(true)
    haptics.medium()
    await new Promise((r) => setTimeout(r, 1200))
    setPending(false)
    haptics.success()
    return true
  }

  return { prompt, pending }
}
