import { BrowserWindow } from 'electron'
import {
  AuxiliaryService,
  PublisherService,
  ServiceGroupService,
  ServiceMonthService,
  ServiceYearService,
  SettingsService
} from '../../types/type'
import { Report, Meeting } from '../databases/schemas'
import generateIdentifier from '../utils/generateIdentifier'
import getServiceYear from '../utils/getServiceYear'
import getSortOrder from '../utils/getSortOrder'
import closeReporting from './closeReporting'
import { postServiceGroupReport } from './postServiceGroupReport'

const getMissingReports = async (
  date: Date,
  serviceMonthService: ServiceMonthService
): Promise<Report[]> => {
  const previousMonth = new Date()
  previousMonth.setMonth(date.getMonth() - 1)
  const previousServiceMonthName = `${previousMonth.getFullYear()}-${previousMonth.getMonth() + 1}`
  const serviceMonth = await serviceMonthService.findByServiceMonth(previousServiceMonthName)

  if (serviceMonth) {
    return serviceMonth.reports.filter(
      (report) => report.hasBeenInService === false && report.hasNotBeenInService === false
    )
  }

  return []
}

const startReporting = async (
  mainWindow: BrowserWindow | null,
  serviceGroupService: ServiceGroupService,
  serviceMonthService: ServiceMonthService,
  publisherService: PublisherService,
  settingsService: SettingsService,
  serviceYearService: ServiceYearService,
  auxiliaryService: AuxiliaryService
): Promise<string> => {
  const date = new Date()
  date.setDate(0)
  let monthString = date.getMonth() + 1
  const serviceMonthName = `${date.getFullYear()}-${monthString < 10 ? '0' : ''}${monthString}`

  const serviceMonth = await serviceMonthService.findByServiceMonth(serviceMonthName)

  if (serviceMonth) {
    return 'ONGOING'
  }

  // Close the previous month if it is still active
  await closeReporting(
    mainWindow,
    serviceYearService,
    serviceMonthService,
    publisherService,
    settingsService,
    auxiliaryService
  )

  const reports: Report[] = []
  const meetings: Meeting[] = []
  const publishers = await publisherService.find('lastname', '')
  const settings = await settingsService.find()
  const auxiliaryMonth = await auxiliaryService.findByServiceMonth(serviceMonthName)

  if (settings?.congregation.languageGroups.length) {
    meetings.push({
      identifier: generateIdentifier(),
      midweek: [],
      weekend: []
    })

    for (const languageGroup of settings.congregation.languageGroups) {
      meetings.push({
        name: languageGroup.name,
        identifier: generateIdentifier(),
        midweek: [],
        weekend: []
      })
    }
  } else {
    meetings.push({
      identifier: generateIdentifier(),
      midweek: [],
      weekend: []
    })
  }

  for (const publisher of publishers) {
    let type = 'PUBLISHER'

    const pioneerArray = ['PIONEER', 'SPECIALPIONEER', 'AUXILIARY', 'MISSIONARY']

    publisher.appointments.map((appointment) => {
      if (pioneerArray.includes(appointment.type)) {
        type = appointment.type.toUpperCase()
      }
    })

    const report: Report = {
      serviceYear: getServiceYear(serviceMonthName),
      serviceMonth: serviceMonthName,
      name: date.toLocaleString('default', { month: 'long' }).toLowerCase(),
      hasBeenInService: false,
      hasNotBeenInService: publisher.status === 'INACTIVE' ? true : false,
      sortOrder: getSortOrder(serviceMonthName),
      identifier: generateIdentifier(),
      type: type as
        | 'PUBLISHER'
        | 'PIONEER'
        | 'SPECIALPIONEER'
        | 'AUXILIARY'
        | 'MISSIONARY'
        | 'CIRCUITOVERSEER',
      auxiliary:
        type === 'AUXILIARY'
          ? true
          : auxiliaryMonth?.publisherIds.includes(publisher._id || '')
            ? true
            : false,
      publisherId: publisher._id,
      publisherName: `${publisher.lastname}, ${publisher.firstname}`,
      publisherEmail: publisher.email,
      publisherMobile: publisher.mobile,
      publisherServiceGroupId: publisher.serviceGroupId,
      publisherStatus: publisher.status,
      publisherSendEmail: publisher.sendReports
    }

    reports.push(report)
  }

  // Get missing reports from previous month
  await getMissingReports(date, serviceMonthService).then((missingReports) => {
    reports.push(...missingReports)
  })

  const serviceMonthReport = await serviceMonthService.create({
    status: 'ACTIVE',
    serviceYear: getServiceYear(serviceMonthName),
    name: date.toLocaleString('default', { month: 'long' }).toLowerCase(),
    serviceMonth: serviceMonthName,
    sortOrder: getSortOrder(serviceMonthName),
    reports: reports,
    meetings: meetings,
    stats: {
      activePublishers: 0,
      regularPublishers: 0,
      irregularPublishers: 0,
      inactivePublishers: 0,
      deaf: 0,
      blind: 0
    }
  })

  if (serviceMonthReport._id) {
    const serviceYear = await serviceYearService.findOrCreate(getServiceYear(serviceMonthName))
    serviceYear.serviceMonths.push(serviceMonthReport._id)
    if (serviceYear._id) {
      serviceYearService.update(serviceYear._id, serviceYear)
    }
  }

  // Send serviceGroup reports to server.
  // !This must be done even if only send_report_publisher are enabled
  if (settings?.online.send_report_group || settings?.online.send_report_publisher) {
    await postServiceGroupReport(
      settingsService,
      publisherService,
      serviceGroupService,
      settings.identifier,
      settings.congregation.locale,
      serviceMonthReport,
      settings?.online.send_report_group || false
    )
  }

  // Send publisher reports to server
  if (settings?.online.send_report_publisher) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization:
          'Bearer ' + (await settingsService.token()) || import.meta.env.MAIN_VITE_TOKEN
      },
      body: JSON.stringify({})
    }
    await fetch(`${import.meta.env.MAIN_VITE_API}/send_reports`, options)
  }

  return 'ACTIVATED'
}

export default startReporting
