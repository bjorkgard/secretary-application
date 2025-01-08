import type { JSONSchemaType } from 'ajv'

interface Base {
  _id?:       string
  createdAt?: Date
  updatedAt?: Date
}

export interface Auxiliary extends Base {
  serviceMonth: string
  name:         string
  publisherIds: string[]
}

interface LanguageGroup {
  name: string
}

interface Congregation {
  name:           string
  number:         string
  country:        string
  locale:         string
  languageGroups: LanguageGroup[]
}

interface User {
  firstname: string
  lastname:  string
  email:     string
}

interface Online {
  send_report_group?:     boolean
  send_report_publisher?: boolean
  public?:                boolean
}

export interface Template extends Base {
  code: string
  name: string
  date: string
  path: string
}

export interface Settings extends Base {
  identifier:   string
  token:        string
  congregation: Congregation
  user:         User
  online:       Online
  mergePdf:     boolean
}

export interface ServiceGroup extends Base {
  name:           string
  responsibleId?: string
  assistantId?:   string
  receivers:      'NONE' | 'BOTH' | 'ASSISTANT' | 'RESPONSIBLE'
}

export interface Appointment {
  type:  string
  date?: string
}

export interface EmergencyContact {
  name?:  string
  email?: string
  phone?: string
}

export interface Child {
  name:       string
  identifier: string
  birthday?:  string
}

export interface History {
  date:         string
  type:         string
  information?: string
}

export interface Report {
  serviceYear:              number
  serviceMonth:             string
  name:                     string
  hasBeenInService:         boolean
  hasNotBeenInService:      boolean
  studies?:                 number
  hours?:                   number
  credit?:                  number
  remarks?:                 string
  sortOrder:                number
  identifier:               string
  type:                     'PUBLISHER' | 'PIONEER' | 'SPECIALPIONEER' | 'AUXILIARY' | 'MISSIONARY' | 'CIRCUITOVERSEER'
  auxiliary:                boolean
  publisherId?:             string
  publisherName?:           string
  publisherEmail?:          string
  publisherMobile?:         string
  publisherServiceGroupId?: string
  publisherStatus?:         'ACTIVE' | 'INACTIVE' | 'IRREGULAR'
  publisherSendEmail?:      boolean
}

export interface Publisher extends Base {
  s290:              boolean
  firstname:         string
  lastname:          string
  birthday?:         string
  gender:            'MAN' | 'WOMAN'
  baptised?:         string
  unknown_baptised:  boolean
  histories:         History[]
  hope:              'OTHER_SHEEP' | 'ANOINTED'
  email?:            string
  phone?:            string
  mobile?:           string
  contact:           boolean
  familyId?:         string
  address:           string
  zip:               string
  city:              string
  serviceGroupId?:   string
  responsibilities?: string[]
  tasks?:            string[]
  appointments?:     Appointment[]
  emergencyContact:  EmergencyContact
  other?:            string
  status:            'ACTIVE' | 'INACTIVE' | 'IRREGULAR'
  deaf:              boolean
  blind:             boolean
  sendReports:       boolean
  children:          Child[]
  reports:           Report[]
  old?:              string
  resident:          string
}

export interface Responsibility extends Base {
  name:    string
  default: boolean
}

export interface Task extends Base {
  name:             string
  responsibilityId: string
  default:          boolean
}

export interface ImportantDate extends Base {
  type: string
}

export interface Export extends Base {
  name:   string
  format: string
  method: string
  count:  number
}

export interface History {
  date:         string
  type:         string
  information?: string
}

export interface Meeting {
  name?:      string
  identifier: string
  midweek:    number[]
  weekend:    number[]
}

export interface Stats {
  activePublishers:    number
  regularPublishers:   number
  irregularPublishers: number
  inactivePublishers:  number
  deaf:                number
  blind:               number
}

export interface ServiceMonth extends Base {
  status:       'ACTIVE' | 'DONE'
  name:         string
  serviceMonth: string
  serviceYear:  number
  sortOrder:    number
  reports:      Report[]
  meetings:     Meeting[]
  stats:        Stats
}

export interface ServiceYear extends Base {
  name:          number
  serviceMonths: string[]
  history:       History[]
}

export interface CircuitOverseer extends Base {
  firstname: string
  lastname:  string
  email?:    string
  phone?:    string
  mobile?:   string
  address:   string
  zip:       string
  city:      string
}

export const CircuitOverseerSchema: JSONSchemaType<CircuitOverseer> = {
  type:       'object',
  properties: {
    _id:       { type: 'string', nullable: true },
    firstname: { type: 'string' },
    lastname:  { type: 'string' },
    email:     { type: 'string', nullable: true },
    phone:     { type: 'string', nullable: true },
    mobile:    { type: 'string', nullable: true },
    address:   { type: 'string' },
    zip:       { type: 'string' },
    city:      { type: 'string' },
    createdAt: { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    updatedAt: { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
  },
  required:             ['firstname', 'lastname', 'address', 'zip', 'city'],
  additionalProperties: false,
}

const LanguageGroupSchema: JSONSchemaType<LanguageGroup> = {
  type:       'object',
  properties: {
    name: { type: 'string' },
  },
  required: ['name'],
}

const CongregationSchema: JSONSchemaType<Congregation> = {
  type:       'object',
  properties: {
    name:           { type: 'string' },
    number:         { type: 'string' },
    country:        { type: 'string' },
    locale:         { type: 'string' },
    languageGroups: { type: 'array', items: LanguageGroupSchema },
  },
  required: ['name', 'number', 'country', 'locale'],
}

const UserSchema: JSONSchemaType<User> = {
  type:       'object',
  properties: {
    firstname: { type: 'string' },
    lastname:  { type: 'string' },
    email:     { type: 'string' },
  },
  required: ['firstname', 'lastname', 'email'],
}

const OnlineSchema: JSONSchemaType<Online> = {
  type:       'object',
  properties: {
    send_report_group:     { type: 'boolean', nullable: true },
    send_report_publisher: { type: 'boolean', nullable: true },
    public:                { type: 'boolean', nullable: true },
  },
  required: [],
}

export const TemplateSchema: JSONSchemaType<Template> = {
  type:       'object',
  properties: {
    _id:       { type: 'string', nullable: true },
    code:      { type: 'string' },
    name:      { type: 'string' },
    date:      { type: 'string' },
    path:      { type: 'string' },
    createdAt: { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    updatedAt: { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
  },
  required: ['name', 'path', 'date', 'code'],
}

export const SettingsSchema: JSONSchemaType<Settings> = {
  type:       'object',
  properties: {
    _id:          { type: 'string', nullable: true },
    identifier:   { type: 'string' },
    token:        { type: 'string' },
    congregation: CongregationSchema,
    user:         UserSchema,
    online:       OnlineSchema,
    mergePdf:     { type: 'boolean' },
    createdAt:    { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    updatedAt:    { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
  },
  required:             ['identifier', 'token'],
  additionalProperties: false,
}

export const ExportSchema: JSONSchemaType<Export> = {
  type:       'object',
  properties: {
    _id:       { type: 'string', nullable: true },
    name:      { type: 'string' },
    format:    { type: 'string' },
    method:    { type: 'string' },
    count:     { type: 'number' },
    createdAt: { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    updatedAt: { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
  },
  required: ['name', 'format', 'method', 'count'],
}

const AppointmentSchema: JSONSchemaType<Appointment> = {
  type:       'object',
  properties: {
    type: { type: 'string' },
    date: { type: 'string', nullable: true },
  },
  required: ['type'],
}

const EmergencyContactSchema: JSONSchemaType<EmergencyContact> = {
  type:       'object',
  properties: {
    name:  { type: 'string', nullable: true },
    email: { type: 'string', nullable: true },
    phone: { type: 'string', nullable: true },
  },
  required: [],
}

const ChildSchema: JSONSchemaType<Child> = {
  type:       'object',
  properties: {
    name:       { type: 'string' },
    identifier: { type: 'string' },
    birthday:   { type: 'string', nullable: true },
  },
  required: ['name', 'identifier'],
}

const HistorySchema: JSONSchemaType<History> = {
  type:       'object',
  properties: {
    date:        { type: 'string' },
    type:        { type: 'string' },
    information: { type: 'string', nullable: true },
  },
  required: ['date', 'type'],
}

const MeetingSchema: JSONSchemaType<Meeting> = {
  type:       'object',
  properties: {
    name:       { type: 'string', nullable: true },
    identifier: { type: 'string' },
    midweek:    { type: 'array', items: { type: 'number' } },
    weekend:    { type: 'array', items: { type: 'number' } },
  },
  required: ['identifier', 'midweek', 'weekend'],
}

const ReportSchema: JSONSchemaType<Report> = {
  type:       'object',
  properties: {
    identifier:              { type: 'string' },
    hasBeenInService:        { type: 'boolean' },
    hasNotBeenInService:     { type: 'boolean' },
    hours:                   { type: 'number', nullable: true },
    studies:                 { type: 'number', nullable: true },
    remarks:                 { type: 'string', nullable: true },
    credit:                  { type: 'number', nullable: true },
    type:                    { type: 'string' },
    auxiliary:               { type: 'boolean' },
    name:                    { type: 'string' },
    serviceMonth:            { type: 'string' },
    serviceYear:             { type: 'number' },
    sortOrder:               { type: 'number' },
    information:             { type: 'string' },
    publisherId:             { type: 'string', nullable: true },
    publisherName:           { type: 'string', nullable: true },
    publisherEmail:          { type: 'string', nullable: true },
    publisherMobile:         { type: 'string', nullable: true },
    publisherServiceGroupId: { type: 'string', nullable: true },
    publisherStatus:         { type: 'string', nullable: true },
    publisherSendEmail:      { type: 'boolean', nullable: true },
  },
  required: [
    'hasBeenInService',
    'hasNotBeenInService',
    'identifier',
    'serviceMonth',
    'serviceYear',
    'sortOrder',
    'type',
    'auxiliary',
    'name',
  ],
}

export const PublisherSchema: JSONSchemaType<Publisher> = {
  type:       'object',
  properties: {
    _id:              { type: 'string', nullable: true },
    s290:             { type: 'boolean' },
    firstname:        { type: 'string' },
    lastname:         { type: 'string' },
    birthday:         { type: 'string', nullable: true },
    gender:           { type: 'string' },
    baptised:         { type: 'string', nullable: true },
    unknown_baptised: { type: 'boolean' },
    hope:             { type: 'string' },
    phone:            { type: 'string', nullable: true },
    mobile:           { type: 'string', nullable: true },
    email:            { type: 'string', nullable: true },
    contact:          { type: 'boolean' },
    familyId:         { type: 'string', nullable: true },
    address:          { type: 'string' },
    zip:              { type: 'string' },
    city:             { type: 'string' },
    serviceGroupId:   { type: 'string', nullable: true },
    responsibilities: { type: 'array', items: { type: 'string' }, nullable: true },
    tasks:            { type: 'array', items: { type: 'string' }, nullable: true },
    appointments:     { type: 'array', items: AppointmentSchema, nullable: true },
    emergencyContact: EmergencyContactSchema,
    other:            { type: 'string', nullable: true },
    status:           { type: 'string' },
    deaf:             { type: 'boolean' },
    blind:            { type: 'boolean' },
    sendReports:      { type: 'boolean' },
    old:              { type: 'string', nullable: true },
    resident:         { type: 'string' },
    children:         { type: 'array', items: ChildSchema },
    histories:        { type: 'array', items: HistorySchema },
    reports:          { type: 'array', items: ReportSchema },
    createdAt:        { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    updatedAt:        { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
  },
  required: [
    's290',
    'firstname',
    'lastname',
    'gender',
    'unknown_baptised',
    'hope',
    'contact',
    'address',
    'zip',
    'city',
    'status',
    'deaf',
    'blind',
    'sendReports',
    'children',
    'histories',
    'reports',
    'resident',
  ],
  additionalProperties: false,
}

export const ServiceGroupSchema: JSONSchemaType<ServiceGroup> = {
  type:       'object',
  properties: {
    _id:           { type: 'string', nullable: true },
    name:          { type: 'string' },
    responsibleId: { type: 'string', nullable: true },
    assistantId:   { type: 'string', nullable: true },
    receivers:     { type: 'string' },
    createdAt:     { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    updatedAt:     { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
  },
  required:             ['name'],
  additionalProperties: false,
}

export const ResponsibilitySchema: JSONSchemaType<Responsibility> = {
  type:       'object',
  properties: {
    _id:       { type: 'string', nullable: true },
    name:      { type: 'string' },
    default:   { type: 'boolean' },
    createdAt: { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    updatedAt: { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
  },
  required:             ['name', 'default'],
  additionalProperties: false,
}

export const TaskSchema: JSONSchemaType<Task> = {
  type:       'object',
  properties: {
    _id:              { type: 'string', nullable: true },
    name:             { type: 'string' },
    responsibilityId: { type: 'string' },
    default:          { type: 'boolean' },
    createdAt:        { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    updatedAt:        { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
  },
  required:             ['name', 'responsibilityId', 'default'],
  additionalProperties: false,
}

export const ImportantDateSchema: JSONSchemaType<ImportantDate> = {
  type:       'object',
  properties: {
    _id:       { type: 'string', nullable: true },
    type:      { type: 'string' },
    createdAt: { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    updatedAt: { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
  },
  required:             ['type'],
  additionalProperties: false,
}

export const AuxiliarySchema: JSONSchemaType<Auxiliary> = {
  type:       'object',
  properties: {
    _id:          { type: 'string', nullable: true },
    serviceMonth: { type: 'string' },
    name:         { type: 'string' },
    publisherIds: { type: 'array', items: { type: 'string' } },
    createdAt:    { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    updatedAt:    { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
  },
  required:             ['serviceMonth', 'name', 'publisherIds'],
  additionalProperties: false,
}

export const ServiceYearSchema: JSONSchemaType<ServiceYear> = {
  type:       'object',
  properties: {
    _id:           { type: 'string', nullable: true },
    name:          { type: 'number' },
    serviceMonths: { type: 'array', items: { type: 'string' } },
    history:       { type: 'array', items: HistorySchema },
    createdAt:     { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    updatedAt:     { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
  },
  required:             ['name', 'serviceMonths', 'history'],
  additionalProperties: false,
}

const StatsSchema: JSONSchemaType<Stats> = {
  type:       'object',
  properties: {
    activePublishers:    { type: 'number' },
    regularPublishers:   { type: 'number' },
    irregularPublishers: { type: 'number' },
    inactivePublishers:  { type: 'number' },
    deaf:                { type: 'number' },
    blind:               { type: 'number' },
  },
  required: [],
}

export const ServiceMonthSchema: JSONSchemaType<ServiceMonth> = {
  type:       'object',
  properties: {
    _id:          { type: 'string', nullable: true },
    status:       { type: 'string' },
    name:         { type: 'string' },
    serviceMonth: { type: 'string' },
    serviceYear:  { type: 'number' },
    sortOrder:    { type: 'number' },
    reports:      { type: 'array', items: ReportSchema },
    meetings:     { type: 'array', items: MeetingSchema },
    stats:        StatsSchema,
    createdAt:    { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    updatedAt:    { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
  },
  required:             ['name', 'status', 'serviceMonth', 'serviceYear', 'sortOrder', 'reports'],
  additionalProperties: false,
}
