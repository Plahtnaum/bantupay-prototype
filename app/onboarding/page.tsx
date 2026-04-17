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
      className="flex-1 min-h-screen flex flex-col items-center justify-center p-6 bg-surface"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-brand to-brand-dark rounded-[32px] flex items-center justify-center shadow-brand transform rotate-3">
          <span className="text-5xl font-black text-white font-display">B</span>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-display font-extrabold text-text-primary tracking-tight">BantuPay</h1>
          <p className="text-text-secondary font-medium tracking-widest uppercase text-[10px] mt-2 opcaity-80">Banking for Everyone</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function WelcomeScreen({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex-1 min-h-screen flex flex-col bg-surface"
    >
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16">
        <div className="w-20 h-20 bg-brand/5 rounded-[28px] flex items-center justify-center mb-8 border border-brand/10">
          <span className="text-4xl font-black text-brand font-display">B</span>
        </div>
        <h1 className="text-4xl font-display font-extrabold text-text-primary text-center leading-none tracking-tight mb-4">
          Your Money,<br />Your Way
        </h1>
        <p className="text-text-secondary text-base text-center font-body leading-relaxed max-w-xs px-2">
          Send, receive, and manage money instantly. Built on Bantu 3.0 for the future of payments.
        </p>

        <div className="mt-12 w-full space-y-4">
          {[
            { icon: '⚡', text: 'Instant transactions' },
            { icon: '💎', text: 'Flat fees under ₦1' },
            { icon: '🛡️', text: 'Bank-grade security' },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-4 bg-surface-container-low rounded-2xl px-5 py-4 border border-border/5">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm text-text-primary font-bold font-body">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 pb-12 space-y-4">
        <Button fullWidth onClick={onNext} className="h-14 rounded-full bg-gradient-to-r from-brand to-brand-dark shadow-brand text-lg font-bold">
          Get Started
        </Button>
        <p className="text-center text-xs text-text-tertiary font-body">
          Already have an account? <a href="#" className="text-brand font-bold hover:underline">Sign in</a>
        </p>
      </div>
    </motion.div>
  )
}

function ModeScreen({ selected, onSelect, onNext }: { selected: string; onSelect: (m: any) => void; onNext: () => void }) {
  const modes = [
    { id: 'personal', icon: '👤', title: 'Personal', desc: 'For everyday payments' },
    { id: 'merchant', icon: '🏪', title: 'Merchant', desc: 'Accept payments, view analytics' },
    { id: 'crypto',   icon: '₿',  title: 'Crypto',   desc: 'DeFi, swaps & advanced features' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 min-h-screen flex flex-col px-8 pt-20 bg-bg-base"
    >
      <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight mb-3">Choose your focus</h1>
      <p className="text-text-secondary text-sm font-body mb-10">You can customize this later in settings</p>

      <div className="space-y-4 flex-1">
        {modes.map(m => (
          <motion.button
            key={m.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => { haptics.light(); onSelect(m.id) }}
            className={`w-full flex items-center gap-5 rounded-2xl px-5 py-5 border-2 transition-all ${selected === m.id ? 'border-brand bg-brand/5 shadow-brand/10' : 'border-border/5 bg-surface-container-low'}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${selected === m.id ? 'bg-brand/10 text-brand' : 'bg-surface-container-high text-text-tertiary'}`}>
              {m.icon}
            </div>
            <div className="text-left">
              <p className={`text-lg font-display font-bold ${selected === m.id ? 'text-brand' : 'text-text-primary'}`}>{m.title}</p>
              <p className="text-xs text-text-secondary font-body mt-1">{m.desc}</p>
            </div>
            {selected === m.id && (
              <div className="ml-auto w-6 h-6 rounded-full bg-brand flex items-center justify-center shadow-brand">
                <span className="text-white text-[12px] font-bold">✓</span>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="pb-12 pt-6">
        <Button fullWidth onClick={onNext} className="h-14 rounded-full bg-gradient-to-r from-brand to-brand-dark shadow-brand text-lg font-bold">
          Continue
        </Button>
      </div>
    </motion.div>
  )
}

function PhoneScreen({ value, onChange, onNext }: { value: string; onChange: (v: string) => void; onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 min-h-screen flex flex-col px-8 pt-20 bg-surface"
    >
      <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight mb-3">Your mobile number</h1>
      <p className="text-text-secondary text-sm font-body mb-10">We'll send a 6-digit verification code</p>

      <div className="flex items-center gap-4 bg-surface-container-low rounded-2xl px-5 py-5 focus-within:ring-2 ring-brand/20 transition-all border border-border/5">
        <span className="text-2xl">🇳🇬</span>
        <span className="text-text-primary font-bold font-body text-lg tracking-tight">+234</span>
        <div className="w-px h-6 bg-border/20 mx-1" />
        <input
          type="tel"
          value={value}
          onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="800 000 0000"
          className="flex-1 outline-none bg-transparent text-text-primary text-xl font-display font-bold placeholder-text-tertiary/50"
          autoFocus
        />
      </div>

      <p className="text-[11px] text-text-tertiary font-body mt-5 leading-relaxed">
        By continuing, you agree to BantuPay's <span className="text-text-secondary font-bold">Terms of Service</span> and <span className="text-text-secondary font-bold">Privacy Policy</span>.
      </p>

      <div className="mt-auto pb-12">
        <Button fullWidth onClick={onNext} disabled={value.length < 10} className="h-14 rounded-full bg-gradient-to-r from-brand to-brand-dark shadow-brand text-lg font-bold">
          Send Code
        </Button>
      </div>
    </motion.div>
  )
}

function OTPScreen({ value, onChange, phone }: { value: string; onChange: (v: string) => void; phone: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 min-h-screen flex flex-col px-8 pt-20 bg-surface"
    >
      <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight mb-3">Verification</h1>
      <p className="text-text-secondary text-sm font-body mb-12 leading-relaxed">
        Code sent to <span className="text-text-primary font-bold">+234 {phone}</span>.<br />
        <span className="text-brand/80 font-medium">Demo: Auto-filling in 2s…</span>
      </p>

      <div className="flex gap-3 justify-center mb-12">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            animate={value[i] ? { scale: [1.1, 1], backgroundColor: 'var(--color-brand)' } : { scale: 1, backgroundColor: 'var(--surface-container-low)' }}
            className={`w-12 h-16 rounded-2xl flex items-center justify-center border ${value[i] ? 'border-brand' : 'border-border/5'}`}
          >
            <span className={`text-2xl font-display font-bold ${value[i] ? 'text-white' : 'text-text-tertiary'}`}>
              {value[i] || ''}
            </span>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm text-text-tertiary font-body">
        Expect a code? <button className="text-brand font-bold hover:underline" onClick={() => haptics.reveal()}>Resend SMS</button>
      </p>
    </motion.div>
  )
}

function NameScreen({ value, onChange, onNext }: { value: string; onChange: (v: string) => void; onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 min-h-screen flex flex-col px-8 pt-20 bg-surface"
    >
      <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight mb-3">What's your name?</h1>
      <p className="text-text-secondary text-sm font-body mb-10">This is how you'll be identified on Bantu</p>

      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Amara Okafor"
        className="bg-surface-container-low border border-border/5 rounded-2xl px-6 py-5 text-xl text-text-primary font-display font-bold outline-none focus:ring-2 ring-brand/20 transition-all placeholder-text-tertiary/40"
        autoFocus
      />

      <div className="mt-auto pb-12">
        <Button 
          fullWidth 
          onClick={onNext} 
          disabled={value.trim().length < 2}
          className="h-14 rounded-full bg-gradient-to-r from-brand to-brand-dark shadow-brand text-lg font-bold"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  )
}

function PinScreen({ value, onPress, onDelete, title, subtitle }: { value: string; onPress: (d: string) => void; onDelete: () => void; title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 min-h-screen flex flex-col pt-20 bg-surface"
    >
      <div className="px-8">
        <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight mb-3">{title}</h1>
        <p className="text-text-secondary text-sm font-body mb-12">{subtitle}</p>
      </div>

      <div className="flex gap-4 justify-center mb-12">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            animate={value.length > i ? { scale: [1.4, 1], backgroundColor: 'var(--color-brand)' } : { scale: 1, backgroundColor: 'var(--surface-container-high)' }}
            className={`w-4 h-4 rounded-full transition-colors duration-200 ${value.length > i ? 'shadow-brand' : ''}`}
          />
        ))}
      </div>

      <div className="mt-auto pb-8 bg-surface-container-low/50 rounded-t-[40px] pt-8 shadow-[0_-8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.1)]">
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
      className="flex-1 min-h-screen flex flex-col items-center px-8 pt-24 bg-surface"
    >
      <motion.div
        animate={loading ? { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-32 h-32 rounded-[40px] bg-brand/5 flex items-center justify-center mb-10 border border-brand/10 shadow-inner"
      >
        <span className="text-6xl filter drop-shadow-sm">👆</span>
      </motion.div>
      <h1 className="text-3xl font-display font-extrabold text-text-primary text-center tracking-tight mb-4">
        Biometric Security
      </h1>
      <p className="text-text-secondary text-base text-center font-body leading-relaxed max-w-xs px-2">
        Enable Face ID or fingerprint to secure your assets and approve payments instantly.
      </p>

      <div className="mt-auto w-full pb-12 space-y-4">
        <Button 
          fullWidth 
          onClick={onEnable} 
          loading={loading}
          className="h-14 rounded-full bg-gradient-to-r from-brand to-brand-dark shadow-brand text-lg font-bold"
        >
          {loading ? 'Authenticating…' : 'Enable Security'}
        </Button>
        <Button 
          fullWidth 
          variant="ghost" 
          onClick={() => { haptics.reveal(); onSkip() }} 
          disabled={loading}
          className="h-14 rounded-full text-text-tertiary font-bold"
        >
          Not now, skip
        </Button>
      </div>
    </motion.div>
  )
}

function CreatedScreen({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden bg-surface"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
        className="w-32 h-32 bg-gradient-to-br from-brand to-brand-dark rounded-[40px] flex items-center justify-center mb-10 shadow-brand relative z-10"
      >
        <span className="text-6xl">✨</span>
      </motion.div>
      
      <div className="text-center relative z-10 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-display font-extrabold text-text-primary tracking-tight leading-none mb-4"
        >
          You're all set{name ? `, ${name.split(' ')[0]}` : ''}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-text-secondary text-lg font-body leading-relaxed max-w-xs mx-auto"
        >
          Your BantuPay wallet is ready for your first transaction.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-12 flex flex-col items-center gap-3"
      >
        <div className="w-6 h-6 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
        <p className="text-text-tertiary text-sm font-bold tracking-widest uppercase">Launching Dashboard</p>
      </motion.div>
    </motion.div>
  )
}
