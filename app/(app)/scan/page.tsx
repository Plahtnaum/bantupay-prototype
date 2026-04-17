'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { haptics } from '@/lib/haptics'

export default function ScanPage() {
  const router = useRouter()
  const [flashlight, setFlashlight] = useState(false)

  return (
    <div className="fixed inset-0 bg-[#0F0F0F] z-50 flex flex-col overflow-hidden max-w-[430px] mx-auto w-full">
      {/* Viewfinder area */}
      <div className="flex-1 relative flex items-center justify-center pt-24">
        {/* Navigation / Header overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
          <button onClick={() => { haptics.light(); router.back() }} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
          <div className="flex items-center gap-4">
             <button onClick={() => { haptics.light(); setFlashlight(!flashlight) }} className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${flashlight ? 'bg-[#FC690A] text-white shadow-[0_0_20px_rgba(252,105,10,0.4)]' : 'bg-white/10 text-white'}`}>
               <span className="material-symbols-outlined text-[22px]">{flashlight ? 'flashlight_on' : 'flashlight_off'}</span>
             </button>
             <button onClick={() => haptics.light()} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
               <span className="material-symbols-outlined text-[22px]">photo_library</span>
             </button>
          </div>
        </div>

        {/* The "Box" Viewfinder */}
        <div className="relative w-[280px] h-[280px]">
          {/* Animated scanning line */}
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }} 
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FC690A] to-transparent shadow-[0_0_15px_rgba(252,105,10,0.6)] z-10" 
          />
          
          {/* Box corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FC690A] rounded-tl-2xl shadow-[0_0_10px_rgba(252,105,10,0.3)]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FC690A] rounded-tr-2xl shadow-[0_0_10px_rgba(252,105,10,0.3)]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#FC690A] rounded-bl-2xl shadow-[0_0_10px_rgba(252,105,10,0.3)]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#FC690A] rounded-br-2xl shadow-[0_0_10px_rgba(252,105,10,0.3)]" />
          
          {/* Vignette texture inside box */}
          <div className="absolute inset-4 border border-white/5 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.03)_100%)] rounded-xl" />
        </div>

        <div className="absolute bottom-[20%] left-0 right-0 text-center px-12">
           <h2 className="font-headline font-semibold text-lg text-white mb-2">Scan QR Code</h2>
           <p className="font-body text-sm text-white/50 leading-relaxed">
             Frame a BantuPay QR, Web3 Connect, or Merchant code to pay instantly
           </p>
        </div>
      </div>

      {/* Footer / Demo Area */}
      <div className="bg-black/40 backdrop-blur-2xl p-8 border-t border-white/5">
        <div className="flex flex-col gap-4">
           {/* Simulate a detection */}
           <motion.button 
             initial={{ opacity: 0.8 }} whileTap={{ scale: 0.98 }}
             onClick={() => { haptics.success(); router.push('/send') }}
             className="w-full h-14 bg-white/10 rounded-2xl flex items-center justify-between px-5 border border-white/10 hover:bg-white/15 transition-all group"
           >
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FC690A]/20 text-[#FC690A] rounded-full flex items-center justify-center font-bold">@</div>
                <div className="text-left">
                  <p className="font-headline font-bold text-[14px] text-white">Detecting @chidi</p>
                  <p className="font-body text-[11px] text-white/40 font-bold uppercase tracking-widest">Merchant Account</p>
                </div>
             </div>
             <span className="material-symbols-outlined text-white/60 group-hover:text-white transition-colors">east</span>
           </motion.button>

           <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
             <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
             <span className="font-label text-[10px] font-bold text-white uppercase tracking-widest">Awaiting scan...</span>
           </div>
        </div>
      </div>
    </div>
  )
}
