'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Copy, CheckCircle } from 'phosphor-react'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { useMockTransaction } from '@/hooks/useMockTransaction'
import { useToastStore } from '@/store/toast.store'
import { generateMockAccountNumber } from '@/lib/formatting'
import { haptics } from '@/lib/haptics'

type Step = 'method' | 'account' | 'success'

const METHODS = [
  { id: 'bank', icon: '🏦', label: 'Bank Transfer', sub: 'Pay via your bank app · Instant' },
  { id: 'card', icon: '💳', label: 'Debit Card',    sub: 'Visa, Mastercard · ~2 min' },
  { id: 'ussd', icon: '#️⃣', label: 'USSD',          sub: '*966# or *737# · Instant' },
]

export default function BuyPage() {
  const [step, setStep] = useState<Step>('method')
  const [method, setMethod] = useState('')
  const [amount, setAmount] = useState('5000')
  const [confirmed, setConfirmed] = useState(false)
  const accountNumber = generateMockAccountNumber()
  const { execute, isProcessing } = useMockTransaction()
  const { show: addToast, success: toastSuccess, info: toastInfo } = useToastStore()
  const router = useRouter()

  const simulatePayment = async () => {
    setConfirmed(true)
    await execute({ type: 'onramp', asset: 'cNGN', amount: parseFloat(amount), fiatValue: parseFloat(amount), counterparty: 'Bank Transfer' })
    setStep('success')
    haptics.success()
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnimatePresence mode="wait">
        {step === 'method' && (
          <motion.div key="method" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
            <ScreenHeader title="Buy cNGN" />
            <div className="flex-1 px-4 py-6">
              <div className="bg-[#F9F9FB] rounded-2xl px-4 py-4 mb-6">
                <p className="text-xs text-text-secondary font-[family-name:var(--font-inter)] mb-2">Amount (₦)</p>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="text-3xl font-bold text-[#0F0F0F] font-[family-name:var(--font-jetbrains)] w-full bg-transparent outline-none"
                />
                <p className="text-xs text-text-secondary font-[family-name:var(--font-inter)] mt-1">
                  ≈ {parseFloat(amount || '0').toLocaleString()} cNGN (1:1)
                </p>
              </div>

              <div className="flex gap-2 mb-6">
                {['1000', '5000', '10000', '50000'].map(v => (
                  <button
                    key={v}
                    onClick={() => setAmount(v)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium font-[family-name:var(--font-inter)] transition-colors ${amount === v ? 'bg-brand text-white' : 'bg-[#F0F1F5] text-text-secondary'}`}
                  >
                    ₦{parseInt(v).toLocaleString()}
                  </button>
                ))}
              </div>

              <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider font-[family-name:var(--font-inter)] mb-3">Payment method</p>
              <div className="space-y-2">
                {METHODS.map(m => (
                  <motion.button
                    key={m.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setMethod(m.id); setStep('account') }}
                    className="w-full flex items-center gap-4 rounded-2xl px-4 py-4 border-2 border-[#E8EAF0] hover:border-brand transition-colors text-left"
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-[#0F0F0F] font-[family-name:var(--font-inter)]">{m.label}</p>
                      <p className="text-xs text-text-secondary font-[family-name:var(--font-inter)]">{m.sub}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'account' && (
          <motion.div key="account" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col">
            <ScreenHeader title="Virtual Account" onBack={() => setStep('method')} />
            <div className="flex-1 px-4 py-6">
              <div className="bg-brand-wash border border-brand/20 rounded-2xl p-5 mb-4">
                <p className="text-xs text-brand font-semibold font-[family-name:var(--font-inter)] uppercase tracking-wider mb-4">Transfer exactly:</p>
                <p className="text-3xl font-black text-brand font-[family-name:var(--font-jetbrains)]">
                  ₦{parseFloat(amount).toLocaleString()}.00
                </p>
              </div>

              <div className="bg-[#F9F9FB] rounded-2xl p-5 space-y-3">
                {[
                  { label: 'Bank', value: 'Providus Bank' },
                  { label: 'Account Name', value: 'BantuPay / Your Name' },
                  { label: 'Account Number', value: accountNumber },
                  { label: 'Expires in', value: '29:54' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary font-[family-name:var(--font-inter)]">{row.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#0F0F0F] font-[family-name:var(--font-jetbrains)]">{row.value}</span>
                      {row.label === 'Account Number' && (
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => { navigator.clipboard.writeText(row.value).catch(() => {}); toastSuccess('Copied!') }}>
                          <Copy size={14} color="#FC690A" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-text-secondary text-center font-[family-name:var(--font-inter)] mt-4">
                cNGN will be credited within seconds of transfer
              </p>
            </div>
            <div className="px-4 pb-10 space-y-3">
              <Button fullWidth onClick={simulatePayment} loading={isProcessing || confirmed}>
                {confirmed ? 'Confirming…' : 'I\'ve Made the Transfer'}
              </Button>
              <Button fullWidth variant="ghost" onClick={() => setStep('method')}>Cancel</Button>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center px-6 bg-[#0F0F0F] min-h-screen">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="w-24 h-24 rounded-full bg-semantic-success flex items-center justify-center mb-6">
              <CheckCircle size={48} color="white" weight="fill" />
            </motion.div>
            <h1 className="text-3xl font-black text-white font-[family-name:var(--font-jakarta)] text-center mb-2">cNGN Received!</h1>
            <p className="text-white/70 text-base text-center font-[family-name:var(--font-inter)] mb-12">
              ₦{parseFloat(amount).toLocaleString()} → {parseFloat(amount).toLocaleString()} cNGN
            </p>
            <div className="w-full">
              <Button fullWidth variant="secondary" onClick={() => router.push('/home')}>Back to Home</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
