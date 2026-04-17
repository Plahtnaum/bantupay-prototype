'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/user.store'
import { useWalletStore } from '@/store/wallet.store'
import { haptics } from '@/lib/haptics'
import { QRCodeSVG } from 'qrcode.react'
import { AssetDropdown } from '@/components/wallet/AssetDropdown'

export default function ReceivePage() {
  const router = useRouter()
  const { persona } = useUserStore()
  const { assets } = useWalletStore()
  
  const [assetIdx, setAssetIdx] = useState(0)
  const [step, setStep] = useState<'main' | 'request'>('main')
  const [requestAmount, setRequestAmount] = useState('')
  
  const currentAsset = assets[assetIdx] || assets[0]
  const linkUrl = `bantupay.link/${persona?.handle?.replace('@', '') || 'wallet'}`

  const handleCopy = (text: string) => {
    haptics.medium()
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="bg-surface min-h-screen text-on-surface relative flex flex-col">
      <AnimatePresence mode="wait">
        {step === 'main' && (
          <motion.div key="main" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col max-w-[430px] mx-auto w-full">
            <header className="px-6 pt-12 pb-4 flex justify-between items-center">
              <button onClick={() => { haptics.light(); router.back() }} className="flex items-center text-on-surface hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined mr-2">arrow_back</span>
                <span className="font-headline font-semibold text-[22px]">Receive</span>
              </button>
            </header>

            <div className="px-6 py-2 mb-4">
              <AssetDropdown assets={assets} selectedIdx={assetIdx} onSelect={setAssetIdx} showBalance={false} />
            </div>

            <main className="px-6 flex flex-col items-center flex-1">
              {/* QR Container */}
              <div className="bg-white p-4 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/10 w-[240px] flex flex-col items-center">
                <QRCodeSVG value={`bantupay:${persona?.walletAddress}`} size={208} fgColor="#0F0F0F" className="rounded-xl overflow-hidden" />
                <span className="font-label font-bold text-[13px] text-on-surface-variant mt-4 mb-1 tracking-wide uppercase">Receiving {currentAsset.symbol}</span>
              </div>

              <div className="mt-8 flex flex-col items-center w-full max-w-[280px]">
                <span className="font-mono text-[14px] font-bold text-on-surface tracking-wider bg-surface-container-low px-4 py-2 rounded-xl mb-4 text-center break-all w-full leading-normal">
                  {persona?.walletAddress || 'GBPTV...XXXQ'}
                </span>
                <div className="flex gap-4">
                  <button onClick={() => handleCopy(persona?.walletAddress || '')} className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center hover:opacity-80 transition-opacity active:scale-95">
                    <span className="material-symbols-outlined text-[20px]">content_copy</span>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center hover:opacity-80 transition-opacity active:scale-95">
                    <span className="material-symbols-outlined text-[20px]">ios_share</span>
                  </button>
                </div>
              </div>

              <div className="w-full h-px bg-outline-variant/20 my-8 max-w-[320px]" />

              <div className="w-full flex flex-col items-center gap-3">
                <span className="font-label font-bold text-[12px] text-on-surface-variant uppercase tracking-widest">Or share your link</span>
                <span className="font-mono text-[16px] font-extrabold tracking-tight text-on-surface border-b-2 border-primary/30 pb-0.5">{linkUrl}</span>
                <div className="flex gap-2 w-full max-w-[280px] mt-2">
                   <button onClick={() => handleCopy(`https://${linkUrl}`)} className="h-10 flex-1 bg-surface border border-outline-variant/30 rounded-full flex items-center justify-center gap-2 font-label font-bold text-[12px] text-on-surface hover:bg-surface-container-low transition-colors active:scale-95 shadow-sm">
                    Copy Link
                  </button>
                </div>
              </div>

              <div className="mt-auto pb-10 pt-8 w-full max-w-[280px]">
                 <button onClick={() => { haptics.light(); setStep('request') }} className="w-full h-[52px] flex items-center justify-center gap-2 rounded-full bg-surface-container-lowest border-2 border-primary/20 text-primary font-headline font-bold text-[15px] hover:bg-primary-container/50 transition-colors active:scale-95 group">
                   Request specific amount
                   <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                 </button>
              </div>
            </main>
          </motion.div>
        )}

        {step === 'request' && (
          <motion.div key="request" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col max-w-[430px] mx-auto w-full bg-background">
            <header className="px-6 pt-16 pb-4 flex justify-between items-center">
              <button onClick={() => { haptics.light(); setStep('main') }} className="flex items-center text-on-surface hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined mr-2">arrow_back</span>
                <span className="font-headline font-semibold text-[22px]">Request</span>
              </button>
            </header>
            
            <div className="flex-1 flex flex-col justify-center items-center px-6 min-h-[200px]">
              <div className="flex items-center gap-2 mb-4 bg-surface-container-low rounded-full p-1 border border-outline-variant/10">
                <div className="px-3 py-1 font-label text-[11px] font-bold text-on-surface">{currentAsset.symbol}</div>
              </div>
              
              <h2 className="font-headline font-bold text-[56px] tracking-tighter text-center max-w-[300px] overflow-hidden whitespace-nowrap text-on-surface">
                {requestAmount || '0'}
              </h2>
              <p className="font-body text-[15px] text-on-surface-variant font-medium mt-1">
                ≈ {currentAsset.fiatSymbol}{((parseFloat(requestAmount)||0) * (currentAsset.fiatValue / (currentAsset.balance||1))).toFixed(2)}
              </p>
            </div>

            <div className="px-6 pb-6">
              <input type="text" placeholder="For (optional) e.g., Lunch" className="w-full h-14 bg-surface rounded-2xl border border-outline-variant/30 px-5 outline-none focus:border-primary font-body focus:ring-1 focus:ring-primary shadow-sm text-on-surface transition-all mb-4" />
            </div>

            <section className="bg-surface-container-highest rounded-t-[32px] pt-8 pb-10 px-8 shadow-inner mt-auto">
              <div className="grid grid-cols-3 gap-y-6 gap-x-8 max-w-[320px] mx-auto">
                {[1,2,3,4,5,6,7,8,9,'.','0'].map(key => (
                  <button key={key} onClick={() => { haptics.light(); setRequestAmount(p => p+key) }} className="font-mono font-bold text-[28px] text-on-surface h-14 rounded-2xl active:bg-surface-variant transition-colors flex justify-center items-center">
                    {key}
                  </button>
                ))}
                <button onClick={() => { haptics.light(); setRequestAmount(p => p.slice(0, -1)) }} className="text-on-surface-variant active:text-on-surface h-14 rounded-2xl transition-colors flex justify-center items-center">
                  <span className="material-symbols-outlined text-[32px]">backspace</span>
                </button>
              </div>
              
              <div className="mt-8">
                <button className="w-full h-14 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-lg rounded-full shadow-[0_8px_16px_rgba(252,105,10,0.25)] flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  Generate Link <span className="material-symbols-outlined text-[20px] font-bold">link</span>
                </button>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
