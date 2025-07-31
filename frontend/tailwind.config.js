/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom pink palette for light mode
        'rose-dust': {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        'blush': {
          50: '#fef7f7',
          100: '#feecec',
          200: '#fdd8d8',
          300: '#fcb5b5',
          400: '#f98585',
          500: '#f15757',
          600: '#e13434',
          700: '#c62626',
          800: '#a32424',
          900: '#872525',
        },
        'powder': {
          50: '#fefcfc',
          100: '#fef6f6',
          200: '#fee9e9',
          300: '#fdd1d1',
          400: '#fbb0b0',
          500: '#f78585',
          600: '#ed5a5a',
          700: '#dc3a3a',
          800: '#b72e2e',
          900: '#9a2a2a',
        },
        // Baby blue accent
        'baby-blue': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Purple palette for dark mode
        'amethyst': {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        'lavender': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        'plum': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'pink-gradient': 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
        'purple-gradient': 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)',
        'rose-gradient': 'linear-gradient(135deg, #fef7f7 0%, #feecec 50%, #fdd8d8 100%)',
        'amethyst-gradient': 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 50%, #6d28d9 100%)',
      }
    },
  },
  plugins: [],
}