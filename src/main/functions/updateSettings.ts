import log from 'electron-log'
import { SettingsModel } from '../../types/models'
import { SettingsService } from '../../types/type'

const updateSettings = async (
  settingsService: SettingsService,
  settings: SettingsModel
): Promise<number | null> => {
  if (settings._id) {
    if (settings.online.public) {
      const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization:
            'Bearer ' + (await settingsService.token()) || import.meta.env.MAIN_VITE_TOKEN
        },
        body: JSON.stringify({
          identifier: settings.identifier,
          congregation: settings.congregation.name,
          congregation_number: settings.congregation.number,
          contact_firstname: settings.user.firstname,
          contact_lastname: settings.user.lastname,
          contact_email: settings.user.email,
          send_service_group_reports: settings.online.send_report_group,
          send_publisher_reports: settings.online.send_report_publisher
        })
      }

      fetch(`${import.meta.env.MAIN_VITE_API}/congregation`, options)
        .then((response) => response.json())
        .catch((error) => log.error(error))
    } else {
      const options = {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization:
            'Bearer ' + (await settingsService.token()) || import.meta.env.MAIN_VITE_TOKEN
        }
      }

      fetch(`${import.meta.env.MAIN_VITE_API}/congregation/${settings.identifier}`, options)
        .then((response) => response.json())
        .then((data) => {
          log.info(data)
        })
        .catch((error) => log.error(error))
    }

    return await settingsService.update(settings._id, settings)
  }

  return null
}

export default updateSettings
