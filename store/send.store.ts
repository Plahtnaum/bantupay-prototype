'use client'
import { create } from 'zustand'
import { Asset } from '@/mock/assets'
import { Contact } from '@/mock/contacts'

type SendState = {
  asset: Asset | null
  amount: number
  recipient: Contact | null
  memo: string
  step: 'amount' | 'recipient' | 'confirm' | 'success'
  setAsset: (asset: Asset) => void
  setAmount: (amount: number) => void
  setRecipient: (contact: Contact) => void
  setMemo: (memo: string) => void
  reset: () => void
}

export const useSendStore = create<SendState>()((set) => ({
  asset: null,
  amount: 0,
  recipient: null,
  memo: '',
  step: 'amount',

  setAsset: (asset) => set({ asset }),
  setAmount: (amount) => set({ amount }),
  setRecipient: (recipient) => set({ recipient }),
  setMemo: (memo) => set({ memo }),
  reset: () => set({ asset: null, amount: 0, recipient: null, memo: '', step: 'amount' }),
}))
