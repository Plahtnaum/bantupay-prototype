'use client'
import { motion } from 'framer-motion'
import { BalanceCard } from '@/components/wallet/BalanceCard'
import { AssetListItem } from '@/components/wallet/AssetListItem'
import { TransactionListItem } from '@/components/wallet/TransactionListItem'
import { useWalletStore } from '@/store/wallet.store'
import { useUserStore } from '@/store/user.store'
import { haptics } from '@/lib/haptics'
import { useState } from 'react'
import { NotificationCenter } from '@/components/layout/NotificationCenter'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const { assets, transactions } = useWalletStore()
  const { persona } = useUserStore()
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const recent = transactions.slice(0, 3)

  return (
    <div className="min-h-screen bg-surface">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-slate-50/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary-container">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcHLKDoV1Y2nQ-WxGcNE94-EaniUcKzIgAfCKjgu819YhLthGFeITl_cjBBN88bb9ExdbAxblhCvlG1VnKmRDExo1GGqyx9HVHxdq-1xpA9yM9MopfiCniUA7Ww2xQtHG6YaxkWrlxZPyiKgB_LeYu15Z0_-ygs8oDB1-kEk6J4qHKV-qwuku5tKbQv_IUvjgY8As85ccg1y48SHAjsdLtC-6Fdjt3vl1aGKbai0a_er1eNdxLSVRoPRZ2OrAkx_Hodhe-3b2p2Q"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-on-surface font-headline font-bold text-lg tracking-tight">
              Hi, {persona?.name.split(' ')[0] ?? 'Amara'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { haptics.light(); setIsNotifOpen(true) }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:opacity-80 transition-opacity relative"
          >
            <span className="material-symbols-outlined text-on-surface">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-surface" />
          </button>
          <button
            onClick={() => { haptics.light(); router.push('/scan') }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-on-surface">qr_code_scanner</span>
          </button>
        </div>
      </header>

      <main className="pt-20 pb-32 px-6 max-w-[430px] mx-auto space-y-8">
        {/* Balance Card */}
        <BalanceCard />

        {/* ASSETS Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-secondary font-headline font-extrabold tracking-widest text-xs uppercase">ASSETS</h2>
            <button className="text-primary font-bold text-xs hover:underline transition-all" onClick={() => { haptics.light(); router.push('/wallet') }}>Manage</button>
          </div>
          <div className="space-y-3">
            {assets.map((asset, i) => (
              <AssetListItem key={asset.id} asset={asset} index={i} />
            ))}
            {/* Add Assets Dashed Button */}
            <button
              onClick={() => { haptics.medium(); router.push('/add-token') }}
              className="w-full h-[60px] border-2 border-dashed border-outline-variant/30 rounded-xl flex items-center justify-center gap-2 text-primary hover:bg-primary/5 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span className="font-headline font-bold text-sm tracking-tight">Add assets</span>
            </button>
          </div>
        </section>

        {/* RECENT Transactions */}
        {recent.length > 0 && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-secondary font-headline font-extrabold tracking-widest text-xs uppercase">RECENT</h2>
              <button className="text-primary font-bold text-xs hover:translate-x-1 transition-transform" onClick={() => haptics.light()}>See all →</button>
            </div>
            <div className="bg-surface-container-low/50 rounded-2xl p-2 space-y-1">
              {recent.map((tx, i) => (
                <TransactionListItem key={tx.id} tx={tx} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>

      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </div>
  )
}
