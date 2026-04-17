type BadgeVariant = 'orange' | 'green' | 'red' | 'grey' | 'blue' | 'purple'

const styles: Record<BadgeVariant, string> = {
  orange: 'bg-brand-wash text-brand',
  green:  'bg-[#F0FDF4] text-semantic-success',
  red:    'bg-[#FEF2F2] text-semantic-error',
  grey:   'bg-[#F0F1F5] text-text-secondary',
  blue:   'bg-[#EFF6FF] text-[#2563EB]',
  purple: 'bg-purple-50 text-purple-700',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'grey', children, className = '' }: BadgeProps) {
  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
      font-[family-name:var(--font-inter)]
      ${styles[variant]} ${className}
    `}>
      {children}
    </span>
  )
}
