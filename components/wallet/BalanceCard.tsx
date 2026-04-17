'use client'
import { motion } from 'framer-motion'
import { Eye, EyeSlash, ArrowUp, ArrowDown, ArrowsLeftRight, ShoppingBag, TrendingUp } from 'phosphor-react'
import { useWalletStore } from '@/store/wallet.store'
import { formatFiat } from '@/lib/formatting'
import { haptics } from '@/lib/haptics'
import Link from 'next/link'

export function BalanceCard() {
  const { assets, balanceHidden, toggleBalanceHidden } = useWalletStore()

  const totalNGN = assets.reduce((sum, a) => sum + a.fiatValue, 0)
  const totalUSD = totalNGN / 1488.50 // Mock rate

  return (
    <div className="mx-6 mt-6 relative group transform transition-all hover:scale-[1.01]">
      {/* Brand Shadow Layer */}
      <div className="absolute inset-0 bg-brand/30 blur-3xl rounded-[20px] -z-10 translate-y-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="w-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] rounded-[20px] shadow-brand p-6 sm:p-8 flex flex-col justify-between text-white overflow-hidden relative min-h-[220px]">
        {/* Decorative Texture */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 opacity-90 cursor-pointer" onClick={() => { haptics.reveal(); toggleBalanceHidden() }}>
            <span className="font-label text-sm font-medium tracking-wide">Total Balance</span>
            <span className="material-symbols-outlined text-base">
              {balanceHidden ? <EyeSlash size={16} /> : <Eye size={16} />}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[36px] sm:text-[42px] font-display font-bold tracking-tighter leading-none">
                {balanceHidden ? '••••••' : formatFiat(totalNGN, '₦')}
              </span>
            </div>
            <span className="font-mono text-sm opacity-80">
              ≈ {balanceHidden ? '••••' : formatFiat(totalUSD, '$')} USD
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-md border border-white/10">
            <TrendingUp size={14} weight="bold" />
            <span className="text-[11px] font-bold tracking-tight">+₦500 today</span>
          </div>
        </div>

        {/* Quick Actions Strip */}
        <div className="mt-6 flex justify-between items-center bg-black/20 backdrop-blur-xl p-3 sm:p-4 rounded-2xl border border-white/10">
          <QuickActionBtn href="/send" icon={<ArrowUp size={22} />} label="Send" />
          <QuickActionBtn href="/receive" icon={<ArrowDown size={22} />} label="Receive" isMiddle />
          <QuickActionBtn href="/swap" icon={<ArrowsLeftRight size={22} />} label="Swap" isMiddle />
          <QuickActionBtn href="/buy" icon={<ShoppingBag size={22} />} label="Buy" />
        </div>
      </div>
    </div>
  )
}

function QuickActionBtn({ 
  href, 
  icon, 
  label, 
  isMiddle = false 
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string;
  isMiddle?: boolean;
}) {
  return (
    <Link 
      href={href} 
      onClick={() => haptics.selection()}
      className={`flex flex-col items-center gap-1.5 flex-1 transition-all active:scale-95 group/btn ${isMiddle ? 'border-l border-white/10' : ''}`}
    >
      <div className="text-white group-hover/btn:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest opacity-80 group-hover/btn:opacity-100 transition-opacity">
        {label}
      </span>
    </Link>
  )
}
