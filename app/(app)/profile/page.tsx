'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/user.store'
import { useWalletStore } from '@/store/wallet.store'
import { useTheme } from '@/components/ThemeProvider'
import { MOCK_PERSONAS } from '@/mock/users'
import { haptics } from '@/lib/haptics'
import type { UserMode } from '@/mock/users'

type MenuItem = {
  icon: string
  label: string
  sub: string
  action?: () => void
  toggle?: boolean
  value?: boolean
  badge?: string
  badgeColor?: string
}

const KYC_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: 'Unverified', color: '#EF4444' },
  1: { label: 'Basic (Tier 1)', color: '#F59E0B' },
  2: { label: 'Verified (Tier 2)', color: '#16A34A' },
  3: { label: 'Full KYC (Tier 3)', color: '#16A34A' },
}

const MODES: { id: UserMode; icon: string; label: string; sub: string }[] = [
  { id: 'personal', icon: 'person', label: 'Personal', sub: 'P2P, savings & daily use' },
  { id: 'merchant', icon: 'storefront', label: 'Merchant', sub: 'Accept payments & analytics' },
  { id: 'crypto',   icon: 'currency_bitcoin', label: 'Crypto', sub: 'DeFi, swaps & advanced' },
]

export default function ProfilePage() {
  const router = useRouter()
  const { persona, setPersona, darkMode, toggleDarkMode } = useUserStore()
  const { resetToDefaults } = useWalletStore()
  const { setTheme } = useTheme()
  const [appMode, setAppMode] = useState<UserMode>(persona?.mode ?? 'personal')

  const kyc = KYC_LABELS[persona?.kycLevel ?? 0]

  const handleSwitchPersona = (id: string) => {
    const p = MOCK_PERSONAS.find(p => p.id === id)
    if (!p) return
    haptics.medium()
    setPersona(p)
    resetToDefaults()
    setAppMode(p.mode)
    router.push('/home')
  }

  const menuGroups: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Wallet',
      items: [
        { icon: 'account_balance_wallet', label: 'My Assets', sub: 'Tokens and collectibles in your wallet', action: () => router.push('/wallet') },
        { icon: 'shield', label: 'Safes (Multi-sig)', sub: 'Shared treasury and co-signed accounts', action: () => router.push('/safes') },
        { icon: 'history', label: 'Activity History', sub: 'All transactions and on-ramp records', action: () => router.push('/activity') },
        { icon: 'share', label: 'Share Profile', sub: 'Your payment link and QR code', action: () => router.push('/receive') },
        { icon: 'storefront', label: 'Merchant Dashboard', sub: 'Sales, QR payments and analytics', action: () => router.push('/merchant') },
      ],
    },
    {
      title: 'On/Off-Ramp',
      items: [
        { icon: 'add_card', label: 'Buy cNGN', sub: 'Fund your wallet via bank or card', action: () => router.push('/buy') },
        { icon: 'payments', label: 'Sell cNGN', sub: 'Withdraw NGN to your bank account', action: () => router.push('/sell') },
        { icon: 'swap_horiz', label: 'Swap Tokens', sub: 'Exchange between XBN, cNGN, USDC', action: () => router.push('/swap') },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'dark_mode',
          label: 'Dark Mode',
          sub: 'Switch to high-contrast dark appearance',
          toggle: true,
          value: darkMode,
          action: () => { haptics.light(); toggleDarkMode(); setTheme(darkMode ? 'light' : 'dark') },
        },
        { icon: 'notifications', label: 'Notifications', sub: 'Alerts for transactions and updates' },
        { icon: 'language', label: 'Display Currency', sub: 'Nigerian Naira (NGN)' },
        { icon: 'translate', label: 'Language', sub: 'English (Nigeria)' },
      ],
    },
    {
      title: 'Security',
      items: [
        { icon: 'pin', label: 'Change PIN', sub: 'Update your 6-digit security PIN' },
        { icon: 'fingerprint', label: 'Biometrics', sub: 'Face ID / Fingerprint unlock', toggle: true, value: true },
        { icon: 'verified_user', label: 'KYC Verification', sub: kyc.label, badge: kyc.label, badgeColor: kyc.color },
        { icon: 'key', label: 'Recovery Phrase', sub: 'Back up your 12-word seed phrase' },
        { icon: 'devices', label: 'Linked Devices', sub: 'Manage trusted devices' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help', label: 'Help Center', sub: 'FAQs, guides and live chat' },
        { icon: 'bug_report', label: 'Report a Problem', sub: 'Send feedback or flag an issue' },
        { icon: 'info', label: 'About BantuPay', sub: 'Version 3.0.0 (Kinetic)' },
      ],
    },
  ]

  return (
    <div className="bg-background min-h-screen text-on-background pb-40 w-full max-w-[430px] mx-auto">

      {/* Header */}
      <header className="px-6 pt-16 pb-6 bg-surface border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary-container text-primary flex items-center justify-center font-headline font-bold text-2xl border-2 border-primary/20">
              {persona?.name.slice(0, 1) || 'B'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-surface flex items-center justify-center" style={{ backgroundColor: kyc.color }}>
              <span className="material-symbols-outlined text-white text-[14px] font-bold">verified</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-headline font-bold text-[22px] text-on-surface leading-tight truncate">{persona?.name || 'Bantu User'}</h1>
            <p className="font-body text-[13px] text-on-surface-variant font-medium">{persona?.handle || '@bantu_user'}</p>
            <p className="font-mono text-[11px] text-on-surface-variant/50 mt-0.5 truncate">{persona?.walletAddress || '—'}</p>
          </div>
          <button onClick={() => haptics.light()} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors flex-shrink-0">
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-8">

        {/* App Mode Switcher */}
        <div>
          <h3 className="px-2 font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase mb-3">App Mode</h3>
          <div className="bg-surface rounded-[24px] p-2 border border-outline-variant/10 shadow-sm flex gap-1">
            {MODES.map((m) => {
              const isActive = appMode === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => { haptics.light(); setAppMode(m.id) }}
                  className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-3 rounded-[18px] transition-all font-headline font-bold text-[12px] ${isActive ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{m.icon}</span>
                  {m.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Menu Groups */}
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
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline font-semibold text-[15px] text-on-surface leading-snug">{item.label}</p>
                    <p className="font-body text-[12px] text-on-surface-variant font-medium truncate">{item.sub}</p>
                  </div>
                  {item.toggle ? (
                    <div className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${item.value ? 'bg-primary' : 'bg-surface-container-high'}`}>
                      <motion.div
                        animate={{ x: item.value ? 24 : 2 }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </div>
                  ) : item.badge ? (
                    <span className="px-2 py-0.5 rounded-full font-label font-bold text-[10px] uppercase tracking-wider flex-shrink-0" style={{ backgroundColor: `${item.badgeColor}18`, color: item.badgeColor }}>
                      {item.badge}
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant/40 text-[20px] flex-shrink-0">chevron_right</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Demo: Switch Persona */}
        <div className="space-y-3">
          <h3 className="px-2 font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase">Demo Personas</h3>
          <div className="bg-surface rounded-[24px] overflow-hidden shadow-sm border border-outline-variant/10">
            {MOCK_PERSONAS.map((p, idx) => {
              const isActive = persona?.id === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => handleSwitchPersona(p.id)}
                  className={`w-full flex items-center gap-4 px-4 py-4 transition-colors text-left ${idx < MOCK_PERSONAS.length - 1 ? 'border-b border-outline-variant/5' : ''} ${isActive ? 'bg-primary/5' : 'hover:bg-surface-container-low'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-headline font-bold text-[15px] flex-shrink-0 ${isActive ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                    {p.name.slice(0, 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline font-semibold text-[15px] text-on-surface">{p.name}</p>
                    <p className="font-body text-[12px] text-on-surface-variant font-medium truncate">{p.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="font-label font-bold text-[10px] uppercase px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">{p.mode}</span>
                    {isActive && <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>}
                  </div>
                </button>
              )
            })}
            <button
              onClick={() => { haptics.medium(); resetToDefaults(); router.push('/onboarding') }}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-surface-container-low transition-colors text-left border-t border-outline-variant/10"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">restart_alt</span>
              </div>
              <div className="flex-1">
                <p className="font-headline font-semibold text-[15px] text-on-surface">Reset & Restart Onboarding</p>
                <p className="font-body text-[12px] text-on-surface-variant font-medium">Clear state and go back to welcome screen</p>
              </div>
            </button>
          </div>
        </div>

        {/* Sign Out */}
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
