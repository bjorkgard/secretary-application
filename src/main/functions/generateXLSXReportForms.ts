import { BrowserWindow, app, dialog } from 'electron'
import Excel from 'exceljs'
import log from 'electron-log'
import fs from 'fs'
import { ServiceGroupService, ServiceMonthService } from '../../types/type'
import { Report, ServiceGroupModel, ServiceMonthModel } from '../../types/models'
import i18n from '../../localization/i18next.config'
import adjustColumnWidth from '../utils/adjustColumnWidth'
import JSZip from 'jszip'

const isDevelopment = import.meta.env.MAIN_VITE_NODE_ENV !== 'production'

/**
 * Represents a service group with its associated reports.
 */
interface ServiceGroupWithReports {
  serviceGroup: ServiceGroupModel
  reports: Report[]
}

/**
 * Retrieves all service groups from the service group service.
 * @param serviceGroupService - The service group service to retrieve the service groups from.
 * @returns A promise that resolves to an array of service group models.
 */
const getServiceGroups = async (
  serviceGroupService: ServiceGroupService
): Promise<ServiceGroupModel[]> => {
  return await serviceGroupService.find()
}

/**
 * Retrieves a service month model by its ID using the provided service.
 * @param {ServiceMonthService} serviceMonthService - The service used to retrieve the service month model.
 * @param {string} serviceMonthId - The ID of the service month model to retrieve.
 * @returns {Promise<ServiceMonthModel>} - A promise that resolves with the retrieved service month model.
 */
const getServiceMonth = async (
  serviceMonthService: ServiceMonthService,
  serviceMonthId: string
): Promise<ServiceMonthModel> => {
  return await serviceMonthService.findOneById(serviceMonthId)
}

/**
 * Generates an Excel file containing a report for a service group.
 * @param serviceGroupWithReports - The service group with its reports.
 * @returns An object containing the filename and the file buffer of the generated Excel file.
 */
const generateFile = async (
  serviceGroupWithReports: ServiceGroupWithReports
): Promise<{ filename: string; fileBuffer: Buffer }> => {
  const filename = `ServiceGroup_${serviceGroupWithReports.serviceGroup.name}.xlsx`

  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet(i18n.t('reports.reports'), {
    pageSetup: {
      paperSize: 9,
      orientation: 'portrait',
      fitToPage: true
    },
    views: [{ state: 'frozen', ySplit: 1, xSplit: 1, showGridLines: true }]
  })

  const inactives: Report[] = []

  worksheet.columns = [
    { header: i18n.t('reports.name'), key: 'name' },
    { header: i18n.t('reports.hasBeenInService'), key: 'hasBeenInService' },
    { header: i18n.t('reports.studies'), key: 'studies' },
    { header: i18n.t('reports.auxiliary'), key: 'auxiliary' },
    { header: i18n.t('reports.hours'), key: 'hours' },
    { header: i18n.t('reports.remarks'), key: 'remarks' },
    { header: i18n.t('reports.doNotChange'), key: 'identifier' },
    { header: '', key: 'status' },
    { header: '', key: 'type' }
  ]
  const row = worksheet.lastRow
  if (row) {
    row.height = 20
  }

  serviceGroupWithReports.reports.map((report) => {
    if (report.publisherStatus === 'INACTIVE') {
      inactives.push(report)
    } else {
      worksheet.addRow(
        {
          name: report.publisherName,
          hasBeenInService: report.hasBeenInService
            ? i18n.t('label.yes')
            : report.hasNotBeenInService
              ? i18n.t('label.no')
              : i18n.t('label.noReport'),
          studies: report.studies,
          auxiliary: report.auxiliary ? i18n.t('label.yes') : i18n.t('label.no'),
          hours: report.hours,
          remarks: report.remarks,
          identifier: report.identifier,
          status: report.publisherStatus,
          type: report.type
        },
        'i'
      )
    }
  })

  inactives.map((report) => {
    worksheet.addRow(
      {
        name: report.publisherName,
        hasBeenInService: report.hasBeenInService
          ? i18n.t('label.yes')
          : report.hasNotBeenInService
            ? i18n.t('label.no')
            : i18n.t('label.noReport'),
        studies: report.studies,
        auxiliary: report.auxiliary ? i18n.t('label.yes') : i18n.t('label.no'),
        hours: report.hours,
        remarks: report.remarks,
        identifier: report.identifier,
        status: report.publisherStatus,
        type: report.type
      },
      'i'
    )
  })

  worksheet.getRow(1).protection = { locked: true }
  worksheet.getColumn(1).protection = { locked: true }
  adjustColumnWidth(worksheet)

  const header = worksheet.getRow(1)
  header.font = { bold: true }
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D1C7C7' } }
  header.protection = { locked: true }

  const name = worksheet.getColumn(1)
  name.font = { bold: true }
  name.protection = { locked: true }
  name.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D1C7C7' } }

  const hasBeenInServiceCol = worksheet.getColumn(2)
  hasBeenInServiceCol.eachCell((cell) => {
    cell.dataValidation = {
      type: 'list',
      allowBlank: false,
      operator: 'equal',
      formulae: [`"${i18n.t('label.noReport')},${i18n.t('label.yes')},${i18n.t('label.no')}"`]
    }
  })

  const auxiliaryCol = worksheet.getColumn(4)
  auxiliaryCol.eachCell((cell) => {
    cell.dataValidation = {
      type: 'list',
      allowBlank: false,
      operator: 'equal',
      formulae: [`"${i18n.t('label.yes')},${i18n.t('label.no')}"`]
    }
  })

  worksheet.eachRow((row) => {
    if (row.getCell('status').value === 'INACTIVE') {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '6BAFF4' } }
    }
    if (row.getCell('type').value !== 'PUBLISHER' && row.getCell('type').value !== '') {
      row.getCell('hours').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '96FFA1' } }
    }
  })

  worksheet.getRow(1).protection = { locked: true }
  worksheet.getColumn('name').protection = { locked: true }
  worksheet.getColumn('identifier').protection = { locked: true }
  worksheet.getColumn('status').hidden = true
  worksheet.getColumn('type').hidden = true

  await worksheet.protect('mt24:14', {
    selectLockedCells: true,
    selectUnlockedCells: false,
    formatCells: true,
    formatColumns: true,
    formatRows: true,
    insertRows: true,
    insertColumns: true,
    insertHyperlinks: false,
    deleteRows: true,
    deleteColumns: true,
    sort: false,
    autoFilter: false,
    pivotTables: false
  })

  return { filename: filename, fileBuffer: (await workbook.xlsx.writeBuffer()) as Buffer }
}

/**
 * Generates XLSX report forms for each service group in a given service month and saves them as a zip file.
 * @param mainWindow The main window of the application.
 * @param serviceGroupService The service group service.
 * @param serviceMonthService The service month service.
 * @param serviceMonthId The ID of the service month to generate reports for.
 * @returns A Promise that resolves when the reports have been generated and saved.
 */
export default async function GenerateXLSXReportForms(
  mainWindow: BrowserWindow,
  serviceGroupService: ServiceGroupService,
  serviceMonthService: ServiceMonthService,
  serviceMonthId: string
): Promise<void> {
  const serviceGroups = await getServiceGroups(serviceGroupService)
  const serviceMonth = await getServiceMonth(serviceMonthService, serviceMonthId)
  const zip = new JSZip()

  //const files: string[] = []
  const serviceGroupWithReports: ServiceGroupWithReports[] = []
  const reportDirectory = isDevelopment ? './reports/' : app.getPath('userData') + '/reports/'
  if (!fs.existsSync(reportDirectory)) {
    fs.mkdirSync(reportDirectory)
  }
  // Sort reports in service groups
  if (serviceMonth) {
    for (const serviceGroup of serviceGroups) {
      const reports = serviceMonth.reports.filter(
        (report) => report.publisherServiceGroupId === serviceGroup._id
      )

      serviceGroupWithReports.push({ serviceGroup, reports })
    }
  }

  // Build XLS-file for each service group
  for (const sg of serviceGroupWithReports) {
    await generateFile(sg).then((file) => {
      zip.file(file.filename, file.fileBuffer)
    })
  }

  // Open dialog to save files
  const dialogOptions = {
    title: i18n.t('export.saveAs'),
    defaultPath: app.getPath('downloads') + '/reports.zip',
    extensions: ['zip'],
    buttonLabel: i18n.t('export.save')
  }

  dialog
    .showSaveDialog(mainWindow, dialogOptions)
    .then((response) => {
      if (!response.canceled && response.filePath) {
        zip
          .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
          .pipe(fs.createWriteStream(response.filePath))
          .on('finish', function () {
            log.info('zip written.')
          })
      }
    })
    .catch((err) => {
      log.error(err)
    })
}
