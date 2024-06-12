import i18n             from '../../localization/i18next.config'
import PublisherService from '../services/publisherService'

const publisherService = new PublisherService()

export default async function renewApplication(id: string, type: string): Promise<void> {
  const publisher = await publisherService.findOneById(id)

  if (publisher) {
    const history = JSON.parse(JSON.stringify(publisher.histories.find(history => history.type === type)))

    if (history) {
      history.date        = new Date().toLocaleDateString('sv')
      history.information = i18n.t('history.renewed')
      publisher.histories.push(history)

      await publisherService.update(id, publisher)
    }
  }
}
