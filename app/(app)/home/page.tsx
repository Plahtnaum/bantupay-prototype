'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useWalletStore } from '@/store/wallet.store'
import { useUserStore } from '@/store/user.store'
import { haptics } from '@/lib/haptics'
import { SettingsDrawer } from '@/components/layout/SettingsDrawer'
import { NotificationCenter } from '@/components/layout/NotificationCenter'

const ACTIONS = [
  { icon: 'arrow_upward',   label: 'Send',     path: '/send'    },
  { icon: 'arrow_downward', label: 'Receive',  path: '/receive' },
  { icon: 'swap_horiz',     label: 'Swap',     path: '/swap'    },
  { icon: 'payments',       label: 'Buy/Sell', path: '/buy'     },
]

export default function HomePage() {
  const router = useRouter()
  const { assets, balanceHidden, toggleBalanceHidden } = useWalletStore()
  const { persona } = useUserStore()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const portfolioValue = assets.reduce((sum, a) => sum + a.fiatValue, 0)
  const usdEquiv = Math.round(portfolioValue / 1500).toLocaleString()
  const firstName = persona?.name?.split(' ')[0] ?? 'there'

  return (
    <>
      <div className="min-h-screen bg-surface flex flex-col px-6 pb-36 select-none">

        {/* Top bar */}
        <header className="flex items-center justify-between pt-14 pb-8">
          <button
            onClick={() => { haptics.light(); setDrawerOpen(true) }}
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>

          <p className="font-body font-medium text-[15px] text-on-surface">hi, {firstName}</p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { haptics.light(); router.push('/scan') }}
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
            </button>
            <button
              onClick={() => { haptics.light(); setNotifOpen(true) }}
              className="relative w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-surface" />
            </button>
          </div>
        </header>

        {/* Balance zone */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="font-label font-bold text-[11px] text-on-surface-variant uppercase tracking-[0.12em] mb-4">
            Total Portfolio
          </p>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => { haptics.light(); toggleBalanceHidden() }}
            className="text-left mb-1"
          >
            <h1
              className="font-headline font-extrabold leading-none tracking-tight text-on-surface"
              style={{ fontSize: 'clamp(40px, 12vw, 56px)' }}
            >
              {balanceHidden
                ? <span className="tracking-widest opacity-40">₦ • • • • •</span>
                : `₦${portfolioValue.toLocaleString()}`}
            </h1>
          </motion.button>

          {!balanceHidden && (
            <p className="font-body text-[14px] text-on-surface-variant font-medium mb-3">
              ≈ ${usdEquiv} USD
            </p>
          )}

          <button
            onClick={() => { haptics.light(); router.push('/wallet') }}
            className="font-body text-[13px] text-primary font-semibold mb-16 text-left w-fit hover:opacity-75 transition-opacity active:opacity-50"
          >
            View assets →
          </button>

          {/* Action grid */}
          <div className="grid grid-cols-4 gap-2">
            {ACTIONS.map((a, i) => (
              <motion.button
                key={a.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => { haptics.light(); router.push(a.path) }}
                className="flex flex-col items-center gap-2.5"
              >
                <div className="w-[60px] h-[60px] rounded-full bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px] text-on-surface">{a.icon}</span>
                </div>
                <span className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-wide text-center leading-tight w-full">
                  {a.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <SettingsDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <NotificationCenter isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  )
}
