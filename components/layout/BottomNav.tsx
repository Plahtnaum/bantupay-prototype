'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { House, ArrowsLeftRight, Wallet, User, QrCode } from 'phosphor-react'

const tabs = [
  { href: '/home',     icon: House,          label: 'Home'     },
  { href: '/activity', icon: ArrowsLeftRight, label: 'Activity' },
  { href: '/scan',     icon: QrCode,         label: 'Scan',     isFAB: true },
  { href: '/wallet',   icon: Wallet,         label: 'Wallet'   },
  { href: '/profile',  icon: User,           label: 'Profile'  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E8EAF0] safe-bottom">
      <div className="flex items-end justify-around px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = pathname.startsWith(tab.href)

          if (tab.isFAB) {
            return (
              <Link key={tab.href} href={tab.href} className="relative -top-5 flex flex-col items-center">
                <motion.div
                  whileTap={{ scale: 0.93 }}
                  className="w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-brand"
                  style={{ background: 'linear-gradient(135deg, #FC690A 0%, #D4560A 100%)' }}
                >
                  <Icon size={26} color="white" weight="bold" />
                </motion.div>
                <span className="text-[10px] mt-1 font-medium text-text-secondary font-[family-name:var(--font-inter)]">
                  {tab.label}
                </span>
              </Link>
            )
          }

          return (
            <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-0.5 min-w-[48px]">
              <motion.div whileTap={{ scale: 0.9 }} className="relative flex flex-col items-center">
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -top-1 w-8 h-1 bg-brand rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <Icon
                  size={24}
                  weight={active ? 'fill' : 'regular'}
                  color={active ? '#FC690A' : '#9CA3AF'}
                />
              </motion.div>
              <span className={`text-[10px] font-medium font-[family-name:var(--font-inter)] ${active ? 'text-brand' : 'text-text-secondary'}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
