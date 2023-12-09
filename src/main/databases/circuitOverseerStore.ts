import BaseStore from './baseStore'
import { CircuitOverseer } from './schemas'

export default class CircuitOverseerStore extends BaseStore<CircuitOverseer> {
  find(): Promise<CircuitOverseer[]> {
    return this.databaseInstance.find({})
  }

  async upsert(data: CircuitOverseer, id?: string): Promise<CircuitOverseer | number | undefined> {
    const isValid: boolean = this.validate(data)

    if (isValid) {
      if (id) {
        return await this.databaseInstance.update({ _id: id }, data)
      } else {
        return this.databaseInstance.insert(data)
      }
    } else {
      return undefined
    }
  }
}
