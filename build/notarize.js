/* eslint-disable node/prefer-global/process */
require('dotenv').config()

const { notarize } = require('@electron/notarize')

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context

  if (electronPlatformName !== 'darwin')
    return

  if (!process.env.APPLEID || !process.env.APPLEIDPASS || !process.env.TEAMID)
    return

  const appId   = 'se.bjorkgard.secretary'
  const appName = context.packager.appInfo.productFilename

  // eslint-disable-next-line no-console
  console.log(`Notarizing ${appId} for ${appOutDir}/${appName}.app`)

  return await notarize({
    appBundleId:     appId,
    appPath:         `${appOutDir}/${appName}.app`,
    appleId:         process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
    teamId:          process.env.TEAMID,
  })
}
