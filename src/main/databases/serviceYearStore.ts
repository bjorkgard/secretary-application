import BaseStore            from './baseStore'
import type { ServiceYear } from './schemas'

export default class ServiceYearStore extends BaseStore<ServiceYear> {
  find(): Promise<ServiceYear[]> {
    return this.databaseInstance.find({}).sort({ serviceYear: 1 })
  }

  findByName(name: number): Promise<ServiceYear | null> {
    return this.databaseInstance.findOne({ name })
  }

  delete(id: string): Promise<number> {
    // options set to {} since the default for multi is false
    return this.databaseInstance.remove({ _id: id }, {})
  }

  async findOrCreate(name: number): Promise<ServiceYear> {
    const serviceYear = await this.findByName(name)

    if (!serviceYear) {
      const newServiceYear: ServiceYear = {
        name,
        serviceMonths: [],
        history:       [],
      }

      return await this.databaseInstance.insert(newServiceYear)
    }
    else {
      return serviceYear
    }
  }
}
