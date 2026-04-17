'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { haptics } from '@/lib/haptics'
import { useUserStore } from '@/store/user.store'
import Image from 'next/image'

export default function CashoutPage() {
  const router = useRouter()
  const persona = useUserStore(state => state.persona)
  const [amount, setAmount] = useState('125000')

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center">
      <header className="fixed top-0 w-full max-w-[430px] z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <button onClick={() => { haptics.light(); router.back() }} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors active:scale-95 duration-200">
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-br from-[#FC690A] to-[#D4560A] bg-clip-text text-transparent font-headline tracking-tight">
            Cashout cNGN
          </h1>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden relative">
            {persona?.avatar && <Image src={persona.avatar} alt="Avatar" fill className="object-cover" />}
          </div>
        </div>
      </header>

      <main className="w-full max-w-md pt-24 pb-32 px-6 flex flex-col grow">
        <section className="flex flex-col items-center mb-8">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-extrabold font-headline text-on-surface">
              {Number(amount).toLocaleString()}
            </span>
            <span className="text-xl font-bold text-[#FC690A] font-headline">cNGN</span>
          </div>
          <p className="text-on-surface-variant font-mono text-sm font-bold opacity-80">≈ ₦{Number(amount).toLocaleString()}</p>
        </section>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-1 shadow-sm border border-outline-variant/10">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Balance</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-sm font-bold text-on-surface">450,230</span>
              <span className="text-[10px] font-bold text-[#FC690A]">cNGN</span>
            </div>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-1 shadow-sm border border-outline-variant/10">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Fee</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-sm font-bold text-on-surface">100</span>
              <span className="text-[10px] font-bold text-[#FC690A]">cNGN</span>
            </div>
          </div>
        </div>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-on-surface-variant">Destination Account</h3>
            <button onClick={() => haptics.light()} className="text-xs font-bold text-[#FC690A] hover:opacity-80 transition-opacity">Add bank account</button>
          </div>
          
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-surface-container-lowest border-2 border-[#FC690A]/50 flex items-center justify-between shadow-sm cursor-pointer" onClick={() => haptics.light()}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#FC690A]">account_balance</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-on-surface hover:text-[#FC690A] transition-colors">Kuda Microfinance Bank</p>
                  <p className="text-xs font-mono text-on-surface-variant font-medium mt-0.5">201****458 • {persona?.name.toUpperCase() || 'ADEMOLA T.'}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#FC690A] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between hover:bg-surface-container-high transition-colors cursor-pointer group border border-transparent shadow-sm" onClick={() => haptics.light()}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-on-surface-variant">account_balance</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-on-surface">Access Bank PLC</p>
                  <p className="text-xs font-mono text-on-surface-variant mt-0.5">004****992 • {persona?.name.toUpperCase() || 'ADEMOLA T.'}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant">radio_button_unchecked</span>
            </div>
          </div>
        </section>

        <section className="mt-auto grid grid-cols-3 gap-y-4 gap-x-8 max-w-[280px] mx-auto w-full">
          {[1,2,3,4,5,6,7,8,9,'.','0'].map((key) => (
             <button key={key} onClick={() => haptics.light()} className="h-12 flex items-center justify-center text-2xl font-headline font-bold text-on-surface active:scale-90 transition-transform">
               {key}
             </button>
          ))}
          <button onClick={() => haptics.medium()} className="h-12 flex items-center justify-center active:scale-90 transition-transform text-outline">
            <span className="material-symbols-outlined text-3xl">backspace</span>
          </button>
        </section>
      </main>

      <div className="fixed bottom-0 w-full max-w-[430px] p-6 bg-gradient-to-t from-background via-background/90 to-transparent">
        <button onClick={() => { haptics.medium(); router.push('/home') }} className="w-full h-14 rounded-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-bold text-lg shadow-[0_8px_24px_rgba(252,105,10,0.25)] active:scale-[0.98] transition-transform duration-200 flex items-center justify-center gap-2">
          Continue to Review
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </div>
  )
}
