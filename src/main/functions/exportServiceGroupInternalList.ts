import { type BrowserWindow, app, dialog }   from 'electron'
import { jsPDF }                             from 'jspdf'
import type { Cell, CellInput, UserOptions } from 'jspdf-autotable'
import fs                                    from 'fs-extra'
import log                                   from 'electron-log'
import type ServiceGroupService              from '../services/serviceGroupService'
import type PublisherService                 from '../services/publisherService'
import 'jspdf-autotable'
import type SettingsService                  from '../services/settingsService'
import i18n                                  from '../../localization/i18next.config'
import type {
  PublisherModel,
  ServiceGroupModel,
} from '../../types/models'

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF
}

function processText(text: string) {
  const parts = text.split(/(<\/?b>|<\/?i>|<br>|<\/?del>)/).filter(part => part.trim() !== '')

  return parts
}

function renderText(doc: jsPDF, cell: Cell, text: CellInput | HTMLTableCellElement) {
  const parts    = processText(text as string)
  const paddHV   = Number(cell.padding('vertical'))
  const { x, y } = cell.getTextPos()
  let textPosX   = x
  let textPosY   = y + paddHV
  const gfs      = (cell.styles.fontSize / doc.internal.scaleFactor) * 1.15

  log.info(paddHV)
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
    else if (part === '<del>') {
      doc.setTextColor('blue')
    }
    else if (part === '</del>') {
      doc.setTextColor('black')
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

  for (const publisher of completeList) {
    if (publisher.serviceGroupId === serviceGroup._id) {
      if (serviceGroup.responsibleId === publisher._id)
        publisherLists += `<b>${publisher.firstname} ${publisher.lastname}</b><br>`

      else if (serviceGroup.assistantId === publisher._id)
        publisherLists += `<i>${publisher.firstname} ${publisher.lastname}</i><br>`

      else if (publisher.status === 'INACTIVE')
        publisherLists += `<del>${publisher.firstname} ${publisher.lastname}</del><br>`

      else
        publisherLists += `${publisher.firstname} ${publisher.lastname}<br>`
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

export default async function ExportServiceGroupInternalList(
  mainWindow: BrowserWindow,
  settingsService: SettingsService,
  serviceGroupService: ServiceGroupService,
  publisherService: PublisherService,
): Promise<void> {
  const settings           = await settingsService.find()
  const serviceGroups      = await serviceGroupService.find()
  const publishers         = await publisherService.findByStatus(['ACTIVE', 'IRREGULAR'])
  const inactivePublishers = await publisherService.findByStatus(['INACTIVE'])

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
  pdfDoc.setFontSize(8)
  pdfDoc.setFont('helvetica', 'normal')
  pdfDoc.text(i18n.t('export.serviceGroupInternalInformation'), pageSize.getWidth() / 2, 17, { align: 'center' })
  pdfDoc.setLineHeightFactor(1.2)

  const noServiceGroupRows = Math.round(serviceGroups.length / 4)

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
      startY:       pdfDoc.autoTable.previous ? pdfDoc.autoTable.previous.finalY + 1 : 20,
    })
  }

  const name = `ServiceGroups_${new Date().toLocaleDateString('sv')}`

  savePdfFile(mainWindow, `${name}.pdf`, pdfDoc.output('arraybuffer'))
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
