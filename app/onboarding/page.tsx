'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { NumPad } from '@/components/ui/NumPad'
import { useUserStore } from '@/store/user.store'
import { MOCK_PERSONAS } from '@/mock/users'
import { haptics } from '@/lib/haptics'

type Step = 'splash' | 'welcome' | 'mode' | 'phone' | 'otp' | 'name' | 'pin' | 'pin-confirm' | 'biometric' | 'created'

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>('splash')
  const [mode, setMode] = useState<'personal' | 'merchant' | 'crypto'>('personal')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [otpFilling, setOtpFilling] = useState(false)
  const [bioLoading, setBioLoading] = useState(false)

  const { setPersona, completeOnboarding } = useUserStore()
  const router = useRouter()

  // Auto-advance from splash
  useEffect(() => {
    if (step === 'splash') {
      const t = setTimeout(() => setStep('welcome'), 2200)
      return () => clearTimeout(t)
    }
  }, [step])

  // Auto-fill OTP after 2s
  useEffect(() => {
    if (step === 'otp' && !otpFilling) {
      setOtpFilling(true)
      const t = setTimeout(() => {
        setOtp('123456')
        haptics.success()
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [step])

  // Auto-advance when OTP complete
  useEffect(() => {
    if (otp.length === 6) {
      setTimeout(() => setStep('name'), 400)
    }
  }, [otp])

  // Auto-advance when PIN complete
  useEffect(() => {
    if (step === 'pin' && pin.length === 6) {
      setTimeout(() => setStep('pin-confirm'), 300)
    }
  }, [pin, step])

  useEffect(() => {
    if (step === 'pin-confirm' && pinConfirm.length === 6) {
      setTimeout(() => setStep('biometric'), 300)
    }
  }, [pinConfirm, step])

  const handleBiometric = () => {
    setBioLoading(true)
    haptics.medium()
    setTimeout(() => {
      setBioLoading(false)
      haptics.success()
      finishOnboarding()
    }, 1200)
  }

  const finishOnboarding = () => {
    const persona = MOCK_PERSONAS.find(p => p.mode === mode) ?? MOCK_PERSONAS[0]
    setPersona({ ...persona, name: name || persona.name })
    completeOnboarding()
    setStep('created')
    setTimeout(() => router.push('/home'), 2200)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'splash' && <SplashScreen key="splash" />}
        {step === 'welcome' && <WelcomeScreen key="welcome" onNext={() => setStep('mode')} />}
        {step === 'mode' && <ModeScreen key="mode" selected={mode} onSelect={setMode} onNext={() => setStep('phone')} />}
        {step === 'phone' && <PhoneScreen key="phone" value={phone} onChange={setPhone} onNext={() => setStep('otp')} />}
        {step === 'otp' && <OTPScreen key="otp" value={otp} onChange={setOtp} phone={phone} />}
        {step === 'name' && <NameScreen key="name" value={name} onChange={setName} onNext={() => setStep('pin')} />}
        {step === 'pin' && <PinScreen key="pin" value={pin} onPress={d => setPin(p => p.length < 6 ? p + d : p)} onDelete={() => setPin(p => p.slice(0, -1))} title="Create your PIN" subtitle="You'll use this to confirm transactions" />}
        {step === 'pin-confirm' && <PinScreen key="pin-confirm" value={pinConfirm} onPress={d => setPinConfirm(p => p.length < 6 ? p + d : p)} onDelete={() => setPinConfirm(p => p.slice(0, -1))} title="Confirm your PIN" subtitle="Enter your PIN again to confirm" />}
        {step === 'biometric' && <BiometricScreen key="biometric" loading={bioLoading} onEnable={handleBiometric} onSkip={finishOnboarding} />}
        {step === 'created' && <CreatedScreen key="created" name={name} />}
      </AnimatePresence>
    </div>
  )
}

function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #FC690A 0%, #D4560A 100%)' }}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.2 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg">
          <span className="text-4xl font-black text-brand font-[family-name:var(--font-jakarta)]">B</span>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black text-white font-[family-name:var(--font-jakarta)]">BantuPay</h1>
          <p className="text-white/70 text-sm mt-1 font-[family-name:var(--font-inter)]">Banking for Everyone</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function WelcomeScreen({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 min-h-screen flex flex-col"
    >
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16">
        <div className="w-16 h-16 bg-brand-wash rounded-2xl flex items-center justify-center mb-6">
          <span className="text-3xl font-black text-brand font-[family-name:var(--font-jakarta)]">B</span>
        </div>
        <h1 className="text-3xl font-black text-[#0F0F0F] font-[family-name:var(--font-jakarta)] text-center leading-tight mb-3">
          Your Money,<br />Your Way
        </h1>
        <p className="text-text-secondary text-base text-center font-[family-name:var(--font-inter)] leading-relaxed max-w-xs">
          Send, receive, and manage money across Africa. Built on Bantu Blockchain for speed and low fees.
        </p>

        <div className="mt-10 w-full space-y-3">
          {[
            { icon: '⚡', text: 'Transactions under 5 seconds' },
            { icon: '💸', text: 'Fees under ₦1 always' },
            { icon: '🔒', text: 'Bank-grade security' },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-3 bg-[#F9F9FB] rounded-xl px-4 py-3">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm text-[#0F0F0F] font-medium font-[family-name:var(--font-inter)]">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-10 space-y-3">
        <Button fullWidth onClick={onNext}>Get Started</Button>
        <p className="text-center text-xs text-text-secondary font-[family-name:var(--font-inter)]">
          Already have an account? <a href="#" className="text-brand font-medium">Sign in</a>
        </p>
      </div>
    </motion.div>
  )
}

function ModeScreen({ selected, onSelect, onNext }: { selected: string; onSelect: (m: any) => void; onNext: () => void }) {
  const modes = [
    { id: 'personal', icon: '👤', title: 'Personal', desc: 'For everyday sending & receiving' },
    { id: 'merchant', icon: '🏪', title: 'Merchant', desc: 'Accept payments, view analytics' },
    { id: 'crypto',   icon: '₿',  title: 'Crypto',   desc: 'DeFi, swaps, advanced features' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      className="flex-1 min-h-screen flex flex-col px-6 pt-16"
    >
      <h1 className="text-2xl font-bold text-[#0F0F0F] font-[family-name:var(--font-jakarta)] mb-2">How will you use BantuPay?</h1>
      <p className="text-text-secondary text-sm font-[family-name:var(--font-inter)] mb-8">You can change this later in settings</p>

      <div className="space-y-3 flex-1">
        {modes.map(m => (
          <motion.button
            key={m.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(m.id)}
            className={`w-full flex items-center gap-4 rounded-2xl px-4 py-4 border-2 transition-colors ${selected === m.id ? 'border-brand bg-brand-wash' : 'border-[#E8EAF0] bg-white'}`}
          >
            <span className="text-3xl">{m.icon}</span>
            <div className="text-left">
              <p className={`font-semibold font-[family-name:var(--font-jakarta)] ${selected === m.id ? 'text-brand' : 'text-[#0F0F0F]'}`}>{m.title}</p>
              <p className="text-xs text-text-secondary font-[family-name:var(--font-inter)] mt-0.5">{m.desc}</p>
            </div>
            {selected === m.id && <div className="ml-auto w-5 h-5 rounded-full bg-brand flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
          </motion.button>
        ))}
      </div>

      <div className="pb-10 mt-6">
        <Button fullWidth onClick={onNext}>Continue</Button>
      </div>
    </motion.div>
  )
}

function PhoneScreen({ value, onChange, onNext }: { value: string; onChange: (v: string) => void; onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      className="flex-1 min-h-screen flex flex-col px-6 pt-16"
    >
      <h1 className="text-2xl font-bold text-[#0F0F0F] font-[family-name:var(--font-jakarta)] mb-2">Enter your phone number</h1>
      <p className="text-text-secondary text-sm font-[family-name:var(--font-inter)] mb-8">We'll send a verification code</p>

      <div className="flex items-center gap-3 border-2 border-[#E8EAF0] rounded-2xl px-4 py-4 focus-within:border-brand transition-colors">
        <span className="text-xl">🇳🇬</span>
        <span className="text-[#0F0F0F] font-medium font-[family-name:var(--font-inter)]">+234</span>
        <div className="w-px h-5 bg-[#E8EAF0]" />
        <input
          type="tel"
          value={value}
          onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="8012345678"
          className="flex-1 outline-none text-[#0F0F0F] text-base font-[family-name:var(--font-inter)] placeholder-[#9CA3AF]"
          autoFocus
        />
      </div>

      <p className="text-xs text-text-secondary font-[family-name:var(--font-inter)] mt-3">
        By continuing, you agree to our Terms & Privacy Policy
      </p>

      <div className="mt-auto pb-10">
        <Button fullWidth onClick={onNext} disabled={value.length < 10}>
          Send Code
        </Button>
      </div>
    </motion.div>
  )
}

function OTPScreen({ value, onChange, phone }: { value: string; onChange: (v: string) => void; phone: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      className="flex-1 min-h-screen flex flex-col px-6 pt-16"
    >
      <h1 className="text-2xl font-bold text-[#0F0F0F] font-[family-name:var(--font-jakarta)] mb-2">Enter verification code</h1>
      <p className="text-text-secondary text-sm font-[family-name:var(--font-inter)] mb-8">
        Sent to +234 {phone} · <span className="text-brand font-medium">Auto-filling in demo…</span>
      </p>

      <div className="flex gap-3 justify-center mb-8">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            animate={value[i] ? { scale: [1.2, 1], backgroundColor: '#FC690A' } : { scale: 1, backgroundColor: '#F0F1F5' }}
            className="w-12 h-14 rounded-xl flex items-center justify-center"
          >
            <span className="text-xl font-bold text-white font-[family-name:var(--font-jetbrains)]">
              {value[i] || ''}
            </span>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm text-text-secondary font-[family-name:var(--font-inter)]">
        Didn't get it? <button className="text-brand font-medium">Resend</button>
      </p>
    </motion.div>
  )
}

function NameScreen({ value, onChange, onNext }: { value: string; onChange: (v: string) => void; onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      className="flex-1 min-h-screen flex flex-col px-6 pt-16"
    >
      <h1 className="text-2xl font-bold text-[#0F0F0F] font-[family-name:var(--font-jakarta)] mb-2">What's your name?</h1>
      <p className="text-text-secondary text-sm font-[family-name:var(--font-inter)] mb-8">This is how you'll appear to others</p>

      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Amara Okafor"
        className="border-2 border-[#E8EAF0] rounded-2xl px-4 py-4 text-base text-[#0F0F0F] font-[family-name:var(--font-inter)] outline-none focus:border-brand transition-colors placeholder-[#9CA3AF]"
        autoFocus
      />

      <div className="mt-auto pb-10">
        <Button fullWidth onClick={onNext} disabled={value.trim().length < 2}>
          Continue
        </Button>
      </div>
    </motion.div>
  )
}

function PinScreen({ value, onPress, onDelete, title, subtitle }: { value: string; onPress: (d: string) => void; onDelete: () => void; title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      className="flex-1 min-h-screen flex flex-col pt-16"
    >
      <div className="px-6">
        <h1 className="text-2xl font-bold text-[#0F0F0F] font-[family-name:var(--font-jakarta)] mb-2">{title}</h1>
        <p className="text-text-secondary text-sm font-[family-name:var(--font-inter)] mb-10">{subtitle}</p>
      </div>

      <div className="flex gap-3 justify-center mb-10">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            animate={value.length > i ? { scale: [1.3, 1], backgroundColor: '#FC690A' } : { scale: 1, backgroundColor: '#E8EAF0' }}
            className="w-4 h-4 rounded-full"
          />
        ))}
      </div>

      <div className="mt-auto pb-8">
        <NumPad onPress={onPress} onDelete={onDelete} />
      </div>
    </motion.div>
  )
}

function BiometricScreen({ loading, onEnable, onSkip }: { loading: boolean; onEnable: () => void; onSkip: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      className="flex-1 min-h-screen flex flex-col items-center px-6 pt-20"
    >
      <motion.div
        animate={loading ? { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-24 h-24 rounded-full bg-brand-wash flex items-center justify-center mb-6"
      >
        <span className="text-5xl">👆</span>
      </motion.div>
      <h1 className="text-2xl font-bold text-[#0F0F0F] font-[family-name:var(--font-jakarta)] text-center mb-3">
        Enable Biometrics
      </h1>
      <p className="text-text-secondary text-sm text-center font-[family-name:var(--font-inter)] max-w-xs">
        Use Face ID or fingerprint to sign in and approve transactions faster
      </p>

      <div className="mt-auto w-full pb-10 space-y-3">
        <Button fullWidth onClick={onEnable} loading={loading}>
          {loading ? 'Authenticating…' : 'Enable Biometrics'}
        </Button>
        <Button fullWidth variant="ghost" onClick={onSkip} disabled={loading}>
          Skip for now
        </Button>
      </div>
    </motion.div>
  )
}

function CreatedScreen({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(160deg, #FC690A 0%, #D4560A 100%)' }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
        className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg"
      >
        <span className="text-5xl">🎉</span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-black text-white font-[family-name:var(--font-jakarta)] text-center"
      >
        You're all set{name ? `, ${name.split(' ')[0]}` : ''}!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.6 }}
        className="text-white/80 text-base text-center font-[family-name:var(--font-inter)] mt-3"
      >
        Your BantuPay wallet is ready
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2 }}
        className="text-white/60 text-sm font-[family-name:var(--font-inter)] mt-8"
      >
        Taking you home…
      </motion.p>
    </motion.div>
  )
}
