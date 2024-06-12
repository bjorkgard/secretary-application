import type { PublisherWithApplication } from '../../types/models'
import type PublisherService             from '../services/publisherService'

export default async function GetPublishersWithOldApplications(
  publisherService: PublisherService,
): Promise<PublisherWithApplication[]> {
  const publishers: PublisherWithApplication[] = []

  const allPublishers = await publisherService.find('lastname')

  allPublishers
    .filter(publisher => publisher.histories.some(history => history.type === 'DC-50'))
    .map((publisher) => {
      const histories = publisher.histories.filter(history => history.type === 'DC-50')
      const history   = histories.reduce((a, b) => a.date > b.date ? a : b)

      if (new Date(history.date) < new Date(new Date().setMonth(new Date().getMonth() - 36))) {
        publishers.push({
          id:              publisher._id || '',
          name:            `${publisher.lastname}, ${publisher.firstname}`,
          applicationType: history.type,
          applicationDate: history.date,
        })
      }

      return publisher
    })

  allPublishers
    .filter(publisher => publisher.histories.some(history => history.type === 'A-2'))
    .map((publisher) => {
      const histories = publisher.histories.filter(history => history.type === 'A-2')
      const history   = histories.reduce((a, b) => a.date > b.date ? a : b)

      if (new Date(history.date) < new Date(new Date().setMonth(new Date().getMonth() - 36))) {
        publishers.push({
          id:              publisher._id || '',
          name:            `${publisher.lastname}, ${publisher.firstname}`,
          applicationType: history.type,
          applicationDate: history.date,
        })
      }

      return publisher
    })

  allPublishers
    .filter(publisher => publisher.histories.some(history => history.type === 'A-8'))
    .map((publisher) => {
      const histories = publisher.histories.filter(history => history.type === 'A-8')
      const history   = histories.reduce((a, b) => a.date > b.date ? a : b)

      if (new Date(history.date) < new Date(new Date().setMonth(new Date().getMonth() - 36))) {
        publishers.push({
          id:              publisher._id || '',
          name:            `${publisher.lastname}, ${publisher.firstname}`,
          applicationType: history.type,
          applicationDate: history.date,
        })
      }

      return publisher
    })

  allPublishers
    .filter(publisher => publisher.histories.some(history => history.type === 'A-19'))
    .map((publisher) => {
      const histories = publisher.histories.filter(history => history.type === 'A-19')
      const history   = histories.reduce((a, b) => a.date > b.date ? a : b)

      if (new Date(history.date) < new Date(new Date().setMonth(new Date().getMonth() - 36))) {
        publishers.push({
          id:              publisher._id || '',
          name:            `${publisher.lastname}, ${publisher.firstname}`,
          applicationType: history.type,
          applicationDate: history.date,
        })
      }

      return publisher
    })

  return publishers
}
