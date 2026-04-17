'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { haptics } from '@/lib/haptics'
import { formatDistanceToNow } from 'date-fns' // Note: I used my custom one in the other pages but I'll try to stick to native for reliability here

function formatRelative(d: Date) {
  const ms = Date.now() - d.getTime();
  const min = Math.floor(ms / 60000);
  if (min < 60) return `${min || 1} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  return `${Math.floor(hr / 24)} days ago`;
}

interface Notification {
    id: string
    type: 'payment_received' | 'payment_sent' | 'security' | 'promo' | 'airdrop'
    title: string
    body: string
    timestamp: Date
    unread: boolean
}

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: '1', type: 'payment_received', title: 'Payment Received', body: 'Chidi Okonkwo sent you 5,000 cNGN', timestamp: new Date(Date.now() - 1000 * 60 * 12), unread: true },
    { id: '2', type: 'security', title: 'New Login', body: 'Your account was accessed from a new device in Lagos.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), unread: true },
    { id: '3', type: 'airdrop', title: 'Airdrop Alert', body: 'You are eligible for the Bantu Genesis airdrop!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), unread: false },
    { id: '4', type: 'payment_sent', title: 'Payment Sent', body: 'Successfully sent 2,500 cNGN to Ngozi Obi', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), unread: false },
    { id: '5', type: 'promo', title: 'Referral Bonus', body: 'Invite 3 friends and earn 5,000 cNGN bonus.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), unread: false },
]

export function NotificationCenter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[340px] bg-surface z-[70] shadow-2xl flex flex-col border-l border-outline-variant/10"
          >
            <header className="px-6 pt-16 pb-4 flex justify-between items-center bg-surface/80 backdrop-blur-xl border-b border-outline-variant/5">
              <h2 className="font-headline font-bold text-[20px] text-on-surface">Notifications</h2>
              <button 
                onClick={() => { haptics.light(); onClose() }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto pb-10">
              {MOCK_NOTIFICATIONS.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`px-6 py-5 flex gap-4 transition-colors ${notif.unread ? 'bg-primary/5' : 'hover:bg-surface-container-lowest'}`}
                >
                  <NotificationIcon type={notif.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-headline text-[14px] truncate ${notif.unread ? 'font-bold text-on-surface' : 'font-semibold text-on-surface-variant'}`}>
                        {notif.title}
                      </h4>
                      {notif.unread && <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 flex-shrink-0 shadow-[0_0_8px_rgba(252,105,10,0.4)]" />}
                    </div>
                    <p className="font-body text-[13px] text-on-surface-variant leading-relaxed line-clamp-2">
                        {notif.body}
                    </p>
                    <span className="font-body text-[11px] text-on-surface-variant/60 font-medium mt-2 block">
                        {formatRelative(notif.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              
              <div className="mt-8 text-center px-6">
                <button className="text-primary font-label font-bold text-[13px] hover:underline">Mark all as read</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function NotificationIcon({ type }: { type: Notification['type'] }) {
    let icon = 'notifications'
    let bg = 'bg-surface-container'
    let color = 'text-on-surface-variant'

    switch (type) {
        case 'payment_received': 
            icon = 'arrow_downward'; bg = 'bg-[#16A34A]/10'; color = 'text-[#16A34A]'; break
        case 'payment_sent': 
            icon = 'arrow_upward'; bg = 'bg-[#FC690A]/10'; color = 'text-[#FC690A]'; break
        case 'security': 
            icon = 'shield_lock'; bg = 'bg-error-container/20'; color = 'text-error'; break
        case 'airdrop': 
            icon = 'redeem'; bg = 'bg-primary/10'; color = 'text-primary'; break
        case 'promo': 
            icon = 'campaign'; bg = 'bg-surface-container-high'; color = 'text-on-surface-variant'; break
    }

    return (
        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${bg} ${color}`}>
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 600" }}>{icon}</span>
        </div>
    )
}
