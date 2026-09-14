/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#0B0E11', // page background
          900: '#0E1117', // deep panel
          850: '#161A1E', // panel
          800: '#1E2329', // card / row
          700: '#2B3139', // border / hover
          600: '#3A4149', // strong border
        },
        ink: {
          100: '#EAECEF', // primary text
          300: '#B7BDC6', // secondary text
          500: '#848E9C', // muted text
        },
        gold: {
          DEFAULT: '#F0B90B',
          light: '#F8D33A',
          dim: '#7A6008',
        },
        up: {
          DEFAULT: '#0ECB81',
          soft: '#0ECB8133',
        },
        down: {
          DEFAULT: '#F6465D',
          soft: '#F6465D33',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Roboto Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}
