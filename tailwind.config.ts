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
        bg: {
          base:       '#F5F6FA',
          surface:    '#FFFFFF',
          surface2:   '#F0F1F5',
          'base-dark':     '#0F0F12',
          'surface-dark':  '#1A1A20',
          'surface2-dark': '#24242C',
        },
        text: {
          primary:   '#0F0F0F',
          secondary: '#6B7080',
          tertiary:  '#A0A8B8',
          'on-brand': '#FFFFFF',
          'primary-dark':   '#F5F5F5',
          'secondary-dark': '#9BA3B4',
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
          DEFAULT: '#E8EAF0',
          focus:   '#FC690A',
          dark:    '#2A2A35',
        },
        surface: {
          dark:  '#1A1A20',
          dark2: '#24242C',
        },
      },
      fontFamily: {
        display: ['var(--font-jakarta)', 'sans-serif'],
        body:    ['var(--font-inter)', 'sans-serif'],
        mono:    ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        xs:   '4px',
        sm:   '8px',
        md:   '12px',
        lg:   '16px',
        xl:   '24px',
        '2xl':'32px',
      },
      boxShadow: {
        brand: '0 4px 20px rgba(252,105,10,0.30), 0 2px 8px rgba(252,105,10,0.15)',
        card:  '0 2px 8px rgba(0,0,0,0.06)',
        md:    '0 4px 16px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
        lg:    '0 8px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
