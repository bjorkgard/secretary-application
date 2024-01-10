import BaseStore             from './baseStore'
import type { ServiceGroup } from './schemas'

export default class ServiceGroupStore extends BaseStore<ServiceGroup> {
  find(): Promise<ServiceGroup[]> {
    return this.databaseInstance.find({}).sort({ name: 1 })
  }

  delete(id: string): Promise<number> {
    // options set to {} since the default for multi is false
    return this.databaseInstance.remove({ _id: id }, {})
  }
}
