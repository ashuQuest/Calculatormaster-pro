/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#FAF7F0', // Main background (Warm Cream)
          200: '#F2EDE4', // Secondary background
          300: '#E9E2D6', // Soft beige
          400: '#E7E0D5', // Borders
          500: '#D5CBBB',
        },
        charcoal: {
          50: '#F6F5F4',
          100: '#E7E5E4',
          200: '#D6D3D1',
          300: '#A8A29E',
          400: '#78716C', // Secondary text
          500: '#57534E',
          600: '#44403C', // Dark borders
          700: '#292524', // Primary text (Charcoal)
          800: '#1C1917', // Dark mode card
          900: '#141210', // Dark mode main bg
          950: '#0C0A09',
        },
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C', // Primary accent (Warm Orange)
          700: '#C2410C', // Hover accent
          800: '#9A3412',
          900: '#7C2D12',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#24201D',
          darker: '#1C1917',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(41, 37, 36, 0.05), 0 1px 4px -1px rgba(41, 37, 36, 0.03)',
        'card': '0 4px 14px -3px rgba(41, 37, 36, 0.06), 0 2px 6px -2px rgba(41, 37, 36, 0.04)',
        'elevated': '0 10px 25px -4px rgba(41, 37, 36, 0.08), 0 4px 10px -3px rgba(41, 37, 36, 0.04)',
      }
    },
  },
  plugins: [],
}
