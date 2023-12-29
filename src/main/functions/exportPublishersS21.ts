import { BrowserWindow, app, dialog } from 'electron'
import { PDFDocument } from 'pdf-lib'
import fs from 'fs-extra'
import log from 'electron-log'
import i18n from '../../localization/i18next.config'
import PublisherService from '../services/publisherService'
import { PublisherModel } from '../../types/models'
import generatePublisherS21 from './generatePublisherS21'

const publisherService = new PublisherService()

export default async function exportPublishersS21(
  mainWindow: BrowserWindow,
  serviceYear: number,
  type: string
): Promise<void> {
  const mergedPdf = await PDFDocument.create()
  let fileName = `S-21_${serviceYear}_${new Date().toLocaleDateString('sv')}.pdf`
  let sortedPublishers: PublisherModel[] = []

  // get publishers
  const allPublishers = await publisherService.find('lastname', '')

  const fullTime = allPublishers.filter((p) =>
    p.appointments.some(
      (a) =>
        a.type === 'PIONEER' ||
        a.type === 'MISSIONARY' ||
        a.type === 'SPECIALPIONEER' ||
        a.type === 'CIRCUITOVERSEER'
    )
  )
  const publishers = allPublishers.filter(
    (p) =>
      (p.status === 'ACTIVE' || p.status === 'IRREGULAR') &&
      !p.appointments.some(
        (a) =>
          a.type === 'PIONEER' ||
          a.type === 'MISSIONARY' ||
          a.type === 'SPECIALPIONEER' ||
          a.type === 'CIRCUITOVERSEER'
      )
  )
  const irregular = allPublishers.filter(
    (p) =>
      p.status === 'IRREGULAR' &&
      !p.appointments.some(
        (a) =>
          a.type === 'PIONEER' ||
          a.type === 'MISSIONARY' ||
          a.type === 'SPECIALPIONEER' ||
          a.type === 'CIRCUITOVERSEER'
      )
  )
  const inactive = allPublishers.filter(
    (p) =>
      p.status === 'INACTIVE' &&
      !p.appointments.some(
        (a) =>
          a.type === 'PIONEER' ||
          a.type === 'MISSIONARY' ||
          a.type === 'SPECIALPIONEER' ||
          a.type === 'CIRCUITOVERSEER'
      )
  )

  switch (type) {
    case 'complete':
      sortedPublishers = fullTime.concat(publishers, inactive)
      break
    case 'fullTime':
      fileName = `S-21_${serviceYear}_Pioneers_${new Date().toLocaleDateString('sv')}.pdf`
      sortedPublishers = fullTime
      break
    case 'publishers':
      fileName = `S-21_${serviceYear}_Publishers_${new Date().toLocaleDateString('sv')}.pdf`
      sortedPublishers = publishers
      break
    case 'irregular':
      fileName = `S-21_${serviceYear}_Irregular_${new Date().toLocaleDateString('sv')}.pdf`
      sortedPublishers = irregular
      break
    case 'inactive':
      fileName = `S-21_${serviceYear}_Inactive_${new Date().toLocaleDateString('sv')}.pdf`
      sortedPublishers = inactive
      break
    default:
      sortedPublishers = publishers
      break
  }

  try {
    for await (const publisher of sortedPublishers) {
      await generatePublisherS21(publisher, serviceYear).then(async (pdfBytes) => {
        let yearPage = await PDFDocument.load(pdfBytes)
        const copiedPages = await mergedPdf.copyPages(yearPage, yearPage.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      })
    }

    const mergedPdfBytes = await mergedPdf.save()

    savePdfFile(mainWindow, mergedPdfBytes, fileName)
  } catch (err) {
    log.error(err)

    mainWindow?.webContents.send('show-spinner', { status: false })

    const responseErrorOptions = {
      type: 'error' as const,
      buttons: ['OK'],
      defaultId: 0,
      title: i18n.t('error.export'),
      message: i18n.t('error.export'),
      detail: i18n.t('error.exportError', { error: err })
    }

    if (mainWindow) {
      dialog.showMessageBox(mainWindow, responseErrorOptions)
    }
  }
  1
}

function savePdfFile(mainWindow: BrowserWindow, data: Uint8Array, name: string) {
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

  mainWindow?.webContents.send('show-spinner', { status: false })
}
