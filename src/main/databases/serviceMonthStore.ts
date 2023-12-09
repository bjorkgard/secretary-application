import BaseStore from './baseStore'
import { ServiceMonth } from './schemas'

export default class ServiceMonthStore extends BaseStore<ServiceMonth> {
  find(): Promise<ServiceMonth[]> {
    return this.databaseInstance.find({}).sort({ serviceYear: 1, sortOrder: 1 })
  }

  findActive(): Promise<ServiceMonth | null> {
    return this.databaseInstance.findOne({ status: 'ACTIVE' })
  }

  findByServiceMonth(serviceMonth: string): Promise<ServiceMonth | null> {
    return this.databaseInstance.findOne({ serviceMonth: serviceMonth })
  }

  delete(id: string): Promise<number> {
    // options set to {} since the default for multi is false
    return this.databaseInstance.remove({ _id: id }, {})
  }

  async closeActive(): Promise<void> {
    await this.databaseInstance.update({ status: 'ACTIVE' }, { $set: { status: 'DONE' } })
  }
}
