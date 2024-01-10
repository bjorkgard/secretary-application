import type { SettingsModel }                       from '../../types/models'
import type { Settings }                            from '../databases/schemas'
import { SettingsSchema }                           from '../databases/schemas'
import SettingsStore                                from '../databases/settingsStore'
import type { SettingsService as ISettingsService } from '../../types/type'

const settingsStore = new SettingsStore('settings.db', SettingsSchema)

function parseSettingsModel(data: SettingsModel): Settings {
  const settings: Settings = {
    identifier:   '',
    token:        '',
    congregation: { name: '', number: '', country: '', locale: '', languageGroups: [] },
    user:         { firstname: '', lastname: '', email: '' },
    online:       { send_report_group: false, send_report_publisher: false, public: false },
  }

  settings.identifier                   = data.identifier
  settings.token                        = data.token
  settings.congregation.name            = data.congregation.name
  settings.congregation.number          = data.congregation.number
  settings.congregation.country         = data.congregation.country
  settings.congregation.locale          = data.congregation.locale
  settings.congregation.languageGroups  = data.congregation.languageGroups || []
  settings.user.firstname               = data.user.firstname
  settings.user.lastname                = data.user.lastname
  settings.user.email                   = data.user.email
  settings.online.send_report_group     = data.online.send_report_group
  settings.online.send_report_publisher = data.online.send_report_publisher
  settings.online.public                = data.online.public

  return settings
}

function parseSettings(data: Settings): SettingsModel {
  const settingsModel: SettingsModel = {
    identifier:   '',
    token:        '',
    congregation: { name: '', number: '', country: '', locale: '', languageGroups: [] },
    user:         { firstname: '', lastname: '', email: '' },
    online:       { send_report_group: false, send_report_publisher: false, public: false },
  }

  settingsModel._id                          = data._id
  settingsModel.identifier                   = data.identifier
  settingsModel.token                        = data.token
  settingsModel.congregation.name            = data.congregation.name
  settingsModel.congregation.number          = data.congregation.number
  settingsModel.congregation.country         = data.congregation.country
  settingsModel.congregation.locale          = data.congregation.locale
  settingsModel.congregation.languageGroups  = data.congregation.languageGroups
  settingsModel.user.firstname               = data.user.firstname
  settingsModel.user.lastname                = data.user.lastname
  settingsModel.user.email                   = data.user.email
  settingsModel.online.send_report_group     = data.online.send_report_group
  settingsModel.online.send_report_publisher = data.online.send_report_publisher
  settingsModel.online.public                = data.online.public
  settingsModel.createdAt                    = data.createdAt?.toLocaleString('sv-SE')
  settingsModel.updatedAt                    = data.updatedAt?.toLocaleString('sv-SE')

  return settingsModel
}

export default class SettingsService implements ISettingsService {
  async token(): Promise<string | undefined> {
    const settings = (await settingsStore.find()) as Settings[]
    if (settings.length > 0)
      return parseSettings(settings[0]).token

    return undefined
  }

  async find(): Promise<SettingsModel | undefined> {
    const settings = (await settingsStore.find()) as Settings[]
    if (settings.length > 0)
      return parseSettings(settings[0])

    return undefined
  }

  async create(data: SettingsModel): Promise<SettingsModel> {
    const settings    = parseSettingsModel(data)
    const newSettings = (await settingsStore.create(settings)) as Settings
    return parseSettings(newSettings)
  }

  async update(id: string, data: SettingsModel): Promise<number> {
    const settings = parseSettingsModel(data)
    return (await settingsStore.update(id, settings)) as number
  }

  async delete(id: string): Promise<number> {
    return (await settingsStore.deleteSettings(id)) as number
  }

  async findOneById(id: string): Promise<SettingsModel> {
    const settings = (await settingsStore.findOneById(id)) as Settings
    return parseSettings(settings)
  }

  async drop(): Promise<void> {
    settingsStore.drop()
  }
}
