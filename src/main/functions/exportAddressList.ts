import type { BrowserWindow }                     from 'electron'
import { app, dialog }                            from 'electron'
import Excel                                      from 'exceljs'
import { formatPhoneNumber }                      from 'react-phone-number-input'
import { jsPDF }                                  from 'jspdf'
import type { UserOptions }                       from 'jspdf-autotable'
import fs                                         from 'fs-extra'
import log                                        from 'electron-log'
import type { PublisherModel, ServiceGroupModel } from '../../types/models'
import type { PublisherService }                  from '../../types/type'
import ServiceGroupService                        from '../services/serviceGroupService'
import SettingsService                            from '../services/settingsService'
import i18n                                       from '../../localization/i18next.config'
import adjustColumnWidth                          from '../utils/adjustColumnWidth'
import CircuitOverseerService                     from '../services/circuitOverseerService'
import 'jspdf-autotable'

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF
}

const settingsService        = new SettingsService()
const serviceGroupService    = new ServiceGroupService()
const circuitOverseerService = new CircuitOverseerService()

function getTableHeaders(): string[] {
  return [
    i18n.t('export.group'),
    i18n.t('export.name'),
    i18n.t('export.address'),
    i18n.t('export.phone'),
    i18n.t('export.mobile'),
    i18n.t('export.email'),
    i18n.t('export.other'),
  ]
}

function getPublisherRows(publishers: PublisherModel[],  serviceGroups: ServiceGroupModel[]): string[][] {
  const rows: string[][] = []

  for (const publisher of publishers) {
    const serviceGroupName
      = serviceGroups.find(sg => sg._id === publisher.serviceGroupId)?.name || '-'
    let other = ''

    if (publisher.status === 'INACTIVE')
      other += `${i18n.t('label.inactive')}\n`

    if (publisher.appointments.length) {
      publisher.appointments.forEach((appointment) => {
        other += `${i18n.t(`export.${appointment.type.toLowerCase()}`)}, `
      })

      other = `${other.slice(0, -2)}\n`
    }

    if (publisher.children.length) {
      // other += `${i18n.t('label.children')}: `
      other += ''
      publisher.children.forEach((child, index) => {
        other += (index > 0 ? ', ' : '') + child.name
      })
      other += '\n'
    }

    if (other !== '')
      other = other.slice(0, -1)

    const publisherRow = [
      serviceGroupName,
      `${publisher.lastname}, ${publisher.firstname}`,
      `${publisher.address}\n${publisher.zip} ${publisher.city}`,
      publisher.phone ? formatPhoneNumber(publisher.phone) : '',
      publisher.mobile ? formatPhoneNumber(publisher.mobile) : '',
      publisher.email || '',
      other,
    ]

    rows.push(publisherRow)
  }

  return rows
}

function saveXlsxFile(mainWindow: BrowserWindow, name: string, workbook: Excel.Workbook): void {
  const dialogOptions = {
    title:       i18n.t('export.saveAs'),
    defaultPath: `${app.getPath('downloads')}/${name}`,
    buttonLabel: i18n.t('export.save'),
  }

  dialog
    .showSaveDialog(mainWindow, dialogOptions)
    .then((response) => {
      if (!response.canceled && response.filePath) {
        if (workbook)
          workbook.xlsx.writeFile(response.filePath)
      }
    })
    .catch((err) => {
      log.error(err)
      mainWindow?.webContents.send('show-spinner', { status: false })
    })
  mainWindow?.webContents.send('show-spinner', { status: false })
}

function savePdfFile(mainWindow: BrowserWindow, name: string, data: ArrayBuffer): void {
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
      mainWindow?.webContents.send('show-spinner', { status: false })
    })

  mainWindow?.webContents.send('show-spinner', { status: false })
}

async function generate_PDF(mainWindow: BrowserWindow,  publishers: PublisherModel[],  serviceGroups: ServiceGroupModel[],  name: string): Promise<void> {
  const settings        = await settingsService.find()
  const circuitOverseer = await circuitOverseerService.find()
  const rows            = getPublisherRows(publishers, serviceGroups)

  if (circuitOverseer) {
    rows.push([])
    rows.push(['', i18n.t('label.circuitOverseer')])
    rows.push([
      '',
      `${circuitOverseer.lastname}, ${circuitOverseer.firstname}`,
      `${circuitOverseer.address}\n${circuitOverseer.zip} ${circuitOverseer.city}`,
      circuitOverseer.phone ? formatPhoneNumber(circuitOverseer.phone) : '',
      circuitOverseer.mobile ? formatPhoneNumber(circuitOverseer.mobile) : '',
      circuitOverseer.email || '',
    ])
  }

  // eslint-disable-next-line new-cap
  const pdfDoc = new jsPDF() as jsPDFWithPlugin
  pdfDoc.setProperties({
    title:    'Address List',
    creator:  `${settings?.user.firstname} ${settings?.user.lastname}`,
    keywords: 'address, list, publisher, congregation',
  })

  const pageSize = pdfDoc.internal.pageSize

  // Header
  pdfDoc.setFontSize(22)
  pdfDoc.setFont('helvetica', 'bold')
  pdfDoc.text(
    settings?.congregation.name || i18n.t('label.addresslist'),
    pageSize.getWidth() / 2,
    12,
    { align: 'center' },
  )
  pdfDoc.setFontSize(8)
  pdfDoc.setFont('helvetica', 'normal')
  pdfDoc.text(i18n.t('export.disclaimer'), pageSize.getWidth() / 2, 17, { align: 'center' })

  // Table
  const totalPagesExp = '{total_pages_count_string}'
  pdfDoc.autoTable({
    head:        [getTableHeaders()],
    body:        rows,
    didDrawPage: (data) => {
      // Footer
      let str = `${i18n.t('label.page')} ${pdfDoc.getNumberOfPages()}`
      // Total page number plugin only available in jspdf v1.0+
      if (typeof pdfDoc.putTotalPages === 'function')
        str = `${str} ${i18n.t('label.of')} ${totalPagesExp}`

      pdfDoc.setFont('helvetica', 'normal')
      pdfDoc.setFontSize(8)

      const pageHeight = pageSize.getHeight()
      pdfDoc.text(str, data.settings.margin.left, pageHeight - 10)
      pdfDoc.text(
        new Date().toLocaleString(`sv-${settings?.congregation.country}`),
        200,
        pageHeight - 10,
        {
          align: 'right',
        },
      )
    },
    margin:       { top: 10, left: 6, right: 6, bottom: 15 },
    columnStyles: {
      2: { cellWidth: 46 },
      3: { overflow: 'linebreak', cellWidth: 'auto' },
      4: { overflow: 'linebreak', cellWidth: 'auto' },
    },
    styles: {
      cellPadding: 1,
      fontSize:    8,
      overflow:    'linebreak',
      valign:      'middle',
      lineWidth:   0.1,
    },
    startY:       25,
    rowPageBreak: 'avoid',
    theme:        'plain',
  })
  if (typeof pdfDoc.putTotalPages === 'function')
    pdfDoc.putTotalPages(totalPagesExp)

  savePdfFile(mainWindow, `${name}.pdf`, pdfDoc.output('arraybuffer'))
}

async function generate_XLSX(mainWindow: BrowserWindow,  publishers: PublisherModel[],  serviceGroups: ServiceGroupModel[],  name: string): Promise<void> {
  const settings        = await settingsService.find()
  const circuitOverseer = await circuitOverseerService.find()
  const rows            = getPublisherRows(publishers, serviceGroups)

  const workbook   = new Excel.Workbook()
  workbook.creator = settings?.congregation.name || 'SECRETARY'
  workbook.created = new Date()

  const worksheet = workbook.addWorksheet('Sheet1', {
    pageSetup: {
      fitToPage:        true,
      paperSize:        9,
      verticalCentered: true,
      showGridLines:    false,
      margins:          {
        left:   0.2,
        right:  0.2,
        top:    0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.1,
      },
    },
    headerFooter: {
      differentFirst: true,
      firstHeader:    `&C&8${i18n.t('export.disclaimer')}`,
      firstFooter:    `&L&8&K000000${new Date().toLocaleString('sv-SE', {
        hour12: false,
      })}&R&8&K000000${i18n.t('label.page')} &P ${i18n.t('label.of')} &N`,
      oddFooter: `&L&8&K000000${new Date().toLocaleString('sv-SE', {
        hour12: false,
      })}&R&8&K000000${i18n.t('label.page')} &P ${i18n.t('label.of')} &N`,
    },
    views: [{ state: 'frozen', xSplit: 0, ySplit: 2 }],
  })

  worksheet.columns = [
    { key: 'serviceGroup' },
    { key: 'name' },
    { key: 'address' },
    { key: 'phone' },
    { key: 'cell' },
    { key: 'email' },
    { key: 'other' },
  ]
  worksheet.insertRow(1, [settings?.congregation.name])
  worksheet.mergeCells('A1:G1')
  worksheet.insertRow(2, getTableHeaders())
  worksheet.getRow(1).font      = { size: 24, bold: true }
  worksheet.getRow(1).alignment = { horizontal: 'center' }
  worksheet.getRow(2).font      = { bold: true }
  worksheet.getRow(2).border    = { bottom: { style: 'medium' } }

  worksheet.addRows(rows)

  if (circuitOverseer) {
    worksheet.addRow([])
    worksheet.addRow(['', i18n.t('label.circuitOverseer')]).font = { bold: true }
    const lastRow                                                = worksheet.lastRow
    if (lastRow)
      worksheet.mergeCells(`B${lastRow.number}:G${lastRow.number}`)

    worksheet.addRow([
      '',
      `${circuitOverseer.lastname}, ${circuitOverseer.firstname}`,
      `${circuitOverseer.address}\n${circuitOverseer.zip} ${circuitOverseer.city}`,
      circuitOverseer.phone ? formatPhoneNumber(circuitOverseer.phone) : '',
      circuitOverseer.mobile ? formatPhoneNumber(circuitOverseer.mobile) : '',
      circuitOverseer.email || '',
    ])
  }

  adjustColumnWidth(worksheet)

  worksheet.eachRow((row) => {
    row.alignment = { vertical: 'middle' }
    row.eachCell((cell) => {
      if (cell.value && cell.value.toString().includes(i18n.t('label.inactive')))
        row.font = { color: { argb: '0000FF' }, italic: true }
    })
  })

  try {
    saveXlsxFile(mainWindow, `${name}.xlsx`, workbook)
  }
  catch (err) {
    log.error(err)
    mainWindow?.webContents.send('show-spinner', { status: false })
  }
}

export default async function ExportAddressList(
  mainWindow: BrowserWindow,
  publisherService: PublisherService,
  sortType: string,
  type: string,
): Promise<void> {
  let publishers: PublisherModel[] = []
  const serviceGroups              = await serviceGroupService.find()

  if (sortType === 'NAME') {
    publishers = await publisherService.find('LASTNAME')
  }
  else {
    const rawPublishers = await publisherService.find('LASTNAME')
    serviceGroups.forEach((sg) => {
      const filteredPublishers = rawPublishers.filter(p => p.serviceGroupId === sg._id)
      publishers               = publishers.concat(filteredPublishers)
    })
    // add publisher without service group
    rawPublishers.forEach((p) => {
      if (!publishers.includes(p))
        publishers.push(p)
    })
  }

  const name = `AddressList_${sortType.toLowerCase()}_${new Date().toLocaleDateString('sv')}`

  if (type === 'XLSX')
    generate_XLSX(mainWindow, publishers, serviceGroups, name)

  else
    generate_PDF(mainWindow, publishers, serviceGroups, name)
}
