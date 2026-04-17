'use client'
import { motion } from 'framer-motion'
import { useWalletStore } from '@/store/wallet.store'
import { formatFiat } from '@/lib/formatting'
import { haptics } from '@/lib/haptics'
import Link from 'next/link'

const quickActions = [
  { href: '/send',    icon: 'send',             label: 'Send'    },
  { href: '/receive', icon: 'call_received',     label: 'Receive' },
  { href: '/swap',    icon: 'swap_horiz',        label: 'Swap'    },
  { href: '/buy',     icon: 'shopping_bag',      label: 'Buy'     },
]

export function BalanceCard() {
  const { assets, balanceHidden, toggleBalanceHidden } = useWalletStore()

  const totalNGN = assets.reduce((sum, a) => sum + a.fiatValue, 0)
  const totalUSD = totalNGN / 1488.50

  return (
    <section className="relative px-6 pt-4">
      <div className="w-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] rounded-[20px] shadow-brand p-8 flex flex-col justify-between text-white overflow-hidden" style={{ aspectRatio: '16/10' }}>
        {/* Decorative Layer */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4">
          <button
            onClick={() => { haptics.light(); toggleBalanceHidden() }}
            className="flex items-center gap-2 opacity-90"
          >
            <span className="font-label text-sm font-medium tracking-wide">Total Balance</span>
            <span className="material-symbols-outlined text-base">
              {balanceHidden ? 'visibility_off' : 'visibility'}
            </span>
          </button>

          <div className="flex flex-col gap-1">
            <span className="text-[38px] font-headline font-bold tracking-tighter leading-none">
              {balanceHidden ? '₦••••••' : formatFiat(totalNGN, '₦')}
            </span>
            <span className="font-mono text-sm opacity-80">
              ≈ {balanceHidden ? '$ ••••' : formatFiat(totalUSD, '$')} USD
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full backdrop-blur-md">
            <span className="material-symbols-outlined text-xs fill-icon" style={{ fontSize: '14px' }}>trending_up</span>
            <span className="text-xs font-bold">+₦500 today</span>
          </div>
        </div>

        {/* Quick Actions Strip */}
        <div className="flex justify-between items-center bg-white/15 backdrop-blur-xl p-4 rounded-2xl mt-4">
          {quickActions.map((action, i) => (
            <Link
              key={action.href}
              href={action.href}
              onClick={() => haptics.light()}
              className={`flex flex-col items-center gap-1 flex-1 transition-transform active:scale-95 ${
                i > 0 && i < quickActions.length ? 'border-l border-white/10' : ''
              }`}
            >
              <span className="material-symbols-outlined text-white">{action.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
