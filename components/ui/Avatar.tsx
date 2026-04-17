interface AvatarProps {
  initials: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl' }

export function Avatar({ initials, size = 'md', className = '' }: AvatarProps) {
  return (
    <div className={`
      rounded-full flex items-center justify-center font-semibold text-white
      bg-gradient-to-br from-brand to-brand-dark flex-shrink-0
      font-[family-name:var(--font-inter)]
      ${sizes[size]} ${className}
    `}>
      {initials.slice(0, 2).toUpperCase()}
    </div>
  )
}
