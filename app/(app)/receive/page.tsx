'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/user.store'
import { useWalletStore } from '@/store/wallet.store'
import { haptics } from '@/lib/haptics'
import { QRCodeSVG } from 'qrcode.react'
import { AssetDropdown } from '@/components/wallet/AssetDropdown'

function Numpad({ onKey, onDelete }: { onKey: (k: string) => void; onDelete: () => void }) {
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-[288px] mx-auto">
      {['1','2','3','4','5','6','7','8','9'].map(k => (
        <button key={k} onClick={() => onKey(k)}
          className="h-[68px] rounded-full bg-surface-container hover:bg-surface-container-high active:scale-90 transition-all font-headline font-semibold text-[26px] text-on-surface flex items-center justify-center">
          {k}
        </button>
      ))}
      <button onClick={() => onKey('.')} className="h-[68px] rounded-full hover:bg-surface-container active:scale-90 transition-all font-headline font-semibold text-[26px] text-on-surface flex items-center justify-center">.</button>
      <button onClick={() => onKey('0')} className="h-[68px] rounded-full bg-surface-container hover:bg-surface-container-high active:scale-90 transition-all font-headline font-semibold text-[26px] text-on-surface flex items-center justify-center">0</button>
      <button onClick={onDelete} className="h-[68px] rounded-full hover:bg-surface-container active:scale-90 transition-all flex items-center justify-center text-on-surface-variant">
        <span className="material-symbols-outlined text-[28px]">backspace</span>
      </button>
    </div>
  )
}

export default function ReceivePage() {
  const router = useRouter()
  const { persona } = useUserStore()
  const { assets } = useWalletStore()

  const [assetIdx, setAssetIdx] = useState(0)
  const [step, setStep] = useState<'main' | 'request' | 'linkReady'>('main')
  const [requestAmount, setRequestAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [copied, setCopied] = useState(false)

  const currentAsset = assets[assetIdx] || assets[0]
  const handle = persona?.handle?.replace('@', '') || 'wallet'
  const linkUrl = `bantupay.link/${handle}`

  const generatedLink = requestAmount
    ? `https://bantupay.link/${handle}?amount=${requestAmount}&asset=${currentAsset.symbol}${memo ? `&memo=${encodeURIComponent(memo)}` : ''}`
    : `https://bantupay.link/${handle}`

  const handleCopy = (text: string) => {
    haptics.medium()
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleNumKey = (k: string) => {
    haptics.light()
    if (k === '.' && requestAmount.includes('.')) return
    if (requestAmount.split('.')[1]?.length >= 2) return
    setRequestAmount(p => (p === '' && k === '0') ? '0' : p + k)
  }

  return (
    <div className="bg-background min-h-screen text-on-surface flex flex-col">
      <AnimatePresence mode="wait">

        {/* MAIN — QR & link */}
        {step === 'main' && (
          <motion.div key="main" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col max-w-[430px] mx-auto w-full">
            <header className="px-6 pt-12 pb-4 flex items-center">
              <button onClick={() => { haptics.light(); router.back() }} className="flex items-center text-on-surface hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined mr-2">arrow_back</span>
                <span className="font-headline font-semibold text-[22px]">Receive</span>
              </button>
            </header>

            <div className="px-6 py-2 mb-4">
              <AssetDropdown assets={assets} selectedIdx={assetIdx} onSelect={setAssetIdx} showBalance={false} />
            </div>

            <main className="px-6 flex flex-col items-center flex-1 pb-10">
              {/* QR Card */}
              <div className="bg-white p-4 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/10 w-[240px] flex flex-col items-center mb-8">
                <QRCodeSVG value={`bantupay:${persona?.walletAddress}`} size={208} fgColor="#0F0F0F" className="rounded-xl overflow-hidden" />
                <span className="font-label font-bold text-[13px] text-on-surface-variant mt-4 mb-1 tracking-wide uppercase">Receiving {currentAsset.symbol}</span>
              </div>

              {/* Address + action buttons with labels */}
              <div className="flex flex-col items-center w-full max-w-[280px] mb-8">
                <span className="font-mono text-[13px] font-bold text-on-surface tracking-wider bg-surface-container px-4 py-2.5 rounded-xl mb-5 text-center break-all w-full leading-relaxed border border-outline-variant/10">
                  {persona?.walletAddress || 'GBPTV...XXXQ'}
                </span>
                <div className="flex gap-8">
                  <div className="flex flex-col items-center gap-1.5">
                    <button onClick={() => handleCopy(persona?.walletAddress || '')}
                      className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:opacity-80 transition-opacity active:scale-95">
                      <span className="material-symbols-outlined text-[20px]">{copied ? 'check' : 'content_copy'}</span>
                    </button>
                    <span className="font-label font-bold text-[11px] text-on-surface-variant">{copied ? 'Copied!' : 'Copy'}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <button className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:opacity-80 transition-opacity active:scale-95">
                      <span className="material-symbols-outlined text-[20px]">ios_share</span>
                    </button>
                    <span className="font-label font-bold text-[11px] text-on-surface-variant">Share QR</span>
                  </div>
                </div>
              </div>

              {/* Share link section */}
              <div className="w-full h-px bg-outline-variant/20 mb-6 max-w-[320px]" />

              <div className="w-full flex flex-col items-center gap-3 mb-8">
                <span className="font-label font-bold text-[12px] text-on-surface-variant uppercase tracking-widest">Or share your link</span>
                <span className="font-mono text-[16px] font-extrabold tracking-tight text-on-surface border-b-2 border-primary/30 pb-0.5">{linkUrl}</span>
                <button onClick={() => handleCopy(`https://${linkUrl}`)}
                  className="h-10 px-6 bg-surface border border-outline-variant/30 rounded-full flex items-center justify-center gap-2 font-label font-bold text-[12px] text-on-surface hover:bg-surface-container transition-colors active:scale-95 shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  Copy Link
                </button>
              </div>

              <button onClick={() => { haptics.light(); setStep('request') }}
                className="w-full max-w-[280px] h-[52px] flex items-center justify-center gap-2 rounded-full border-2 border-primary/20 text-primary font-headline font-bold text-[15px] hover:bg-primary/5 transition-colors active:scale-95">
                Request specific amount
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </main>
          </motion.div>
        )}

        {/* REQUEST AMOUNT */}
        {step === 'request' && (
          <motion.div key="request" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col max-w-[430px] mx-auto w-full bg-background min-h-screen">
            <header className="px-6 pt-12 pb-4 flex items-center">
              <button onClick={() => { haptics.light(); setStep('main') }} className="flex items-center text-on-surface hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined mr-2">arrow_back</span>
                <span className="font-headline font-semibold text-[22px]">Request</span>
              </button>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
              <div className="bg-surface-container px-4 py-1.5 rounded-full mb-6">
                <span className="font-label font-bold text-[13px] text-on-surface">{currentAsset.symbol}</span>
              </div>
              <h2 className="font-headline font-bold text-[64px] tracking-tighter text-center leading-none text-on-surface mb-1">
                {requestAmount || '0'}
              </h2>
              <p className="font-body text-[15px] text-on-surface-variant font-medium">
                ≈ {currentAsset.fiatSymbol}{((parseFloat(requestAmount)||0) * (currentAsset.fiatValue / (currentAsset.balance||1))).toFixed(2)}
              </p>
            </div>

            <div className="px-6 pb-4">
              <input type="text" value={memo} onChange={e => setMemo(e.target.value)}
                placeholder="What's it for? (optional) e.g., Lunch"
                className="w-full h-14 bg-surface rounded-2xl border border-outline-variant/20 px-5 outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body text-[14px] shadow-sm text-on-surface transition-all" />
            </div>

            <div className="px-6 pb-8 space-y-6">
              <Numpad onKey={handleNumKey} onDelete={() => { haptics.light(); setRequestAmount(p => p.slice(0, -1)) }} />
              <button
                disabled={!requestAmount || parseFloat(requestAmount) <= 0}
                onClick={() => { haptics.medium(); setStep('linkReady') }}
                className="w-full h-14 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-lg rounded-full shadow-[0_8px_16px_rgba(252,105,10,0.25)] flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-40">
                Generate Link <span className="material-symbols-outlined text-[20px]">link</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* LINK READY */}
        {step === 'linkReady' && (
          <motion.div key="linkReady" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col max-w-[430px] mx-auto w-full bg-background min-h-screen">
            <header className="px-6 pt-12 pb-4 flex items-center">
              <button onClick={() => { haptics.light(); setStep('request') }} className="flex items-center text-on-surface hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined mr-2">arrow_back</span>
                <span className="font-headline font-semibold text-[22px]">Your Link</span>
              </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 20 }}
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[40px] text-primary">link</span>
              </motion.div>

              <h2 className="font-headline font-bold text-[26px] text-on-surface mb-2">Link generated!</h2>
              <p className="font-body text-[14px] text-on-surface-variant mb-2">
                Requesting <span className="font-headline font-bold text-on-surface">{requestAmount} {currentAsset.symbol}</span>
                {memo && <> · <span className="italic">{memo}</span></>}
              </p>

              <div className="w-full bg-surface-container rounded-[20px] p-5 border border-outline-variant/10 mt-6 mb-8 text-left">
                <p className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">Payment link</p>
                <p className="font-mono text-[13px] text-primary break-all leading-relaxed">{generatedLink}</p>
              </div>

              {/* QR of link */}
              <div className="bg-white p-3 rounded-[20px] shadow-sm border border-outline-variant/10 mb-8">
                <QRCodeSVG value={generatedLink} size={180} fgColor="#0F0F0F" className="rounded-xl" />
              </div>
            </main>

            <div className="px-6 pb-10 space-y-3">
              <button onClick={() => handleCopy(generatedLink)}
                className="w-full h-14 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-[16px] rounded-full shadow-[0_8px_16px_rgba(252,105,10,0.25)] flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[20px]">{copied ? 'check' : 'content_copy'}</span>
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button onClick={() => haptics.light()}
                className="w-full h-14 bg-surface-container text-on-surface font-headline font-bold text-[15px] rounded-full flex items-center justify-center gap-2 active:scale-95 transition-transform border border-outline-variant/10">
                <span className="material-symbols-outlined text-[20px]">ios_share</span>
                Share
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
