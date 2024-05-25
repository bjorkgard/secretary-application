import BaseStore             from './baseStore'
import type { ServiceGroup } from './schemas'

export default class ServiceGroupStore extends BaseStore<ServiceGroup> {
  find(): Promise<ServiceGroup[]> {
    return this.databaseInstance.find({}).sort({ name: 1 })
  }

  findOneByName(name: string): Promise<ServiceGroup | null> {
    return this.databaseInstance.findOne({ name })
  }

  delete(id: string): Promise<number> {
    // options set to {} since the default for multi is false
    return this.databaseInstance.remove({ _id: id }, {})
  }

  async upsert(data: ServiceGroup): Promise<number | undefined> {
    const isValid: boolean = this.validate(data)

    if (isValid)
      return await this.databaseInstance.update({ name: data.name }, data, { upsert: true })

    else
      return undefined
  }
}
