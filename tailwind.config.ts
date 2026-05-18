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
            card: '#FFFCF8',
            elevated: '#FFFFFF',
            primary: '#8B5CF6',
            primaryHover: '#7C3AED',
            soft: '#F3E5FF',
            softAlt: '#EDE9FE',
            border: '#E6D5F5',
            text: '#2D1B45',
            body: '#4B3A5A',
            muted: '#7B6A8A',
            success: '#16A34A',
            danger: '#DC2626',
          },
          dark: {
            bg: '#22223B',
            card: '#2B2B47',
            elevated: '#34344F',
            surface: '#4A4E69',
            muted: '#9A8C98',
            accent: '#C9ADA7',
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
      boxShadow: {
        glass: '0 20px 45px -28px rgba(124, 58, 237, 0.35)',
        'glass-dark': '0 24px 54px -30px rgba(10, 10, 20, 0.85)',
        panel: '0 14px 28px -20px rgba(45, 27, 69, 0.3)',
      },
      backdropBlur: {
        glass: '18px',
      },
      backgroundImage: {
        'light-glow':
          'radial-gradient(circle at top left, rgba(139, 92, 246, 0.18), transparent 42%), radial-gradient(circle at bottom right, rgba(124, 58, 237, 0.12), transparent 38%)',
        'dark-glow':
          'radial-gradient(circle at top left, rgba(201, 173, 167, 0.18), transparent 42%), radial-gradient(circle at bottom right, rgba(74, 78, 105, 0.42), transparent 38%)',
      },
    },
  },
  plugins: [],
}

export default config
