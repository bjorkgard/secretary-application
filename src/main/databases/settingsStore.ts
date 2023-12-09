import BaseStore from './baseStore'
import { Settings } from './schemas'

export default class SettingsStore extends BaseStore<Settings> {
  find(): Promise<Settings[]> {
    return this.databaseInstance.find({})
  }

  deleteSettings(_id: string): Promise<number> {
    // options set to {} since the default for multi is false
    return this.databaseInstance.remove({ _id }, {})
  }
}
