'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatFiat, formatCrypto, formatRelativeTime } from '@/lib/formatting'
import { haptics } from '@/lib/haptics'
import type { Transaction } from '@/mock/transactions'

interface TransactionListItemProps {
  tx: Transaction
  index?: number
}

const txConfig: Record<string, { icon: string; iconColor: string; iconBg: string; label: string; amountColor: string }> = {
  send:    { icon: 'vertical_align_top',    iconColor: 'text-error',             iconBg: 'bg-error-container/10',    label: 'Sent',     amountColor: 'text-on-surface' },
  receive: { icon: 'vertical_align_bottom', iconColor: 'text-primary-container', iconBg: 'bg-primary-container/10',  label: 'Received', amountColor: 'text-primary-container' },
  swap:    { icon: 'sync_alt',             iconColor: 'text-on-surface-variant', iconBg: 'bg-surface-container',     label: 'Swapped',  amountColor: 'text-on-surface' },
  onramp:  { icon: 'vertical_align_bottom', iconColor: 'text-primary-container', iconBg: 'bg-primary-container/10',  label: 'Bought',   amountColor: 'text-primary-container' },
  offramp: { icon: 'vertical_align_top',    iconColor: 'text-error',             iconBg: 'bg-error-container/10',    label: 'Sold',     amountColor: 'text-on-surface' },
  claim:   { icon: 'vertical_align_bottom', iconColor: 'text-primary-container', iconBg: 'bg-primary-container/10',  label: 'Claimed',  amountColor: 'text-primary-container' },
}

export function TransactionListItem({ tx, index = 0 }: TransactionListItemProps) {
  const cfg = txConfig[tx.type] ?? txConfig.swap
  const isSend = tx.type === 'send' || tx.type === 'offramp'
  const isReceive = tx.type === 'receive' || tx.type === 'onramp' || tx.type === 'claim'

  const amountPrefix = isSend ? '-' : isReceive ? '+' : ''
  const amountDisplay = isSend
    ? formatFiat(tx.fiatValue, '₦')
    : isReceive
    ? formatFiat(tx.fiatValue, '₦')
    : `${tx.amount} ${tx.asset}`

  const subAmount = tx.type === 'swap' ? `≈ ${formatFiat(tx.fiatValue, '₦')}` : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
    >
      <Link
        href={`/activity/${tx.id}`}
        onClick={() => haptics.light()}
        className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest transition-colors hover:bg-surface-container-low active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${cfg.iconBg} flex items-center justify-center ${cfg.iconColor}`}>
            <span className="material-symbols-outlined text-xl">
              {tx.status === 'failed' ? 'error' : tx.status === 'pending' ? 'schedule' : cfg.icon}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-on-surface">
              {tx.counterparty || cfg.label}
            </span>
            <span className="text-xs text-on-surface-variant">
              {formatRelativeTime(new Date(tx.timestamp))}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className={`font-mono text-sm font-bold ${cfg.amountColor}`}>
            {amountPrefix}{amountDisplay}
          </span>
          {subAmount && (
            <span className="text-[10px] text-on-surface-variant">{subAmount}</span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
