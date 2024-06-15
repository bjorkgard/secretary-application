import type { PublisherModel } from '../../types/models'

export default function getPublishersWithAppointment(publishers: PublisherModel[], type: string): PublisherModel[] {
  const filteredPublishers: PublisherModel[] = []

  for (const publisher of publishers) {
    for (const appointment of publisher.appointments) {
      if (appointment.type === type) {
        filteredPublishers.push(publisher)
      }
    }
  }

  return filteredPublishers
}
