import type { BrowserWindow }        from 'electron'
import { app, dialog }               from 'electron'
import { jsPDF }                     from 'jspdf'
import type { CellDef, UserOptions } from 'jspdf-autotable'
import fs                            from 'fs-extra'
import log                           from 'electron-log'
import SettingsService               from '../services/settingsService'
import i18n                          from '../../localization/i18next.config'
import type { PublisherService }     from '../../types/type'
import type { PublisherModel }       from '../../types/models'
import 'jspdf-autotable'

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF
}

const settingsService = new SettingsService()

function createRows(publishers: PublisherModel[]): CellDef[][] {
  const rows: CellDef[][] = []

  for (let i = 0; i < publishers.length; i++) {
    rows.push([
      { content: `${publishers[i].lastname}, ${publishers[i].firstname} ${publishers[i].appointments.find(a => a.type === 'AUXILIARY') ? '*' : ''}` },
    ])
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

async function generate_PDF(mainWindow: BrowserWindow, publishers: PublisherModel[], name: string, month?: string): Promise<void> {
  const congregationSettings = await settingsService.find()

  // eslint-disable-next-line new-cap
  const pdfDoc = new jsPDF() as jsPDFWithPlugin
  pdfDoc.setProperties({
    title:    'Auxiliary List',
    creator:  `${congregationSettings?.user.firstname} ${congregationSettings?.user.lastname}`,
    keywords: 'name, list, publisher, congregation, auxiliary',
  })

  const pageSize = pdfDoc.internal.pageSize

  // overall margin
  const margin = {
    left:   10,
    right:  10,
    top:    25,
    bottom: 10,
  }

  // add an initial empty page that will be delete later,
  // it is needed for the first setPage(previous_page) call
  pdfDoc.addPage()

  // number of table sections in the page
  const sections = 3
  // space between each section
  const spacing = 5

  // calculate each section width
  const printWidht   = pageSize.width - (margin.left + margin.right)
  const sectionWidth = (printWidht - ((sections - 1) * spacing)) / sections

  let nextSection = 1

  // Table
  pdfDoc.autoTable({
    body:         createRows(publishers),
    tableWidth:   sectionWidth,
    margin,
    rowPageBreak: 'avoid',
    theme:        'plain',
    styles:       {
      cellPadding: 1,
      fontSize:    12,
      overflow:    'linebreak',
      valign:      'middle',
    },
    didDrawPage: ({ table }) => {
      // Header
      pdfDoc.setFontSize(22)
      pdfDoc.setFont('helvetica', 'bold')
      pdfDoc.text(
        congregationSettings?.congregation.name || i18n.t('label.auxiliaryList'),
        pageSize.getWidth() / 2,
        12,
        { align: 'center' },
      )
      pdfDoc.setFontSize(18)
      pdfDoc.setFont('helvetica', 'bold')
      pdfDoc.text(
        i18n.t('label.auxiliaryList', { month }),
        pageSize.getWidth() / 2,
        22,
        { align: 'center' },
      )

      // Footer
      const pageHeight = pageSize.getHeight()
      pdfDoc.setFont('helvetica', 'normal')
      pdfDoc.setFontSize(8)
      pdfDoc.text(
        `*${i18n.t('appointment.auxiliary')}`,
        12,
        pageHeight - 10,
      )
      pdfDoc.text(
        new Date().toLocaleString(`sv-${congregationSettings?.congregation.country}`),
        200,
        pageHeight - 10,
        {
          align: 'right',
        },
      )

      nextSection = (nextSection % sections) + 1

      // set left margin which will controll x position of next section
      const shift                = (nextSection - 1) * (sectionWidth + spacing)
      table.settings.margin.left = margin.left + shift

      // if next section is not the fist, move to previous page so when
      // autoTable calls addPage() it will still be the same current page
      if (nextSection > 1) {
        pdfDoc.setPage(pdfDoc.getNumberOfPages() - 1)
      }
    },
  })

  // activate last page for further printing
  pdfDoc.setPage(pdfDoc.getNumberOfPages())

  // delete unused empty page
  pdfDoc.deletePage(1)

  savePdfFile(mainWindow, `${name}.pdf`, pdfDoc.output('arraybuffer'))
}

export default async function ExportAuxiliariesList(
  mainWindow: BrowserWindow,
  publisherService: PublisherService,
  publisherIds?: string[],
  monthName?: string,
): Promise<void> {
  if (publisherIds?.length) {
    let auxiliaries: PublisherModel[] = []

    await publisherService.find('lastname').then((publishers) => {
      auxiliaries = publishers.filter(p => p.appointments.some(a => a.type === 'AUXILIARY'))
    })
    await publisherService.findByIds(publisherIds).then((publishers) => {
      auxiliaries = auxiliaries.concat(publishers)
    })
    auxiliaries = auxiliaries.sort((a, b) => a.lastname.localeCompare(b.lastname))
    const name  = `Auxiliaries_${new Date().toLocaleDateString('sv')}`
    generate_PDF(mainWindow, auxiliaries, name, monthName)
  }
  else {
    mainWindow?.webContents.send('show-spinner', { status: false })
  }
}
