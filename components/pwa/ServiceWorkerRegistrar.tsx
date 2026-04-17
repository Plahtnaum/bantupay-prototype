'use client'
import { useEffect } from 'react'

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => {
        // Check for updates every time the app gains focus
        const checkUpdate = () => reg.update()
        window.addEventListener('focus', checkUpdate)

        // If a new SW is waiting, reload to activate it
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (!newWorker) return
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Dispatch custom event so UpdateBanner can show
              window.dispatchEvent(new CustomEvent('sw-update-available'))
            }
          })
        })

        return () => window.removeEventListener('focus', checkUpdate)
      })
      .catch(() => {/* SW registration failed silently */})
  }, [])

  return null
}
