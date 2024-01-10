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
  const publisher             = await publisherService.findOneById(event.publisherId)
  const splitDate             = event.date.split('-')
  let information             = ''
  let addEventToServiceYear   = true
  let addEventToPublisher     = true
  let removeFromActiveReports = false

  switch (event.command) {
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
