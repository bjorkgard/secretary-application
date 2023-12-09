import { Report } from 'src/types/models'

export const inAuxiliaryService = (report: Report): boolean => {
  return report.hasBeenInService && (report.type === 'AUXILIARY' || report.auxiliary == true)
}
