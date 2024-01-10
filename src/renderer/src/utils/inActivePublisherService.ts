import type { Report } from 'src/types/models'

export function inActivePublisherService(report: Report): boolean {
  return (
    report.hasBeenInService
    && report.type === 'PUBLISHER'
    && report.publisherStatus !== 'INACTIVE'
    && !report.auxiliary
  )
}
