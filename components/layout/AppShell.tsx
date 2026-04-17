'use client'
import { BottomNav } from './BottomNav'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface AppShellProps {
  children: React.ReactNode
  hideNav?: boolean
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <ToastContainer />
      <main className={`flex-1 ${hideNav ? '' : 'pb-[80px]'}`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
