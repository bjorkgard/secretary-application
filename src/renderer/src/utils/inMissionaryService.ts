import { Report } from 'src/types/models'

export const inMissionaryService = (report: Report): boolean => {
  return report.hasBeenInService && report.type === 'MISSIONARY'
}
