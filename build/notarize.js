const { notarize } = require('electron-notarize');
require('dotenv').config()

exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context
    if (electronPlatformName !== 'darwin') {
      return
    }

    let appId     = 'se.bjorkgard.secretary'
    const appName = context.packager.appInfo.productFilename

    console.log(`Notarizing ${appId} for ${appOutDir}/${appName}.app`)

    return await notarize({
      appBundleId     : appId,
      appPath         : `${appOutDir}/${appName}.app`,
      appleId         : process.env.APPLEID,
      appleIdPassword : process.env.APPLEIDPASS,
    })
  }
