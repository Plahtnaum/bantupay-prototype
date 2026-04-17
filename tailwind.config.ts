import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Exact tokens from Stitch design files
        'primary':                    '#a23f00',
        'primary-container':          '#fc690a',
        'on-primary':                 '#ffffff',
        'on-primary-container':       '#551e00',
        'primary-fixed':              '#ffdbcc',
        'primary-fixed-dim':          '#ffb695',
        'on-primary-fixed':           '#351000',
        'on-primary-fixed-variant':   '#7b2f00',

        'secondary':                  '#964921',
        'secondary-container':        '#fd9a6c',
        'on-secondary':               '#ffffff',
        'on-secondary-container':     '#753009',
        'secondary-fixed':            '#ffdbcc',
        'secondary-fixed-dim':        '#ffb695',
        'on-secondary-fixed':         '#351000',
        'on-secondary-fixed-variant': '#77320b',

        'tertiary':                   '#0062a1',
        'tertiary-container':         '#009cfc',
        'on-tertiary':                '#ffffff',
        'on-tertiary-container':      '#003155',
        'tertiary-fixed':             '#d0e4ff',
        'tertiary-fixed-dim':         '#9ccaff',
        'on-tertiary-fixed':          '#001d35',
        'on-tertiary-fixed-variant':  '#00497b',

        'surface':                    '#f8f9fd',
        'surface-dim':                '#d9dade',
        'surface-bright':             '#f8f9fd',
        'surface-container-lowest':   '#ffffff',
        'surface-container-low':      '#f2f3f7',
        'surface-container':          '#edeef2',
        'surface-container-high':     '#e7e8ec',
        'surface-container-highest':  '#e1e2e6',
        'surface-variant':            '#e1e2e6',
        'surface-tint':               '#a23f00',

        'on-surface':                 '#191c1f',
        'on-surface-variant':         '#5a4137',

        'background':                 '#f8f9fd',
        'on-background':              '#191c1f',

        'outline':                    '#8e7165',
        'outline-variant':            '#e2bfb1',

        'error':                      '#ba1a1a',
        'error-container':            '#ffdad6',
        'on-error':                   '#ffffff',
        'on-error-container':         '#93000a',

        'inverse-surface':            '#2e3134',
        'inverse-on-surface':         '#eff1f5',
        'inverse-primary':            '#ffb695',

        // Brand alias
        'brand': '#fc690a',
      },
      fontFamily: {
        headline: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
        body:     ['var(--font-inter)', 'Inter', 'sans-serif'],
        label:    ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono:     ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
        display:  ['var(--font-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg:      '2rem',
        xl:      '3rem',
        full:    '9999px',
        sm:      '0.5rem',
        md:      '0.75rem',
      },
      boxShadow: {
        brand: '0 24px 48px -12px rgba(252, 105, 10, 0.35)',
        card:  '0 2px 8px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}

export default config
