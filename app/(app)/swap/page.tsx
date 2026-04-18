'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { haptics } from '@/lib/haptics'
import { useWalletStore } from '@/store/wallet.store'
import { type Asset } from '@/mock/assets'

type SwapState = 'input' | 'confirm' | 'success'

// Cross-asset exchange rates
const RATES: Record<string, Record<string, number>> = {
  XBN:  { cNGN: 142.77, USDC: 0.069, BNR: 17.2  },
  cNGN: { XBN: 0.0070, USDC: 0.000475, BNR: 0.12  },
  USDC: { cNGN: 1620,  XBN: 14.4,  BNR: 180    },
  BNR:  { cNGN: 0.82,  XBN: 0.058, USDC: 0.0055 },
}

function getRate(from: string, to: string) {
  return RATES[from]?.[to] ?? 1
}

function AssetPicker({ assets, excludeSymbol, onSelect, onClose }: {
  assets: Asset[]
  excludeSymbol: string
  onSelect: (idx: number) => void
  onClose: () => void
}) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-surface rounded-t-[32px] z-50 pb-10">
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-12 h-1.5 bg-outline-variant/30 rounded-full" />
        </div>
        <h3 className="font-headline font-bold text-[18px] text-on-surface px-6 mb-4">Select asset</h3>
        {assets.map((a: Asset, idx: number) => (
          a.symbol === excludeSymbol ? null : (
            <button key={a.id} onClick={() => { onSelect(idx); onClose() }}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-surface-container transition-colors active:scale-[0.98]">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[15px]" style={{ backgroundColor: a.iconBg, color: a.color }}>{a.iconText}</div>
              <div className="flex-1 text-left">
                <p className="font-headline font-bold text-[15px] text-on-surface">{a.symbol}</p>
                <p className="font-body text-[12px] text-on-surface-variant">{a.name}</p>
              </div>
              <p className="font-headline font-bold text-[14px] text-on-surface">{a.balance.toLocaleString()}</p>
            </button>
          )
        ))}
      </motion.div>
    </>
  )
}

export default function SwapPage() {
  const router = useRouter()
  const { assets } = useWalletStore()

  const [state, setState] = useState<SwapState>('input')
  const [payAssetIdx, setPayAssetIdx] = useState(0)
  const [receiveAssetIdx, setReceiveAssetIdx] = useState(1)
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPayPicker, setShowPayPicker] = useState(false)
  const [showReceivePicker, setShowReceivePicker] = useState(false)

  const payAsset = assets[payAssetIdx] || assets[0]
  const receiveAsset = assets[receiveAssetIdx] || assets[1] || assets[0]
  const rate = getRate(payAsset.symbol, receiveAsset.symbol)
  const estimatedReceive = amount ? (parseFloat(amount) * rate).toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0'

  const handleFlip = () => {
    haptics.medium()
    const oldPay = payAssetIdx
    setPayAssetIdx(receiveAssetIdx)
    setReceiveAssetIdx(oldPay)
    setAmount('')
  }


  const handleSwap = () => {
    haptics.success()
    setIsProcessing(true)
    setTimeout(() => { setIsProcessing(false); setState('success') }, 1500)
  }

  return (
    <div className="bg-background min-h-screen text-on-background w-full max-w-[430px] mx-auto">
      <AnimatePresence>
        {showPayPicker && (
          <AssetPicker key="payPicker" assets={assets} excludeSymbol={receiveAsset.symbol}
            onSelect={setPayAssetIdx} onClose={() => setShowPayPicker(false)} />
        )}
        {showReceivePicker && (
          <AssetPicker key="receivePicker" assets={assets} excludeSymbol={payAsset.symbol}
            onSelect={setReceiveAssetIdx} onClose={() => setShowReceivePicker(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* INPUT */}
        {state === 'input' && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 pt-12 pb-8">
            <header className="flex justify-between items-center mb-8">
              <button onClick={() => { haptics.light(); router.back() }} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <div className="text-center">
                <h1 className="font-headline font-bold text-[22px] text-on-surface">Swap</h1>
                <p className="font-body text-[12px] text-on-surface-variant">Exchange instantly with zero slippage</p>
              </div>
              <button onClick={() => haptics.light()} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[20px]">settings</span>
              </button>
            </header>

            <main className="space-y-1 relative">
              {/* FROM card */}
              <div className="bg-surface rounded-t-[24px] rounded-b-[4px] p-5 border border-outline-variant/10 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase">You swap</span>
                  <button onClick={() => { haptics.light(); setAmount(payAsset.balance.toString()) }}
                    className="font-label font-bold text-[11px] text-primary bg-primary/10 px-2.5 py-1 rounded-full hover:opacity-80">
                    Balance: {payAsset.balance.toLocaleString()}
                  </button>
                </div>

                {/* Asset selector — prominent, full row */}
                <button
                  onClick={() => { haptics.light(); setShowPayPicker(true) }}
                  className="w-full flex items-center gap-3 bg-surface-container rounded-2xl px-4 py-3.5 mb-4 hover:bg-surface-container-high transition-colors active:scale-[0.98] border border-outline-variant/10"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[14px] flex-shrink-0"
                    style={{ backgroundColor: payAsset.iconBg, color: payAsset.color }}>
                    {payAsset.iconText}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-headline font-bold text-[18px] text-on-surface leading-none">{payAsset.symbol}</p>
                    <p className="font-body text-[12px] text-on-surface-variant mt-0.5">{payAsset.name}</p>
                  </div>
                  <span className="material-symbols-outlined text-[22px] text-on-surface-variant">expand_more</span>
                </button>

                {/* Amount */}
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-[44px] font-headline font-bold text-on-surface outline-none placeholder:text-on-surface/15"
                />
                <p className="font-body text-[13px] text-on-surface-variant/60 mt-1">
                  ≈ {payAsset.fiatSymbol}{((parseFloat(amount)||0) * (payAsset.fiatValue / (payAsset.balance||1))).toLocaleString()}
                </p>
              </div>

              {/* Flip button */}
              <div className="flex justify-center py-1 relative z-10">
                <button
                  onClick={handleFlip}
                  className="w-10 h-10 bg-surface rounded-full shadow-md border border-outline-variant/10 flex items-center justify-center text-primary active:scale-90 transition-transform hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[20px]">swap_vert</span>
                </button>
              </div>

              {/* TO card */}
              <div className="bg-surface rounded-t-[4px] rounded-b-[24px] p-5 border border-outline-variant/10 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase">You get</span>
                </div>

                {/* Asset selector — prominent, full row */}
                <button
                  onClick={() => { haptics.light(); setShowReceivePicker(true) }}
                  className="w-full flex items-center gap-3 bg-surface-container rounded-2xl px-4 py-3.5 mb-4 hover:bg-surface-container-high transition-colors active:scale-[0.98] border border-outline-variant/10"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[14px] flex-shrink-0"
                    style={{ backgroundColor: receiveAsset.iconBg, color: receiveAsset.color }}>
                    {receiveAsset.iconText}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-headline font-bold text-[18px] text-on-surface leading-none">{receiveAsset.symbol}</p>
                    <p className="font-body text-[12px] text-on-surface-variant mt-0.5">{receiveAsset.name}</p>
                  </div>
                  <span className="material-symbols-outlined text-[22px] text-on-surface-variant">expand_more</span>
                </button>

                {/* Estimated receive */}
                <p className="text-[44px] font-headline font-bold text-primary leading-none mb-1">
                  {amount ? estimatedReceive : '0'}
                </p>
                <p className="font-body text-[13px] text-on-surface-variant/60">
                  1 {payAsset.symbol} = {rate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {receiveAsset.symbol}
                </p>
              </div>
            </main>

            <section className="mt-6 space-y-4">
              <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/10 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-on-surface-variant font-medium">Network fee</span>
                  <span className="text-[#16A34A] font-bold">&lt; ₦0.01</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-on-surface-variant font-medium">Slippage Tolerance</span>
                  <span className="text-on-surface font-bold">0.5%</span>
                </div>
              </div>

              <button
                disabled={!amount || parseFloat(amount) <= 0}
                onClick={() => { haptics.medium(); setState('confirm') }}
                className="w-full h-14 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-lg rounded-full shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:grayscale disabled:shadow-none"
              >
                Swap Now
              </button>

              <p className="text-center font-body text-[11px] text-on-surface-variant/50">
                By swapping, you agree to BantuPay's Terms of Service and decentralised liquidity protocols.
              </p>
            </section>
          </motion.div>
        )}

        {/* CONFIRM */}
        {state === 'confirm' && (
          <motion.div key="confirm" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="fixed inset-0 z-[100] bg-background flex flex-col pt-16 max-w-[430px] mx-auto">
            <header className="px-6 flex justify-between items-center mb-8">
              <button onClick={() => setState('input')} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h2 className="font-headline font-bold text-[20px] text-on-surface">Confirm Swap</h2>
              <div className="w-10" />
            </header>

            <main className="px-6 flex-1 space-y-6">
              <div className="bg-surface rounded-[24px] p-6 border border-outline-variant/10 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">You pay</p>
                    <p className="font-headline font-bold text-[24px] text-on-surface">{amount} {payAsset.symbol}</p>
                    <p className="font-body text-[12px] text-on-surface-variant">≈ {payAsset.fiatSymbol}{((parseFloat(amount)||0) * (payAsset.fiatValue / (payAsset.balance||1))).toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-[15px]" style={{ backgroundColor: payAsset.iconBg, color: payAsset.color }}>{payAsset.iconText}</div>
                </div>

                <div className="h-px bg-outline-variant/10 relative">
                  <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface p-1">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">arrow_downward</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">You receive (estimated)</p>
                    <p className="font-headline font-bold text-[24px] text-[#16A34A]">≈ {estimatedReceive} {receiveAsset.symbol}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-[15px]" style={{ backgroundColor: receiveAsset.iconBg, color: receiveAsset.color }}>{receiveAsset.iconText}</div>
                </div>
              </div>

              <div className="space-y-3 px-2">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-on-surface-variant font-medium">Exchange Rate</span>
                  <span className="text-on-surface font-bold font-mono">1 {payAsset.symbol} = {rate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {receiveAsset.symbol}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-on-surface-variant font-medium">Price Impact</span>
                  <span className="text-[#16A34A] font-bold">&lt;0.01%</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-on-surface-variant font-medium">Network fee</span>
                  <span className="text-[#16A34A] font-bold">&lt; ₦0.01</span>
                </div>
              </div>

              <p className="font-label font-bold text-[10px] text-on-surface-variant/50 uppercase tracking-widest text-center animate-pulse">
                Rate valid for 30 seconds
              </p>

              <div className="flex flex-col items-center gap-3 pt-4">
                <button onClick={handleSwap} disabled={isProcessing}
                  className={`w-[80px] h-[80px] rounded-full flex items-center justify-center transition-all ${isProcessing ? 'bg-surface-container animate-pulse' : 'bg-primary/10 text-primary hover:scale-105'} active:scale-95`}>
                  {isProcessing
                    ? <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    : <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'wght' 200" }}>fingerprint</span>
                  }
                </button>
                <p className="font-headline font-bold text-[14px] text-on-surface">{isProcessing ? 'Processing…' : 'Confirm with Face ID'}</p>
              </div>
            </main>
          </motion.div>
        )}

        {/* SUCCESS */}
        {state === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-background z-[110] flex flex-col items-center justify-center px-8 max-w-[430px] mx-auto">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-20 h-20 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center mb-6">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>check</span>
              </div>
            </motion.div>

            <h1 className="font-headline font-extrabold text-[32px] text-on-surface text-center mb-2 tracking-tight">Swap complete!</h1>
            <p className="font-label font-bold text-[11px] text-primary uppercase tracking-widest mb-8">Transaction confirmed</p>

            <div className="w-full bg-surface rounded-[24px] p-5 border border-outline-variant/10 shadow-sm mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">From</p>
                  <p className="font-headline font-bold text-[20px] text-on-surface">{amount} {payAsset.symbol}</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant/30 text-[24px]">arrow_forward</span>
                <div className="text-right">
                  <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">To</p>
                  <p className="font-headline font-bold text-[20px] text-primary">{estimatedReceive} {receiveAsset.symbol}</p>
                </div>
              </div>
              <div className="h-px bg-outline-variant/10 mb-4" />
              <div className="flex justify-between items-center text-[12px] mb-2">
                <span className="text-on-surface-variant">Network Fee</span>
                <span className="text-[#16A34A] font-bold">&lt; ₦0.01</span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-on-surface-variant">Transaction Hash</span>
                <span className="font-mono text-[11px] text-on-surface font-bold bg-surface-container px-2 py-0.5 rounded">
                  {`0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 6)}`}
                </span>
              </div>
            </div>

            <div className="w-full space-y-3">
              <button onClick={() => haptics.light()} className="w-full h-14 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-[15px] rounded-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95">
                <span className="material-symbols-outlined text-[18px]">ios_share</span>
                Share Receipt
              </button>
              <button onClick={() => { haptics.light(); router.push('/home') }} className="w-full h-14 bg-surface-container text-on-surface font-headline font-bold text-[15px] rounded-full active:scale-95 transition-transform border border-outline-variant/10">
                Back to Home
              </button>
              <button onClick={() => { haptics.light(); setState('input'); setAmount('') }} className="w-full h-12 text-on-surface-variant font-headline font-bold text-[13px] uppercase tracking-widest">
                New Swap
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
