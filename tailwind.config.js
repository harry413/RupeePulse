/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // RupeePulse brand colors
        bg: {
          primary: '#0A0B0E',
          secondary: '#111318',
          tertiary: '#161A22',
          card: '#1E2433',
          hover: '#252D3D',
        },
        brand: {
          green: '#00D4A0',
          'green-dark': '#00A87D',
          'green-muted': 'rgba(0,212,160,0.1)',
          blue: '#4F8EF7',
          'blue-dark': '#2D6FD9',
          'blue-muted': 'rgba(79,142,247,0.1)',
          red: '#FF4757',
          'red-dark': '#CC3344',
          'red-muted': 'rgba(255,71,87,0.1)',
          amber: '#FFB547',
          purple: '#A78BFA',
          gold: '#F5A623',
        },
        border: {
          primary: '#2A3348',
          secondary: '#3A4660',
        },
        text: {
          primary: '#E8EBF2',
          secondary: '#9BA5BF',
          muted: '#5C6882',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '20': '20px',
      },
      animation: {
        'ticker': 'scroll-ticker 30s linear infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.3s ease',
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
      },
      keyframes: {
        'scroll-ticker': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,212,160,0)' },
          '50%': { boxShadow: '0 0 0 4px rgba(0,212,160,0.15)' },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #00D4A0, #4F8EF7)',
        'gradient-buy': 'linear-gradient(135deg, #00A87D, #00D4A0)',
        'gradient-sell': 'linear-gradient(135deg, #CC3344, #FF4757)',
        'gradient-auth': 'linear-gradient(135deg, #4F8EF7, #2D6FD9)',
      },
    },
  },
  plugins: [],
};
