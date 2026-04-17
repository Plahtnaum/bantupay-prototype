'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useWalletStore } from '@/store/wallet.store'
import { CURATED_ASSETS } from '@/mock/assets'
import { haptics } from '@/lib/haptics'

export default function WalletPage() {
  const router = useRouter()
  const { assets } = useWalletStore()
  const [isManageMode, setIsManageMode] = useState(false)
  const [tradeAssetIdx, setTradeAssetIdx] = useState(0)
  const [curatedMoreOpen, setCuratedMoreOpen] = useState(false)
  const curatedMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (curatedMoreRef.current && !curatedMoreRef.current.contains(e.target as Node)) {
        setCuratedMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const tradeAsset = assets[tradeAssetIdx] || assets[0]
  const portfolioValue = assets.reduce((acc, curr) => acc + curr.fiatValue, 0)
  const isBalanceHidden = false // Mock toggle

  return (
    <div className="bg-background min-h-screen text-on-background pb-32">
      <header className="px-6 pt-12 pb-4 flex justify-between items-center sticky top-0 bg-surface/80 backdrop-blur-xl z-30">
        <h1 className="font-headline font-bold text-[24px] text-on-surface">Assets</h1>
      </header>

      <main className="px-6 pt-4 space-y-6 max-w-md mx-auto w-full">
        {/* Total Value Card */}
        <div className="bg-gradient-to-br from-[#FC690A] to-[#D4560A] rounded-[24px] p-5 shadow-[0_4px_24px_rgba(252,105,10,0.25)] flex flex-col justify-between">
          <div>
            <span className="font-label font-bold text-[11px] text-white/80 uppercase tracking-widest">Portfolio Value</span>
            <div className="flex items-center justify-between mt-1 mb-2">
              <h2 className="font-headline font-extrabold text-[32px] tracking-tight text-white m-0 leading-none">
                {isBalanceHidden ? '• • • • • •' : `₦${portfolioValue.toLocaleString()}`}
              </h2>
              <button onClick={() => haptics.light()} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-white/80 transition-colors hover:bg-white/20 active:scale-95">
                <span className="material-symbols-outlined text-[20px]">{isBalanceHidden ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>
          {/* Asset context for Buy/Sell */}
          <div className="flex items-center gap-2 mt-3 mb-1">
            <span className="font-label font-bold text-[10px] text-white/60 uppercase tracking-widest">Trade asset:</span>
            <div className="flex gap-1">
              {assets.map((a, idx) => (
                <button
                  key={a.id}
                  onClick={() => { haptics.light(); setTradeAssetIdx(idx) }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-label font-bold transition-colors ${tradeAssetIdx === idx ? 'bg-white text-primary' : 'bg-white/15 text-white hover:bg-white/25'}`}
                >
                  {a.symbol}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <button onClick={() => { haptics.light(); router.push('/send') }} className="flex-1 bg-white/10 hover:bg-white/20 rounded-xl py-2 flex flex-col items-center justify-center gap-1 transition-colors active:scale-95 text-white">
              <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
              <span className="font-label font-bold text-[10px]">Send</span>
            </button>
            <button onClick={() => { haptics.light(); router.push('/receive') }} className="flex-1 bg-white/10 hover:bg-white/20 rounded-xl py-2 flex flex-col items-center justify-center gap-1 transition-colors active:scale-95 text-white">
              <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
              <span className="font-label font-bold text-[10px]">Receive</span>
            </button>
            <button onClick={() => { haptics.light(); router.push('/swap') }} className="flex-1 bg-white/10 hover:bg-white/20 rounded-xl py-2 flex flex-col items-center justify-center gap-1 transition-colors active:scale-95 text-white">
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
              <span className="font-label font-bold text-[10px]">Swap</span>
            </button>
            <button onClick={() => { haptics.light(); router.push(`/buy?asset=${tradeAsset.symbol}`) }} className="flex-1 bg-white/10 hover:bg-white/20 rounded-xl py-2 flex flex-col items-center justify-center gap-1 transition-colors active:scale-95 text-white">
              <span className="material-symbols-outlined text-[20px]">add_card</span>
              <span className="font-label font-bold text-[10px]">Buy</span>
            </button>
            <button onClick={() => { haptics.light(); router.push(`/sell?asset=${tradeAsset.symbol}`) }} className="flex-1 bg-white/10 hover:bg-white/20 rounded-xl py-2 flex flex-col items-center justify-center gap-1 transition-colors active:scale-95 text-white">
              <span className="material-symbols-outlined text-[20px]">payments</span>
              <span className="font-label font-bold text-[10px]">Sell</span>
            </button>
          </div>
        </div>

        {/* Curated Assets — compact row + overflow dropdown */}
        <div className="bg-primary-container/20 -mx-6 px-6 py-4 border-y border-outline-variant/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-label font-bold text-[10px] text-primary tracking-[0.15em] uppercase">Curated by BantuPay</span>
            <span className="material-symbols-outlined text-primary text-[14px]">verified</span>
          </div>
          <div className="flex items-center gap-4">
            {CURATED_ASSETS.slice(0, 3).map((tick, idx) => {
              const asset = assets.find(a => a.symbol === tick)
              const isInWallet = !!asset
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-headline font-bold text-[15px] shadow-sm border border-outline-variant/10" style={{ backgroundColor: asset?.iconBg ?? '#F0F1F5', color: asset?.color ?? '#0F0F0F' }}>
                    {asset?.iconText ?? tick.charAt(0)}
                  </div>
                  <span className="font-headline font-bold text-[11px] text-on-surface">{tick}</span>
                  {isInWallet ? (
                    <span className="material-symbols-outlined text-[#16A34A] text-[14px]">check_circle</span>
                  ) : (
                    <button className="font-label font-bold text-[10px] text-primary active:opacity-70">+ Add</button>
                  )}
                </div>
              )
            })}
            {CURATED_ASSETS.length > 3 && (
              <div ref={curatedMoreRef} className="relative ml-auto">
                <button
                  onClick={() => { haptics.light(); setCuratedMoreOpen(o => !o) }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-12 h-12 rounded-full bg-surface-container border border-outline-variant/10 flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">more_horiz</span>
                  </div>
                  <span className="font-label font-bold text-[11px] text-on-surface-variant">{CURATED_ASSETS.length - 3} more</span>
                </button>
                <AnimatePresence>
                  {curatedMoreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute right-0 top-full mt-2 z-50 bg-surface rounded-[16px] border border-outline-variant/10 shadow-xl overflow-hidden min-w-[160px]"
                    >
                      {CURATED_ASSETS.slice(3).map((tick, idx) => {
                        const asset = assets.find(a => a.symbol === tick)
                        return (
                          <button key={idx} onClick={() => { haptics.light(); setCuratedMoreOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px]" style={{ backgroundColor: asset?.iconBg ?? '#F0F1F5', color: asset?.color ?? '#0F0F0F' }}>
                              {asset?.iconText ?? tick.charAt(0)}
                            </div>
                            <span className="font-headline font-bold text-[14px] text-on-surface">{tick}</span>
                            <span className="ml-auto font-label font-bold text-[11px] text-primary">+ Add</span>
                          </button>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* My Assets List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase">{isManageMode ? 'Editing Assets' : 'My Assets'}</span>
            <button 
              onClick={() => { haptics.light(); setIsManageMode(!isManageMode) }}
              className="font-label font-bold text-[12px] text-primary hover:opacity-80 transition-opacity"
            >
              {isManageMode ? 'Done' : 'Manage'}
            </button>
          </div>
          
          <div className="space-y-2">
            {assets.length === 0 ? (
               <div className="py-8 bg-surface rounded-[20px] dashed border-2 border-outline-variant/20 flex flex-col items-center text-center">
                 <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-2">
                   <span className="material-symbols-outlined text-on-surface-variant">account_balance_wallet</span>
                 </div>
                 <span className="font-headline font-bold text-[15px] text-on-surface">No assets yet</span>
                 <span className="font-body text-[13px] text-on-surface-variant max-w-[200px]">Add a custom asset or track curated tokens</span>
               </div>
            ) : (
              assets.map((asset) => (
                <div key={asset.id} onClick={() => !isManageMode && haptics.light()} className={`h-[72px] bg-surface rounded-[16px] px-4 flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${!isManageMode ? 'active:bg-surface-container-lowest cursor-pointer' : ''} transition-colors border border-outline-variant/10`}>
                  {isManageMode && (
                    <button className="mr-3 text-error active:scale-90 transition-transform">
                      <span className="material-symbols-outlined">remove_circle</span>
                    </button>
                  )}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[15px] mr-3" style={{ backgroundColor: asset.iconBg, color: asset.color }}>
                    {asset.iconText}
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-headline font-bold text-[15px] text-on-surface leading-snug truncate">{asset.symbol}</h3>
                    <p className="font-body text-[13px] text-on-surface-variant truncate">
                      {asset.name}
                    </p>
                  </div>
                  {!isManageMode ? (
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="font-headline font-bold text-[15px] text-on-surface mb-0.5">
                        {isBalanceHidden ? '•••' : asset.balance.toLocaleString()}
                      </span>
                      <span className="font-body text-[12px] text-on-surface-variant font-medium">
                        {isBalanceHidden ? '•••' : `≈ ₦${asset.fiatValue.toLocaleString()}`}
                      </span>
                    </div>
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant/30">drag_handle</span>
                  )}
                </div>
              ))
            )}
            
            {!isManageMode && (
              <button 
                onClick={() => { haptics.medium(); router.push('/safes') }}
                className="w-full h-[64px] bg-primary/5 border-2 border-dashed border-primary/20 rounded-[16px] flex items-center justify-between px-5 text-primary hover:bg-primary/10 transition-colors mt-6"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">shield</span>
                  <span className="font-headline font-bold text-[14px]">Shared Safes</span>
                </div>
                <span className="font-label font-bold text-[10px] bg-primary/20 px-2 py-0.5 rounded-full uppercase">Advanced</span>
              </button>
            )}

            <button onClick={() => { haptics.medium(); router.push('/add-token') }} className="w-full h-[64px] border-2 border-dashed border-outline-variant/30 rounded-[16px] flex items-center justify-center gap-2 text-primary hover:bg-primary/5 transition-colors mt-4">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span className="font-headline font-semibold text-[14px]">Add custom token</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
