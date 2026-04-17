'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { haptics } from '@/lib/haptics'
import { useUserStore } from '@/store/user.store'
import { MOCK_PERSONAS } from '@/mock/users'

type Step = 'splash' | 'welcome' | 'mode' | 'phone' | 'otp' | 'name' | 'pin' | 'biometric' | 'created'

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>('splash')
  const [mode, setMode] = useState<'personal' | 'merchant' | 'crypto'>('personal')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
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
      setTimeout(() => setStep('biometric'), 300)
    }
  }, [pin, step])

  const finishOnboarding = () => {
    const persona = MOCK_PERSONAS.find(p => p.mode === mode) ?? MOCK_PERSONAS[0]
    setPersona({ ...persona, name: name || persona.name })
    completeOnboarding()
    setStep('created')
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'splash' && <SplashScreen key="splash" />}
        {step === 'welcome' && <WelcomeScreen key="welcome" onNext={() => setStep('mode')} />}
        {step === 'mode' && <ModeScreen key="mode" selected={mode} onSelect={setMode} onNext={() => setStep('phone')} />}
        
        {step === 'phone' && <PhoneScreen key="phone" value={phone} onChange={setPhone} onBack={() => setStep('mode')} onNext={() => setStep('otp')} />}
        {step === 'otp' && <OtpScreen key="otp" value={otp} onBack={() => setStep('phone')} onNext={() => setStep('name')} />}
        {step === 'name' && <NameScreen key="name" value={name} onChange={setName} onBack={() => setStep('otp')} onNext={() => setStep('pin')} />}
        
        {step === 'pin' && <PinScreen key="pin" value={pin} onPress={d => setPin(p => p.length < 6 ? p + d : p)} onDelete={() => setPin(p => p.slice(0, -1))} />}
        {step === 'biometric' && <BiometricScreen key="bio" loading={bioLoading} onEnable={() => {
          setBioLoading(true)
          haptics.medium()
          setTimeout(() => { setBioLoading(false); haptics.success(); finishOnboarding() }, 1200)
        }} onSkip={finishOnboarding} />}
        {step === 'created' && <CreatedScreen key="created" name={name} />}
      </AnimatePresence>
    </div>
  )
}

function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="relative h-screen w-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute -bottom-24 -right-24 pointer-events-none">
        <div className="absolute border border-white/10 rounded-full w-[600px] h-[600px] translate-x-1/4 translate-y-1/4" />
        <div className="absolute border border-white/10 rounded-full w-[450px] h-[450px] translate-x-1/4 translate-y-1/4" />
        <div className="absolute border border-white/10 rounded-full w-[300px] h-[300px] translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="z-10 flex flex-col items-center justify-center mb-[10%]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 flex items-center justify-center bg-white rounded-2xl shadow-lg">
            <span className="text-4xl font-headline font-black text-[#FC690A]">B</span>
          </div>
          <h1 className="font-headline font-bold text-[28px] tracking-tight text-white">BantuPay</h1>
          <p className="mt-4 font-body text-[15px] text-white/80 tracking-wide font-medium">Empowering Humanity</p>
        </motion.div>
      </div>

      <div className="absolute bottom-16 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/80 animate-pulse delay-150" />
        <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse delay-300" />
      </div>
    </motion.div>
  )
}

function WelcomeScreen({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="bg-surface min-h-screen flex flex-col overflow-x-hidden w-full flex-1"
    >
      <section className="relative h-[486px] w-full flex flex-col justify-end px-8 pb-12 overflow-hidden bg-gradient-to-br from-[#FC690A] to-[#D4560A]">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)]" style={{ backgroundSize: '24px 24px' }} />
        <div className="absolute -bottom-40 -left-20 w-[300px] h-[300px] rounded-full bg-white/10 blur-[80px]" />
        
        <div className="relative z-10 max-w-md mx-auto w-full">
          <div className="mb-6 inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="text-white text-[11px] font-bold tracking-widest uppercase">BANTUPAY 3.0</span>
          </div>
          <h1 className="text-white font-headline font-bold text-[32px] leading-tight tracking-tight mb-4">
            More than just a wallet
          </h1>
          <p className="text-white/85 font-body text-[15px] leading-relaxed max-w-[280px]">
            Send, receive and save digital assets with simplicity
          </p>
          <p className="text-white/60 font-body text-[12px] mt-2 italic">Supports cNGN natively</p>
        </div>
      </section>

      <main className="relative flex-grow bg-surface-container-lowest rounded-t-[28px] -mt-8 z-20 shadow-[0_-12px_40px_rgba(0,0,0,0.08)] px-8 pt-10 pb-12 flex flex-col justify-between items-center w-full">
        <div className="w-full max-w-md space-y-8 flex-1">
          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform active:scale-95">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              </div>
              <span className="text-[12px] font-semibold text-on-surface-variant tracking-tight">Instant</span>
            </div>
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform active:scale-95">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_lock</span>
              </div>
              <span className="text-[12px] font-semibold text-on-surface-variant tracking-tight">Secure</span>
            </div>
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform active:scale-95">
                <span className="material-symbols-outlined text-[28px]">sync_alt</span>
              </div>
              <span className="text-[12px] font-semibold text-on-surface-variant tracking-tight">Limitless</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mt-10 space-y-4">
          <button onClick={onNext} className="w-full h-[56px] bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white rounded-full font-headline font-bold text-base shadow-lg shadow-[#FC690A]/20 active:scale-[0.98] transition-all">
            Get Started
          </button>
          <button onClick={() => haptics.light()} className="w-full h-[56px] flex items-center justify-center gap-2 text-on-surface font-semibold text-[15px] hover:bg-surface-container-high rounded-full transition-colors active:scale-[0.98]">
            I already have a wallet
            <span className="material-symbols-outlined text-primary text-[20px]">arrow_forward</span>
          </button>
          <div className="mt-8 text-center flex flex-col items-center gap-2">
            <p className="text-[10px] text-on-surface-variant/60 font-bold tracking-widest uppercase">Powered by</p>
            <p className="text-[11px] text-on-surface-variant font-bold tracking-wider uppercase">Bantu Network Technology</p>
          </div>
        </div>
      </main>
    </motion.div>
  )
}

function ModeScreen({ selected, onSelect, onNext }: { selected: string; onSelect: (m: any) => void; onNext: () => void }) {
  const modes = [
    { id: 'personal', icon: 'face',   title: 'Personal',    desc: 'Send and receive money seamlessly' },
    { id: 'merchant', icon: 'storefront', title: 'Merchant',    desc: 'Accept crypto payments for your business' },
    { id: 'crypto',   icon: 'monitoring', title: 'Crypto Pro', desc: 'Full control of your private keys' },
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
        <span className="font-label text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">STEP 1 OF 5</span>
        <div className="w-10" />
      </nav>

      <main className="flex-1 px-8 pt-6 flex flex-col pb-32">
        <div className="mb-10">
          <h1 className="font-headline font-extrabold text-[32px] leading-tight tracking-tight text-on-surface mb-3">
            What brings you here?
          </h1>
          <p className="text-on-surface-variant font-medium leading-relaxed max-w-[280px]">
            Choose the account type that best fits your needs. You can change this later.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {modes.map(m => (
            <label key={m.id} className="relative block group cursor-pointer" onClick={() => { haptics.light(); onSelect(m.id) }}>
              <div className={`flex items-center h-[88px] px-4 rounded-[16px] border-2 transition-all ${selected === m.id ? 'bg-[#FC690A]/10 border-[#FC690A]' : 'bg-surface-container-lowest border-transparent hover:border-surface-container-high'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${selected === m.id ? 'bg-[#FC690A] text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                  <span className={`material-symbols-outlined`}>{m.icon}</span>
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

      <footer className="fixed bottom-0 left-0 w-full p-8 bg-gradient-to-t from-background via-background to-transparent z-10 w-full max-w-[430px] mx-auto">
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
        <span className="font-label text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">STEP 2 OF 4</span>
        <div className="w-10" />
      </nav>

      <main className="flex-1 px-8 pt-6 pb-24 relative z-10">
        <div className="flex justify-start mb-10">
          <div className="w-[72px] h-[72px] bg-surface-container-low rounded-full flex items-center justify-center shadow-lg border border-outline-variant/10">
            <span className="material-symbols-outlined text-[40px] text-[#FC690A]">phone_iphone</span>
          </div>
        </div>

        <div className="mb-12">
          <h1 className="font-headline text-[32px] font-extrabold leading-tight tracking-tight text-on-surface mb-3">
            What's your number?
          </h1>
          <p className="font-body text-on-surface-variant text-base leading-relaxed">
            A verification code will be sent to this mobile number for account security.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center h-[56px] bg-surface-container rounded-[12px] px-4 group focus-within:ring-2 focus-within:ring-[#FC690A]/40 transition-all border border-transparent hover:border-outline-variant/30">
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
          <div className="flex items-center gap-1.5 px-1">
            <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
            <p className="font-label text-xs font-bold text-on-surface-variant">Auto-detected country</p>
          </div>
        </div>

        <div className="mt-8">
          <button className="font-label text-sm font-bold text-[#FC690A] hover:opacity-80 transition-opacity flex items-center gap-2">
            Use email instead
            <span className="material-symbols-outlined text-[18px]">mail</span>
          </button>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-8 bg-gradient-to-t from-background via-background/95 to-transparent z-20 w-full max-w-[430px] mx-auto">
        <button onClick={() => { haptics.medium(); onNext() }} disabled={value.length < 5} className="w-full h-14 bg-gradient-to-br from-[#FC690A] to-[#D4560A] rounded-full text-white font-headline font-bold text-lg shadow-[0_12px_32px_-4px_rgba(252,105,10,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          Send Code
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
        </button>
      </div>

      {/* Decorative */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10" />
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
        <span className="font-label text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">STEP 3 OF 4</span>
        <div className="w-10" />
      </nav>

      <main className="flex-1 flex flex-col px-8 pt-12 items-center text-center relative z-10">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-primary opacity-20 blur-2xl rounded-full scale-150" />
          <div className="relative w-20 h-20 bg-surface rounded-full flex items-center justify-center shadow-sm border border-outline-variant/10">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[#FC690A] text-4xl">chat</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-12">
          <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">Enter the code</h1>
          <p className="text-on-surface-variant leading-relaxed px-4 text-sm">
            We've sent a 6-digit verification code to <br/>
            <span className="font-mono font-bold text-on-surface">+234 803 ••• ••89</span>
          </p>
          <button className="inline-block text-[#FC690A] font-bold text-sm hover:opacity-80 transition-opacity mt-2">Change number</button>
        </div>

        <div className="flex justify-center gap-2 mb-8 px-2 w-full max-w-[320px]">
          {/* Mock UI fields for visual OTP state */}
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className={`flex-1 aspect-[3/4] rounded-xl flex items-center justify-center border-2 transition-all ${
              value.length >= i ? 'bg-surface-container border-transparent' : 
              value.length === i - 1 ? 'bg-surface-container border-[#FC690A] shadow-[0_0_15px_rgba(252,105,10,0.15)]' :
              'bg-surface-container border-transparent'
            }`}>
              {value.length >= i && <div className="w-2.5 h-2.5 bg-on-surface rounded-full" />}
              {value.length === i - 1 && <div className="w-0.5 h-6 bg-[#FC690A] animate-pulse rounded-full" />}
            </div>
          ))}
        </div>

        <div className="w-full space-y-6 max-w-[320px]">
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm text-on-surface-variant">Resend code in <span className="font-mono font-bold text-on-surface">0:28</span></p>
          </div>
          <div className="pt-6 border-t border-surface-container-high/50 flex flex-col gap-4">
            <button className="w-full h-14 bg-surface-container text-on-surface font-bold rounded-full hover:bg-surface-container-high transition-all flex items-center justify-center gap-3 active:scale-95 border border-outline-variant/10 shadow-sm">
              <span className="material-symbols-outlined">chat_bubble</span>
              Try WhatsApp OTP
            </button>
          </div>
        </div>
      </main>

      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -right-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Hidden button since we auto-advance when 6 digits are reached but for visual consistency */}
      <footer className="p-8 mt-auto sticky bottom-0 z-20 w-full max-w-[430px] mx-auto">
        <button onClick={onNext} className={`w-full h-14 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-bold rounded-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform ${value.length === 6 ? 'opacity-100' : 'opacity-40'}`}>
          Verify Identity
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
        <span className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest font-bold">Step 4 of 4</span>
        <div className="w-10" />
      </header>

      <main className="w-full max-w-md px-8 flex-1 flex flex-col pt-6">
        <div className="mb-10 flex flex-col items-start">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[#FC690A] flex items-center justify-center text-white shadow-lg">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>alternate_email</span>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-surface border-4 border-background flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FC690A] animate-pulse" />
            </div>
          </div>
          <h1 className="mt-8 font-headline text-[32px] font-extrabold tracking-tight text-on-surface leading-tight">
            Choose your username
          </h1>
          <p className="mt-3 text-on-surface-variant text-base leading-relaxed">
            This will be used for sending and receiving assets across the Bantu ecosystem.
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex justify-between items-end px-1">
              <label className="font-label text-sm font-bold text-on-surface-variant" htmlFor="username">Username</label>
              <span className="font-mono text-xs text-on-surface-variant opacity-60 font-bold">{value.length}/20</span>
            </div>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FC690A] font-body text-xl font-bold">@</span>
              <input 
                id="username" 
                value={value} 
                onChange={e => onChange(e.target.value)}
                className="w-full h-14 pl-12 pr-5 rounded-full bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-[#FC690A]/40 text-on-surface font-body text-xl font-bold outline-none placeholder:text-on-surface-variant/40 transition-all shadow-inner" 
                placeholder="username" 
                maxLength={20}
                type="text" 
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-on-surface">link</span>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">Your BantuPay link will be:</p>
              <div className="flex items-center gap-2">
                <span className="text-[#FC690A] material-symbols-outlined text-base">alternate_email</span>
                <span className="font-mono text-[#FC690A] text-lg tracking-tight font-bold">bantupay.link/{value || 'username'}</span>
              </div>
            </div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#FC690A]/5 rounded-full blur-3xl" />
          </div>
        </div>
      </main>

      <footer className="w-full max-w-[430px] p-8 bg-gradient-to-t from-background via-background/90 to-transparent sticky bottom-0">
        <button onClick={() => { haptics.medium(); onNext() }} disabled={value.length < 3} className="w-full h-14 rounded-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-lg shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          Continue
          <span className="material-symbols-outlined text-xl font-bold">east</span>
        </button>
      </footer>
    </motion.div>
  )
}

function PinScreen({ value, onPress, onDelete }: { value: string; onPress: (d: string) => void; onDelete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="flex flex-col min-h-screen items-center justify-between overflow-hidden bg-background w-full"
    >
      <div className="fixed top-0 left-0 w-full h-[3px] bg-surface-container-highest z-50">
        <div className="h-full bg-[#FC690A] w-[95%] transition-all duration-500 ease-out" />
      </div>

      <header className="w-full flex justify-center pt-14 pb-6 px-6 relative z-10">
        <span className="text-[#FC690A] font-headline font-black tracking-tighter text-xl uppercase tracking-widest">BANTUPAY</span>
      </header>

      <main className="flex-1 w-full max-w-md flex flex-col items-center justify-start px-8 pt-8">
        <div className="mb-8 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center relative overflow-hidden shadow-inner hidden">
            <div className="absolute inset-0 bg-[#FC690A] opacity-10 blur-2xl" />
            <span className="material-symbols-outlined text-[#FC690A] text-[52px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="font-headline font-extrabold text-[32px] tracking-tight text-on-surface mb-3">Create your PIN</h1>
          <p className="font-body text-on-surface-variant font-medium text-[15px] max-w-[280px] mx-auto leading-relaxed">
            6 digits that authorize your transactions and secure your assets.
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className={`w-3.5 h-3.5 rounded-full transition-all duration-200 shadow-sm ${value.length > i ? 'bg-[#FC690A] ring-4 ring-[#FC690A]/20 scale-110' : 'bg-surface-container-high'}`} />
          ))}
        </div>
      </main>

      <section className="w-full max-w-[430px] bg-surface-container-lowest rounded-t-[40px] pt-10 pb-12 px-10 shadow-[0_-20px_50px_rgba(0,0,0,0.03)] border-t border-outline-variant/10 z-20">
        <div className="grid grid-cols-3 gap-y-6 gap-x-8">
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <button key={num} onClick={() => { haptics.light(); onPress(num.toString()) }} className="flex items-center justify-center h-16 w-full rounded-2xl bg-surface-variant hover:bg-surface-container-high active:bg-surface-container-highest active:scale-95 transition-all text-2xl font-bold text-on-surface font-mono shadow-sm">
              {num}
            </button>
          ))}
          <button onClick={() => haptics.medium()} className="flex items-center justify-center h-16 w-full rounded-2xl hover:bg-surface-container-high active:scale-95 transition-all text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl">fingerprint</span>
          </button>
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
      className="flex-1 min-h-screen flex flex-col items-center px-8 pt-24 bg-background w-full"
    >
      <motion.div
        animate={loading ? { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-32 h-32 rounded-[40px] bg-[#FC690A]/10 flex items-center justify-center mb-10 border border-[#FC690A]/20 shadow-inner"
      >
        <span className="material-symbols-outlined text-[#FC690A] text-[64px]" style={{ fontVariationSettings: "'wght' 200" }}>face_recognition</span>
      </motion.div>
      <h1 className="text-[32px] font-headline font-extrabold text-on-surface text-center tracking-tight mb-4">
        Biometric Security
      </h1>
      <p className="text-on-surface-variant text-[15px] text-center font-body leading-relaxed max-w-xs px-2 font-medium">
        Enable Face ID or fingerprint to secure your assets and approve payments instantly.
      </p>

      <div className="mt-auto w-full max-w-[430px] pb-12 space-y-4">
        <button onClick={onEnable} disabled={loading} className="w-full h-14 rounded-full bg-gradient-to-br from-[#FC690A] to-[#D4560A] shadow-lg shadow-primary/20 text-white text-lg font-bold active:scale-95 transition-transform">
          {loading ? 'Authenticating…' : 'Enable Security'}
        </button>
        <button onClick={() => { haptics.light(); onSkip() }} disabled={loading} className="w-full h-14 rounded-full text-on-surface-variant font-bold hover:text-on-surface transition-colors active:scale-95">
          Not now, skip
        </button>
      </div>
    </motion.div>
  )
}

function CreatedScreen({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex-1 min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden bg-background w-full"
    >
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FC690A]/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#FC690A]/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
        className="w-32 h-32 bg-gradient-to-br from-[#FC690A] to-[#D4560A] rounded-[40px] flex items-center justify-center mb-10 shadow-lg shadow-primary/30 relative z-10"
      >
        <span className="text-[64px]">✨</span>
      </motion.div>
      
      <div className="text-center relative z-10 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-[40px] font-headline font-extrabold text-on-surface tracking-tighter leading-none mb-5"
        >
          Your wallet is ready{name ? `, \n\${name.split(' ')[0]}` : ''}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-on-surface-variant text-[15px] font-medium font-body leading-relaxed max-w-xs mx-auto"
        >
          You're in... Your gateway to the Bantu ecosystem is now live.
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
          Fund my wallet
        </button>
        <button 
          onClick={() => { haptics.light(); router.push('/home') }}
          className="w-full h-14 rounded-full text-on-surface-variant font-bold hover:text-on-surface transition-colors active:scale-95"
        >
          Explore first
        </button>
      </motion.div>
    </motion.div>
  )
}
