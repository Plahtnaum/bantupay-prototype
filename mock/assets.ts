export type Asset = {
  id: string
  symbol: string
  name: string
  balance: number
  fiatValue: number
  fiatSymbol: string
  change24h: number
  issuer: string
  color: string
  iconBg: string
  iconText: string
}

export const MOCK_ASSETS: Asset[] = [
  {
    id: 'xbn',
    symbol: 'XBN',
    name: 'Bantu Token',
    balance: 12450.00,
    fiatValue: 1245.00,
    fiatSymbol: '₦',
    change24h: +3.2,
    issuer: 'native',
    color: '#FC690A',
    iconBg: '#FFF3EC',
    iconText: 'X',
  },
  {
    id: 'cngn',
    symbol: 'cNGN',
    name: 'Digital Naira',
    balance: 45320.00,
    fiatValue: 45320.00,
    fiatSymbol: '₦',
    change24h: 0.00,
    issuer: 'GCNGN7F3BISSUER',
    color: '#7C3AED',
    iconBg: '#EDE9FE',
    iconText: '₦',
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    balance: 250.00,
    fiatValue: 375000.00,
    fiatSymbol: '₦',
    change24h: 0.00,
    issuer: 'GCUSDCISSUER',
    color: '#2563EB',
    iconBg: '#EFF6FF',
    iconText: '$',
  },
  {
    id: 'bnr',
    symbol: 'BNR',
    name: 'Bantu Reserve',
    balance: 5000.00,
    fiatValue: 500.00,
    fiatSymbol: '₦',
    change24h: +1.8,
    issuer: 'GCBNRISSUER',
    color: '#FC690A',
    iconBg: '#FFF3EC',
    iconText: 'B',
  },
]

export const MOCK_RATES = {
  XBN_NGN:  0.10,
  USDC_NGN: 1500.00,
  cNGN_NGN: 1.00,
  XBN_USDC: 0.000067,
}

export const CURATED_ASSETS = ['XBN', 'cNGN', 'USDC', 'BNR']
