const antfu          = require('@antfu/eslint-config').default
const { FlatCompat } = require('@eslint/eslintrc')

const compat = new FlatCompat()

module.exports = antfu({
  stylistic: true,
  rules:     {
    'style/no-multi-spaces': ['off'],
    'style/key-spacing':     ['error', {
      multiLine: {
        beforeColon: false,
        afterColon:  true,
      },
      align: {
        beforeColon: false,
        afterColon:  true,
        on:          'value',
      },
    }],
  },
  ignorePatterns: [
    '.github/*',
    '**/*.yml',
  ],
}, ...compat.config({
  extends: ['plugin:tailwindcss/recommended'],
  plugins: ['align-assignments', 'align-import'],
  rules:   {
    'align-import/align-import':           'error',
    'align-assignments/align-assignments': [2, { requiresOnly: false }],
  },
}))
