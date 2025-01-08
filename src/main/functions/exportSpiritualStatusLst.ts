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
import generateIdentifier                    from '../utils/generateIdentifier'
import getAge                                from '../utils/getAge'
import type {
  Appointment,
  ServiceGroupModel,
} from '../../types/models'

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF
}

interface SimplePublisherModel {
  _id:            string
  firstname:      string
  lastname:       string
  birthday?:      string
  age?:           number
  status?:        string
  serviceGroupId: string
  contact:        boolean
  appointments:   Appointment[]
  unbaptised:     boolean
}

function processText(text: string) {
  const parts = text.split(/(<\/?b>|<\/?i>|<br>|<split>|<\/?del>)/).filter(part => part.trim() !== '')

  return parts
}

function renderText(doc: jsPDF, cell: Cell, text: CellInput | HTMLTableCellElement) {
  const parts     = processText(text as string)
  const paddHV    = Number(cell.padding('vertical'))
  const cellWidth = cell.width
  const { x, y }  = cell.getTextPos()
  let textPosX    = x
  let textPosY    = y + paddHV
  const gfs       = (cell.styles.fontSize / doc.internal.scaleFactor) * 1.15

  doc.setFont('helvetica', 'normal')

  parts.forEach((part, index) => {
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
    else if (part === '<split>') {
      if (parts[index + 1] !== '<br>') {
        const nextTextWidth = doc.getTextWidth(parts[index + 1])
        textPosX            = x + (cellWidth - nextTextWidth)
      }
    }
    else {
      const textWidth = doc.getTextWidth(part)
      doc.text(part, textPosX, textPosY)
      textPosX += textWidth
    }
  })
}

function buildPublisherList(serviceGroup: ServiceGroupModel, publishers: SimplePublisherModel[]): string {
  let publisherLists = ''

  if (serviceGroup === null || serviceGroup.name === 'TEMPORARY')
    return ''

  for (const publisher of publishers) {
    const status: string[] = []
    if (publisher.serviceGroupId === serviceGroup._id) {
      let publisherRow = ''
      if (!publisher.contact) {
        publisherRow += '  '
      }

      publisherRow += `${publisher.firstname} ${publisher.lastname}`

      if (publisher.age)
        publisherRow += ` (${publisher.age})`

      // add status
      for (const Appointment of publisher.appointments) {
        status.push(i18n.t(`short.${Appointment.type.toLowerCase()}`))
      }

      switch (publisher.status) {
        case 'CHILD':
          status.push(i18n.t(`short.${publisher.status?.toLowerCase()}`))
          break
        case 'INACTIVE':
          status.push(i18n.t(`short.${publisher.status?.toLowerCase()}`))
          break
        case 'IRREGULAR':
          status.push(i18n.t(`short.${publisher.status?.toLowerCase()}`))
          break

        default:
          break
      }

      if (publisher.unbaptised)
        status.push(i18n.t('short.unbaptised'))

      publisherRow += `<split>${status.join(', ')}    `

      publisherLists += `${publisherRow}<br>`
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

export default async function ExportSpiritualStatusLst(
  mainWindow: BrowserWindow,
  settingsService: SettingsService,
  serviceGroupService: ServiceGroupService,
  publisherService: PublisherService,
): Promise<void> {
  const publishers: SimplePublisherModel[] = []
  const settings                           = await settingsService.find()
  const serviceGroups                      = await serviceGroupService.find()
  const contactPublishers                  = await publisherService.findContacts()

  for await (const contact of contactPublishers) {
    if (!contact._id) {
      return
    }

    publishers.push({ _id: contact._id, firstname: contact.firstname, lastname: contact.lastname, birthday: contact.birthday, age: contact.birthday ? getAge(contact.birthday) : undefined, status: contact.status, serviceGroupId: contact.serviceGroupId || '', contact: true, appointments: contact.appointments, unbaptised: !(contact.baptised || contact.unknown_baptised) })

    const family = await publisherService.findFamily(contact._id)
    family.sort((a, b) => new Date(a.birthday || '').getTime() - new Date(b.birthday || '').getTime())
    for await (const member of family) {
      if (!member.contact) {
        publishers.push({ _id: member._id || generateIdentifier(), firstname: member.firstname, lastname: member.lastname, birthday: member.birthday, age: member.birthday ? getAge(member.birthday) : undefined, status: member.status, serviceGroupId: member.serviceGroupId || '', contact: false, appointments: member.appointments, unbaptised: !(member.baptised || member.unknown_baptised) })
      }
    }

    const children = contact.children.sort((a, b) => new Date(a.birthday || '').getTime() - new Date(b.birthday || '').getTime())
    for await (const child of children) {
      publishers.push({ _id: generateIdentifier(), firstname: child.name, lastname: contact.lastname, birthday: child.birthday, age: child.birthday ? getAge(child.birthday) : undefined, status: 'CHILD', serviceGroupId: contact.serviceGroupId || '', contact: false, appointments: [], unbaptised: false })
    }
  }

  // eslint-disable-next-line new-cap
  const pdfDoc = new jsPDF() as jsPDFWithPlugin & { autoTable: { previous?: { finalY: number } } }

  pdfDoc.setProperties({
    title:    'Spiritual status',
    creator:  `${settings?.user.firstname} ${settings?.user.lastname}`,
    keywords: 'service groups, publisher, congregation',
  })

  const pageSize = pdfDoc.internal.pageSize

  pdfDoc.setFontSize(22)
  pdfDoc.setFont('helvetica', 'bold')
  pdfDoc.text(
    i18n.t('label.spiritualStatus'),
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
          buildPublisherList(serviceGroups[(index * 4)] || null, publishers),
          buildPublisherList(serviceGroups[(index * 4) + 1] || null, publishers),
          buildPublisherList(serviceGroups[(index * 4) + 2] || null, publishers),
          buildPublisherList(serviceGroups[(index * 4) + 3] || null, publishers),
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
        fontSize:    9,
        overflow:    'linebreak',
        valign:      'top',
      },
      rowPageBreak: 'avoid',
      theme:        'plain',
      startY:       pdfDoc.autoTable.previous ? pdfDoc.autoTable.previous.finalY + 1 : 20,
    })
  }
  pdfDoc.setFontSize(8)
  pdfDoc.setFont('helvetica', 'normal')
  pdfDoc.text([`${i18n.t('short.child')}: ${i18n.t('label.child')}; ${i18n.t('short.unbaptised')}: ${i18n.t('label.unbaptised')}; ${i18n.t('short.irregular')}: ${i18n.t('label.irregular')}; ${i18n.t('short.inactive')}: ${i18n.t('label.inactive')};`, `${i18n.t('short.elder')}: ${i18n.t('label.elder')}; ${i18n.t('short.ministerialservant')}: ${i18n.t('label.ministerialservant')}; ${i18n.t('short.auxiliary')}: ${i18n.t('label.auxiliary')}; ${i18n.t('short.pioneer')}: ${i18n.t('label.pioneer')}; ${i18n.t('short.specialpioneer')}: ${i18n.t('label.specialpioneer')};`], pageSize.getWidth() / 2, pdfDoc.autoTable.previous ? pdfDoc.autoTable.previous.finalY + 10 : 20, { align: 'center' })
  pdfDoc.setLineHeightFactor(1.2)

  const name = `SpiritualStatus_${new Date().toLocaleDateString('sv')}`

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
