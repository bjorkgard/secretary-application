import { Report } from 'src/types/models'

export const inCircuitOverseerService = (report: Report): boolean => {
  return report.hasBeenInService && report.type === 'CIRCUITOVERSEER'
}
