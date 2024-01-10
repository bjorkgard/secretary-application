import type { PublisherModel, ServiceMonthModel }                      from '../../types/models'
import type { PublisherService, ServiceGroupService, SettingsService } from '../../types/type'

interface SimplePublisher {
  _id:    string
  email?: string
}

function transformToSimplePublisher(publisher: PublisherModel): SimplePublisher {
  return {
    _id:   publisher._id || '',
    email: publisher.email,
  }
}

export async function postServiceGroupReport(settingsService: SettingsService,  publisherService: PublisherService,  serviceGroupService: ServiceGroupService,  identifier: string,  locale: string,  serviceMonth: ServiceMonthModel,  sendMail: boolean): Promise<void> {
  const publisherId: string[]               = []
  const simplePublishers: SimplePublisher[] = []
  const serviceGroups                       = await serviceGroupService.find()

  if (sendMail) {
    for (const sg of serviceGroups) {
      if (sg.responsibleId)
        publisherId.push(sg.responsibleId)

      if (sg.assistantId)
        publisherId.push(sg.assistantId)
    }

    const publishers = await publisherService.findByIds(publisherId)
    for (const p of publishers)
      simplePublishers.push(transformToSimplePublisher(p))
  }

  const options = {
    method:  'POST',
    headers: {
      'Accept':        'application/json',
      'Content-Type':  'application/json;charset=UTF-8',
      'Authorization': `Bearer ${await settingsService.token()}` || import.meta.env.MAIN_VITE_TOKEN,
    },
    body: JSON.stringify({
      identifier,
      locale,
      publishers: simplePublishers,
      serviceGroups,
      serviceMonth,
    }),
  }

  await fetch(`${import.meta.env.MAIN_VITE_API}/report`, options)
}
