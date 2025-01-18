import type { BrowserWindow } from 'electron'
import { app, dialog }        from 'electron'
import log                    from 'electron-log'
import fs                     from 'fs-extra'
// import type JSZip             from 'jszip'
// import { PDFDocument }  from 'pdf-lib'
import PublisherService from '../services/publisherService'
// import SettingsService      from '../services/settingsService'
import i18n                 from '../../localization/i18next.config'
import generatePublisherS21 from './generatePublisherS21'

const publisherService = new PublisherService()
// const settingsService  = new SettingsService()

export default async function exportPublisherS21(
  mainWindow: BrowserWindow,
  publisherId: string,
): Promise<void> {
  // const settings          = await settingsService.find()
  const publisher         = await publisherService.findOneById(publisherId)
  const publisherFullName = `${publisher.lastname}, ${publisher.firstname}`
  const name              = `S-21_${publisherFullName}`
  // const mergedPdf         = await PDFDocument.create()

  const uniqueServiceYears = [...new Set(publisher.reports.map(obj => obj.serviceYear))].reverse()

  try {
    // if (settings?.mergePdf) {
    // for await (const serviceYear of uniqueServiceYears) {
    await generatePublisherS21(publisher, uniqueServiceYears).then(async (pdfBytes) => {
      // const yearPage    = await PDFDocument.load(pdfBytes)
      // const copiedPages = await mergedPdf.copyPages(yearPage, yearPage.getPageIndices())
      // copiedPages.forEach(page => mergedPdf.addPage(page))
      savePdfFile(mainWindow, pdfBytes, `${name}.pdf`)
    })
    // }
    // const mergedPdfBytes = await mergedPdf.save()

    // savePdfFile(mainWindow, mergedPdfBytes, `${name}.pdf`)
    // }
    // else {
    //  // Generate a PDF for each report and zip all files before downloading
    //  const zip = new JSZip()
    //
    //  for await (const serviceYear of uniqueServiceYears) {
    //    await generatePublisherS21(publisher, serviceYear).then(async (pdfBytes) => {
    //      zip.file(`S-21_${serviceYear}_${publisherFullName}_${new Date().toLocaleDateString('sv')}.pdf`, pdfBytes)
    //    })
    //  }
    //
    //  saveZipFile(mainWindow, zip, `${name}.zip`)
    // }
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

/*
function saveZipFile(mainWindow: BrowserWindow, zip: JSZip, name: string) {
  const dialogOptions = {
    title:       i18n.t('export.saveAs'),
    defaultPath: `${app.getPath('downloads')}/${name}`,
    extensions:  ['zip'],
    buttonLabel: i18n.t('export.save'),
  }

  dialog
    .showSaveDialog(mainWindow, dialogOptions)
    .then((response) => {
      if (!response.canceled && response.filePath) {
        zip
          .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
          .pipe(fs.createWriteStream(response.filePath))
          .on('finish', () => {
            log.info('zip written.')
          })
      }
    })
    .catch((err) => {
      log.error(err)
    })

  mainWindow?.webContents.send('show-spinner', { status: false })
}
  */
