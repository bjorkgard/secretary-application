/* eslint-disable node/prefer-global/process */
require('dotenv').config()

const { notarize } = require('@electron/notarize')

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context

  if (electronPlatformName !== 'darwin')
    return

  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD || !process.env.APPLE_ID_TEAM) {
    console.error('Notarization failed: Environment variables not set.')
    console.error('APPLE_ID', process.env.APPLE_ID)
    console.error('APPLE_ID_PASSWORD', process.env.APPLE_ID_PASSWORD)
    console.error('APPLE_ID_TEAM', process.env.APPLE_ID_TEAM)
    return
  }

  const appId   = 'se.bjorkgard.secretary'
  const appName = context.packager.appInfo.productFilename

  return await notarize({
    tool:            'notarytool',
    appBundleId:     appId,
    appPath:         `${appOutDir}/${appName}.app`,
    appleId:         process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId:          process.env.APPLE_ID_TEAM,
  })
}
