import BaseStore       from './baseStore'
import type { Export } from './schemas'

export default class ExportStore extends BaseStore<Export> {
  find(): Promise<Export[]> {
    return this.databaseInstance.find({}).sort({ count: -1 }).limit(5)
  }

  async upsert(name: string, format: string, method: string): Promise<number | undefined> {
    return await this.databaseInstance.update(
      { name, format, method },
      { $inc: { count: 1 } },
      { upsert: true },
    )
  }
}
