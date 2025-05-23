import { formatPhoneNumber }     from 'react-phone-number-input'
import type { BrowserWindow }    from 'electron'
import { app, dialog }           from 'electron'
import { jsPDF }                 from 'jspdf'
import type { UserOptions }      from 'jspdf-autotable'
import fs                        from 'fs-extra'
import log                       from 'electron-log'
import type { PublisherModel }   from '../../types/models'
import type { PublisherService } from '../../types/type'
import SettingsService           from '../services/settingsService'
import i18n                      from '../../localization/i18next.config'
import 'jspdf-autotable'

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF
}

const settingsService = new SettingsService()

function getTableHeaders(status: string): string[] {
  return [
    i18n.t('export.name'),
    i18n.t('export.address'),
    i18n.t('export.phone'),
    i18n.t('export.email'),
    status === 'INACTIVE' ? i18n.t('export.lastReport') : i18n.t('export.missingReports'),
  ]
}

function getPublisherRows(publishers: PublisherModel[], status: string): string[][] {
  const rows: string[][] = []

  for (const publisher of publishers) {
    const missingReports: string[] = []

    const reports = publisher.reports.sort((a, b) => b.serviceYear - a.serviceYear || b.sortOrder - a.sortOrder)
    if (status === 'INACTIVE') {
      for (let i = 0; i < reports.length; i++) {
        if (reports[i].hasBeenInService) {
          missingReports.push(reports[i].serviceMonth)
          break
        }
      }
      if (!missingReports.length) {
        missingReports.push(publisher.other || '')
      }
    }
    else {
      for (let i = 0; i < 6; i++) {
        if (reports[i].hasNotBeenInService)
          missingReports.push(reports[i].serviceMonth)
      }
    }

    const publisherRow = [
      `${publisher.lastname}, ${publisher.firstname}`,
      `${publisher.address} \r\n${publisher.zip} ${publisher.city}`,
      `${publisher.phone ? formatPhoneNumber(publisher.phone) : ''} ${publisher.phone ? ' \r\n' : ''}${publisher.mobile ? formatPhoneNumber(publisher.mobile) : ''}`,
      publisher.email || '',
      missingReports.join(', '),
    ]

    rows.push(publisherRow)
  }

  return rows
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

async function generate_PDF(mainWindow: BrowserWindow,  publishers: PublisherModel[],  status: string, name: string): Promise<void> {
  const settings = await settingsService.find()
  const rows     = getPublisherRows(publishers, status)

  // eslint-disable-next-line new-cap
  const pdfDoc = new jsPDF() as jsPDFWithPlugin
  pdfDoc.setProperties({
    title:    'Publishers List',
    creator:  `${settings?.user.firstname} ${settings?.user.lastname}`,
    keywords: `list, publisher, congregation, ${status}`,
  })

  const pageSize = pdfDoc.internal.pageSize

  let title = i18n.t('export.publishers')
  if (status === 'IRREGULAR') {
    title = i18n.t('export.irregularPublishers')
  }
  if (status === 'INACTIVE') {
    title = i18n.t('export.inactivePublishers')
  }

  // Header
  pdfDoc.setFontSize(22)
  pdfDoc.setFont('helvetica', 'bold')
  pdfDoc.text(
    title,
    pageSize.getWidth() / 2,
    12,
    { align: 'center' },
  )

  // Table
  const totalPagesExp = '{total_pages_count_string}'
  pdfDoc.autoTable({
    head:        [getTableHeaders(status)],
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
      2: { cellWidth: 40 },
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
    startY:       20,
    rowPageBreak: 'avoid',
    theme:        'plain',
  })
  if (typeof pdfDoc.putTotalPages === 'function')
    pdfDoc.putTotalPages(totalPagesExp)

  savePdfFile(mainWindow, `${name}.pdf`, pdfDoc.output('arraybuffer'))
}

export default async function ExportPublishersList(
  mainWindow: BrowserWindow,
  publisherService: PublisherService,
  status: string,
): Promise<void> {
  const publishers = await publisherService.findByStatus([status])
  let name         = ''

  if (status === 'IRREGULAR') {
    name = `IrregularList_${new Date().toLocaleDateString('sv')}`
  }
  else if (status === 'INACTIVE') {
    name = `InactiveList_${new Date().toLocaleDateString('sv')}`
  }

  generate_PDF(mainWindow, publishers, status, name)
}
