const path = require('path');

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-advanced-variables': {},
    'tailwindcss/nesting': {},
    tailwindcss: {
      config: path.join(__dirname, 'tailwind.config.js'),
    },
    autoprefixer: {},
  },
};
