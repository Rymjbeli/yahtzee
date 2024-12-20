/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      borderWidth: {
        '3': '3px',
      },
      colors: {
        'base-black': '#000000',
        'base-white': '#FFFFFF',
        'gray-text': '#313131',
        'gray-text-light': '#a3a3a3',
        'secondary': '#FDFCFC',
        'base-gray': '#F5F4F4',
        'main': '#AE9AFF',
        'main-base': '#D4C9FF',
        'main-sub': '#E2DCFD',
        'light-blue': '#A4D3FF',
        'light-red': '#FF8577',
        'success-green': '#0FA958',
      },
      fontSize: {
        'base': '16px',
      },
      lineHeight: {
        'base': '1.5',
      },
      width: {
        '100': '27rem',
        '38': '8.5rem',
      },
      inset: {
        '18': '4.5rem',
      },
      screens: {
        'xs': '560px',
      },
      boxShadow: {
        'custom-light': '0 4px 6px rgba(4, 16, 21, 0.09)',
      },
    },
  },
  plugins: [],
}
