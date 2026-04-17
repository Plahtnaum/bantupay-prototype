'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Asset } from '@/mock/assets'
import { haptics } from '@/lib/haptics'

type Props = {
  assets: Asset[]
  selectedIdx: number
  onSelect: (idx: number) => void
  showBalance?: boolean
}

export function AssetDropdown({ assets, selectedIdx, onSelect, showBalance = true }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = assets[selectedIdx] || assets[0]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => { haptics.light(); setOpen(o => !o) }}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-surface border border-outline-variant/20 shadow-sm hover:bg-surface-container-low transition-colors active:scale-95"
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] flex-shrink-0"
          style={{ backgroundColor: current.iconBg, color: current.color }}
        >
          {current.iconText}
        </div>
        <span className="font-headline font-bold text-[15px] text-on-surface">{current.symbol}</span>
        {showBalance && (
          <span className="font-mono text-[11px] text-on-surface-variant">
            {current.balance.toLocaleString()}
          </span>
        )}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="material-symbols-outlined text-on-surface-variant text-[18px] leading-none"
        >
          expand_more
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute left-0 top-full mt-2 z-50 bg-surface rounded-[20px] border border-outline-variant/10 shadow-xl overflow-hidden min-w-[220px]"
          >
            {assets.map((asset, idx) => (
              <button
                key={asset.id}
                onClick={() => { haptics.light(); onSelect(idx); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${selectedIdx === idx ? 'bg-primary/5' : 'hover:bg-surface-container-low'} ${idx < assets.length - 1 ? 'border-b border-outline-variant/5' : ''}`}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] flex-shrink-0"
                  style={{ backgroundColor: asset.iconBg, color: asset.color }}
                >
                  {asset.iconText}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-headline font-bold text-[14px] text-on-surface">{asset.symbol}</p>
                  <p className="font-body text-[12px] text-on-surface-variant truncate">
                    {asset.balance.toLocaleString()} available
                  </p>
                </div>
                {selectedIdx === idx && (
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
