interface Base {
  _id?:       string
  createdAt?: string
  updatedAt?: string
}

export interface OrganizationResponsibilityModel {
  active:    boolean
  type:      string
  sortOrder: number
}

export interface OrganizationTaskModel {
  type:       string
  manager:    string
  assistant?: string
  sortOrder:  number
}

export interface OrganizationAppointmentModel {
  active:    boolean
  type:      string
  sortOrder: number
}

export interface OrganizationModel extends Base {
  identifier:       string
  responsibilities: OrganizationResponsibilityModel[]
  tasks:            OrganizationTaskModel[]
  appointments:     OrganizationAppointmentModel[]
}

export interface AuxiliaryModel extends Base {
  serviceMonth: string
  name:         string
  publisherIds: string[]
  publishers?:  PublisherModel[]
}

export interface LanguageGroupModel {
  name: string
}

export interface CongregationModel {
  name:           string
  number:         string
  country:        string
  locale:         string
  languageGroups: LanguageGroupModel[]
}

export interface PublicCongregationModel {
  identifier:          string
  congregation:        string
  congregation_number: string
}

export interface UserModel {
  email:     string
  firstname: string
  lastname:  string
}

export interface OnlineModel {
  public?:                boolean
  send_report_group?:     boolean
  send_report_publisher?: boolean
}

export interface SettingsModel extends Base {
  congregation: CongregationModel
  identifier:   string
  token:        string
  online:       OnlineModel
  user:         UserModel
  mergePdf:     boolean
  smsMessage:   string
}

export interface ServiceGroupModel extends Base {
  assistantId?:   string
  name:           string
  responsibleId?: string
  receivers:      'NONE' | 'BOTH' | 'ASSISTANT' | 'RESPONSIBLE'
}

export interface Appointment {
  date?: string
  type:  string
}

interface EmergencyContact {
  email?: string
  name?:  string
  phone?: string
}

export interface Child {
  birthday?:  string
  identifier: string
  name:       string
}

export interface History {
  date:         string
  type:         string
  information?: string
}

export interface ImportedReport {
  identifier:          string
  hasBeenInService:    boolean
  hasNotBeenInService: boolean
  auxiliary:           boolean
  hours?:              number
  remarks?:            string
  studies?:            number
}

export interface Meeting {
  name?:      string
  identifier: string
  midweek:    number[]
  weekend:    number[]
}

export interface Report {
  credit?:                  number
  hasBeenInService:         boolean
  hasNotBeenInService:      boolean
  hours?:                   number
  identifier:               string
  remarks?:                 string
  studies?:                 number
  type:                     'PUBLISHER' | 'PIONEER' | 'SPECIALPIONEER' | 'AUXILIARY' | 'MISSIONARY' | 'CIRCUITOVERSEER'
  serviceMonth:             string
  serviceYear:              number
  sortOrder:                number
  name:                     string
  publisherId?:             string
  publisherName?:           string
  publisherEmail?:          string
  publisherMobile?:         string
  publisherServiceGroupId?: string
  publisherStatus?:         'ACTIVE' | 'INACTIVE' | 'IRREGULAR'
  publisherSendEmail?:      boolean
  auxiliary:                boolean
  updated?:                 Date
  addToActive?:             boolean
}

export interface PublisherModel extends Base {
  address:          string
  appointments:     Appointment[]
  baptised?:        string
  birthday?:        string
  blind:            boolean
  children:         Child[]
  city:             string
  contact:          boolean
  deaf:             boolean
  email?:           string
  emergencyContact: EmergencyContact
  familyId?:        string
  firstname:        string
  gender:           'MAN' | 'WOMAN'
  histories:        History[]
  hope:             'OTHER_SHEEP' | 'ANOINTED'
  lastname:         string
  mobile?:          string
  other?:           string
  phone?:           string
  reports:          Report[]
  responsibilities: string[]
  s290:             boolean
  sendReports:      boolean
  serviceGroupId?:  string
  status:           'ACTIVE' | 'INACTIVE' | 'IRREGULAR'
  tasks:            string[]
  unknown_baptised: boolean
  zip:              string
  old?:             string
  resident:         string
}

export interface PublisherWithApplication {
  id:              string
  name:            string
  applicationType: string
  applicationDate: string
}

export interface ResponsibilityModel extends Base {
  default: boolean
  name:    string
}

export interface TaskModel extends Base {
  default:          boolean
  name:             string
  responsibilityId: string
}

export interface ImportantDateModel extends Base {
  type: string
}

export interface ExportModel extends Base {
  name:   string
  format: string
  method: string
  count:  number
}

export interface ServiceYearModel extends Base {
  name:          number
  serviceMonths: string[]
  history:       History[]
}

interface Stats {
  activePublishers:    number
  regularPublishers:   number
  irregularPublishers: number
  inactivePublishers:  number
  deaf:                number
  blind:               number
}

export interface ServiceMonthModel extends Base {
  status:       'ACTIVE' | 'DONE'
  name:         string
  serviceMonth: string
  serviceYear:  number
  sortOrder:    number
  reports:      Report[]
  meetings:     Meeting[]
  stats:        Stats
}

export interface CircuitOverseerModel extends Base {
  firstname: string
  lastname:  string
  email?:    string
  phone?:    string
  mobile?:   string
  address:   string
  zip:       string
  city:      string
}

export interface TemplateModel extends Base {
  code: string
  name: string
  date: string
  path: string
}

export interface MailResponse {
  id:              number
  publisher_email: string
  description:     string
  event:           string
  data:            string
  fix:             boolean
  created_at:      string
}

export interface InformationResponse {
  id:         number
  identifier: string
  version?:   string
  headline:   string
  data:       string
  created_at: string
}
