'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { NumPad } from '@/components/ui/NumPad'
import { Avatar } from '@/components/ui/Avatar'
import { ConfettiCelebration } from '@/components/animations/ConfettiCelebration'
import { useMockTransaction } from '@/hooks/useMockTransaction'
import { useWalletStore } from '@/store/wallet.store'
import { MOCK_CONTACTS } from '@/mock/contacts'
import { MOCK_ASSETS } from '@/mock/assets'
import { formatCrypto, formatFiat, formatFee } from '@/lib/formatting'
import { haptics } from '@/lib/haptics'

type Step = 'recipient' | 'amount' | 'review' | 'success'

export default function SendPage() {
  const [step, setStep] = useState<Step>('recipient')
  const [recipient, setRecipient] = useState<(typeof MOCK_CONTACTS)[0] | null>(null)
  const [amount, setAmount] = useState('')
  const [selectedAsset, setSelectedAsset] = useState(MOCK_ASSETS[0])
  const [confetti, setConfetti] = useState(false)
  const { execute, isProcessing } = useMockTransaction()
  const { assets } = useWalletStore()
  const router = useRouter()

  const currentAsset = assets.find(a => a.id === selectedAsset.id) ?? selectedAsset
  const amountNum = parseFloat(amount) || 0
  const fiatValue = amountNum * (currentAsset.fiatValue / currentAsset.balance || 1)

  const handleNumPress = (d: string) => {
    if (d === '.' && amount.includes('.')) return
    if (amount === '0' && d !== '.') { setAmount(d); return }
    if (amount.split('.')[1]?.length >= 2) return
    setAmount(p => p + d)
  }

  const handleSend = async () => {
    if (!recipient || amountNum <= 0) return
    haptics.medium()
    await execute({
      type: 'send',
      asset: currentAsset.symbol,
      amount: amountNum,
      fiatValue,
      counterparty: recipient.name,
    })
    setConfetti(true)
    setStep('success')
    haptics.success()
    setTimeout(() => setConfetti(false), 3000)
  }

  return (
    <div className="min-h-screen bg-white">
      <ConfettiCelebration active={confetti} />
      <AnimatePresence mode="wait">
        {step === 'recipient' && (
          <motion.div key="recipient" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}>
            <ScreenHeader title="Send" />
            <div className="px-4 py-4">
              <input
                placeholder="Search name, @handle, or address"
                className="w-full border-2 border-[#E8EAF0] rounded-2xl px-4 py-3 text-sm font-[family-name:var(--font-inter)] outline-none focus:border-brand transition-colors"
              />
            </div>
            <div className="px-4">
              <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider font-[family-name:var(--font-inter)] mb-3">Recent</p>
              {MOCK_CONTACTS.filter(c => c.recent).map(c => (
                <motion.button
                  key={c.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setRecipient(c); setStep('amount') }}
                  className="w-full flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-[#F9F9FB] transition-colors"
                >
                  <Avatar initials={c.avatar} size="md" />
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-[#0F0F0F] font-[family-name:var(--font-inter)]">{c.name}</p>
                    <p className="text-xs text-text-secondary font-[family-name:var(--font-inter)]">{c.handle}</p>
                  </div>
                  {c.bantupay && <span className="text-xs text-brand font-medium font-[family-name:var(--font-inter)]">BantuPay</span>}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'amount' && recipient && (
          <motion.div key="amount" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }} className="flex flex-col min-h-screen">
            <ScreenHeader title={`Send to ${recipient.name}`} onBack={() => setStep('recipient')} />
            <div className="flex-1 flex flex-col items-center pt-8 px-6">
              <Avatar initials={recipient.avatar} size="lg" className="mb-3" />
              <p className="text-sm text-text-secondary font-[family-name:var(--font-inter)] mb-8">{recipient.handle}</p>

              <div className="text-center mb-2">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-[#0F0F0F] font-[family-name:var(--font-jetbrains)]">
                    {amount || '0'}
                  </span>
                  <span className="text-lg font-semibold text-text-secondary font-[family-name:var(--font-inter)]">
                    {currentAsset.symbol}
                  </span>
                </div>
                <p className="text-sm text-text-secondary font-[family-name:var(--font-inter)] mt-1">
                  ≈ {formatFiat(fiatValue, '₦')}
                </p>
              </div>

              <div className="flex gap-2 flex-wrap justify-center mt-4 mb-6">
                {assets.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAsset(a)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium font-[family-name:var(--font-inter)] transition-colors ${selectedAsset.id === a.id ? 'bg-brand text-white' : 'bg-[#F0F1F5] text-text-secondary'}`}
                  >
                    {a.symbol}
                  </button>
                ))}
              </div>

              <p className="text-xs text-text-secondary font-[family-name:var(--font-inter)]">
                Balance: {formatCrypto(currentAsset.balance, currentAsset.symbol)}
              </p>
            </div>

            <div className="mt-auto pb-4">
              <NumPad
                onPress={handleNumPress}
                onDelete={() => setAmount(p => p.slice(0, -1) || '')}
              />
              <div className="px-6 mt-4">
                <Button fullWidth onClick={() => setStep('review')} disabled={amountNum <= 0 || amountNum > currentAsset.balance}>
                  Review
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'review' && recipient && (
          <motion.div key="review" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }} className="flex flex-col min-h-screen">
            <ScreenHeader title="Review Transfer" onBack={() => setStep('amount')} />
            <div className="flex-1 px-4 py-6">
              <div className="bg-[#F9F9FB] rounded-2xl p-5 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar initials={recipient.avatar} />
                  <div>
                    <p className="font-semibold text-[#0F0F0F] font-[family-name:var(--font-inter)]">{recipient.name}</p>
                    <p className="text-xs text-text-secondary font-[family-name:var(--font-inter)]">{recipient.handle}</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 justify-center py-4 border-t border-b border-[#E8EAF0] my-4">
                  <span className="text-4xl font-bold text-[#0F0F0F] font-[family-name:var(--font-jetbrains)]">
                    {formatCrypto(amountNum, currentAsset.symbol)}
                  </span>
                </div>
                <p className="text-center text-sm text-text-secondary font-[family-name:var(--font-inter)]">
                  ≈ {formatFiat(fiatValue, '₦')}
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Network fee', value: formatFee() },
                  { label: 'You send', value: formatCrypto(amountNum, currentAsset.symbol) },
                  { label: 'They receive', value: formatCrypto(amountNum, currentAsset.symbol) },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary font-[family-name:var(--font-inter)]">{row.label}</span>
                    <span className="text-sm font-semibold text-[#0F0F0F] font-[family-name:var(--font-inter)]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-4 pb-10">
              <Button fullWidth onClick={handleSend} loading={isProcessing}>
                {isProcessing ? 'Sending…' : 'Confirm & Send'}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'success' && recipient && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col min-h-screen items-center justify-center px-6 bg-[#0F0F0F]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 }}
              className="w-24 h-24 rounded-full bg-semantic-success flex items-center justify-center mb-6"
            >
              <span className="text-4xl text-white font-bold">✓</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-black text-white font-[family-name:var(--font-jakarta)] text-center mb-2"
            >
              Sent!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.5 }}
              className="text-white/70 text-base text-center font-[family-name:var(--font-inter)] mb-2"
            >
              {formatCrypto(amountNum, currentAsset.symbol)} sent to {recipient.name}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.6 }}
              className="text-white/40 text-sm font-[family-name:var(--font-inter)] mb-12"
            >
              Settled on Bantu Blockchain in under 5 seconds
            </motion.p>
            <div className="w-full space-y-3">
              <Button fullWidth variant="secondary" onClick={() => router.push('/home')}>
                Back to Home
              </Button>
              <Button fullWidth variant="ghost" onClick={() => { setStep('recipient'); setAmount(''); setRecipient(null) }}>
                Send Again
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
