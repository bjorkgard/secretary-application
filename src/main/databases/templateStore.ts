import BaseStore from './baseStore'
import { Template } from './schemas'

export default class TemplateStore extends BaseStore<Template> {
  find(): Promise<Template[]> {
    return this.databaseInstance.find({}).sort({ code: 1 })
  }

  findByCode(code: string): Promise<Template | null> {
    return this.databaseInstance.findOne({ code: code })
  }

  async upsert(data: Template): Promise<number | undefined> {
    const isValid: boolean = this.validate(data)

    if (isValid) {
      return await this.databaseInstance.update({ code: data.code }, data, { upsert: true })
    } else {
      return undefined
    }
  }
}
