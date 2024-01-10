import BaseStore               from './baseStore'
import type { Responsibility } from './schemas'

export default class ResponsibilityStore extends BaseStore<Responsibility> {
  find(): Promise<Responsibility[]> {
    return this.databaseInstance.find({}).sort({ name: 1 })
  }

  delete(id: string): Promise<number> {
    // options set to {} since the default for multi is false
    return this.databaseInstance.remove({ _id: id }, {})
  }

  remove(data: Responsibility): Promise<number> {
    // options set to {} since the default for multi is false
    return this.databaseInstance.remove({ name: data.name }, {})
  }

  async upsert(data: Responsibility): Promise<number | undefined> {
    const isValid: boolean = this.validate(data)

    if (isValid)
      return await this.databaseInstance.update({ name: data.name }, data, { upsert: true })

    else
      return undefined
  }
}
