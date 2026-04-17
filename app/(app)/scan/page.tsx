'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { X, Lightning, QrCode } from 'phosphor-react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { useToastStore } from '@/store/toast.store'
import { MOCK_QR_SCENARIOS } from '@/mock/events'
import { haptics } from '@/lib/haptics'

export default function ScanPage() {
  const [demoSheet, setDemoSheet] = useState(false)
  const [scanned, setScanned] = useState<(typeof MOCK_QR_SCENARIOS)[0] | null>(null)
  const { show: addToast, success: toastSuccess, info: toastInfo } = useToastStore()
  const router = useRouter()

  const handleScenario = (scenario: (typeof MOCK_QR_SCENARIOS)[0]) => {
    haptics.success()
    setDemoSheet(false)
    setScanned(scenario)
  }

  const handleAction = () => {
    if (!scanned) return
    haptics.medium()
    toastSuccess(scanned.successMessage)
    if (scanned.type === 'payment') router.push('/send')
    else if (scanned.type === 'airdrop') toastSuccess('🎉 500 XBN claimed!')
    else if (scanned.type === 'auth') toastInfo('Web3 auth approved')
    setScanned(null)
  }

  return (
    <div className="fixed inset-0 bg-[#0F0F0F] z-20 flex flex-col">
      {/* Fake camera viewfinder */}
      <div className="flex-1 relative flex items-center justify-center">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => router.back()}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center z-10"
        >
          <X size={20} color="white" weight="bold" />
        </motion.button>

        {/* Viewfinder corners */}
        <div className="relative w-56 h-56">
          {[['top-0 left-0', 'border-t-2 border-l-2'], ['top-0 right-0', 'border-t-2 border-r-2'], ['bottom-0 left-0', 'border-b-2 border-l-2'], ['bottom-0 right-0', 'border-b-2 border-r-2']].map(([pos, border]) => (
            <div key={pos} className={`absolute ${pos} w-6 h-6 border-brand ${border} rounded-sm`} />
          ))}
          {/* Scanning line */}
          <motion.div
            animate={{ y: [0, 200, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="absolute left-0 right-0 h-0.5 bg-brand opacity-80"
          />
        </div>

        <p className="absolute bottom-8 left-0 right-0 text-center text-white/60 text-sm font-[family-name:var(--font-inter)]">
          Point camera at a QR code
        </p>
      </div>

      {/* Demo scenarios button */}
      <div className="bg-[#0F0F0F] px-4 pb-10 pt-4">
        <Button
          fullWidth
          variant="secondary"
          onClick={() => setDemoSheet(true)}
        >
          <QrCode size={18} className="mr-2" />
          Demo Scenarios
        </Button>
      </div>

      {/* Demo scenarios sheet */}
      <BottomSheet open={demoSheet} onClose={() => setDemoSheet(false)} title="Demo QR Scenarios">
        <div className="space-y-2">
          {MOCK_QR_SCENARIOS.map(s => (
            <motion.button
              key={s.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleScenario(s)}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-[#F9F9FB] hover:bg-[#F0F1F5] transition-colors text-left"
            >
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="font-semibold text-sm text-[#0F0F0F] font-[family-name:var(--font-inter)]">{s.label}</p>
                <p className="text-xs text-text-secondary font-[family-name:var(--font-inter)]">{s.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </BottomSheet>

      {/* Scanned result sheet */}
      <AnimatePresence>
        {scanned && (
          <BottomSheet open={!!scanned} onClose={() => setScanned(null)} title="QR Code Detected">
            <div className="text-center py-4">
              <span className="text-5xl mb-4 block">{scanned.icon}</span>
              <h3 className="font-bold text-lg text-[#0F0F0F] font-[family-name:var(--font-jakarta)] mb-2">{scanned.label}</h3>
              <p className="text-sm text-text-secondary font-[family-name:var(--font-inter)] mb-6">{scanned.description}</p>
              <Button fullWidth onClick={handleAction}>{scanned.actionLabel}</Button>
              <Button fullWidth variant="ghost" onClick={() => setScanned(null)} className="mt-2">Cancel</Button>
            </div>
          </BottomSheet>
        )}
      </AnimatePresence>
    </div>
  )
}
