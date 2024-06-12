import PublisherService from '../services/publisherService'

const publisherService = new PublisherService()

export default async function deleteApplication(id: string, type: string): Promise<void> {
  const publisher = await publisherService.findOneById(id)

  if (publisher) {
    const histories = publisher.histories.filter(history => history.type !== type)

    publisher.histories = histories

    await publisherService.update(id, publisher)
  }
}
