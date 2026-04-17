'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useWalletStore } from '@/store/wallet.store'
import { CURATED_ASSETS } from '@/mock/assets'
import { haptics } from '@/lib/haptics'

export default function WalletPage() {
  const router = useRouter()
  const { assets, persona } = useWalletStore()
  const [isManageMode, setIsManageMode] = useState(false)
  const portfolioValue = assets.reduce((acc, curr) => acc + curr.fiatValue, 0)
  const isBalanceHidden = false // Mock toggle

  return (
    <div className="bg-background min-h-screen text-on-background pb-32">
      <header className="px-6 pt-16 pb-4 flex justify-between items-center sticky top-0 bg-surface/80 backdrop-blur-xl z-30">
        <h1 className="font-headline font-bold text-[24px] text-on-surface">Wallet</h1>
      </header>

      <main className="px-6 pt-4 space-y-6 max-w-md mx-auto w-full">
        {/* Total Value Card */}
        <div className="bg-gradient-to-br from-[#FC690A] to-[#D4560A] rounded-[24px] p-5 shadow-[0_4px_24px_rgba(252,105,10,0.25)] flex flex-col justify-between">
          <div>
            <span className="font-label font-bold text-[11px] text-white/80 uppercase tracking-widest">Portfolio Value</span>
            <div className="flex items-center justify-between mt-1 mb-2">
              <h2 className="font-headline font-extrabold text-[32px] tracking-tight text-white m-0 leading-none">
                {isBalanceHidden ? '• • • • • •' : \`₦\${portfolioValue.toLocaleString()}\`}
              </h2>
              <button onClick={() => haptics.light()} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-white/80 transition-colors hover:bg-white/20 active:scale-95">
                <span className="material-symbols-outlined text-[20px]">{isBalanceHidden ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
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
            <button onClick={() => { haptics.light(); router.push('/buy') }} className="flex-1 bg-white/10 hover:bg-white/20 rounded-xl py-2 flex flex-col items-center justify-center gap-1 transition-colors active:scale-95 text-white">
              <span className="material-symbols-outlined text-[20px]">payments</span>
              <span className="font-label font-bold text-[10px]">Buy</span>
            </button>
          </div>
        </div>

        {/* Curated Assets Horizontal Scroll */}
        <div className="bg-primary-container/20 -mx-6 px-6 py-6 border-y border-outline-variant/10">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-label font-bold text-[10px] text-primary tracking-[0.15em] uppercase">Curated by BantuPay</span>
            <span className="material-symbols-outlined text-primary text-[14px]">verified</span>
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {CURATED_ASSETS.map((tick, idx) => {
              const isInWallet = assets.some(a => a.symbol === tick)
              return (
                <div key={idx} className="bg-surface w-[100px] flex-shrink-0 p-3 rounded-[16px] shadow-sm border border-outline-variant/10 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-headline font-bold text-on-surface bg-surface-container" style={{ backgroundColor: isInWallet ? assets.find(a=>a.symbol===tick)?.iconBg : '#F0F1F5', color: assets.find(a=>a.symbol===tick)?.color || '#0F0F0F' }}>
                     {assets.find(a=>a.symbol===tick)?.iconText || tick.charAt(0)}
                  </div>
                  <span className="font-headline font-bold text-[13px] text-on-surface">{tick}</span>
                  {isInWallet ? (
                     <div className="bg-surface-container text-on-surface-variant font-label text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1">
                       <span className="material-symbols-outlined text-[12px]">check</span> Added
                     </div>
                  ) : (
                     <button className="bg-primary text-white font-label text-[10px] px-3 py-1 rounded-full font-bold active:scale-95 transition-transform shadow-sm">
                       Add
                     </button>
                  )}
                </div>
              )
            })}
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
                <div key={asset.id} onClick={() => !isManageMode && haptics.light()} className={\`h-[72px] bg-surface rounded-[16px] px-4 flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.06)] \${!isManageMode ? 'active:bg-surface-container-lowest cursor-pointer' : ''} transition-colors border border-outline-variant/10\`}>
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
                      {asset.issuer === 'native' ? 'Bantu Network' : \`\${asset.fiatSymbol}\${1.0.toFixed(2)}\`}
                    </p>
                  </div>
                  {!isManageMode ? (
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="font-headline font-bold text-[15px] text-on-surface mb-0.5">
                        {isBalanceHidden ? '•••' : asset.balance.toLocaleString()}
                      </span>
                      <span className="font-body text-[12px] text-on-surface-variant font-medium">
                        {isBalanceHidden ? '•••' : \`≈ ₦\${asset.fiatValue.toLocaleString()}\`}
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

            <button onClick={() => haptics.medium()} className="w-full h-[64px] border-2 border-dashed border-outline-variant/30 rounded-[16px] flex items-center justify-center gap-2 text-on-surface-variant hover:bg-surface-container-lowest transition-colors mt-4">
              <span className="material-symbols-outlined text-[20px] text-primary">add_circle</span>
              <span className="font-headline font-semibold text-[14px] text-primary">Add custom token</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
