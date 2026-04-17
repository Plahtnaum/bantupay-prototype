'use client'
import { useState } from 'react'
import { useWalletStore } from '@/store/wallet.store'
import { Transaction } from '@/mock/transactions'
import { generateMockTxHash } from '@/lib/formatting'
import { haptics } from '@/lib/haptics'

type Status = 'idle' | 'processing' | 'confirmed' | 'failed'

export function useMockTransaction() {
  const [status, setStatus] = useState<Status>('idle')
  const { addTransaction, updateBalance } = useWalletStore()

  const execute = async (params: {
    type: Transaction['type']
    asset: string
    amount: number
    toAsset?: string
    toAmount?: number
    counterparty: Transaction['counterparty']
    fiatValue?: number
    memo?: string
  }): Promise<boolean> => {
    setStatus('processing')

    await new Promise((r) => setTimeout(r, 800))

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      type: params.type,
      asset: params.asset,
      toAsset: params.toAsset,
      amount: params.amount,
      toAmount: params.toAmount,
      fiatValue: params.fiatValue ?? params.amount,
      counterparty: params.counterparty,
      memo: params.memo ?? '',
      status: 'confirmed',
      timestamp: new Date(),
      txHash: generateMockTxHash(),
      fee: 0.001,
    }

    addTransaction(tx)

    if (params.type === 'send') {
      updateBalance(params.asset, -params.amount)
    } else if (params.type === 'receive' || params.type === 'onramp') {
      updateBalance(params.asset, params.amount)
    } else if (params.type === 'swap' && params.toAsset && params.toAmount) {
      updateBalance(params.asset, -params.amount)
      updateBalance(params.toAsset, params.toAmount)
    }

    setStatus('confirmed')
    haptics.success()
    return true
  }

  return { status, execute, isProcessing: status === 'processing' }
}
