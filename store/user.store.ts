'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_PERSONAS, UserPersona, DEFAULT_PERSONA } from '@/mock/users'

type UserState = {
  persona: UserPersona
  onboardingComplete: boolean
  darkMode: boolean
  setPersona: (p: UserPersona) => void
  completeOnboarding: () => void
  toggleDarkMode: () => void
  resetToDefaults: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      persona: DEFAULT_PERSONA,
      onboardingComplete: false,
      darkMode: false,

      setPersona: (p) => set({ persona: p }),

      completeOnboarding: () => set({ onboardingComplete: true }),

      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      resetToDefaults: () =>
        set({ persona: DEFAULT_PERSONA, onboardingComplete: false }),
    }),
    { name: 'bantupay-user' }
  )
)
