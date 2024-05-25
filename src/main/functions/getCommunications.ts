import { Notification }    from 'electron'
import log                 from 'electron-log'
import i18n                from '../../localization/i18next.config'
import PublisherService    from '../services/publisherService'
import ServiceGroupService from '../services/serviceGroupService'
import SettingsService     from '../services/settingsService'

const publisherService    = new PublisherService()
const serviceGroupService = new ServiceGroupService()
const settingsService     = new SettingsService()

interface CommunicationDB {
  id:         number
  identifier: string
  type:       string
  data:       string
  created_at: string
  updated_at: string
}

async function getCommunicationsFromServer(identifier: string): Promise<CommunicationDB[]> {
  let communications: CommunicationDB[] = []

  const options = {
    method:  'GET',
    headers: {
      'Accept':        'application/json',
      'Content-Type':  'application/json;charset=UTF-8',
      'Authorization': `Bearer ${await settingsService.token()}` || import.meta.env.MAIN_VITE_TOKEN,
    },
  }

  const temp = await fetch(`${import.meta.env.MAIN_VITE_API}/communications/${identifier}`, options)
    .then(response => response.json())
    .then((response: { data: CommunicationDB[] }) => {
      return response.data
    })
    .catch((error) => {
      log.error(error)
    })
    .finally(() => {
      return []
    })

  if (temp)
    communications = temp

  return communications
}

async function resetCommunication(id: number): Promise<void> {
  const options = {
    method:  'DELETE',
    headers: {
      'Accept':        'application/json',
      'Content-Type':  'application/json;charset=UTF-8',
      'Authorization': `Bearer ${await settingsService.token()}` || import.meta.env.MAIN_VITE_TOKEN,
    },
  }

  fetch(`${import.meta.env.MAIN_VITE_API}/communication/${id}`, options)
}

async function getCommunications(): Promise<void> {
  const settings = await settingsService.find()

  if (settings) {
    // Get report updates from server
    getCommunicationsFromServer(settings.identifier).then(async (communications) => {
      for (const c of communications) {
        switch (c.type) {
          case 'PUBLISHER':
            await serviceGroupService.upsert({ name: 'TEMPORARY' }).then(async () => {
              await serviceGroupService.findOneByName('TEMPORARY').then(async (sg) => {
                if (sg) {
                  const publisher = JSON.parse(c.data)
                  await publisherService.create({ ...publisher, _id: undefined, serviceGroupId: sg._id })
                }
              })
            })

            break
        }

        resetCommunication(c.id)
      }

      if (communications.length > 0) {
        new Notification({
          title: 'SECRETARY',
          body:  i18n.t('communications.body', { count: communications.length }),
        }).show()
      }
    })
  }
}

export default getCommunications
