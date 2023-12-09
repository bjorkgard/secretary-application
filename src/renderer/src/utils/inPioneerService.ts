import { Report } from 'src/types/models'

export const inPioneerService = (report: Report): boolean => {
  return report.hasBeenInService && report.type === 'PIONEER'
}
