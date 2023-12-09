import { ExportModel } from '../../types/models'
import { ExportService } from '../../types/type'

export default async function GetCommonExports(
  exportSErvice: ExportService
): Promise<ExportModel[]> {
  return exportSErvice.find()
}
