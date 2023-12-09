import { ServiceYear, ServiceYearSchema } from '../databases/schemas'
import { History, ServiceYearModel } from '../../types/models'
import { ServiceYearService as IServiceYearService } from '../../types/type'
import ServiceYearStore from '../databases/serviceYearStore'

const serviceYearStore = new ServiceYearStore('serviceYears.db', ServiceYearSchema)

const parseServiceYearModel = (data: ServiceYearModel): ServiceYear => {
  const serviceYear: ServiceYear = {
    name: 0,
    serviceMonths: [],
    history: []
  }

  serviceYear.name = data.name
  serviceYear.serviceMonths = data.serviceMonths
  serviceYear.history = data.history

  return serviceYear
}

const parseServiceYear = (data: ServiceYear): ServiceYearModel => {
  const serviceYearModel: ServiceYearModel = {
    name: 0,
    serviceMonths: [],
    history: []
  }

  serviceYearModel._id = data._id
  serviceYearModel.name = data.name
  serviceYearModel.serviceMonths = data.serviceMonths
  serviceYearModel.history = data.history
  serviceYearModel.createdAt = data.createdAt?.toLocaleString('sv-SE')
  serviceYearModel.updatedAt = data.updatedAt?.toLocaleString('sv-SE')

  return serviceYearModel
}

export default class ServiceYearService implements IServiceYearService {
  addHistory(name: number, history: History): void {
    this.findByServiceYear(name).then((serviceYear) => {
      if (serviceYear?._id) {
        serviceYear.history.push(history)
        this.update(serviceYear._id, serviceYear)
      }
    })
  }

  async findOrCreate(name: number): Promise<ServiceYearModel> {
    const serviceYear = (await serviceYearStore.findOrCreate(name)) as ServiceYear

    return parseServiceYear(serviceYear)
  }

  async findByServiceYear(name: number): Promise<ServiceYearModel | null> {
    const serviceYear = (await serviceYearStore.findByName(name)) as ServiceYear
    if (!serviceYear) {
      return null
    }

    return parseServiceYear(serviceYear)
  }

  async delete(id: string): Promise<number> {
    return (await serviceYearStore.delete(id)) as number
  }

  async find(): Promise<ServiceYearModel[]> {
    const serviceYear = (await serviceYearStore.find()) as ServiceYear[]

    return serviceYear.map((t) => parseServiceYear(t))
  }

  async create(data: ServiceYearModel): Promise<ServiceYearModel> {
    const serviceYear = parseServiceYearModel(data)
    const newServiceYear = (await serviceYearStore.create(serviceYear)) as ServiceYear

    return parseServiceYear(newServiceYear)
  }

  async update(id: string, data: ServiceYearModel): Promise<number> {
    const serviceYear = parseServiceYearModel(data)
    return (await serviceYearStore.update(id, serviceYear)) as number
  }

  async findOneById(id: string): Promise<ServiceYearModel> {
    const serviceYear = (await serviceYearStore.findOneById(id)) as ServiceYear
    return parseServiceYear(serviceYear)
  }

  async drop(): Promise<void> {
    serviceYearStore.drop()
  }
}
