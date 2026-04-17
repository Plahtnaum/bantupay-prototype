'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/user.store'
import { haptics } from '@/lib/haptics'

type MenuItem = {
  icon: string
  label: string
  sub: string
  action?: () => void
  toggle?: boolean
  value?: boolean
  badge?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { persona, darkMode, toggleDarkMode } = useUserStore()

  const menuGroups: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Wallet',
      items: [
        { icon: 'account_balance_wallet', label: 'My Assets', sub: 'Manage your tokens and collectibles', action: () => router.push('/wallet') },
        { icon: 'shield', label: 'Safes (Multi-sig)', sub: 'Shared treasury accounts', action: () => router.push('/safes') },
        { icon: 'history', label: 'Activity History', sub: 'View all your past transactions', action: () => router.push('/activity') },
        { icon: 'share', label: 'Share Profile', sub: 'Your unique payment link and QR', action: () => router.push('/receive') },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'dark_mode', label: 'Dark Mode', sub: 'Switch high-contrast appearance', toggle: true, value: darkMode, action: toggleDarkMode },
        { icon: 'notifications', label: 'Notifications', sub: 'Manage your alerts and updates' },
        { icon: 'language', label: 'Currency', sub: 'Nigerian Naira (NGN)' },
      ]
    },
    {
      title: 'Security',
      items: [
        { icon: 'shield_person', label: 'Security Center', sub: 'PIN, Biometrics and Recovery' },
        { icon: 'verified_user', label: 'KYC Verification', sub: `Level ${persona?.kycLevel || 1} Verified`, badge: 'Verified' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: 'help', label: 'Help Center', sub: 'FAQs and direct support' },
        { icon: 'info', label: 'About BantuPay', sub: 'Version 3.0.0 (Kinetic)' },
      ]
    }
  ]

  return (
    <div className="bg-background min-h-screen text-on-background pb-32 w-full max-w-[430px] mx-auto">
      <header className="px-6 pt-16 pb-6 bg-surface shadow-sm border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary-container text-primary flex items-center justify-center font-headline font-bold text-2xl border-2 border-primary/20">
              {persona?.name.slice(0, 1) || 'B'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#16A34A] border-2 border-surface flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[14px] font-bold">verified</span>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="font-headline font-bold text-[22px] text-on-surface leading-tight">{persona?.name || 'Bantu User'}</h1>
            <p className="font-body text-[14px] text-on-surface-variant font-medium">{persona?.handle || '@bantu_user'}</p>
          </div>
          <button onClick={() => haptics.light()} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-8">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-3">
            <h3 className="px-2 font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase">{group.title}</h3>
            <div className="bg-surface rounded-[24px] overflow-hidden shadow-sm border border-outline-variant/10">
              {group.items.map((item, iIdx) => (
                <button
                  key={iIdx}
                  onClick={() => { haptics.light(); item.action?.() }}
                  className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-surface-container-low transition-colors text-left ${iIdx < group.items.length - 1 ? 'border-b border-outline-variant/5' : ''}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-headline font-semibold text-[15px] text-on-surface leading-snug">{item.label}</p>
                    <p className="font-body text-[12px] text-on-surface-variant font-medium">{item.sub}</p>
                  </div>
                  {item.toggle ? (
                    <div className={`w-12 h-6 rounded-full relative transition-colors ${item.value ? 'bg-primary' : 'bg-surface-container-high'}`}>
                      <motion.div 
                        animate={{ x: item.value ? 24 : 2 }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </div>
                  ) : item.badge ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#16A34A]/10 text-[#16A34A] font-label font-bold text-[10px] uppercase tracking-wider">{item.badge}</span>
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant/40 text-[20px]">chevron_right</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="px-2 pt-4 pb-8">
           <button 
             onClick={() => haptics.medium()}
             className="w-full h-14 rounded-[20px] bg-error-container/20 text-error font-headline font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-error-container/30 transition-colors border border-error/10"
           >
             <span className="material-symbols-outlined">logout</span>
             Sign Out
           </button>
           <p className="text-center font-body text-[11px] text-on-surface-variant/60 font-bold tracking-widest uppercase mt-8">
             BantuPay Kinetic · v3.0.0
           </p>
        </div>
      </main>
    </div>
  )
}
