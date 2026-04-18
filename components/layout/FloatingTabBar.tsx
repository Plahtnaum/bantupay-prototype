'use client'
import { usePathname, useRouter } from 'next/navigation'
import { haptics } from '@/lib/haptics'

const TABS = [
  { label: 'Assets',  path: '/wallet'   },
  { label: 'History', path: '/activity' },
  { label: 'Explore', path: '/explore'  },
]

const SHOW_ON = ['/home', '/wallet', '/activity', '/explore']

export function FloatingTabBar() {
  const pathname = usePathname()
  const router = useRouter()

  if (!SHOW_ON.includes(pathname)) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto flex justify-center pb-8 z-40 pointer-events-none">
      <nav
        className="pointer-events-auto flex items-center bg-surface border border-outline-variant/20 rounded-full"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)' }}
      >
        {TABS.map(tab => {
          const isActive = pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => { haptics.light(); router.push(tab.path) }}
              className={`relative px-7 py-3.5 font-headline font-semibold text-[14px] transition-colors rounded-full ${
                isActive ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
