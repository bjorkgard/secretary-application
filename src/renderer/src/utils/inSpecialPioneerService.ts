import type { Report } from 'src/types/models'

export function inSpecialPioneerService(report: Report): boolean {
  return report.hasBeenInService && report.type === 'SPECIALPIONEER'
}
