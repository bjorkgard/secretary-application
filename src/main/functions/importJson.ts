/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserWindow, app, dialog } from 'electron'
import fs from 'fs-extra'
import { parsePhoneNumber } from 'react-phone-number-input'
import ServiceGroupService from '../services/serviceGroupService'
import PublisherService from '../services/publisherService'
import ServiceMonthService from '../services/serviceMonthService'
import ServiceYearService from '../services/serviceYearService'
import AuxiliaryService from '../services/auxiliaryService'
import {
  Appointment,
  Child,
  History,
  PublisherModel,
  Report,
  ServiceMonthModel
} from '../../types/models'
import generateIdentifier from '../utils/generateIdentifier'
import getServiceYear from '../utils/getServiceYear'

const getStatus = (oldStatus: string): 'ACTIVE' | 'IRREGULAR' | 'INACTIVE' => {
  let status: 'ACTIVE' | 'IRREGULAR' | 'INACTIVE' = 'INACTIVE'

  switch (oldStatus) {
    case 'active':
      status = 'ACTIVE'
      break
    case 'irregular':
      status = 'IRREGULAR'
      break
    case 'inactive':
      status = 'INACTIVE'
      break
    default:
      status = 'INACTIVE'
  }
  return status
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAppointments = (oldAppointments: any[]): Appointment[] => {
  const appointments: Appointment[] = []
  if (oldAppointments) {
    oldAppointments.map((appointment) => {
      let type = ''
      switch (appointment.type) {
        case 'elder':
          type = 'ELDER'
          break
        case 'ministerial_servant':
          type = 'MINISTERIALSERVANT'
          break
        case 'pioneer':
          type = 'PIONEER'
          break
        case 'special_pioneer':
          type = 'SPECIALPIONEER'
          break
        case 'aux_pioneer':
          type = 'AUXILIARY'
          break
      }

      appointments.push({
        date: appointment.date,
        type: type
      })
    })
  }

  return appointments
}

const parsePublisher = (publisher: any, serviceGroupId = '', familyId = ''): PublisherModel => {
  const histories: History[] = []
  const children: Child[] = []
  const reports: Report[] = []
  if (publisher.children) {
    publisher.children.map((child: any) => {
      children.push({
        name: child.firstname,
        identifier: generateIdentifier(),
        birthday: child.birthday
      })
    })
  }

  if (publisher.actions) {
    publisher.actions.map((action: any) => {
      histories.push({
        date: action.date,
        type: action.type.toUpperCase(),
        information: action.information
      })
    })
  }

  if (publisher.reports) {
    publisher.reports.map((report: any) => {
      let monthName = ''
      switch (report.service_month) {
        case 'Januari':
          monthName = 'january'
          break
        case 'Februari':
          monthName = 'february'
          break
        case 'Mars':
          monthName = 'march'
          break
        case 'April':
          monthName = 'april'
          break
        case 'Maj':
          monthName = 'may'
          break
        case 'Juni':
          monthName = 'june'
          break
        case 'Juli':
          monthName = 'july'
          break
        case 'Augusti':
          monthName = 'august'
          break
        case 'September':
          monthName = 'september'
          break
        case 'Oktober':
          monthName = 'october'
          break
        case 'November':
          monthName = 'november'
          break
        case 'December':
          monthName = 'december'
          break
      }

      let type = 'PUBLISHER'
      switch (report.type) {
        case 'pioneer':
          type = 'PIONEER'
          break
        case 'special_pioneer':
          type = 'SPECIALPIONEER'
          break
        case 'aux':
          type = 'AUXILIARY'
          break
        case 'missionary':
          type = 'MISSIONARY'
          break
      }

      reports.push({
        credit: report.credit,
        hasBeenInService: report.hours > 0 ? true : false,
        hasNotBeenInService: report.hours === 0 ? true : false,
        hours: report.type !== 'publisher' ? report.hours : undefined,
        identifier: generateIdentifier(),
        remarks: report.remarks,
        serviceMonth: report.name,
        serviceYear: parseInt(report.service_year),
        sortOrder: report.sort_order,
        studies: report.studies,
        type: type as 'PUBLISHER' | 'PIONEER' | 'SPECIALPIONEER' | 'AUXILIARY' | 'MISSIONARY',
        name: monthName,
        auxiliary: report.type === 'aux' ? true : false
      })
    })
  }

  const parsedPublisher: PublisherModel = {
    s290: publisher.gdpr,
    registerCard: publisher.personalDataCard === 1 ? true : false,
    lastname: publisher.lastname,
    firstname: publisher.firstname,
    birthday: publisher.birthday,
    gender: publisher.gender === 'man' ? ('MAN' as const) : ('WOMAN' as const),
    baptised: publisher.baptised,
    unknown_baptised: publisher.unknown_baptised,
    hope: publisher.hope === 'other_sheep' ? 'OTHER_SHEEP' : 'ANOINTED',
    email: publisher.email,
    phone: parsePhoneNumber(publisher.phone, 'SE')?.formatInternational(),
    mobile: parsePhoneNumber(publisher.cell, 'SE')?.formatInternational(),
    contact: publisher.contact,
    familyId: familyId,
    address: publisher.address || '',
    zip: publisher.zip || '',
    city: publisher.city || '',
    serviceGroupId: serviceGroupId,
    responsibilities: [],
    tasks: [],
    appointments: getAppointments(publisher.appointments),
    emergencyContact: {
      name: publisher.contact_person?.name ? publisher.contact_person.name : '',
      email: publisher.contact_person?.email ? publisher.contact_person.email : '',
      phone: publisher.contact_person?.phone ? publisher.contact_person.phone : ''
    },
    other: publisher.information,
    status: getStatus(publisher.status),
    deaf: publisher.deaf,
    blind: publisher.blind,
    sendReports: publisher.send_reports,
    children: children,
    histories: histories,
    reports: reports
  }
  return parsedPublisher
}

export default function ImportJson(
  mainWindow: BrowserWindow,
  serviceGroupService: ServiceGroupService,
  publisherService: PublisherService,
  serviceMonthService: ServiceMonthService,
  serviceYearService: ServiceYearService,
  auxiliaryService: AuxiliaryService
): void {
  const options: Electron.OpenDialogOptions = {
    title: 'Importera från secretary.jwapp.info',
    buttonLabel: 'Importera',
    filters: [{ name: 'json', extensions: ['json'] }],
    properties: ['openFile']
  }

  dialog.showOpenDialog(mainWindow, options).then((result) => {
    if (!result.canceled) {
      fs.readFile(result.filePaths[0], async (_err, data) => {
        const importData = JSON.parse(data.toString())

        const responseOptions = {
          type: 'info' as const,
          buttons: ['OK'],
          defaultId: 0,
          title: 'All data är importerad',
          message: 'All data är importerad! Du kommer att behöva starta applikationen igen.',
          detail: ''
        }

        try {
          serviceGroupService.drop()
          publisherService.drop()
          serviceMonthService.drop()
          serviceYearService.drop()
          auxiliaryService.drop()

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          importData.groups.map(async (group: { name: string; publishers: any[] }) => {
            if (group.name !== 'Ingen grupp') {
              await serviceGroupService.create({ name: group.name }).then(async (sg) => {
                for await (const oldPublisher of group.publishers) {
                  if (oldPublisher.contact) {
                    await publisherService
                      .create(parsePublisher(oldPublisher, sg._id))
                      .then(async (newPublisher) => {
                        const familyMembers = group.publishers.filter(
                          (pub) => pub.family_id === oldPublisher.id
                        )

                        for await (const familyMember of familyMembers) {
                          await publisherService.create(
                            parsePublisher(familyMember, sg._id, newPublisher._id)
                          )
                        }
                      })
                  }
                }
              })
            }
          })

          // IMPORT ServiceYears and ServbiceMonths
          importData.service_years.map(
            async (serviceYear: { name: string; service_months: any[] }) => {
              await serviceYearService
                .create({ name: parseInt(serviceYear.name), serviceMonths: [], history: [] })
                .then(async (sy) => {
                  for await (const serviceMonth of serviceYear.service_months) {
                    if (serviceMonth.status === 'done') {
                      const name = serviceMonth.name.split('-')
                      const date = new Date(parseInt(name[0]), parseInt(name[1]) - 1, 1)
                      const serviceMonthName = `${name[0]}-${name[1] < 10 ? '0' : ''}${name[1]}`

                      const midweekMeetings: number[] = new Array(serviceMonth.mid_no_meeting).fill(
                        Math.round(serviceMonth.mid_sum / serviceMonth.mid_no_meeting)
                      )
                      const weekendMeetings: number[] = new Array(
                        serviceMonth.week_no_meeting
                      ).fill(Math.round(serviceMonth.week_sum / serviceMonth.week_no_meeting))

                      const reports: Report[] = []

                      for (let index = 0; index < serviceMonth.pub_quantity; index++) {
                        reports.push({
                          hasBeenInService: true,
                          hasNotBeenInService: false,
                          identifier: generateIdentifier(),
                          type: 'PUBLISHER',
                          serviceMonth: serviceMonthName,
                          serviceYear: sy.name,
                          sortOrder: serviceMonth.sort_order,
                          name: date.toLocaleString('default', { month: 'long' }).toLowerCase(),
                          auxiliary: false,
                          studies: serviceMonth.pub_studies / serviceMonth.pub_quantity
                        })
                      }
                      for (let index = 0; index < serviceMonth.p_quantity; index++) {
                        reports.push({
                          hasBeenInService: true,
                          hasNotBeenInService: false,
                          identifier: generateIdentifier(),
                          type: 'PIONEER',
                          serviceMonth: serviceMonth.name,
                          serviceYear: sy.name,
                          sortOrder: serviceMonth.sort_order,
                          name: date.toLocaleString('default', { month: 'long' }).toLowerCase(),
                          auxiliary: false,
                          studies: serviceMonth.p_studies / serviceMonth.p_quantity,
                          hours: serviceMonth.p_hours / serviceMonth.p_quantity
                        })
                      }
                      for (let index = 0; index < serviceMonth.aux_quantity; index++) {
                        reports.push({
                          hasBeenInService: true,
                          hasNotBeenInService: false,
                          identifier: generateIdentifier(),
                          type: 'AUXILIARY',
                          serviceMonth: serviceMonth.name,
                          serviceYear: sy.name,
                          sortOrder: serviceMonth.sort_order,
                          name: date.toLocaleString('default', { month: 'long' }).toLowerCase(),
                          auxiliary: true,
                          studies: serviceMonth.aux_studies / serviceMonth.aux_quantity,
                          hours: serviceMonth.aux_hours / serviceMonth.aux_quantity
                        })
                      }
                      for (let index = 0; index < serviceMonth.sp_quantity; index++) {
                        reports.push({
                          hasBeenInService: true,
                          hasNotBeenInService: false,
                          identifier: generateIdentifier(),
                          type: 'SPECIALPIONEER',
                          serviceMonth: serviceMonth.name,
                          serviceYear: sy.name,
                          sortOrder: serviceMonth.sort_order,
                          name: date.toLocaleString('default', { month: 'long' }).toLowerCase(),
                          auxiliary: false,
                          studies: serviceMonth.sp_studies / serviceMonth.sp_quantity,
                          hours: serviceMonth.sp_hours / serviceMonth.sp_quantity
                        })
                      }
                      for (let index = 0; index < serviceMonth.co_quantity; index++) {
                        reports.push({
                          hasBeenInService: true,
                          hasNotBeenInService: false,
                          identifier: generateIdentifier(),
                          type: 'CIRCUITOVERSEER',
                          serviceMonth: serviceMonth.name,
                          serviceYear: sy.name,
                          sortOrder: serviceMonth.sort_order,
                          name: date.toLocaleString('default', { month: 'long' }).toLowerCase(),
                          auxiliary: false,
                          studies: serviceMonth.co_studies / serviceMonth.co_quantity,
                          hours: serviceMonth.co_hours / serviceMonth.co_quantity
                        })
                      }

                      const rawMonth: ServiceMonthModel = {
                        status: 'DONE',
                        serviceYear: getServiceYear(serviceMonth.name),
                        name: date.toLocaleString('default', { month: 'long' }).toLowerCase(),
                        serviceMonth: serviceMonth.name,
                        sortOrder: serviceMonth.sort_order,
                        reports: reports,
                        meetings: [
                          {
                            identifier: generateIdentifier(),
                            midweek: midweekMeetings,
                            weekend: weekendMeetings
                          }
                        ],
                        stats: {
                          activePublishers: serviceMonth.active_publisher,
                          regularPublishers: serviceMonth.regular_publisher,
                          irregularPublishers:
                            serviceMonth.active_publisher - serviceMonth.regular_publisher,
                          inactivePublishers: 0,
                          deaf: serviceMonth.deaf,
                          blind: serviceMonth.blind
                        }
                      }

                      console.log(rawMonth)

                      const newMonth = await serviceMonthService.create(rawMonth)

                      if (newMonth._id) {
                        sy.serviceMonths.push(newMonth._id)
                      }
                    }
                  }
                  if (sy._id) {
                    serviceYearService.update(sy._id, sy)
                  }
                })
            }
          )

          if (mainWindow) {
            dialog.showMessageBox(mainWindow, responseOptions).then(() => {
              app.relaunch()
              app.exit()
            })
          }
        } catch (err) {
          console.error(err)
          const responseErrorOptions = {
            type: 'error' as const,
            buttons: ['OK'],
            defaultId: 0,
            title: 'Okänt fel',
            message: 'Okänt fel',
            detail: 'Det gick inte att importera data från gamla secretary'
          }

          if (mainWindow) {
            dialog.showMessageBox(mainWindow, responseErrorOptions)
          }
        }
      })
    }
  })
}
