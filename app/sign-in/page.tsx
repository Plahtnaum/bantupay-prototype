'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/user.store'
import { useWalletStore } from '@/store/wallet.store'
import { haptics } from '@/lib/haptics'

type SignInStep = 'biometric' | 'pin'

export default function SignInPage() {
  const router = useRouter()
  const { persona, resetToDefaults: resetUser } = useUserStore()
  const { resetToDefaults: resetWallet } = useWalletStore()

  const [step, setStep] = useState<SignInStep>('biometric')
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [bioLoading, setBioLoading] = useState(false)

  const firstName = persona?.name?.split(' ')[0] ?? 'there'

  const handleBiometric = () => {
    if (bioLoading) return
    haptics.medium()
    setBioLoading(true)
    setTimeout(() => {
      setBioLoading(false)
      haptics.success()
      router.replace('/home')
    }, 1300)
  }

  const handlePinPress = (digit: string) => {
    if (error || pin.length >= 6) return
    haptics.light()
    const next = pin + digit
    setPin(next)
    if (next.length === 6) {
      setTimeout(() => {
        const correct = persona?.pin ?? '123456'
        if (next === correct) {
          haptics.success()
          router.replace('/home')
        } else {
          haptics.error?.()
          setError(true)
          setTimeout(() => { setPin(''); setError(false) }, 900)
        }
      }, 80)
    }
  }

  const handleDelete = () => {
    haptics.light()
    setPin(p => p.slice(0, -1))
    setError(false)
  }

  const handleSwitchAccount = () => {
    haptics.medium()
    resetUser()
    resetWallet()
    router.replace('/onboarding')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col w-full max-w-[430px] mx-auto overflow-hidden">

      {/* Upper hero: orange gradient, avatar, name */}
      <div className="relative bg-gradient-to-br from-[#FC690A] to-[#D4560A] flex flex-col items-center justify-end pb-12 pt-20 px-6 overflow-hidden"
        style={{ minHeight: '42vh' }}>
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-black/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center font-headline font-extrabold text-[32px] text-white backdrop-blur-sm">
            {persona?.name?.slice(0, 1) ?? 'B'}
          </div>
          <div className="text-center">
            <p className="font-label font-bold text-[11px] text-white/70 uppercase tracking-widest mb-1">Welcome back</p>
            <h1 className="font-headline font-extrabold text-[26px] text-white tracking-tight">{firstName}</h1>
          </div>
        </div>
      </div>

      {/* Lower card: auth method */}
      <div className="flex-1 bg-surface rounded-t-[32px] -mt-6 z-10 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] flex flex-col items-center px-8 pt-10 pb-12">

        <AnimatePresence mode="wait">
          {step === 'biometric' && (
            <motion.div key="bio" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="flex flex-col items-center w-full flex-1">
              <p className="font-body text-[15px] text-on-surface-variant text-center mb-10">
                Use biometrics or PIN to unlock your wallet
              </p>

              {/* Biometric button */}
              <button
                onClick={handleBiometric}
                disabled={bioLoading}
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 mb-4 ${bioLoading ? 'bg-surface-container animate-pulse' : 'bg-gradient-to-br from-[#FC690A] to-[#D4560A] shadow-[0_8px_32px_rgba(252,105,10,0.3)]'}`}
              >
                {bioLoading ? (
                  <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-white text-[44px]">fingerprint</span>
                )}
              </button>

              <p className="font-label font-bold text-[12px] text-on-surface-variant uppercase tracking-widest mb-12">
                {bioLoading ? 'Verifying…' : 'Touch to unlock'}
              </p>

              <button
                onClick={() => { haptics.light(); setStep('pin') }}
                className="flex items-center gap-2 font-headline font-bold text-[15px] text-primary hover:opacity-80 transition-opacity"
              >
                <span className="material-symbols-outlined text-[20px]">pin</span>
                Use PIN instead
              </button>

              <div className="flex-1" />
              <button
                onClick={handleSwitchAccount}
                className="font-body text-[13px] text-on-surface-variant/60 font-medium hover:text-on-surface-variant transition-colors mt-6"
              >
                Not {firstName}? Switch account
              </button>
            </motion.div>
          )}

          {step === 'pin' && (
            <motion.div key="pin" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="flex flex-col items-center w-full flex-1">
              <button onClick={() => { haptics.light(); setStep('biometric'); setPin(''); setError(false) }} className="self-start mb-6 flex items-center gap-1 text-on-surface-variant font-label font-bold text-[13px] hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
              </button>

              <p className="font-body text-[15px] text-on-surface-variant text-center mb-8">
                Enter your 6-digit PIN
              </p>

              {/* PIN dots */}
              <div className="flex gap-4 mb-10">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={error ? { x: [0, -6, 6, -6, 6, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      i < pin.length
                        ? error ? 'bg-error scale-110' : 'bg-primary scale-110'
                        : 'bg-outline-variant/30'
                    }`}
                  />
                ))}
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-label font-bold text-[12px] text-error mb-4 uppercase tracking-widest">
                  Incorrect PIN
                </motion.p>
              )}

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-y-3 gap-x-6 max-w-[260px] w-full mt-auto">
                {['1','2','3','4','5','6','7','8','9'].map(d => (
                  <button key={d} onClick={() => handlePinPress(d)} className="h-16 rounded-2xl font-headline font-semibold text-[28px] text-on-surface hover:bg-surface-container active:scale-90 transition-all">
                    {d}
                  </button>
                ))}
                <div />
                <button onClick={() => handlePinPress('0')} className="h-16 rounded-2xl font-headline font-semibold text-[28px] text-on-surface hover:bg-surface-container active:scale-90 transition-all">
                  0
                </button>
                <button onClick={handleDelete} className="h-16 rounded-2xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-90 transition-all">
                  <span className="material-symbols-outlined text-[28px]">backspace</span>
                </button>
              </div>

              <button
                onClick={handleSwitchAccount}
                className="font-body text-[13px] text-on-surface-variant/60 font-medium hover:text-on-surface-variant transition-colors mt-8"
              >
                Not {firstName}? Switch account
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
