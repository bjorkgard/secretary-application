import type { BrowserWindow }  from 'electron'
import { app, dialog }         from 'electron'
import log                     from 'electron-log'
import fs                      from 'fs-extra'
import JSZip                   from 'jszip'
import { PDFDocument }         from 'pdf-lib'
import i18n                    from '../../localization/i18next.config'
import PublisherService        from '../services/publisherService'
import SettingsService         from '../services/settingsService'
import type { PublisherModel } from '../../types/models'
import padNumber               from '../utils/padNumber'
import generatePublisherS21    from './generatePublisherS21'

const publisherService = new PublisherService()
const settingsService  = new SettingsService()

export default async function exportPublishersS21(
  mainWindow: BrowserWindow,
  serviceYear: number,
  type: string,
  serviceGroupId?: string,
): Promise<void> {
  const mergedPdf                        = await PDFDocument.create()
  let fileName                           = `S-21_${serviceYear}_${new Date().toLocaleDateString('sv')}`
  let sortedPublishers: PublisherModel[] = []

  // get publishers
  const allPublishers = await publisherService.find('lastname', '')
  const settings      = await settingsService.find()

  const fullTime   = allPublishers.filter(p =>
    p.appointments.some(
      a =>
        a.type === 'PIONEER'
        || a.type === 'MISSIONARY'
        || a.type === 'SPECIALPIONEER'
        || a.type === 'CIRCUITOVERSEER',
    ),
  )
  const publishers = allPublishers.filter(
    p =>
      (p.status === 'ACTIVE' || p.status === 'IRREGULAR')
      && !p.appointments.some(
        a =>
          a.type === 'PIONEER'
          || a.type === 'MISSIONARY'
          || a.type === 'SPECIALPIONEER'
          || a.type === 'CIRCUITOVERSEER',
      ),
  )
  const irregular  = allPublishers.filter(
    p =>
      p.status === 'IRREGULAR'
      && !p.appointments.some(
        a =>
          a.type === 'PIONEER'
          || a.type === 'MISSIONARY'
          || a.type === 'SPECIALPIONEER'
          || a.type === 'CIRCUITOVERSEER',
      ),
  )
  const inactive   = allPublishers.filter(
    p =>
      p.status === 'INACTIVE'
      && !p.appointments.some(
        a =>
          a.type === 'PIONEER'
          || a.type === 'MISSIONARY'
          || a.type === 'SPECIALPIONEER'
          || a.type === 'CIRCUITOVERSEER',
      ),
  )

  switch (type) {
    case 'complete':
      sortedPublishers = fullTime.concat(publishers, inactive)
      break
    case 'fullTime':
      fileName         = `S-21_${serviceYear}_Pioneers_${new Date().toLocaleDateString('sv')}`
      sortedPublishers = fullTime
      break
    case 'publishers':
      fileName         = `S-21_${serviceYear}_Publishers_${new Date().toLocaleDateString('sv')}`
      sortedPublishers = publishers
      break
    case 'irregular':
      fileName         = `S-21_${serviceYear}_Irregular_${new Date().toLocaleDateString('sv')}`
      sortedPublishers = irregular
      break
    case 'inactive':
      fileName         = `S-21_${serviceYear}_Inactive_${new Date().toLocaleDateString('sv')}`
      sortedPublishers = inactive
      break
    case 'serviceGroup':
      sortedPublishers = fullTime.concat(publishers, inactive)
      sortedPublishers = sortedPublishers.filter(p => p.serviceGroupId === serviceGroupId)
      fileName         = `S-21_ServiceGroup_${new Date().toLocaleDateString('sv')}`
      break
    default:
      sortedPublishers = publishers
      break
  }

  try {
    if (settings?.mergePdf) {
      for await (const publisher of sortedPublishers) {
        await generatePublisherS21(publisher, serviceYear, true).then(async (pdfBytes) => {
          const yearPage    = await PDFDocument.load(pdfBytes)
          const copiedPages = await mergedPdf.copyPages(yearPage, yearPage.getPageIndices())
          copiedPages.forEach(page => mergedPdf.addPage(page))
        })
      }

      const mergedPdfBytes = await mergedPdf.save()

      savePdfFile(mainWindow, mergedPdfBytes, `${fileName}.pdf`)
    }
    else {
      // Generate a PDF for each report and zip all files before downloading
      const zip   = new JSZip()
      let counter = 1

      for await (const publisher of sortedPublishers) {
        await generatePublisherS21(publisher, serviceYear, false).then(async (pdfBytes) => {
          zip.file(`S-21_${padNumber(counter, 3)}_${publisher.lastname}_${publisher.firstname}_${new Date().toLocaleDateString('sv')}.pdf`, pdfBytes)
        })

        counter++
      }

      saveZipFile(mainWindow, zip, `${fileName}.zip`)
    }
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
