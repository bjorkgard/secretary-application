import { ServiceMonth, ServiceMonthSchema } from '../databases/schemas'
import { Meeting, Report, ServiceMonthModel } from '../../types/models'
import { ServiceMonthService as IServiceMonthService } from '../../types/type'
import ServiceMonthStore from '../databases/serviceMonthStore'
import toNumber from '../utils/toNumber'

const serviceMonthStore = new ServiceMonthStore(
  'serviceMonths.db',
  ServiceMonthSchema,
  'serviceMonth',
  true
)

const parseServiceMonthModel = (data: ServiceMonthModel): ServiceMonth => {
  const serviceMonth: ServiceMonth = {
    status: 'DONE',
    name: '',
    serviceMonth: '',
    serviceYear: 0,
    sortOrder: 0,
    reports: [],
    meetings: [],
    stats: {
      activePublishers: 0,
      regularPublishers: 0,
      irregularPublishers: 0,
      inactivePublishers: 0,
      deaf: 0,
      blind: 0
    }
  }

  serviceMonth.status = data.status
  serviceMonth.name = data.name
  serviceMonth.serviceMonth = data.serviceMonth
  serviceMonth.serviceYear = data.serviceYear
  serviceMonth.sortOrder = data.sortOrder
  serviceMonth.reports = data.reports
  serviceMonth.meetings = data.meetings
  serviceMonth.stats = data.stats

  return serviceMonth
}

const parseServiceMonth = (data: ServiceMonth): ServiceMonthModel => {
  const serviceMonthModel: ServiceMonthModel = {
    status: 'DONE',
    name: '',
    serviceMonth: '',
    serviceYear: 0,
    sortOrder: 0,
    reports: [],
    meetings: [],
    stats: {
      activePublishers: 0,
      regularPublishers: 0,
      irregularPublishers: 0,
      inactivePublishers: 0,
      deaf: 0,
      blind: 0
    }
  }

  serviceMonthModel._id = data._id
  serviceMonthModel.status = data.status
  serviceMonthModel.name = data.name
  serviceMonthModel.serviceMonth = data.serviceMonth
  serviceMonthModel.serviceYear = data.serviceYear
  serviceMonthModel.sortOrder = data.sortOrder
  serviceMonthModel.reports = data.reports
  serviceMonthModel.meetings = data.meetings
  serviceMonthModel.stats = data.stats
  serviceMonthModel.createdAt = data.createdAt?.toLocaleString('sv-SE')
  serviceMonthModel.updatedAt = data.updatedAt?.toLocaleString('sv-SE')

  return serviceMonthModel
}

export default class ServiceMonthService implements IServiceMonthService {
  async saveReport(newReport: Report): Promise<number | undefined> {
    await this.findByServiceMonth(newReport.serviceMonth).then(async (serviceMonth) => {
      if (serviceMonth && serviceMonth._id) {
        const reportIndex = serviceMonth.reports.findIndex(
          (r) => r.identifier === newReport.identifier
        )

        if (reportIndex !== undefined || null) {
          serviceMonth.reports[reportIndex] = { ...newReport }
          return this.update(serviceMonth._id, serviceMonth)
        }
      }

      return undefined
    })

    return undefined
  }

  async saveMeetings(props: {
    meetings: Meeting
    serviceMonthId: string
    name?: string
  }): Promise<number | undefined> {
    await this.findOneById(props.serviceMonthId).then(async (serviceMonth) => {
      if (serviceMonth) {
        const filteredMeetings = props.meetings
        filteredMeetings.midweek = filteredMeetings.midweek.filter(Number).map(toNumber)
        filteredMeetings.weekend = filteredMeetings.weekend.filter(Number).map(toNumber)

        const meetingIndex = serviceMonth.meetings.findIndex(
          (m) => m.identifier === props.meetings.identifier
        )

        if (meetingIndex >= 0) {
          serviceMonth.meetings[meetingIndex] = { ...props.meetings }
          return this.update(props.serviceMonthId, serviceMonth)
        }
      }

      return undefined
    })

    return undefined
  }

  async closeActive(): Promise<void> {
    await serviceMonthStore.closeActive()
  }

  async findActive(): Promise<ServiceMonthModel | null> {
    const serviceMonth = (await serviceMonthStore.findActive()) as ServiceMonth
    if (!serviceMonth) {
      return null
    }

    return parseServiceMonth(serviceMonth)
  }

  async findByServiceMonth(serviceMonth: string): Promise<ServiceMonthModel | null> {
    const month = (await serviceMonthStore.findByServiceMonth(serviceMonth)) as ServiceMonth
    if (!month) {
      return null
    }

    return parseServiceMonth(month)
  }

  async delete(id: string): Promise<number> {
    return (await serviceMonthStore.delete(id)) as number
  }

  async find(): Promise<ServiceMonthModel[]> {
    const serviceMonth = (await serviceMonthStore.find()) as ServiceMonth[]

    return serviceMonth.map((t) => parseServiceMonth(t))
  }

  async create(data: ServiceMonthModel): Promise<ServiceMonthModel> {
    const serviceMonth = parseServiceMonthModel(data)
    const newServiceMonth = (await serviceMonthStore.create(serviceMonth)) as ServiceMonth

    return parseServiceMonth(newServiceMonth)
  }

  async update(id: string, data: ServiceMonthModel): Promise<number> {
    const serviceMonth = parseServiceMonthModel(data)
    return (await serviceMonthStore.update(id, serviceMonth)) as number
  }

  async findOneById(id: string): Promise<ServiceMonthModel> {
    const serviceMonth = (await serviceMonthStore.findOneById(id)) as ServiceMonth
    return parseServiceMonth(serviceMonth)
  }

  async drop(): Promise<void> {
    serviceMonthStore.drop()
  }
}
