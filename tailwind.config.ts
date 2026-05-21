import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: {
          light: {
            bg: '#FBF6FF',
            navBg: '#FDF8FF',
            flatPanel: '#FFFBFA',
            surface: '#F8F1FF',
            cardSelected: '#FCF8FF',
            primary: '#6B39D4',
            primaryHover: '#6D4AFF',
            primaryStrong: '#6B39D4',
            soft: '#CEC2FF',
            softAlt: '#DDCBFF',
            palettePeriwinkle: '#CEC2FF',
            palettePeriwinkleSoft: '#DDCBFF',
            paletteThistle: '#EBD3FF',
            paletteThistleSoft: '#E4C5EA',
            palettePinkOrchid: '#DCB6D5',
            paletteOldRose: '#CF8BA9',
            border: '#E7DAFA',
            borderHover: '#C9BCFF',
            text: '#241B35',
            body: '#645B77',
            bodyBorder: 'rgba(100, 91, 119, 0.3)',
            muted: '#827A93',
            danger: '#EF4444',
            critical: '#DC2626',
          },
          dark: {
            bg: '#22223B',
            surface: '#4A4E69',
            surfaceSoft: '#3B3D5C',
            muted: '#9A8C98',
            accent: '#C9ADA7',
            accentSoft: 'rgba(201, 173, 167, 0.14)',
            text: '#F2E9E4',
            border: 'rgba(242, 233, 228, 0.14)',
          },
        },
      },
      fontFamily: {
        sans: ['Avenir Next', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Avenir Next', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['SFMono-Regular', 'Consolas', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.25rem',
        card: '1.875rem',
        panel: '1.75rem',
        timer: '1.375rem',
        tile: '1.25rem',
      },
      boxShadow: {
        glass: '0 22px 60px -28px rgba(111, 86, 220, 0.34), 0 10px 22px -18px rgba(207, 139, 169, 0.18)',
        'glass-deep':
          '0 24px 56px -30px rgba(36, 27, 53, 0.28), 0 12px 26px -18px rgba(100, 91, 119, 0.2)',
        'glass-strong':
          '0 26px 80px -30px rgba(111, 86, 220, 0.42), 0 16px 40px -22px rgba(207, 139, 169, 0.24)',
        'glass-strong-deep':
          '0 30px 84px -34px rgba(36, 27, 53, 0.34), 0 18px 38px -22px rgba(100, 91, 119, 0.22)',
        'glass-dark':
          '0 30px 70px -32px rgba(10, 10, 20, 0.88), 0 10px 26px -20px rgba(201, 173, 167, 0.18)',
        panel: '0 18px 38px -24px rgba(58, 43, 102, 0.22)',
        'panel-hover': '0 24px 48px -24px rgba(122, 99, 245, 0.16)',
      },
      backdropBlur: {
        glass: '22px',
        shimmer: '28px',
      },
      blur: {
        orb: '140px',
        'orb-strong': '150px',
      },
      fontSize: {
        'mobile-label': ['13px', { lineHeight: '1.5rem' }],
        'mobile-value': ['15px', { lineHeight: '1.5rem' }],
        xxs: ['11px', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        caps: '0.16em',
        'caps-wide': '0.18em',
        'caps-widest': '0.2em',
      },
      backgroundImage: {
        'dark-glow':
          'radial-gradient(circle at 12% 18%, rgba(201, 173, 167, 0.16), transparent 28%), radial-gradient(circle at 78% 20%, rgba(74, 78, 105, 0.46), transparent 34%), radial-gradient(circle at 65% 72%, rgba(43, 43, 71, 0.48), transparent 36%), linear-gradient(180deg, #23233d 0%, #1f2035 100%)',
        'glass-light':
          'linear-gradient(180deg, rgba(255, 255, 255, 0.76) 0%, rgba(255, 255, 255, 0.44) 100%)',
        'glass-dark':
          'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.88', transform: 'scale(1.01)' },
        },
        liveCountdownGlow: {
          '0%, 100%': {
            boxShadow:
              '0 0 0 0 rgba(220, 38, 38, 0.00), 0 0 0 1px rgba(239, 68, 68, 0.14)',
          },
          '50%': {
            boxShadow:
              '0 0 0 6px rgba(239, 68, 68, 0.08), 0 0 18px 3px rgba(239, 68, 68, 0.14), 0 0 0 1px rgba(239, 68, 68, 0.2)',
          },
        },
        cardEnter: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-soft': 'pulseSoft 1.8s ease-in-out infinite',
        'live-countdown-glow': 'liveCountdownGlow 1.8s ease-in-out infinite',
        'card-enter': 'cardEnter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      gridTemplateColumns: {
        'race-card-desktop': 'minmax(0, 1fr) auto',
      },
      gridTemplateRows: {
        collapsed: '0fr',
        expanded: '1fr',
      },
      inset: {
        'orb-anchor': '18%',
      },
      maxWidth: {
        app: '120rem',
      },
      minHeight: {
        loading: '20rem',
        'loading-compact': '13.75rem',
      },
      opacity: {
        14: '0.14',
        16: '0.16',
        22: '0.22',
        24: '0.24',
        26: '0.26',
        28: '0.28',
        34: '0.34',
        38: '0.38',
        46: '0.46',
        54: '0.54',
        90: '0.9',
      },
      scale: {
        'card-collapsed': '0.985',
      },
      spacing: {
        orb: '28rem',
        overview: 'clamp(1.25rem, 1.9vw, 3rem)',
      },
      transitionProperty: {
        'fade-slide': 'opacity, transform',
        'panel-expand': 'grid-template-rows, opacity, margin, transform',
        theme: 'background-color, color',
        'theme-surface': 'background-color, border-color, box-shadow, color, opacity, backdrop-filter',
        'theme-surface-transform':
          'background-color, border-color, color, box-shadow, opacity, backdrop-filter, transform',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
