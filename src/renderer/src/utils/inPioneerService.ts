import type { Report } from 'src/types/models'

export function inPioneerService(report: Report): boolean {
  return report.hasBeenInService && report.type === 'PIONEER'
}
