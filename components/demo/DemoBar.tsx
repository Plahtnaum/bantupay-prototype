'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '@/store/user.store'
import { useWalletStore } from '@/store/wallet.store'
import { MOCK_PERSONAS } from '@/mock/users'
import { useRouter } from 'next/navigation'

export function DemoBar() {
  const [open, setOpen] = useState(false)
  const { persona, setPersona } = useUserStore()
  const { resetToDefaults } = useWalletStore()
  const router = useRouter()

  const handleSwitch = (id: string) => {
    const p = MOCK_PERSONAS.find(p => p.id === id)
    if (!p) return
    setPersona(p)
    resetToDefaults()
    setOpen(false)
    router.push('/home')
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[200] bg-[#0F0F0F] text-white">
        <div className="flex items-center justify-between px-4 h-8">
          <span className="text-[10px] font-medium text-white/50 font-[family-name:var(--font-inter)] uppercase tracking-widest">
            Demo Mode
          </span>
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1"
          >
            <div className="w-4 h-4 rounded-full bg-brand flex items-center justify-center text-[8px] font-bold">
              {persona?.name.slice(0, 1) ?? 'A'}
            </div>
            <span className="text-[10px] font-medium font-[family-name:var(--font-inter)]">
              {persona?.name.split(' ')[0] ?? 'Amara'} ▾
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[190] bg-black/40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed top-8 left-4 right-4 z-[200] bg-[#0F0F0F] rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="px-4 pt-4 pb-2">
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-3">
                  Switch Persona
                </p>
                {MOCK_PERSONAS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSwitch(p.id)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 mb-1 transition-colors ${persona?.id === p.id ? 'bg-white/15' : 'hover:bg-white/10'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-white text-sm font-semibold font-[family-name:var(--font-inter)]">{p.name}</p>
                      <p className="text-white/40 text-xs font-[family-name:var(--font-inter)]">{p.mode} · KYC {p.kycLevel}</p>
                    </div>
                    {persona?.id === p.id && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-brand" />
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-white/10 px-4 py-3">
                <button
                  onClick={() => { resetToDefaults(); setOpen(false); router.push('/onboarding') }}
                  className="w-full text-center text-white/50 text-xs font-[family-name:var(--font-inter)] hover:text-white/80 transition-colors"
                >
                  Reset & restart onboarding
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
