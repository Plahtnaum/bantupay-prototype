'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/user.store'
import { useWalletStore } from '@/store/wallet.store'
import { haptics } from '@/lib/haptics'
import { QRCodeSVG } from 'qrcode.react'

function formatRelative(d: Date) {
  const ms = Date.now() - d.getTime();
  const min = Math.floor(ms / 60000);
  if (min < 60) return `${min || 1} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  return `${Math.floor(hr / 24)} days ago`;
}

export default function MerchantPage() {
  const router = useRouter()
  const { persona } = useUserStore()
  const { transactions } = useWalletStore()
  const [showQr, setShowQr] = useState(false)
  const [copied, setCopied] = useState(false)

  // Filter only merchant received transactions for live feed
  const recentPayments = transactions.filter(tx => tx.type === 'receive' || tx.type === 'onramp').slice(0, 10)
  const todayRevenue = recentPayments.reduce((acc, curr) => acc + curr.fiatValue, 0)
  
  if (showQr) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-white flex flex-col items-center pt-24 px-6 overflow-hidden">
        <button onClick={() => { haptics.light(); setShowQr(false) }} className="absolute top-16 left-6 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container active:scale-95 transition-all text-on-surface">
          <span className="material-symbols-outlined">close</span>
        </button>

        <h1 className="font-headline font-semibold text-[20px] text-center text-on-surface">Scan to pay {persona?.name || 'Store'}</h1>
        <p className="font-body text-[12px] text-on-surface-variant text-center mt-1">Powered by BantuPay</p>

        <div className="mt-12 mb-8 bg-white p-4 rounded-3xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] border border-outline-variant/10">
          <QRCodeSVG value={`bantupay:${persona?.walletAddress}`} size={280} fgColor="#0F0F0F" className="rounded-2xl overflow-hidden" />
        </div>

        <p className="font-mono font-bold text-[20px] text-on-surface text-center mb-8 tracking-tight">
          {persona?.handle}
        </p>

        <div className="flex gap-4">
          <button onClick={() => haptics.medium()} className="w-12 h-12 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center active:scale-95 transition-transform hover:bg-surface-container">
            <span className="material-symbols-outlined">light_mode</span>
          </button>
          <button onClick={() => haptics.light()} className="w-12 h-12 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center active:scale-95 transition-transform hover:bg-surface-container">
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="bg-background min-h-screen text-on-background pb-32 w-full max-w-[430px] mx-auto">
      <header className="px-6 pt-12 pb-4">
        <button onClick={() => { haptics.light(); router.back() }} className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface transition-colors mb-3">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span className="font-label font-bold text-[13px]">Back</span>
        </button>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">storefront</span>
            </div>
            <h1 className="font-headline font-bold text-[20px] text-on-surface">{persona?.name || 'My Business'}</h1>
          </div>
          <button onClick={() => haptics.light()} className="text-on-surface hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-[28px]">menu</span>
          </button>
        </div>
      </header>

      <main className="px-6 pt-4 space-y-6">
        <div className="bg-surface rounded-[24px] shadow-sm border border-outline-variant/10 p-5">
          <span className="font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase">Today's Revenue</span>
          <div className="flex justify-between items-baseline mt-1 mb-4">
            <h2 className="font-headline font-bold text-[36px] text-on-surface">₦{todayRevenue.toLocaleString()}</h2>
            <span className="font-label font-bold text-[13px] text-primary flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              12% vs yesterday
            </span>
          </div>

          <div className="w-full h-px bg-outline-variant/20 mb-4" />

          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-headline font-bold text-[15px] text-on-surface">{recentPayments.length} payments</span>
              <span className="font-body text-[11px] text-on-surface-variant font-medium">₦{(todayRevenue / (recentPayments.length || 1)).toFixed(0)} avg</span>
            </div>
            <div className="w-px h-8 bg-outline-variant/20" />
            <div className="flex flex-col">
              <span className="font-headline font-bold text-[15px] text-on-surface">{Math.max(1, recentPayments.length - 2)} unique</span>
              <span className="font-body text-[11px] text-on-surface-variant font-medium">customers</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => { haptics.medium(); setShowQr(true) }} className="bg-primary-container text-primary rounded-[16px] p-3 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform hover:opacity-90 shadow-sm border border-primary/20">
            <span className="material-symbols-outlined text-[24px] mb-1">qr_code</span>
            <span className="font-label font-bold text-[11px] text-center w-full">Show my QR</span>
          </button>
          <button onClick={() => { haptics.light(); router.push('/receive') }} className="bg-surface rounded-[16px] p-3 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform border border-outline-variant/20 hover:border-outline-variant shadow-sm">
            <span className="material-symbols-outlined text-[24px] text-on-surface mb-1">receipt_long</span>
            <span className="font-label font-bold text-[11px] text-on-surface text-center w-full">Create Invoice</span>
          </button>
          <button onClick={() => { haptics.light(); router.push('/cashout') }} className="bg-surface rounded-[16px] p-3 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform border border-outline-variant/20 hover:border-outline-variant shadow-sm">
            <span className="material-symbols-outlined text-[24px] text-on-surface mb-1">payments</span>
            <span className="font-label font-bold text-[11px] text-on-surface text-center w-full">Cash Out</span>
          </button>
        </div>

        <section className="bg-surface rounded-[24px] p-5 shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h3 className="font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase">Recent Payments</h3>
          </div>

          <div className="flex flex-col">
            <AnimatePresence>
              {recentPayments.length === 0 ? (
                <div className="py-6 text-center text-on-surface-variant font-body text-[14px]">No payments today.</div>
              ) : (
                recentPayments.map((tx, idx) => (
                  <motion.div key={tx.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} layout className="flex items-center gap-3 py-3 border-b border-outline-variant/10 last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface font-headline font-bold text-[14px]">
                      {tx.counterparty.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-headline font-semibold text-[14px] text-on-surface truncate">{tx.counterparty}</p>
                      <p className="font-body text-[12px] text-on-surface-variant truncate">{formatRelative(new Date(tx.timestamp))}</p>
                    </div>
                    <div className="text-right flex items-center gap-2">
                       <span className="font-headline font-bold text-[14px] text-[#FC690A]">+{tx.fiatValue.toLocaleString()} ₦</span>
                       <span className="material-symbols-outlined text-[16px] text-primary font-bold">check</span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

        <section className="bg-surface rounded-[24px] p-5 shadow-sm border border-outline-variant/10 h-[180px] flex col flex-col">
          <h3 className="font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase mb-4">This Week</h3>
          <div className="flex-1 flex items-end justify-between gap-2 px-2 mt-auto pb-2">
            {/* Mock Weekly Chart */}
            {[40, 70, 30, 90, 60, 50, 100].map((h, i) => (
              <div key={i} className="w-8 flex flex-col items-center justify-end gap-2 h-full">
                <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.1 }} className="w-full bg-[#FC690A] rounded-t-sm opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
