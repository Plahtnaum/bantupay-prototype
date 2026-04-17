'use client'
import { motion } from 'framer-motion'
import { Bell, MagnifyingGlass } from 'phosphor-react'
import { BalanceCard } from '@/components/wallet/BalanceCard'
import { AssetListItem } from '@/components/wallet/AssetListItem'
import { TransactionListItem } from '@/components/wallet/TransactionListItem'
import { useWalletStore } from '@/store/wallet.store'
import { useUserStore } from '@/store/user.store'

export default function HomePage() {
  const { assets, transactions } = useWalletStore()
  const { persona } = useUserStore()
  const recent = transactions.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold text-sm font-[family-name:var(--font-inter)]">
            {persona?.name.slice(0, 2).toUpperCase() ?? 'AM'}
          </div>
          <div>
            <p className="text-xs text-text-secondary font-[family-name:var(--font-inter)]">Welcome back</p>
            <p className="text-sm font-semibold text-[#0F0F0F] font-[family-name:var(--font-jakarta)]">
              {persona?.name.split(' ')[0] ?? 'Amara'} 👋
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F5F5]">
            <MagnifyingGlass size={22} color="#0F0F0F" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] relative">
            <Bell size={22} color="#0F0F0F" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full" />
          </motion.button>
        </div>
      </div>

      <BalanceCard />

      {/* Assets Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-sm font-semibold text-[#0F0F0F] font-[family-name:var(--font-jakarta)]">Assets</h2>
          <a href="/wallet" className="text-xs text-brand font-medium font-[family-name:var(--font-inter)]">See all</a>
        </div>
        {assets.map((asset, i) => (
          <AssetListItem key={asset.id} asset={asset} index={i} />
        ))}
      </motion.div>

      {/* Recent Activity */}
      {recent.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-4 mt-4 mb-6 bg-white rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <h2 className="text-sm font-semibold text-[#0F0F0F] font-[family-name:var(--font-jakarta)]">Recent</h2>
            <a href="/activity" className="text-xs text-brand font-medium font-[family-name:var(--font-inter)]">See all</a>
          </div>
          {recent.map((tx, i) => (
            <TransactionListItem key={tx.id} tx={tx} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
