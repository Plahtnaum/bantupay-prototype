'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, X } from 'phosphor-react'
import { haptics } from '@/lib/haptics'

interface ScreenHeaderProps {
  title?: string
  onBack?: () => void
  closeMode?: boolean
  rightAction?: React.ReactNode
  transparent?: boolean
  className?: string
}

export function ScreenHeader({
  title,
  onBack,
  closeMode = false,
  rightAction,
  transparent = false,
  className = '',
}: ScreenHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    haptics.light()
    if (onBack) onBack()
    else router.back()
  }

  return (
    <header className={`
      flex items-center justify-between px-4 h-14
      ${transparent ? '' : 'bg-white border-b border-[#E8EAF0]'}
      ${className}
    `}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleBack}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] transition-colors"
      >
        {closeMode
          ? <X size={22} color="#0F0F0F" weight="bold" />
          : <ArrowLeft size={22} color="#0F0F0F" weight="bold" />
        }
      </motion.button>

      {title && (
        <h1 className="text-base font-semibold text-[#0F0F0F] font-[family-name:var(--font-jakarta)] absolute left-1/2 -translate-x-1/2">
          {title}
        </h1>
      )}

      <div className="w-10 h-10 flex items-center justify-center">
        {rightAction}
      </div>
    </header>
  )
}
