'use client'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { haptics } from '@/lib/haptics'

export default function AssetDetailsPage() {
  const router = useRouter()
  const { id } = useParams()
  const isCngn = id === 'cNGN'

  // Generic data based on ID
  const title = isCngn ? 'cNGN Stablecoin' : `${id} Token`
  const balance = isCngn ? '149,850.00' : '1,240.50'
  const fiat = isCngn ? '≈ ₦149,850.00' : '≈ $42.15'
  const logoUrl = isCngn 
    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr4jShpeqsZqcCEwFbfL3cYyAGLF8oikHmRhGf80Oq9mfyqZd7e7tAUzobHMbAE6wT1s4Kfz3yV6hbjNmZMSydqsvXZmYH-9zemu-GcXSzhBn4yamka6OUoXVzG69pKBbRVaxt7pWAX-LZ88LROZSvsmruI-fqqdrp5Ta0zODDo9n0jgHgdMkwUuIJMuqZFH1gBFMtdsS5ekB8ozVxp-PXgHWspiw9lSPTAG6C_B6eEBM27luInn-50jC3IzQ3cFeD4dekG2E-Xg'
    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUqwit_yyHudJpED_gELyJZ7x51UH12dR-hR_XFVesaQqhUtPFU7j3VHB4ZwVnH2olU5ekcrCEYB8KNGmT8VjTYDMpgEzP7GrWnf6k9-TiYK6tJE_NwUXrn9pxcKu3GiVcCmyq1qtGCzIKiw2cpPr-Fb9AVwaQf00JKLAKpymdKGna3s-M0RJDjrX4pqmxkEQJO63UQDntMph63G05Jb8lRJ7yegjPSsucxj7tHQWv6XSJ1gLF5hfb1iA7Lt4heQUSGDla6fsfWQ'

  return (
    <div className="bg-background text-on-background font-body min-h-screen pb-32">
      <header className="fixed top-0 w-full max-w-[430px] z-50 bg-[#F5F6FA]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => { haptics.light(); router.back() }} className="active:scale-95 duration-200 text-[#FC690A] hover:bg-[#FC690A]/10 p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline font-bold tracking-tight text-xl text-on-surface">Asset Details</h1>
        </div>
        <button className="active:scale-95 duration-200 text-slate-500 hover:bg-[#FC690A]/10 p-2 rounded-full transition-colors">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8">
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-[32px] p-8 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white shadow-[0_24px_48px_rgba(252,105,10,0.15)]"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <img alt="Asset Logo" className="w-8 h-8 object-contain rounded-full" src={logoUrl} />
              </div>
              <span className="font-headline font-bold text-lg tracking-wide">{title}</span>
            </div>
            <div className="space-y-1">
              <p className="text-white/70 font-label text-[10px] font-bold tracking-widest uppercase">TOTAL BALANCE</p>
              <div className="flex items-baseline gap-2">
                <h2 className="font-headline font-extrabold text-[40px] tracking-tighter">{balance}</h2>
                <span className="font-headline font-bold text-xl opacity-80">{id}</span>
              </div>
              <p className="font-mono text-white/90 text-[15px]">{fiat}</p>
            </div>
          </div>
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
        </motion.section>

        <section className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Send', icon: 'arrow_outward', href: '/send' },
              { label: 'Receive', icon: 'arrow_downward', href: '/receive' },
              { label: 'Swap', icon: 'swap_horiz', href: '/swap' },
            ].map(action => (
              <Link key={action.label} href={action.href} onClick={() => haptics.light()} className="flex flex-col items-center justify-center py-5 px-2 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl active:scale-95 transition-transform group shadow-sm hover:shadow-md">
                <div className="w-12 h-12 rounded-full bg-[#FC690A]/10 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[#FC690A] text-2xl font-bold">{action.icon}</span>
                </div>
                <span className="font-headline font-bold text-[13px] text-[#FC690A]">{action.label}</span>
              </Link>
            ))}
          </div>
          
          <div className="flex gap-3 mt-4">
            <button onClick={() => haptics.medium()} className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-br from-[#FC690A] to-[#D4560A] rounded-2xl active:scale-95 transition-transform shadow-lg shadow-[#FC690A]/20">
              <span className="material-symbols-outlined text-white text-[20px]">add_circle</span>
              <span className="font-headline font-bold text-white uppercase tracking-wider text-[12px]">Get {id}</span>
            </button>
            <button onClick={() => haptics.light()} className="flex-1 flex items-center justify-center gap-2 py-4 bg-surface-container-high rounded-2xl active:scale-95 transition-transform border border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface text-[20px]">account_balance_wallet</span>
              <span className="font-headline font-bold text-on-surface uppercase tracking-wider text-[12px]">Cashout</span>
            </button>
          </div>
        </section>

        <section className="bg-surface-container-low rounded-[24px] p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            <h3 className="font-headline font-bold text-[15px]">About {id}</h3>
          </div>
          <p className="text-on-surface-variant leading-relaxed font-body text-[14px]">
            {isCngn ? (
              <>cNGN is a 1:1 naira-backed stablecoin issued by the <span className="font-semibold text-on-surface">WrappedCBDC consortium</span> on the Bantu Network.</>
            ) : (
              <>A decentralized asset running native on the Bantu Network, providing fast and feeless global transactions.</>
            )}
          </p>
          <div className="pt-4 flex items-center justify-between border-t border-outline-variant/20">
            <span className="text-[13px] font-semibold text-on-surface-variant">Official Website</span>
            <a className="text-primary font-headline font-bold flex items-center gap-1 hover:underline text-[13px]" href="https://bantupay.org">
              {isCngn ? 'wrappedcbdc.com' : 'bantupay.org'}
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        </section>

        <section className="space-y-6 pb-4">
          <div className="flex justify-between items-end">
            <h3 className="font-headline font-extrabold text-[22px] tracking-tight text-on-surface">Recent Activity</h3>
            <button className="text-primary font-headline font-bold text-[13px]">View All</button>
          </div>
          <div className="space-y-3">
            {/* Generic transactions matching screen mockups */}
            <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 group hover:shadow-md transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">call_received</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-on-surface text-[14px]">Received {id}</h4>
                  <p className="text-[12px] text-on-surface-variant font-mono">From: BNT...9z4x</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-headline font-extrabold text-on-surface text-[15px]">+50,000.00</p>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-0.5">SUCCESS</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 hover:shadow-md transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-[#FC690A] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">sync_alt</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-on-surface text-[14px]">Swap: {id} to XBN</h4>
                  <p className="text-[12px] text-on-surface-variant font-mono">Bantu DEX</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-headline font-extrabold text-on-surface text-[15px]">-1,200.00</p>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-0.5">SUCCESS</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border-l-4 border-l-tertiary-container shadow-sm active:scale-[0.98] transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tertiary-container/20 text-tertiary-container rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-on-surface text-[14px]">Cashout Pending</h4>
                  <p className="text-[12px] text-on-surface-variant font-mono truncate max-w-[120px]">To: Bank Transfer</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-headline font-extrabold text-on-surface text-[15px]">-15,000.00</p>
                <p className="text-[10px] uppercase tracking-[0.1em] text-tertiary-container font-bold mt-0.5">PENDING</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
