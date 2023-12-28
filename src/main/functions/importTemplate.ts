import { BrowserWindow, OpenDialogOptions, app, dialog } from 'electron'
import fs from 'fs-extra'
import log from 'electron-log'
import i18n from '../../localization/i18next.config'
import { TemplateService } from '../../types/type'
import { confirmTemplate } from '.'

const isDevelopment = import.meta.env.MAIN_VITE_NODE_ENV !== 'production'

export default function importTemplate(
  mainWindow: BrowserWindow,
  templateService: TemplateService,
  args: { code: string; name: string; date: string }
): void {
  const options: OpenDialogOptions = {
    title: i18n.t('templates.title'),
    buttonLabel: i18n.t('label.import'),
    filters: [{ name: 'pdf', extensions: ['pdf'] }],
    properties: ['openFile']
  }

  const userTemplatePath = isDevelopment ? './templates' : app.getPath('userData') + '/templates'
  try {
    fs.mkdirSync(userTemplatePath, { recursive: true })
  } catch (e) {
    log.error('Cannot create folder ', e)
  }

  dialog.showOpenDialog(mainWindow, options).then((result) => {
    if (!result.canceled) {
      try {
        fs.copyFileSync(result.filePaths[0], `${userTemplatePath}/${args.code}.pdf`)

        confirmTemplate(args.code, `${userTemplatePath}/${args.code}.pdf`).then((confirmed) => {
          if (confirmed) {
            templateService.upsert({ ...args, path: `${userTemplatePath}/${args.code}.pdf` })

            mainWindow.webContents.send('template-imported')

            return dialog.showMessageBox(mainWindow, {
              type: 'info' as const,
              buttons: ['OK'],
              defaultId: 0,
              title: i18n.t('templates.imported'),
              message: i18n.t('templates.importedMessage'),
              detail: ''
            })
          } else {
            return dialog.showMessageBox(mainWindow, {
              type: 'info' as const,
              buttons: ['OK'],
              defaultId: 0,
              title: i18n.t('templates.errorImported'),
              message: i18n.t('templates.errorWrongFile'),
              detail: ''
            })
          }
        })
      } catch (err) {
        log.error(err)
        return dialog.showMessageBox(mainWindow, {
          type: 'info' as const,
          buttons: ['OK'],
          defaultId: 0,
          title: i18n.t('templates.errorImported'),
          message: i18n.t('templates.errorImportedMessage'),
          detail: ''
        })
      }
    }

    return null
  })
}
