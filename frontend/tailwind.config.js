/** @type {import('tailwindcss').Config} */

/*
 * MKL Brand System — Tailwind Configuration
 * Michael Kairos Labs · Deep Teal + Gold
 *
 * Usage: Copy this into your tailwind.config.js
 * Fonts: Add Google Fonts import to your HTML/CSS:
 *   https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap
 */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        // Primary
        midnight: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
          lighter: '#334155',
        },

        // Accent — Deep Teal
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',  // <-- PRIMARY ACCENT
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          DEFAULT: '#0D9488',
        },

        // Secondary — Amber Gold (Oxford / Premium ONLY)
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',  // <-- PRIMARY GOLD
          700: '#B45309',
          800: '#92400E',
          DEFAULT: '#D97706',
        },

        // Semantic
        success: { DEFAULT: '#10B981', light: '#D1FAE5' },
        warning: { DEFAULT: '#F59E0B', light: '#FEF3C7' },
        error: { DEFAULT: '#EF4444', light: '#FEE2E2' },
        info: { DEFAULT: '#0EA5E9', light: '#E0F2FE' },
        oxford: { DEFAULT: '#7C3AED', light: '#F5F3FF' },

        // Neutrals (extend slate)
        cloud: '#F8FAFC',
        mist: '#F1F5F9',
      },

      fontFamily: {
        display: ['"Space Grotesk"', 'Calibri', 'Arial', 'sans-serif'],
        body: ['"Inter"', '"Segoe UI"', 'Calibri', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', '"Courier New"', 'monospace'],
      },

      fontSize: {
        'display': ['40px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1': ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.7' }],
        'body': ['16px', { lineHeight: '1.7' }],
        'sm': ['14px', { lineHeight: '1.6' }],
        'caption': ['12px', { lineHeight: '1.5' }],
        'stat-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'stat-md': ['32px', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
      },

      boxShadow: {
        'card': '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 10px 25px rgba(15, 23, 42, 0.08)',
        'nav': '0 1px 3px rgba(15, 23, 42, 0.1)',
      },

      borderRadius: {
        'card': '12px',
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },

      maxWidth: {
        'container': '1200px',
      },

      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
