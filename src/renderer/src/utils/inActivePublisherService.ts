import { Report } from 'src/types/models'

export const inActivePublisherService = (report: Report): boolean => {
  return (
    report.hasBeenInService &&
    report.type === 'PUBLISHER' &&
    report.publisherStatus !== 'INACTIVE' &&
    !report.auxiliary
  )
}
