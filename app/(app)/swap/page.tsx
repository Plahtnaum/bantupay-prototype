'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { haptics } from '@/lib/haptics'
import { useWalletStore } from '@/store/wallet.store'

type SwapState = 'input' | 'confirm' | 'success'

export default function SwapPage() {
  const router = useRouter()
  const { assets } = useWalletStore()
  
  const [state, setState] = useState<SwapState>('input')
  const [payAssetIdx, setPayAssetIdx] = useState(0)
  const [receiveAssetIdx, setReceiveAssetIdx] = useState(1)
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const payAsset = assets[payAssetIdx] || assets[0]
  const receiveAsset = assets[receiveAssetIdx] || assets[1] || assets[0]
  
  // Mock exchange rate: 1 XBN = 142.77 cNGN (or similar)
  const rate = payAsset.symbol === 'XBN' ? 142.77 : 0.007
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
    setTimeout(() => {
        setIsProcessing(false)
        setState('success')
    }, 1500)
  }

  return (
    <div className="bg-background min-h-screen text-on-background pb-32 w-full max-w-[430px] mx-auto">
      <AnimatePresence mode="wait">
        {state === 'input' && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 pt-16">
            <header className="flex justify-between items-center mb-10">
              <h1 className="font-headline font-bold text-[28px] text-on-surface tracking-tight">Swap</h1>
              <button onClick={() => haptics.light()} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[20px]">settings</span>
              </button>
            </header>

            <main className="space-y-1 relative">
              {/* Pay Card */}
              <div className="bg-surface rounded-t-[24px] rounded-b-[4px] p-6 border border-outline-variant/10 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase">You pay</span>
                  <span className="font-label font-bold text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">Balance: {payAsset.balance.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-[40px] font-headline font-bold text-on-surface outline-none placeholder:text-on-surface/10"
                  />
                  <button onClick={() => haptics.light()} className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-full border border-outline-variant/10 hover:bg-surface-container transition-colors shadow-sm">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: payAsset.iconBg, color: payAsset.color }}>{payAsset.iconText}</div>
                    <span className="font-headline font-bold text-[14px]">{payAsset.symbol}</span>
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </button>
                </div>
                <p className="font-body text-[13px] text-on-surface-variant/60 font-medium mt-1">≈ {payAsset.fiatSymbol}{((parseFloat(amount)||0) * (payAsset.fiatValue / (payAsset.balance||1))).toLocaleString()}</p>
              </div>

              {/* Flip Button */}
              <div className="absolute left-1/2 -translate-x-1/2 top-[162px] -translate-y-1/2 z-10">
                 <button 
                  onClick={handleFlip}
                  className="w-10 h-10 bg-surface rounded-full shadow-lg border border-outline-variant/10 flex items-center justify-center text-primary active:scale-90 transition-transform group"
                 >
                    <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">swap_vert</span>
                 </button>
              </div>

              {/* Receive Card */}
              <div className="bg-surface rounded-b-[24px] rounded-t-[4px] p-6 border border-outline-variant/10 shadow-sm pt-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase">You receive</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 text-[40px] font-headline font-bold text-on-surface truncate">
                    {amount ? estimatedReceive : '0'}
                  </div>
                  <button onClick={() => haptics.light()} className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-full border border-outline-variant/10 hover:bg-surface-container transition-colors shadow-sm">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: receiveAsset.iconBg, color: receiveAsset.color }}>{receiveAsset.iconText}</div>
                    <span className="font-headline font-bold text-[14px]">{receiveAsset.symbol}</span>
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </button>
                </div>
                <p className="font-body text-[13px] text-on-surface-variant/60 font-medium mt-1">1 {payAsset.symbol} = {rate} {receiveAsset.symbol}</p>
              </div>
            </main>

            <section className="mt-8 space-y-4">
                <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/10 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[12px]">
                        <span className="text-on-surface-variant font-medium">Network fee</span>
                        <span className="text-on-surface font-bold text-[#16A34A]">&lt; ₦0.01</span>
                    </div>
                    <div className="flex justify-between items-center text-[12px]">
                        <span className="text-on-surface-variant font-medium">Slippage Tolerance</span>
                        <span className="text-on-surface font-bold">0.5%</span>
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                      disabled={!amount || parseFloat(amount) <= 0}
                      onClick={() => { haptics.medium(); setState('confirm') }}
                      className="w-full h-14 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-lg rounded-full shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:grayscale disabled:shadow-none"
                    >
                        Preview Swap
                    </button>
                </div>
            </section>
          </motion.div>
        )}

        {state === 'confirm' && (
           <motion.div key="confirm" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[100] bg-background flex flex-col pt-16">
                <header className="px-6 flex justify-between items-center mb-8">
                    <button onClick={() => setState('input')} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 className="font-headline font-bold text-[20px]">Confirm Swap</h2>
                    <div className="w-10" />
                </header>

                <main className="px-6 flex-1 space-y-6">
                    <div className="bg-surface rounded-[24px] p-6 border border-outline-variant/10 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <p className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Pay</p>
                                <p className="font-headline font-bold text-[24px] text-on-surface">{amount} {payAsset.symbol}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold" style={{ backgroundColor: payAsset.iconBg, color: payAsset.color }}>{payAsset.iconText}</div>
                        </div>

                        <div className="h-px bg-outline-variant/10 relative">
                             <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface p-1">
                                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">arrow_downward</span>
                             </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <p className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Receive (Estimated)</p>
                                <p className="font-headline font-bold text-[24px] text-[#16A34A]">≈ {estimatedReceive} {receiveAsset.symbol}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold" style={{ backgroundColor: receiveAsset.iconBg, color: receiveAsset.color }}>{receiveAsset.iconText}</div>
                        </div>
                    </div>

                    <div className="space-y-4 px-2">
                         <div className="flex justify-between items-center text-[13px]">
                             <span className="text-on-surface-variant font-medium">Exchange Rate</span>
                             <span className="text-on-surface font-bold font-mono">1 {payAsset.symbol} = {rate} {receiveAsset.symbol}</span>
                         </div>
                         <div className="flex justify-between items-center text-[13px]">
                             <span className="text-on-surface-variant font-medium">Price Impact</span>
                             <span className="text-[#16A34A] font-bold">0.05%</span>
                         </div>
                    </div>

                    <div className="pt-8 flex flex-col items-center gap-4">
                        <button 
                            onClick={handleSwap}
                            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 ${isProcessing ? 'bg-surface-container animate-pulse' : 'bg-primary shadow-primary/25'}`}
                        >
                            {isProcessing ? (
                                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            ) : (
                                <span className="material-symbols-outlined text-white text-3xl font-bold">face</span>
                            )}
                        </button>
                        <p className="font-headline font-bold text-[14px] text-on-surface">{isProcessing ? 'Processing Transaction...' : 'Hold for Biometric Swap'}</p>
                        <p className="font-body text-[11px] text-on-surface-variant/60 font-bold uppercase tracking-widest">Authorized by BantuPay Safe</p>
                    </div>
                </main>
           </motion.div>
        )}

        {state === 'success' && (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-background z-[110] flex flex-col items-center justify-center px-8">
                 <div className="w-24 h-24 bg-[#16A34A]/10 rounded-full flex items-center justify-center mb-8 relative">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-[#16A34A] rounded-full flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-3xl font-bold">check</span>
                    </motion.div>
                 </div>

                 <h1 className="font-headline font-extrabold text-[32px] text-on-surface text-center mb-2 tracking-tight">Swap complete!</h1>
                 <p className="font-body text-[15px] text-on-surface-variant text-center leading-relaxed mb-10 max-w-[280px]">
                    Successfully exchanged {amount} {payAsset.symbol} for {estimatedReceive} {receiveAsset.symbol}.
                 </p>

                 <div className="w-full space-y-3">
                    <button onClick={() => { haptics.light(); router.push('/home') }} className="w-full h-14 bg-surface-container text-on-surface font-headline font-bold text-[15px] rounded-full active:scale-95 transition-transform border border-outline-variant/10">
                        Back to Home
                    </button>
                    <button onClick={() => { haptics.light(); setState('input'); setAmount('') }} className="w-full h-14 text-on-surface-variant font-headline font-bold text-[13px] uppercase tracking-widest">
                        New Swap
                    </button>
                 </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
