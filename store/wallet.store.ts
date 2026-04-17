'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_ASSETS, Asset } from '@/mock/assets'
import { MOCK_TRANSACTIONS, Transaction } from '@/mock/transactions'

type WalletState = {
  assets: Asset[]
  transactions: Transaction[]
  balanceHidden: boolean
  addTransaction: (tx: Transaction) => void
  updateBalance: (assetId: string, delta: number) => void
  toggleBalanceHidden: () => void
  resetToDefaults: () => void
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      assets: MOCK_ASSETS,
      transactions: MOCK_TRANSACTIONS,
      balanceHidden: false,

      addTransaction: (tx) =>
        set((s) => ({ transactions: [tx, ...s.transactions] })),

      updateBalance: (assetId, delta) =>
        set((s) => ({
          assets: s.assets.map(a =>
            a.id === assetId
              ? { ...a, balance: Math.max(0, a.balance + delta), fiatValue: Math.max(0, a.fiatValue + delta) }
              : a
          ),
        })),

      toggleBalanceHidden: () =>
        set((s) => ({ balanceHidden: !s.balanceHidden })),

      resetToDefaults: () =>
        set({ assets: MOCK_ASSETS, transactions: MOCK_TRANSACTIONS }),
    }),
    { name: 'bantupay-wallet' }
  )
)
