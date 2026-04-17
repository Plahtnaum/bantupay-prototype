'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Share, QrCode } from 'phosphor-react'
import { QRCodeSVG } from 'qrcode.react'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { useUserStore } from '@/store/user.store'
import { useToastStore } from '@/store/toast.store'
import { MOCK_ASSETS } from '@/mock/assets'
import { haptics } from '@/lib/haptics'

export default function ReceivePage() {
  const { persona } = useUserStore()
  const { show: addToast, success: toastSuccess, info: toastInfo } = useToastStore()
  const [selectedAsset, setSelectedAsset] = useState(MOCK_ASSETS[0])
  const address = persona?.address ?? 'GDEMO3XAMPLE7F2K3BANTUPAY1ADDRESS'
  const qrData = `bantu:${address}?asset=${selectedAsset.symbol}`

  const copyAddress = () => {
    navigator.clipboard.writeText(address).catch(() => {})
    haptics.light()
    toastSuccess('Address copied to clipboard')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ScreenHeader title="Receive" />

      <div className="flex-1 flex flex-col items-center px-6 pt-6">
        <div className="flex gap-2 flex-wrap justify-center mb-6">
          {MOCK_ASSETS.map(a => (
            <button
              key={a.id}
              onClick={() => setSelectedAsset(a)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium font-[family-name:var(--font-inter)] transition-colors ${selectedAsset.id === a.id ? 'bg-brand text-white' : 'bg-[#F0F1F5] text-text-secondary'}`}
            >
              {a.symbol}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white border-2 border-[#E8EAF0] rounded-3xl p-6 mb-6"
        >
          <QRCodeSVG
            value={qrData}
            size={220}
            bgColor="white"
            fgColor="#0F0F0F"
            level="M"
            imageSettings={{
              src: '',
              width: 40,
              height: 40,
              excavate: true,
            }}
          />
        </motion.div>

        <p className="text-xs text-text-secondary font-[family-name:var(--font-inter)] mb-2 uppercase tracking-wider font-semibold">
          Your {selectedAsset.symbol} address
        </p>
        <div className="flex items-center gap-2 bg-[#F9F9FB] rounded-xl px-4 py-3 w-full mb-6">
          <p className="flex-1 text-xs font-[family-name:var(--font-jetbrains)] text-[#0F0F0F] break-all">
            {address}
          </p>
          <motion.button whileTap={{ scale: 0.9 }} onClick={copyAddress} className="flex-shrink-0">
            <Copy size={18} color="#FC690A" />
          </motion.button>
        </div>

        <div className="bg-brand-wash border border-brand/20 rounded-xl px-4 py-3 w-full">
          <p className="text-xs text-brand font-medium font-[family-name:var(--font-inter)]">
            ⚡ Only send {selectedAsset.symbol} to this address. Sending other assets may result in permanent loss.
          </p>
        </div>
      </div>

      <div className="px-6 pb-10 pt-4 flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={copyAddress}>
          Copy Address
        </Button>
        <Button className="flex-1" onClick={() => haptics.light()}>
          Share QR
        </Button>
      </div>
    </div>
  )
}
