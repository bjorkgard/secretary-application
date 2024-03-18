import fs                     from 'fs-extra'
import type { BrowserWindow } from 'electron'
import { app, dialog }        from 'electron'
import log                    from 'electron-log'
import i18n                   from '../../localization/i18next.config'
import isDev                  from './isDev'

interface Backup {
  date:   Date
  type:   'backup'
  backup: Array<{ [key: string]: string }>
}

export default async function dbBackup(mainWindow: BrowserWindow): Promise<void> {
  log.info('Backup start', new Date())

  mainWindow?.webContents.send('show-spinner', { status: true })

  const date         = new Date()
  const dateString   = date.toLocaleDateString('sv')
  const userDataPath = isDev() ? './db' : `${app.getPath('userData')}/db`

  // TODO: store date in database

  // generate backup file
  const backup: Backup = {
    date,
    type:   'backup',
    backup: [],
  }

  fs.readdir(userDataPath, (err, files) => {
    if (err)
      log.error(err)

    files.forEach((file) => {
      if (file === '.DS_Store')
        return

      fs.readFile(`${userDataPath}/${file}`, 'utf-8', (err, data) => {
        if (err)
          log.error(err)

        const backupData = {
          [file]: data,
        }
        backup.backup    = backup.backup.concat(backupData) // Convert backupData into an array before concatenating
      })
      log.info(file, new Date())
    })
  })
  const options = {
    title:       i18n.t('export.saveBackup'),
    defaultPath: `${app.getPath('downloads')}/secretary_backup_${dateString}.json`,
    buttonLabel: i18n.t('export.save'),
  }

  dialog
    .showSaveDialog(mainWindow, options)
    .then((response) => {
      if (!response.canceled && response.filePath)
        fs.writeFileSync(response.filePath, JSON.stringify(backup), 'utf-8')
    })
    .catch((err) => {
      log.error(err)
    })

  log.info('Backup done', new Date())
  mainWindow?.webContents.send('show-spinner', { status: false })
}
