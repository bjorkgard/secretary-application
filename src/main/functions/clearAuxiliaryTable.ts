import AuxiliaryService from '../services/auxiliaryService'

export default function clearAuxiliaryTable(serviceMonth: string): void {
  const auxilariesService = new AuxiliaryService()

  auxilariesService.deleteServiceMonth(serviceMonth)
}
