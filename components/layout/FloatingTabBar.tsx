'use client'
import { usePathname, useRouter } from 'next/navigation'
import { haptics } from '@/lib/haptics'

const TABS = [
  { label: 'Home',    path: '/home',     icon: 'home'                   },
  { label: 'Assets',  path: '/wallet',   icon: 'account_balance_wallet' },
  { label: 'History', path: '/activity', icon: 'history'                },
  { label: 'Explore', path: '/explore',  icon: 'explore'                },
]

const SHOW_ON = ['/home', '/wallet', '/activity', '/explore']

export function FloatingTabBar() {
  const pathname = usePathname()
  const router = useRouter()

  if (!SHOW_ON.includes(pathname)) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto flex justify-center pb-6 z-40 pointer-events-none">
      <nav
        className="pointer-events-auto flex items-center bg-surface border border-outline-variant/20 rounded-full px-1"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)' }}
      >
        {TABS.map(tab => {
          const isActive = pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => { haptics.light(); router.push(tab.path) }}
              className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-full transition-colors ${
                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400" }}
              >
                {tab.icon}
              </span>
              <span className={`font-label font-bold text-[10px] ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
