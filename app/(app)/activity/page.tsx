'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWalletStore } from '@/store/wallet.store'
import { Transaction } from '@/mock/transactions'
import { haptics } from '@/lib/haptics'

function isToday(d: Date) {
  const today = new Date();
  return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
}

function isYesterday(d: Date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear();
}

function formatMonthDay(d: Date) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${months[d.getMonth()]} ${d.getDate()}`
}

function formatRelative(d: Date) {
  const ms = Date.now() - d.getTime();
  const min = Math.floor(ms / 60000);
  if (min < 60) return `${min || 1} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  return `${Math.floor(hr / 24)} days ago`;
}

function groupTransactionsByDate(txs: Transaction[]) {
  const groups: { [key: string]: Transaction[] } = {}
  txs.forEach(tx => {
    const d = new Date(tx.timestamp)
    let label = formatMonthDay(d)
    if (isToday(d)) label = 'Today'
    else if (isYesterday(d)) label = 'Yesterday'
    
    if (!groups[label]) groups[label] = []
    groups[label].push(tx)
  })
  return groups
}

export default function ActivityPage() {
  const { transactions } = useWalletStore()
  const [filter, setFilter] = useState('All')
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = transactions.filter(tx => {
    if (filter === 'All') return true
    if (filter === 'Sent') return tx.type === 'send'
    if (filter === 'Received') return tx.type === 'receive' || tx.type === 'claim'
    if (filter === 'Swapped') return tx.type === 'swap'
    if (filter === 'On-ramp') return tx.type === 'onramp'
    if (filter === 'Off-ramp') return tx.type === 'offramp'
    return true
  })

  // Ensure sorting by time descending just in case
  const sorted = [...filtered].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  const grouped = groupTransactionsByDate(sorted)

  return (
    <div className="bg-background min-h-screen text-on-background pb-24">
      <header className="sticky top-0 w-full max-w-[430px] z-30 bg-surface/80 backdrop-blur-xl px-6 pt-16 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-[24px] font-headline font-semibold tracking-tight text-on-surface">Activity</h1>
          <button onClick={() => haptics.light()} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">
            <span className="material-symbols-outlined text-[22px]">tune</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Primary quick filters */}
          {['All', 'Sent', 'Received'].map(f => (
            <button
              key={f}
              onClick={() => { haptics.light(); setFilter(f); setDropdownOpen(false) }}
              className={`px-4 py-2 rounded-full text-[13px] font-label font-bold whitespace-nowrap transition-colors border ${
                filter === f
                  ? 'bg-primary-container text-primary border-primary'
                  : 'bg-surface border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {f}
            </button>
          ))}
          {/* More dropdown */}
          <div className="relative ml-auto" ref={dropdownRef}>
            <button
              onClick={() => { haptics.light(); setDropdownOpen(o => !o) }}
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-[13px] font-label font-bold transition-colors border ${
                ['Swapped','On-ramp','Off-ramp'].includes(filter)
                  ? 'bg-primary-container text-primary border-primary'
                  : 'bg-surface border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {['Swapped','On-ramp','Off-ramp'].includes(filter) ? filter : 'More'}
              <span className="material-symbols-outlined text-[16px]">{dropdownOpen ? 'expand_less' : 'expand_more'}</span>
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 bg-surface border border-outline-variant/20 rounded-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden z-50 min-w-[130px]"
                >
                  {['Swapped', 'On-ramp', 'Off-ramp'].map(f => (
                    <button
                      key={f}
                      onClick={() => { haptics.light(); setFilter(f); setDropdownOpen(false) }}
                      className={`w-full px-4 py-3 text-left text-[13px] font-label font-bold transition-colors flex items-center justify-between gap-3 ${
                        filter === f
                          ? 'bg-primary-container text-primary'
                          : 'text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      {f}
                      {filter === f && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className="px-6 py-6 w-full max-w-md mx-auto">
        <AnimatePresence mode="popLayout">
          {sorted.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="py-20 flex flex-col items-center gap-4 text-center mt-12"
            >
              <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center border border-outline-variant/20 shadow-sm mb-2">
                <span className="material-symbols-outlined text-[48px] text-tertiary font-light">receipt_long</span>
              </div>
              <div>
                <h3 className="font-headline font-semibold text-[17px] text-on-surface">No transactions yet</h3>
                <p className="font-body text-[14px] text-on-surface-variant max-w-[220px] mx-auto mt-2">
                  {filter !== 'All' 
                    ? `You don't have any ${filter.toLowerCase()} transactions.`
                    : 'Send or receive cNGN to get started.'}
                </p>
              </div>
              {filter === 'All' && (
                <button onClick={() => haptics.light()} className="mt-4 px-6 py-3 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-label font-bold rounded-full shadow-[0_8px_16px_rgba(252,105,10,0.25)] active:scale-95 transition-transform">
                  Receive cNGN
                </button>
              )}
            </motion.div>
          ) : (
            Object.keys(grouped).map((dateLabel) => (
              <motion.div key={dateLabel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-6">
                <h2 className="text-[11px] font-label font-bold text-on-surface-variant uppercase tracking-widest pl-1 mb-3">{dateLabel}</h2>
                <div className="space-y-2">
                  {grouped[dateLabel].map((tx) => (
                    <TransactionItemRow key={tx.id} tx={tx} onClick={() => { haptics.light(); setSelectedTx(tx); }} />
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </main>

      <TransactionDetailSheet tx={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  )
}

function TransactionItemRow({ tx, onClick }: { tx: Transaction, onClick: () => void }) {
  const isSend = tx.type === 'send' || tx.type === 'offramp'
  const isReceive = tx.type === 'receive' || tx.type === 'claim' || tx.type === 'onramp'
  const isSwap = tx.type === 'swap'

  const iconBg = isSend ? 'bg-[#FC690A]/10 text-[#FC690A]' : 
                 isReceive ? 'bg-[#16A34A]/10 text-[#16A34A]' : 
                 'bg-[#2563EB]/10 text-[#2563EB]'
  
  const iconName = isSend ? 'arrow_upward' : isReceive ? 'arrow_downward' : 'swap_horiz'

  const sign = isSend ? '−' : isReceive ? '+' : ''
  const amountColor = isReceive ? 'text-[#16A34A]' : isSend && tx.status !== 'failed' ? 'text-on-surface' : 'text-on-surface-variant'

  let title = ''
  if (isSend) title = `Sent to ${tx.counterparty}`
  if (isReceive) title = `Received from ${tx.counterparty}`
  if (isSwap) title = `Swapped to ${tx.toAsset || 'Swap'}`
  if (tx.type === 'onramp') title = `Funded via ${tx.counterparty}`
  if (tx.type === 'offramp') title = `Cashout to ${tx.counterparty}`

  // Adjust display amounts for swap vs send vs receive
  const displayAmount = isSwap && tx.type === 'swap' ? Math.max(tx.amount || 0, tx.toAmount || 0) : tx.amount

  return (
    <div onClick={onClick} className="h-[76px] bg-surface rounded-[16px] px-4 flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:bg-surface-container-lowest transition-colors border border-outline-variant/10 cursor-pointer">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-3 ${iconBg}`}>
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 600" }}>{iconName}</span>
      </div>
      
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2">
          <h3 className="font-headline font-bold text-[15px] text-on-surface truncate leading-tight">{title}</h3>
          {tx.status === 'pending' && <span className="bg-[#FFF3EC] text-[#FC690A] text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Pending</span>}
          {tx.status === 'failed' && <span className="bg-[#FEF2F2] text-[#DC2626] text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Failed</span>}
        </div>
        <p className="font-body text-[13px] text-on-surface-variant mt-1 truncate">
          {tx.asset} · {formatRelative(new Date(tx.timestamp))}
        </p>
      </div>

      <div className="flex flex-col items-end flex-shrink-0">
        <span className={`font-headline font-bold text-[15px] ${amountColor} ${tx.status === 'failed' ? 'line-through opacity-60' : ''}`}>
          {sign}{Number(displayAmount).toLocaleString()} {isSwap ? '' : tx.asset}
        </span>
        <span className="font-body text-[12px] text-on-surface-variant font-medium mt-1">
          {tx.status === 'failed' ? 'Failed' : `≈ ₦${tx.fiatValue.toLocaleString()}`}
        </span>
      </div>
    </div>
  )
}

function TransactionDetailSheet({ tx, onClose }: { tx: Transaction | null, onClose: () => void }) {
  if (!tx) return null

  const isFailed = tx.status === 'failed'
  const isPending = tx.status === 'pending'
  const isSuccess = tx.status === 'confirmed'

  const iconCircleClass = isFailed ? 'bg-[#FEF2F2] text-[#DC2626]' : 
                          isPending ? 'bg-[#FFF3EC] text-[#FC690A]' : 
                          'bg-[#F0FDF4] text-[#16A34A]'
  
  const iconName = isFailed ? 'close' : isPending ? 'sync' : 'check'
  
  const isSend = tx.type === 'send' || tx.type === 'offramp'
  const isReceive = tx.type === 'receive' || tx.type === 'claim' || tx.type === 'onramp'
  
  const sign = isSend ? '−' : isReceive ? '+' : ''
  const color = isReceive && isSuccess ? 'text-[#16A34A]' : isFailed ? 'text-on-surface-variant' : 'text-on-surface'

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-surface z-50 rounded-t-[32px] overflow-hidden flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        <div className="w-full flex justify-center pt-3 pb-2 pt-4">
          <div className="w-12 h-1.5 bg-outline-variant/30 rounded-full" />
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col items-center mb-8 relative">
            <button onClick={onClose} className="absolute -top-2 right-0 w-8 h-8 flex items-center justify-center bg-surface-container-low rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${iconCircleClass} ${isPending ? 'animate-pulse' : ''}`}>
              <span className={`material-symbols-outlined text-[32px] ${isPending ? 'animate-spin' : ''}`} style={{ fontVariationSettings: "'wght' 600" }}>{iconName}</span>
            </div>
            <span className={`font-label font-bold text-sm tracking-widest uppercase mb-2 ${isFailed ? 'text-[#DC2626]' : isPending ? 'text-[#FC690A]' : 'text-[#16A34A]'}`}>
              {tx.status}
            </span>
            <div className={`font-headline font-extrabold text-[36px] ${color}`}>
              {sign}{Number(tx.amount).toLocaleString()} {tx.asset}
            </div>
            <div className="font-body text-base text-on-surface-variant font-medium">
              ≈ ₦{tx.fiatValue.toLocaleString()}
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-[20px] p-5 shadow-sm space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-on-surface-variant">Type</span>
              <span className="font-headline font-bold text-sm text-on-surface uppercase">{tx.type}</span>
            </div>
            <div className="w-full h-px bg-outline-variant/10" />
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-on-surface-variant">{isSend ? 'To' : 'From'}</span>
              <span className="font-headline font-bold text-sm text-on-surface">{tx.counterparty}</span>
            </div>
            <div className="w-full h-px bg-outline-variant/10" />
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-on-surface-variant">Asset</span>
              <span className="font-headline font-bold text-sm text-on-surface">{tx.asset}</span>
            </div>
            <div className="w-full h-px bg-outline-variant/10" />
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-on-surface-variant">Fee</span>
              <span className="font-headline font-bold text-sm text-[#16A34A]">{tx.fee === 0 ? 'Free' : `< ₦0.01`}</span>
            </div>
            <div className="w-full h-px bg-outline-variant/10" />
            <div className="flex flex-col gap-1">
              <span className="font-body text-sm text-on-surface-variant">Date & Time</span>
              <span className="font-headline transform font-bold text-[13px] text-on-surface">{new Date(tx.timestamp).toLocaleString()}</span>
            </div>
            {tx.memo && (
              <>
                <div className="w-full h-px bg-outline-variant/10" />
                <div className="flex flex-col gap-1">
                  <span className="font-body text-sm text-on-surface-variant">Memo</span>
                  <span className="font-body text-[14px] text-on-surface">{tx.memo}</span>
                </div>
              </>
            )}
            <div className="w-full h-px bg-outline-variant/10 border-t border-dashed" />
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-on-surface-variant">Network Hash</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-on-surface font-semibold bg-surface-container py-1 px-2 rounded-md tracking-wider">
                  {tx.txHash.length > 20 ? `${tx.txHash.slice(0,6)}...${tx.txHash.slice(-4)}` : tx.txHash}
                </span>
                <button onClick={() => haptics.light()} className="text-[#FC690A] hover:bg-primary-container p-1.5 rounded-full transition-colors active:scale-95">
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 pb-8">
            <button onClick={() => { haptics.medium(); window.open('https://bantublockchain.org', '_blank') }} className="w-full h-[52px] rounded-full border-2 border-[#FC690A] text-[#FC690A] font-headline font-bold text-[15px] flex items-center justify-center gap-2 active:bg-primary-container transition-colors">
              View on Explorer
              <span className="material-symbols-outlined text-lg">open_in_new</span>
            </button>
            <button onClick={() => haptics.light()} className="w-full h-[52px] rounded-full bg-surface-container text-on-surface font-headline font-bold text-[15px] hover:bg-surface-container-high transition-colors active:scale-[0.98]">
              Share Receipt
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
