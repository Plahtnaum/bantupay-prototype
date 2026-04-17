'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { haptics } from '@/lib/haptics'

type SellState = 'input' | 'confirm' | 'success'

export default function SellPage() {
  const router = useRouter()
  const [amount, setAmount] = useState('5000')
  const [sellState, setSellState] = useState<SellState>('input')
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const ngnEquivalent = (Number(amount) * 1000 * 0.99).toLocaleString()

  const handleKeyPress = (key: string) => {
    haptics.light()
    if (key === 'backspace') {
      setAmount(prev => prev.slice(0, -1) || '0')
    } else if (key === '.' && amount.includes('.')) {
      return
    } else if (amount === '0' && key !== '.') {
      setAmount(key)
    } else {
      setAmount(prev => prev + key)
    }
  }

  const handleConfirm = () => {
    haptics.success()
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setSellState('success')
    }, 1800)
  }

  return (
    <div className="bg-background text-on-background font-body min-h-screen selection:bg-primary-container selection:text-on-primary w-full max-w-[430px] mx-auto">
      <AnimatePresence mode="wait">
        {sellState === 'input' && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <header className="fixed top-0 w-full max-w-[430px] z-50 flex justify-between items-center px-6 h-16 bg-surface/80 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <button onClick={() => { haptics.light(); router.back() }} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-200">
                  <span className="material-symbols-outlined text-on-surface">arrow_back</span>
                </button>
                <h1 className="text-xl font-bold bg-gradient-to-br from-[#FC690A] to-[#D4560A] bg-clip-text text-transparent font-headline tracking-tight">Sell cNGN</h1>
              </div>
            </header>

            <main className="pt-24 pb-40 px-6">
              <section className="text-center mb-8">
                <p className="font-label font-bold text-[11px] text-on-surface-variant uppercase tracking-widest mb-3">Amount to sell</p>
                <div className="inline-flex items-baseline gap-2 mb-2">
                  <div className="font-headline font-bold text-[40px] tracking-tight text-on-surface flex items-center justify-center">
                    {Number(amount).toLocaleString()}
                    <span className="w-1 h-10 bg-primary-container ml-1 animate-pulse" />
                  </div>
                  <span className="text-on-surface-variant font-headline font-semibold text-lg uppercase tracking-widest">cNGN</span>
                </div>
                <p className="text-on-surface-variant font-mono text-sm">≈ ₦{ngnEquivalent}</p>

                <div className="flex justify-center gap-2 mt-4">
                  {['1000', '5000', '10000', '50000'].map(preset => (
                    <button
                      key={preset}
                      onClick={() => { haptics.light(); setAmount(preset) }}
                      className={`px-3 py-1.5 rounded-full font-label font-bold text-[11px] transition-colors ${amount === preset ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
                    >
                      {Number(preset).toLocaleString()}
                    </button>
                  ))}
                </div>
              </section>

              <section className="mb-10 max-w-[280px] mx-auto w-full">
                <div className="grid grid-cols-3 gap-y-4 gap-x-8">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button key={num} onClick={() => handleKeyPress(String(num))} className="h-14 flex items-center justify-center text-2xl font-headline font-semibold text-on-surface hover:bg-surface-container transition-colors rounded-xl active:scale-95 duration-200">
                      {num}
                    </button>
                  ))}
                  <button onClick={() => handleKeyPress('.')} className="h-14 flex items-center justify-center text-2xl font-headline font-semibold text-on-surface hover:bg-surface-container transition-colors rounded-xl active:scale-95 duration-200">.</button>
                  <button onClick={() => handleKeyPress('0')} className="h-14 flex items-center justify-center text-2xl font-headline font-semibold text-on-surface hover:bg-surface-container transition-colors rounded-xl active:scale-95 duration-200">0</button>
                  <button onClick={() => handleKeyPress('backspace')} className="h-14 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl active:scale-95 duration-200">
                    <span className="material-symbols-outlined text-3xl">backspace</span>
                  </button>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="font-headline font-bold text-lg text-on-surface px-1">Withdraw to</h2>

                {[
                  { id: 'bank', icon: 'account_balance', label: 'Bank Account', sub: 'GTBank •••• 4521', fee: '0%', time: '~10 mins', color: '#16A34A' },
                  { id: 'opay', icon: 'wallet', label: 'OPay Wallet', sub: 'Linked account', fee: '0%', time: 'Instant', color: '#16A34A' },
                  { id: 'kuda', icon: 'smartphone', label: 'Kuda Bank', sub: 'Add account', fee: '0%', time: '~5 mins', color: '#5b3e96' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => { haptics.light(); setSelectedMethod(method.id) }}
                    className={`w-full bg-surface-container-low rounded-2xl p-4 flex items-center justify-between transition-all active:scale-[0.98] border shadow-sm ${selectedMethod === method.id ? 'border-primary bg-primary/5' : 'border-transparent hover:border-outline-variant/20 hover:bg-surface-container-high hover:shadow-md'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${method.color}15` }}>
                        <span className="material-symbols-outlined" style={{ color: method.color }}>{method.icon}</span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-headline font-bold text-on-surface text-[15px]">{method.label}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-on-surface-variant font-medium">{method.sub}</span>
                          <span className="text-[10px] font-bold text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded-full">{method.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-on-surface-variant font-bold">{method.fee} fee</span>
                      {selectedMethod === method.id && (
                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                      )}
                    </div>
                  </button>
                ))}
              </section>

              <div className="mt-10 mb-8">
                <button
                  disabled={!selectedMethod || !amount || Number(amount) <= 0}
                  onClick={() => { haptics.medium(); setSellState('confirm') }}
                  className="w-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white py-4 rounded-full font-headline font-bold text-lg shadow-[0_8px_24px_rgba(252,105,10,0.25)] hover:shadow-[0_12px_32px_rgba(252,105,10,0.35)] transition-all active:scale-95 disabled:opacity-40 disabled:grayscale disabled:shadow-none"
                >
                  Preview Withdrawal
                </button>
              </div>
            </main>
          </motion.div>
        )}

        {sellState === 'confirm' && (
          <motion.div key="confirm" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[100] bg-background flex flex-col pt-16">
            <header className="px-6 flex justify-between items-center mb-8">
              <button onClick={() => setSellState('input')} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h2 className="font-headline font-bold text-[20px]">Confirm Withdrawal</h2>
              <div className="w-10" />
            </header>

            <main className="px-6 flex-1 space-y-6">
              <div className="bg-surface rounded-[24px] p-6 border border-outline-variant/10 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-label font-bold text-[11px] text-on-surface-variant uppercase tracking-widest">You sell</span>
                  <span className="font-headline font-bold text-[22px] text-on-surface">{Number(amount).toLocaleString()} cNGN</span>
                </div>
                <div className="h-px bg-outline-variant/10" />
                <div className="flex justify-between items-center">
                  <span className="font-label font-bold text-[11px] text-on-surface-variant uppercase tracking-widest">You receive</span>
                  <span className="font-headline font-bold text-[22px] text-[#16A34A]">₦{ngnEquivalent}</span>
                </div>
                <div className="h-px bg-outline-variant/10" />
                <div className="flex justify-between items-center">
                  <span className="font-label font-bold text-[11px] text-on-surface-variant uppercase tracking-widest">Network Fee</span>
                  <span className="font-headline font-bold text-[14px] text-[#16A34A]">Free</span>
                </div>
              </div>

              <div className="bg-[#16A34A]/5 border border-[#16A34A]/20 rounded-2xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#16A34A] text-[20px] mt-0.5">info</span>
                <p className="font-body text-[13px] text-on-surface-variant font-medium leading-relaxed">
                  Funds arrive within 5–10 minutes. Ensure your bank details are correct before proceeding.
                </p>
              </div>

              <div className="pt-4 flex flex-col items-center gap-4">
                <button
                  onClick={handleConfirm}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 ${isProcessing ? 'bg-surface-container animate-pulse' : 'bg-primary shadow-primary/25'}`}
                >
                  {isProcessing ? (
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-white text-3xl font-bold">face</span>
                  )}
                </button>
                <p className="font-headline font-bold text-[14px] text-on-surface">{isProcessing ? 'Processing...' : 'Hold for Biometric Confirm'}</p>
              </div>
            </main>
          </motion.div>
        )}

        {sellState === 'success' && (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-background z-[110] flex flex-col items-center justify-center px-8">
            <div className="w-24 h-24 bg-[#16A34A]/10 rounded-full flex items-center justify-center mb-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-[#16A34A] rounded-full flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-3xl font-bold">check</span>
              </motion.div>
            </div>

            <h1 className="font-headline font-extrabold text-[32px] text-on-surface text-center mb-2 tracking-tight">Withdrawal sent!</h1>
            <p className="font-body text-[15px] text-on-surface-variant text-center leading-relaxed mb-4 max-w-[280px]">
              ₦{ngnEquivalent} is on its way to your bank account.
            </p>
            <p className="font-label font-bold text-[11px] text-on-surface-variant/60 uppercase tracking-widest mb-10">Expected in ~10 minutes</p>

            <div className="w-full space-y-3">
              <button onClick={() => { haptics.light(); router.push('/home') }} className="w-full h-14 bg-surface-container text-on-surface font-headline font-bold text-[15px] rounded-full active:scale-95 transition-transform border border-outline-variant/10">
                Back to Home
              </button>
              <button onClick={() => { haptics.light(); router.push('/activity') }} className="w-full h-14 text-on-surface-variant font-headline font-bold text-[13px] uppercase tracking-widest">
                View Activity
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[40%] bg-primary-container/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[5%] left-[-10%] w-[40%] h-[30%] bg-tertiary-container/5 rounded-full blur-[100px] pointer-events-none z-0" />
    </div>
  )
}
