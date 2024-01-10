const { version } = require('./package.json')

// eslint-disable-next-line node/prefer-global/process
if (process.env.MAIN_VITE_APP_VERSION === undefined)
  // eslint-disable-next-line node/prefer-global/process
  process.env.MAIN_VITE_APP_VERSION = version

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId:        'se.bjorkgard.secretary',
  productName:  'Secretary',
  artifactName: `${productName}-${version}.${ext}`,
  asar:         true,
  asarUnpack:   ['resources/**'],
  directories:  {
    output:         'dist',
    buildResources: 'build',
  },
  files: [
    '**/*',
    '!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}',
    '!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}',
    '!**/node_modules/*.d.ts',
    '!**/node_modules/.bin',
    '!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}',
    '!.editorconfig',
    '!**/._*',
    '!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}',
    '!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}',
    '!**/{appveyor.yml,.travis.yml,circle.yml}',
    '!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}',
  ],
  includeSubNodeModules: true,
  extraResources:        [
    { from: 'src/localization/locales', to: 'locales', filter: ['**/*'] },
    { from: 'resources/fonts', to: 'fonts', filter: ['**/*'] },
  ],
  extraMetadata: {
    // eslint-disable-next-line node/prefer-global/process
    version:     process.env.MAIN_VITE_APP_VERSION,
    homepage:    'https://secretary.jwapp.info',
    description: 'An open source application to help the secretary in the congregation.',
  },
  mac: {
    icon:                'build/icons/mac/icon.icns',
    hardenedRuntime:     true,
    gatekeeperAssess:    false,
    mergeASARs:          false,
    entitlements:        'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.plist',
    category:            'public.app-category.utilities',
    target:              [{ target: 'dmg', arch: ['universal'] }],
    publish:             'github',
  },
  linux: {
    icon:     'build/icons/png/512x512.png',
    category: 'Utility',
    target:   ['deb', 'AppImage'],
    publish:  'github',
  },
  win: {
    icon:   'build/icons/win/icon.ico',
    target: [
      {
        target: 'nsis',
        arch:   ['x64'],
      },
      {
        target: 'portable',
        arch:   ['x64'],
      },
    ],
    publish: 'github',
  },
  nsis: {
    oneClick:                           false,
    allowToChangeInstallationDirectory: false,
    differentialPackage:                false,
  },
  portable: {
    artifactName: `${productName}Portable.${ext}`,
  },
  dmg: {
    contents: [
      {
        x: 130,
        y: 220,
      },
      {
        x:    410,
        y:    220,
        type: 'link',
        path: '/Applications',
      },
    ],
    sign: false,
  },
  afterSign: './build/notarize.js',
}

module.exports = config
