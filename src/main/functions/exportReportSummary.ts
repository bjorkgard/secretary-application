import type { BrowserWindow }                        from 'electron'
import { jsPDF }                                     from 'jspdf'
import type { UserOptions }                          from 'jspdf-autotable'
import i18n                                          from '../../localization/i18next.config'
import type { Meeting, Report }                      from '../../types/models'
import type { ServiceMonthService, SettingsService } from '../../types/type'
import savePdfFile                                   from './savePDFFile'

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF
}

function inActivePublisherService(report: Report): boolean {
  return (
    report.hasBeenInService
    && report.type === 'PUBLISHER'
    && report.publisherStatus !== 'INACTIVE'
    && !report.auxiliary
  )
}

function inAuxiliaryService(report: Report): boolean {
  return report.hasBeenInService && (report.type === 'AUXILIARY' || report.auxiliary === true)
}

function inPioneerService(report: Report): boolean {
  return report.hasBeenInService && report.type === 'PIONEER'
}

function inSpecialPioneerService(report: Report): boolean {
  return report.hasBeenInService && report.type === 'SPECIALPIONEER'
}

function inMissionaryService(report: Report): boolean {
  return report.hasBeenInService && report.type === 'MISSIONARY'
}

function inCircuitOverseerService(report: Report): boolean {
  return report.hasBeenInService && report.type === 'CIRCUITOVERSEER'
}

async function exportReportSummary(mainWindow: BrowserWindow,  serviceMonthService: ServiceMonthService,  settingsService: SettingsService,  serviceMonth: string): Promise<void> {
  const settings = await settingsService.find()
  const SM       = await serviceMonthService.findByServiceMonth(serviceMonth)

  const totalReports = SM
    ? SM.reports.filter(report => inActivePublisherService(report)).length
    + SM?.reports.filter(report => inAuxiliaryService(report)).length
    + SM?.reports.filter(report => inPioneerService(report)).length
    + SM?.reports.filter(report => inSpecialPioneerService(report)).length
    + SM?.reports.filter(report => inMissionaryService(report)).length
    + SM?.reports.filter(report => inCircuitOverseerService(report)).length
    : 0

  const activePublishers
    = SM?.reports.filter(
      report => report.publisherStatus === 'ACTIVE' && report.serviceMonth === serviceMonth,
    ).length || 0

  const reportRows = (reports: Report[]): string[][] => {
    const reportRows: string[][] = []

    reportRows.push([
      i18n.t('label.publishers'),
      reports.filter(report => inActivePublisherService(report)).length.toString() || '0',
      reports
        .filter(report => inActivePublisherService(report))
        .reduce((acc, report) => acc + (report.studies || 0), 0)
        .toLocaleString(),
      '',
    ])

    reportRows.push([
      i18n.t('label.auxiliaries'),
      reports.filter(report => inAuxiliaryService(report)).length.toString() || '0',
      reports
        .filter(report => inAuxiliaryService(report))
        .reduce((acc, report) => acc + (report.studies || 0), 0)
        .toLocaleString(),
      reports
        .filter(report => inAuxiliaryService(report))
        .reduce((acc, report) => acc + (report.hours || 0), 0)
        .toLocaleString(),
    ])

    reportRows.push([
      i18n.t('label.pioneers'),
      reports.filter(report => inPioneerService(report)).length.toString() || '0',
      reports
        .filter(report => inPioneerService(report))
        .reduce((acc, report) => acc + (report.studies || 0), 0)
        .toLocaleString(),
      reports
        .filter(report => inPioneerService(report))
        .reduce((acc, report) => acc + (report.hours || 0), 0)
        .toLocaleString(),
    ])

    if (reports.filter(report => inSpecialPioneerService(report)).length) {
      reportRows.push([
        i18n.t('label.specialPioneers'),
        reports.filter(report => inSpecialPioneerService(report)).length.toString() || '0',
        reports
          .filter(report => inSpecialPioneerService(report))
          .reduce((acc, report) => acc + (report.studies || 0), 0)
          .toLocaleString(),
        reports
          .filter(report => inSpecialPioneerService(report))
          .reduce((acc, report) => acc + (report.hours || 0), 0)
          .toLocaleString(),
      ])
    }

    if (reports.filter(report => inMissionaryService(report)).length) {
      reportRows.push([
        i18n.t('label.missionaries'),
        reports.filter(report => inMissionaryService(report)).length.toString() || '0',
        reports
          .filter(report => inMissionaryService(report))
          .reduce((acc, report) => acc + (report.studies || 0), 0)
          .toLocaleString(),
        reports
          .filter(report => inMissionaryService(report))
          .reduce((acc, report) => acc + (report.hours || 0), 0)
          .toLocaleString(),
      ])
    }

    if (reports.filter(report => inCircuitOverseerService(report)).length) {
      reportRows.push([
        i18n.t('label.circuitOverseers'),
        reports.filter(report => inCircuitOverseerService(report)).length.toString() || '0',
        reports
          .filter(report => inCircuitOverseerService(report))
          .reduce((acc, report) => acc + (report.studies || 0), 0)
          .toLocaleString(),
        reports
          .filter(report => inCircuitOverseerService(report))
          .reduce((acc, report) => acc + (report.hours || 0), 0)
          .toLocaleString(),
      ])
    }

    return reportRows
  }

  const meetingHeadlines = (meetings: Meeting[]): string[] => {
    const headlines: string[] = []
    headlines.push(i18n.t('meeting.headline').toUpperCase())
    meetings.forEach((meeting) => {
      headlines.push(
        meeting.name
          ? meeting.name
          : meetings.length > 1
            ? i18n.t('meeting.motherCongregationSimple')
            : i18n.t('label.total'),
      )
    })
    if (meetings.length > 1)
      headlines.push(i18n.t('label.total'))

    headlines.push(i18n.t('label.average'))

    return headlines
  }

  const meetingRows = (meetings: Meeting[]): string[][] => {
    let sumMidweek         = 0
    let sumWeekend         = 0
    const rows: string[][] = []
    const row1: string[]   = []
    const row2: string[]   = []
    row1.push(i18n.t('label.midweekMeeting'))
    meetings.forEach((meeting) => {
      sumMidweek += meeting.midweek.reduce((acc, value) => acc + value, 0)
      row1.push(meeting.midweek.reduce((acc, value) => acc + value, 0).toLocaleString() || '0')
    })
    row1.push(sumMidweek.toLocaleString())
    row1.push(Math.round(sumMidweek / meetings[0].midweek.length).toLocaleString())
    rows.push(row1)

    row2.push(i18n.t('label.weekendMeeting'))
    meetings.forEach((meeting) => {
      sumWeekend += meeting.weekend.reduce((acc, value) => acc + value, 0)
      row2.push(meeting.weekend.reduce((acc, value) => acc + value, 0).toLocaleString() || '0')
    })
    row2.push(sumWeekend.toLocaleString())
    row2.push(Math.round(sumWeekend / meetings[0].weekend.length).toLocaleString())
    rows.push(row2)

    return rows
  }

  // eslint-disable-next-line new-cap
  const pdfDoc = new jsPDF() as jsPDFWithPlugin
  pdfDoc.setProperties({
    title:    'Report compilation',
    creator:  `${settings?.user.firstname} ${settings?.user.lastname}`,
    keywords: `report, congregation, ${SM?.name}`,
  })

  const pageSize = pdfDoc.internal.pageSize

  pdfDoc.setFontSize(22)
  pdfDoc.setFont('helvetica', 'bold')
  pdfDoc.text(settings?.congregation.name || '', pageSize.getWidth() / 2, 12, { align: 'center' })
  pdfDoc.setFontSize(12)
  pdfDoc.setFont('helvetica', 'normal')
  pdfDoc.text(
    i18n.t('export.reportSummary', { month: i18n.t(`month.${SM?.name || ''}`) }),
    pageSize.getWidth() / 2,
    17,
    { align: 'center' },
  )

  pdfDoc.autoTable({
    head: [
      [
        i18n.t('reports.headline').toUpperCase(),
        i18n.t('label.noReports'),
        i18n.t('label.studies'),
        i18n.t('label.hours'),
      ],
    ],
    body: reportRows(SM?.reports || []),
    foot: [
      [
        i18n.t('label.sum'),
        totalReports,
        SM
          ? SM.reports
            .filter(report => inActivePublisherService(report))
            .reduce((acc, report) => acc + (report.studies || 0), 0)
            + SM.reports
              .filter(report => inAuxiliaryService(report))
              .reduce((acc, report) => acc + (report.studies || 0), 0)
              + SM.reports
                .filter(report => inPioneerService(report))
                .reduce((acc, report) => acc + (report.studies || 0), 0)
          : 0,
        SM
          ? (
              SM.reports
                .filter(report => inAuxiliaryService(report))
                .reduce((acc, report) => acc + (report.hours || 0), 0)
                + SM.reports
                  .filter(report => inPioneerService(report))
                  .reduce((acc, report) => acc + (report.hours || 0), 0)
            ).toLocaleString()
          : 0,
      ],
    ],
    margin: { top: 10, left: 6, right: 6, bottom: 15 },
    styles: {
      cellPadding: 2,
      fontSize:    8,
      overflow:    'linebreak',
      valign:      'middle',
      lineWidth:   0.1,
    },
    startY:       25,
    rowPageBreak: 'avoid',
    theme:        'striped',
  })

  pdfDoc.autoTable({
    body: [
      [i18n.t('label.actives'), activePublishers, '', ''],
      [
        i18n.t('label.irregulars'),
        SM?.reports.filter(report => report.publisherStatus === 'IRREGULAR').length.toString()
        || '0',
        '',
        '',
      ],
      [
        i18n.t('label.inactives'),
        SM?.reports.filter(report => report.publisherStatus === 'INACTIVE').length.toString()
        || '0',
        '',
        '',
      ],
    ],
    margin: { top: 10, left: 6, right: 6, bottom: 15 },
    styles: {
      cellPadding: 2,
      fontSize:    8,
      overflow:    'linebreak',
      valign:      'middle',
      lineWidth:   0.1,
    },
    rowPageBreak: 'avoid',
    theme:        'striped',
  })

  // Meetings
  pdfDoc.autoTable({
    head:   [meetingHeadlines(SM?.meetings || [])],
    body:   meetingRows(SM?.meetings || []),
    margin: { top: 10, left: 6, right: 6, bottom: 15 },
    styles: {
      cellPadding: 2,
      fontSize:    8,
      overflow:    'linebreak',
      valign:      'middle',
      lineWidth:   0.1,
    },
    rowPageBreak: 'avoid',
    theme:        'striped',
  })

  savePdfFile(mainWindow, `reportCompilation_${SM?.serviceMonth}.pdf`, pdfDoc.output('arraybuffer'))
}

export default exportReportSummary
