'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { haptics } from '@/lib/haptics'

type NetworkToken = {
  symbol: string
  name: string
  issuer: string
  iconText: string
  iconBg: string
  color: string
  verified: boolean
  description: string
}

const NETWORK_TOKENS: NetworkToken[] = [
  { symbol: 'cNGN',  name: 'Digital Naira',       issuer: 'GCNGN7F3BISSUER',   iconText: '₦',  iconBg: '#EDE9FE', color: '#7C3AED', verified: true,  description: '1:1 naira-backed stablecoin by WrappedCBDC' },
  { symbol: 'XBN',   name: 'Bantu Token',          issuer: 'native',             iconText: 'X',  iconBg: '#FFF3EC', color: '#FC690A', verified: true,  description: 'Native token of the Bantu Network' },
  { symbol: 'USDC',  name: 'USD Coin',             issuer: 'GCUSDCISSUER',       iconText: '$',  iconBg: '#EFF6FF', color: '#2563EB', verified: true,  description: 'USD-backed stablecoin by Circle' },
  { symbol: 'BNR',   name: 'Bantu Reserve',        issuer: 'GCBNRISSUER',        iconText: 'B',  iconBg: '#FFF3EC', color: '#FC690A', verified: true,  description: 'Reserve token for Bantu ecosystem' },
  { symbol: 'WBTC',  name: 'Wrapped Bitcoin',      issuer: 'GCWBTCISSUER9A2B',   iconText: '₿',  iconBg: '#FEF3C7', color: '#D97706', verified: true,  description: 'Tokenised Bitcoin on Bantu Network' },
  { symbol: 'WETH',  name: 'Wrapped Ethereum',     issuer: 'GCWETHISSUER5C1D',   iconText: 'Ξ',  iconBg: '#F0F4FF', color: '#6366F1', verified: true,  description: 'Tokenised Ethereum on Bantu Network' },
  { symbol: 'cGHS',  name: 'Digital Cedi',         issuer: 'GCGHSISSUER7D3E',    iconText: '₵',  iconBg: '#F0FDF4', color: '#16A34A', verified: false, description: 'Ghana cedi-backed stablecoin (beta)' },
  { symbol: 'cKES',  name: 'Digital Shilling',     issuer: 'GCKESSISSUER2F4A',   iconText: 'K',  iconBg: '#FEF9C3', color: '#CA8A04', verified: false, description: 'Kenya shilling-backed stablecoin (beta)' },
]

export default function AddTokenPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [manualMode, setManualMode] = useState(false)
  const [trustline, setTrustline] = useState('')
  const [added, setAdded] = useState<string[]>([])

  const filtered = NETWORK_TOKENS.filter(t =>
    t.symbol.toLowerCase().includes(search.toLowerCase()) ||
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.issuer.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = (symbol: string) => {
    haptics.success()
    setAdded(prev => [...prev, symbol])
  }

  const handleManualAdd = () => {
    if (!trustline.trim()) return
    haptics.success()
    setTrustline('')
    setManualMode(false)
  }

  return (
    <div className="bg-background min-h-screen text-on-background w-full max-w-[430px] mx-auto pb-32">
      <header className="px-6 pt-12 pb-4 flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur-xl z-30">
        <button onClick={() => { haptics.light(); router.back() }} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="font-headline font-bold text-[22px] text-on-surface leading-tight">Add Token</h1>
          <p className="font-body text-[12px] text-on-surface-variant">Search or enter a trustline address</p>
        </div>
      </header>

      <main className="px-6 space-y-6">
        {/* Search bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, symbol or issuer…"
            className="w-full h-12 bg-surface-container-low rounded-2xl border border-outline-variant/30 pl-11 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body text-[14px] text-on-surface transition-all"
          />
        </div>

        {/* Manual trustline entry */}
        <div className="bg-surface rounded-[20px] border border-outline-variant/10 overflow-hidden shadow-sm">
          <button
            onClick={() => { haptics.light(); setManualMode(o => !o) }}
            className="w-full flex items-center gap-4 px-4 py-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">link</span>
            </div>
            <div className="flex-1 text-left">
              <p className="font-headline font-semibold text-[15px] text-on-surface">Add by Trustline / Contract</p>
              <p className="font-body text-[12px] text-on-surface-variant">Paste a Bantu Network asset issuer address</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant/40 text-[20px]">{manualMode ? 'expand_less' : 'expand_more'}</span>
          </button>
          {manualMode && (
            <div className="px-4 pb-4 space-y-3 border-t border-outline-variant/10">
              <input
                type="text"
                value={trustline}
                onChange={e => setTrustline(e.target.value)}
                placeholder="G… issuer address or CODE:ISSUER"
                className="w-full h-12 bg-surface-container-low rounded-xl border border-outline-variant/30 px-4 outline-none focus:border-primary font-mono text-[13px] text-on-surface transition-all mt-3"
                autoFocus
              />
              <button
                onClick={handleManualAdd}
                disabled={!trustline.trim()}
                className="w-full h-12 bg-gradient-to-br from-[#FC690A] to-[#D4560A] text-white font-headline font-bold text-[14px] rounded-xl disabled:opacity-40 active:scale-95 transition-transform"
              >
                Add Trustline
              </button>
            </div>
          )}
        </div>

        {/* Network token list */}
        <div>
          <h3 className="font-label font-bold text-[11px] text-on-surface-variant tracking-widest uppercase mb-3 px-1">
            {search ? `Results for "${search}"` : 'On the Bantu Network'}
          </h3>
          {filtered.length === 0 ? (
            <div className="py-12 text-center bg-surface rounded-[20px] border border-outline-variant/10">
              <span className="material-symbols-outlined text-[40px] text-on-surface-variant/40 block mb-2">search_off</span>
              <p className="font-body text-[14px] text-on-surface-variant">No tokens match your search.</p>
              <p className="font-body text-[12px] text-on-surface-variant/60 mt-1">Try adding by trustline address above.</p>
            </div>
          ) : (
            <div className="bg-surface rounded-[24px] overflow-hidden shadow-sm border border-outline-variant/10">
              {filtered.map((token, idx) => {
                const isAdded = added.includes(token.symbol)
                return (
                  <div
                    key={token.symbol}
                    className={`flex items-center gap-4 px-4 py-4 ${idx < filtered.length - 1 ? 'border-b border-outline-variant/5' : ''}`}
                  >
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-headline font-bold text-[15px] flex-shrink-0" style={{ backgroundColor: token.iconBg, color: token.color }}>
                      {token.iconText}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-headline font-bold text-[15px] text-on-surface">{token.symbol}</p>
                        {token.verified && <span className="material-symbols-outlined text-primary text-[14px]">verified</span>}
                      </div>
                      <p className="font-body text-[12px] text-on-surface-variant truncate">{token.name}</p>
                    </div>
                    <button
                      onClick={() => handleAdd(token.symbol)}
                      disabled={isAdded}
                      className={`flex-shrink-0 h-9 px-4 rounded-full font-label font-bold text-[12px] transition-all active:scale-95 ${
                        isAdded
                          ? 'bg-primary/10 text-primary'
                          : 'bg-primary text-white shadow-sm'
                      }`}
                    >
                      {isAdded ? '✓ Added' : '+ Add'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
