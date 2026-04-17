export type UserMode = 'personal' | 'merchant' | 'crypto'
export type KYCTier = 0 | 1 | 2 | 3

export type UserPersona = {
  id: string
  name: string
  phone: string
  email?: string
  handle: string
  mode: UserMode
  kycTier: KYCTier
  kycLevel: KYCTier
  totalBalance: number
  label: string
  description: string
  avatar?: string
  walletAddress: string
  address: string
  pin: string
}

export const MOCK_PERSONAS: UserPersona[] = [
  {
    id: 'amara',
    name: 'Amara Osei',
    phone: '+234 801 234 5678',
    email: 'amara@example.com',
    handle: '@amara',
    mode: 'personal',
    kycTier: 1,
    kycLevel: 1,
    totalBalance: 46565.00,
    label: 'Amara — Everyday User',
    description: 'Nurse in Lagos. Receives salary in cNGN, sends to family.',
    walletAddress: 'GDEMO_AMARA_3K7F2A',
    address: 'GDEMO_AMARA_3K7F2A',
    pin: '123456',
  },
  {
    id: 'chidi',
    name: 'Chidi Okonkwo',
    phone: '+234 803 456 7890',
    email: 'chidi@example.com',
    handle: '@chidi',
    mode: 'merchant',
    kycTier: 2,
    kycLevel: 2,
    totalBalance: 182400.00,
    label: 'Chidi — Merchant',
    description: 'Hardware store in Onitsha. Accepts cNGN via QR.',
    walletAddress: 'GDEMO_CHIDI_9A2B4C',
    address: 'GDEMO_CHIDI_9A2B4C',
    pin: '123456',
  },
  {
    id: 'yusuf',
    name: 'Yusuf Abdullahi',
    phone: '+234 809 876 5432',
    email: 'yusuf@example.com',
    handle: '@yusuf',
    mode: 'crypto',
    kycTier: 2,
    kycLevel: 2,
    totalBalance: 534200.00,
    label: 'Yusuf — DeFi Explorer',
    description: 'Freelance dev in Abuja. Earns USDC, swaps to cNGN.',
    walletAddress: 'GDEMO_YUSUF_7C1D8E',
    address: 'GDEMO_YUSUF_7C1D8E',
    pin: '123456',
  },
  {
    id: 'ngozi',
    name: 'Ngozi Obi',
    phone: '+44 7700 123456',
    email: 'ngozi@example.com',
    handle: '@ngozi',
    mode: 'personal',
    kycTier: 2,
    kycLevel: 2,
    totalBalance: 1250000.00,
    label: 'Ngozi — Diaspora Sender',
    description: 'Based in London. Sends GBP → cNGN monthly to family.',
    walletAddress: 'GDEMO_NGOZI_5E8F1B',
    address: 'GDEMO_NGOZI_5E8F1B',
    pin: '123456',
  },
]

export const DEFAULT_PERSONA = MOCK_PERSONAS[0]
