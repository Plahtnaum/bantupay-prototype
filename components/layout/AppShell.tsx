'use client'
import { BottomNav } from './BottomNav'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { useUserStore } from '@/store/user.store'
import { useEffect } from 'react'

interface AppShellProps {
  children: React.ReactNode
  hideNav?: boolean
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  const { darkMode } = useUserStore()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-bg-base transition-colors duration-300 flex flex-col">
      <ToastContainer />
      <main className={`flex-1 ${hideNav ? '' : 'pb-[90px]'}`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
