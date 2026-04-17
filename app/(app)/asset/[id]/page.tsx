'use client'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { haptics } from '@/lib/haptics'
import { useWalletStore } from '@/store/wallet.store'
import { format } from 'date-fns'

function formatRelative(d: Date) {
  const ms = Date.now() - d.getTime();
  const min = Math.floor(ms / 60000);
  if (min < 60) return `${min || 1} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  return `${Math.floor(hr / 24)} days ago`;
}

export default function AssetDetailsPage() {
  const router = useRouter()
  const { id } = useParams()
  const { assets, transactions } = useWalletStore()
  
  const asset = assets.find(a => a.id === id) || assets.find(a => a.symbol === id)
  const isCngn = id === 'cNGN' || asset?.symbol === 'cNGN'

  if (!asset) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-on-surface mb-2">Asset not found</h1>
        <button onClick={() => router.back()} className="text-primary font-bold">Back to wallet</button>
      </div>
    )
  }

  const assetTransactions = transactions.filter(tx => tx.asset === asset.symbol || tx.toAsset === asset.symbol)

  return (
    <div className="bg-background text-on-background font-body min-h-screen pb-32 w-full max-w-[430px] mx-auto">
      <header className="fixed top-0 w-full max-w-[430px] z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <button onClick={() => { haptics.light(); router.push('/wallet') }} className="text-on-surface hover:bg-surface-container-low p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline font-bold tracking-tight text-lg text-on-surface">Asset Details</h1>
        </div>
        <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>

      <main className="pt-24 px-6 space-y-8">
        <motion.section 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[32px] p-8 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white shadow-xl shadow-[#FC690A]/20"
        >
          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl font-bold">{asset.iconText}</span>
            </div>
            <div className="space-y-1">
              <div className="flex flex-col items-center gap-1">
                <h2 className="font-headline font-extrabold text-[40px] tracking-tighter leading-none">{asset.balance.toLocaleString()}</h2>
                <span className="font-headline font-bold text-lg opacity-80">{asset.symbol}</span>
              </div>
              <p className="font-mono text-white/90 text-[15px] mt-2">≈ {asset.fiatSymbol}{asset.fiatValue.toLocaleString()}</p>
            </div>
          </div>
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
        </motion.section>

        {/* Action Strip matches Home/Wallet */}
        <section className="grid grid-cols-4 gap-2">
            {[
              { label: 'Send', icon: 'arrow_upward', bg: 'bg-primary/10', color: 'text-primary', onClick: () => router.push(`/send?asset=${asset.symbol}`) },
              { label: 'Receive', icon: 'arrow_downward', bg: 'bg-[#16A34A]/10', color: 'text-[#16A34A]', onClick: () => router.push(`/receive?asset=${asset.symbol}`) },
              { label: 'Swap', icon: 'swap_horiz', bg: 'bg-[#2563EB]/10', color: 'text-[#2563EB]', onClick: () => router.push(`/swap?asset=${asset.symbol}`) },
              { label: 'History', icon: 'history', bg: 'bg-surface-container', color: 'text-on-surface-variant', onClick: () => router.push('/activity') },
            ].map(action => (
              <button key={action.label} onClick={() => { haptics.light(); action.onClick() }} className="flex flex-col items-center gap-2 group">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-90 ${action.bg} ${action.color}`}>
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'wght' 600" }}>{action.icon}</span>
                </div>
                <span className="font-label font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">{action.label}</span>
              </button>
            ))}
        </section>

        <section className="bg-surface rounded-[24px] p-6 space-y-4 border border-outline-variant/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
             <span className="material-symbols-outlined text-[64px]">token</span>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            <h3 className="font-headline font-bold text-[15px]">About {asset.name}</h3>
          </div>
          <p className="text-on-surface-variant leading-relaxed font-body text-[14px]">
            {isCngn ? (
              <>cNGN is a 1:1 naira-backed stablecoin issued by the <span className="font-semibold text-on-surface">WrappedCBDC consortium</span> on the Bantu Network.</>
            ) : (
              <>{asset.name} ({asset.symbol}) is a decentralized asset running native on the Bantu Network, providing fast and secure value transfer.</>
            )}
          </p>
          <div className="pt-4 flex items-center justify-between border-t border-outline-variant/10">
            <span className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest">Issuer</span>
            <span className="text-primary font-mono text-[11px] font-bold bg-primary-container/10 px-2 py-1 rounded-md">
                {asset.issuer.length > 20 ? `${asset.issuer.slice(0, 8)}...${asset.issuer.slice(-8)}` : asset.issuer}
            </span>
          </div>
        </section>

        <section className="space-y-6 pb-4">
          <div className="flex justify-between items-end">
            <h3 className="font-headline font-extrabold text-[22px] tracking-tight text-on-surface">Activity</h3>
            <button onClick={() => router.push('/activity')} className="text-primary font-headline font-bold text-[13px]">See all</button>
          </div>
          <div className="space-y-1">
            {assetTransactions.length === 0 ? (
                <div className="py-12 text-center bg-surface-container-low/30 rounded-2xl border border-dashed border-outline-variant/20">
                    <p className="text-on-surface-variant font-body text-[14px]">No transactions for this asset yet.</p>
                </div>
            ) : (
              assetTransactions.slice(0, 5).map((tx) => (
                <div key={tx.id} onClick={() => haptics.light()} className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant/10 group hover:bg-surface-container-lowest transition-all active:scale-[0.98] cursor-pointer shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'send' || tx.type === 'offramp' ? 'bg-[#FC690A]/10 text-[#FC690A]' : 'bg-[#16A34A]/10 text-[#16A34A]'}`}>
                      <span className="material-symbols-outlined text-[20px]">{tx.type === 'send' || tx.type === 'offramp' ? 'arrow_upward' : 'arrow_downward'}</span>
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-on-surface text-[14px] truncate max-w-[120px]">{tx.counterparty}</h4>
                      <p className="text-[12px] text-on-surface-variant font-medium">{formatRelative(new Date(tx.timestamp))}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-headline font-extrabold text-[15px] ${tx.type === 'send' || tx.type === 'offramp' ? 'text-on-surface' : 'text-[#16A34A]'}`}>
                        {tx.type === 'send' || tx.type === 'offramp' ? '-' : '+'}{tx.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-0.5">{tx.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
