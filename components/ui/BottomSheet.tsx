'use client'
import { motion, AnimatePresence } from 'framer-motion'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="w-8 h-1 bg-[#E8EAF0] rounded-full mx-auto mt-3 mb-1" />
            {title && (
              <div className="px-5 py-4 border-b border-[#E8EAF0]">
                <h3 className="font-[family-name:var(--font-jakarta)] font-semibold text-lg text-[#0F0F0F]">{title}</h3>
              </div>
            )}
            <div className="px-5 pb-10 pt-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
