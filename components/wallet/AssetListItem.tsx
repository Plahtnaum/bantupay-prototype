import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatFiat, formatCrypto } from '@/lib/formatting'
import type { Asset } from '@/mock/assets'
import { haptics } from '@/lib/haptics'

interface AssetListItemProps {
  asset: Asset
  index?: number
}

export function AssetListItem({ asset, index = 0 }: AssetListItemProps) {
  const isXBN = asset.symbol === 'XBN'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link 
        href={`/asset/${asset.id}`} 
        onClick={() => haptics.light()}
        className="bg-surface-container-lowest h-[72px] px-4 rounded-xl flex items-center justify-between transition-all hover:bg-surface-container-high border border-border/10 dark:border-white/5 active:scale-[0.98]"
      >
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-sm"
            style={{ backgroundColor: asset.iconBg, color: asset.color }}
          >
            {asset.iconText}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-text-primary tracking-tight">
                {asset.symbol}
              </span>
              {isXBN && (
                <span className="text-[10px] px-1.5 py-0.5 bg-surface-container-high rounded text-text-secondary font-bold uppercase tracking-tighter">
                  Native
                </span>
              )}
            </div>
            <span className="font-mono text-[11px] text-text-secondary group-hover:text-text-primary transition-colors">
              {formatFiat(asset.fiatValue / asset.balance, '₦')}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-display font-bold text-text-primary text-sm">
            {asset.balance.toLocaleString()} {asset.symbol}
          </span>
          <span className="font-mono text-[11px] text-text-tertiary">
            {formatFiat(asset.fiatValue, '₦')}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
