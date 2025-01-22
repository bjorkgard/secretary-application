import type { OrganizationModel }                           from '../../types/models'
import type { Organization }                                from '../databases/schemas'
import { OrganizationSchema }                               from '../databases/schemas'
import type { OrganizationService as IOrganizationService } from '../../types/type'
import OrganizationStore                                    from '../databases/organizationStore'

const organizationStore = new OrganizationStore('organization.db', OrganizationSchema)

function parseOrganizationModel(data: OrganizationModel): Organization {
  const organization: Organization = {
    identifier:       '',
    responsibilities: [],
    tasks:            [],
    appointments:     [],
  }

  organization.identifier       = data.identifier
  organization.responsibilities = data.responsibilities
  organization.tasks            = data.tasks
  organization.appointments     = data.appointments

  return organization
}

function parseOrganization(data: Organization): OrganizationModel {
  const organizationModel: OrganizationModel = {
    identifier:       '',
    responsibilities: [],
    tasks:            [],
    appointments:     [],
  }

  organizationModel._id              = data._id
  organizationModel.identifier       = data.identifier
  organizationModel.responsibilities = data.responsibilities
  organizationModel.tasks            = data.tasks
  organizationModel.appointments     = data.appointments
  organizationModel.createdAt        = data.createdAt?.toLocaleString('sv-SE')
  organizationModel.updatedAt        = data.updatedAt?.toLocaleString('sv-SE')

  return organizationModel
}

export default class OrganizationService implements IOrganizationService {
  async find(): Promise<OrganizationModel | undefined> {
    const organization = (await organizationStore.find()) as Organization[]
    if (organization.length > 0)
      return parseOrganization(organization[0])

    return undefined
  }

  async drop(): Promise<void> {
    organizationStore.drop()
  }

  async create(data: OrganizationModel): Promise<OrganizationModel> {
    const organization    = parseOrganizationModel(data)
    const newOrganization = (await organizationStore.create(organization)) as Organization

    return parseOrganization(newOrganization)
  }

  async upsert(data: OrganizationModel): Promise<number> {
    const organization = parseOrganizationModel(data)
    return (await organizationStore.upsert(organization)) as number
  }

  async update(id: string, data: OrganizationModel): Promise<number> {
    const organization = parseOrganizationModel(data)
    return (await organizationStore.update(id, organization)) as number
  }

  async delete(id: string): Promise<number> {
    return (await organizationStore.delete(id)) as number
  }

  async findOneById(id: string): Promise<OrganizationModel> {
    const organization = (await organizationStore.findOneById(id)) as Organization
    return parseOrganization(organization)
  }
}
