import fs                                                           from 'fs-extra'
import type { BrowserWindow, MessageBoxOptions, OpenDialogOptions } from 'electron'
import { app, dialog }                                              from 'electron'
import log                                                          from 'electron-log'
import i18n                                                         from '../../localization/i18next.config'
import isDev                                                        from './isDev'

interface Backup {
  date:   Date
  type:   'backup'
  backup: Array<{ [key: string]: string }>
}

export default async function dbRestore(mainWindow: BrowserWindow): Promise<void> {
  mainWindow?.webContents.send('show-spinner', { status: true })

  const userDataPath  = isDev() ? './db' : `${app.getPath('userData')}/db`
  let confirmedBackup = true

  const options: OpenDialogOptions = {
    title:       i18n.t('export.restoreBackup'),
    buttonLabel: i18n.t('export.restore'),
    filters:     [{ name: 'json', extensions: ['json'] }],
    properties:  ['openFile'],
  }

  dialog.showOpenDialog(mainWindow, options).then((result) => {
    fs.readFile(result.filePaths[0], (err, data) => {
      if (!err) {
        const recoveryData: Backup = JSON.parse(data.toString())
        const backupFiles          = recoveryData.backup

        if (recoveryData.type !== 'backup') {
          confirmedBackup                        = false
          const dialogOptions: MessageBoxOptions = {
            type:      'info',
            buttons:   ['OK'],
            defaultId: 0,
            title:     i18n.t('backup.error.title'),
            message:   i18n.t('backup.error.message'),
            detail:    i18n.t('backup.error.detail'),
          }
          dialog.showMessageBox(mainWindow, dialogOptions)
        }

        if (confirmedBackup) {
          backupFiles.forEach((file) => {
            const [firstKey] = Object.keys(file)

            fs.writeFile(`${userDataPath}/${firstKey}`, file[firstKey], 'utf-8', (err) => {
              if (err)
                log.error(err)
            })
          })

          const responseOptions: MessageBoxOptions = {
            type:      'info',
            buttons:   ['OK'],
            defaultId: 0,
            title:     i18n.t('backup.success.title'),
            message:   i18n.t('backup.success.message'),
            detail:    i18n.t('backup.success.detail'),
          }

          dialog.showMessageBox(mainWindow, responseOptions).then(() => {
            app.quit()
          })
        }
      }
    })
  })

  log.info('Backup done', new Date())
  mainWindow?.webContents.send('show-spinner', { status: false })
}
