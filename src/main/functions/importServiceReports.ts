import type { BrowserWindow, OpenDialogOptions } from 'electron'
import { dialog }                                from 'electron'
import Excel                                     from 'exceljs'
import log                                       from 'electron-log'
import i18n                                      from '../../localization/i18next.config'
import type { ServiceMonthService }              from '../../types/type'
import type { ImportedReport }                   from '../../types/models'

export default function importServiceReports(
  mainWindow: BrowserWindow,
  serviceMonthService: ServiceMonthService,
): void {
  const options: OpenDialogOptions = {
    title:       i18n.t('importServiceReports.title'),
    buttonLabel: i18n.t('label.import'),
    filters:     [{ name: 'xlsx', extensions: ['xlsx'] }],
    properties:  ['openFile'],
  }

  dialog.showOpenDialog(mainWindow, options).then((result) => {
    if (!result.canceled) {
      const workbook = new Excel.Workbook()
      workbook.xlsx.readFile(result.filePaths[0]).then(async () => {
        const worksheet = workbook.getWorksheet(1)

        if (worksheet) {
          const reports: ImportedReport[] = []

          worksheet.eachRow((row, rowNumber) => {
            const report: ImportedReport = {
              identifier:          '',
              hasBeenInService:    false,
              hasNotBeenInService: false,
              auxiliary:           false,
            }

            if (rowNumber > 1) {
              report.identifier          = row.getCell('G').value?.toString() || ''
              report.hasBeenInService    = row.getCell('B').value === i18n.t('label.yes')
              report.hasNotBeenInService = row.getCell('B').value === i18n.t('label.no')
              report.auxiliary           = row.getCell('D').value === i18n.t('label.yes')
              report.studies             = Number.parseInt(row.getCell('C').value?.toString() || '') || undefined
              report.hours               = Number.parseInt(row.getCell('E').value?.toString() || '') || undefined
              report.remarks             = row.getCell('F').value?.toString()

              reports.push(report)
            }
          })

          const date = new Date()
          date.setDate(0)

          const serviceMonth = await serviceMonthService.findByServiceMonth(
            `${date.getFullYear()}-${date.getMonth() + 1}`,
          )

          if (serviceMonth && serviceMonth._id) {
            for (const report of reports) {
              const reportIndex                 = serviceMonth.reports.findIndex(
                r => r.identifier === report.identifier,
              )
              serviceMonth.reports[reportIndex] = {
                ...serviceMonth.reports[reportIndex],
                ...report,
              }
            }

            serviceMonthService.update(serviceMonth._id, serviceMonth)

            return dialog.showMessageBox(mainWindow, {
              type:      'info' as const,
              buttons:   ['OK'],
              defaultId: 0,
              title:     i18n.t('importServiceReports.imported'),
              message:   i18n.t('importServiceReports.importedMessage'),
              detail:    '',
            })
          }
          else {
            log.error('No service month found')
            return dialog.showMessageBox(mainWindow, {
              type:      'info' as const,
              buttons:   ['OK'],
              defaultId: 0,
              title:     i18n.t('importServiceReports.errorImported'),
              message:   i18n.t('importServiceReports.errorImportedMessage'),
              detail:    '',
            })
          }
        }

        return dialog.showMessageBox(mainWindow, {
          type:      'info' as const,
          buttons:   ['OK'],
          defaultId: 0,
          title:     i18n.t('importServiceReports.errorImported'),
          message:   i18n.t('importServiceReports.errorImportedMessage'),
          detail:    '',
        })
      })
    }
  })
}
