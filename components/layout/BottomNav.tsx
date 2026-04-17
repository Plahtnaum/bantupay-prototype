'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { House, Wallet, ClockCounterClockwise, Gear, QrCode } from 'phosphor-react'
import { haptics } from '@/lib/haptics'

const tabs = [
  { href: '/home',     icon: House,   label: 'Home'    },
  { href: '/assets',   icon: Wallet,  label: 'Assets'  },
  { href: '/scan',     icon: QrCode,  label: 'SCAN',   isFAB: true },
  { href: '/history',  icon: ClockCounterClockwise, label: 'History' },
  { href: '/profile',  icon: Gear,    label: 'Settings'},
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Curved/Glass Container */}
      <div className="relative bg-surface/90 backdrop-blur-2xl h-[80px] rounded-t-[24px] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] flex justify-around items-center px-4 safe-bottom border-t border-white/5">
        
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href || (tab.href !== '/home' && pathname.startsWith(tab.href))
          
          if (tab.isFAB) {
            return (
              <div key={tab.href} className="relative -top-8 flex flex-col items-center">
                <Link 
                  href={tab.href}
                  onClick={() => haptics.medium()}
                  className="w-16 h-16 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center shadow-brand ring-8 ring-surface active:scale-95 transition-transform"
                >
                  <Icon size={32} color="white" weight="bold" />
                </Link>
                <span className="text-[10px] font-bold mt-2 text-brand uppercase tracking-tighter">
                  {tab.label}
                </span>
              </div>
            )
          }

          return (
            <Link 
              key={tab.href} 
              href={tab.href} 
              onClick={() => haptics.light()}
              className={`flex flex-col items-center justify-center transition-colors duration-200 active:scale-90 ${isActive ? 'text-brand' : 'text-text-secondary hover:text-brand'}`}
            >
              <div className="flex h-8 items-center justify-center">
                <Icon 
                  size={24} 
                  weight={isActive ? 'fill' : 'regular'} 
                />
              </div>
              <span className={`text-[10px] font-medium mt-1 font-body`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
