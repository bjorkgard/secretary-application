import type { BrowserWindow }     from 'electron'
import { app, dialog }            from 'electron'
import log                        from 'electron-log'
import fs                         from 'fs-extra'
import JSZip                      from 'jszip'
import { PDFDocument }            from 'pdf-lib'
import i18n                       from '../../localization/i18next.config'
import SettingsService            from '../services/settingsService'
import ServiceYearService         from '../services/serviceYearService'
import ServiceMonthService        from '../services/serviceMonthService'
import type { ServiceMonthModel } from '../../types/models'
import generateS88                from './generateS88'

interface MeetingAttendanceExport {
  serviceYear:   number
  serviceMonths: ServiceMonthModel[]
}

const settingsService     = new SettingsService()
const serviceYearService  = new ServiceYearService()
const serviceMonthService = new ServiceMonthService()

function firstAndLast(arr: number[]): string {
  const firstItem = arr[0]
  const lastItem  = arr[arr.length - 1]

  if (firstItem === lastItem)
    return firstItem.toString()
  else
    return `${firstItem.toString()}-${lastItem.toString()}`
}

export default async function exportS88(
  mainWindow: BrowserWindow,
  serviceYears: number[],
): Promise<void> {
  const mergedPdf                                          = await PDFDocument.create()
  const zip                                                = new JSZip()
  const fileName                                           = `S-88_${firstAndLast(serviceYears)}_${new Date().toLocaleDateString('sv')}`
  const meetingAttendanceExport: MeetingAttendanceExport[] = []

  const settings       = await settingsService.find()
  const languageGroups = settings?.congregation.languageGroups

  for await (const sy of serviceYears) {
    await serviceYearService.findByServiceYear(sy).then(async (serviceYear) => {
      if (serviceYear) {
        const serviceMonths                 = await serviceMonthService.findByIds(serviceYear.serviceMonths)
        const temp: MeetingAttendanceExport = { serviceYear: sy, serviceMonths }
        meetingAttendanceExport.push(temp)
      }
    })
  }

  try {
    // every meetingAttendanceExport has 2 years
    for (let index = 0; index < meetingAttendanceExport.length; index += 2) {
      await generateS88(
        '',
        meetingAttendanceExport[index],
        meetingAttendanceExport[index + 1],
      ).then(async (pdfBytes) => {
        if (settings?.mergePdf) {
          const page        = await PDFDocument.load(pdfBytes)
          const copiedPages = await mergedPdf.copyPages(page, page.getPageIndices())
          copiedPages.forEach(page => mergedPdf.addPage(page))
        }
        else {
          zip.file(`S-88_${new Date().toLocaleDateString('sv')}.pdf`, pdfBytes)
        }
      })

      if (languageGroups && languageGroups.length > 0) {
        for await (const languageGroup of languageGroups) {
          await generateS88(
            languageGroup.name,
            meetingAttendanceExport[index],
            meetingAttendanceExport[index + 1],
          ).then(async (pdfBytes) => {
            if (settings?.mergePdf) {
              const page        = await PDFDocument.load(pdfBytes)
              const copiedPages = await mergedPdf.copyPages(page, page.getPageIndices())
              copiedPages.forEach(page => mergedPdf.addPage(page))
            }
            else {
              zip.file(`S-88_${languageGroup.name}_${new Date().toLocaleDateString('sv')}.pdf`, pdfBytes)
            }
          })
        }
        // combind languageGroups and mother congregation
        await generateS88(
          'COMBIND',
          meetingAttendanceExport[index],
          meetingAttendanceExport[index + 1],
        ).then(async (pdfBytes) => {
          if (settings?.mergePdf) {
            const page        = await PDFDocument.load(pdfBytes)
            const copiedPages = await mergedPdf.copyPages(page, page.getPageIndices())
            copiedPages.forEach(page => mergedPdf.addPage(page))
          }
          else {
            zip.file(`S-88_TOTAL_${new Date().toLocaleDateString('sv')}.pdf`, pdfBytes)
          }
        })
      }
    }

    if (settings?.mergePdf) {
      const mergedPdfBytes = await mergedPdf.save()
      savePdfFile(mainWindow, mergedPdfBytes, `${fileName}.pdf`)
    }
    else {
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
