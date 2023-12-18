import BaseStore from './baseStore'
import { Auxiliary } from './schemas'

export default class AuxiliaryStore extends BaseStore<Auxiliary> {
  find(): Promise<Auxiliary[]> {
    return this.databaseInstance.find({}).sort({ serviceMonth: 1 })
  }

  findByServiceMonth(serviceMonth: string): Promise<Auxiliary | null> {
    return this.databaseInstance.findOne({ serviceMonth: serviceMonth })
  }

  delete(id: string): Promise<number> {
    // options set to {} since the default for multi is false
    return this.databaseInstance.remove({ _id: id }, {})
  }

  deleteServiceMonth(serviceMonth: string): Promise<number> {
    // options set to {} since the default for multi is false
    return this.databaseInstance.remove({ serviceMonth: serviceMonth }, {})
  }
}
