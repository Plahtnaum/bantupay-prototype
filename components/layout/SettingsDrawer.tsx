'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/user.store'
import { useWalletStore } from '@/store/wallet.store'
import { haptics } from '@/lib/haptics'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const MENU = [
  { label: 'Profile',  path: '/profile'  },
  { label: 'Security', path: '/profile'  },
  { label: 'Backup',   path: '/backup'   },
  { label: 'Safe',     path: '/safes'    },
]

export function SettingsDrawer({ isOpen, onClose }: Props) {
  const router = useRouter()
  const { persona, resetToDefaults: resetUser } = useUserStore()
  const { resetToDefaults: resetWallet } = useWalletStore()

  const nav = (path: string) => {
    haptics.light()
    onClose()
    setTimeout(() => router.push(path), 180)
  }

  const handleSignOut = () => {
    haptics.medium()
    resetUser()
    resetWallet()
    router.replace('/onboarding')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed left-0 top-0 bottom-0 z-[70] w-[280px] flex flex-col bg-surface border-r border-outline-variant/10"
          >
            {/* Subtle orange depth glow */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[300px] pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 40% 100%, rgba(252,105,10,0.06) 0%, transparent 60%)' }}
            />

            {/* User identity */}
            <div className="px-7 pt-16 pb-8 border-b border-outline-variant/15">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-headline font-bold text-[20px] text-white mb-4">
                {persona?.name?.slice(0, 1) ?? 'B'}
              </div>
              <p className="font-headline font-bold text-[18px] text-on-surface leading-tight">
                {persona?.name ?? 'Bantu User'}
              </p>
              <p className="font-body text-[13px] text-on-surface-variant mt-0.5">
                {persona?.handle ?? '@bantu_user'}
              </p>
            </div>

            {/* Menu */}
            <nav className="flex-1 py-2 relative z-10">
              {MENU.map((item, i) => (
                <div key={item.label}>
                  {i > 0 && <div className="mx-7 h-px bg-outline-variant/15" />}
                  <button
                    onClick={() => nav(item.path)}
                    className="w-full px-7 py-5 text-left font-headline font-semibold text-[26px] text-on-surface hover:text-primary transition-colors"
                  >
                    {item.label}
                  </button>
                </div>
              ))}

              <div className="mx-7 h-px bg-outline-variant/15" />
              <button
                onClick={() => nav('/profile')}
                className="w-full px-7 py-5 text-left font-headline font-semibold text-[26px] text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Help
              </button>
            </nav>

            {/* Footer */}
            <div className="px-7 pb-12 pt-6 relative z-10 border-t border-outline-variant/15">
              <p className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant/40 mb-5">
                BantuPay v3.0
              </p>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 font-body text-[14px] font-medium text-error transition-opacity hover:opacity-70"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Sign out
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
