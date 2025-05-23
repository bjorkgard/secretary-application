import path                   from 'node:path'
import { app, dialog }        from 'electron'
import type { BrowserWindow } from 'electron'
import fs                     from 'fs-extra'
import log                    from 'electron-log'
import {
  HeightRule,
  Paragraph,
  PatchType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
  patchDocument,
} from 'docx'
import type { PublisherModel }   from '../../types/models'
import type { PublisherService } from '../../types/type'
import SettingsService           from '../services/settingsService'
import i18n                      from '../../localization/i18next.config'
import getServiceYear            from '../utils/getServiceYear'
import isDev                     from './isDev'

const settingsService = new SettingsService()

function saveDocxFile(mainWindow: BrowserWindow, fileName: string, doc: Uint8Array): void {
  const dialogOptions = {
    title:       i18n.t('export.saveAs'),
    defaultPath: `${app.getPath('downloads')}/${fileName}`,
    buttonLabel: i18n.t('export.save'),
  }

  dialog
    .showSaveDialog(mainWindow, dialogOptions)
    .then((response) => {
      if (!response.canceled && response.filePath) {
        if (doc)
          fs.writeFileSync(response.filePath, doc)
      }
    })
    .catch((err) => {
      log.error(err)
      mainWindow?.webContents.send('show-spinner', { status: false })
    })
  mainWindow?.webContents.send('show-spinner', { status: false })
}

async function generate_DOCX(mainWindow: BrowserWindow,  publishers: PublisherModel[], fileName: string): Promise<void> {
  const settings = await settingsService.find()
  const now      = new Date()
  const date     = now.toLocaleDateString('sv')
  const year     = getServiceYear(`${now.getFullYear()}-${now.getMonth()}}`)

  const publisherTable = new Table({
    rows: [
      new TableRow({
        tableHeader: true,
        height:      { value: 400, rule: HeightRule.EXACT },
        children:    [
          new TableCell({
            children:      [new Paragraph({})],
            verticalAlign: VerticalAlign.CENTER,
            width:         { size: 650, type: WidthType.DXA },
          }),
          new TableCell({
            children:      [new Paragraph({ children: [new TextRun({ text: i18n.t('export.membersName'), font: 'Arial', bold: true, size: 22 })] })],
            verticalAlign: VerticalAlign.CENTER,
            width:         { size: 4000, type: WidthType.DXA },
          }),
          new TableCell({
            children:      [new Paragraph({ children: [new TextRun({ text: i18n.t('export.membersAddress'), font: 'Arial', bold: true, size: 22 })] })],
            verticalAlign: VerticalAlign.CENTER,
            width:         { size: 5000, type: WidthType.DXA },
          }),
          new TableCell({
            children:      [new Paragraph({ children: [new TextRun({ text: i18n.t('export.membersBirthday'), font: 'Arial', bold: true, size: 22 })] })],
            verticalAlign: VerticalAlign.CENTER,
            width:         { size: 3000, type: WidthType.DXA },
          }),
        ],
      }),
    ],
  })

  for (const publisher of publishers) {
    const tableRow = new TableRow({
      height:   { value: 400, rule: HeightRule.EXACT },
      children: [
        new TableCell({
          children:      [new Paragraph({ children: [new TextRun({ text: (publishers.indexOf(publisher) + 1).toString(), font: 'Arial', size: 22 })] })],
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          children:      [new Paragraph({ children: [new TextRun({ text: `${publisher.lastname}, ${publisher.firstname}`, font: 'Arial', size: 22 })] })],
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          children:      [new Paragraph({ children: [new TextRun({ text: `${publisher.address}, ${publisher.zip} ${publisher.city}`, font: 'Arial', size: 22 })] })],
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          children:      [new Paragraph({ children: [new TextRun({ text: `${publisher.birthday}`, font: 'Arial', size: 22 })] })],
          verticalAlign: VerticalAlign.CENTER,
        }),
      ],
    })

    publisherTable.addChildElement(tableRow)
  }

  const docPath = isDev()
    ? './resources/documents/regularParticipants.docx'
  // eslint-disable-next-line node/prefer-global/process
    : path.join(process.resourcesPath, 'documents', 'regularParticipants.docx')

  patchDocument({
    outputType: 'nodebuffer',
    data:       fs.readFileSync(docPath),
    patches:    {
      participants_headline: {
        type:     PatchType.PARAGRAPH,
        children: [
          new TextRun({
            text:    i18n.t('export.participantsList', { name: settings?.congregation.name.toUpperCase() }),
            font:    'Arial',
            bold:    true,
            size:    28,
            allCaps: true,
          }),
        ],
      },
      participants_date: {
        type:     PatchType.PARAGRAPH,
        children: [
          new TextRun({
            text: i18n.t('export.membersDate', { date }),
            font: 'Arial',
            size: 22,
          }),
        ],
      },
      participants_count: {
        type:     PatchType.PARAGRAPH,
        children: [
          new TextRun({
            text: i18n.t('export.participantsCount', { year: year - 1, count: publishers.length }),
            font: 'Arial',
            bold: true,
            size: 28,
          }),
        ],
      },
      participants_certification: {
        type:     PatchType.PARAGRAPH,
        children: [
          new TextRun({
            text: i18n.t('export.partisipantsCertification'),
            font: 'Arial',
            size: 22,
          }),
        ],
      },
      secretary_name: {
        type:     PatchType.PARAGRAPH,
        children: [
          new TextRun({
            text: `${settings?.user.firstname} ${settings?.user.lastname}`,
            font: 'Arial',
            size: 22,
          }),
        ],
      },
      table: {
        type:     PatchType.DOCUMENT,
        children: [publisherTable],
      },
    },
  }).then((doc) => {
    saveDocxFile(mainWindow, `${fileName}.docx`, new Uint8Array(doc))
  })
}

export default async function ExportRegularParticipantDocument(
  mainWindow: BrowserWindow,
  publisherService: PublisherService,
): Promise<void> {
  const fileName      = `RegularParticipants_${new Date().toLocaleDateString('sv')}`
  const allPublishers = await publisherService.find('LASTNAME')
  const members       = allPublishers.filter(p => p.resident === 'SWEDEN' && ((p.baptised === null || p.baptised === '') && !p.unknown_baptised && p.status !== 'INACTIVE'))

  generate_DOCX(mainWindow, members, fileName)
}
