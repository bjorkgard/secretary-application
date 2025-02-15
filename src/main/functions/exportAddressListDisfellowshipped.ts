import type { BrowserWindow }    from 'electron'
import { app, dialog }           from 'electron'
import Excel                     from 'exceljs'
import { formatPhoneNumber }     from 'react-phone-number-input'
import { jsPDF }                 from 'jspdf'
import type { UserOptions }      from 'jspdf-autotable'
import fs                        from 'fs-extra'
import log                       from 'electron-log'
import type { PublisherModel }   from '../../types/models'
import type { PublisherService } from '../../types/type'
import SettingsService           from '../services/settingsService'
import i18n                      from '../../localization/i18next.config'
import adjustColumnWidth         from '../utils/adjustColumnWidth'
import 'jspdf-autotable'

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF
}

const settingsService = new SettingsService()

function getTableHeaders(): string[] {
  return [
    i18n.t('export.date'),
    i18n.t('export.name'),
    i18n.t('export.address'),
    i18n.t('export.phone'),
    i18n.t('export.mobile'),
    i18n.t('export.email'),
    i18n.t('export.other'),
  ]
}

function getPublisherRows(publishers: PublisherModel[]): string[][] {
  const rows: string[][] = []

  for (const publisher of publishers) {
    let date  = ''
    let other = ''

    const history = publisher.histories.find((h) => {
      return (h.type === 'DISASSOCIATION' || h.type === 'DISFELLOWSHIPPED')
    })

    if (history) {
      date = history.date
    }

    if (publisher.children.length) {
      // other += `${i18n.t('label.children')}: `
      other += ''
      publisher.children.forEach((child, index) => {
        other += (index > 0 ? ', ' : '') + child.name
      })
      other += ' \r\n'
    }

    if (other !== '')
      other = other.slice(0, -1)

    const publisherRow = [
      date,
      `${publisher.lastname}, ${publisher.firstname}`,
      `${publisher.address} \r\n${publisher.zip} ${publisher.city}`,
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
          fs.writeFileSync(response.filePath, new Uint8Array(data))
      }
    })
    .catch((err) => {
      log.error(err)
      mainWindow?.webContents.send('show-spinner', { status: false })
    })

  mainWindow?.webContents.send('show-spinner', { status: false })
}

async function generate_PDF(mainWindow: BrowserWindow,  publishers: PublisherModel[], name: string): Promise<void> {
  const settings = await settingsService.find()
  const rows     = getPublisherRows(publishers)

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

async function generate_XLSX(mainWindow: BrowserWindow,  publishers: PublisherModel[],  name: string): Promise<void> {
  const settings = await settingsService.find()
  const rows     = getPublisherRows(publishers)

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
    { key: 'date' },
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

  adjustColumnWidth(worksheet)

  worksheet.eachRow((row) => {
    row.alignment = { vertical: 'middle' }
    row.height    = 30
    row.eachCell((cell) => {
      if (cell.value && cell.value.toString().includes(i18n.t('label.inactive')))
        row.font = { color: { argb: '0000FF' }, italic: true }
    })
  })
  worksheet.eachColumnKey((col) => {
    col.eachCell((cell) => {
      cell.alignment = { wrapText: true }
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

export default async function ExportAddressListDisfellowshipped(
  mainWindow: BrowserWindow,
  publisherService: PublisherService,
  type: string,
): Promise<void> {
  let publishers: PublisherModel[] = []

  publishers = await publisherService.findByStatus(['DISFELLOWSHIPPED', 'DISASSOCIATION'])

  const name = `AddressList_Removed_${new Date().toLocaleDateString('sv')}`

  if (type === 'XLSX')
    generate_XLSX(mainWindow, publishers, name)

  else
    generate_PDF(mainWindow, publishers, name)
}
