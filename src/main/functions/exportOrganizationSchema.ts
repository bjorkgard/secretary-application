import type { BrowserWindow }          from 'electron'
import { app, dialog }                 from 'electron'
import { jsPDF }                       from 'jspdf'
import type { CellDef, UserOptions }   from 'jspdf-autotable'
import fs                              from 'fs-extra'
import log                             from 'electron-log'
import ResponsibilityService           from '../services/responsibilityService'
import SettingsService                 from '../services/settingsService'
import TaskService                     from '../services/taskService'
import getPublishersWithResponsibility from '../utils/getPublishersWithResponsibility'
import i18n                            from '../../localization/i18next.config'
import type { PublisherModel }         from '../../types/models'
import type { PublisherService }       from '../../types/type'
import 'jspdf-autotable'
import getPublishersWithTask           from '../utils/getPublishersWithTask'
import getPublishersWithAppointment    from '../utils/getPublishersWithAppointment'

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF
}

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
async function createAppointmentsRows(publishers: PublisherModel[]): Promise<CellDef[][]> {
  const rows: CellDef[][] = []

  const elders = getPublishersWithAppointment(publishers, 'ELDER')
  if (elders.length > 0) {
    rows.push([{ content: i18n.t('label.elders'), styles: { cellWidth: 50, fontStyle: 'bold', valign: 'top' } }, { content: elders.map(c => `${c.firstname} ${c.lastname}`).join(', ') }])
  }

  const ministerialServants = getPublishersWithAppointment(publishers, 'MINISTERIALSERVANT')
  if (ministerialServants.length > 0) {
    rows.push([{ content: i18n.t('label.ministerialServants'), styles: { cellWidth: 50, fontStyle: 'bold', valign: 'top' } }, { content: ministerialServants.map(c => `${c.firstname} ${c.lastname}`).join(', ') }])
  }

  const specialPioneers = getPublishersWithAppointment(publishers, 'SPECIALPIONEER')
  if (specialPioneers.length > 0) {
    rows.push([{ content: i18n.t('label.specialPioneers'), styles: { cellWidth: 50, fontStyle: 'bold', valign: 'top' } }, { content: specialPioneers.map(c => `${c.firstname} ${c.lastname}`).join(', ') }])
  }

  const pioneers = getPublishersWithAppointment(publishers, 'PIONEER')
  if (pioneers.length > 0) {
    rows.push([{ content: i18n.t('label.pioneers'), styles: { cellWidth: 50, fontStyle: 'bold', valign: 'top' } }, { content: pioneers.map(c => `${c.firstname} ${c.lastname}`).join(', ') }])
  }

  const auxiliaries = getPublishersWithAppointment(publishers, 'AUXILIARY')
  if (auxiliaries.length > 0) {
    rows.push([{ content: i18n.t('label.continousAuxiliaries'), styles: { cellWidth: 50, fontStyle: 'bold', valign: 'top' } }, { content: auxiliaries.map(c => `${c.firstname} ${c.lastname}`).join(', ') }])
  }

  return rows
}

async function createResponsibilityRows(publishers: PublisherModel[]): Promise<CellDef[][]> {
  const rows: CellDef[][] = []
  const responsibilities  = await responsibilityService.find()

  const coordinator = getPublishersWithResponsibility(publishers, responsibilities.find(r => r.name === 'responsibility.coordinator')?._id)
  if (coordinator.length > 0) {
    rows.push([{ content: i18n.t('responsibility.coordinator'), styles: { cellWidth: 50, fontStyle: 'bold' } }, { content: coordinator.map(c => `${c.firstname} ${c.lastname}`).join(', ') }])
  }

  const secretary = getPublishersWithResponsibility(publishers, responsibilities.find(r => r.name === 'responsibility.secretary')?._id)
  if (secretary.length > 0) {
    rows.push([{ content: i18n.t('responsibility.secretary'), styles: { cellWidth: 50, fontStyle: 'bold' } }, { content: secretary.map(c => `${c.firstname} ${c.lastname}`).join(', ') }])
  }

  const serviceOverseer = getPublishersWithResponsibility(publishers, responsibilities.find(r => r.name === 'responsibility.serviceOverseer')?._id)
  if (serviceOverseer.length > 0) {
    rows.push([{ content: i18n.t('responsibility.serviceOverseer'), styles: { cellWidth: 50, fontStyle: 'bold' } }, { content: serviceOverseer.map(c => `${c.firstname} ${c.lastname}`).join(', ') }])
  }

  const wtStudy = getPublishersWithResponsibility(publishers, responsibilities.find(r => r.name === 'responsibility.wtStudy')?._id)
  if (wtStudy.length > 0) {
    rows.push([{ content: i18n.t('responsibility.wtStudy'), styles: { cellWidth: 50, fontStyle: 'bold' } }, { content: wtStudy.map(c => `${c.firstname} ${c.lastname}`).join(', ') }])
  }

  const meetingOverseer = getPublishersWithResponsibility(publishers, responsibilities.find(r => r.name === 'responsibility.meetingOverseer')?._id)
  if (meetingOverseer.length > 0) {
    rows.push([{ content: i18n.t('responsibility.meetingOverseer'), styles: { cellWidth: 50, fontStyle: 'bold' } }, { content: meetingOverseer.map(c => `${c.firstname} ${c.lastname}`).join(', ') }])
  }

  const advisor = getPublishersWithResponsibility(publishers, responsibilities.find(r => r.name === 'responsibility.advisor')?._id)
  if (advisor.length > 0) {
    rows.push([{ content: i18n.t('responsibility.advisor'), styles: { cellWidth: 50, fontStyle: 'bold' } }, { content: advisor.map(c => `${c.firstname} ${c.lastname}`).join(', ') }])
  }

  return rows
}

async function createTaskRows(publishers: PublisherModel[], pageSize: { width: number, height: number }): Promise<CellDef[][]> {
  const rows: CellDef[][]              = []
  const tasks                          = await taskService.find()
  let manager: PublisherModel[]        = []
  let responsibility: PublisherModel[] = []
  let assistant: PublisherModel[]      = []

  manager        = getPublishersWithTask(publishers, tasks.find(r => r.name === 'task.districtOverseer')?._id)
  responsibility = getPublishersWithResponsibility(publishers, tasks.find(r => r.name === 'task.districtOverseer')?.responsibilityId)
  assistant      = getPublishersWithTask(publishers, tasks.find(r => r.name === 'task.district')?._id)
  if (manager.length > 0) {
    rows.push([
      { content: i18n.t('label.district'), styles: { fontStyle: 'bold', valign: 'top' } },
      { content: responsibility.map(r => `${r.firstname} ${r.lastname}`).join(', '), styles: { valign: 'top' } },
      { content: manager.map(m => `${m.firstname} ${m.lastname}`).join(', '), styles: { valign: 'top' } },
      { content: assistant.map(a => `${a.firstname} ${a.lastname}`).join(', '), styles: { cellWidth: pageSize.width / 2, valign: 'top' } },
    ])
  }

  manager        = getPublishersWithTask(publishers, tasks.find(r => r.name === 'task.operationGroup')?._id)
  responsibility = getPublishersWithResponsibility(publishers, tasks.find(r => r.name === 'task.operationGroup')?.responsibilityId)
  if (manager.length > 0) {
    rows.push([
      { content: i18n.t('task.operationGroup'), styles: { fontStyle: 'bold', valign: 'top' } },
      { content: responsibility.map(r => `${r.firstname} ${r.lastname}`).join(', '), styles: { valign: 'top' }  },
      { content: manager.map(m => `${m.firstname} ${m.lastname}`).join(', '), colSpan: 2, styles: { valign: 'top' } },
    ])
  }

  manager        = getPublishersWithTask(publishers, tasks.find(r => r.name === 'task.lecture')?._id)
  responsibility = getPublishersWithResponsibility(publishers, tasks.find(r => r.name === 'task.lecture')?.responsibilityId)
  if (manager.length > 0) {
    rows.push([
      { content: i18n.t('task.lecture'), styles: { fontStyle: 'bold', valign: 'top' } },
      { content: responsibility.map(r => `${r.firstname} ${r.lastname}`).join(', '), styles: { valign: 'top' } },
      { content: manager.map(m => `${m.firstname} ${m.lastname}`).join(', '), colSpan: 2, styles: { valign: 'top' } },
    ])
  }

  manager        = getPublishersWithTask(publishers, tasks.find(r => r.name === 'task.literatureOverseer')?._id)
  responsibility = getPublishersWithResponsibility(publishers, tasks.find(r => r.name === 'task.literatureOverseer')?.responsibilityId)
  assistant      = getPublishersWithTask(publishers, tasks.find(r => r.name === 'task.literature')?._id)
  if (manager.length > 0) {
    rows.push([
      { content: i18n.t('task.literature'), styles: { fontStyle: 'bold', valign: 'top' } },
      { content: responsibility.map(r => `${r.firstname} ${r.lastname}`).join(', '), styles: { valign: 'top' } },
      { content: manager.map(m => `${m.firstname} ${m.lastname}`).join(', '), styles: { valign: 'top' } },
      { content: assistant.map(a => `${a.firstname} ${a.lastname}`).join(', '), styles: { cellWidth: pageSize.width / 2, valign: 'top' } },
    ])
  }

  manager        = getPublishersWithTask(publishers, tasks.find(r => r.name === 'task.soundStageOverseer')?._id)
  responsibility = getPublishersWithResponsibility(publishers, tasks.find(r => r.name === 'task.soundStageOverseer')?.responsibilityId)
  assistant      = getPublishersWithTask(publishers, tasks.find(r => r.name === 'task.soundStage')?._id)
  if (manager.length > 0) {
    rows.push([
      { content: i18n.t('label.soundStage'), styles: { fontStyle: 'bold', valign: 'top' } },
      { content: responsibility.map(r => `${r.firstname} ${r.lastname}`).join(', '), styles: { valign: 'top' } },
      { content: manager.map(m => `${m.firstname} ${m.lastname}`).join(', '), styles: { valign: 'top' } },
      { content: assistant.map(a => `${a.firstname} ${a.lastname}`).join(', '), styles: { cellWidth: pageSize.width / 2, valign: 'top' } },
    ])
  }

  manager        = getPublishersWithTask(publishers, tasks.find(r => r.name === 'task.hostOverseer')?._id)
  responsibility = getPublishersWithResponsibility(publishers, tasks.find(r => r.name === 'task.hostOverseer')?.responsibilityId)
  assistant      = getPublishersWithTask(publishers, tasks.find(r => r.name === 'task.host')?._id)
  if (manager.length > 0) {
    rows.push([
      { content: i18n.t('task.host'), styles: { fontStyle: 'bold', valign: 'top' } },
      { content: responsibility.map(r => `${r.firstname} ${r.lastname}`).join(', '), styles: { valign: 'top' } },
      { content: manager.map(m => `${m.firstname} ${m.lastname}`).join(', '), styles: { valign: 'top' } },
      { content: assistant.map(a => `${a.firstname} ${a.lastname}`).join(', '), styles: { cellWidth: pageSize.width / 2, valign: 'top' } },
    ])
  }

  manager        = getPublishersWithTask(publishers, tasks.find(r => r.name === 'task.accountant')?._id)
  responsibility = getPublishersWithResponsibility(publishers, tasks.find(r => r.name === 'task.accountant')?.responsibilityId)
  assistant      = getPublishersWithTask(publishers, tasks.find(r => r.name === 'task.accountantAlternate')?._id)
  if (manager.length > 0) {
    rows.push([
      { content: i18n.t('task.accountant'), styles: { fontStyle: 'bold', valign: 'top' } },
      { content: responsibility.map(r => `${r.firstname} ${r.lastname}`).join(', '), styles: { valign: 'top' } },
      { content: manager.map(m => `${m.firstname} ${m.lastname}`).join(', '), styles: { valign: 'top' }  },
      { content: assistant.map(a => `${a.firstname} ${a.lastname}`).join(', '), styles: { cellWidth: pageSize.width / 2, valign: 'top' } },
    ])
  }

  manager        = getPublishersWithTask(publishers, tasks.find(r => r.name === 'task.accounting')?._id)
  responsibility = getPublishersWithResponsibility(publishers, tasks.find(r => r.name === 'task.accounting')?.responsibilityId)
  assistant      = getPublishersWithTask(publishers, tasks.find(r => r.name === 'task.accountingAssistant')?._id)
  if (manager.length > 0) {
    rows.push([
      { content: i18n.t('task.accounting'), styles: { fontStyle: 'bold', valign: 'top' } },
      { content: responsibility.map(r => `${r.firstname} ${r.lastname}`).join(', '), styles: { valign: 'top' } },
      { content: manager.map(m => `${m.firstname} ${m.lastname}`).join(', '), styles: { valign: 'top' } },
      { content: assistant.map(a => `${a.firstname} ${a.lastname}`).join(', '), styles: { cellWidth: pageSize.width / 2, valign: 'top' } },
    ])
  }

  manager        = getPublishersWithTask(publishers, tasks.find(r => r.name === 'task.cleaning')?._id)
  responsibility = getPublishersWithResponsibility(publishers, tasks.find(r => r.name === 'task.cleaning')?.responsibilityId)
  if (manager.length > 0) {
    rows.push([
      { content: i18n.t('label.cleaning'), styles: { fontStyle: 'bold', valign: 'top' } },
      { content: responsibility.map(r => `${r.firstname} ${r.lastname}`).join(', '), styles: { valign: 'top' } },
      { content: manager.map(m => `${m.firstname} ${m.lastname}`).join(', '), colSpan: 2, styles: { valign: 'top' } },
    ])
  }

  manager        = getPublishersWithTask(publishers, tasks.find(r => r.name === 'task.technicalSupport')?._id)
  responsibility = getPublishersWithResponsibility(publishers, tasks.find(r => r.name === 'task.technicalSupport')?.responsibilityId)
  if (manager.length > 0) {
    rows.push([
      { content: i18n.t('label.technicalSupport'), styles: { fontStyle: 'bold', valign: 'top' } },
      { content: responsibility.map(r => `${r.firstname} ${r.lastname}`).join(', '), styles: { valign: 'top' } },
      { content: manager.map(m => `${m.firstname} ${m.lastname}`).join(', '), colSpan: 2, styles: { valign: 'top' } },
    ])
  }

  return rows
}

async function generate_PDF(mainWindow: BrowserWindow, publishers: PublisherModel[], name: string): Promise<void> {
  const congregationSettings = await settingsService.find()

  // eslint-disable-next-line new-cap
  const pdfDoc = new jsPDF() as jsPDFWithPlugin & { autoTable: { previous?: { finalY: number } } }
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
  const responsibilityRows = await createResponsibilityRows(publishers)
  if (responsibilityRows.length) {
    pdfDoc.autoTable({
      body:         responsibilityRows,
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
  const taskRows = await createTaskRows(publishers, pageSize)
  if (taskRows.length) {
    pdfDoc.autoTable({
      head:         [[i18n.t('label.task'), i18n.t('label.responsible'), i18n.t('label.manager'), i18n.t('label.assistant')]],
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
  const appointmentsTable = await createAppointmentsRows(publishers)
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

  const name = `OrganizationSchema_${new Date().toLocaleDateString('sv')}`

  generate_PDF(mainWindow, publishers, name)
}
