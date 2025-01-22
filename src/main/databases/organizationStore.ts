import BaseStore             from './baseStore'
import type { Organization } from './schemas'

export default class OrganizationStore extends BaseStore<Organization> {
  find(): Promise<Organization[]> {
    return this.databaseInstance.find({})
  }

  delete(id: string): Promise<number> {
    // options set to {} since the default for multi is false
    return this.databaseInstance.remove({ _id: id }, {})
  }

  async upsert(data: Organization): Promise<number | undefined> {
    const isValid: boolean = this.validate(data)

    if (isValid)
      return await this.databaseInstance.update({ identifier: data.identifier }, data, { upsert: true })

    else
      return undefined
  }
}
