'use client'
import { motion } from 'framer-motion'
import { Bell, QrCode } from 'phosphor-react'
import { BalanceCard } from '@/components/wallet/BalanceCard'
import { AssetListItem } from '@/components/wallet/AssetListItem'
import { TransactionListItem } from '@/components/wallet/TransactionListItem'
import { useWalletStore } from '@/store/wallet.store'
import { useUserStore } from '@/store/user.store'
import { haptics } from '@/lib/haptics'

export default function HomePage() {
  const { assets, transactions } = useWalletStore()
  const { persona } = useUserStore()
  const recent = transactions.slice(0, 3)

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Editorial Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border/10 dark:border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border-2 border-brand relative group cursor-pointer" onClick={() => haptics.reveal()}>
             <div className="absolute inset-0 bg-brand/10 group-hover:bg-transparent transition-colors" />
             <img 
               src="https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e24b77f?q=80&w=100&h=100&auto=format&fit=crop" 
               alt="Profile" 
               className="w-full h-full object-cover"
             />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-secondary font-extrabold uppercase tracking-widest leading-none mb-1">Personal Mode</span>
            <h1 className="text-text-primary font-display font-bold text-lg tracking-tight leading-none">
              Hi, {persona?.name.split(' ')[0] ?? 'Amara'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <HeaderAction icon={<Bell size={20} />} hasBadge onClick={() => haptics.light()} />
          <HeaderAction icon={<QrCode size={20} />} onClick={() => haptics.medium()} />
        </div>
      </header>

      <main className="pt-24 pb-12 space-y-10">
        {/* Hero Area */}
        <section>
          <BalanceCard />
        </section>

        {/* ASSETS Section */}
        <section className="px-6 space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-text-secondary font-display font-extrabold tracking-widest text-[11px] uppercase">ASSETS</h2>
            <button className="text-brand font-bold text-xs hover:underline decoration-2 underline-offset-4 transition-all" onClick={() => haptics.light()}>Manage</button>
          </div>
          <div className="space-y-3">
            {assets.map((asset, i) => (
              <AssetListItem key={asset.id} asset={asset} index={i} />
            ))}
            
            {/* Add Assets Dashed Button */}
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={() => haptics.medium()}
              className="w-full h-[60px] border-2 border-dashed border-border/20 rounded-xl flex items-center justify-center gap-2 text-text-secondary hover:bg-surface-container-low hover:border-brand/40 transition-all duration-300 group"
            >
              <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">add_circle</span>
              <span className="font-display font-bold text-sm tracking-tight">Add assets</span>
            </motion.button>
          </div>
        </section>

        {/* RECENT Activity */}
        <section className="px-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-text-secondary font-display font-extrabold tracking-widest text-[11px] uppercase">RECENT</h2>
            <button className="text-brand font-bold text-xs flex items-center gap-1 group" onClick={() => haptics.transition()}>
              See all <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
          <div className="bg-surface-container-low/50 rounded-2xl p-2 space-y-2">
            {recent.map((tx, i) => (
              <TransactionListItem key={tx.id} tx={tx} index={i} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function HeaderAction({ icon, hasBadge, onClick }: { icon: React.ReactNode; hasBadge?: boolean; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-text-primary hover:scale-105 transition-transform active:scale-90 relative"
    >
      {icon}
      {hasBadge && (
        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand rounded-full border-2 border-surface"></span>
      )}
    </button>
  )
}
