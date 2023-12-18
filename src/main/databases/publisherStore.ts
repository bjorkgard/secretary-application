import { PublisherModel } from '../../types/models'
import BaseStore from './baseStore'
import { Publisher } from './schemas'

export default class PublisherStore extends BaseStore<Publisher> {
  find(sortField: string, queryString = ''): Promise<Publisher[]> {
    let query = {}
    let sort = {}

    switch (sortField) {
      case 'LASTNAME':
        sort = { lastname: 1, firstname: 1 }
        break
      case 'LASTNAME_REV':
        sort = { lastname: -1, firstname: -1 }
        break
      case 'FIRSTNAME':
        sort = { firstname: 1, lastname: 1 }
        break
      case 'FIRSTNAME_REV':
        sort = { firstname: -1, lastname: -1 }
        break
      case 'EMAIL':
        sort = { email: 1 }
        break
      case 'EMAIL_REV':
        sort = { email: -1 }
        break
      default:
        sort = { lastname: 1, firstname: 1 }
    }

    if (queryString && queryString !== '') {
      //TODO: Fix search on more fields
      query = {
        $or: [
          { firstname: new RegExp(queryString, 'i') },
          { lastname: new RegExp(queryString, 'i') },
          { email: new RegExp(queryString, 'i') }
        ]
      }
    }

    return this.databaseInstance.find(query).sort(sort)
  }

  findContacts(): Promise<Publisher[]> {
    return this.databaseInstance.find({ contact: true }).sort({ lastname: 1, firstname: 1 })
  }

  findByIds(ids: string[]): Promise<Publisher[]> {
    return this.databaseInstance.find({ _id: { $in: ids } }).sort({ lastname: 1, firstname: 1 })
  }

  findByStatus(status: string[]): Promise<Publisher[]> {
    return this.databaseInstance
      .find({ status: { $in: status } })
      .sort({ lastname: 1, firstname: 1 })
  }

  deletePublisher(_id: string): Promise<number> {
    // options set to {} since the default for multi is false
    return this.databaseInstance.remove({ _id }, {})
  }

  resetServiceGroup(serviceGroupId: string): Promise<number> {
    return this.databaseInstance.updateMany(
      { serviceGroupId: serviceGroupId },
      { $set: { serviceGroupId: '' } }
    )
  }

  updateAddressOnFamilyMembers(publisher: PublisherModel): Promise<number> {
    return this.databaseInstance.updateMany(
      { familyId: publisher._id },
      { $set: { address: publisher.address, zip: publisher.zip, city: publisher.city } }
    )
  }
}
