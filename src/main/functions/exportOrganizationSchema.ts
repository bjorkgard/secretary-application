import type { BrowserWindow }                     from 'electron'
import { app, dialog }                            from 'electron'
import { jsPDF }                                  from 'jspdf'
import type { CellDef, UserOptions }              from 'jspdf-autotable'
import fs                                         from 'fs-extra'
import log                                        from 'electron-log'
import ResponsibilityService                      from '../services/responsibilityService'
import SettingsService                            from '../services/settingsService'
import TaskService                                from '../services/taskService'
import getPublishersWithResponsibility            from '../utils/getPublishersWithResponsibility'
import i18n                                       from '../../localization/i18next.config'
import type { OrganizationModel, PublisherModel } from '../../types/models'
import type { PublisherService }                  from '../../types/type'
import getPublishersWithTask                      from '../utils/getPublishersWithTask'
import getPublishersWithAppointment               from '../utils/getPublishersWithAppointment'
import OrganizationService                        from '../services/organizationService'
import 'jspdf-autotable'

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF
}

const organizationService   = new OrganizationService()
const responsibilityService = new ResponsibilityService()
const settingsService       = new SettingsService()
const taskService           = new TaskService()

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
async function createAppointmentsRows(publishers: PublisherModel[], organization?: OrganizationModel): Promise<CellDef[][]> {
  const rows: CellDef[][] = []

  organization?.appointments.forEach((a) => {
    if (!a.active) {
      return
    }

    const names = getPublishersWithAppointment(publishers, a.type)
    if (names.length > 0) {
      rows.push([
        { content: i18n.t(`appointment.${a.type.toLowerCase()}`), styles: { cellWidth: 50, fontStyle: 'bold' } },
        { content: names.map(c => `${c.firstname} ${c.lastname}`).join(', ') },
      ])
    }
  })

  return rows
}

async function createResponsibilityRows(publishers: PublisherModel[], organization?: OrganizationModel): Promise<CellDef[][]> {
  const rows: CellDef[][] = []
  const responsibilities  = await responsibilityService.find()

  organization?.responsibilities.forEach((r) => {
    if (!r.active) {
      return
    }

    const names = getPublishersWithResponsibility(publishers, responsibilities.find(resp => resp.name === r.type)?._id)
    if (names.length > 0) {
      rows.push([
        { content: i18n.t(r.type), styles: { cellWidth: 50, fontStyle: 'bold' } },
        { content: names.map(c => `${c.firstname} ${c.lastname}`).join(', ') },
      ])
    }
  })

  return rows
}

async function createTaskRows(publishers: PublisherModel[], pageSize: { width: number, height: number }, organization?: OrganizationModel): Promise<CellDef[][]> {
  const rows: CellDef[][] = []
  const tasks             = await taskService.find()

  organization?.tasks.forEach((task) => {
    let managers: PublisherModel[]   = []
    let assistants: PublisherModel[] = []

    if (task.manager) {
      managers = getPublishersWithTask(publishers, task.manager)
    }
    if (task.assistant) {
      assistants = getPublishersWithTask(publishers, task.assistant)
    }

    if (managers.length > 0) {
      rows.push([
        { content: i18n.t(tasks.find(resp => resp._id === task.type)?.name || ''), styles: { fontStyle: 'bold', valign: 'top' } },
        { content: managers.map(m => `${m.firstname} ${m.lastname}`).join(', '), colSpan: assistants.length ? 1 : 2, styles: { valign: 'top' } },
        { content: assistants.map(a => `${a.firstname} ${a.lastname}`).join(', '), colSpan: assistants.length ? 1 : 0, styles: { cellWidth: pageSize.width / 2, valign: 'top' } },
      ])
    }
  })

  return rows
}

async function generate_PDF(mainWindow: BrowserWindow, publishers: PublisherModel[], name: string): Promise<void> {
  const congregationSettings = await settingsService.find()
  const organization         = await organizationService.find()

  // eslint-disable-next-line new-cap
  const pdfDoc = new jsPDF() as jsPDFWithPlugin & { autoTable: { previous?: { finalY: number } } }

  pdfDoc.setProperties({
    title:    'Organization schema',
    creator:  `${congregationSettings?.user.firstname} ${congregationSettings?.user.lastname}`,
    keywords: 'name, list, publisher, congregation',
  })

  const pageSize = pdfDoc.internal.pageSize

  // overall margin
  const margin = {
    left:   10,
    right:  10,
    top:    10,
    bottom: 10,
  }

  // Header
  pdfDoc.setFontSize(22)
  pdfDoc.setFont('helvetica', 'bold')
  pdfDoc.text(
    congregationSettings?.congregation.name || i18n.t('label.organizationSchema'),
    pageSize.getWidth() / 2,
    12,
    { align: 'center' },
  )
  pdfDoc.setFontSize(10)
  pdfDoc.setFont('helvetica', 'normal')
  pdfDoc.text(i18n.t('export.congregationNumber', { number: congregationSettings?.congregation.number }), pageSize.getWidth() / 2, 17, { align: 'center' })

  // Responsibility Table
  const responsibilityRows = await createResponsibilityRows(publishers, organization)
  if (responsibilityRows.length) {
    pdfDoc.autoTable({
      body:         responsibilityRows,
      margin,
      startY:       20,
      rowPageBreak: 'avoid',
      theme:        'plain',
      styles:       {
        cellPadding: 1,
        fontSize:    10,
        overflow:    'linebreak',
        valign:      'middle',
        lineWidth:   0,
      },
      didDrawPage: () => {
        // Footer
        pdfDoc.setFont('helvetica', 'normal')
        pdfDoc.setFontSize(8)

        const pageHeight = pageSize.getHeight()
        pdfDoc.text(
          new Date().toLocaleString(`sv-${congregationSettings?.congregation.country}`),
          200,
          pageHeight - 10,
          {
            align: 'right',
          },
        )
      },
    })
  }

  // Tasks Table
  const taskRows = await createTaskRows(publishers, pageSize, organization)
  if (taskRows.length) {
    pdfDoc.autoTable({
      head:         [[i18n.t('label.task'), i18n.t('label.manager'), i18n.t('label.assistant')]],
      body:         taskRows,
      margin,
      startY:       pdfDoc.autoTable.previous ? pdfDoc.autoTable.previous.finalY + 5 : 20,
      rowPageBreak: 'avoid',
      styles:       {
        cellPadding: 1,
        fontSize:    10,
        overflow:    'linebreak',
        valign:      'middle',
        lineWidth:   0.1,
      },
    })
  }

  // Appointments Table
  const appointmentsTable = await createAppointmentsRows(publishers, organization)
  if (taskRows.length) {
    pdfDoc.autoTable({
      body:         appointmentsTable,
      margin,
      startY:       pdfDoc.autoTable.previous ? pdfDoc.autoTable.previous.finalY + 5 : 20,
      rowPageBreak: 'avoid',
      theme:        'plain',
      styles:       {
        cellPadding: 1,
        fontSize:    10,
        overflow:    'linebreak',
        valign:      'middle',
        lineWidth:   0,
      },
    })
  }

  savePdfFile(mainWindow, `${name}.pdf`, pdfDoc.output('arraybuffer'))
}

export default async function ExportOrganizationSchema(
  mainWindow: BrowserWindow,
  publisherService: PublisherService,
): Promise<void> {
  const publishers = await publisherService.find('lastname')

  const name = `OrganizationSchema`

  generate_PDF(mainWindow, publishers, name)
}
