import { Report } from 'src/types/models'

export const inSpecialPioneerService = (report: Report): boolean => {
  return report.hasBeenInService && report.type === 'SPECIALPIONEER'
}
