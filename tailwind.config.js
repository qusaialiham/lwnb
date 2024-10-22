/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#2563eb',
        accent: '#f59e0b',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}