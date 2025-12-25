/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#1e40af', // Blue 800 - Màu xanh bệnh viện
        'primary-light': '#93c5fd', // Blue 300 - Màu xanh nhẹ
      },
    },
  },
  plugins: [],
}


