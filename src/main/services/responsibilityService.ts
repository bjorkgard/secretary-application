import { Responsibility, ResponsibilitySchema } from './../databases/schemas'
import { ResponsibilityModel } from '../../types/models'
import { ResponsibilityService as IResponsibilityService } from '../../types/type'
import ResponsibilityStore from '../databases/responsibilityStore'

const responsibilityStore = new ResponsibilityStore('responsibilities.db', ResponsibilitySchema)

const parseResponsibilityModel = (data: ResponsibilityModel): Responsibility => {
  const responsibility: Responsibility = {
    name: '',
    default: false
  }

  responsibility.name = data.name
  responsibility.default = data.default ? data.default : false

  return responsibility
}

const parseResponsibility = (data: Responsibility): ResponsibilityModel => {
  const responsibilityModel: ResponsibilityModel = {
    name: '',
    default: false
  }

  responsibilityModel._id = data._id
  responsibilityModel.name = data.name
  responsibilityModel.default = data.default ? data.default : false
  responsibilityModel.createdAt = data.createdAt?.toLocaleString('sv-SE')
  responsibilityModel.updatedAt = data.updatedAt?.toLocaleString('sv-SE')

  return responsibilityModel
}

export default class ResponsibilityService implements IResponsibilityService {
  async find(): Promise<ResponsibilityModel[]> {
    const responsibilities = (await responsibilityStore.find()) as Responsibility[]

    return responsibilities.map((sg) => parseResponsibility(sg))
  }

  async create(data: ResponsibilityModel): Promise<ResponsibilityModel> {
    const responsibility = parseResponsibilityModel(data)
    const newResponsibility = (await responsibilityStore.create(responsibility)) as Responsibility

    return parseResponsibility(newResponsibility)
  }

  async update(id: string, data: ResponsibilityModel): Promise<number> {
    const responsibility = parseResponsibilityModel(data)
    return (await responsibilityStore.update(id, responsibility)) as number
  }

  async upsert(data: ResponsibilityModel): Promise<number> {
    const responsibility = parseResponsibilityModel(data)
    return (await responsibilityStore.upsert(responsibility)) as number
  }

  async remove(data: ResponsibilityModel): Promise<number> {
    const responsibility = parseResponsibilityModel(data)
    return (await responsibilityStore.remove(responsibility)) as number
  }

  async delete(id: string): Promise<number> {
    return (await responsibilityStore.delete(id)) as number
  }

  async findOneById(id: string): Promise<ResponsibilityModel> {
    const responsible = (await responsibilityStore.findOneById(id)) as Responsibility
    return parseResponsibility(responsible)
  }

  async drop(): Promise<void> {
    responsibilityStore.drop()
  }
}
