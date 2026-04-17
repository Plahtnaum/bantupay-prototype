'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlass } from 'phosphor-react'
import { TransactionListItem } from '@/components/wallet/TransactionListItem'
import { useWalletStore } from '@/store/wallet.store'

const FILTERS = ['All', 'Sent', 'Received', 'Swapped', 'Bought']

export default function ActivityPage() {
  const { transactions } = useWalletStore()
  const [filter, setFilter] = useState('All')

  const filtered = transactions.filter(tx => {
    if (filter === 'All') return true
    if (filter === 'Sent') return tx.type === 'send' || tx.type === 'offramp'
    if (filter === 'Received') return tx.type === 'receive' || tx.type === 'claim'
    if (filter === 'Swapped') return tx.type === 'swap'
    if (filter === 'Bought') return tx.type === 'onramp'
    return true
  })

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <div className="bg-white px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold text-[#0F0F0F] font-[family-name:var(--font-jakarta)] mb-3">Activity</h1>
        <div className="relative mb-3">
          <MagnifyingGlass size={16} color="#9CA3AF" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search transactions"
            className="w-full border border-[#E8EAF0] rounded-xl pl-9 pr-4 py-2.5 text-sm font-[family-name:var(--font-inter)] outline-none focus:border-brand transition-colors bg-[#F9F9FB]"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium font-[family-name:var(--font-inter)] whitespace-nowrap transition-colors flex-shrink-0 ${filter === f ? 'bg-brand text-white' : 'bg-[#F0F1F5] text-text-secondary'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-3 bg-white rounded-2xl mx-4 overflow-hidden"
      >
        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <span className="text-4xl">📭</span>
            <p className="text-text-secondary text-sm font-[family-name:var(--font-inter)]">No transactions yet</p>
          </div>
        ) : (
          filtered.map((tx, i) => <TransactionListItem key={tx.id} tx={tx} index={i} />)
        )}
      </motion.div>
    </div>
  )
}
