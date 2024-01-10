import type { Report } from 'src/types/models'

export function inCircuitOverseerService(report: Report): boolean {
  return report.hasBeenInService && report.type === 'CIRCUITOVERSEER'
}
