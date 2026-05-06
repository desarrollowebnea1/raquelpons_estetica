import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#F9F8F6',
        warmWhite: '#FAF8F5',
        anthracite: '#2C2C2C',
        champagne: '#D1BFA7',
        nude: '#EADFD6',
        dustyRose: '#D8B7A6',
        elegantBrown: '#6F5148',
        sage: '#A8B8A0',
        border: 'rgba(44,44,44,0.10)',
      },
      borderRadius: {
        organic: '40px',
        soft: '24px',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        refined: '-0.02em',
        wide: '0.08em',
        ultrawide: '0.15em',
      },
      boxShadow: {
        soft: '0 2px 16px rgba(44,44,44,0.06)',
        medium: '0 4px 32px rgba(44,44,44,0.10)',
        card: '0 1px 8px rgba(44,44,44,0.06), 0 4px 24px rgba(44,44,44,0.06)',
      },
      backgroundImage: {
        'gradient-champagne': 'linear-gradient(135deg, #F9F8F6 0%, #EADFD6 50%, #D1BFA7 100%)',
        'gradient-warm': 'linear-gradient(180deg, #FAF8F5 0%, #F9F8F6 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.7s ease forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        elegant: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}

export default config
