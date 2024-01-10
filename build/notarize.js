/* eslint-disable node/prefer-global/process */
require('dotenv').config()

const { notarize } = require('electron-notarize')

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context

  if (electronPlatformName !== 'darwin')
    return

  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD || !process.env.APPLE_TEAM_ID)
    return

  const appName = context.packager.appInfo.productFilename

  return await notarize({
    appBundleId:     'se.bjorkgard.secretary',
    appPath:         `${appOutDir}/${appName}.app`,
    appleId:         process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
    ascProvider:     process.env.APPLE_TEAM_ID,
  })
}
