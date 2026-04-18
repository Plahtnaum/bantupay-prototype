'use client'
import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { useWalletStore } from '@/store/wallet.store'
import { useUserStore } from '@/store/user.store'
import { haptics } from '@/lib/haptics'

type SellStep = 'amount' | 'market' | 'confirm' | 'awaiting' | 'method' | 'confirming' | 'success'

const P2P_ASSETS = ['XBN', 'USDC', 'BNR']

const P2P_MARKET: Record<string, { sellRate: number; peers: number; liquidityNGN: number; change24h: number }> = {
  XBN:  { sellRate: 0.095, peers: 14, liquidityNGN: 62_000_000, change24h: +3.2 },
  USDC: { sellRate: 1_510, peers: 8,  liquidityNGN: 95_000_000, change24h: 0.0  },
  BNR:  { sellRate: 0.088, peers: 6,  liquidityNGN: 21_000_000, change24h: +1.8 },
}

const MOCK_BUYER = {
  alias: 'Peer K-219',
  rating: 4.6,
  trades: 187,
  badge: 'Verified Buyer',
  avgConfirm: '~4 min',
}

function SellPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { assets } = useWalletStore()
  const { persona } = useUserStore()

  const [selectedAsset, setSelectedAsset] = useState(searchParams.get('asset') ?? 'cNGN')
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<SellStep>('amount')
  const [withdrawMethod, setWithdrawMethod] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(600)
  const [confirmed, setConfirmed] = useState(false)

  const isP2P = P2P_ASSETS.includes(selectedAsset)
  const market = P2P_MARKET[selectedAsset]
  const numAmount = Number(amount) || 0
  const assetObj = assets.find(a => a.symbol === selectedAsset)
  const walletBalance = assetObj?.balance ?? 0

  const ngnReceive = isP2P && market
    ? numAmount * market.sellRate
    : numAmount * 0.99

  // User's bank details (mock — persona-derived)
  const myBank = { bank: 'Access Bank', account: '0098765432', name: persona?.name ?? 'Bantu User' }

  const handleKey = (key: string) => {
    haptics.light()
    if (key === 'back') { setAmount(p => p.slice(0, -1)); return }
    if (key === '.' && amount.includes('.')) return
    if (amount.length >= 12) return
    setAmount(p => (p === '' && key === '0') ? '0' : p + key)
  }

  useEffect(() => {
    if (step !== 'awaiting') return
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(t)
  }, [step])

  const fmtTimer = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handlePreview = () => {
    if (!numAmount || numAmount > walletBalance) return
    haptics.medium()
    setStep(isP2P ? 'market' : 'method')
  }

  const handleAcceptRate = () => {
    haptics.medium()
    setStep('confirm')
  }

  const handleConfirmSell = () => {
    haptics.success()
    setStep('awaiting')
    setCountdown(600)
  }

  const handleConfirmReceived = () => {
    haptics.success()
    setConfirmed(true)
    setTimeout(() => setStep('success'), 1500)
  }

  const handleFiatWithdraw = () => {
    haptics.medium()
    setStep('confirming')
    setTimeout(() => setStep('success'), 2500)
  }

  const Numpad = ({ onKey }: { onKey: (k: string) => void }) => (
    <div className="grid grid-cols-3 gap-y-2 gap-x-6 max-w-[280px] w-full mx-auto">
      {['1','2','3','4','5','6','7','8','9'].map(d => (
        <button key={d} onClick={() => onKey(d)} className="h-14 rounded-2xl font-headline font-semibold text-[28px] text-on-surface hover:bg-surface-container active:scale-90 transition-all">{d}</button>
      ))}
      <button onClick={() => onKey('.')} className="h-14 rounded-2xl font-headline font-semibold text-[28px] text-on-surface hover:bg-surface-container active:scale-90 transition-all">.</button>
      <button onClick={() => onKey('0')} className="h-14 rounded-2xl font-headline font-semibold text-[28px] text-on-surface hover:bg-surface-container active:scale-90 transition-all">0</button>
      <button onClick={() => onKey('back')} className="h-14 rounded-2xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-90 transition-all">
        <span className="material-symbols-outlined text-[28px]">backspace</span>
      </button>
    </div>
  )

  return (
    <div className="bg-background min-h-screen text-on-background w-full max-w-[430px] mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── AMOUNT ──────────────────────────────────────────────── */}
        {step === 'amount' && (
          <motion.div key="amount" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="flex flex-col min-h-screen pb-12">
            <header className="flex items-center gap-3 px-6 pt-12 pb-5">
              <button onClick={() => { haptics.light(); router.back() }} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <div className="flex-1 flex justify-center">
                <div className="flex bg-surface-container rounded-full p-1 gap-0.5">
                  <button onClick={() => { haptics.light(); router.replace(`/buy?asset=${selectedAsset}`) }}
                    className="px-6 py-2 rounded-full text-on-surface-variant font-headline font-bold text-[14px] hover:text-on-surface transition-colors">
                    Buy
                  </button>
                  <span className="px-6 py-2 rounded-full bg-on-surface text-surface font-headline font-bold text-[14px]">Sell</span>
                </div>
              </div>
              <div className="w-10" />
            </header>

            {/* Asset picker */}
            <div className="px-6 mb-6">
              <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">Select asset to sell</p>
              <div className="flex gap-2 flex-wrap">
                {assets.map(a => (
                  <button key={a.symbol} onClick={() => { haptics.light(); setSelectedAsset(a.symbol); setAmount('') }}
                    className={`flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full font-label font-bold text-[13px] transition-all border ${selectedAsset === a.symbol ? 'bg-primary text-white border-primary shadow-sm' : 'bg-surface border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low'}`}>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center font-headline font-bold text-[11px] flex-shrink-0" style={{ backgroundColor: selectedAsset === a.symbol ? 'rgba(255,255,255,0.2)' : a.iconBg, color: selectedAsset === a.symbol ? 'white' : a.color }}>
                      {a.iconText}
                    </span>
                    {a.symbol}
                    {P2P_ASSETS.includes(a.symbol) && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none ${selectedAsset === a.symbol ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>P2P</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount display */}
            <div className="flex-1 flex flex-col items-center px-6">
              <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-5">You sell</p>

              <div className="text-center mb-1">
                {amount ? (
                  <span className="font-headline font-extrabold text-[52px] tracking-tight leading-none text-on-surface">
                    {Number(amount).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </span>
                ) : (
                  <span className="font-headline font-extrabold text-[52px] tracking-tight leading-none text-on-surface-variant/25">0</span>
                )}
                <span className="font-headline font-bold text-[20px] text-on-surface-variant ml-2">{selectedAsset}</span>
              </div>

              <p className="font-body text-[14px] text-on-surface-variant font-medium mb-2">
                ≈ <span className="font-headline font-bold text-on-surface">₦{ngnReceive.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span> you'll receive
              </p>

              {/* Balance pill */}
              <button onClick={() => { haptics.light(); setAmount(String(walletBalance)) }}
                className="flex items-center gap-1.5 bg-surface-container px-4 py-2 rounded-full mb-5 hover:bg-surface-container-high transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">account_balance_wallet</span>
                <span className="font-label font-bold text-[11px] text-on-surface-variant">Balance:</span>
                <span className="font-headline font-bold text-[13px] text-on-surface">{walletBalance.toLocaleString()} {selectedAsset}</span>
                <span className="font-label font-bold text-[10px] text-primary ml-1">MAX</span>
              </button>

              {isP2P && market && (
                <div className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full mb-5">
                  <span className="font-label font-bold text-[11px] text-on-surface-variant">Rate</span>
                  <span className="font-headline font-bold text-[13px] text-on-surface">₦{market.sellRate.toLocaleString()}/{selectedAsset}</span>
                  <span className={`font-label font-bold text-[11px] ${market.change24h >= 0 ? 'text-[#16A34A]' : 'text-error'}`}>
                    {market.change24h >= 0 ? '+' : ''}{market.change24h}% 24h
                  </span>
                </div>
              )}

              <Numpad onKey={handleKey} />
            </div>

            {numAmount > walletBalance && numAmount > 0 && (
              <p className="text-center font-label font-bold text-[12px] text-error px-6 mb-2">Insufficient balance</p>
            )}

            <div className="px-6 pt-4">
              <button disabled={!numAmount || numAmount > walletBalance} onClick={handlePreview}
                className="w-full h-[56px] bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-[16px] rounded-full shadow-[0_4px_24px_rgba(252,105,10,0.25)] active:scale-95 transition-all disabled:opacity-30 disabled:shadow-none disabled:scale-100">
                {isP2P ? 'Check Market Rate' : 'Choose Withdrawal Method'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── MARKET (P2P) ────────────────────────────────────────── */}
        {step === 'market' && (
          <motion.div key="market" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex flex-col min-h-screen pb-12">
            <header className="flex items-center gap-3 px-6 pt-12 pb-5">
              <button onClick={() => { haptics.light(); setStep('amount') }} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <div className="flex-1">
                <h1 className="font-headline font-bold text-[22px] text-on-surface leading-tight">Market Rate</h1>
                <p className="font-body text-[12px] text-on-surface-variant">via Timbuktu P2P · {market?.peers} active buyers</p>
              </div>
              <span className="font-label font-bold text-[10px] bg-[#16A34A]/10 text-[#16A34A] px-3 py-1.5 rounded-full uppercase tracking-widest animate-pulse">Live</span>
            </header>

            <main className="px-6 flex-1 space-y-4">
              {/* Order summary */}
              <div className="bg-surface-container-lowest rounded-[24px] p-5 border border-outline-variant/10 shadow-sm">
                <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
                  <div>
                    <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">You sell</p>
                    <p className="font-headline font-bold text-[24px] text-on-surface">
                      {numAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {selectedAsset}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant/30 text-[28px]">arrow_forward</span>
                  <div className="text-right">
                    <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">You receive</p>
                    <p className="font-headline font-bold text-[24px] text-[#16A34A]">
                      ₦{ngnReceive.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-[13px] text-on-surface-variant">Network fee</span>
                    <span className="font-headline font-bold text-[13px] text-[#16A34A]">Free</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-[13px] text-on-surface-variant">Escrow hold</span>
                    <span className="font-headline font-bold text-[13px] text-on-surface">Until buyer confirms</span>
                  </div>
                </div>
              </div>

              {/* Rate card */}
              {market && (
                <div className="bg-surface rounded-[24px] p-5 border border-outline-variant/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">Best available sell rate</p>
                    <span className={`font-label font-bold text-[11px] px-2 py-1 rounded-full ${market.change24h >= 0 ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-error/10 text-error'}`}>
                      {market.change24h >= 0 ? '▲' : '▼'} {Math.abs(market.change24h)}%
                    </span>
                  </div>
                  <p className="font-headline font-extrabold text-[40px] text-on-surface tracking-tight leading-none mb-1">
                    ₦{market.sellRate.toLocaleString()}
                  </p>
                  <p className="font-body text-[13px] text-on-surface-variant mb-5">per {selectedAsset}</p>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Active buyers', value: String(market.peers) },
                      { label: 'Buy liquidity', value: `₦${(market.liquidityNGN / 1_000_000).toFixed(0)}M` },
                      { label: 'Avg. payment', value: '~4 min' },
                    ].map(stat => (
                      <div key={stat.label} className="bg-surface-container-low rounded-2xl p-3 text-center">
                        <p className="font-headline font-bold text-[17px] text-on-surface">{stat.value}</p>
                        <p className="font-body text-[11px] text-on-surface-variant mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* How it works */}
              <div className="flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[20px]">handshake</span>
                </div>
                <div>
                  <p className="font-headline font-semibold text-[14px] text-on-surface">Powered by Timbuktu P2P</p>
                  <p className="font-body text-[12px] text-on-surface-variant font-medium">Your tokens are held in escrow until the buyer's payment lands in your account.</p>
                </div>
              </div>
            </main>

            <div className="px-6 pt-6">
              <button onClick={handleAcceptRate}
                className="w-full h-[56px] bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-[16px] rounded-full shadow-[0_4px_24px_rgba(252,105,10,0.25)] active:scale-95 transition-all">
                Accept Rate &amp; Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* ── CONFIRM SELL (P2P) ───────────────────────────────────── */}
        {step === 'confirm' && (
          <motion.div key="confirm" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex flex-col min-h-screen pb-12">
            <header className="flex items-center gap-3 px-6 pt-12 pb-5">
              <button onClick={() => { haptics.light(); setStep('market') }} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <h1 className="font-headline font-bold text-[22px] text-on-surface">Confirm Sale</h1>
            </header>

            <main className="px-6 flex-1 space-y-4">
              {/* Matched buyer */}
              <div className="bg-surface rounded-[24px] p-5 border border-outline-variant/10 shadow-sm">
                <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">Matched buyer</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#16A34A]/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-headline font-bold text-[20px] text-[#16A34A]">{MOCK_BUYER.alias.charAt(5)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline font-bold text-[16px] text-on-surface">{MOCK_BUYER.alias}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-[14px] text-[#F59E0B]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-label font-bold text-[12px] text-on-surface">{MOCK_BUYER.rating}</span>
                      <span className="font-body text-[12px] text-on-surface-variant">· {MOCK_BUYER.trades} trades</span>
                    </div>
                  </div>
                  <span className="font-label font-bold text-[10px] bg-[#16A34A]/10 text-[#16A34A] px-2.5 py-1 rounded-full">{MOCK_BUYER.badge}</span>
                </div>
              </div>

              {/* Order details */}
              <div className="bg-surface-container-lowest rounded-[24px] p-5 border border-outline-variant/10 shadow-sm space-y-4">
                {[
                  { label: 'You sell', value: `${numAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${selectedAsset}`, highlight: false },
                  { label: 'You receive', value: `₦${ngnReceive.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, highlight: true },
                  { label: 'Rate', value: `₦${market?.sellRate?.toLocaleString()}/${selectedAsset}`, highlight: false },
                  { label: 'Fee', value: 'Free', highlight: false },
                ].map((row, i, arr) => (
                  <div key={row.label}>
                    <div className="flex justify-between items-center">
                      <span className="font-body text-[13px] text-on-surface-variant">{row.label}</span>
                      <span className={`font-headline font-bold text-[15px] ${row.highlight ? 'text-[#16A34A]' : 'text-on-surface'}`}>{row.value}</span>
                    </div>
                    {i < arr.length - 1 && <div className="h-px bg-outline-variant/10 mt-4" />}
                  </div>
                ))}
              </div>

              {/* Escrow notice */}
              <div className="flex items-start gap-3 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-2xl p-4">
                <span className="material-symbols-outlined text-[#F59E0B] text-[20px] mt-0.5 flex-shrink-0">info</span>
                <p className="font-body text-[13px] text-on-surface-variant font-medium leading-relaxed">
                  Your <strong className="text-on-surface">{numAmount.toLocaleString()} {selectedAsset}</strong> will be held in escrow once you confirm. They're released only after you confirm the buyer's NGN payment has arrived.
                </p>
              </div>

              {/* Biometric confirm */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <button onClick={handleConfirmSell}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] flex items-center justify-center shadow-[0_8px_32px_rgba(252,105,10,0.3)] active:scale-90 transition-transform">
                  <span className="material-symbols-outlined text-white text-[40px]">fingerprint</span>
                </button>
                <p className="font-headline font-bold text-[14px] text-on-surface">Hold to confirm with biometrics</p>
              </div>
            </main>
          </motion.div>
        )}

        {/* ── AWAITING PAYMENT (P2P) ───────────────────────────────── */}
        {step === 'awaiting' && (
          <motion.div key="awaiting" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex flex-col min-h-screen pb-12">
            <header className="px-6 pt-12 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-headline font-bold text-[22px] text-on-surface">Awaiting Payment</h1>
                  <p className="font-body text-[12px] text-on-surface-variant">Buyer has {fmtTimer(countdown)} to pay you</p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-2 rounded-full border ${countdown <= 60 ? 'border-error/30 bg-error/5' : 'border-outline-variant/20 bg-surface-container-low'}`}>
                  <span className="material-symbols-outlined text-[14px] text-on-surface-variant">timer</span>
                  <span className={`font-headline font-bold text-[16px] tabular-nums ${countdown <= 60 ? 'text-error' : 'text-on-surface'}`}>
                    {fmtTimer(countdown)}
                  </span>
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center gap-2 mt-4">
                {['Tokens escrowed', 'Buyer paying', 'You confirm'].map((label, i) => (
                  <div key={label} className="flex items-center gap-2 flex-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-[#16A34A]' : i === 1 ? 'bg-primary animate-pulse' : 'bg-surface-container border-2 border-outline-variant/20'}`}>
                      {i === 0 ? (
                        <span className="material-symbols-outlined text-white text-[14px]">check</span>
                      ) : i === 1 ? (
                        <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span className="font-headline font-bold text-[11px] text-on-surface-variant">3</span>
                      )}
                    </div>
                    <span className={`font-label font-bold text-[10px] ${i <= 1 ? 'text-on-surface' : 'text-on-surface-variant/40'}`}>{label}</span>
                    {i < 2 && <div className="flex-1 h-px bg-outline-variant/20" />}
                  </div>
                ))}
              </div>
            </header>

            <main className="px-6 flex-1 space-y-4">
              {/* Sale summary */}
              <div className="bg-surface-container-lowest rounded-[24px] p-5 border border-outline-variant/10 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">Sold</span>
                  <span className="font-headline font-bold text-[18px] text-on-surface">{numAmount.toLocaleString()} {selectedAsset}</span>
                </div>
                <div className="h-px bg-outline-variant/10 mb-3" />
                <div className="flex justify-between items-center">
                  <span className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">Expecting</span>
                  <span className="font-headline font-bold text-[24px] text-[#16A34A]">₦{ngnReceive.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Your bank account — for buyer to pay */}
              <div className="bg-surface rounded-[24px] p-5 border border-outline-variant/10 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary text-[18px]">account_balance</span>
                  <p className="font-label font-bold text-[10px] text-primary uppercase tracking-widest">Buyer will pay to your account</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Your Bank', value: myBank.bank },
                    { label: 'Account Number', value: myBank.account },
                    { label: 'Account Name', value: myBank.name },
                    { label: 'Amount to receive', value: `₦${ngnReceive.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center">
                      <span className="font-body text-[13px] text-on-surface-variant">{row.label}</span>
                      <span className="font-headline font-bold text-[14px] text-on-surface">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instruction */}
              <div className="flex items-start gap-3 bg-error/5 border border-error/10 rounded-2xl p-4">
                <span className="material-symbols-outlined text-error text-[20px] mt-0.5 flex-shrink-0">warning</span>
                <p className="font-body text-[13px] text-on-surface-variant font-medium leading-relaxed">
                  Only tap <strong className="text-on-surface">"Confirm Receipt"</strong> after the ₦{ngnReceive.toLocaleString(undefined, { maximumFractionDigits: 2 })} has actually landed in your bank account. This releases your escrowed tokens to the buyer.
                </p>
              </div>
            </main>

            <div className="px-6 pt-6">
              <button onClick={handleConfirmReceived}
                className={`w-full h-[56px] font-headline font-bold text-[16px] rounded-full active:scale-95 transition-all ${confirmed ? 'bg-[#16A34A] text-white shadow-[0_4px_24px_rgba(22,163,74,0.3)]' : 'bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white shadow-[0_4px_24px_rgba(252,105,10,0.25)]'}`}>
                {confirmed ? 'Confirmed ✓' : "I've Received the Payment"}
              </button>
              <p className="text-center font-body text-[12px] text-on-surface-variant/50 mt-3">
                Tokens stay in escrow until you confirm
              </p>
            </div>
          </motion.div>
        )}

        {/* ── METHOD (cNGN off-ramp) ───────────────────────────────── */}
        {step === 'method' && (
          <motion.div key="method" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex flex-col min-h-screen pb-12">
            <header className="flex items-center gap-3 px-6 pt-12 pb-5">
              <button onClick={() => { haptics.light(); setStep('amount') }} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <h1 className="font-headline font-bold text-[22px] text-on-surface">Withdraw to</h1>
            </header>

            <main className="px-6 flex-1 space-y-3">
              {/* Summary */}
              <div className="bg-surface-container-lowest rounded-[24px] p-5 border border-outline-variant/10 shadow-sm flex justify-between items-center mb-2">
                <div>
                  <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">You'll receive</p>
                  <p className="font-headline font-bold text-[28px] text-[#16A34A]">₦{ngnReceive.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className="font-body text-[12px] text-on-surface-variant mt-0.5">for {numAmount.toLocaleString()} cNGN</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-[#EDE9FE] flex items-center justify-center font-headline font-extrabold text-[#7C3AED] text-[22px]">₦</div>
              </div>

              {[
                { id: 'gtbank',  icon: 'account_balance', label: 'GTBank', sub: 'GTBank •••• 4521', time: '~5 min', color: '#16A34A' },
                { id: 'opay',   icon: 'wallet',           label: 'OPay Wallet', sub: 'Linked OPay account', time: 'Instant', color: '#FC690A' },
                { id: 'access', icon: 'account_balance',  label: 'Access Bank', sub: 'Add account', time: '~10 min', color: '#2563EB' },
              ].map(m => (
                <button key={m.id} onClick={() => { haptics.light(); setWithdrawMethod(m.id) }}
                  className={`w-full bg-surface rounded-[20px] p-4 flex items-center gap-4 transition-all border shadow-sm active:scale-[0.98] ${withdrawMethod === m.id ? 'border-primary bg-primary/5' : 'border-outline-variant/10 hover:border-outline-variant/30 hover:bg-surface-container-lowest'}`}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${m.color}15` }}>
                    <span className="material-symbols-outlined" style={{ color: m.color }}>{m.icon}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-headline font-semibold text-[15px] text-on-surface">{m.label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-body text-[12px] text-on-surface-variant">{m.sub}</span>
                      <span className="font-label font-bold text-[10px] px-2 py-0.5 rounded-full bg-[#16A34A]/10 text-[#16A34A]">{m.time}</span>
                    </div>
                  </div>
                  {withdrawMethod === m.id && <span className="material-symbols-outlined text-primary text-[22px] flex-shrink-0">check_circle</span>}
                </button>
              ))}
            </main>

            <div className="px-6 pt-6">
              <button disabled={!withdrawMethod} onClick={handleFiatWithdraw}
                className="w-full h-[56px] bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-[16px] rounded-full shadow-[0_4px_24px_rgba(252,105,10,0.25)] active:scale-95 transition-all disabled:opacity-30 disabled:shadow-none">
                Confirm Withdrawal
              </button>
            </div>
          </motion.div>
        )}

        {/* ── CONFIRMING ──────────────────────────────────────────── */}
        {step === 'confirming' && (
          <motion.div key="confirming" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col min-h-screen items-center justify-center px-8 text-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-[26px] text-on-surface mb-2">Processing withdrawal…</h2>
              <p className="font-body text-[14px] text-on-surface-variant leading-relaxed max-w-[260px] mx-auto">
                Your cNGN is being converted. NGN will appear in your bank account shortly.
              </p>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant/50">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span className="font-label font-bold text-[11px] uppercase tracking-widest">Secured by BantuPay</span>
            </div>
          </motion.div>
        )}

        {/* ── SUCCESS ─────────────────────────────────────────────── */}
        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col min-h-screen items-center justify-center px-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="w-24 h-24 rounded-full bg-[#16A34A]/10 flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#16A34A] flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
              </div>
            </motion.div>

            <h1 className="font-headline font-extrabold text-[32px] text-on-surface mb-2 tracking-tight">
              {isP2P ? 'Sale complete!' : 'Withdrawal sent!'}
            </h1>
            <p className="font-headline font-bold text-[26px] text-[#16A34A] mb-1">
              ₦{ngnReceive.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="font-body text-[14px] text-on-surface-variant mb-10">
              {isP2P ? 'transferred to your bank account' : 'on its way to your bank · ~10 min'}
            </p>

            <div className="w-full space-y-3">
              <button onClick={() => { haptics.medium(); router.push('/home') }}
                className="w-full h-14 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-[15px] rounded-full shadow-[0_4px_16px_rgba(252,105,10,0.25)] active:scale-95 transition-transform">
                Back to Home
              </button>
              <button onClick={() => { haptics.light(); router.push('/activity') }}
                className="w-full h-14 text-on-surface-variant font-headline font-bold text-[13px] uppercase tracking-widest">
                View Activity
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

export default function SellPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <SellPageInner />
    </Suspense>
  )
}
