import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUp, ArrowDown, ArrowsLeftRight, CurrencyDollar, WarningCircle, Clock } from 'phosphor-react'
import { formatFiat, formatCrypto, formatRelativeTime } from '@/lib/formatting'
import { Badge } from '@/components/ui/Badge'
import type { Transaction } from '@/mock/transactions'

interface TransactionListItemProps {
  tx: Transaction
  index?: number
}

const txConfig = {
  send:    { icon: ArrowUp,            label: 'Sent',     color: '#DC2626', bg: '#FEF2F2' },
  receive: { icon: ArrowDown,          label: 'Received', color: '#16A34A', bg: '#F0FDF4' },
  swap:    { icon: ArrowsLeftRight,    label: 'Swapped',  color: '#2563EB', bg: '#EFF6FF' },
  onramp:  { icon: CurrencyDollar,     label: 'Bought',   color: '#16A34A', bg: '#F0FDF4' },
  offramp: { icon: CurrencyDollar,     label: 'Sold',     color: '#DC2626', bg: '#FEF2F2' },
  claim:   { icon: ArrowDown,          label: 'Claimed',  color: '#7C3AED', bg: '#F5F3FF' },
}

export function TransactionListItem({ tx, index = 0 }: TransactionListItemProps) {
  const cfg = txConfig[tx.type]
  const Icon = cfg.icon
  const isSend = tx.type === 'send' || tx.type === 'offramp'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link href={`/activity/${tx.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9F9FB] transition-colors active:bg-[#F5F5F5]">
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

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-[#0F0F0F] text-sm font-[family-name:var(--font-inter)] truncate">
              {tx.counterparty || cfg.label}
            </span>
            <span className={`font-semibold text-sm font-[family-name:var(--font-jetbrains)] flex-shrink-0 ${isSend ? 'text-[#0F0F0F]' : 'text-semantic-success'}`}>
              {isSend ? '-' : '+'}{formatCrypto(tx.amount, tx.asset)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-text-secondary text-xs font-[family-name:var(--font-inter)]">
                {formatRelativeTime(new Date(tx.timestamp))}
              </span>
              {tx.status === 'pending' && <Badge variant="orange">Pending</Badge>}
              {tx.status === 'failed' && <Badge variant="red">Failed</Badge>}
            </div>
            <span className="text-text-secondary text-xs font-[family-name:var(--font-inter)]">
              {formatFiat(tx.fiatValue, '₦')}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
