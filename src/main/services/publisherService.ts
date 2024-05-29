import type { PublisherModel }                        from '../../types/models'
import type { Publisher, Report }                     from '../databases/schemas'
import { PublisherSchema }                            from '../databases/schemas'
import PublisherStore                                 from '../databases/publisherStore'
import type { PublisherService as IPublisherService } from '../../types/type'

const publisherStore = new PublisherStore('publishers.db', PublisherSchema, 'lastname', true)

function parsePublisherModel(data: PublisherModel): Publisher {
  const publisher: Publisher = {
    s290:             false,
    registerCard:     false,
    firstname:        '',
    lastname:         '',
    birthday:         '',
    gender:           'MAN',
    baptised:         '',
    unknown_baptised: false,
    phone:            '',
    mobile:           '',
    email:            '',
    hope:             'OTHER_SHEEP',
    contact:          false,
    address:          '',
    zip:              '',
    city:             '',
    responsibilities: [],
    tasks:            [],
    appointments:     [],
    emergencyContact: {},
    status:           'ACTIVE',
    deaf:             false,
    blind:            false,
    sendReports:      false,
    children:         [],
    histories:        [],
    reports:          [],
    old:              '',
  }

  publisher.s290                   = data.s290
  publisher.registerCard           = data.registerCard
  publisher.firstname              = data.firstname
  publisher.lastname               = data.lastname
  publisher.birthday               = data.birthday
  publisher.gender                 = data.gender
  publisher.baptised               = data.baptised
  publisher.unknown_baptised       = data.unknown_baptised
  publisher.hope                   = data.hope
  publisher.phone                  = data.phone
  publisher.mobile                 = data.mobile
  publisher.email                  = data.email
  publisher.contact                = data.contact
  publisher.familyId               = data.familyId
  publisher.address                = data.address
  publisher.zip                    = data.zip
  publisher.city                   = data.city
  publisher.serviceGroupId         = data.serviceGroupId
  publisher.responsibilities       = data.responsibilities ? data.responsibilities : []
  publisher.tasks                  = data.tasks ? data.tasks : []
  publisher.appointments           = data.appointments ? data.appointments : []
  publisher.emergencyContact.name  = data.emergencyContact?.name
  publisher.emergencyContact.email = data.emergencyContact?.email
  publisher.emergencyContact.phone = data.emergencyContact?.phone
  publisher.other                  = data.other
  publisher.status                 = data.status
  publisher.deaf                   = data.deaf
  publisher.blind                  = data.blind
  publisher.sendReports            = data.sendReports
  publisher.children               = data.children
  publisher.histories              = data.histories
  publisher.reports                = data.reports
  publisher.old                    = data.old

  return publisher
}

function parsePublisher(data: Publisher): PublisherModel {
  const publisherModel: PublisherModel = {
    s290:             false,
    registerCard:     false,
    firstname:        '',
    lastname:         '',
    birthday:         '',
    gender:           'MAN',
    baptised:         '',
    unknown_baptised: false,
    phone:            '',
    mobile:           '',
    email:            '',
    hope:             'OTHER_SHEEP',
    contact:          false,
    address:          '',
    zip:              '',
    city:             '',
    responsibilities: [],
    tasks:            [],
    appointments:     [],
    emergencyContact: {},
    status:           'ACTIVE',
    deaf:             false,
    blind:            false,
    sendReports:      false,
    children:         [],
    histories:        [],
    reports:          [],
    old:              '',
  }

  publisherModel._id                    = data._id
  publisherModel.s290                   = data.s290
  publisherModel.registerCard           = data.registerCard
  publisherModel.firstname              = data.firstname
  publisherModel.lastname               = data.lastname
  publisherModel.birthday               = data.birthday
  publisherModel.gender                 = data.gender
  publisherModel.baptised               = data.baptised
  publisherModel.unknown_baptised       = data.unknown_baptised
  publisherModel.hope                   = data.hope
  publisherModel.phone                  = data.phone
  publisherModel.mobile                 = data.mobile
  publisherModel.email                  = data.email
  publisherModel.contact                = data.contact
  publisherModel.familyId               = data.familyId
  publisherModel.address                = data.address
  publisherModel.zip                    = data.zip
  publisherModel.city                   = data.city
  publisherModel.serviceGroupId         = data.serviceGroupId
  publisherModel.responsibilities       = data.responsibilities ? data.responsibilities : []
  publisherModel.tasks                  = data.tasks ? data.tasks : []
  publisherModel.appointments           = data.appointments ? data.appointments : []
  publisherModel.emergencyContact.name  = data.emergencyContact?.name
  publisherModel.emergencyContact.email = data.emergencyContact?.email
  publisherModel.emergencyContact.phone = data.emergencyContact?.phone
  publisherModel.other                  = data.other
  publisherModel.status                 = data.status
  publisherModel.deaf                   = data.deaf
  publisherModel.blind                  = data.blind
  publisherModel.sendReports            = data.sendReports
  publisherModel.children               = data.children
  publisherModel.histories              = data.histories
  publisherModel.reports                = data.reports
  publisherModel.old                    = data.old
  publisherModel.createdAt              = data.createdAt?.toLocaleString('sv-SE')
  publisherModel.updatedAt              = data.updatedAt?.toLocaleString('sv-SE')

  return publisherModel
}

export default class PublisherService implements IPublisherService {
  async findByIdentifier(identifier: string): Promise<PublisherModel | null> {
    const publisher = (await publisherStore.findByIdentifier(identifier)) as Publisher
    return publisher ? parsePublisher(publisher) : null
  }

  async find(sortField: string, queryString?: string): Promise<PublisherModel[]> {
    const publishers = (await publisherStore.find(sortField, queryString)) as Publisher[]

    return publishers.map(publisher => parsePublisher(publisher))
  }

  async findContacts(): Promise<PublisherModel[]> {
    const publishers = (await publisherStore.findContacts()) as Publisher[]

    return publishers.map(publisher => parsePublisher(publisher))
  }

  async findFamily(familyId: string): Promise<PublisherModel[]> {
    const publishers = (await publisherStore.findFamily(familyId)) as Publisher[]

    return publishers.map(publisher => parsePublisher(publisher))
  }

  async findByIds(ids: string[]): Promise<PublisherModel[]> {
    const publishers = (await publisherStore.findByIds(ids)) as Publisher[]

    return publishers.map(publisher => parsePublisher(publisher))
  }

  async create(data: PublisherModel): Promise<PublisherModel> {
    const publisher = parsePublisherModel(data)

    const newPublisher = (await publisherStore.create(publisher)) as Publisher
    return parsePublisher(newPublisher)
  }

  async update(id: string, data: PublisherModel): Promise<number> {
    const publisher = parsePublisherModel(data)
    return (await publisherStore.update(id, publisher)) as number
  }

  async delete(id: string): Promise<number> {
    return (await publisherStore.deletePublisher(id)) as number
  }

  async findOneById(id: string): Promise<PublisherModel> {
    const publisher = (await publisherStore.findOneById(id)) as Publisher
    return parsePublisher(publisher)
  }

  async findByStatus(status: string[]): Promise<PublisherModel[]> {
    const publishers = (await publisherStore.findByStatus(status)) as Publisher[]
    return publishers.map(publisher => parsePublisher(publisher))
  }

  async resetServiceGroup(serviceGroupId: string): Promise<void> {
    await publisherStore.resetServiceGroup(serviceGroupId)
  }

  async updateAddressOnFamilyMembers(publisher: PublisherModel): Promise<void> {
    await publisherStore.updateAddressOnFamilyMembers(publisher)
  }

  async saveReport(publisherId: string, newReport: Report, status: 'ACTIVE' | 'INACTIVE' | 'IRREGULAR'): Promise<number | undefined> {
    await this.findOneById(publisherId).then(async (publisher) => {
      if (publisher && publisher._id) {
        const reportIndex = publisher.reports.findIndex(
          r => r.identifier === newReport.identifier,
        )

        if (reportIndex !== undefined || null) {
          publisher.reports[reportIndex] = { ...newReport }

          publisher.status = status

          return await this.update(publisher._id, publisher)
        }
      }
      return undefined
    })

    return undefined
  }

  async drop(): Promise<void> {
    publisherStore.drop()
  }
}
