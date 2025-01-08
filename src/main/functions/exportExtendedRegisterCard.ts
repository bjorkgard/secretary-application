import type { BrowserWindow }       from 'electron'
import { app, dialog }              from 'electron'
import log                          from 'electron-log'
import fs                           from 'fs-extra'
import { PDFDocument }              from 'pdf-lib'
import i18n                         from '../../localization/i18next.config'
import PublisherService             from '../services/publisherService'
import GenerateExtendedRegisterCard from './generareExtendedRegisterCard'

const publisherService = new PublisherService()

export default async function exportExtendedRegisterCard(
  mainWindow: BrowserWindow,
  publisherId: string,
): Promise<void> {
  const mergedPdf = await PDFDocument.create()
  const publisher = await publisherService.findOneById(publisherId)
  const fileName  = `${publisher.lastname}_${publisher.firstname}_${new Date().toLocaleDateString('sv')}`

  try {
    await GenerateExtendedRegisterCard(publisher).then(async (pdfBytes) => {
      const yearPage    = await PDFDocument.load(pdfBytes)
      const copiedPages = await mergedPdf.copyPages(yearPage, yearPage.getPageIndices())
      copiedPages.forEach(page => mergedPdf.addPage(page))
    })

    const mergedPdfBytes = await mergedPdf.save()
    savePdfFile(mainWindow, mergedPdfBytes, `${fileName}.pdf`)
  }
  catch (err) {
    log.error(err)

    mainWindow?.webContents.send('show-spinner', { status: false })

    const responseErrorOptions = {
      type:      'error' as const,
      buttons:   ['OK'],
      defaultId: 0,
      title:     i18n.t('error.export'),
      message:   i18n.t('error.export'),
      detail:    i18n.t('error.exportError', { error: err }),
    }

    if (mainWindow)
      dialog.showMessageBox(mainWindow, responseErrorOptions)
  }
}

function savePdfFile(mainWindow: BrowserWindow, data: Uint8Array, name: string) {
  const dialogOptions = {
    title:       i18n.t('export.saveAs'),
    defaultPath: `${app.getPath('downloads')}/${name}`,
    buttonLabel: i18n.t('export.save'),
  }

  dialog
    .showSaveDialog(mainWindow, dialogOptions)
    .then((response) => {
      if (!response.canceled && response.filePath) {
        if (data)
          fs.writeFileSync(response.filePath, new Uint8Array(data))
      }
    })
    .catch((err) => {
      log.error(err)
    })

  mainWindow?.webContents.send('show-spinner', { status: false })
}
