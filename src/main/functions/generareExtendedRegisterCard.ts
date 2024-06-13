import { jsPDF }                                                           from 'jspdf'
import type { UserOptions }                                                from 'jspdf-autotable'
import type { CountryCode }                                                from 'libphonenumber-js/types'
import { formatPhoneNumber, formatPhoneNumberIntl, getCountryCallingCode } from 'react-phone-number-input'
import type { PublisherModel, ServiceGroupModel }                          from '../../types/models'
import PublisherService                                                    from '../services/publisherService'
import ResponsibilityService                                               from '../services/responsibilityService'
import SettingsService                                                     from '../services/settingsService'
import ServiceGroupService                                                 from '../services/serviceGroupService'
import TaskService                                                         from '../services/taskService'
import i18n                                                                from '../../localization/i18next.config'
import 'jspdf-autotable'

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF
}

const publisherService      = new PublisherService()
const responsibilityService = new ResponsibilityService()
const serviceGroupService   = new ServiceGroupService()
const settingsService       = new SettingsService()
const taskService           = new TaskService()

export default async function GenerateExtendedRegisterCard(publisher: PublisherModel): Promise<ArrayBuffer> {
  const settings                             = await settingsService.find()
  let serviceGroup: ServiceGroupModel | null = null
  const responsibilities: string[]           = []
  const tasks: string[]                      = []
  const reports: any[]                       = []
  const histories: any[]                     = []

  const countryCallingCode = `+${getCountryCallingCode((settings?.congregation.country || 'SE') as CountryCode)}`

  for await (const r of publisher.responsibilities) {
    const resp = await responsibilityService.findOneById(r)

    if (resp)
      responsibilities.push(i18n.t(resp.name.toLocaleLowerCase()))
  }

  for await (const t of publisher.tasks) {
    const task = await taskService.findOneById(t)

    if (task)
      tasks.push(i18n.t(task.name))
  }

  /*
   * REPORTS
  */
  const allReports = publisher.reports
  allReports.sort((a, b) => {
    return a.serviceYear - b.serviceYear  || a.sortOrder - b.sortOrder
  })

  const lastReports = allReports.slice(-12)

  lastReports.forEach((r) => {
    reports.push([
      r.serviceMonth,
      r.hasBeenInService ? i18n.t('label.yes') : i18n.t('label.no'),
      r.studies || '',
      r.auxiliary ? i18n.t('label.yes') : i18n.t('label.no'),
      r.hours || '',
      r.remarks || '',
    ])
  })

  /*
   * HISTORIES
  */
  const allHistories = publisher.histories
  allHistories.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })
  allHistories.forEach((h) => {
    histories.push([
      h.date,
      i18n.t(`event.${h.type.toLowerCase()}`),
      h.information || '',
    ])
  })

  if (publisher.serviceGroupId)
    serviceGroup = await serviceGroupService.findOneById(publisher.serviceGroupId)

  // Get family members
  let familyMembers: string[] = []
  const children: string[]    = []
  const familyId              = publisher.contact ? publisher._id : publisher.familyId
  if (familyId) {
    await publisherService.findFamily(familyId).then((family) => {
      for (const member of family) {
        if (member.contact) {
          for (const child of member.children)
            children.push(child.name)
        }

        familyMembers.push(`${member.firstname}`)
      }
    })
  }
  familyMembers = familyMembers.concat(children)

  // eslint-disable-next-line new-cap
  const pdfDoc   = new jsPDF() as jsPDFWithPlugin & { autoTable: { previous?: { finalY: number } } }
  const pageSize = pdfDoc.internal.pageSize

  pdfDoc.setProperties({
    title:    'Extended Register card',
    creator:  `${settings?.user.firstname} ${settings?.user.lastname}`,
    keywords: 'register card, publisher, congregation',
  })

  // Header
  pdfDoc.setFontSize(16)
  pdfDoc.setFont('helvetica', 'bold')
  pdfDoc.text(
    i18n.t('label.memberInformation'),
    10,
    12,
    { align: 'left' },
  )
  pdfDoc.setFontSize(16)
  pdfDoc.setFont('helvetica', 'bold')
  pdfDoc.text(
    serviceGroup?.name || '',
    pageSize.getWidth() - 12,
    12,
    { align: 'right' },
  )
  // pdfDoc.setLineWidth(0.9)
  pdfDoc.line(10, 15, pageSize.width - 12, 15)

  // Contact information
  pdfDoc.autoTable({
    head: [
      [{ content: i18n.t('label.contactInformation'), colSpan: 4, styles: { fontSize: 12 } }],
    ],
    body: [
      [
        { content: i18n.t('label.name'), styles: { cellWidth: 30, fontStyle: 'bold', halign: 'left' } },
        `${publisher.firstname} ${publisher.lastname}`,
        { content: i18n.t('label.family'), styles: { cellWidth: 30, fontStyle: 'bold', halign: 'left' } },
        `${familyMembers.join(', ')}`,
      ],
      [
        { content: i18n.t('label.address'), rowSpan: 2, styles: { cellWidth: 30, fontStyle: 'bold', halign: 'left' } },
        { content: `${publisher.address}\n${publisher.zip} ${publisher.city}`, rowSpan: 2 },
        { content: i18n.t('label.phone'), styles: { cellWidth: 30, fontStyle: 'bold', halign: 'left' } },
        `${publisher.phone ? publisher.phone.startsWith(countryCallingCode) ? formatPhoneNumber(publisher.phone) : formatPhoneNumberIntl(publisher.phone) : ''}`,
      ],
      [
        { content: i18n.t('label.mobile'), styles: { cellWidth: 30, fontStyle: 'bold', halign: 'left' } },
        `${publisher.mobile ? publisher.mobile.startsWith(countryCallingCode) ? formatPhoneNumber(publisher.mobile) : formatPhoneNumberIntl(publisher.mobile) : ''}`,
      ],
      [
        { content: i18n.t('label.email'), styles: { cellWidth: 30, fontStyle: 'bold', halign: 'left' } },
        `${publisher.email}`,
        { content: i18n.t('label.birthday'), styles: { cellWidth: 30, fontStyle: 'bold', halign: 'left' } },
        `${publisher.birthday}`,
      ],
      [
        { content: i18n.t('label.gender'), styles: { cellWidth: 30, fontStyle: 'bold', halign: 'left' } },
        i18n.t(`label.${publisher.gender.toLowerCase()}`),
        { content: i18n.t('label.other'), styles: { cellWidth: 30, fontStyle: 'bold', halign: 'left' } },
        `${publisher.other ? publisher.other : ''}`,
      ],
    ],
    margin: { top: 10, left: 10, right: 12, bottom: 0 },
    styles: {
      cellPadding: 1,
      fontSize:    9.5,
      overflow:    'linebreak',
      valign:      'top',
    },
    rowPageBreak: 'avoid',
    theme:        'plain',
    startY:       17,
  })

  // Emergency contact
  if (publisher.emergencyContact.name) {
    pdfDoc.autoTable({
      head: [
        [{ content: i18n.t('label.emergencyContact'), colSpan: 3, styles: { fontSize: 12 } }],
      ],
      body: [
        [
          publisher.emergencyContact.name,
          publisher.emergencyContact.email || '',
          `${publisher.emergencyContact.phone ? publisher.emergencyContact.phone.startsWith(countryCallingCode) ? formatPhoneNumber(publisher.emergencyContact.phone) : formatPhoneNumberIntl(publisher.emergencyContact.phone) : ''}`,
        ],
      ],
      margin: { top: 10, left: 10, right: 12, bottom: 0 },
      styles: {
        cellPadding: 1,
        fontSize:    9.5,
        overflow:    'linebreak',
        valign:      'top',
      },
      rowPageBreak: 'avoid',
      theme:        'plain',
      startY:       pdfDoc.autoTable.previous ? pdfDoc.autoTable.previous.finalY + 5 : 20,
    })
  }

  // Spiritual
  pdfDoc.autoTable({
    head: [
      [{ content: i18n.t('label.spiritual'), colSpan: 4, styles: { fontSize: 12 } }],
    ],
    body: [
      [
        { content: i18n.t('label.serviceGroup'), styles: { cellWidth: 30, fontStyle: 'bold', halign: 'left' } },
        `${serviceGroup?.name || ''}`,
        { content: i18n.t('label.status'), styles: { cellWidth: 30, fontStyle: 'bold', halign: 'left' } },
        i18n.t(`label.${publisher.status.toLowerCase()}`),
      ],
      [
        { content: i18n.t('label.baptised'), styles: { cellWidth: 30, fontStyle: 'bold', halign: 'left' } },
        publisher.baptised ? publisher.baptised : publisher.unknown_baptised ? '?' : '',
        { content: i18n.t('label.hope'), styles: { cellWidth: 30, fontStyle: 'bold', halign: 'left' } },
        i18n.t(`label.${publisher.hope.toLowerCase()}`),
      ],
      [
        { content: i18n.t('label.privileges'), styles: { cellWidth: 30, fontStyle: 'bold', halign: 'left' } },
        publisher.appointments.map((a) => {
          return i18n.t(`appointment.${a.type.toLocaleLowerCase()}`) + (a.date ? ` (${a.date})` : '')
        }).join('\n'),
        { content: i18n.t('label.responsibilities'), styles: { cellWidth: 30, fontStyle: 'bold', halign: 'left' } },
        responsibilities.join('\n'),
      ],
      [
        { content: i18n.t('label.tasks'), styles: { cellWidth: 30, fontStyle: 'bold', halign: 'left' } },
        { content: tasks.join(', '), colSpan: 3 },
      ],
    ],
    margin: { top: 10, left: 10, right: 12, bottom: 0 },
    styles: {
      cellPadding: 1,
      fontSize:    9.5,
      overflow:    'linebreak',
      valign:      'top',
    },
    rowPageBreak: 'avoid',
    theme:        'plain',
    startY:       pdfDoc.autoTable.previous ? pdfDoc.autoTable.previous.finalY + 5 : 17,
  })

  // Reports (last 12 months)
  pdfDoc.autoTable({
    head: [
      [{ content: i18n.t('label.reports12Month'), colSpan: 6, styles: { fontSize: 12 } }],
      [
        i18n.t('label.month'),
        i18n.t('label.attended'),
        i18n.t('label.studies'),
        i18n.t('label.aux'),
        i18n.t('label.hours'),
        i18n.t('label.remarks'),
      ],
    ],
    body:   reports,
    margin: { top: 10, left: 10, right: 12, bottom: 0 },
    styles: {
      cellPadding: 1,
      fontSize:    9.5,
      overflow:    'linebreak',
      valign:      'top',
      lineWidth:   0.1,
    },
    rowPageBreak: 'avoid',
    theme:        'plain',
    startY:       pdfDoc.autoTable.previous ? pdfDoc.autoTable.previous.finalY + 5 : 17,
  })

  // Histories
  pdfDoc.autoTable({
    head: [
      [{ content: i18n.t('label.histories'), colSpan: 3, styles: { fontSize: 12 } }],
      [
        i18n.t('label.date'),
        i18n.t('label.type'),
        i18n.t('label.information'),
      ],
    ],
    body:   histories,
    margin: { top: 10, left: 10, right: 12, bottom: 0 },
    styles: {
      cellPadding: 1,
      fontSize:    9.5,
      overflow:    'linebreak',
      valign:      'top',
      lineWidth:   0.1,
    },
    rowPageBreak: 'avoid',
    theme:        'plain',
    startY:       pdfDoc.autoTable.previous ? pdfDoc.autoTable.previous.finalY + 5 : 17,
  })

  return pdfDoc.output('arraybuffer')
}
