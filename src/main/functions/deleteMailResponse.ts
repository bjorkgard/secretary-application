import log             from 'electron-log'
import SettingsService from '../services/settingsService'

const settingsService = new SettingsService()

async function deleteResponseFromServer(email: string): Promise<void> {
  const options = {
    method:  'DELETE',
    headers: {
      'Accept':        'application/json',
      'Content-Type':  'application/json;charset=UTF-8',
      'Authorization': `Bearer ${await settingsService.token()}` || import.meta.env.MAIN_VITE_TOKEN,
    },
  }

  await fetch(`${import.meta.env.MAIN_VITE_API}/mailResponse?email=${email}`, options)
    .then(() => {
      log.info('Response deleted from server')
    })
    .catch((error) => {
      log.error(error)
    })
}

export default async function DeleteMailRespons(email: string): Promise<void> {
  await deleteResponseFromServer(email)
}
