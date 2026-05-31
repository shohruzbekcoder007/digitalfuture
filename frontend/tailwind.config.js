/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B4FD8',
          50: '#EEF3FE',
          100: '#D8E2FC',
          200: '#B6C8F8',
          500: '#1B4FD8',
          600: '#1843B3',
          700: '#13368F',
          800: '#0E2A75',
        },
        accent: '#1B4FD8',
        bg: '#FFFFFF',
        surface: '#F8FAFC',
        muted: '#F1F5F9',
        ink: '#0F172A',
        sub: '#475569',
        line: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', '"Source Serif Pro"', 'Georgia', 'serif'],
      },
      maxWidth: {
        prose: '72ch',
      },
      borderRadius: {
        card: '8px',
        badge: '4px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        cardHover: '0 4px 12px rgba(15,23,42,0.08)',
      },
      typography: {
        DEFAULT: { css: { maxWidth: '72ch' } },
      },
    },
  },
  plugins: [],
};
