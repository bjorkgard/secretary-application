import log             from 'electron-log'
import SettingsService from '../services/settingsService'

const settingsService = new SettingsService()

async function deleteInformationFromServer(id: number): Promise<void> {
  const options = {
    method:  'DELETE',
    headers: {
      'Accept':        'application/json',
      'Content-Type':  'application/json;charset=UTF-8',
      'Authorization': `Bearer ${await settingsService.token()}` || import.meta.env.MAIN_VITE_TOKEN,
    },
  }

  await fetch(`${import.meta.env.MAIN_VITE_API}/information?id=${id}`, options)
    .then(() => {
      log.info('Information deleted from server')
    })
    .catch((error) => {
      log.error(error)
    })
}

export default async function DeleteInformation(id: number): Promise<void> {
  await deleteInformationFromServer(id)
}
