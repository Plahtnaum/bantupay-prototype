'use client'
import { motion } from 'framer-motion'
import { CaretRight, Shield, Bell, Moon, Question, SignOut, User } from 'phosphor-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { useUserStore } from '@/store/user.store'
import { useToastStore } from '@/store/toast.store'

const menuItems = [
  { icon: User,         label: 'Personal Info',    sub: 'Name, phone, email',        href: '#' },
  { icon: Shield,       label: 'Security',          sub: 'PIN, biometrics, recovery', href: '#' },
  { icon: Bell,         label: 'Notifications',     sub: 'Push, email, SMS',          href: '#' },
  { icon: Moon,         label: 'Appearance',        sub: 'Dark mode, theme',          href: '#' },
  { icon: Question, label: 'Help & Support',    sub: 'FAQs, contact us',          href: '#' },
]

export default function ProfilePage() {
  const { persona, toggleDarkMode } = useUserStore()
  const { show: addToast, success: toastSuccess, info: toastInfo } = useToastStore()

  const kycVariant: Record<number, 'orange' | 'green'> = { 1: 'orange', 2: 'green', 3: 'green' }

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      {/* Profile card */}
      <div className="bg-white px-4 pt-6 pb-4 mb-3">
        <div className="flex items-center gap-4">
          <Avatar initials={persona?.name.slice(0, 2) ?? 'AM'} size="lg" />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-[#0F0F0F] font-[family-name:var(--font-jakarta)]">
              {persona?.name ?? 'Amara Okafor'}
            </h2>
            <p className="text-sm text-text-secondary font-[family-name:var(--font-inter)]">{persona?.handle}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant={kycVariant[persona?.kycLevel ?? 1]}>
                KYC {persona?.kycLevel ?? 1}
              </Badge>
              <Badge variant="blue">{persona?.mode ?? 'personal'}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="mx-4 bg-white rounded-2xl overflow-hidden">
        {menuItems.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.button
              key={item.label}
              whileTap={{ scale: 0.99, backgroundColor: '#F9F9FB' }}
              className={`w-full flex items-center gap-4 px-4 py-4 ${i < menuItems.length - 1 ? 'border-b border-[#E8EAF0]' : ''}`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#F0F1F5] flex items-center justify-center flex-shrink-0">
                <Icon size={18} color="#0F0F0F" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-[#0F0F0F] font-[family-name:var(--font-inter)]">{item.label}</p>
                <p className="text-xs text-text-secondary font-[family-name:var(--font-inter)]">{item.sub}</p>
              </div>
              <CaretRight size={16} color="#9CA3AF" />
            </motion.button>
          )
        })}
      </div>

      <div className="mx-4 mt-3 bg-white rounded-2xl overflow-hidden">
        <motion.button
          whileTap={{ scale: 0.99 }}
          onClick={() => toastInfo('Signed out (demo — page will refresh)')}
          className="w-full flex items-center gap-4 px-4 py-4"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
            <SignOut size={18} color="#DC2626" />
          </div>
          <span className="text-sm font-semibold text-semantic-error font-[family-name:var(--font-inter)]">Sign Out</span>
        </motion.button>
      </div>

      <p className="text-center text-xs text-text-secondary font-[family-name:var(--font-inter)] py-6">
        BantuPay v3.0.0 · Demo Mode
      </p>
    </div>
  )
}
