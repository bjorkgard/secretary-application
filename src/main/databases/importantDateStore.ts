import BaseStore              from './baseStore'
import type { ImportantDate } from './schemas'

export default class ImportantDateStore extends BaseStore<ImportantDate> {
  find(): Promise<ImportantDate[]> {
    return this.databaseInstance.find({}).sort({ name: 1 })
  }

  findOneByType(type: string): Promise<ImportantDate | null> {
    return this.databaseInstance.findOne({ type })
  }

  delete(id: string): Promise<number> {
    // options set to {} since the default for multi is false
    return this.databaseInstance.remove({ _id: id }, {})
  }

  remove(data: ImportantDate): Promise<number> {
    // options set to {} since the default for multi is false
    return this.databaseInstance.remove({ type: data.type }, {})
  }

  async upsert(data: ImportantDate): Promise<number | undefined> {
    const isValid: boolean = this.validate(data)

    if (isValid)
      return await this.databaseInstance.update({ type: data.type }, data, { upsert: true })

    else
      return undefined
  }
}
