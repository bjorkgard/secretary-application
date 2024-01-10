import type { Report } from 'src/types/models'

export function inMissionaryService(report: Report): boolean {
  return report.hasBeenInService && report.type === 'MISSIONARY'
}
