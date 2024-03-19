import type { ImportantDate }                                 from '../databases/schemas'
import { ImportantDateSchema }                                from '../databases/schemas'
import type { ImportantDateModel }                            from '../../types/models'
import type { ImportantDateService as IImportantDateService } from '../../types/type'
import ImportantDateStore                                     from '../databases/importantDateStore'

const importantDateStore = new ImportantDateStore('dates.db', ImportantDateSchema)

function parseImportantDateModel(data: ImportantDateModel): ImportantDate {
  const importatDate: ImportantDate = {
    type: '',
  }

  importatDate.type = data.type

  return importatDate
}

function parseImportantDate(data: ImportantDate): ImportantDateModel {
  const importatDateModel: ImportantDateModel = {
    type: '',
  }

  importatDateModel._id       = data._id
  importatDateModel.type      = data.type
  importatDateModel.createdAt = data.createdAt?.toLocaleString('sv-SE')
  importatDateModel.updatedAt = data.updatedAt?.toLocaleString('sv-SE')

  return importatDateModel
}

export default class ImportantDateService implements IImportantDateService {
  async findByType(type: string): Promise<ImportantDateModel | null> {
    const date = (await importantDateStore.findOneByType(type)) as ImportantDate
    if (!date)
      return null

    return parseImportantDate(date)
  }

  async find(): Promise<ImportantDateModel[]> {
    const dates = (await importantDateStore.find()) as ImportantDate[]

    return dates.map(t => parseImportantDate(t))
  }

  async create(data: ImportantDateModel): Promise<ImportantDateModel> {
    const date    = parseImportantDateModel(data)
    const newDate = (await importantDateStore.create(date)) as ImportantDate

    return parseImportantDate(newDate)
  }

  async update(id: string, data: ImportantDateModel): Promise<number> {
    const date = parseImportantDateModel(data)
    return (await importantDateStore.update(id, date)) as number
  }

  async upsert(data: ImportantDateModel): Promise<number> {
    const date = parseImportantDateModel(data)
    return (await importantDateStore.upsert(date)) as number
  }

  async remove(data: ImportantDateModel): Promise<number> {
    const date = parseImportantDateModel(data)
    return (await importantDateStore.remove(date)) as number
  }

  async delete(id: string): Promise<number> {
    return (await importantDateStore.delete(id)) as number
  }

  async findOneById(id: string): Promise<ImportantDateModel> {
    const date = (await importantDateStore.findOneById(id)) as ImportantDate
    return parseImportantDate(date)
  }

  async drop(): Promise<void> {
    importantDateStore.drop()
  }
}
