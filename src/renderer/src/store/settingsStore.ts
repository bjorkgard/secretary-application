import { hookstate, useHookstate } from '@hookstate/core'
import { CongregationModel, OnlineModel, SettingsModel, UserModel } from 'src/types/models'

const settingsState = hookstate<SettingsModel>({
  identifier: '',
  token: '',
  congregation: {
    name: '',
    number: '',
    country: '',
    locale: '',
    languageGroups: [{ name: '' }]
  },
  user: { firstname: '', lastname: '', email: '' },
  online: {
    send_report_group: false,
    send_report_publisher: false,
    public: false
  }
})

export function useSettingsState(): {
  setSettings(settings: SettingsModel): void
  congregation: CongregationModel
  user: UserModel
  online: OnlineModel
  complete: SettingsModel
} {
  const state = useHookstate(settingsState)

  // This function wraps the state by an interface,
  // i.e. the state link is not accessible directly outside of this module.
  // The state for tasks in TasksState.ts exposes the state directly.
  // Both options are valid and you need to use one or another,
  // depending on your circumstances. Apply your engineering judgement
  // to choose the best option. If unsure, exposing the state directly
  // like it is done in the TasksState.ts is a safe bet.
  return {
    setSettings(settings: SettingsModel): void {
      state.set(settings)
    },
    get congregation(): CongregationModel {
      return JSON.parse(JSON.stringify(state.congregation.get()))
    },
    get user(): UserModel {
      return state.user.get()
    },
    get online(): OnlineModel {
      return state.online.get()
    },
    get complete(): SettingsModel {
      return JSON.parse(JSON.stringify(state.get()))
    }
  }
}
