'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const root = window.document.documentElement
    
    // Load preference from local storage or default to light
    const savedTheme = localStorage.getItem('bantupay-theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      root.classList.remove('light', 'dark')
      root.classList.add(savedTheme)
    } else {
      root.classList.add('light')
    }
  }, [])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(newTheme)
      localStorage.setItem('bantupay-theme', newTheme)
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
