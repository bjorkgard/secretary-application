module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:tailwindcss/recommended',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier'
  ],
  plugins: ['@stylistic'],
  rules: {
    '@stylistic/key-spacing': [
      'error',
      {
        multiLine: {
          beforeColon: false,
          afterColon: true
        },
        align: {
          beforeColon: false,
          afterColon: true,
          on: 'value'
        }
      }
    ]
  }
}
