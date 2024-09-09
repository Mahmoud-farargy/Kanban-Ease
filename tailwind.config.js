/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light Theme Colors
        light: {
          background: '#F8F9FA',
          surface: '#FFFFFF',
          primary: '#007BFF',
          secondary: '#6C757D',
          text: '#333333',
          textSecondary: '#666666',
          border: '#DDDDDD',
          taskBorder: '#e8eaed',
          taskBorderHightContrast: '#d6d9de',
          white: '#fff',
          hover: '#f0f1f3'
        },
        // Dark Theme Colors
        dark: {
          background: '#374151',
          surface: '#3C3C3C',
          primary: '#007BFF',
          secondary: '#343A40',
          text: '#E0E0E0',
          textSecondary: '#B0B0B0',
          taskBorder: '#6b7280',
          taskBorderHightContrast: '#d6d9de',
          border: '#4A4A4A',
          black: '#000',
          hover: '#1b1c1e'
        },
      },
      screens: {
        xs: '495px',
        xxs: '320px',
        md:'819px',
        '3xl': '2400px',
      },
    },
  },
  plugins: [],
}

