import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FC690A',
          dark:    '#D4560A',
          light:   '#FF8A3D',
          wash:    '#FFF3EC',
        },
        // Kinetic Surface Tiers
        surface: {
          DEFAULT: 'var(--surface)',
          container: {
            lowest:  'var(--surface-container-lowest)',
            low:     'var(--surface-container-low)',
            DEFAULT: 'var(--surface-container)',
            high:    'var(--surface-container-high)',
            highest: 'var(--surface-container-highest)',
          },
          variant: 'var(--surface-variant)',
        },
        bg: {
          base:    'var(--bg-base)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary:  'var(--text-tertiary)',
          'on-brand': '#FFFFFF',
        },
        semantic: {
          success:        '#16A34A',
          'success-wash': '#F0FDF4',
          warning:        '#D97706',
          'warning-wash': '#FFFBEB',
          error:          '#DC2626',
          'error-wash':   '#FEF2F2',
          info:           '#2563EB',
          'info-wash':    '#EFF6FF',
        },
        border: {
          DEFAULT: 'var(--border)',
          focus:   '#FC690A',
        },
      },
      fontFamily: {
        display: ['var(--font-jakarta)', 'sans-serif'],
        body:    ['var(--font-inter)', 'sans-serif'],
        label:   ['var(--font-inter)', 'sans-serif'],
        mono:    ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        xs:   '4px',
        sm:   '8px',
        md:   '12px',
        lg:   '16px',
        xl:   '24px',
        '2xl':'32px',
        full: '9999px',
      },
      boxShadow: {
        brand: '0 24px 48px -12px rgba(252, 105, 10, 0.35)',
        card:  '0 2px 8px rgba(0,0,0,0.06)',
        md:    '0 4px 16px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
        lg:    '0 8px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
