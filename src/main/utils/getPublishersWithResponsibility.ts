import type { PublisherModel } from '../../types/models'

export default function getPublishersWithResponsibility(publishers: PublisherModel[], responsibillityId: string | undefined): PublisherModel[] {
  const filteredPublishers: PublisherModel[] = []

  if (responsibillityId) {
    for (const publisher of publishers) {
      if (publisher.responsibilities.includes(responsibillityId)) {
        filteredPublishers.push(publisher)
      }
    }
  }

  return filteredPublishers
}
