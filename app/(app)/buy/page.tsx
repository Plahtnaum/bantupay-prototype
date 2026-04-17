'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { haptics } from '@/lib/haptics'
import Link from 'next/link'

export default function BuyPage() {
  const router = useRouter()
  const [amount, setAmount] = useState('50000')

  return (
    <div className="bg-background text-on-background font-body min-h-screen selection:bg-primary-container selection:text-on-primary">
      <header className="fixed top-0 w-full max-w-[430px] z-50 flex justify-between items-center px-6 h-16 bg-surface/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => { haptics.light(); router.back() }} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors active:scale-95 duration-200">
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-br from-[#FC690A] to-[#D4560A] bg-clip-text text-transparent font-headline tracking-tight">Buy cNGN</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-outline">notifications</span>
        </div>
      </header>

      <main className="pt-24 pb-40 px-6 max-w-lg mx-auto">
        <section className="text-center mb-10">
          <div className="inline-flex items-baseline gap-2 mb-2">
            <span className="text-on-surface-variant font-headline font-semibold text-lg uppercase tracking-widest">NGN</span>
            <div className="font-headline font-bold text-[40px] tracking-tight text-on-surface flex items-center justify-center">
              {Number(amount).toLocaleString()}
              <span className="w-1 h-10 bg-primary-container ml-1 animate-pulse" />
            </div>
          </div>
          <p className="text-on-surface-variant font-mono text-sm">≈ {((Number(amount) / 1000) * 0.99).toFixed(2)} cNGN</p>
        </section>

        <section className="mb-12 max-w-[280px] mx-auto w-full">
          <div className="grid grid-cols-3 gap-y-4 gap-x-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button key={num} onClick={() => haptics.light()} className="h-14 flex items-center justify-center text-2xl font-headline font-semibold text-on-surface hover:bg-surface-container transition-colors rounded-xl active:scale-95 duration-200">
                {num}
              </button>
            ))}
            <button onClick={() => haptics.light()} className="h-14 flex items-center justify-center text-2xl font-headline font-semibold text-on-surface hover:bg-surface-container transition-colors rounded-xl active:scale-95 duration-200">.</button>
            <button onClick={() => haptics.light()} className="h-14 flex items-center justify-center text-2xl font-headline font-semibold text-on-surface hover:bg-surface-container transition-colors rounded-xl active:scale-95 duration-200">0</button>
            <button onClick={() => haptics.medium()} className="h-14 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl active:scale-95 duration-200">
              <span className="material-symbols-outlined text-3xl">backspace</span>
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-headline font-bold text-lg text-on-surface px-1">Payment Method</h2>
          
          <div className="group cursor-pointer bg-surface-container-low rounded-2xl p-4 flex items-center justify-between transition-all hover:bg-surface-container-high active:scale-[0.98] border border-transparent hover:border-outline-variant/20 shadow-sm hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-container">account_balance</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface text-[15px]">Bank Transfer</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-bold text-tertiary-container bg-tertiary-container/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Instant</span>
                  <span className="text-xs text-on-surface-variant font-medium">0% fee</span>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>

          <div className="group cursor-pointer bg-surface-container-low rounded-2xl p-4 flex items-center justify-between transition-all hover:bg-surface-container-high active:scale-[0.98] border border-transparent hover:border-outline-variant/20 shadow-sm hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#77320b]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#77320b]">credit_card</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface text-[15px]">Debit/Credit Card</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-on-surface-variant font-medium">Visa / Mastercard</span>
                  <span className="text-xs text-on-surface-variant font-bold">• 1.5% fee</span>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>

          <div className="group cursor-pointer bg-surface-container-low rounded-2xl p-4 flex items-center justify-between transition-all hover:bg-surface-container-high active:scale-[0.98] border border-transparent hover:border-outline-variant/20 shadow-sm hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0062a1]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#0062a1]">dialpad</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface text-[15px]">USSD</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-on-surface-variant font-medium">0% fee</span>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>
        </section>

        <div className="mt-10 mb-8">
          <button onClick={() => haptics.medium()} className="w-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white py-4 rounded-full font-headline font-bold text-lg shadow-[0_8px_24px_rgba(252,105,10,0.25)] hover:shadow-[0_12px_32px_rgba(252,105,10,0.35)] transition-all active:scale-95">
            Preview Buy
          </button>
        </div>
      </main>

      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[40%] bg-primary-container/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[5%] left-[-10%] w-[40%] h-[30%] bg-tertiary-container/5 rounded-full blur-[100px] pointer-events-none z-0" />
    </div>
  )
}
