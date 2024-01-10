import { hookstate, useHookstate } from '@hookstate/core'
import type { PublisherModel }     from 'src/types/models'

const initialState: PublisherModel = {
  _id:              '',
  s290:             false,
  registerCard:     false,
  firstname:        '',
  lastname:         '',
  gender:           'MAN',
  unknown_baptised: false,
  hope:             'OTHER_SHEEP',
  contact:          false,
  address:          '',
  zip:              '',
  city:             '',
  responsibilities: [],
  tasks:            [],
  appointments:     [],
  emergencyContact: {},
  status:           'ACTIVE',
  blind:            false,
  children:         [],
  deaf:             false,
  histories:        [],
  reports:          [],
  sendReports:      false,
}

const publisherState = hookstate<PublisherModel>(initialState)

export function usePublisherState(): {
  setPublisher(publisher: PublisherModel): void
  delete(): void
  publisher: PublisherModel
} {
  const state = useHookstate(publisherState)

  // This function wraps the state by an interface,
  // i.e. the state link is not accessible directly outside of this module.
  // The state for tasks in TasksState.ts exposes the state directly.
  // Both options are valid and you need to use one or another,
  // depending on your circumstances. Apply your engineering judgement
  // to choose the best option. If unsure, exposing the state directly
  // like it is done in the TasksState.ts is a safe bet.
  return {
    setPublisher(publisher: PublisherModel): void {
      state.set(publisher)
    },
    delete(): void {
      state.set(initialState)
    },
    get publisher(): PublisherModel {
      return JSON.parse(JSON.stringify(state.get()))
    },
  }
}
