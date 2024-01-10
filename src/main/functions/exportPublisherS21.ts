import type { BrowserWindow } from 'electron'
import { app, dialog }        from 'electron'
import { PDFDocument }        from 'pdf-lib'
import fs                     from 'fs-extra'
import log                    from 'electron-log'
import PublisherService       from '../services/publisherService'
import i18n                   from '../../localization/i18next.config'
import generatePublisherS21   from './generatePublisherS21'

const publisherService = new PublisherService()

export default async function exportPublisherS21(
  mainWindow: BrowserWindow,
  publisherId: string,
): Promise<void> {
  const publisher         = await publisherService.findOneById(publisherId)
  const publisherFullName = `${publisher.firstname} ${publisher.lastname}`
  const name              = `S-21_${publisherFullName}_${new Date().toLocaleDateString('sv')}.pdf`
  const mergedPdf         = await PDFDocument.create()

  const uniqueServiceYears = [...new Set(publisher.reports.map(obj => obj.serviceYear))].sort()

  try {
    for await (const serviceYear of uniqueServiceYears) {
      await generatePublisherS21(publisher, serviceYear).then(async (pdfBytes) => {
        const yearPage    = await PDFDocument.load(pdfBytes)
        const copiedPages = await mergedPdf.copyPages(yearPage, yearPage.getPageIndices())
        copiedPages.forEach(page => mergedPdf.addPage(page))
      })
    }

    const mergedPdfBytes = await mergedPdf.save()

    savePdfFile(mainWindow, mergedPdfBytes, name)
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
          // eslint-disable-next-line node/prefer-global/buffer
          fs.writeFileSync(response.filePath, Buffer.from(data))
      }
    })
    .catch((err) => {
      log.error(err)
    })

  mainWindow?.webContents.send('show-spinner', { status: false })
}
