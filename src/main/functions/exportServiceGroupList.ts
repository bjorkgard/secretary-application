import { type BrowserWindow, app, dialog }   from 'electron'
import { jsPDF }                             from 'jspdf'
import type { Cell, CellInput, UserOptions } from 'jspdf-autotable'
import fs                                    from 'fs-extra'
import log                                   from 'electron-log'
import Excel                                 from 'exceljs'
import type ServiceGroupService              from '../services/serviceGroupService'
import type PublisherService                 from '../services/publisherService'
import 'jspdf-autotable'
import type SettingsService                  from '../services/settingsService'
import i18n                                  from '../../localization/i18next.config'
import adjustColumnWidth                     from '../utils/adjustColumnWidth'
import type {
  PublisherModel,
  ServiceGroupModel,
} from '../../types/models'

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF
}

function processText(text: string) {
  const parts = text.split(/(<\/?b>|<\/?i>|<br>)/).filter(part => part.trim() !== '')

  return parts
}

function renderText(doc: jsPDF, cell: Cell, text: CellInput | HTMLTableCellElement) {
  const parts    = processText(text as string)
  const paddHV   = Number(cell.padding('vertical'))
  const { x, y } = cell.getTextPos()
  let textPosX   = x
  let textPosY   = y + paddHV
  const gfs      = (cell.styles.fontSize / doc.internal.scaleFactor) * 1.15

  doc.setFont('helvetica', 'normal')

  parts.forEach((part) => {
    if (part === '<b>') {
      doc.setFont('helvetica', 'bold')
    }
    else if (part === '</b>') {
      doc.setFont('helvetica', 'normal')
    }
    else if (part === '<i>') {
      doc.setFont('helvetica', 'italic')
    }
    else if (part === '</i>') {
      doc.setFont('helvetica', 'normal')
    }
    else if (part === '<br>') {
      textPosX  = x
      textPosY += gfs
    }
    else {
      const textWidth = doc.getTextWidth(part)
      doc.text(part, textPosX, textPosY)
      textPosX += textWidth
    }
  })
}

function buildPublisherList(serviceGroup: ServiceGroupModel, publishers: PublisherModel[], inactivePublishers: PublisherModel[]): string {
  let publisherLists = ''

  if (serviceGroup === null || serviceGroup.name === 'TEMPORARY')
    return ''

  const completeList = publishers.concat(inactivePublishers)
  completeList.sort((a, b) => {
    return a.lastname.localeCompare(b.lastname) || a.firstname.localeCompare(b.firstname)
  })

  for (const publisher of completeList) {
    if (publisher.s290) {
      if (publisher.serviceGroupId === serviceGroup._id) {
        if (serviceGroup.responsibleId === publisher._id)
          publisherLists += `<b>${publisher.firstname} ${publisher.lastname}</b><br>`

        else if (serviceGroup.assistantId === publisher._id)
          publisherLists += `<i>${publisher.firstname} ${publisher.lastname}</i><br>`

        else
          publisherLists += `${publisher.firstname} ${publisher.lastname}<br>`
      }
    }
  }

  return publisherLists
}

function buildHeader(serviceGroup: ServiceGroupModel): string {
  if (serviceGroup) {
    if (serviceGroup.name === 'TEMPORARY')
      return ''

    else
      return serviceGroup.name
  }

  return ''
}

export default async function ExportServiceGroupList(
  mainWindow: BrowserWindow,
  settingsService: SettingsService,
  serviceGroupService: ServiceGroupService,
  publisherService: PublisherService,
  type: 'PDF' | 'XLSX',
  inactives: string[],
): Promise<void> {
  const settings           = await settingsService.find()
  const serviceGroups      = await serviceGroupService.find()
  const publishers         = await publisherService.findByStatus(['ACTIVE', 'IRREGULAR'])
  const inactivePublishers = await publisherService.findByIds(inactives)
  const name               = `ServiceGroups`
  const noServiceGroupRows = Math.round(serviceGroups.length / 4)

  if (type === 'PDF') {
  // eslint-disable-next-line new-cap
    const pdfDoc = new jsPDF() as jsPDFWithPlugin & { autoTable: { previous?: { finalY: number } } }

    pdfDoc.setProperties({
      title:    'Service groups',
      creator:  `${settings?.user.firstname} ${settings?.user.lastname}`,
      keywords: 'service groups, publisher, congregation',
    })

    const pageSize = pdfDoc.internal.pageSize

    pdfDoc.setFontSize(22)
    pdfDoc.setFont('helvetica', 'bold')
    pdfDoc.text(
      i18n.t('label.serviceGroups'),
      pageSize.getWidth() / 2,
      12,
      { align: 'center' },
    )
    pdfDoc.setLineHeightFactor(1.2)

    for (let index = 0; index < noServiceGroupRows; index++) {
      pdfDoc.autoTable({
        head: [
          [
            buildHeader(serviceGroups[(index * 4)]),
            buildHeader(serviceGroups[(index * 4) + 1]),
            buildHeader(serviceGroups[(index * 4) + 2]),
            buildHeader(serviceGroups[(index * 4) + 3]),
          ],
        ],
        body: [
          [
            buildPublisherList(serviceGroups[(index * 4)] || null, publishers, inactivePublishers),
            buildPublisherList(serviceGroups[(index * 4) + 1] || null, publishers, inactivePublishers),
            buildPublisherList(serviceGroups[(index * 4) + 2] || null, publishers, inactivePublishers),
            buildPublisherList(serviceGroups[(index * 4) + 3] || null, publishers, inactivePublishers),
          ],
        ],
        willDrawCell(data) {
          if (data.section === 'body') {
            const cell = data.cell
            const text = cell.raw
            cell.text  = []
            renderText(pdfDoc, cell, text)
          }
        },
        didDrawPage: () => {
          pdfDoc.setFont('helvetica', 'normal')
          pdfDoc.setFontSize(8)
          const pageHeight = pageSize.getHeight()

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
          1: { cellWidth: 50 },
          2: { cellWidth: 50 },
          3: { cellWidth: 50 },
          4: { cellWidth: 50 },
        },
        styles: {
          cellPadding: 1,
          fontSize:    10,
          overflow:    'linebreak',
          valign:      'top',
        },
        rowPageBreak: 'avoid',
        theme:        'plain',
        startY:       index !== 0 ? pdfDoc.autoTable.previous ? pdfDoc.autoTable.previous.finalY + 1 : 20 : 20,
      })
    }

    savePdfFile(mainWindow, `${name}.pdf`, pdfDoc.output('arraybuffer'))
  }
  else {
    // Generate XLSX-file
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
      { key: 'group0' },
      { key: 'space0' },
      { key: 'group1' },
      { key: 'space1' },
      { key: 'group2' },
      { key: 'space2' },
      { key: 'group3' },
    ]
    worksheet.insertRow(1, [i18n.t('label.serviceGroups')])
    worksheet.mergeCells('A1:G1')
    worksheet.getRow(1).font      = { size: 24, bold: true }
    worksheet.getRow(1).alignment = { horizontal: 'center' }

    let ROW = 3

    // Add groups
    for (let index = 0; index < noServiceGroupRows; index++) {
      const HEADER = ROW
      worksheet.insertRow(HEADER, [
        buildHeader(serviceGroups[(index * 4)]),
        ' ',
        buildHeader(serviceGroups[(index * 4) + 1]),
        ' ',
        buildHeader(serviceGroups[(index * 4) + 2]),
        ' ',
        buildHeader(serviceGroups[(index * 4) + 3]),
      ])
      ROW++

      const groupArray = [
        buildPublisherList(serviceGroups[(index * 4)] || null, publishers, inactivePublishers).split('<br>'),
        buildPublisherList(serviceGroups[(index * 4) + 1] || null, publishers, inactivePublishers).split('<br>'),
        buildPublisherList(serviceGroups[(index * 4) + 2] || null, publishers, inactivePublishers).split('<br>'),
        buildPublisherList(serviceGroups[(index * 4) + 3] || null, publishers, inactivePublishers).split('<br>'),
      ]

      // Get the largest group to set max number of rows
      const largestGroupIndex = groupArray.reduce((maxI, el, i, arr) => (el.length > arr[maxI].length) ? i : maxI, 0)

      // Add rows with publishers for each group
      for (let index = 0; index < groupArray[largestGroupIndex].length; index++) {
        worksheet.insertRow(ROW, [groupArray[0][index] || '', '', groupArray[1][index] || '', '', groupArray[2][index] || '', '', groupArray[3][index] || ''])
        ROW++
      }

      worksheet.getRow(HEADER).font = { bold: true }
      ROW                           = ROW + 2
    }

    adjustColumnWidth(worksheet)

    worksheet.eachColumnKey((col) => {
      col.eachCell((cell) => {
        cell.alignment = { wrapText: true }
        if (cell.value?.toString().includes('<b>')) {
          cell.font = { bold: true }
        }
        if (cell.value?.toString().includes('<i>')) {
          cell.font = { italic: true }
        }
        if (cell.value?.toString().includes('<del>')) {
          cell.font = { color: { argb: 'ff0000ff' } }
        }
        cell.value = cell.value?.toString().replace(/<[^>]+(>|$)/g, '')
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
