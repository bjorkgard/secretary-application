import type { BrowserWindow }  from 'electron'
import type { PublisherModel } from '../../types/models'
import type {
  AuxiliaryService,
  PublisherService,
  ServiceMonthService,
  ServiceYearService,
  SettingsService,
} from '../../types/type'
import type { Report, Stats } from '../databases/schemas'
import i18n                   from '../../localization/i18next.config'
import exportReportSummary    from './exportReportSummary'
import clearAuxiliaryTable    from './clearAuxiliaryTable'

function cleanUpReport(report: Report): Report {
  delete report.publisherId
  delete report.publisherName
  delete report.publisherEmail
  delete report.publisherMobile
  delete report.publisherServiceGroupId
  delete report.publisherSendEmail

  return report
}

function confirmPublisherStatus(publisher: PublisherModel,  report: Report,  serviceYearService: ServiceYearService, publisherService: PublisherService): 'ACTIVE' | 'INACTIVE' | 'IRREGULAR' {
  const lastReports = publisher.reports.slice(-5)
  let status        = 'ACTIVE'

  if (publisher.status === 'INACTIVE' && report.hasNotBeenInService)
    status = 'INACTIVE'

  if (publisher.status === 'INACTIVE' && report.hasBeenInService) {
    status = 'IRREGULAR'

    serviceYearService.addHistory(report.serviceYear, {
      type:        'ACTIVE',
      date:        new Date().toLocaleDateString('sv'),
      information: i18n.t('history.active', {
        name: `${publisher.firstname} ${publisher.lastname}`,
      }),
    })

    if (publisher._id) {
      publisherService.addHistory(publisher._id, {
        type: 'ACTIVE',
        date: new Date().toLocaleDateString('sv'),
      })
    }
  }

  if (publisher.status === 'ACTIVE' && report.hasNotBeenInService)
    status = 'IRREGULAR'

  if (publisher.status === 'IRREGULAR' && report.hasBeenInService) {
    // Get last reports and check if publisher are active again.
    // If any report hasNotBeenInService, publisher is still irregular
    lastReports.find(report => report.hasNotBeenInService)
      ? (status = 'IRREGULAR')
      : (status = 'ACTIVE')
  }

  if (publisher.status === 'IRREGULAR' && report.hasNotBeenInService) {
    // Get last reports and check if publisher are inactive
    // If any report hasBeenInService, publisher is still irregular
    lastReports.find(report => report.hasBeenInService)
      ? (status = 'IRREGULAR')
      : (status = 'INACTIVE')

    if (status === 'INACTIVE') {
      serviceYearService.addHistory(report.serviceYear, {
        type:        'INACTIVE',
        date:        new Date().toLocaleDateString('sv'),
        information: i18n.t('history.inactive', {
          name: `${publisher.firstname} ${publisher.lastname}`,
        }),
      })

      if (publisher._id) {
        publisherService.addHistory(publisher._id, {
          type: 'INACTIVE',
          date: new Date().toLocaleDateString('sv'),
        })
      }
    }
  }

  return status as 'ACTIVE' | 'INACTIVE' | 'IRREGULAR'
}

async function closeReporting(mainWindow: BrowserWindow | null,  serviceYearService: ServiceYearService,  serviceMonthService: ServiceMonthService,  publisherService: PublisherService,  settingsService: SettingsService,  auxiliaryService: AuxiliaryService): Promise<string> {
  const serviceMonth = await serviceMonthService.findActive()

  if (!serviceMonth)
    return 'NO ACTIVE'

  const settings = await settingsService.find()

  // Remove groups and reports from server
  const options = {
    method:  'POST',
    headers: {
      'Accept':        'application/json',
      'Content-Type':  'application/json;charset=UTF-8',
      'Authorization': `Bearer ${await settingsService.token()}` || import.meta.env.MAIN_VITE_TOKEN,
    },
    body: JSON.stringify({
      identifier: settings?.identifier,
    }),
  }
  await fetch(`${import.meta.env.MAIN_VITE_API}/delete_report`, options)

  auxiliaryService.deleteServiceMonth(serviceMonth.serviceMonth)

  // Push report to publisher.reports (if completed)
  for (const report of serviceMonth.reports) {
    if (report.publisherId && (report.hasBeenInService || report.hasNotBeenInService)) {
      const publisher = await publisherService.findOneById(report.publisherId)

      if (publisher && publisher._id) {
        // get publisher status
        publisher.status = confirmPublisherStatus(publisher, report, serviceYearService, publisherService)

        const minimalReport = cleanUpReport(report)
        publisher.reports.push(minimalReport)

        // update publisher
        await publisherService.update(publisher._id, publisher)

        // anonymize report on serviceMonth
        await serviceMonthService.saveReport(minimalReport)
      }
    }
  }

  const publishers = await publisherService.find('lastname')

  // clear auxiliary table
  clearAuxiliaryTable(serviceMonth.serviceMonth)

  // Calculate stats
  const stats: Stats = {
    activePublishers:
      publishers.filter(publisher => publisher.status === 'ACTIVE').length
      + publishers.filter(publisher => publisher.status === 'IRREGULAR').length,
    regularPublishers:   publishers.filter(publisher => publisher.status === 'ACTIVE').length,
    irregularPublishers: publishers.filter(publisher => publisher.status === 'IRREGULAR').length,
    inactivePublishers:  publishers.filter(publisher => publisher.status === 'INACTIVE').length,
    deaf:                publishers.filter(publisher => publisher.deaf).length,
    blind:               publishers.filter(publisher => publisher.blind).length,
  }

  // Generate a PDF-report
  if (mainWindow) {
    await exportReportSummary(
      mainWindow,
      serviceMonthService,
      settingsService,
      serviceMonth.serviceMonth,
      stats,
    )
  }

  // Complete serviceMonth
  if (serviceMonth._id) {
    await serviceMonthService.update(serviceMonth._id, {
      ...serviceMonth,
      status: 'DONE',
      stats,
    })
  }

  return 'CLOSED'
}

export default closeReporting
