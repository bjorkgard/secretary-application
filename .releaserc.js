module.exports = {
  branches: ['main', { name: 'beta', prerelease: true }, { name: 'develop', prerelease: true }],
  extends:  '@jedmao/semantic-release-npm-github-config',
  plugins:  [
    '@semantic-release/commit-analyzer',
    'semantic-release-export-data',
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json'],
      },
    ],
  ],
}
