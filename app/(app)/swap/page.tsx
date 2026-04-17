'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { haptics } from '@/lib/haptics'

type SwapState = 'input' | 'confirm' | 'success'

export default function SwapPage() {
  const router = useRouter()
  const [state, setState] = useState<SwapState>('input')
  const [isFlipped, setIsFlipped] = useState(false)
  const [amount, setAmount] = useState('450.00')

  // Derived values for prototype
  const payAsset = isFlipped ? 'cNGN' : 'XBN'
  const payBalance = isFlipped ? '150,000.00' : '1,240.50'
  const payAmount = amount
  const payFiat = '≈ $42.15 USD'
  const payIcon = isFlipped ? '₦' : 'XBN'
  const payColor = isFlipped ? 'bg-blue-500' : 'bg-[#FC690A]'

  const receiveAsset = isFlipped ? 'XBN' : 'cNGN'
  const receiveAmount = isFlipped ? (Number(amount) / 142.77).toFixed(2) : '64,250.00'
  const receiveIcon = isFlipped ? 'XBN' : '₦'
  const receiveColor = isFlipped ? 'bg-[#FC690A]' : 'bg-blue-500'
  const rateText = isFlipped ? '1 cNGN = 0.007 XBN' : '1 XBN = 142.77 cNGN'

  const handleFlip = () => {
    haptics.medium()
    setIsFlipped(!isFlipped)
    setAmount('')
  }

  const handleConfirm = () => {
    haptics.medium()
    setState('success')
  }

  return (
    <div className="min-h-screen bg-bg-base relative pt-24 pb-32">
      <header className="fixed top-0 w-full max-w-[430px] z-20 bg-[#F5F6FA]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest border border-outline-variant/30">
            <img alt="User Profile Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUqwit_yyHudJpED_gELyJZ7x51UH12dR-hR_XFVesaQqhUtPFU7j3VHB4ZwVnH2olU5ekcrCEYB8KNGmT8VjTYDMpgEzP7GrWnf6k9-TiYK6tJE_NwUXrn9pxcKu3GiVcCmyq1qtGCzIKiw2cpPr-Fb9AVwaQf00JKLAKpymdKGna3s-M0RJDjrX4pqmxkEQJO63UQDntMph63G05Jb8lRJ7yegjPSsucxj7tHQWv6XSJ1gLF5hfb1iA7Lt4heQUSGDla6fsfWQ" />
          </div>
          <span className="font-headline font-black text-xl text-[#FC690A] tracking-tighter">BantuPay</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-500 hover:opacity-80 transition-opacity" onClick={() => haptics.light()}>
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button className="text-slate-500 hover:opacity-80 transition-opacity" onClick={() => haptics.light()}>
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {state === 'success' ? (
          <motion.main
            key="success"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-6 mt-12"
          >
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute w-40 h-40 border border-primary/20 rounded-full animate-ping opacity-50" />
              <div className="w-24 h-24 bg-gradient-to-br from-[#FC690A] to-[#D4560A] rounded-full flex items-center justify-center shadow-brand">
                <span className="material-symbols-outlined text-white text-5xl font-bold" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-4">Swap complete!</h1>
            <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-10 border border-primary/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Transaction Confirmed
            </div>
            
            <div className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm mb-12">
              <div className="space-y-6 text-left relative">
                <div className="absolute right-4 top-4 opacity-10">
                  <span className="material-symbols-outlined text-[100px]">sync_alt</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">From</p>
                  <p className="text-3xl font-headline font-bold text-on-surface flex items-baseline gap-2">
                    {payAmount} <span className="text-lg font-medium text-slate-500">{payAsset}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">To</p>
                  <p className="text-3xl font-headline font-bold text-primary flex items-baseline gap-2">
                    {receiveAmount} <span className="text-lg font-medium text-primary/80">{receiveAsset}</span>
                  </p>
                </div>
                <div className="h-px w-full bg-outline-variant/30 my-4" />
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Network Fee</span>
                    <span className="font-mono text-on-surface font-bold">0.00045 XBN</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Transaction Hash</span>
                    <span className="font-mono text-primary font-bold">8xK2...R9e1</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full space-y-4">
              <button className="w-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white py-4 rounded-full font-bold text-lg shadow-brand flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[20px]">share</span>
                Share Receipt
              </button>
              <button onClick={() => { haptics.light(); setState('input'); setAmount(''); router.push('/home') }} className="w-full bg-surface-container-high text-on-surface font-bold py-4 rounded-full active:scale-95 transition-transform">
                Back to Home
              </button>
            </div>
          </motion.main>
        ) : (
          <motion.main key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6">
            <div className="mb-8">
              <h1 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface">Swap</h1>
              <p className="text-on-surface-variant text-sm mt-1">Exchange assets instantly with zero slippage</p>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="p-6 bg-surface-container-low/30">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">You pay</span>
                  <span className="text-xs font-medium text-[#FC690A] bg-[#FC690A]/10 px-2 py-1 rounded-full">Balance: {payBalance}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-transparent border-none p-0 focus:ring-0 text-4xl font-headline font-bold text-on-surface w-full outline-none"
                  />
                  <button className="flex items-center gap-2 bg-white flex-shrink-0 shadow-sm border border-outline-variant/20 px-3 py-2 rounded-full hover:bg-surface-container-low transition-colors">
                    <div className={`w-6 h-6 rounded-full ${payColor} flex items-center justify-center text-[10px] font-bold text-white`}>{payIcon}</div>
                    <span className="font-bold text-sm">{payAsset}</span>
                    <span className="material-symbols-outlined text-sm">expand_more</span>
                  </button>
                </div>
                <div className="mt-2 text-sm text-on-surface-variant font-mono">
                  {payFiat}
                </div>
              </div>

              <div className="relative h-2 flex justify-center items-center z-10">
                <button
                  onClick={handleFlip}
                  className="w-12 h-12 bg-[#FC690A] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#FC690A]/20 active:scale-90 transition-transform duration-300 peer group"
                  style={{ transform: isFlipped ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <span className="material-symbols-outlined">swap_vert</span>
                </button>
              </div>

              <div className="p-6 pt-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">You receive</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-4xl font-headline font-bold text-on-surface w-full truncate">
                    {amount ? receiveAmount : '0.00'}
                  </div>
                  <button className="flex items-center gap-2 bg-surface-container-low flex-shrink-0 shadow-sm px-3 py-2 rounded-full hover:bg-surface-container-high transition-colors">
                    <div className={`w-6 h-6 rounded-full ${receiveColor} flex items-center justify-center text-[10px] font-bold text-white`}>{receiveIcon}</div>
                    <span className="font-bold text-sm">{receiveAsset}</span>
                    <span className="material-symbols-outlined text-sm">expand_more</span>
                  </button>
                </div>
                <div className="mt-2 text-sm text-on-surface-variant font-mono">
                  {rateText}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-surface-container-low">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-slate-500">
                      <span className="text-xs font-medium">Network fee</span>
                      <span className="material-symbols-outlined text-[14px]">info</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-on-surface">&lt; ₦0.01</span>
                  </div>
                  <div class="flex flex-col gap-2"><div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-slate-500">
                      <span className="text-xs font-medium">Slippage Tolerance</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-on-surface">0.5%</span>
                  </div></div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => { haptics.medium(); setState('confirm') }}
                disabled={!amount}
                className="w-full py-5 rounded-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-bold text-lg shadow-lg shadow-[#FC690A]/20 active:scale-95 transition-transform disabled:opacity-50 disabled:shadow-none"
              >
                Swap Now
              </button>
              <p className="text-center text-xs text-on-surface-variant mt-4 px-8 leading-relaxed">
                By swapping, you agree to BantuPay's <span className="text-[#FC690A] font-semibold">Terms of Service</span> and decentralized liquidity protocols.
              </p>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Confirmation Bottom Sheet Overlay */}
      <AnimatePresence>
        {state === 'confirm' && (
          <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-on-background/20 backdrop-blur-sm pointer-events-auto"
              onClick={() => setState('input')}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-surface/95 backdrop-blur-2xl w-full max-w-[430px] rounded-t-3xl shadow-2xl flex flex-col pointer-events-auto z-10"
            >
              <div className="w-full flex justify-center py-4">
                <div className="w-12 h-1.5 bg-on-surface-variant/20 rounded-full" />
              </div>
              <div className="px-8 pb-6 text-center">
                <h2 className="text-2xl font-headline font-extrabold tracking-tight text-on-surface">Confirm Swap</h2>
              </div>
              <div className="px-8 space-y-6">
                <div className="bg-surface-container-low rounded-xl p-6 space-y-6 relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container/10 blur-3xl rounded-full" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full ${payColor} flex items-center justify-center text-white text-xl shadow-md border-2 border-white`}><span className="font-bold">{payIcon}</span></div>
                        <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                          <span className="material-symbols-outlined text-[12px] text-slate-400">arrow_upward</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">You pay</p>
                        <p className="text-xl font-bold font-mono text-on-surface">{payAmount} {payAsset}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-500">{payFiat}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-px flex-grow bg-outline-variant/30" />
                    <span className="material-symbols-outlined text-primary-container font-bold bg-white rounded-full">expand_circle_down</span>
                    <div className="h-px flex-grow bg-outline-variant/30" />
                  </div>

                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full ${receiveColor} flex items-center justify-center text-white text-xl shadow-md text-white border-2 border-white`}><span className="font-bold">{receiveIcon}</span></div>
                        <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                          <span className="material-symbols-outlined text-[12px] text-primary-container">arrow_downward</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">You receive</p>
                        <p className="text-xl font-bold font-mono text-on-surface">{receiveAmount} {receiveAsset}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Exchange rate</span>
                    <span className="text-sm font-bold font-mono">{rateText}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Network Fee</span>
                    <span className="text-sm font-bold font-mono text-on-surface">&lt; ₦0.01</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Price impact</span>
                    <span className="text-[11px] font-bold text-tertiary font-body bg-tertiary-container/30 px-2 py-0.5 rounded-full">&lt; 0.01%</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-400/80 uppercase tracking-widest">Rate valid for 30s</span>
                    <span className="text-xs font-bold font-mono text-primary">24s</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div initial={{ width: '100%' }} animate={{ width: '80%' }} transition={{ duration: 6, ease: 'linear' }} className="bg-primary/80 h-full rounded-full" />
                  </div>
                </div>
              </div>

              <div className="p-8 mt-4 bg-surface-container-lowest rounded-t-3xl border-t border-outline-variant/10">
                <button onClick={handleConfirm} className="w-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white py-4 rounded-full flex items-center justify-center gap-3 font-bold text-lg shadow-brand active:scale-95 transition-transform">
                  <span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>face</span>
                  Confirm with Face ID
                </button>
                <button onClick={() => setState('input')} className="w-full mt-4 text-slate-500 font-bold py-2 hover:text-on-surface transition-colors active:scale-95 transition-transform text-sm uppercase tracking-wider">
                  Cancel Swap
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
