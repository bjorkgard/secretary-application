import type { BrowserWindow } from 'electron'
import type {
  PublisherService,
  ServiceGroupService,
  ServiceMonthService,
  SettingsService,
} from '../../types/type'
import { updateServiceGroupReport } from './postServiceGroupReport'

// import log from 'electron-log'

async function forceUpdateReport(mainWindow: BrowserWindow | null,  serviceGroupService: ServiceGroupService,  serviceMonthService: ServiceMonthService,  publisherService: PublisherService,  settingsService: SettingsService): Promise<string> {
  const settings           = await settingsService.find()
  const serviceMonthReport = await serviceMonthService.findActive()

  if (!serviceMonthReport)
    return 'NOT ACTIVE'

  // Send serviceGroup reports to server.
  // !This must be done even if only send_report_publisher are enabled
  if (settings?.online.send_report_group || settings?.online.send_report_publisher) {
    await updateServiceGroupReport(
      settingsService,
      publisherService,
      serviceGroupService,
      settings.identifier,
      settings.congregation.locale,
      serviceMonthReport,
      settings?.online.send_report_group || false,
    )
  }

  mainWindow?.webContents.send('show-spinner', { status: false })

  return 'ACTIVATED'
}

export default forceUpdateReport
