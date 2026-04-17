'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { haptics } from '@/lib/haptics'

export function UpdateBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(true)
    window.addEventListener('sw-update-available', handler)
    return () => window.removeEventListener('sw-update-available', handler)
  }, [])

  const handleUpdate = () => {
    haptics.medium()
    navigator.serviceWorker.getRegistration().then(reg => {
      reg?.waiting?.postMessage('SKIP_WAITING')
      window.location.reload()
    })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -64, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 max-w-[430px] mx-auto z-[400] bg-on-surface text-surface flex items-center gap-3 px-4 py-3 shadow-lg"
        >
          <span className="material-symbols-outlined text-[20px] text-primary flex-shrink-0">system_update_alt</span>
          <p className="font-label font-bold text-[13px] flex-1">New version available</p>
          <button
            onClick={handleUpdate}
            className="bg-primary text-white font-label font-bold text-[12px] px-3 py-1.5 rounded-full active:scale-95 transition-transform"
          >
            Update
          </button>
          <button onClick={() => setVisible(false)} className="text-surface/60 hover:text-surface transition-colors ml-1">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
