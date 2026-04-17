import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUp, ArrowDown, ArrowsLeftRight, CurrencyDollar, WarningCircle, Clock } from 'phosphor-react'
import { formatFiat, formatCrypto, formatRelativeTime } from '@/lib/formatting'
import { Badge } from '@/components/ui/Badge'
import { haptics } from '@/lib/haptics'
import type { Transaction } from '@/mock/transactions'

interface TransactionListItemProps {
  tx: Transaction
  index?: number
}

const txConfig = {
  send:    { icon: ArrowUp,            label: 'Sent',     color: '#FC690A', bg: 'rgba(252, 105, 10, 0.1)' },
  receive: { icon: ArrowDown,          label: 'Received', color: '#16A34A', bg: 'rgba(22, 163, 74, 0.1)' },
  swap:    { icon: ArrowsLeftRight,    label: 'Swapped',  color: '#9BA3B4', bg: 'var(--surface-container-high)' },
  onramp:  { icon: CurrencyDollar,     label: 'Bought',   color: '#16A34A', bg: 'rgba(22, 163, 74, 0.1)' },
  offramp: { icon: CurrencyDollar,     label: 'Sold',     color: '#DC2626', bg: 'rgba(220, 38, 38, 0.1)' },
  claim:   { icon: ArrowDown,          label: 'Claimed',  color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)' },
}

export function TransactionListItem({ tx, index = 0 }: TransactionListItemProps) {
  const cfg = txConfig[tx.type]
  const Icon = cfg.icon
  const isSend = tx.type === 'send' || tx.type === 'offramp'

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
        className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-border/10 dark:border-white/5 transition-all hover:bg-surface-container-high active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: cfg.bg }}
          >
            {tx.status === 'failed' ? (
              <WarningCircle size={20} color="#DC2626" weight="fill" />
            ) : tx.status === 'pending' ? (
              <Clock size={20} color="#D97706" weight="fill" />
            ) : (
              <Icon size={20} color={cfg.color} weight="bold" />
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-sm text-text-primary">
              {tx.counterparty || cfg.label}
            </span>
            <span className="text-xs text-text-secondary">
              {formatRelativeTime(new Date(tx.timestamp))}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className={`font-mono text-sm font-bold ${isSend ? 'text-text-primary' : 'text-brand'}`}>
            {isSend ? '-' : '+'}{formatCrypto(tx.amount, tx.asset)}
          </span>
          <span className="font-mono text-[10px] text-text-tertiary">
            ≈ {formatFiat(tx.fiatValue, '₦')}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
