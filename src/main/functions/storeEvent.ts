// import log from 'electron-log'
import PublisherService    from '../services/publisherService'
import ServiceMonthService from '../services/serviceMonthService'
import ServiceYearService  from '../services/serviceYearService'
import getServiceYear      from '../utils/getServiceYear'

interface EventProps {
  command:     string
  date:        string
  publisherId: string
}

const publisherService    = new PublisherService()
const serviceMonthService = new ServiceMonthService()
const serviceYearService  = new ServiceYearService()

async function storeEvent(event: EventProps): Promise<void> {
  let publisher               = await publisherService.findOneById(event.publisherId)
  const splitDate             = event.date.split('-')
  let information             = ''
  let addEventToServiceYear   = true
  let addEventToPublisher     = true
  let removeFromActiveReports = false

  switch (event.command) {
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
    case 'MOVED_OUT':
      information = `${publisher?.firstname} ${publisher?.lastname}`
      publisherService.delete(event.publisherId)
      addEventToPublisher     = false
      removeFromActiveReports = true
      break
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
