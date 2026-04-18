'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { haptics } from '@/lib/haptics'
import { useUserStore } from '@/store/user.store'
import { MOCK_PERSONAS } from '@/mock/users'

type Step = 'splash' | 'welcome' | 'mode' | 'phone' | 'otp' | 'name' | 'pin' | 'pinConfirm' | 'biometric' | 'created'

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>('splash')
  const [mode, setMode] = useState<'personal' | 'merchant'>('personal')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [pinError, setPinError] = useState(false)
  const [bioLoading, setBioLoading] = useState(false)

  const { setPersona, completeOnboarding } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (step === 'splash') {
      const t = setTimeout(() => setStep('welcome'), 2500)
      return () => clearTimeout(t)
    }
  }, [step])

  useEffect(() => {
    if (step === 'otp') {
      const t = setTimeout(() => {
        setOtp('123456')
        haptics.success()
        setTimeout(() => setStep('name'), 600)
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [step])

  useEffect(() => {
    if (step === 'pin' && pin.length === 4) {
      setTimeout(() => setStep('pinConfirm'), 300)
    }
  }, [pin, step])

  useEffect(() => {
    if (step === 'pinConfirm' && pinConfirm.length === 4) {
      if (pinConfirm === pin) {
        haptics.success()
        setTimeout(() => setStep('biometric'), 300)
      } else {
        haptics.medium()
        setPinError(true)
        setTimeout(() => { setPinConfirm(''); setPinError(false) }, 800)
      }
    }
  }, [pinConfirm, step, pin])

  const finishOnboarding = () => {
    const persona = MOCK_PERSONAS.find(p => p.mode === mode) ?? MOCK_PERSONAS[0]
    setPersona({ ...persona, name: name || persona.name })
    completeOnboarding()
    setStep('created')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'splash'      && <SplashScreen key="splash" />}
        {step === 'welcome'     && <WelcomeScreen key="welcome" onNext={() => setStep('mode')} onSignIn={() => router.push('/sign-in')} />}
        {step === 'mode'        && <ModeScreen key="mode" selected={mode} onSelect={setMode} onNext={() => setStep('phone')} />}
        {step === 'phone'       && <PhoneScreen key="phone" value={phone} onChange={setPhone} onBack={() => setStep('mode')} onNext={() => setStep('otp')} />}
        {step === 'otp'         && <OtpScreen key="otp" value={otp} onBack={() => setStep('phone')} onNext={() => setStep('name')} />}
        {step === 'name'        && <NameScreen key="name" value={name} onChange={setName} onBack={() => setStep('otp')} onNext={() => setStep('pin')} />}
        {step === 'pin'         && <PinScreen key="pin" value={pin} onPress={d => setPin(p => p.length < 4 ? p + d : p)} onDelete={() => setPin(p => p.slice(0, -1))} mode="set" />}
        {step === 'pinConfirm'  && <PinScreen key="pinConfirm" value={pinConfirm} onPress={d => setPinConfirm(p => p.length < 4 ? p + d : p)} onDelete={() => setPinConfirm(p => p.slice(0, -1))} mode="confirm" hasError={pinError} />}
        {step === 'biometric'   && <BiometricScreen key="bio" loading={bioLoading} onEnable={() => {
          setBioLoading(true)
          haptics.medium()
          setTimeout(() => { setBioLoading(false); haptics.success(); finishOnboarding() }, 1200)
        }} onSkip={finishOnboarding} />}
        {step === 'created'     && <CreatedScreen key="created" name={name} />}
      </AnimatePresence>
    </div>
  )
}

function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="relative h-screen w-full flex flex-col overflow-hidden"
      style={{ background: '#0A0A0C' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 110%, rgba(252,105,10,0.22) 0%, transparent 55%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 40%, rgba(252,140,40,0.06) 0%, transparent 45%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 80% 10%, rgba(10,10,20,0.9) 0%, transparent 50%)' }} />
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col items-center gap-5"
        >
          <div
            className="w-24 h-24 rounded-[28px] flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 70%), #1A1A1E',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px rgba(0,0,0,0.6)',
            }}
          >
            <span className="font-headline font-black text-[44px] leading-none" style={{ color: '#FC690A', letterSpacing: '-0.02em' }}>B</span>
          </div>
          <p className="font-headline font-bold tracking-[0.22em] uppercase text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            BantuPay
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="relative z-10 px-8 pb-20"
      >
        <h1 className="font-headline font-extrabold text-[34px] text-white leading-tight tracking-tight mb-2">
          Your assets,<br />your rules.
        </h1>
        <p className="font-body text-[15px]" style={{ color: '#8A8A9A' }}>
          Send, receive, and save — instantly.
        </p>
        <div className="flex items-center gap-2 mt-8">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#FC690A' }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function WelcomeScreen({ onNext, onSignIn }: { onNext: () => void; onSignIn: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col bg-background w-full"
    >
      {/* Hero */}
      <div className="flex-1 flex flex-col justify-end px-8 pb-10 pt-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div
            className="w-14 h-14 rounded-[18px] flex items-center justify-center mb-8"
            style={{
              background: 'linear-gradient(135deg, #FC690A 0%, #D4560A 100%)',
              boxShadow: '0 8px 24px rgba(252,105,10,0.3)',
            }}
          >
            <span className="font-headline font-black text-[28px] leading-none text-white">B</span>
          </div>
          <h1 className="font-headline font-extrabold text-[40px] text-on-surface leading-tight tracking-tight mb-4">
            Your assets,<br />your rules.
          </h1>
          <p className="font-body text-[16px] text-on-surface-variant leading-relaxed max-w-[280px]">
            Send, receive, and save digital assets — instantly and securely.
          </p>
        </motion.div>
      </div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="px-8 pb-16 pt-8 space-y-4 border-t border-outline-variant/10"
      >
        <button
          onClick={onNext}
          className="w-full h-[56px] rounded-full font-headline font-bold text-[16px] text-white active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #FC690A 0%, #D4560A 100%)', boxShadow: '0 8px 24px rgba(252,105,10,0.25)' }}
        >
          Get Started
        </button>
        <button
          onClick={() => { haptics.light(); onSignIn() }}
          className="w-full h-[56px] rounded-full font-headline font-semibold text-[15px] text-on-surface-variant bg-surface-container border border-outline-variant/20 transition-all active:scale-95"
        >
          Login with existing wallet
        </button>
        <p className="text-center font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant/40 pt-2">
          Powered by Bantu Network Technology
        </p>
      </motion.div>
    </motion.div>
  )
}

function ModeScreen({ selected, onSelect, onNext }: { selected: string; onSelect: (m: any) => void; onNext: () => void }) {
  const modes = [
    { id: 'personal', icon: 'face',       title: 'Personal', desc: 'Send and receive money for everyday use' },
    { id: 'merchant', icon: 'storefront', title: 'Merchant', desc: 'Accept payments and manage your business' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="font-body min-h-screen flex flex-col bg-background w-full"
    >
      <div className="fixed top-0 left-0 w-full h-[3px] bg-surface-container-highest z-50">
        <div className="h-full bg-[#FC690A] w-1/5 transition-all duration-500 ease-out" />
      </div>

      <nav className="flex items-center justify-between px-6 pt-10 pb-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 text-on-surface">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="font-label text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">Step 1 of 5</span>
        <div className="w-10" />
      </nav>

      <main className="flex-1 px-8 pt-4 flex flex-col pb-32">
        <div className="mb-8">
          <h1 className="font-headline font-extrabold text-[32px] leading-tight tracking-tight text-on-surface mb-3">
            How will you use BantuPay?
          </h1>
          <p className="text-on-surface-variant font-medium leading-relaxed">
            Pick the option that fits best — you can change it later.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {modes.map(m => (
            <label key={m.id} className="relative block cursor-pointer" onClick={() => { haptics.light(); onSelect(m.id) }}>
              <div className={`flex items-center h-[88px] px-4 rounded-[16px] border-2 transition-all ${selected === m.id ? 'bg-[#FC690A]/8 border-[#FC690A]' : 'bg-surface-container-lowest border-transparent hover:border-surface-container-high'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${selected === m.id ? 'bg-[#FC690A] text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined">{m.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-headline font-bold text-base text-on-surface">{m.title}</h3>
                  <p className="text-xs text-on-surface-variant font-medium">{m.desc}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected === m.id ? 'border-[#FC690A]' : 'border-surface-container-highest'}`}>
                  {selected === m.id && <div className="w-3 h-3 rounded-full bg-[#FC690A]" />}
                </div>
              </div>
            </label>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-8 bg-gradient-to-t from-background via-background to-transparent z-10 max-w-[430px] mx-auto">
        <button onClick={onNext} className="w-full h-14 rounded-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-lg shadow-[0_12px_32px_-4px_rgba(252,105,10,0.3)] active:scale-[0.98] transition-transform">
          Continue
        </button>
      </footer>
    </motion.div>
  )
}

function PhoneScreen({ value, onChange, onBack, onNext }: { value: string; onChange: (v: string) => void; onBack: () => void; onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="font-body min-h-screen flex flex-col bg-background w-full relative overflow-hidden"
    >
      <div className="fixed top-0 left-0 w-full h-[3px] bg-surface-container-highest z-50">
        <div className="h-full bg-[#FC690A] w-2/5 transition-all duration-500 ease-out" />
      </div>

      <nav className="flex items-center justify-between px-6 pt-10 pb-4 relative z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 text-on-surface">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="font-label text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">Step 2 of 5</span>
        <div className="w-10" />
      </nav>

      <main className="flex-1 px-8 pt-6 pb-24 relative z-10">
        <div className="w-[64px] h-[64px] bg-primary/10 rounded-full flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-[32px] text-primary">phone_iphone</span>
        </div>

        <div className="mb-10">
          <h1 className="font-headline text-[32px] font-extrabold leading-tight tracking-tight text-on-surface mb-3">
            What's your number?
          </h1>
          <p className="font-body text-on-surface-variant text-base leading-relaxed">
            We'll send a one-time code to verify it's really you.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center h-[56px] bg-surface-container rounded-[12px] px-4 focus-within:ring-2 focus-within:ring-[#FC690A]/40 transition-all border border-transparent hover:border-outline-variant/30">
            <div className="flex items-center gap-2 pr-4 border-r border-outline-variant/30">
              <span className="text-xl">🇳🇬</span>
              <span className="font-mono font-bold text-on-surface">+234</span>
              <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
            </div>
            <input
              value={value}
              onChange={e => onChange(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 font-mono text-lg text-on-surface placeholder:text-on-surface-variant/60 pl-4 outline-none font-bold tracking-wide"
              placeholder="800 000 0000"
              type="tel"
            />
          </div>
        </div>

        <button className="mt-6 font-label text-sm font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-2">
          Use email instead
          <span className="material-symbols-outlined text-[18px]">mail</span>
        </button>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-8 bg-gradient-to-t from-background via-background/95 to-transparent z-20 max-w-[430px] mx-auto">
        <button onClick={() => { haptics.medium(); onNext() }} disabled={value.length < 5} className="w-full h-14 bg-gradient-to-br from-[#FC690A] to-[#D4560A] rounded-full text-white font-headline font-bold text-lg shadow-[0_12px_32px_-4px_rgba(252,105,10,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          Send Code
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
        </button>
      </div>
    </motion.div>
  )
}

function OtpScreen({ value, onBack, onNext }: { value: string; onBack: () => void; onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="font-body min-h-screen flex flex-col bg-background w-full relative overflow-hidden"
    >
      <div className="fixed top-0 left-0 w-full h-[3px] bg-surface-container-highest z-50">
        <div className="h-full bg-[#FC690A] w-3/5 transition-all duration-500 ease-out" />
      </div>

      <nav className="flex items-center justify-between px-6 pt-10 pb-4 relative z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 text-on-surface">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="font-label text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">Step 3 of 5</span>
        <div className="w-10" />
      </nav>

      <main className="flex-1 flex flex-col px-8 pt-10 items-center text-center relative z-10">
        <div className="w-[64px] h-[64px] bg-primary/10 rounded-full flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-[32px] text-primary">chat</span>
        </div>

        <div className="space-y-3 mb-10">
          <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">Enter the code</h1>
          <p className="text-on-surface-variant leading-relaxed px-4 text-sm">
            We sent a 6-digit code to <span className="font-mono font-bold text-on-surface">+234 803 ••• ••89</span>
          </p>
          <button className="inline-block text-primary font-bold text-sm hover:opacity-80 transition-opacity mt-2">Change number</button>
        </div>

        <div className="flex justify-center gap-2 mb-8 px-2 w-full max-w-[320px]">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className={`flex-1 aspect-[3/4] rounded-xl flex items-center justify-center border-2 transition-all ${
              value.length >= i ? 'bg-surface-container border-transparent' :
              value.length === i - 1 ? 'bg-surface-container border-primary shadow-[0_0_15px_rgba(252,105,10,0.15)]' :
              'bg-surface-container border-transparent'
            }`}>
              {value.length >= i && <div className="w-2.5 h-2.5 bg-on-surface rounded-full" />}
              {value.length === i - 1 && <div className="w-0.5 h-6 bg-primary animate-pulse rounded-full" />}
            </div>
          ))}
        </div>

        <p className="text-sm text-on-surface-variant">Resend code in <span className="font-mono font-bold text-on-surface">0:28</span></p>
      </main>

      <footer className="p-8 mt-auto sticky bottom-0 z-20 w-full max-w-[430px] mx-auto">
        <button onClick={onNext} className={`w-full h-14 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-bold rounded-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform ${value.length === 6 ? 'opacity-100' : 'opacity-40'}`}>
          Verify
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </footer>
    </motion.div>
  )
}

function NameScreen({ value, onChange, onBack, onNext }: { value: string; onChange: (v: string) => void; onBack: () => void; onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="font-body min-h-screen flex flex-col items-center bg-background w-full"
    >
      <div className="fixed top-0 left-0 w-full h-[3px] bg-surface-container-highest z-50">
        <div className="h-full bg-[#FC690A] w-4/5 transition-all duration-500 ease-out" />
      </div>

      <header className="w-full max-w-md px-6 pt-10 pb-4 flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors active:scale-95 text-on-surface">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest font-bold">Step 4 of 5</span>
        <div className="w-10" />
      </header>

      <main className="w-full max-w-md px-8 flex-1 flex flex-col pt-6">
        <div className="w-[64px] h-[64px] bg-primary rounded-full flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-[32px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>alternate_email</span>
        </div>
        <h1 className="font-headline text-[32px] font-extrabold tracking-tight text-on-surface leading-tight mb-3">
          Pick a username
        </h1>
        <p className="text-on-surface-variant text-base leading-relaxed mb-10">
          This is how people will find and pay you — like your personal payment link.
        </p>

        <div className="space-y-6">
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-body text-xl font-bold">@</span>
            <input
              id="username"
              value={value}
              onChange={e => onChange(e.target.value)}
              className="w-full h-14 pl-12 pr-5 rounded-full bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-[#FC690A]/40 text-on-surface font-body text-xl font-bold outline-none placeholder:text-on-surface-variant/40 transition-all"
              placeholder="username"
              maxLength={20}
              type="text"
            />
          </div>

          <div className="p-5 rounded-[16px] bg-surface-container-low border border-outline-variant/10">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Your payment link</p>
            <span className="font-mono text-primary text-[15px] font-bold">bantupay.link/{value || 'username'}</span>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-[430px] p-8 sticky bottom-0 bg-gradient-to-t from-background via-background/90 to-transparent">
        <button onClick={() => { haptics.medium(); onNext() }} disabled={value.length < 3} className="w-full h-14 rounded-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-lg shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          Continue
          <span className="material-symbols-outlined text-xl font-bold">east</span>
        </button>
      </footer>
    </motion.div>
  )
}

function PinScreen({
  value, onPress, onDelete,
  mode = 'set',
  hasError = false,
}: {
  value: string; onPress: (d: string) => void; onDelete: () => void;
  mode?: 'set' | 'confirm';
  hasError?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="flex flex-col min-h-screen items-center justify-between overflow-hidden bg-background w-full"
    >
      <div className="fixed top-0 left-0 w-full h-[3px] bg-surface-container-highest z-50">
        <div className="h-full bg-[#FC690A] w-[95%] transition-all duration-500 ease-out" />
      </div>

      <header className="w-full flex justify-center pt-14 pb-6 px-6">
        <span className="text-primary font-headline font-black tracking-tighter text-xl uppercase tracking-widest">BANTUPAY</span>
      </header>

      <main className="flex-1 w-full max-w-md flex flex-col items-center justify-start px-8 pt-4">
        <div className="text-center mb-10">
          <h1 className="font-headline font-extrabold text-[32px] tracking-tight text-on-surface mb-3">
            {mode === 'set' ? 'Create your PIN' : 'Confirm your PIN'}
          </h1>
          <p className="font-body text-on-surface-variant font-medium text-[15px] max-w-[260px] mx-auto leading-relaxed">
            {mode === 'set'
              ? 'Your 4-digit PIN keeps your wallet secure and authorises payments.'
              : 'Enter the same PIN again to make sure you\'ve got it.'}
          </p>
        </div>

        <div className="flex gap-4 mb-2">
          {Array.from({ length: 4 }, (_, i) => (
            <motion.div
              key={i}
              animate={hasError ? { x: [0, -6, 6, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 shadow-sm ${
                hasError ? 'bg-error' :
                value.length > i ? 'bg-primary ring-4 ring-primary/20 scale-110' :
                'bg-surface-container-high'
              }`}
            />
          ))}
        </div>
        {hasError && (
          <p className="font-label font-bold text-[12px] text-error mt-3">PINs don't match — try again</p>
        )}
      </main>

      <section className="w-full max-w-[430px] bg-surface-container-lowest rounded-t-[40px] pt-10 pb-12 px-10 shadow-[0_-20px_50px_rgba(0,0,0,0.03)] border-t border-outline-variant/10 z-20">
        <div className="grid grid-cols-3 gap-y-6 gap-x-8">
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <button key={num} onClick={() => { haptics.light(); onPress(num.toString()) }} className="flex items-center justify-center h-16 w-full rounded-2xl bg-surface-variant hover:bg-surface-container-high active:bg-surface-container-highest active:scale-95 transition-all text-2xl font-bold text-on-surface font-mono shadow-sm">
              {num}
            </button>
          ))}
          <div />
          <button onClick={() => { haptics.light(); onPress('0') }} className="flex items-center justify-center h-16 w-full rounded-2xl bg-surface-variant hover:bg-surface-container-high active:bg-surface-container-highest active:scale-95 transition-all text-2xl font-bold text-on-surface font-mono shadow-sm">
            0
          </button>
          <button onClick={() => { haptics.light(); onDelete() }} className="flex items-center justify-center h-16 w-full rounded-2xl hover:bg-surface-container-high active:scale-95 transition-all text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl">backspace</span>
          </button>
        </div>
      </section>
    </motion.div>
  )
}

function BiometricScreen({ loading, onEnable, onSkip }: { loading: boolean; onEnable: () => void; onSkip: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
      className="min-h-screen flex flex-col bg-background w-full"
    >
      {/* Header */}
      <div className="flex justify-center pt-14 pb-2">
        <span className="text-primary font-headline font-black tracking-widest text-[15px] uppercase">BANTUPAY</span>
      </div>

      {/* Phone mockup */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-8">
        <motion.div
          animate={loading ? { scale: [1, 1.03, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className="relative w-[180px] h-[260px] mb-10"
        >
          {/* Phone outline */}
          <div
            className="absolute inset-0 rounded-[32px] border-[6px] border-outline-variant/20 bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
          />
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-outline-variant/15 rounded-b-2xl" />
          {/* Glow */}
          <div
            className="absolute inset-6 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(252,105,10,0.12) 0%, transparent 70%)' }}
          />
          {/* Face ID rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-[100px] h-[100px] rounded-full border-2 border-primary/20 absolute -inset-[18px]" />
              <div className="w-[64px] h-[64px] rounded-full border-2 border-primary/30 absolute -inset-[0px]" />
              <div className="w-[64px] h-[64px] rounded-full bg-primary/10 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-primary text-[32px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  face
                </span>
              </div>
            </div>
          </div>
          {/* Bottom lines (placeholder content) */}
          <div className="absolute bottom-8 left-6 right-6 space-y-2">
            <div className="h-2 bg-outline-variant/15 rounded-full" />
            <div className="h-2 bg-outline-variant/10 rounded-full w-3/4 mx-auto" />
            <div className="h-2 bg-outline-variant/10 rounded-full w-1/2 mx-auto" />
          </div>
        </motion.div>

        <h1 className="font-headline font-extrabold text-[28px] text-on-surface text-center tracking-tight mb-3">
          {loading ? 'Verifying…' : 'Unlock with Face ID'}
        </h1>
        <p className="text-on-surface-variant text-[15px] text-center font-body leading-relaxed max-w-[260px]">
          Skip typing your PIN every time you open the app or send money.
        </p>
      </div>

      {/* CTAs */}
      <div className="px-8 pb-14 space-y-4">
        <button
          onClick={onEnable}
          disabled={loading}
          className="w-full h-14 rounded-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-[16px] shadow-[0_8px_24px_rgba(252,105,10,0.25)] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? 'Authenticating…' : 'Enable Face ID'}
          {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
        </button>
        <button
          onClick={() => { haptics.light(); onSkip() }}
          disabled={loading}
          className="w-full h-12 text-on-surface-variant font-headline font-semibold text-[15px] hover:text-on-surface transition-colors"
        >
          Skip for now
        </button>
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="material-symbols-outlined text-[14px] text-on-surface-variant/50">shield</span>
          <p className="font-label font-bold text-[10px] text-on-surface-variant/50 uppercase tracking-widest">Enterprise Security</p>
        </div>
      </div>
    </motion.div>
  )
}

function CreatedScreen({ name }: { name: string }) {
  const router = useRouter()
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex-1 min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden bg-background w-full"
    >
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FC690A]/8 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#FC690A]/8 rounded-full blur-[100px]" />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
        className="w-24 h-24 bg-gradient-to-br from-[#FC690A] to-[#D4560A] rounded-[32px] flex items-center justify-center mb-10 shadow-lg shadow-primary/30"
      >
        <span className="text-[48px]">✨</span>
      </motion.div>

      <div className="text-center relative z-10 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-[40px] font-headline font-extrabold text-on-surface tracking-tighter leading-none mb-5"
        >
          {name ? `Welcome, ${name.split(' ')[0]}!` : "You're all set!"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-on-surface-variant text-[15px] font-medium font-body leading-relaxed max-w-xs mx-auto"
        >
          Your BantuPay wallet is ready. Add money to get started.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.0 }}
        className="mt-12 w-full max-w-md space-y-4 px-8 relative z-20"
      >
        <button
          onClick={() => { haptics.medium(); router.push('/buy') }}
          className="w-full h-14 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-lg rounded-full shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
        >
          Add money
        </button>
        <button
          onClick={() => { haptics.light(); router.push('/home') }}
          className="w-full h-14 rounded-full text-on-surface-variant font-bold hover:text-on-surface transition-colors"
        >
          Take a look around first
        </button>
      </motion.div>
    </motion.div>
  )
}
