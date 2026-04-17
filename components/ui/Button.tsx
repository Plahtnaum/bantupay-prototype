'use client'
import { motion } from 'framer-motion'
import { haptics } from '@/lib/haptics'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: Variant
  size?: Size
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit'
}

const variants: Record<Variant, string> = {
  primary:   'bg-brand text-white shadow-brand',
  secondary: 'bg-transparent border-[1.5px] border-brand text-brand',
  ghost:     'bg-transparent text-brand',
  danger:    'bg-semantic-error text-white',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-sm',
  md: 'h-12 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
}

export function Button({
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  className = '',
  type = 'button',
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <motion.button
      type={type}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      onClick={() => {
        if (!isDisabled) {
          haptics.light()
          onClick?.()
        }
      }}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center rounded-full font-[family-name:var(--font-inter)]
        font-semibold transition-colors select-none cursor-pointer
        ${sizes[size]}
        ${isDisabled ? 'bg-[#E8EAF0] text-[#A0A8B8] cursor-not-allowed shadow-none' : variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </span>
      ) : children}
    </motion.button>
  )
}
