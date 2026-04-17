export type MockEvent = {
  token: string
  name: string
  date: string
  location: string
  reward: { asset: string; amount: number }
  organiser: string
  attendeeCount: number
}

export const MOCK_EVENTS: MockEvent[] = [
  {
    token: 'EVT_LAGOS_WEB3',
    name: 'Lagos Web3 Summit 2026',
    date: 'May 15, 2026',
    location: 'Eko Hotel, Lagos',
    reward: { asset: 'XBN', amount: 500 },
    organiser: 'BantuPay Community',
    attendeeCount: 247,
  },
  {
    token: 'EVT_ABUJA_FINTECH',
    name: 'Abuja Fintech Forum',
    date: 'June 3, 2026',
    location: 'ICC Abuja',
    reward: { asset: 'cNGN', amount: 100 },
    organiser: 'CBN Innovation Lab',
    attendeeCount: 89,
  },
]

export type QRScenario = {
  id: string
  type: 'payment' | 'event' | 'airdrop' | 'auth' | 'request'
  label: string
  description: string
  icon: string
  actionLabel: string
  successMessage: string
  data: string
}

export const MOCK_QR_SCENARIOS: QRScenario[] = [
  {
    id: 'payment-address',
    type: 'payment',
    label: 'Payment Address',
    description: 'Send to Chidi\'s BantuPay address',
    icon: '💸',
    actionLabel: 'Send Payment',
    successMessage: 'Opening send flow…',
    data: 'GBPAYMENT_ADDRESS_DEMO_7F3A',
  },
  {
    id: 'payment-request',
    type: 'request',
    label: 'Payment Request',
    description: '500 cNGN requested for Lunch by @chidi',
    icon: '📋',
    actionLabel: 'Pay ₦500',
    successMessage: 'Opening send flow…',
    data: 'bantupay://pay?to=chidi&amount=500&asset=cNGN&memo=Lunch',
  },
  {
    id: 'event-checkin',
    type: 'event',
    label: 'Event Check-In',
    description: 'Lagos Web3 Summit 2026 · Earn 500 XBN',
    icon: '🎪',
    actionLabel: 'Check In & Claim',
    successMessage: '🎉 Checked in! 500 XBN reward pending',
    data: 'bantupay://event?token=EVT_LAGOS_WEB3',
  },
  {
    id: 'airdrop',
    type: 'airdrop',
    label: 'Airdrop Claim',
    description: 'Genesis campaign · 500 XBN waiting for you',
    icon: '🪂',
    actionLabel: 'Claim 500 XBN',
    successMessage: '🎉 500 XBN claimed and credited!',
    data: 'bantupay://airdrop?campaign=genesis&amount=500&asset=XBN',
  },
  {
    id: 'web3-auth',
    type: 'auth',
    label: 'Web3 Sign-In',
    description: 'BantuDEX wants to verify your identity',
    icon: '🔐',
    actionLabel: 'Approve Sign-In',
    successMessage: 'Identity verified on BantuDEX',
    data: 'bantupay://auth?app=BantuDEX&url=bantudex.io&scope=view,sign',
  },
]
