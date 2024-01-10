import type { Report } from 'src/types/models'

export function inAuxiliaryService(report: Report): boolean {
  return report.hasBeenInService && (report.type === 'AUXILIARY' || report.auxiliary === true)
}
