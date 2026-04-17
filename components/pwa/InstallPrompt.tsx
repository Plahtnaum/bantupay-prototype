'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { haptics } from '@/lib/haptics'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) return
    // Don't show if dismissed this session
    if (sessionStorage.getItem('pwa-install-dismissed')) return

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
      // Small delay so it doesn't feel intrusive on first load
      setTimeout(() => setVisible(true), 4000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!prompt) return
    haptics.medium()
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setVisible(false)
    setPrompt(null)
  }

  const handleDismiss = () => {
    haptics.light()
    sessionStorage.setItem('pwa-install-dismissed', '1')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-[300] backdrop-blur-[2px]"
            onClick={handleDismiss}
          />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-[301] bg-surface rounded-t-[32px] shadow-2xl overflow-hidden"
          >
            {/* Orange accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[#FC690A] to-[#D4560A]" />

            <div className="p-6 pb-10">
              <div className="w-12 h-1.5 bg-outline-variant/30 rounded-full mx-auto mb-6" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#FC690A] to-[#D4560A] flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
                  <span className="text-white font-headline font-extrabold text-2xl">B</span>
                </div>
                <div>
                  <h2 className="font-headline font-extrabold text-[22px] text-on-surface leading-tight">Add to Home Screen</h2>
                  <p className="font-body text-[13px] text-on-surface-variant font-medium">BantuPay · Free · No bank required</p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  { icon: 'bolt',             text: 'Instant access — no browser bar' },
                  { icon: 'wifi_off',         text: 'Works offline after first launch' },
                  { icon: 'system_update_alt',text: 'Always up to date automatically'  },
                ].map(item => (
                  <div key={item.icon} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-[18px]">{item.icon}</span>
                    </div>
                    <p className="font-body text-[14px] text-on-surface font-medium">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleInstall}
                  className="w-full h-14 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-[16px] rounded-full shadow-[0_4px_20px_rgba(252,105,10,0.35)] active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">download</span>
                  Install BantuPay
                </button>
                <button
                  onClick={handleDismiss}
                  className="w-full h-12 text-on-surface-variant font-label font-bold text-[13px] uppercase tracking-widest"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
