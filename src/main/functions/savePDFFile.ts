import { BrowserWindow, app, dialog } from 'electron'
import log from 'electron-log'
import fs from 'fs-extra'
import i18n from '../../localization/i18next.config'

const savePdfFile = (mainWindow: BrowserWindow, name: string, data: ArrayBuffer): void => {
  const dialogOptions = {
    title: i18n.t('export.saveAs'),
    defaultPath: app.getPath('downloads') + '/' + name,
    buttonLabel: i18n.t('export.save')
  }

  dialog
    .showSaveDialog(mainWindow, dialogOptions)
    .then((response) => {
      if (!response.canceled && response.filePath) {
        if (data) {
          fs.writeFileSync(response.filePath, Buffer.from(data))
        }
      }
    })
    .catch((err) => {
      log.error(err)
    })
}

export default savePdfFile
