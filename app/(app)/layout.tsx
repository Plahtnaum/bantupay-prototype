import { AppShell } from '@/components/layout/AppShell'
import { DemoBar } from '@/components/demo/DemoBar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoBar />
      <div className="pt-8">
        <AppShell>{children}</AppShell>
      </div>
    </>
  )
}
