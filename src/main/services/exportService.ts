import type { Export }                          from '../databases/schemas'
import { ExportSchema }                         from '../databases/schemas'
import type { ExportModel }                     from '../../types/models'
import type { ExportService as IExportService } from '../../types/type'
import ExportStore                              from '../databases/exportStore'

const exportStore = new ExportStore('exports.db', ExportSchema)

function parseExportModel(data: ExportModel): Export {
  const exp: Export = {
    name:   '',
    format: '',
    method: '',
    count:  0,
  }

  exp.name   = data.name
  exp.format = data.format
  exp.method = data.method
  exp.count  = data.count

  return exp
}

function parseExport(data: Export): ExportModel {
  const exportModel: ExportModel = {
    name:   '',
    format: '',
    method: '',
    count:  0,
  }

  exportModel._id       = data._id
  exportModel.name      = data.name
  exportModel.format    = data.format
  exportModel.method    = data.method
  exportModel.count     = data.count
  exportModel.createdAt = data.createdAt?.toLocaleString('sv-SE')
  exportModel.updatedAt = data.updatedAt?.toLocaleString('sv-SE')

  return exportModel
}

export default class ExportService implements IExportService {
  async create(data: ExportModel): Promise<ExportModel> {
    const exp = parseExportModel(data)

    const newExport = (await exportStore.create(exp)) as Export
    return parseExport(newExport)
  }

  async update(id: string, data: ExportModel): Promise<number> {
    const exp = parseExportModel(data)
    return (await exportStore.update(id, exp)) as number
  }

  async findOneById(id: string): Promise<ExportModel> {
    const exp = (await exportStore.findOneById(id)) as Export
    return parseExport(exp)
  }

  async find(): Promise<ExportModel[]> {
    const exports = (await exportStore.find()) as Export[]

    return exports.map(e => parseExport(e))
  }

  async upsert(name: string, format: string, method: string): Promise<number> {
    return (await exportStore.upsert(name, format, method)) as number
  }

  async drop(): Promise<void> {
    exportStore.drop()
  }
}
