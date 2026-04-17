export type TxType = 'receive' | 'send' | 'swap' | 'onramp' | 'offramp' | 'claim'
export type TxStatus = 'confirmed' | 'pending' | 'failed'

export type Transaction = {
  id: string
  type: TxType
  asset: string
  toAsset?: string
  amount: number
  toAmount?: number
  fiatValue: number
  counterparty: string
  memo: string
  status: TxStatus
  timestamp: Date
  txHash: string
  fee: number
}

const now = Date.now()
const min = 60 * 1000
const hr = 60 * min

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_001',
    type: 'receive',
    asset: 'cNGN',
    amount: 5000,
    fiatValue: 5000,
    counterparty: 'Chidi Okonkwo',
    memo: 'Rent — April',
    status: 'confirmed',
    timestamp: new Date(now - 12 * min),
    txHash: 'BANTU7F3A9D2E...D91C',
    fee: 0.001,
  },
  {
    id: 'tx_002',
    type: 'send',
    asset: 'cNGN',
    amount: 2500,
    fiatValue: 2500,
    counterparty: 'Ngozi Obi',
    memo: 'Airtime',
    status: 'confirmed',
    timestamp: new Date(now - 3 * hr),
    txHash: 'BANTU8E2BA04F...A04F',
    fee: 0.001,
  },
  {
    id: 'tx_003',
    type: 'swap',
    asset: 'XBN',
    toAsset: 'cNGN',
    amount: 10000,
    toAmount: 1000,
    fiatValue: 1000,
    counterparty: 'Bantu DEX',
    memo: '',
    status: 'confirmed',
    timestamp: new Date(now - 24 * hr),
    txHash: 'BANTUA91DB37E...B37E',
    fee: 0.001,
  },
  {
    id: 'tx_004',
    type: 'onramp',
    asset: 'cNGN',
    amount: 20000,
    fiatValue: 20000,
    counterparty: 'Bank Transfer',
    memo: 'Via Flutterwave',
    status: 'confirmed',
    timestamp: new Date(now - 48 * hr),
    txHash: 'BANTU3C6AF12D...F12D',
    fee: 0,
  },
  {
    id: 'tx_005',
    type: 'receive',
    asset: 'XBN',
    amount: 50000,
    fiatValue: 5000,
    counterparty: 'Emeka Nwosu',
    memo: 'Event airdrop — Lagos Web3 Summit',
    status: 'confirmed',
    timestamp: new Date(now - 72 * hr),
    txHash: 'BANTUF2A1C88B...C88B',
    fee: 0,
  },
  {
    id: 'tx_006',
    type: 'send',
    asset: 'cNGN',
    amount: 750,
    fiatValue: 750,
    counterparty: 'Mama',
    memo: '',
    status: 'pending',
    timestamp: new Date(now - 2 * min),
    txHash: 'BANTU...(pending)',
    fee: 0.001,
  },
  {
    id: 'tx_007',
    type: 'receive',
    asset: 'cNGN',
    amount: 12000,
    fiatValue: 12000,
    counterparty: 'Adaeze Eze',
    memo: 'School fees contribution',
    status: 'confirmed',
    timestamp: new Date(now - 96 * hr),
    txHash: 'BANTUE4D2F891...F891',
    fee: 0.001,
  },
  {
    id: 'tx_008',
    type: 'send',
    asset: 'cNGN',
    amount: 8500,
    fiatValue: 8500,
    counterparty: 'Tunde Bakare',
    memo: 'Freelance payment',
    status: 'confirmed',
    timestamp: new Date(now - 5 * 24 * hr),
    txHash: 'BANTU1A3BC44D...C44D',
    fee: 0.001,
  },
  {
    id: 'tx_009',
    type: 'swap',
    asset: 'USDC',
    toAsset: 'cNGN',
    amount: 100,
    toAmount: 149850,
    fiatValue: 149850,
    counterparty: 'Bantu DEX',
    memo: '',
    status: 'confirmed',
    timestamp: new Date(now - 7 * 24 * hr),
    txHash: 'BANTUB9C7D22E...D22E',
    fee: 0.001,
  },
  {
    id: 'tx_010',
    type: 'send',
    asset: 'cNGN',
    amount: 350,
    fiatValue: 350,
    counterparty: 'Fatima Musa',
    memo: 'Ajo contribution',
    status: 'failed',
    timestamp: new Date(now - 8 * 24 * hr),
    txHash: 'BANTUF3A1...(failed)',
    fee: 0,
  },
]
