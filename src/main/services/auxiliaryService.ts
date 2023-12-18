import { Auxiliary, AuxiliarySchema } from '../databases/schemas'
import { AuxiliaryModel } from '../../types/models'
import { AuxiliaryService as IAuxiliaryService } from '../../types/type'
import AuxiliaryStore from '../databases/auxiliaryStore'

const auxiliaryStore = new AuxiliaryStore('auxiliaries.db', AuxiliarySchema)

const parseAuxiliaryModel = (data: AuxiliaryModel): Auxiliary => {
  const auxiliary = <Auxiliary>{
    serviceMonth: '',
    name: '',
    publisherIds: []
  }

  auxiliary.serviceMonth = data.serviceMonth
  auxiliary.name = data.name
  auxiliary.publisherIds = data.publisherIds

  return auxiliary
}

const parseAuxiliary = (data: Auxiliary): AuxiliaryModel => {
  const auxiliaryModel = <AuxiliaryModel>{
    serviceMonth: '',
    name: '',
    publisherIds: []
  }

  auxiliaryModel._id = data._id
  auxiliaryModel.serviceMonth = data.serviceMonth
  auxiliaryModel.name = data.name
  auxiliaryModel.publisherIds = data.publisherIds
  auxiliaryModel.createdAt = data.createdAt?.toLocaleString('sv-SE')
  auxiliaryModel.updatedAt = data.updatedAt?.toLocaleString('sv-SE')

  return auxiliaryModel
}

export default class AuxiliaryService implements IAuxiliaryService {
  async deleteServiceMonth(serviceMonth: string): Promise<number> {
    return (await auxiliaryStore.deleteServiceMonth(serviceMonth)) as number
  }

  async upsert({
    serviceMonth,
    name
  }: {
    serviceMonth: string
    name: string
  }): Promise<AuxiliaryModel> {
    const auxiliary = (await auxiliaryStore.findByServiceMonth(serviceMonth)) as Auxiliary

    if (auxiliary) {
      return parseAuxiliary(auxiliary)
    } else {
      const newAuxiliary = (await auxiliaryStore.create({
        serviceMonth: serviceMonth,
        name: name,
        publisherIds: []
      })) as Auxiliary

      return parseAuxiliary(newAuxiliary)
    }
  }

  async findByServiceMonth(serviceMonth: string): Promise<AuxiliaryModel | null> {
    const auxiliary = (await auxiliaryStore.findByServiceMonth(serviceMonth)) as Auxiliary

    return parseAuxiliary(auxiliary)
  }

  async find(): Promise<AuxiliaryModel[]> {
    const auxiliaries = (await auxiliaryStore.find()) as Auxiliary[]

    return auxiliaries.map((a) => parseAuxiliary(a))
  }

  async create(data: AuxiliaryModel): Promise<AuxiliaryModel> {
    const auxiliary = parseAuxiliaryModel(data)
    const newAuxiliary = (await auxiliaryStore.create(auxiliary)) as Auxiliary

    return parseAuxiliary(newAuxiliary)
  }

  async update(id: string, data: AuxiliaryModel): Promise<number> {
    const auxiliary = parseAuxiliaryModel(data)
    return (await auxiliaryStore.update(id, auxiliary)) as number
  }

  async delete(id: string): Promise<number> {
    return (await auxiliaryStore.delete(id)) as number
  }

  async findOneById(id: string): Promise<AuxiliaryModel> {
    const auxiliary = (await auxiliaryStore.findOneById(id)) as Auxiliary
    return parseAuxiliary(auxiliary)
  }

  async drop(): Promise<void> {
    auxiliaryStore.drop()
  }
}
