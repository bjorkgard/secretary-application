import { type BrowserWindow, app, dialog } from 'electron'
import log                                 from 'electron-log'
import { PDFDocument }                     from 'pdf-lib'
import fs                                  from 'fs-extra'
import i18n                                from '../../localization/i18next.config'
import ServiceYearService                  from '../services/serviceYearService'
import SettingsService                     from '../services/settingsService'
import ServiceMonthService                 from '../services/serviceMonthService'
import PublisherService                    from '../services/publisherService'
import generateCongregationS21             from './generateCongregationS21'

const publisherService    = new PublisherService()
const settingsService     = new SettingsService()
const serviceMonthService = new ServiceMonthService()
const serviceYearService  = new ServiceYearService()

export default async function exportCongregationS21(
  mainWindow: BrowserWindow,
  serviceYearName: number,
): Promise<void> {
  const settings      = await settingsService.find()
  const publishers    = await publisherService.find('lastname')
  const serviceMonths = await serviceYearService.findByServiceYear(serviceYearName).then(async (sy) => {
    if (!sy) {
      log.error(`Service year ${serviceYearName} not found`)
      return
    }

    const months = await serviceMonthService.findByIds(sy.serviceMonths)

    return months
  })

  const fileName = `S-21_${settings?.congregation.name}_${new Date().toLocaleDateString('sv')}.pdf`

  if (serviceMonths && settings) {
    try {
      const mergedPdf = await PDFDocument.create()

      if (publishers.some(p => p.appointments.some(a => a.type === 'SPECIAL_PIONEER'))) {
        await generateCongregationS21(settings, serviceMonths, 'SPECIAL_PIONEER').then(async (pdfBytes) => {
          const newPage     = await PDFDocument.load(pdfBytes)
          const copiedPages = await mergedPdf.copyPages(newPage, newPage.getPageIndices())
          copiedPages.forEach(page => mergedPdf.addPage(page))
        })
      }

      if (publishers.some(p => p.appointments.some(a => a.type === 'MISSIONARY'))) {
        await generateCongregationS21(settings, serviceMonths, 'MISSIONARY').then(async (pdfBytes) => {
          const newPage     = await PDFDocument.load(pdfBytes)
          const copiedPages = await mergedPdf.copyPages(newPage, newPage.getPageIndices())
          copiedPages.forEach(page => mergedPdf.addPage(page))
        })
      }

      if (publishers.some(p => p.appointments.some(a => a.type === 'PIONEER'))) {
        await generateCongregationS21(settings, serviceMonths, 'PIONEER').then(async (pdfBytes) => {
          const newPage     = await PDFDocument.load(pdfBytes)
          const copiedPages = await mergedPdf.copyPages(newPage, newPage.getPageIndices())
          copiedPages.forEach(page => mergedPdf.addPage(page))
        })
      }

      await generateCongregationS21(settings, serviceMonths, 'AUXILIARY').then(async (pdfBytes) => {
        const newPage     = await PDFDocument.load(pdfBytes)
        const copiedPages = await mergedPdf.copyPages(newPage, newPage.getPageIndices())
        copiedPages.forEach(page => mergedPdf.addPage(page))
      })

      await generateCongregationS21(settings, serviceMonths, 'PUBLISHER').then(async (pdfBytes) => {
        const newPage     = await PDFDocument.load(pdfBytes)
        const copiedPages = await mergedPdf.copyPages(newPage, newPage.getPageIndices())
        copiedPages.forEach(page => mergedPdf.addPage(page))
      })

      await generateCongregationS21(settings, serviceMonths, 'TOTAL').then(async (pdfBytes) => {
        const newPage     = await PDFDocument.load(pdfBytes)
        const copiedPages = await mergedPdf.copyPages(newPage, newPage.getPageIndices())
        copiedPages.forEach(page => mergedPdf.addPage(page))
      })

      const mergedPdfBytes = await mergedPdf.save()

      savePdfFile(mainWindow, mergedPdfBytes, fileName)
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

  mainWindow?.webContents.send('show-spinner', { status: false })
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
