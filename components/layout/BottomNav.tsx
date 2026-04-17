'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { haptics } from '@/lib/haptics'

const tabs = [
  { href: '/home',    icon: 'home',                   label: 'Home'     },
  { href: '/wallet',  icon: 'account_balance_wallet',  label: 'Assets'   },
  { href: '/scan',    icon: 'qr_code_scanner',         label: 'SCAN',    isFAB: true },
  { href: '/activity',icon: 'history',                 label: 'History'  },
  { href: '/profile', icon: 'person',                  label: 'Profile'  },
]

export function BottomNav() {
  const path = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50">
      <div className="relative bg-slate-50/90 backdrop-blur-2xl h-[80px] rounded-t-[24px] shadow-[0_-4px_20px_rgba(252,105,10,0.08)] flex justify-around items-center px-4">
        {tabs.map((tab) => {
          if (tab.isFAB) {
            return (
              <div key={tab.href} className="relative -top-8 flex flex-col items-center">
                <Link
                  href={tab.href}
                  onClick={() => haptics.light()}
                  className="w-16 h-16 bg-gradient-to-br from-[#FC690A] to-[#D4560A] rounded-full flex items-center justify-center shadow-brand ring-8 ring-surface active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-white text-3xl fill-icon">
                    {tab.icon}
                  </span>
                </Link>
                <span className="font-body text-[10px] font-bold mt-2 text-primary-container uppercase tracking-tighter">
                  {tab.label}
                </span>
              </div>
            )
          }
          const isActive = path === tab.href || path.startsWith(tab.href + '/')
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => haptics.light()}
              className={`flex flex-col items-center justify-center transition-colors active:scale-90 duration-200 ${
                isActive
                  ? 'text-primary-container'
                  : 'text-zinc-400 hover:text-primary-container'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className="font-body text-[10px] font-medium mt-1">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
