'use client'
import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { useWalletStore } from '@/store/wallet.store'
import { haptics } from '@/lib/haptics'

type BuyStep = 'amount' | 'market' | 'method' | 'match' | 'confirming' | 'success'

const P2P_ASSETS = ['XBN', 'USDC', 'BNR']

const P2P_MARKET: Record<string, { buyRate: number; peers: number; liquidityNGN: number; change24h: number }> = {
  XBN:  { buyRate: 0.105,  peers: 14, liquidityNGN: 62_000_000, change24h: +3.2 },
  USDC: { buyRate: 1_535,  peers: 8,  liquidityNGN: 95_000_000, change24h: 0.0  },
  BNR:  { buyRate: 0.102,  peers: 6,  liquidityNGN: 21_000_000, change24h: +1.8 },
}

const MOCK_PEER = {
  alias: 'Peer T-847',
  rating: 4.8,
  trades: 312,
  badge: 'Top Seller',
  bank: 'GTBank',
  accountNumber: '0123456789',
  accountName: 'Timbuktu Escrow Ltd',
}

function BuyPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { assets } = useWalletStore()

  const [selectedAsset, setSelectedAsset] = useState(searchParams.get('asset') ?? 'cNGN')
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<BuyStep>('amount')
  const [payMethod, setPayMethod] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(600)
  const [copied, setCopied] = useState(false)

  const isP2P = P2P_ASSETS.includes(selectedAsset)
  const market = P2P_MARKET[selectedAsset]
  const numAmount = Number(amount) || 0

  const receiveAmount = isP2P && market
    ? (numAmount / market.buyRate)
    : numAmount * 0.99

  const handleKey = (key: string) => {
    haptics.light()
    if (key === 'back') { setAmount(p => p.slice(0, -1)); return }
    if (key === '.' && amount.includes('.')) return
    if (amount.length >= 10) return
    setAmount(p => (p === '' && key === '0') ? '0' : p + key)
  }

  useEffect(() => {
    if (step !== 'match') return
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(t)
  }, [step])

  const fmtTimer = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleCopy = (text: string) => {
    haptics.light()
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handlePreview = () => {
    if (numAmount < 100) return
    haptics.medium()
    setStep(isP2P ? 'market' : 'method')
  }

  const handleAcceptRate = () => {
    haptics.medium()
    setStep('match')
    setCountdown(600)
  }

  const handlePaid = () => {
    haptics.success()
    setStep('confirming')
    setTimeout(() => setStep('success'), 3000)
  }

  const handleFiatContinue = () => {
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
          <motion.div key="amount" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="flex flex-col min-h-screen pb-36">
            <header className="flex items-center gap-3 px-6 pt-12 pb-5">
              <button onClick={() => { haptics.light(); router.back() }} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <div className="flex-1 flex justify-center">
                <div className="flex bg-surface-container rounded-full p-1 gap-0.5">
                  <span className="px-6 py-2 rounded-full bg-on-surface text-surface font-headline font-bold text-[14px]">Buy</span>
                  <button onClick={() => { haptics.light(); router.replace(`/sell?asset=${selectedAsset}`) }}
                    className="px-6 py-2 rounded-full text-on-surface-variant font-headline font-bold text-[14px] hover:text-on-surface transition-colors">
                    Sell
                  </button>
                </div>
              </div>
              <div className="w-10" />
            </header>

            {/* Asset picker */}
            <div className="px-6 mb-6">
              <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">Select asset to buy</p>
              <div className="flex gap-2 flex-wrap">
                {assets.map(a => (
                  <button
                    key={a.symbol}
                    onClick={() => { haptics.light(); setSelectedAsset(a.symbol); setAmount('') }}
                    className={`flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full font-label font-bold text-[13px] transition-all border ${selectedAsset === a.symbol ? 'bg-primary text-white border-primary shadow-sm' : 'bg-surface border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low'}`}
                  >
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
              <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-5">You pay (NGN)</p>

              <div className="text-center mb-2">
                {amount ? (
                  <span className="font-headline font-extrabold text-[52px] tracking-tight leading-none text-on-surface">
                    ₦{Number(amount).toLocaleString()}
                  </span>
                ) : (
                  <span className="font-headline font-extrabold text-[52px] tracking-tight leading-none text-on-surface-variant/25">₦0</span>
                )}
              </div>

              <p className="font-body text-[14px] text-on-surface-variant font-medium mb-2">
                ≈ {receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} <span className="font-headline font-bold text-on-surface">{selectedAsset}</span>
              </p>

              {isP2P && market && (
                <div className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full mb-5">
                  <span className="font-label font-bold text-[11px] text-on-surface-variant">Rate</span>
                  <span className="font-headline font-bold text-[13px] text-on-surface">₦{market.buyRate.toLocaleString()}/{selectedAsset}</span>
                  <span className={`font-label font-bold text-[11px] ${market.change24h >= 0 ? 'text-primary' : 'text-error'}`}>
                    {market.change24h >= 0 ? '+' : ''}{market.change24h}% 24h
                  </span>
                </div>
              )}

              {/* Quick presets */}
              <div className="flex gap-2 mb-6 flex-wrap justify-center">
                {['1000','5000','10000','50000'].map(p => (
                  <button key={p} onClick={() => { haptics.light(); setAmount(p) }}
                    className={`px-3 py-1.5 rounded-full font-label font-bold text-[11px] transition-colors ${amount === p ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                    ₦{Number(p).toLocaleString()}
                  </button>
                ))}
              </div>

              <Numpad onKey={handleKey} />
            </div>

            <div className="px-6 pt-6">
              <button disabled={numAmount < 100} onClick={handlePreview}
                className="w-full h-[56px] bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-[16px] rounded-full shadow-[0_4px_24px_rgba(252,105,10,0.25)] active:scale-95 transition-all disabled:opacity-30 disabled:shadow-none disabled:scale-100">
                {isP2P ? 'Check Market Rate' : 'Choose Payment Method'}
              </button>
              <p className="text-center font-body text-[12px] text-on-surface-variant/50 mt-3">Minimum: ₦1,000</p>
            </div>
          </motion.div>
        )}

        {/* ── MARKET (P2P) ────────────────────────────────────────── */}
        {step === 'market' && (
          <motion.div key="market" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex flex-col min-h-screen pb-36">
            <header className="flex items-center gap-3 px-6 pt-12 pb-5">
              <button onClick={() => { haptics.light(); setStep('amount') }} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <div className="flex-1">
                <h1 className="font-headline font-bold text-[22px] text-on-surface leading-tight">Market Rate</h1>
                <p className="font-body text-[12px] text-on-surface-variant">via Timbuktu P2P · {market?.peers} active peers</p>
              </div>
              <span className="font-label font-bold text-[10px] bg-primary/10 text-primary px-3 py-1.5 rounded-full uppercase tracking-widest animate-pulse">Live</span>
            </header>

            <main className="px-6 flex-1 space-y-4">
              {/* Order summary card */}
              <div className="bg-surface-container-lowest rounded-[24px] p-5 border border-outline-variant/10 shadow-sm">
                <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
                  <div>
                    <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">You pay</p>
                    <p className="font-headline font-bold text-[24px] text-on-surface">₦{numAmount.toLocaleString()}</p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant/30 text-[28px]">arrow_forward</span>
                  <div className="text-right">
                    <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">You receive</p>
                    <p className="font-headline font-bold text-[24px] text-primary">
                      {receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {selectedAsset}
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex justify-between items-center">
                  <span className="font-body text-[13px] text-on-surface-variant">Network fee</span>
                  <span className="font-headline font-bold text-[13px] text-primary">Free</span>
                </div>
              </div>

              {/* Rate card */}
              {market && (
                <div className="bg-surface rounded-[24px] p-5 border border-outline-variant/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">Best available buy rate</p>
                    <span className={`font-label font-bold text-[11px] px-2 py-1 rounded-full ${market.change24h >= 0 ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
                      {market.change24h >= 0 ? '▲' : '▼'} {Math.abs(market.change24h)}%
                    </span>
                  </div>
                  <p className="font-headline font-extrabold text-[40px] text-on-surface tracking-tight leading-none mb-1">
                    ₦{market.buyRate.toLocaleString()}
                  </p>
                  <p className="font-body text-[13px] text-on-surface-variant mb-5">per {selectedAsset}</p>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Active peers', value: String(market.peers) },
                      { label: 'Liquidity', value: `₦${(market.liquidityNGN / 1_000_000).toFixed(0)}M` },
                      { label: 'Avg. confirm', value: '~3 min' },
                    ].map(stat => (
                      <div key={stat.label} className="bg-surface-container-low rounded-2xl p-3 text-center">
                        <p className="font-headline font-bold text-[17px] text-on-surface">{stat.value}</p>
                        <p className="font-body text-[11px] text-on-surface-variant mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timbuktu info */}
              <div className="flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[20px]">handshake</span>
                </div>
                <div>
                  <p className="font-headline font-semibold text-[14px] text-on-surface">Powered by Timbuktu P2P</p>
                  <p className="font-body text-[12px] text-on-surface-variant font-medium">Escrow-protected · funds locked until both sides confirm</p>
                </div>
              </div>

              {/* Liquidity warning */}
              {numAmount > (market?.liquidityNGN ?? 0) ? (
                <div className="flex items-start gap-3 bg-error/5 border border-error/10 rounded-2xl p-4">
                  <span className="material-symbols-outlined text-error text-[20px] mt-0.5 flex-shrink-0">warning</span>
                  <p className="font-body text-[13px] text-error font-medium">Insufficient liquidity for this amount. Try a smaller order or check back later.</p>
                </div>
              ) : (
                <div className="flex items-start gap-3 bg-primary/5 border border-primary/10 rounded-2xl p-4">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 flex-shrink-0">check_circle</span>
                  <p className="font-body text-[13px] text-on-surface-variant font-medium">Sufficient liquidity available. Rate is locked for 30 s once you confirm.</p>
                </div>
              )}
            </main>

            <div className="px-6 pt-6">
              <button disabled={numAmount > (market?.liquidityNGN ?? 0)} onClick={handleAcceptRate}
                className="w-full h-[56px] bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-[16px] rounded-full shadow-[0_4px_24px_rgba(252,105,10,0.25)] active:scale-95 transition-all disabled:opacity-30 disabled:shadow-none">
                Accept Rate &amp; Match with Peer
              </button>
            </div>
          </motion.div>
        )}

        {/* ── MATCH (P2P) ──────────────────────────────────────────── */}
        {step === 'match' && (
          <motion.div key="match" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex flex-col min-h-screen pb-36">
            <header className="flex items-center gap-3 px-6 pt-12 pb-5">
              <div className="flex-1">
                <h1 className="font-headline font-bold text-[22px] text-on-surface">Order Matched</h1>
                <p className="font-body text-[12px] text-on-surface-variant">Transfer payment to the peer below</p>
              </div>
              {/* Countdown */}
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-full border ${countdown <= 60 ? 'border-error/30 bg-error/5' : 'border-outline-variant/20 bg-surface-container-low'}`}>
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">timer</span>
                <span className={`font-headline font-bold text-[16px] tabular-nums ${countdown <= 60 ? 'text-error' : 'text-on-surface'}`}>
                  {fmtTimer(countdown)}
                </span>
              </div>
            </header>

            <main className="px-6 flex-1 space-y-4">
              {/* Peer info */}
              <div className="bg-surface rounded-[24px] p-5 border border-outline-variant/10 shadow-sm">
                <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/10 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-headline font-bold text-[20px] text-primary">{MOCK_PEER.alias.charAt(5)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline font-bold text-[16px] text-on-surface">{MOCK_PEER.alias}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-label font-bold text-[12px] text-on-surface">{MOCK_PEER.rating}</span>
                      <span className="font-body text-[12px] text-on-surface-variant">· {MOCK_PEER.trades} trades</span>
                    </div>
                  </div>
                  <span className="font-label font-bold text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-full">{MOCK_PEER.badge}</span>
                </div>

                {/* Amount to pay */}
                <div className="bg-surface-container-lowest rounded-2xl px-5 py-4 mb-5">
                  <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Transfer exactly this amount</p>
                  <p className="font-headline font-extrabold text-[36px] text-on-surface tracking-tight leading-none">₦{numAmount.toLocaleString()}</p>
                  <p className="font-body text-[13px] text-on-surface-variant mt-1">
                    You'll receive {receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {selectedAsset}
                  </p>
                </div>

                {/* Bank details */}
                <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">Pay to this account</p>
                <div className="space-y-3">
                  {[
                    { label: 'Bank', value: MOCK_PEER.bank, copy: false },
                    { label: 'Account Number', value: MOCK_PEER.accountNumber, copy: true },
                    { label: 'Account Name', value: MOCK_PEER.accountName, copy: false },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center">
                      <span className="font-body text-[13px] text-on-surface-variant">{row.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-headline font-bold text-[14px] text-on-surface">{row.value}</span>
                        {row.copy && (
                          <button onClick={() => handleCopy(row.value)}
                            className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary active:scale-90 transition-transform">
                            <span className="material-symbols-outlined text-[14px]">{copied ? 'check' : 'content_copy'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-2xl p-4">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 flex-shrink-0">warning</span>
                <p className="font-body text-[13px] text-on-surface-variant font-medium leading-relaxed">
                  Only tap <strong className="text-on-surface">"I've Sent the Payment"</strong> after your bank transfer is complete. Tapping early may open a dispute.
                </p>
              </div>
            </main>

            <div className="px-6 pt-6">
              <button onClick={handlePaid}
                className="w-full h-[56px] bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-[16px] rounded-full shadow-[0_4px_24px_rgba(252,105,10,0.25)] active:scale-95 transition-all">
                I've Sent the Payment
              </button>
              <p className="text-center font-body text-[12px] text-on-surface-variant/50 mt-3">Order expires in {fmtTimer(countdown)}</p>
            </div>
          </motion.div>
        )}

        {/* ── METHOD (cNGN fiat) ───────────────────────────────────── */}
        {step === 'method' && (
          <motion.div key="method" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex flex-col min-h-screen pb-36">
            <header className="flex items-center gap-3 px-6 pt-12 pb-5">
              <button onClick={() => { haptics.light(); setStep('amount') }} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <h1 className="font-headline font-bold text-[22px] text-on-surface">Payment Method</h1>
            </header>

            <main className="px-6 flex-1 space-y-3">
              {/* Summary */}
              <div className="bg-surface-container-lowest rounded-[24px] p-5 border border-outline-variant/10 shadow-sm flex justify-between items-center mb-2">
                <div>
                  <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">You'll receive</p>
                  <p className="font-headline font-bold text-[28px] text-on-surface">{receiveAmount.toFixed(2)} cNGN</p>
                  <p className="font-body text-[12px] text-on-surface-variant mt-0.5">for ₦{numAmount.toLocaleString()}</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center font-headline font-extrabold text-primary text-[22px]">₦</div>
              </div>

              {[
                { id: 'bank', icon: 'account_balance', label: 'Bank Transfer', sub: 'Direct transfer from any Nigerian bank', fee: '0% fee', time: 'Instant', color: '#FC690A' },
                { id: 'card', icon: 'credit_card',     label: 'Debit / Credit Card', sub: 'Visa, Mastercard accepted', fee: '1.5% fee', time: 'Instant', color: '#FC690A' },
                { id: 'ussd', icon: 'dialpad',          label: 'USSD', sub: 'Works without internet', fee: '0% fee', time: '~2 min', color: '#FC690A' },
              ].map(m => (
                <button key={m.id} onClick={() => { haptics.light(); setPayMethod(m.id) }}
                  className={`w-full bg-surface rounded-[20px] p-4 flex items-center gap-4 transition-all border shadow-sm active:scale-[0.98] ${payMethod === m.id ? 'border-primary bg-primary/5' : 'border-outline-variant/10 hover:border-outline-variant/30 hover:bg-surface-container-lowest'}`}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${m.color}15` }}>
                    <span className="material-symbols-outlined" style={{ color: m.color }}>{m.icon}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-headline font-semibold text-[15px] text-on-surface">{m.label}</p>
                    <p className="font-body text-[12px] text-on-surface-variant mt-0.5">{m.sub}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-label font-bold text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{m.time}</span>
                      <span className="font-label font-bold text-[10px] text-on-surface-variant">{m.fee}</span>
                    </div>
                  </div>
                  {payMethod === m.id && <span className="material-symbols-outlined text-primary text-[22px] flex-shrink-0">check_circle</span>}
                </button>
              ))}
            </main>

            <div className="px-6 pt-6">
              <button disabled={!payMethod} onClick={handleFiatContinue}
                className="w-full h-[56px] bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-[16px] rounded-full shadow-[0_4px_24px_rgba(252,105,10,0.25)] active:scale-95 transition-all disabled:opacity-30 disabled:shadow-none">
                Continue
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
              <h2 className="font-headline font-bold text-[26px] text-on-surface mb-2">
                {isP2P ? 'Awaiting confirmation…' : 'Processing payment…'}
              </h2>
              <p className="font-body text-[14px] text-on-surface-variant leading-relaxed max-w-[260px] mx-auto">
                {isP2P
                  ? 'Your payment was sent. Waiting for the peer to confirm receipt. This typically takes 2–5 minutes.'
                  : 'Verifying your payment. cNGN will appear in your wallet shortly.'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant/50">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span className="font-label font-bold text-[11px] uppercase tracking-widest">
                {isP2P ? 'Escrow protected' : 'Secured by BantuPay'}
              </span>
            </div>
          </motion.div>
        )}

        {/* ── SUCCESS ─────────────────────────────────────────────── */}
        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col min-h-screen items-center justify-center px-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
              </div>
            </motion.div>

            <h1 className="font-headline font-extrabold text-[32px] text-on-surface mb-2 tracking-tight">Purchase complete!</h1>
            <p className="font-headline font-bold text-[26px] text-primary mb-1">
              {receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {selectedAsset}
            </p>
            <p className="font-body text-[14px] text-on-surface-variant mb-10">added to your wallet · paid ₦{numAmount.toLocaleString()}</p>

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

export default function BuyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <BuyPageInner />
    </Suspense>
  )
}
