'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useToastStore } from '@/store/toast.store'

const typeStyles = {
  success: 'border-l-4 border-semantic-success',
  error:   'border-l-4 border-semantic-error',
  info:    'border-l-4 border-brand',
  warning: 'border-l-4 border-semantic-warning',
}

const icons = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
}

export function ToastContainer() {
  const { toasts, dismiss } = useToastStore()

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`
              pointer-events-auto bg-[#0F0F0F] text-white rounded-xl px-4 py-3
              flex items-center gap-3 shadow-lg
              ${typeStyles[t.type]}
            `}
            onClick={() => dismiss(t.id)}
          >
            <span className="text-sm">{icons[t.type]}</span>
            <p className="text-sm font-medium font-[family-name:var(--font-inter)]">{t.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
