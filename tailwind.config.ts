import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        looca: {
          bg: '#07111f',
          'bg-2': '#0d1729',
          card: 'rgba(14, 23, 42, 0.76)',
          text: '#e5eefb',
          muted: '#a7b4c8',
          accent: '#7cdbff',
          'accent-2': '#8b5cf6',
          success: '#34d399',
          warning: '#fbbf24',
          danger: '#fb7185',
          border: 'rgba(148, 163, 184, 0.18)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'ripple': 'ripple 2s infinite ease-out',
        'wave': 'waveDance 25s infinite linear',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.1)', filter: 'brightness(1.2)' },
        },
        ripple: {
          '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.8' },
          '100%': { transform: 'translate(-50%, -50%) scale(2.5)', opacity: '0' },
        },
        waveDance: {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg) scale(1)' },
          '50%': { transform: 'translate(-50%, -50%) rotate(180deg) scale(1.1)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg) scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(124, 219, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(124, 219, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config

