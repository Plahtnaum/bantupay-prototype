export function formatCrypto(amount: number, symbol: string): string {
  const formatted = amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${formatted} ${symbol}`
}

export function formatFiat(amount: number, symbol = '₦'): string {
  const formatted = amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${symbol}${formatted}`
}

export function formatAmount(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return amount.toLocaleString('en-NG', { maximumFractionDigits: 2 })
  return amount.toFixed(2)
}

export function formatAddress(address: string, chars = 6): string {
  if (address.length <= chars * 2) return address
  return `${address.slice(0, chars)}...${address.slice(-6)}`
}

export function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 172800) return 'Yesterday'
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
}

export function formatFee(): string {
  return '< ₦0.01'
}

export function formatTxHash(hash: string): string {
  if (hash.length <= 16) return hash
  return `${hash.slice(0, 10)}...${hash.slice(-4)}`
}

export function randomHex(length: number): string {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 16).toString(16).toUpperCase()
  ).join('')
}

export function generateMockTxHash(): string {
  return `BANTU${randomHex(8)}...${randomHex(4)}`
}

export function generateMockAccountNumber(): string {
  return `5200${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
}
