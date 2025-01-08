import type { BrowserWindow }        from 'electron'
import { app, dialog }               from 'electron'
import { jsPDF }                     from 'jspdf'
import type { CellDef, UserOptions } from 'jspdf-autotable'
import fs                            from 'fs-extra'
import log                           from 'electron-log'
import SettingsService               from '../services/settingsService'
import getAge                        from '../utils/getAge'
import i18n                          from '../../localization/i18next.config'
import type { PublisherService }     from '../../types/type'
import 'jspdf-autotable'

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF
}

interface Family {
  lastname:   string
  firstnames: string[]
}

const settingsService = new SettingsService()

function createRows(families: Family[]): CellDef[][] {
  const rows: CellDef[][] = []

  for (let i = 0; i < families.length; i++) {
    rows.push([
      { content: families[i].lastname, styles: { fontStyle: 'bold' } },
      { content: families[i].firstnames.join(', ') },
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

async function generate_PDF(mainWindow: BrowserWindow, families: Family[], name: string): Promise<void> {
  const congregationSettings = await settingsService.find()

  // eslint-disable-next-line new-cap
  const pdfDoc = new jsPDF() as jsPDFWithPlugin
  pdfDoc.setProperties({
    title:    'Name List',
    creator:  `${congregationSettings?.user.firstname} ${congregationSettings?.user.lastname}`,
    keywords: 'name, list, publisher, congregation',
  })

  const pageSize = pdfDoc.internal.pageSize

  // overall margin
  const margin = {
    left:   10,
    right:  10,
    top:    17,
    bottom: 10,
  }

  // add an initial empty page that will be delete later,
  // it is needed for the first setPage(previous_page) call
  pdfDoc.addPage()

  // number of table sections in the page
  const sections = 2
  // space between each section
  const spacing = 5

  // calculate each section width
  const printWidht   = pageSize.width - (margin.left + margin.right)
  const sectionWidth = (printWidht - ((sections - 1) * spacing)) / sections

  let nextSection = 1

  // Table
  pdfDoc.autoTable({
    body:         createRows(families),
    tableWidth:   sectionWidth,
    margin,
    rowPageBreak: 'avoid',
    theme:        'plain',
    styles:       {
      cellPadding: 1,
      fontSize:    8,
      overflow:    'linebreak',
      valign:      'middle',
      lineWidth:   0.1,
    },
    didDrawPage: ({ table }) => {
      // Header
      pdfDoc.setFontSize(22)
      pdfDoc.setFont('helvetica', 'bold')
      pdfDoc.text(
        congregationSettings?.congregation.name || i18n.t('label.nameList'),
        pageSize.getWidth() / 2,
        12,
        { align: 'center' },
      )

      // Footer
      const pageHeight = pageSize.getHeight()
      pdfDoc.setFont('helvetica', 'normal')
      pdfDoc.setFontSize(8)
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

export default async function ExportNameList(
  mainWindow: BrowserWindow,
  publisherService: PublisherService,
): Promise<void> {
  const families: Family[] = []

  const contactPublishers = await publisherService.findContacts()

  for await (const contact of contactPublishers) {
    if (!contact._id) {
      return
    }

    const familyMembers: string[] = []

    // add contact to familyMembers
    familyMembers.push(contact.firstname)

    // add family members to familyMembers
    const family = await publisherService.findFamily(contact._id)
    family.sort((a, b) => new Date(a.birthday || '').getTime() - new Date(b.birthday || '').getTime())
    for await (const member of family) {
      if (!member.contact) {
        familyMembers.push(member.firstname)
      }
    }

    // add children to familyMembers
    const children = contact.children.sort((a, b) => new Date(a.birthday || '').getTime() - new Date(b.birthday || '').getTime())
    for await (const child of children) {
      let name = child.name

      if (child.birthday) {
        name += ` (${getAge(child.birthday)})`
      }

      familyMembers.push(name)
    }

    families.push({
      lastname:   contact.lastname,
      firstnames: familyMembers,
    })
  }

  const name = `NameList_${new Date().toLocaleDateString('sv')}`

  generate_PDF(mainWindow, families, name)
}
