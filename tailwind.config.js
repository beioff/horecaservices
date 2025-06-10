/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Основные цвета
        primary: {
          DEFAULT: '#E63946', // Основной красный
          light: '#FF4D5A',
          dark: '#CC2A37',
        },
        // Нейтральные цвета
        neutral: {
          50: '#FFFFFF', // Белый
          100: '#F8F8F8',
          200: '#F0F0F0',
          300: '#E5E5E5',
          400: '#D4D4D4',
          500: '#A3A3A3',
          600: '#737373',
          700: '#525252',
          800: '#404040',
          900: '#262626',
          950: '#171717', // Почти черный
        },
        // Бежевые тона
        beige: {
          50: '#FDFAF6',
          100: '#F5F0E6',
          200: '#E8DFD0',
          300: '#D4C5B0',
          400: '#BFA990',
          500: '#A88D70',
        },
      },
      borderRadius: {
        'none': '0',
        'sm': '0.375rem',
        DEFAULT: '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
        'full': '9999px',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'hover': '0 4px 20px -3px rgba(0, 0, 0, 0.1), 0 12px 25px -2px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}

