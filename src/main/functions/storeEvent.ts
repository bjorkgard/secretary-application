import { type BrowserWindow, dialog } from 'electron'
import log                            from 'electron-log'
import PublisherService               from '../services/publisherService'
import ServiceMonthService            from '../services/serviceMonthService'
import ServiceYearService             from '../services/serviceYearService'
import SettingsService                from '../services/settingsService'
import getServiceYear                 from '../utils/getServiceYear'
import i18n                           from '../../localization/i18next.config'
import exportPublisherS21             from './exportPublisherS21'

interface EventProps {
  command:         string
  date:            string
  publisherId:     string
  newCongregation: string | null
}

const publisherService    = new PublisherService()
const serviceMonthService = new ServiceMonthService()
const serviceYearService  = new ServiceYearService()
const settingsService     = new SettingsService()

async function storeEvent(mainWindow: BrowserWindow, event: EventProps): Promise<void> {
  let publisher               = await publisherService.findOneById(event.publisherId)
  const splitDate             = event.date.split('-')
  let information             = ''
  let addEventToServiceYear   = true
  let addEventToPublisher     = true
  let removeFromActiveReports = false

  switch (event.command) {
    case 'BAPTISED':
      information = `${publisher?.firstname} ${publisher?.lastname}`
      publisher   = { ...publisher, baptised: event.date }
      publisherService.update(event.publisherId, publisher)
      break
    case 'PUBLISHER':
      information = `${publisher?.firstname} ${publisher?.lastname}`
      break
    case 'AUXILIARY_START':
      if (!publisher.appointments.find(appointment => appointment.type === 'PIONEER' || appointment.type === 'AUXILIARY')) {
        information = `${publisher?.firstname} ${publisher?.lastname}`
        publisher   = { ...publisher, appointments: publisher.appointments.concat({ type: 'AUXILIARY', date: event.date }) }
        publisherService.update(event.publisherId, publisher)
      }
      else {
        addEventToServiceYear = false
        addEventToPublisher   = false
      }
      break
    case 'AUXILIARY_STOP':
      information = `${publisher?.firstname} ${publisher?.lastname}`
      publisher   = { ...publisher, appointments: publisher?.appointments.filter(appointment => appointment.type !== 'AUXILIARY') }
      publisherService.update(event.publisherId, publisher)
      break
    case 'PIONEER_START':
      if (!publisher.appointments.find(appointment => appointment.type === 'PIONEER')) {
        information = `${publisher?.firstname} ${publisher?.lastname}`
        // remove auxiliary appointments
        const appointments = publisher.appointments.filter(appointment => appointment.type !== 'AUXILIARY')
        publisher          = { ...publisher, appointments: appointments.concat({ type: 'PIONEER', date: event.date }) }
        publisherService.update(event.publisherId, publisher)
      }
      else {
        addEventToServiceYear = false
        addEventToPublisher   = false
      }
      break
    case 'PIONEER_STOP':
      information = `${publisher?.firstname} ${publisher?.lastname}`
      publisher   = { ...publisher, appointments: publisher?.appointments.filter(appointment => appointment.type !== 'PIONEER') }
      publisherService.update(event.publisherId, publisher)
      break
    case 'MOVED_IN':
      information = `${publisher?.firstname} ${publisher?.lastname}`
      break
    case 'MOVED_OUT': {
      information = `${publisher?.firstname} ${publisher?.lastname}`

      // Export S-21
      await exportPublisherS21(mainWindow, event.publisherId)

      // Transfer publisher to new congregation
      if (event.newCongregation && event.newCongregation !== '') {
        const cleanPublisher = { ...publisher, familyId: undefined, contact: true, registerCard: false, s290: false, serviceGroupId: undefined, responsibilities: [], tasks: [] }

        const options = {
          method:  'POST',
          headers: {
            'Accept':        'application/json',
            'Content-Type':  'application/json;charset=UTF-8',
            'Authorization': `Bearer ${await settingsService.token()}` || import.meta.env.MAIN_VITE_TOKEN,
          },
          body: JSON.stringify({
            identifier: event.newCongregation,
            type:       'PUBLISHER',
            data:       JSON.stringify(cleanPublisher),
          }),
        }

        await fetch(`${import.meta.env.MAIN_VITE_API}/communication`, options)
          .then(response => response.json())
          .then(() => {
            const responseOptions = {
              type:      'info' as const,
              buttons:   ['OK'],
              defaultId: 0,
              title:     i18n.t('transfer.success'),
              message:   i18n.t('transfer.success'),
              detail:    i18n.t('transfer.transferPublisherDone'),
            }

            if (mainWindow)
              dialog.showMessageBox(mainWindow, responseOptions)
          })
          .catch((error) => {
            log.error(error)
            const responseErrorOptions = {
              type:      'error' as const,
              buttons:   ['OK'],
              defaultId: 0,
              title:     i18n.t('transfer.error'),
              message:   i18n.t('transfer.error'),
              detail:    `${i18n.t('transfer.errorInformation')} : ${error.message}`,
            }

            if (mainWindow)
              dialog.showMessageBox(mainWindow, responseErrorOptions)

            return null
          })
      }

      publisherService.delete(event.publisherId)
      addEventToPublisher     = false
      removeFromActiveReports = true
      break
    }
    case 'DECEASED':
      information = `${publisher?.firstname} ${publisher?.lastname}`
      publisherService.delete(event.publisherId)
      addEventToPublisher     = false
      removeFromActiveReports = true
      break
    case 'REINSTATED':
      information = `${publisher?.firstname} ${publisher?.lastname}`
      break
    case 'DISASSOCIATION':
      information = `${publisher?.firstname} ${publisher?.lastname}`
      publisherService.delete(event.publisherId)
      addEventToPublisher     = false
      removeFromActiveReports = true
      break
    case 'DISFELLOWSHIPPED':
      information = `${publisher?.firstname} ${publisher?.lastname}`
      publisherService.delete(event.publisherId)
      addEventToPublisher     = false
      removeFromActiveReports = true
      break
    case 'DELETE':
      publisherService.delete(event.publisherId)
      addEventToServiceYear   = false
      addEventToPublisher     = false
      removeFromActiveReports = true
      break

    default:
      break
  }

  if (removeFromActiveReports)
    serviceMonthService.deleteReport(event.publisherId)

  if (addEventToPublisher) {
    publisher.histories.push({
      type: event.command,
      date: event.date,
      information,
    })
    publisherService.update(event.publisherId, publisher)
  }

  if (addEventToServiceYear) {
    serviceYearService.addHistory(getServiceYear(`${splitDate[0]}-${splitDate[1]}`), {
      type: event.command,
      date: event.date,
      information,
    })
  }
}

export default storeEvent
