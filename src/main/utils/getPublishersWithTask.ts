import type { PublisherModel } from '../../types/models'

export default function getPublishersWithTask(publishers: PublisherModel[], taskId: string | undefined): PublisherModel[] {
  const filteredPublishers: PublisherModel[] = []

  if (taskId) {
    for (const publisher of publishers) {
      if (publisher.tasks.includes(taskId)) {
        filteredPublishers.push(publisher)
      }
    }
  }

  return filteredPublishers
}
