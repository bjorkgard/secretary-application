import type { ServiceGroupModel }                           from '../../types/models'
import type { ServiceGroup }                                from '../databases/schemas'
import { ServiceGroupSchema }                               from '../databases/schemas'
import ServiceGroupStore                                    from '../databases/serviceGroupStore'
import type { ServiceGroupService as IServiceGroupService } from '../../types/type'

const serviceGroupStore = new ServiceGroupStore('serviceGroups.db', ServiceGroupSchema)

function parseServiceGroupModel(data: ServiceGroupModel): ServiceGroup {
  const serviceGroup: ServiceGroup = {
    name: '',
  }

  serviceGroup.name          = data.name
  serviceGroup.responsibleId = data.responsibleId
  serviceGroup.assistantId   = data.assistantId

  return serviceGroup
}

function parseServiceGroup(data: ServiceGroup): ServiceGroupModel {
  const serviceGroupModel: ServiceGroupModel = {
    name: '',
  }

  serviceGroupModel._id           = data._id
  serviceGroupModel.name          = data.name
  serviceGroupModel.responsibleId = data.responsibleId
  serviceGroupModel.assistantId   = data.assistantId
  serviceGroupModel.createdAt     = data.createdAt?.toLocaleString('sv-SE')
  serviceGroupModel.updatedAt     = data.updatedAt?.toLocaleString('sv-SE')

  return serviceGroupModel
}

export default class ServiceGroupService implements IServiceGroupService {
  async find(): Promise<ServiceGroupModel[]> {
    const serviceGroups = (await serviceGroupStore.find()) as ServiceGroup[]

    return serviceGroups.map(sg => parseServiceGroup(sg))
  }

  async create(data: ServiceGroupModel): Promise<ServiceGroupModel> {
    const serviceGroup    = parseServiceGroupModel(data)
    const newServiceGroup = (await serviceGroupStore.create(serviceGroup)) as ServiceGroup
    return parseServiceGroup(newServiceGroup)
  }

  async update(id: string, data: ServiceGroupModel): Promise<number> {
    const serviceGroup = parseServiceGroupModel(data)
    return (await serviceGroupStore.update(id, serviceGroup)) as number
  }

  async delete(id: string): Promise<number> {
    return (await serviceGroupStore.delete(id)) as number
  }

  async findOneById(id: string): Promise<ServiceGroupModel> {
    const serviceGroup = (await serviceGroupStore.findOneById(id)) as ServiceGroup
    return parseServiceGroup(serviceGroup)
  }

  async drop(): Promise<void> {
    serviceGroupStore.drop()
  }
}
