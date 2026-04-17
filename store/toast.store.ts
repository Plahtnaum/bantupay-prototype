'use client'
import { create } from 'zustand'

type ToastType = 'success' | 'error' | 'info' | 'warning'

type Toast = {
  id: string
  message: string
  type: ToastType
}

type ToastState = {
  toasts: Toast[]
  show: (message: string, type?: ToastType) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  dismiss: (id: string) => void
}

let toastId = 0

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],

  show: (message, type = 'info') => {
    const id = String(++toastId)
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3000)
  },

  success: (message) => {
    const id = String(++toastId)
    set((s) => ({ toasts: [...s.toasts, { id, message, type: 'success' }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3000)
  },

  error: (message) => {
    const id = String(++toastId)
    set((s) => ({ toasts: [...s.toasts, { id, message, type: 'error' }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 4000)
  },

  info: (message) => {
    const id = String(++toastId)
    set((s) => ({ toasts: [...s.toasts, { id, message, type: 'info' }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3000)
  },

  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
