'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/user.store'

export default function RootPage() {
  const router = useRouter()
  const { onboardingComplete } = useUserStore()

  useEffect(() => {
    if (onboardingComplete) {
      router.replace('/home')
    } else {
      router.replace('/onboarding')
    }
  }, [onboardingComplete, router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #FC690A 0%, #D4560A 100%)' }}>
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
        <span className="text-3xl font-black text-brand font-[family-name:var(--font-jakarta)]">B</span>
      </div>
    </div>
  )
}
