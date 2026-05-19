import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: {
          light: {
            bg: '#F8F4FF',
            bgSoft: '#EBD3FF',
            bgEnd: '#DDCBFF',
            card: '#FFFCFF',
            elevated: '#FFFFFF',
            surface: '#F8F1FF',
            cardSelected: '#FCF8FF',
            primary: '#7A63F5',
            primaryHover: '#6950EF',
            primaryStrong: '#5F37F3',
            soft: '#CEC2FF',
            softAlt: '#DDCBFF',
            blush: '#E4C5EA',
            rose: '#DCB6D5',
            accentWarm: '#CF8BA9',
            border: '#E7DAFA',
            borderHover: '#C9BCFF',
            text: '#241B35',
            body: '#645B77',
            muted: '#827A93',
            success: '#22C55E',
            warning: '#F59E0B',
            danger: '#EF4444',
            critical: '#DC2626',
            overlay: 'rgba(255, 252, 255, 0.56)',
          },
          dark: {
            bg: '#22223B',
            card: '#2B2B47',
            elevated: '#34344F',
            surface: '#4A4E69',
            surfaceSoft: '#3B3D5C',
            muted: '#9A8C98',
            accent: '#C9ADA7',
            accentSoft: 'rgba(201, 173, 167, 0.14)',
            text: '#F2E9E4',
            border: 'rgba(242, 233, 228, 0.14)',
            overlay: 'rgba(43, 43, 71, 0.56)',
          },
        },
      },
      fontFamily: {
        sans: ['Avenir Next', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Avenir Next', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['SFMono-Regular', 'Consolas', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glass: '0 22px 60px -28px rgba(111, 86, 220, 0.34), 0 10px 22px -18px rgba(207, 139, 169, 0.18)',
        'glass-strong':
          '0 26px 80px -30px rgba(111, 86, 220, 0.42), 0 16px 40px -22px rgba(207, 139, 169, 0.24)',
        'glass-dark':
          '0 30px 70px -32px rgba(10, 10, 20, 0.88), 0 10px 26px -20px rgba(201, 173, 167, 0.18)',
        panel: '0 18px 38px -24px rgba(58, 43, 102, 0.22)',
        'panel-hover': '0 24px 48px -24px rgba(122, 99, 245, 0.16)',
      },
      backdropBlur: {
        glass: '22px',
        shimmer: '28px',
      },
      backgroundImage: {
        'light-glow':
          'radial-gradient(circle at 10% 20%, rgba(206, 194, 255, 0.72), transparent 32%), radial-gradient(circle at 78% 16%, rgba(228, 197, 234, 0.58), transparent 28%), radial-gradient(circle at 70% 74%, rgba(220, 182, 213, 0.34), transparent 32%), linear-gradient(180deg, #faf8ff 0%, #f6f0ff 100%)',
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
        cardEnter: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-soft': 'pulseSoft 1.8s ease-in-out infinite',
        'card-enter': 'cardEnter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
