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

function getTableHeaders(): string[] {
  return [
    i18n.t('export.name'),
    i18n.t('export.s290'),
    i18n.t('export.registerCard'),
    i18n.t('export.emergencyContact'),
  ]
}

function getPublisherRows(publishers: PublisherModel[]): string[][] {
  const rows: string[][] = []

  for (const publisher of publishers) {
    const publisherRow = [
      `${publisher.lastname}, ${publisher.firstname}`,
      publisher.s290 ? 'X' : '',
      publisher.registerCard ? 'X' : '',
      publisher.emergencyContact.name ? 'X' : '',
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

async function generate_PDF(mainWindow: BrowserWindow,  publishers: PublisherModel[],  name: string): Promise<void> {
  const settings = await settingsService.find()
  const rows     = getPublisherRows(publishers)

  // eslint-disable-next-line new-cap
  const pdfDoc = new jsPDF() as jsPDFWithPlugin
  pdfDoc.setProperties({
    title:    'Completion List',
    creator:  `${settings?.user.firstname} ${settings?.user.lastname}`,
    keywords: 'list, publisher, congregation',
  })

  const pageSize = pdfDoc.internal.pageSize

  // Header
  pdfDoc.setFontSize(22)
  pdfDoc.setFont('helvetica', 'bold')
  pdfDoc.text(
    i18n.t('export.completionList'),
    pageSize.getWidth() / 2,
    12,
    { align: 'center' },
  )
  pdfDoc.setFontSize(8)
  pdfDoc.setFont('helvetica', 'normal')
  pdfDoc.text(i18n.t('export.completionListDescription'), pageSize.getWidth() / 2, 17, { align: 'center' })

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

export default async function ExportCompletionList(
  mainWindow: BrowserWindow,
  publisherService: PublisherService,
): Promise<void> {
  const rawPublishers = await publisherService.find('LASTNAME')
  const publishers    = rawPublishers.filter(publisher => !publisher.s290 || !publisher.registerCard || !publisher.emergencyContact.name)

  const name = `CompletionList_${new Date().toLocaleDateString('sv')}`

  generate_PDF(mainWindow, publishers, name)
}
