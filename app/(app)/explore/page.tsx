'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { haptics } from '@/lib/haptics'

const RATES = [
  { pair: 'XBN / cNGN', rate: '1 XBN = ₦1,512', change: '+2.4%', up: true },
  { pair: 'USDC / cNGN', rate: '1 USDC = ₦1,620', change: '+0.1%', up: true },
  { pair: 'BNR / cNGN', rate: '1 BNR = ₦0.82', change: '-0.6%', up: false },
]

const FEATURED = [
  {
    title: 'Earn on cNGN',
    subtitle: 'Deposit to the BantuSave vault and earn 14% APY on your naira stablecoin.',
    icon: 'savings',
    tag: 'Coming soon',
  },
  {
    title: 'P2P Marketplace',
    subtitle: 'Buy and sell crypto peer-to-peer with escrow protection via Timbuktu.',
    icon: 'people',
    tag: 'Live',
  },
  {
    title: 'cNGN On-ramp',
    subtitle: 'Fund your wallet instantly via bank transfer, card, or USSD.',
    icon: 'account_balance',
    tag: 'Live',
  },
]

export default function ExplorePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-surface pb-36">
      <header className="sticky top-0 bg-surface/80 backdrop-blur-xl px-6 pt-14 pb-5 z-20">
        <h1 className="font-headline font-bold text-[28px] text-on-surface tracking-tight">Explore</h1>
        <p className="font-body text-[14px] text-on-surface-variant mt-0.5">Rates, products, and opportunities</p>
      </header>

      <main className="px-6 space-y-8">
        {/* Live rates */}
        <section>
          <h2 className="font-label font-bold text-[11px] text-on-surface-variant uppercase tracking-widest mb-3">Live Rates</h2>
          <div className="space-y-2">
            {RATES.map((r, i) => (
              <motion.div
                key={r.pair}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="h-[68px] bg-surface-container rounded-[16px] px-4 flex items-center justify-between border border-outline-variant/10"
              >
                <span className="font-headline font-semibold text-[15px] text-on-surface">{r.pair}</span>
                <div className="flex flex-col items-end">
                  <span className="font-headline font-bold text-[15px] text-on-surface">{r.rate}</span>
                  <span className={`font-label font-bold text-[12px] ${r.up ? 'text-[#16A34A]' : 'text-error'}`}>{r.change}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured products */}
        <section>
          <h2 className="font-label font-bold text-[11px] text-on-surface-variant uppercase tracking-widest mb-3">Products</h2>
          <div className="space-y-3">
            {FEATURED.map((item, i) => (
              <motion.button
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.06 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => haptics.light()}
                className="w-full bg-surface-container rounded-[20px] p-5 text-left border border-outline-variant/10 flex gap-4 items-start"
              >
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px] text-primary">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-headline font-bold text-[16px] text-on-surface">{item.title}</span>
                    <span className={`text-[10px] font-label font-bold px-2 py-0.5 rounded-full ${item.tag === 'Live' ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      {item.tag}
                    </span>
                  </div>
                  <p className="font-body text-[13px] text-on-surface-variant leading-snug">{item.subtitle}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
