import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ServiceWorkerRegistrar } from '@/components/pwa/ServiceWorkerRegistrar'
import { InstallPrompt } from '@/components/pwa/InstallPrompt'
import { UpdateBanner } from '@/components/pwa/UpdateBanner'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BantuPay — Pay anyone in Nigeria, instantly.',
  description: 'Send and receive cNGN in seconds. Free. No bank required.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BantuPay',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FC690A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* 
        The body serves as the "desktop background stage".
        We use flex justify-center to center the app. 
      */}
      <body className={`${jakarta.variable} ${inter.variable} ${jetbrains.variable} font-body antialiased bg-zinc-100 dark:bg-[#0F0F12] flex justify-center min-h-screen text-on-surface`}>
        <ThemeProvider>
          <ServiceWorkerRegistrar />
          <UpdateBanner />
          <div className="w-full max-w-[430px] min-h-[100dvh] bg-surface relative shadow-2xl overflow-x-hidden flex flex-col items-stretch">
            {children}
            <InstallPrompt />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
