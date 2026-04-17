'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatFiat } from '@/lib/formatting'
import { haptics } from '@/lib/haptics'
import type { Asset } from '@/mock/assets'

interface AssetListItemProps {
  asset: Asset
  index?: number
}

const assetIcons: Record<string, { icon: string; colorClass: string; bgClass: string }> = {
  XBN:  { icon: 'token',    colorClass: 'text-primary',            bgClass: 'bg-primary/10' },
  cNGN: { icon: 'payments', colorClass: 'text-tertiary-container', bgClass: 'bg-tertiary-container/10' },
  USDC: { icon: 'paid',     colorClass: 'text-tertiary',           bgClass: 'bg-tertiary/10' },
  BNR:  { icon: 'savings',  colorClass: 'text-primary',            bgClass: 'bg-primary/10' },
}

export function AssetListItem({ asset, index = 0 }: AssetListItemProps) {
  const iconConfig = assetIcons[asset.symbol] ?? { icon: 'token', colorClass: 'text-on-surface-variant', bgClass: 'bg-surface-container-high' }
  const pricePerUnit = asset.balance > 0 ? asset.fiatValue / asset.balance : 0

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
        className="bg-surface-container-lowest h-[72px] px-4 rounded-[16px] flex items-center justify-between transition-all hover:bg-surface-container-low group border-2 border-transparent active:scale-[0.99]"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full ${iconConfig.bgClass} flex items-center justify-center ${iconConfig.colorClass}`}>
            <span className="material-symbols-outlined fill-icon">{iconConfig.icon}</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-headline font-bold text-on-surface">{asset.symbol}</span>
              {asset.symbol === 'XBN' && (
                <span className="text-[10px] px-1.5 py-0.5 bg-surface-container-high rounded text-on-surface-variant font-bold uppercase tracking-tighter">
                  Native
                </span>
              )}
            </div>
            <span className="font-mono text-xs text-on-surface-variant">
              {formatFiat(pricePerUnit, '₦')}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-headline font-bold text-on-surface text-sm">
            {asset.balance.toLocaleString()} {asset.symbol}
          </span>
          <span className="font-mono text-xs text-on-surface-variant">
            {formatFiat(asset.fiatValue, '₦')}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
