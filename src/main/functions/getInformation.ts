import log                   from 'electron-log'
import SettingsService       from '../services/settingsService'
import type { MailResponse } from '../../types/models'

const settingsService = new SettingsService()

async function getInformationFromServer(identifier: string): Promise<MailResponse[]> {
  let responses: MailResponse[] = []

  const options = {
    method:  'GET',
    headers: {
      'Accept':        'application/json',
      'Content-Type':  'application/json;charset=UTF-8',
      'Authorization': `Bearer ${await settingsService.token()}` || import.meta.env.MAIN_VITE_TOKEN,
    },
  }

  const temp = await fetch(`${import.meta.env.MAIN_VITE_API}/information/${identifier}`, options)
    .then(response => response.json())
    .then((response: { data: MailResponse[] }) => {
      return response.data
    })
    .catch((error) => {
      log.error(error)
    })
    .finally(() => {
      return []
    })

  if (temp)
    responses = temp

  return responses
}

export default async function GetInformationResponses(): Promise<MailResponse[]> {
  const settings = await settingsService.find()

  if (settings) {
    return await getInformationFromServer(settings.identifier)
  }

  return []
}
