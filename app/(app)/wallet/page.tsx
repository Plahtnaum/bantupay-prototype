'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useWalletStore } from '@/store/wallet.store'
import { CURATED_ASSETS } from '@/mock/assets'
import { haptics } from '@/lib/haptics'

export default function WalletPage() {
  const router = useRouter()
  const { assets, balanceHidden, toggleBalanceHidden } = useWalletStore()
  const [isManageMode, setIsManageMode] = useState(false)

  const portfolioValue = assets.reduce((acc, curr) => acc + curr.fiatValue, 0)

  return (
    <div className="bg-background min-h-screen text-on-background pb-36">
      <header className="px-6 pt-12 pb-2 flex items-center justify-between sticky top-0 bg-surface/80 backdrop-blur-xl z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { haptics.light(); router.push('/home') }}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
          </button>
          <h1 className="font-headline font-bold text-[24px] text-on-surface">Assets</h1>
        </div>
      </header>

      <main className="px-6 pt-4 space-y-6 max-w-md mx-auto w-full">
        {/* Portfolio value — simple, no orange card */}
        <div className="pt-2 pb-4">
          <p className="font-label font-bold text-[11px] text-on-surface-variant uppercase tracking-widest mb-2">Total Portfolio</p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => { haptics.light(); toggleBalanceHidden() }}
            className="flex items-center gap-3 text-left"
          >
            <h2 className="font-headline font-extrabold text-[36px] tracking-tight text-on-surface leading-none">
              {balanceHidden ? <span className="opacity-40">₦ • • •</span> : `₦${portfolioValue.toLocaleString()}`}
            </h2>
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
              {balanceHidden ? 'visibility_off' : 'visibility'}
            </span>
          </motion.button>
        </div>

        {/* My Assets List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase">
              {isManageMode ? 'Editing' : 'My Assets'}
            </span>
            <button
              onClick={() => { haptics.light(); setIsManageMode(!isManageMode) }}
              className="font-label font-bold text-[12px] text-primary hover:opacity-80 transition-opacity"
            >
              {isManageMode ? 'Done' : 'Manage'}
            </button>
          </div>

          <div className="space-y-2">
            {assets.length === 0 ? (
              <div className="py-8 bg-surface rounded-[20px] border-2 border-dashed border-outline-variant/20 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-on-surface-variant">account_balance_wallet</span>
                </div>
                <span className="font-headline font-bold text-[15px] text-on-surface">No assets yet</span>
                <span className="font-body text-[13px] text-on-surface-variant max-w-[200px]">Add a custom asset or fund your wallet</span>
              </div>
            ) : (
              assets.map((asset, i) => {
                const isCurated = CURATED_ASSETS.includes(asset.symbol)
                return (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => { if (!isManageMode) { haptics.light(); router.push(`/asset/${asset.id}`) } }}
                    className={`h-[72px] bg-surface rounded-[16px] px-4 flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${!isManageMode ? 'active:bg-surface-container-lowest cursor-pointer' : ''} transition-colors border border-outline-variant/10`}
                  >
                    {isManageMode && (
                      <button className="mr-3 text-error active:scale-90 transition-transform">
                        <span className="material-symbols-outlined">remove_circle</span>
                      </button>
                    )}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[15px] mr-3"
                      style={{ backgroundColor: asset.iconBg, color: asset.color }}
                    >
                      {asset.iconText}
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-headline font-bold text-[15px] text-on-surface leading-snug truncate">{asset.symbol}</h3>
                        {isCurated && (
                          <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        )}
                      </div>
                      <p className="font-body text-[13px] text-on-surface-variant truncate">{asset.name}</p>
                    </div>
                    {!isManageMode ? (
                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className="font-headline font-bold text-[15px] text-on-surface mb-0.5">
                          {balanceHidden ? '•••' : asset.balance.toLocaleString()}
                        </span>
                        <span className="font-body text-[12px] text-on-surface-variant font-medium">
                          {balanceHidden ? '•••' : `≈ ₦${asset.fiatValue.toLocaleString()}`}
                        </span>
                      </div>
                    ) : (
                      <span className="material-symbols-outlined text-on-surface-variant/30">drag_handle</span>
                    )}
                  </motion.div>
                )
              })
            )}

            {!isManageMode && (
              <button
                onClick={() => { haptics.medium(); router.push('/safes') }}
                className="w-full h-[64px] bg-primary/5 border-2 border-dashed border-primary/20 rounded-[16px] flex items-center justify-between px-5 text-primary hover:bg-primary/10 transition-colors mt-4"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">shield</span>
                  <span className="font-headline font-bold text-[14px]">Shared Safes</span>
                </div>
                <span className="font-label font-bold text-[10px] bg-primary/20 px-2 py-0.5 rounded-full uppercase">Advanced</span>
              </button>
            )}

            <button
              onClick={() => { haptics.medium(); router.push('/add-token') }}
              className="w-full h-[64px] border-2 border-dashed border-outline-variant/30 rounded-[16px] flex items-center justify-center gap-2 text-primary hover:bg-primary/5 transition-colors mt-2"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span className="font-headline font-semibold text-[14px]">Add custom token</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
