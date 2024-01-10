/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,html}'],
  theme:   {
    extend: {},
  },
  daisyui: {
    themes:    ['emerald', 'night'],
    darkTheme: 'night',
    logs:      false,
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
    require('tailwind-scrollbar-hide'),
    require('tailwindcss-debug-screens'),
  ],
}
