'use client'
import { motion } from 'framer-motion'
import { Backspace } from 'phosphor-react'
import { haptics } from '@/lib/haptics'

interface NumPadProps {
  onPress: (val: string) => void
  onDelete: () => void
  onBiometric?: () => void
  showBiometric?: boolean
  disabled?: boolean
}

const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫']

export function NumPad({ onPress, onDelete, onBiometric, showBiometric = false, disabled = false }: NumPadProps) {
  const handle = (key: string) => {
    if (disabled) return
    if (key === '⌫') { haptics.light(); onDelete(); return }
    if (key === '') { if (showBiometric && onBiometric) { haptics.light(); onBiometric() } return }
    haptics.light()
    onPress(key)
  }

  return (
    <div className="grid grid-cols-3 gap-y-1 px-6">
      {keys.map((key, i) => (
        <div key={i} className="flex items-center justify-center">
          {key === '' ? (
            showBiometric ? (
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => handle('')}
                disabled={disabled}
                className="w-16 h-16 rounded-full flex items-center justify-center text-[#0F0F0F] active:bg-[#F0F1F5] transition-colors"
              >
                <span className="text-2xl">⠿</span>
              </motion.button>
            ) : <div className="w-16 h-16" />
          ) : key === '⌫' ? (
            <motion.button
              whileTap={{ scale: 0.88 }}
              onTouchStart={() => handle('⌫')}
              onClick={() => handle('⌫')}
              disabled={disabled}
              className="w-16 h-16 rounded-full flex items-center justify-center text-[#0F0F0F] active:bg-[#F0F1F5] transition-colors"
            >
              <Backspace size={24} weight="regular" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.88, backgroundColor: '#F0F1F5' }}
              onClick={() => handle(key)}
              disabled={disabled}
              className="w-16 h-16 rounded-full flex items-center justify-center text-[#0F0F0F] transition-colors"
            >
              <span className="text-2xl font-medium font-[family-name:var(--font-inter)]">{key}</span>
            </motion.button>
          )}
        </div>
      ))}
    </div>
  )
}
