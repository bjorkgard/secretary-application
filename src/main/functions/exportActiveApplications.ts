import { type BrowserWindow, app, dialog } from 'electron'
import log                                 from 'electron-log'
import { jsPDF }                           from 'jspdf'
import type { UserOptions }                from 'jspdf-autotable'
import fs                                  from 'fs-extra'
import type { PublisherModel }             from '../../types/models'
import type PublisherService               from '../services/publisherService'
import SettingsService                     from '../services/settingsService'
import i18n                                from '../../localization/i18next.config'

import 'jspdf-autotable'

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF
}

const settingsService = new SettingsService()

function getTableHeaders(): string[] {
  return [
    i18n.t('export.name'),
    i18n.t('export.latestDate'),
    i18n.t('export.comment'),
  ]
}

const threeYearsAgo = new Date()
threeYearsAgo.setMonth(new Date().getMonth() - 36)

function getPublishers(publishers: PublisherModel[], type: string): string[][] {
  return publishers
    .filter(publisher => publisher.histories.some(history => history.type === type))
    .map((publisher) => {
      const histories = publisher.histories.filter(history => history.type === type)
      const history   = histories.reduce((a, b) => a.date > b.date ? a : b)

      const dateObject = new Date(history?.date || '')

      log.info(dateObject)
      log.info(threeYearsAgo)

      return [
        `${publisher.lastname}, ${publisher.firstname}`,
        history?.date || '',
        dateObject > threeYearsAgo ? '' : i18n.t('applications.needsAnUpdate'),
      ]
    })
}

export default async function exportActiveApplications(
  mainWindow: BrowserWindow,
  publisherService: PublisherService,
): Promise<void> {
  const settings   = await settingsService.find()
  const publishers = await publisherService.find('lastname')

  // eslint-disable-next-line new-cap
  const pdfDoc = new jsPDF() as jsPDFWithPlugin
  pdfDoc.setProperties({
    title:    'Application List',
    creator:  `${settings?.user.firstname} ${settings?.user.lastname}`,
    keywords: 'applications, list, publisher, congregation',
  })

  const pageSize = pdfDoc.internal.pageSize

  pdfDoc.autoTable({
    head:        [[{ content: i18n.t('event.a2'), colSpan: 3 }], getTableHeaders()],
    body:        getPublishers(publishers, 'A-2').concat(getPublishers(publishers, 'DC-50')),
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
    margin: { top: 10, left: 6, right: 6, bottom: 15 },
    styles: {
      cellPadding: 2,
      fontSize:    8,
      overflow:    'linebreak',
      valign:      'middle',
      lineWidth:   0.1,
    },
    rowPageBreak: 'avoid',
  })

  pdfDoc.autoTable({
    head:   [[{ content: i18n.t('event.a8'), colSpan: 3 }], getTableHeaders()],
    body:   getPublishers(publishers, 'A-8'),
    margin: { top: 10, left: 6, right: 6, bottom: 15 },
    styles: {
      cellPadding: 2,
      fontSize:    8,
      overflow:    'linebreak',
      valign:      'middle',
      lineWidth:   0.1,
    },
    rowPageBreak: 'avoid',
  })

  pdfDoc.autoTable({
    head:   [[{ content: i18n.t('event.a19'), colSpan: 3 }], getTableHeaders()],
    body:   getPublishers(publishers, 'A-19'),
    margin: { top: 10, left: 6, right: 6, bottom: 15 },
    styles: {
      cellPadding: 2,
      fontSize:    8,
      overflow:    'linebreak',
      valign:      'middle',
      lineWidth:   0.1,
    },
    rowPageBreak: 'avoid',
  })

  const name = `ApplicationsList_${new Date().toLocaleDateString('sv')}`

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
