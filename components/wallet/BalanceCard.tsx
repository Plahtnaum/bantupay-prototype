'use client'
import { motion } from 'framer-motion'
import { Eye, EyeSlash, ArrowUp, ArrowDown, ArrowsLeftRight } from 'phosphor-react'
import { useWalletStore } from '@/store/wallet.store'
import { useUserStore } from '@/store/user.store'
import { formatFiat } from '@/lib/formatting'
import { haptics } from '@/lib/haptics'

export function BalanceCard() {
  const { assets, balanceHidden, toggleBalanceHidden } = useWalletStore()
  const { persona } = useUserStore()

  const totalNGN = assets.reduce((sum, a) => sum + a.fiatValue, 0)
  const cNGN = assets.find(a => a.symbol === 'cNGN')

  return (
    <div className="mx-4 mt-4 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FC690A 0%, #D4560A 100%)' }}>
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white/70 text-xs font-medium font-[family-name:var(--font-inter)]">
            Total Balance
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { haptics.light(); toggleBalanceHidden() }}
            className="text-white/70 hover:text-white transition-colors"
          >
            {balanceHidden ? <EyeSlash size={18} /> : <Eye size={18} />}
          </motion.button>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          {balanceHidden ? (
            <span className="text-4xl font-bold text-white font-[family-name:var(--font-jakarta)] tracking-tight">
              ••••••
            </span>
          ) : (
            <span className="text-4xl font-bold text-white font-[family-name:var(--font-jakarta)] tracking-tight">
              {formatFiat(totalNGN, '₦')}
            </span>
          )}
        </div>

        {cNGN && (
          <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5 w-fit mb-4">
            <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">₦</span>
            </div>
            <span className="text-white text-xs font-medium font-[family-name:var(--font-inter)]">
              {balanceHidden ? '•••••' : `${cNGN.balance.toLocaleString()} cNGN`}
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <QuickActionBtn href="/send" icon={<ArrowUp size={18} weight="bold" />} label="Send" />
          <QuickActionBtn href="/receive" icon={<ArrowDown size={18} weight="bold" />} label="Receive" />
          <QuickActionBtn href="/buy" icon={<span className="text-[13px] font-bold">+₦</span>} label="Buy" />
          <QuickActionBtn href="/swap" icon={<ArrowsLeftRight size={18} weight="bold" />} label="Swap" />
        </div>
      </div>
    </div>
  )
}

function QuickActionBtn({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} className="flex-1 flex flex-col items-center gap-1.5">
      <motion.div
        whileTap={{ scale: 0.9 }}
        className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white"
      >
        {icon}
      </motion.div>
      <span className="text-white/90 text-[11px] font-medium font-[family-name:var(--font-inter)]">{label}</span>
    </a>
  )
}
