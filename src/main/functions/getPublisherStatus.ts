import type { Report }  from '../databases/schemas'
import PublisherService from '../services/publisherService'

const publisherService = new PublisherService()

export default async function getPublisherStatus(id: string,  report: Report): Promise<'ACTIVE' | 'INACTIVE' | 'IRREGULAR'> {
  const publisher                                 = await publisherService.findOneById(id)
  let status: 'ACTIVE' | 'INACTIVE' | 'IRREGULAR' = 'ACTIVE'

  if (!publisher)
    return status

  const lastReports = publisher.reports.slice(-5)

  if (publisher.status === 'INACTIVE' && report.hasNotBeenInService)
    status = 'INACTIVE'

  if (publisher.status === 'INACTIVE' && report.hasBeenInService)
    status = 'IRREGULAR'

  if (publisher.status === 'ACTIVE' && report.hasNotBeenInService)
    status = 'IRREGULAR'

  if (publisher.status === 'IRREGULAR' && report.hasBeenInService) {
    // Get last reports and check if publisher are active again.
    // If any report hasNotBeenInService, publisher is still irregular
    status = lastReports.find(report => report.hasNotBeenInService)
      ? 'IRREGULAR'
      : 'ACTIVE'
  }

  if (publisher.status === 'IRREGULAR' && report.hasNotBeenInService) {
    // Get last reports and check if publisher are inactive
    // If any report hasBeenInService, publisher is still irregular
    status = lastReports.find(report => report.hasBeenInService)
      ? 'IRREGULAR'
      : 'INACTIVE'
  }

  return status
}
