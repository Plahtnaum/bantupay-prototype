'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowsDownUp } from 'phosphor-react'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { NumPad } from '@/components/ui/NumPad'
import { ConfettiCelebration } from '@/components/animations/ConfettiCelebration'
import { useMockTransaction } from '@/hooks/useMockTransaction'
import { useWalletStore } from '@/store/wallet.store'
import { MOCK_ASSETS, MOCK_RATES } from '@/mock/assets'
import { formatCrypto, formatFee } from '@/lib/formatting'

type Step = 'input' | 'preview' | 'success'

export default function SwapPage() {
  const [step, setStep] = useState<Step>('input')
  const [fromIdx, setFromIdx] = useState(0)
  const [toIdx, setToIdx] = useState(1)
  const [amount, setAmount] = useState('')
  const [confetti, setConfetti] = useState(false)
  const { execute, isProcessing } = useMockTransaction()
  const { assets } = useWalletStore()
  const router = useRouter()

  const fromAsset = assets[fromIdx] ?? MOCK_ASSETS[fromIdx]
  const toAsset = assets[toIdx] ?? MOCK_ASSETS[toIdx]
  const amountNum = parseFloat(amount) || 0

  const getRate = () => {
    const fromKey = `${fromAsset.symbol}_NGN` as keyof typeof MOCK_RATES
    const toKey = `${toAsset.symbol}_NGN` as keyof typeof MOCK_RATES
    const fromRate = MOCK_RATES[fromKey] ?? 1
    const toRate = MOCK_RATES[toKey] ?? 1
    return fromRate / toRate
  }

  const toAmount = amountNum * getRate()

  const swap = () => {
    setFromIdx(toIdx)
    setToIdx(fromIdx)
    setAmount('')
  }

  const handleNumPress = (d: string) => {
    if (d === '.' && amount.includes('.')) return
    setAmount(p => p === '0' && d !== '.' ? d : p + d)
  }

  const handleExecute = async () => {
    await execute({
      type: 'swap',
      asset: fromAsset.symbol,
      amount: amountNum,
      fiatValue: amountNum * (fromAsset.fiatValue / fromAsset.balance || 1),
      counterparty: `${fromAsset.symbol}→${toAsset.symbol}`,
    })
    setConfetti(true)
    setStep('success')
    setTimeout(() => setConfetti(false), 3000)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ConfettiCelebration active={confetti} />
      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
            <ScreenHeader title="Swap" />
            <div className="px-4 py-6 flex-1 flex flex-col">
              {/* From */}
              <div className="bg-[#F9F9FB] rounded-2xl px-4 py-4 mb-2">
                <p className="text-xs text-text-secondary font-[family-name:var(--font-inter)] mb-2">From</p>
                <div className="flex items-center justify-between">
                  <select
                    value={fromIdx}
                    onChange={e => setFromIdx(Number(e.target.value))}
                    className="font-semibold text-lg text-[#0F0F0F] font-[family-name:var(--font-inter)] bg-transparent outline-none"
                  >
                    {assets.map((a, i) => <option key={a.id} value={i}>{a.symbol}</option>)}
                  </select>
                  <span className="text-2xl font-bold font-[family-name:var(--font-jetbrains)] text-[#0F0F0F]">
                    {amount || '0'}
                  </span>
                </div>
                <p className="text-xs text-text-secondary font-[family-name:var(--font-inter)] mt-1">
                  Balance: {formatCrypto(fromAsset.balance, fromAsset.symbol)}
                </p>
              </div>

              {/* Swap button */}
              <div className="flex justify-center my-2">
                <motion.button
                  whileTap={{ scale: 0.9, rotate: 180 }}
                  onClick={swap}
                  className="w-10 h-10 rounded-full bg-white border-2 border-[#E8EAF0] flex items-center justify-center shadow-md"
                >
                  <ArrowsDownUp size={18} color="#FC690A" weight="bold" />
                </motion.button>
              </div>

              {/* To */}
              <div className="bg-[#F9F9FB] rounded-2xl px-4 py-4 mb-6">
                <p className="text-xs text-text-secondary font-[family-name:var(--font-inter)] mb-2">To (estimated)</p>
                <div className="flex items-center justify-between">
                  <select
                    value={toIdx}
                    onChange={e => setToIdx(Number(e.target.value))}
                    className="font-semibold text-lg text-[#0F0F0F] font-[family-name:var(--font-inter)] bg-transparent outline-none"
                  >
                    {assets.map((a, i) => <option key={a.id} value={i}>{a.symbol}</option>)}
                  </select>
                  <span className="text-2xl font-bold font-[family-name:var(--font-jetbrains)] text-semantic-success">
                    {toAmount > 0 ? toAmount.toFixed(4) : '0'}
                  </span>
                </div>
              </div>

              <div className="mt-auto">
                <NumPad
                  onPress={handleNumPress}
                  onDelete={() => setAmount(p => p.slice(0, -1) || '')}
                />
                <div className="px-0 mt-4">
                  <Button
                    fullWidth
                    onClick={() => setStep('preview')}
                    disabled={amountNum <= 0 || fromIdx === toIdx || amountNum > fromAsset.balance}
                  >
                    Preview Swap
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'preview' && (
          <motion.div key="preview" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col">
            <ScreenHeader title="Confirm Swap" onBack={() => setStep('input')} />
            <div className="flex-1 px-4 py-6">
              <div className="bg-[#F9F9FB] rounded-2xl p-5 space-y-4 mb-4">
                {[
                  { label: 'You Pay', value: formatCrypto(amountNum, fromAsset.symbol) },
                  { label: 'You Receive', value: `~${toAmount.toFixed(4)} ${toAsset.symbol}` },
                  { label: 'Rate', value: `1 ${fromAsset.symbol} = ${getRate().toFixed(4)} ${toAsset.symbol}` },
                  { label: 'Fee', value: formatFee() },
                ].map(row => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-sm text-text-secondary font-[family-name:var(--font-inter)]">{row.label}</span>
                    <span className="text-sm font-semibold text-[#0F0F0F] font-[family-name:var(--font-inter)]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-4 pb-10">
              <Button fullWidth onClick={handleExecute} loading={isProcessing}>
                {isProcessing ? 'Swapping…' : 'Confirm Swap'}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center px-6 bg-[#0F0F0F] min-h-screen">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="w-24 h-24 rounded-full bg-brand flex items-center justify-center mb-6">
              <ArrowsDownUp size={36} color="white" weight="bold" />
            </motion.div>
            <h1 className="text-3xl font-black text-white font-[family-name:var(--font-jakarta)] text-center mb-2">Swapped!</h1>
            <p className="text-white/70 text-base text-center font-[family-name:var(--font-inter)] mb-12">
              {formatCrypto(amountNum, fromAsset.symbol)} → ~{toAmount.toFixed(4)} {toAsset.symbol}
            </p>
            <div className="w-full space-y-3">
              <Button fullWidth variant="secondary" onClick={() => router.push('/home')}>Back to Home</Button>
              <Button fullWidth variant="ghost" onClick={() => { setStep('input'); setAmount('') }}>Swap Again</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
