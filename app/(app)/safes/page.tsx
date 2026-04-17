'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { haptics } from '@/lib/haptics'
import { useWalletStore } from '@/store/wallet.store'

type Step = 'list' | 'create' | 'safe-view'

export default function SafesPage() {
  const router = useRouter()
  const { assets } = useWalletStore()
  const [step, setStep] = useState<Step>('list')
  const [selectedSafe, setSelectedSafe] = useState<any>(null)

  const mockSafes = [
    { id: '1', name: 'Family Fund', balance: 12500, asset: 'cNGN', owners: 3, required: 2, pending: 1 },
    { id: '2', name: 'Bantu Builders DAO', balance: 450000, asset: 'XBN', owners: 5, required: 3, pending: 0 },
  ]

  return (
    <div className="bg-background min-h-screen text-on-background pb-32 w-full max-w-[430px] mx-auto">
      <AnimatePresence mode="wait">
        {step === 'list' && (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="px-6 pt-16">
            <header className="flex justify-between items-center mb-8">
              <button onClick={() => { haptics.light(); router.back() }} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <h1 className="font-headline font-bold text-[28px] text-on-surface tracking-tight">Safes</h1>
              <button
                onClick={() => { haptics.medium(); setStep('create') }}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined font-bold">add</span>
              </button>
            </header>

            <p className="font-body text-[14px] text-on-surface-variant font-medium mb-8">
                Safely manage assets with multiple owners using Multi-sig technology.
            </p>

            <div className="space-y-4">
              {mockSafes.map((safe) => (
                <div 
                  key={safe.id} 
                  onClick={() => { haptics.light(); setSelectedSafe(safe); setStep('safe-view') }}
                  className="bg-surface rounded-2xl p-5 border border-outline-variant/10 shadow-sm active:bg-surface-container-low transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[24px]">shield</span>
                        </div>
                        <div>
                            <h3 className="font-headline font-bold text-[16px] text-on-surface group-hover:text-primary transition-colors">{safe.name}</h3>
                            <p className="font-body text-[12px] text-on-surface-variant font-medium">{safe.required}-of-{safe.owners} Signers</p>
                        </div>
                    </div>
                    {safe.pending > 0 && (
                        <span className="bg-error-container/20 text-error text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">{safe.pending} Pending</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Balance</span>
                        <span className="font-headline font-extrabold text-[18px] text-on-surface">{safe.balance.toLocaleString()} {safe.asset}</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors">chevron_right</span>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => { haptics.medium(); setStep('create') }}
                className="w-full h-[72px] border-2 border-dashed border-outline-variant/20 rounded-2xl flex items-center justify-center gap-2 text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-primary">add_circle</span>
                <span className="font-headline font-bold text-[15px] text-primary">Create new Safe</span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 'create' && (
            <motion.div key="create" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full bg-background min-h-screen">
                <header className="px-6 pt-16 pb-4">
                    <button onClick={() => { haptics.light(); setStep('list') }} className="flex items-center gap-2 text-on-surface">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <h1 className="font-headline font-semibold text-[22px]">New Safe</h1>
                    </button>
                </header>

                <main className="px-8 pt-8 flex-1 space-y-8 pb-32">
                    <div className="space-y-4">
                        <h3 className="font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase">Basic Info</h3>
                        <input className="w-full h-14 bg-surface rounded-xl border border-outline-variant/30 px-5 font-body outline-none focus:border-primary transition-all" placeholder="Safe Name (e.g. Wedding Fund)" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase">Add Owners</h3>
                            <button className="text-[12px] font-bold text-primary">+ Add Owner</button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-outline-variant/10">
                                <div className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-xs">M</div>
                                <div className="flex-1">
                                    <p className="text-[13px] font-bold text-on-surface">Me (Owner)</p>
                                    <p className="text-[11px] text-on-surface-variant truncate font-mono">GBPTV...XXXQ</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase">Threshold</h3>
                        <div className="bg-surface p-4 rounded-xl border border-outline-variant/10">
                            <p className="font-body text-[14px] text-on-surface-variant mb-4 font-medium">Any transaction requires the approval of:</p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-headline font-bold text-xl text-on-surface">1</span>
                                    <span className="font-body text-sm text-on-surface-variant">out of</span>
                                    <span className="font-headline font-bold text-xl text-on-surface">1</span>
                                </div>
                                <span className="font-body text-sm text-on-surface-variant">owners</span>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background to-transparent w-full max-w-[430px] mx-auto">
                    <button onClick={() => { haptics.success(); setStep('list') }} className="w-full h-14 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-lg rounded-full shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                        Create Safe <span className="material-symbols-outlined text-[20px] font-bold">verified</span>
                    </button>
                </footer>
            </motion.div>
        )}

        {step === 'safe-view' && selectedSafe && (
             <motion.div key="safe-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full bg-background min-h-screen">
                <header className="px-6 pt-16 pb-4">
                    <button onClick={() => { haptics.light(); setStep('list') }} className="flex items-center gap-2 text-on-surface">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <h1 className="font-headline font-semibold text-[22px]">{selectedSafe.name}</h1>
                    </button>
                </header>

                <main className="px-6 pt-8 space-y-8">
                     <div className="bg-surface rounded-[24px] p-6 text-center border border-outline-variant/10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                             <span className="material-symbols-outlined text-[64px]">shield</span>
                        </div>
                        <span className="font-label font-bold text-[11px] text-on-surface-variant uppercase tracking-widest block mb-1">Safe Balance</span>
                        <h2 className="font-headline font-bold text-[32px] text-on-surface mb-6">{selectedSafe.balance.toLocaleString()} {selectedSafe.asset}</h2>
                        
                        <div className="flex gap-4">
                             <button onClick={() => haptics.light()} className="flex-1 h-12 rounded-xl bg-primary text-white font-label font-bold text-[13px] shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                                Send
                             </button>
                             <button onClick={() => haptics.light()} className="flex-1 h-12 rounded-xl bg-surface-container text-on-surface font-label font-bold text-[13px] border border-outline-variant/10 active:scale-95 transition-transform flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                                Receive
                             </button>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h3 className="font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase mb-4">Pending Approvals</h3>
                        {selectedSafe.pending > 0 ? (
                            <div className="bg-error-container/5 border border-error/10 p-4 rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-error-container/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center font-bold">1</div>
                                    <div className="text-left">
                                        <p className="font-headline font-bold text-[14px] text-on-surface">Send 1,200 {selectedSafe.asset}</p>
                                        <p className="font-body text-[11px] text-on-surface-variant">Needs 1 more signature</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-error font-bold">pending_actions</span>
                            </div>
                        ) : (
                            <div className="py-8 bg-surface-container-low/30 rounded-2xl border border-dashed border-outline-variant/20 flex flex-col items-center justify-center text-on-surface-variant">
                                <span className="material-symbols-outlined text-[32px] opacity-20 mb-2">check_circle</span>
                                <span className="font-body text-[13px] font-medium">No pending transactions</span>
                            </div>
                        )}
                     </div>

                     <div className="space-y-4 pb-20">
                         <h3 className="font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase mb-4">Owners ({selectedSafe.owners})</h3>
                         <div className="grid grid-cols-2 gap-3">
                            {Array.from({ length: selectedSafe.owners }).map((_, i) => (
                                <div key={i} className="bg-surface p-3 rounded-xl border border-outline-variant/10 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-primary-container/20 text-primary flex items-center justify-center text-[10px] font-bold">O</div>
                                    <span className="font-mono text-[10px] text-on-surface-variant truncate">GBPTV...{i}XQ</span>
                                </div>
                            ))}
                         </div>
                     </div>
                </main>
             </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
