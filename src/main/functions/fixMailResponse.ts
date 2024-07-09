import log             from 'electron-log'
import SettingsService from '../services/settingsService'

const settingsService = new SettingsService()

async function fixResponseFromServer(email: string): Promise<void> {
  const options = {
    method:  'PUT',
    headers: {
      'Accept':        'application/json',
      'Content-Type':  'application/json;charset=UTF-8',
      'Authorization': `Bearer ${await settingsService.token()}` || import.meta.env.MAIN_VITE_TOKEN,
    },
  }

  await fetch(`${import.meta.env.MAIN_VITE_API}/mailResponse?email=${email}`, options)
    .then(() => {
      log.info('Update fix on server')
    })
    .catch((error) => {
      log.error(error)
    })
}

export default async function FixMailRespons(email: string): Promise<void> {
  await fixResponseFromServer(email)
}
