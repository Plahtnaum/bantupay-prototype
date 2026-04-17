'use client'
import { motion } from 'framer-motion'
import { Plus } from 'phosphor-react'
import { AssetListItem } from '@/components/wallet/AssetListItem'
import { useWalletStore } from '@/store/wallet.store'
import { formatFiat } from '@/lib/formatting'

export default function WalletPage() {
  const { assets } = useWalletStore()
  const total = assets.reduce((s, a) => s + a.fiatValue, 0)

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <div className="bg-white px-4 pt-4 pb-4">
        <h1 className="text-xl font-bold text-[#0F0F0F] font-[family-name:var(--font-jakarta)] mb-1">My Assets</h1>
        <p className="text-sm text-text-secondary font-[family-name:var(--font-inter)]">
          Total: <span className="text-[#0F0F0F] font-semibold">{formatFiat(total, '₦')}</span>
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden"
      >
        {assets.map((a, i) => <AssetListItem key={a.id} asset={a} index={i} />)}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F9F9FB] transition-colors border-t border-[#E8EAF0]"
        >
          <div className="w-10 h-10 rounded-full bg-[#F0F1F5] flex items-center justify-center">
            <Plus size={18} color="#9CA3AF" />
          </div>
          <span className="text-sm font-medium text-text-secondary font-[family-name:var(--font-inter)]">Add Asset</span>
        </motion.button>
      </motion.div>
    </div>
  )
}
