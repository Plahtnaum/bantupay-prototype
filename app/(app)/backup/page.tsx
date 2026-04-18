'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { haptics } from '@/lib/haptics'

type BackupState = 'idle' | 'prompted' | 'progress' | 'complete'

export default function BackupPage() {
  const router = useRouter()
  const [state, setState] = useState<BackupState>('idle')
  const [progress, setProgress] = useState(0)

  const startBackup = () => {
    haptics.medium()
    setState('progress')
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setState('complete')
          return 100
        }
        return p + Math.random() * 18
      })
    }, 200)
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="flex items-center gap-3 px-6 pt-14 pb-6">
        <button
          onClick={() => { haptics.light(); router.back() }}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <h1 className="font-headline font-bold text-[22px] text-on-surface tracking-tight">Cloud Backup</h1>
      </header>

      <main className="flex-1 px-6 pb-12">
        <AnimatePresence mode="wait">

          {/* Idle — overview */}
          {state === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <div className="bg-surface-container rounded-[24px] p-6 mb-6 border border-outline-variant/10">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[28px] text-primary">cloud_off</span>
                </div>
                <h2 className="font-headline font-bold text-[20px] text-on-surface mb-1">No backup yet</h2>
                <p className="font-body text-[14px] text-on-surface-variant leading-relaxed">
                  Right now, your wallet only lives on this phone. If you lose it or switch devices, you'd lose access to your money. A backup keeps you safe.
                </p>
              </div>

              <h3 className="font-label font-bold text-[11px] text-on-surface-variant uppercase tracking-widest mb-3">What gets saved</h3>
              <div className="space-y-2 mb-8">
                {[
                  { icon: 'key', label: 'Your wallet access key', sub: 'Locked with a password — only you can open it' },
                  { icon: 'fingerprint', label: 'Your security settings', sub: 'PIN and biometric preferences' },
                  { icon: 'manage_accounts', label: 'Your profile', sub: 'Name, username, and display settings' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4 bg-surface-container rounded-[16px] px-4 py-4 border border-outline-variant/10">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px] text-primary">{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-headline font-semibold text-[14px] text-on-surface">{item.label}</p>
                      <p className="font-body text-[12px] text-on-surface-variant">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { haptics.light(); setState('prompted') }}
                className="w-full h-[56px] rounded-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-[16px] shadow-[0_8px_20px_rgba(252,105,10,0.25)] active:scale-[0.98] transition-transform"
              >
                Back up my wallet
              </button>
            </motion.div>
          )}

          {/* Prompted — choose destination */}
          {state === 'prompted' && (
            <motion.div key="prompted" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <p className="font-body text-[15px] text-on-surface-variant mb-6 leading-relaxed">
                Pick where to save your backup. It's protected with a password — even we can't access it.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  { icon: 'cloud', label: 'iCloud / Google Drive', sub: 'Stays in sync across your devices automatically', recommended: true },
                  { icon: 'folder', label: 'Save to this device', sub: 'Useful for exporting to external storage' },
                  { icon: 'security', label: 'BantuPay Vault', sub: 'Secure cloud storage managed by BantuPay', tag: 'Coming soon' },
                ].map(item => (
                  <button
                    key={item.label}
                    disabled={!!item.tag}
                    onClick={() => { if (!item.tag) startBackup() }}
                    className="w-full flex items-center gap-4 bg-surface-container rounded-[20px] px-5 py-4 border border-outline-variant/10 text-left hover:bg-surface-container-high transition-colors disabled:opacity-50 active:scale-[0.98]"
                  >
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[22px] text-primary">{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-headline font-bold text-[15px] text-on-surface">{item.label}</span>
                        {item.recommended && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">Recommended</span>}
                        {item.tag && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">{item.tag}</span>}
                      </div>
                      <p className="font-body text-[13px] text-on-surface-variant">{item.sub}</p>
                    </div>
                    {!item.tag && <span className="material-symbols-outlined text-[20px] text-on-surface-variant">chevron_right</span>}
                  </button>
                ))}
              </div>

              <button
                onClick={() => { haptics.light(); setState('idle') }}
                className="w-full h-[52px] rounded-full bg-surface-container text-on-surface font-headline font-bold text-[15px] active:scale-[0.98] transition-transform"
              >
                Cancel
              </button>
            </motion.div>
          )}

          {/* Progress */}
          {state === 'progress' && (
            <motion.div key="progress" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center pt-24 text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[48px] text-primary animate-pulse">cloud_upload</span>
              </div>
              <h2 className="font-headline font-bold text-[22px] text-on-surface mb-2">Saving your backup…</h2>
              <p className="font-body text-[14px] text-on-surface-variant mb-8">This only takes a moment</p>
              <div className="w-full max-w-[280px] h-2 bg-surface-container rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#FC690A] to-[#D4560A] rounded-full"
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="font-label font-bold text-[13px] text-primary mt-3">{Math.round(Math.min(progress, 100))}%</p>
            </motion.div>
          )}

          {/* Complete */}
          {state === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center pt-20 text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="w-24 h-24 rounded-full bg-[#16A34A]/10 flex items-center justify-center mb-6"
              >
                <span className="material-symbols-outlined text-[48px] text-[#16A34A]">cloud_done</span>
              </motion.div>
              <h2 className="font-headline font-bold text-[26px] text-on-surface mb-2">You're backed up</h2>
              <p className="font-body text-[15px] text-on-surface-variant mb-2">
                Your wallet is safely saved. If you ever lose your phone, you can restore everything in seconds.
              </p>
              <p className="font-label font-bold text-[12px] text-on-surface-variant mb-10">
                Saved on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>

              <div className="w-full space-y-3">
                <button
                  onClick={() => { haptics.light(); router.back() }}
                  className="w-full h-[56px] rounded-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-[16px] shadow-[0_8px_20px_rgba(252,105,10,0.2)] active:scale-[0.98] transition-transform"
                >
                  Done
                </button>
                <button
                  onClick={() => { haptics.light(); setState('idle') }}
                  className="w-full h-[52px] rounded-full bg-surface-container text-on-surface-variant font-headline font-bold text-[14px] active:scale-[0.98] transition-transform"
                >
                  Backup settings
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  )
}
