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
      },
      fontSize: {
        'base': '16px',
      },
      lineHeight: {
        'base': '1.5',
      },
    },
  },
  plugins: [],
}

