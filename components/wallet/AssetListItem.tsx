import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatFiat, formatCrypto } from '@/lib/formatting'
import type { Asset } from '@/mock/assets'

interface AssetListItemProps {
  asset: Asset
  index?: number
}

export function AssetListItem({ asset, index = 0 }: AssetListItemProps) {
  const isPositive = asset.change24h >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/asset/${asset.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9F9FB] transition-colors active:bg-[#F5F5F5]">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
          style={{ backgroundColor: asset.iconBg, color: asset.color }}
        >
          {asset.iconText}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#0F0F0F] text-sm font-[family-name:var(--font-inter)]">
              {asset.symbol}
            </span>
            <span className="font-semibold text-[#0F0F0F] text-sm font-[family-name:var(--font-jetbrains)]">
              {formatCrypto(asset.balance, asset.symbol)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-text-secondary text-xs font-[family-name:var(--font-inter)]">
              {asset.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-text-secondary text-xs font-[family-name:var(--font-inter)]">
                {formatFiat(asset.fiatValue, '₦')}
              </span>
              <span className={`text-xs font-medium font-[family-name:var(--font-inter)] ${isPositive ? 'text-semantic-success' : 'text-semantic-error'}`}>
                {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
