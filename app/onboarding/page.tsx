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
    if (step === 'pin' && pin.length === 6) {
      setTimeout(() => setStep('biometric'), 300)
    }
  }, [pin, step])

  const finishOnboarding = () => {
    const persona = MOCK_PERSONAS.find(p => p.mode === mode) ?? MOCK_PERSONAS[0]
    setPersona({ ...persona, name: name || persona.name })
    completeOnboarding()
    setStep('created')
    setTimeout(() => router.push('/home'), 2200)
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'splash' && <SplashScreen key="splash" />}
        {step === 'welcome' && <WelcomeScreen key="welcome" onNext={() => setStep('mode')} />}
        {step === 'mode' && <ModeScreen key="mode" selected={mode} onSelect={setMode} onNext={() => setStep('pin')} />}
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
            <span className="text-4xl font-black text-[#FC690A] font-display">B</span>
          </div>
          <h1 className="font-headline font-semibold text-[28px] tracking-tight text-white">BantuPay</h1>
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
      className="bg-surface min-h-screen flex flex-col overflow-x-hidden w-full"
    >
      <section className="relative h-[486px] w-full flex flex-col justify-end px-8 pb-12 overflow-hidden bg-gradient-to-br from-[#FC690A] to-[#D4560A]">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)]" style={{ backgroundSize: '24px 24px' }} />
        <div className="absolute -bottom-40 -left-20 w-[300px] h-[300px] rounded-full bg-white/10 blur-[80px]" />
        
        <div className="relative z-10 max-w-md mx-auto w-full">
          <div className="mb-6 inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
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
              <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary transition-transform active:scale-95">
                <span className="material-symbols-outlined text-[28px] fill-icon">bolt</span>
              </div>
              <span className="text-[12px] font-semibold text-on-surface-variant tracking-tight">Instant</span>
            </div>
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary transition-transform active:scale-95">
                <span className="material-symbols-outlined text-[28px] fill-icon">shield_lock</span>
              </div>
              <span className="text-[12px] font-semibold text-on-surface-variant tracking-tight">Secure</span>
            </div>
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary transition-transform active:scale-95">
                <span className="material-symbols-outlined text-[28px]">sync_alt</span>
              </div>
              <span className="text-[12px] font-semibold text-on-surface-variant tracking-tight">Limitless</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mt-10 space-y-4">
          <button onClick={onNext} className="w-full h-[56px] bg-gradient-to-r from-[#FC690A] to-[#D4560A] text-white rounded-full font-headline font-bold text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
            Get Started
          </button>
          <button onClick={() => haptics.light()} className="w-full h-[56px] flex items-center justify-center gap-2 text-on-surface font-semibold text-[15px] hover:bg-surface-container-high rounded-full transition-colors active:scale-[0.98]">
            I already have a wallet
            <span className="material-symbols-outlined text-primary text-[20px]">arrow_forward</span>
          </button>
          <div className="mt-8 text-center">
            <p className="text-[10px] text-on-surface-variant/60 font-medium tracking-wide uppercase">Powered by Bantu Blockchain Technology</p>
          </div>
        </div>
      </main>
    </motion.div>
  )
}

function ModeScreen({ selected, onSelect, onNext }: { selected: string; onSelect: (m: any) => void; onNext: () => void }) {
  const modes = [
    { id: 'personal', icon: 'payments',   title: 'Personal',    desc: 'Send and receive money' },
    { id: 'merchant', icon: 'storefront', title: 'Merchant',    desc: 'Accept payments at my business' },
    { id: 'crypto',   icon: 'monitoring', title: 'Crypto User', desc: 'I know what I\'m doing' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="font-body text-on-surface min-h-screen flex flex-col bg-surface w-full"
    >
      <header className="px-6 py-6 flex items-center justify-between">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-container" />
          <div className="w-2 h-2 rounded-full bg-surface-container-highest" />
          <div className="w-2 h-2 rounded-full bg-surface-container-highest" />
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-6 pt-4 flex flex-col pb-32">
        <div className="mb-10">
          <h1 className="font-headline font-bold text-[28px] leading-tight tracking-tight text-on-surface mb-2">
            What brings you here?
          </h1>
          <p className="text-on-surface-variant font-medium leading-relaxed max-w-[280px]">
            Choose the account type that best fits your needs. You can change this later.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {modes.map(m => (
            <label key={m.id} className="relative block group cursor-pointer" onClick={() => { haptics.light(); onSelect(m.id) }}>
              <div className={`flex items-center h-[88px] px-4 rounded-[16px] border-2 transition-all ${selected === m.id ? 'bg-[#FFF5F0] border-primary-container' : 'bg-surface-container-lowest border-transparent hover:border-surface-container-high'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${selected === m.id ? 'bg-primary-container text-white' : 'bg-surface-container-low text-on-surface-variant'}`}>
                  <span className={`material-symbols-outlined ${selected === m.id ? 'fill-icon' : ''}`}>{m.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-headline font-bold text-base text-on-surface">{m.title}</h3>
                  <p className="text-sm text-on-surface-variant font-medium">{m.desc}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected === m.id ? 'border-primary-container' : 'border-surface-container-highest'}`}>
                  {selected === m.id && <div className="w-3 h-3 rounded-full bg-primary-container" />}
                </div>
              </div>
            </label>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#F5F6FA] via-[#F5F6FA] to-transparent">
        <button onClick={onNext} className="w-full h-14 rounded-full bg-gradient-to-r from-primary-container to-[#D4560A] text-white font-headline font-bold text-base shadow-brand flex items-center justify-center tracking-wide active:scale-95 transition-transform">
          Continue
        </button>
      </footer>
    </motion.div>
  )
}

function PinScreen({ value, onPress, onDelete }: { value: string; onPress: (d: string) => void; onDelete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="flex flex-col min-h-screen items-center justify-between overflow-hidden bg-surface w-full"
    >
      <header className="w-full flex justify-center pt-12 pb-6 px-6">
        <span className="text-primary font-headline font-black tracking-tighter text-2xl uppercase">BANTUPAY</span>
      </header>

      <main className="flex-1 w-full max-w-md flex flex-col items-center justify-start px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mt-8 mb-8 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-primary opacity-5 blur-2xl" />
            <span className="material-symbols-outlined text-primary text-[52px] fill-icon">shield_person</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="font-headline font-bold text-3xl tracking-tight text-on-surface mb-3">Create your PIN</h1>
          <p className="font-body text-on-surface-variant opacity-80 text-sm max-w-[280px] mx-auto leading-relaxed">
            6 digits that will be used to authorize your transactions and secure your assets.
          </p>
        </div>

        <div className="flex gap-4 mb-12">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${value.length > i ? 'bg-primary ring-4 ring-primary/10' : 'border-2 border-zinc-300 bg-transparent'}`} />
          ))}
        </div>
      </main>

      <section className="w-full max-w-md bg-surface-container-low rounded-t-[3rem] pt-10 pb-12 px-10 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-3 gap-y-6 gap-x-8">
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <button key={num} onClick={() => { haptics.light(); onPress(num.toString()) }} className="flex items-center justify-center h-16 w-full rounded-2xl bg-surface-variant hover:bg-zinc-200 active:scale-95 transition-all text-2xl font-medium text-on-surface font-body">
              {num}
            </button>
          ))}
          <button onClick={() => haptics.medium()} className="flex items-center justify-center h-16 w-full rounded-2xl hover:bg-zinc-200 active:scale-95 transition-all text-zinc-500">
            <span className="material-symbols-outlined text-3xl">fingerprint</span>
          </button>
          <button onClick={() => { haptics.light(); onPress('0') }} className="flex items-center justify-center h-16 w-full rounded-2xl bg-surface-variant hover:bg-zinc-200 active:scale-95 transition-all text-2xl font-medium text-on-surface font-body">
            0
          </button>
          <button onClick={() => { haptics.light(); onDelete() }} className="flex items-center justify-center h-16 w-full rounded-2xl hover:bg-zinc-200 active:scale-95 transition-all text-zinc-500">
            <span className="material-symbols-outlined text-3xl">backspace</span>
          </button>
        </div>
        <div className="mt-8 flex justify-center">
          <div className="w-32 h-1.5 bg-zinc-200 rounded-full" />
        </div>
      </section>
    </motion.div>
  )
}

function BiometricScreen({ loading, onEnable, onSkip }: { loading: boolean; onEnable: () => void; onSkip: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
      className="flex-1 min-h-screen flex flex-col items-center px-8 pt-24 bg-surface w-full"
    >
      <motion.div
        animate={loading ? { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-32 h-32 rounded-[40px] bg-primary/5 flex items-center justify-center mb-10 border border-primary/10 shadow-inner"
      >
        <span className="material-symbols-outlined text-primary text-6xl">face_recognition</span>
      </motion.div>
      <h1 className="text-3xl font-display font-extrabold text-on-surface text-center tracking-tight mb-4">
        Biometric Security
      </h1>
      <p className="text-on-surface-variant text-base text-center font-body leading-relaxed max-w-xs px-2">
        Enable Face ID or fingerprint to secure your assets and approve payments instantly.
      </p>

      <div className="mt-auto w-full pb-12 space-y-4">
        <button onClick={onEnable} disabled={loading} className="w-full h-14 rounded-full bg-gradient-to-r from-primary-container to-[#D4560A] shadow-brand text-white text-lg font-bold">
          {loading ? 'Authenticating…' : 'Enable Security'}
        </button>
        <button onClick={() => { haptics.reveal(); onSkip() }} disabled={loading} className="w-full h-14 rounded-full text-on-surface-variant font-bold">
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
      className="flex-1 min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden bg-surface w-full"
    >
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
        className="w-32 h-32 bg-gradient-to-br from-[#FC690A] to-[#D4560A] rounded-[40px] flex items-center justify-center mb-10 shadow-brand relative z-10"
      >
        <span className="text-6xl">✨</span>
      </motion.div>
      
      <div className="text-center relative z-10 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-4xl font-display font-extrabold text-on-surface tracking-tight leading-none mb-4"
        >
          You're all set{name ? `, ${name.split(' ')[0]}` : ''}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-on-surface-variant text-lg font-body leading-relaxed max-w-xs mx-auto"
        >
          Your BantuPay wallet is ready for your first transaction.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 }}
        className="mt-12 flex flex-col items-center gap-3"
      >
        <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-on-surface-variant text-sm font-bold tracking-widest uppercase">Launching Dashboard</p>
      </motion.div>
    </motion.div>
  )
}
