'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useWalletStore } from '@/store/wallet.store'
import { useUserStore } from '@/store/user.store'
import { MOCK_CONTACTS } from '@/mock/contacts'
import { haptics } from '@/lib/haptics'
import Image from 'next/image'

type Step = 'amount' | 'recipient' | 'review' | 'success'

export default function SendPage() {
  const router = useRouter()
  const { assets, addTransaction } = useWalletStore()
  const [step, setStep] = useState<Step>('amount')
  
  const [amount, setAmount] = useState('')
  const [assetIdx, setAssetIdx] = useState(0)
  const currentAsset = assets[assetIdx] || assets[0]
  
  const [recipient, setRecipient] = useState<typeof MOCK_CONTACTS[0] | null>(null)
  const [search, setSearch] = useState('')
  const [memo, setMemo] = useState('')
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorStatus, setErrorStatus] = useState<string | null>(null)

  const handleNumPress = (d: string) => {
    haptics.light()
    if (d === '.' && amount.includes('.')) return
    if (amount === '0' && d !== '.') { setAmount(d); return }
    if (amount.split('.')[1]?.length >= 2) return
    setAmount(p => p + d)
  }
  const handleDelete = () => {
    haptics.light()
    setAmount(p => p.slice(0, -1))
  }

  const amountNum = parseFloat(amount) || 0
  const isInsufficient = amountNum > currentAsset.balance
  const canContinue = amountNum > 0 && !isInsufficient

  const executeSend = () => {
    haptics.medium()
    if (!recipient) return
    setIsProcessing(true)
    setErrorStatus(null)

    // Simulate network parsing
    setTimeout(() => {
      // Simulate error based on mocked data edge case (e.g., trying to send > 1m)
      if (amountNum > 1000000) {
        setIsProcessing(false)
        setErrorStatus('Transaction limit exceeded. Maximum transfer is 1,000,000 cNGN.')
        haptics.error()
        return
      }

      const tx = {
        id: \`tx_\${Date.now()}\`,
        type: 'send' as const,
        asset: currentAsset.symbol,
        amount: amountNum,
        fiatValue: amountNum * (currentAsset.fiatValue / currentAsset.balance || 1),
        counterparty: recipient.name,
        memo,
        status: 'confirmed' as const,
        timestamp: new Date(),
        txHash: \`BANTU\${Math.floor(Math.random()*1000000)}...\`,
        fee: 0.001
      }
      
      addTransaction(tx)
      setStep('success')
      setIsProcessing(false)
      haptics.success()
    }, 2000)
  }

  return (
    <div className="bg-background min-h-screen text-on-background relative flex flex-col">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: AMOUNT */}
        {step === 'amount' && (
          <motion.div key="amount" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col max-w-[430px] mx-auto w-full">
            <header className="px-6 pt-16 pb-4 flex justify-between items-center">
              <button onClick={() => { haptics.light(); router.back() }} className="flex items-center text-on-surface hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined mr-2">arrow_back</span>
                <span className="font-headline font-semibold text-[22px]">Send</span>
              </button>
              <button onClick={() => router.back()} className="font-label text-[13px] text-on-surface-variant font-bold hover:text-on-surface">Cancel</button>
            </header>

            <div className="px-6 py-2 overflow-x-auto scrollbar-hide flex gap-3">
              {assets.map((asset, idx) => (
                <button
                  key={asset.id}
                  onClick={() => { haptics.light(); setAssetIdx(idx) }}
                  className={\`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all flex-shrink-0 border \${assetIdx === idx ? 'bg-primary-container text-primary border-primary shadow-sm' : 'bg-surface text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-low'}\`}
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: asset.iconBg, color: asset.color }}>
                    {asset.iconText}
                  </div>
                  <span className="font-label font-bold text-[13px]">{asset.symbol}</span>
                  <span className="font-mono text-[11px] opacity-70 ml-1">{asset.balance.toLocaleString()}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 flex flex-col justify-center items-center px-6 min-h-[200px]">
              <div className="flex items-center gap-2 mb-4 bg-surface-container-low rounded-full p-1 border border-outline-variant/10">
                <div className="px-3 py-1 rounded-full bg-surface shadow-sm font-label text-[11px] font-bold text-on-surface">{currentAsset.fiatSymbol || 'NGN'}</div>
                <div className="px-3 py-1 font-label text-[11px] font-bold text-on-surface-variant cursor-pointer">{currentAsset.symbol}</div>
              </div>
              
              <div className="relative">
                <h2 className={\`font-headline font-bold text-[56px] tracking-tighter text-center max-w-[300px] overflow-hidden whitespace-nowrap \${isInsufficient ? 'text-error' : 'text-on-surface'}\`}>
                  {amount || '0'}
                </h2>
                <button onClick={() => { haptics.medium(); setAmount(currentAsset.balance.toString()) }} className="absolute -right-16 top-4 bg-primary-container text-primary font-label font-bold text-[10px] px-2 py-1 rounded-full uppercase tracking-wider hover:opacity-80">
                  MAX
                </button>
              </div>
              <p className="font-body text-[15px] text-on-surface-variant font-medium mt-1">
                ≈ {currentAsset.fiatSymbol}{((parseFloat(amount)||0) * (currentAsset.fiatValue / (currentAsset.balance||1))).toFixed(2)}
              </p>
              
              <div className="h-6 mt-4">
                {isInsufficient && (
                  <p className="font-label text-sm font-bold text-error animate-pulse">Insufficient {currentAsset.symbol} balance</p>
                )}
              </div>
            </div>

            <section className="bg-surface-container-highest rounded-t-[32px] pt-8 pb-10 px-8 shadow-inner mt-auto">
              <div className="grid grid-cols-3 gap-y-6 gap-x-8 max-w-[320px] mx-auto">
                {[1,2,3,4,5,6,7,8,9,'.','0'].map(key => (
                  <button key={key} onClick={() => handleNumPress(key.toString())} className="font-mono font-bold text-[28px] text-on-surface h-14 rounded-2xl active:bg-surface-variant transition-colors flex justify-center items-center">
                    {key}
                  </button>
                ))}
                <button onClick={handleDelete} className="text-on-surface-variant active:text-on-surface h-14 rounded-2xl transition-colors flex justify-center items-center">
                  <span className="material-symbols-outlined text-[32px]">backspace</span>
                </button>
              </div>
              
              <div className="mt-8">
                <button 
                  onClick={() => setStep('recipient')} 
                  disabled={!canContinue} 
                  className="w-full h-14 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-lg rounded-full disabled:opacity-40 transition-opacity shadow-[0_8px_16px_rgba(252,105,10,0.25)] flex items-center justify-center gap-2"
                >
                  Continue <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
                </button>
              </div>
            </section>
          </motion.div>
        )}

        {/* STEP 2: RECIPIENT */}
        {step === 'recipient' && (
          <motion.div key="recipient" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col max-w-[430px] mx-auto w-full bg-background">
            <header className="px-6 pt-16 pb-4">
              <div className="flex items-center gap-2 text-on-surface mb-2">
                <button onClick={() => { haptics.light(); setStep('amount') }} className="hover:opacity-80 transition-opacity">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex flex-col">
                  <h1 className="font-headline font-semibold text-[22px] leading-none">Send {amountNum.toLocaleString()} {currentAsset.symbol}</h1>
                  <span className="font-label text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Step 2 of 3</span>
                </div>
              </div>
            </header>

            <div className="px-6 mb-6 mt-4">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Name, @username, or address"
                  className="w-full h-[52px] bg-surface rounded-xl pl-12 pr-12 font-body text-[15px] border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:opacity-80 transition-opacity">
                  <span className="material-symbols-outlined">qr_code_scanner</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-24">
              <h2 className="font-label font-bold text-[11px] text-on-surface-variant uppercase tracking-widest mb-4">Recent</h2>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 mb-8 -mx-2 px-2">
                {MOCK_CONTACTS.filter(c => c.recent).map(contact => (
                  <div key={contact.id} onClick={() => { haptics.light(); setRecipient(contact); setStep('review') }} className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0 w-[64px]">
                    <div className="w-12 h-12 rounded-full bg-primary-container/20 border-2 border-transparent group-hover:border-primary transition-colors flex items-center justify-center relative overflow-hidden">
                      {contact.avatar ? (
                        <div className="w-full h-full bg-surface-container flex items-center justify-center font-headline font-bold text-on-surface text-lg">{contact.avatar}</div>
                      ) : (
                        <span className="material-symbols-outlined text-on-surface-variant">person</span>
                      )}
                      {contact.bantupay && <div className="absolute right-0 bottom-0 w-3 h-3 bg-[#FC690A] border-2 border-background rounded-full" />}
                    </div>
                    <span className="font-body font-medium text-[11px] text-on-surface truncate w-full text-center">{contact.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>

              <h2 className="font-label font-bold text-[11px] text-on-surface-variant uppercase tracking-widest mb-4">All Contacts</h2>
              <div className="space-y-2">
                {MOCK_CONTACTS.map(contact => (
                  <div key={contact.id} onClick={() => { haptics.light(); setRecipient(contact); setStep('review') }} className="h-16 flex items-center p-2 rounded-xl hover:bg-surface-container-lowest border border-transparent hover:border-outline-variant/10 cursor-pointer transition-all">
                    <div className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center mr-4 font-headline font-bold text-on-surface">
                      {contact.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-headline font-semibold text-[15px] text-on-surface truncate">{contact.name}</h3>
                      <p className="font-body text-[13px] text-on-surface-variant truncate">{contact.handle}</p>
                    </div>
                    {contact.bantupay ? (
                      <div className="w-6 h-6 rounded-full bg-primary-container text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">person</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="fixed bottom-6 left-0 right-0 w-full max-w-[430px] mx-auto px-6">
              <button className="w-full h-[52px] bg-surface border border-outline-variant/20 rounded-full flex items-center justify-center gap-2 shadow-sm text-on-surface font-label font-bold text-[14px] hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[20px]">content_paste</span>
                Paste address
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: REVIEW & CONFIRM */}
        {step === 'review' && recipient && (
          <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col max-w-[430px] mx-auto w-full bg-background relative">
            <header className="px-6 pt-16 pb-4">
              <button onClick={() => { haptics.light(); setStep('recipient'); setErrorStatus(null); }} className="flex items-center gap-2 text-on-surface hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined">arrow_back</span>
                <h1 className="font-headline font-semibold text-[22px]">Review</h1>
              </button>
            </header>

            <main className="px-6 pb-24 flex-1">
              <div className="bg-surface rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-outline-variant/10 p-6 mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-body text-[12px] font-medium text-on-surface-variant">Sending</span>
                  <span className="font-headline font-bold text-[28px] text-on-surface">{amountNum.toLocaleString()} {currentAsset.symbol}</span>
                </div>
                <div className="flex justify-between items-baseline mb-4">
                  <span className="" />
                  <span className="font-body text-[13px] text-on-surface-variant">≈ {currentAsset.fiatSymbol}{(amountNum * (currentAsset.fiatValue / (currentAsset.balance||1))).toFixed(2)}</span>
                </div>
                
                <div className="w-full h-px bg-outline-variant/20 my-4" />
                
                <div className="flex justify-between items-center mb-4">
                  <span className="font-body text-[12px] font-medium text-on-surface-variant w-16">To</span>
                  <div className="flex items-center gap-2 text-right justify-end flex-1">
                    <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-headline font-bold text-[10px] text-on-surface">
                      {recipient.avatar}
                    </div>
                    <span className="font-label font-bold text-[13px] text-on-surface truncate">{recipient.name} <span className="font-normal text-on-surface-variant">({recipient.handle})</span></span>
                  </div>
                </div>
                
                <div className="w-full h-px bg-outline-variant/20 my-4" />
                
                <div className="flex justify-between items-center mb-4">
                  <span className="font-body text-[12px] font-medium text-on-surface-variant">Network fee</span>
                  <span className="font-label font-bold text-[13px] text-[#16A34A]">&lt; ₦0.01</span>
                </div>
                
                <div className="flex justify-between items-center mb-5">
                  <span className="font-body text-[12px] font-medium text-on-surface-variant">Est. arrival</span>
                  <span className="font-label font-bold text-[13px] text-on-surface-variant">~3 seconds</span>
                </div>

                <div className="w-full h-[2px] bg-outline-variant/10 my-4" />

                <div className="flex justify-between items-center py-1">
                  <span className="font-headline font-bold text-[15px] text-on-surface">Total deducted</span>
                  <span className="font-headline font-extrabold text-[17px] text-on-surface">{amountNum.toLocaleString()} {currentAsset.symbol}</span>
                </div>
              </div>

              <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/10 px-4 py-2 hover:border-primary transition-colors focus-within:border-primary overflow-hidden">
                <input 
                  type="text" 
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="Add a note (optional)" 
                  className="w-full h-12 bg-transparent outline-none font-body text-[14px]"
                  maxLength={28}
                />
              </div>

              {/* Error Status Ribbon */}
              <AnimatePresence>
                {errorStatus && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 bg-error-container text-on-error-container p-4 rounded-xl border-l-4 border-error flex gap-3 text-[13px] font-medium items-start">
                    <span className="material-symbols-outlined text-error text-[18px]">error</span>
                    <span>{errorStatus}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-12 flex flex-col items-center">
                <button 
                  onClick={executeSend}
                  disabled={isProcessing}
                  className={\`w-[80px] h-[80px] rounded-full flex items-center justify-center transition-all bg-primary-container text-primary shadow-lg \${isProcessing ? 'animate-pulse scale-95' : 'hover:scale-105 active:scale-95'}\`}
                >
                  <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'wght' 200" }}>{isProcessing ? 'hourglass_empty' : 'fingerprint'}</span>
                </button>
                <p className="font-headline font-semibold text-[14px] text-on-surface mt-4">{isProcessing ? 'Authorizing...' : 'Confirm with Face ID'}</p>
                <p className="font-body text-[12px] text-on-surface-variant font-medium mt-1">This authorizes the transaction</p>
              </div>
            </main>
          </motion.div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'success' && recipient && (
           <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col max-w-[430px] mx-auto w-full bg-[#0F0F12] px-6 text-center justify-center relative overflow-hidden">
            {/* Confetti particles simulated by background blobs */}
            <div className="absolute top-[20%] left-[10%] w-4 h-4 bg-[#FC690A] rounded-sm transform rotate-12 animate-pulse" />
            <div className="absolute top-[40%] right-[20%] w-3 h-3 bg-white rounded-full animate-bounce" />
            <div className="absolute bottom-[30%] left-[30%] w-5 h-5 bg-[#D4560A] rounded-full opacity-60" />
            
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }} className="w-20 h-20 rounded-full bg-transparent border-4 border-[#FC690A] flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-white opacity-20 rounded-full animate-ping" />
              <div className="w-16 h-16 bg-[#FC690A] rounded-full flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[36px] font-bold">check</span>
              </div>
            </motion.div>
            
            <h1 className="font-headline font-bold text-[32px] text-white">Sent!</h1>
            <p className="font-body text-[16px] text-white/70 mt-2 font-medium max-w-[260px] mx-auto">
              {amountNum.toLocaleString()} {currentAsset.symbol} sent to {recipient.name}
            </p>

            <div className="bg-[#1A1A20] rounded-2xl p-4 mt-8 mb-12 flex flex-col gap-1 items-center">
              <span className="font-body text-[13px] font-medium text-white">Transaction confirmed in 2.1s</span>
              <button className="font-label text-[12px] font-bold text-[#FC690A]">View on Explorer →</button>
            </div>

            <div className="space-y-3 w-full pb-10">
              <button onClick={() => haptics.light()} className="w-full h-14 rounded-full border border-white text-white font-headline font-bold text-[15px] hover:bg-white/10 transition-colors active:scale-95">
                Share Receipt
              </button>
              <button onClick={() => { haptics.light(); setStep('amount'); setAmount(''); setRecipient(null) }} className="w-full h-14 rounded-full text-white/60 font-headline font-bold text-[15px] hover:text-white transition-colors active:scale-95">
                Send Another
              </button>
              <button onClick={() => { haptics.medium(); router.push('/home') }} className="w-full h-14 rounded-full text-white/40 font-headline font-bold text-[15px] hover:text-white transition-colors active:scale-95">
                Back to Home
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
