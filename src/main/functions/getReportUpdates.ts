import type { BrowserWindow } from 'electron'
import { Notification }       from 'electron'
import log                    from 'electron-log'
import ServiceMonthService    from '../services/serviceMonthService'
import SettingsService        from '../services/settingsService'
import i18n                   from '../../localization/i18next.config'

const serviceMonthService = new ServiceMonthService()
const settingsService     = new SettingsService()

interface ReportDB {
  id:                      559
  service_group_id:        number
  identifier:              string
  type:                    string
  name:                    string
  has_been_in_service:     boolean
  has_not_been_in_service: boolean
  studies:                 number | null
  auxiliary:               boolean
  hours:                   number | null
  remarks:                 string | null
  publisher_status:        string
  publisher_name:          string
  publisher_email:         string | null
  locale:                  string
  has_been_updated:        boolean
  send_email:              boolean
  email_status:            string
  created_at:              string
  updated_at:              string
}

async function getReportsFromServer(identifier: string): Promise<ReportDB[]> {
  let reports: ReportDB[] = []
  const options           = {
    method:  'GET',
    headers: {
      'Accept':        'application/json',
      'Content-Type':  'application/json;charset=UTF-8',
      'Authorization': `Bearer ${await settingsService.token()}` || import.meta.env.MAIN_VITE_TOKEN,
    },
  }

  const temp = await fetch(`${import.meta.env.MAIN_VITE_API}/reports/${identifier}`, options)
    .then(response => response.json())
    .then((response: { data: ReportDB[] }) => {
      return response.data
    })
    .catch((error) => {
      log.error(error)
    })
    .finally(() => {
      return []
    })

  if (temp)
    reports = temp

  return reports
}

async function resetUpdates(reportIds: number[]): Promise<void> {
  const options = {
    method:  'POST',
    headers: {
      'Accept':        'application/json',
      'Content-Type':  'application/json;charset=UTF-8',
      'Authorization': `Bearer ${await settingsService.token()}` || import.meta.env.MAIN_VITE_TOKEN,
    },
    body: JSON.stringify({
      ids: reportIds,
    }),
  }

  fetch(`${import.meta.env.MAIN_VITE_API}/reports/reset-updated`, options)
}

async function getReportUpdates(mainWindow: BrowserWindow | null): Promise<void> {
  const settings            = await settingsService.find()
  const reportIds: number[] = []

  const date = new Date()
  date.setDate(0)

  const serviceMonth = await serviceMonthService.findByServiceMonth(
    `${date.getFullYear()}-${date.getMonth() + 1}`,
  )

  // check if there is a service month and if it is not done
  if (settings && serviceMonth && serviceMonth.status !== 'DONE') {
    // Get report updates from server
    getReportsFromServer(settings.identifier).then(async (updatedReports) => {
      for (const r of updatedReports) {
        reportIds.push(r.id)
        const reportIndex = serviceMonth.reports.findIndex(
          report => report.identifier === r.identifier,
        )

        serviceMonth.reports[reportIndex].hasBeenInService    = r.has_been_in_service
        serviceMonth.reports[reportIndex].hasNotBeenInService = r.has_not_been_in_service
        serviceMonth.reports[reportIndex].studies             = r.studies ? r.studies : undefined
        serviceMonth.reports[reportIndex].auxiliary           = r.auxiliary
        serviceMonth.reports[reportIndex].hours               = r.hours ? r.hours : undefined
        serviceMonth.reports[reportIndex].remarks             = r.remarks ? r.remarks : undefined
      }

      if (serviceMonth._id && updatedReports.length > 0) {
        // Update serviceMonth
        await serviceMonthService.update(serviceMonth._id, serviceMonth)

        // Send to renderer process (missingReports, activeReports)
        mainWindow?.webContents.send('updated-reports')

        // Update online reports
        resetUpdates(reportIds)

        new Notification({
          title: 'SECRETARY',
          body:  i18n.t('reports.updated.body', { count: updatedReports.length }),
        }).show()
      }
    })
  }
}

export default getReportUpdates
