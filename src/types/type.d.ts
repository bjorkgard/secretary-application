import type {
  AuxiliaryModel,
  CircuitOverseerModel,
  ExportModel,
  History,
  ImportantDateModel,
  Meeting,
  PublisherModel,
  Report,
  ResponsibilityModel,
  ServiceGroupModel,
  ServiceMonthModel,
  ServiceYearModel,
  SettingsModel,
  TaskModel,
} from './models'

type Nullable<T> = T | null

export interface BaseService<T> {
  create:      (data: T) => Promise<T>
  update:      (id: string, data: T) => Promise<number>
  delete?:     (id: string) => Promise<number>
  findOneById: (id: string) => Promise<T>
  drop:        () => void
}

export interface SettingsService extends BaseService<SettingsModel> {
  find:  () => Promise<SettingsModel | undefined>
  token: () => Promise<string | undefined>
}

export interface PublisherService extends BaseService<PublisherModel> {
  find:                         (sortField: string, queryString?: string) => Promise<PublisherModel[]>
  findByIds:                    (ids: string[]) => Promise<PublisherModel[]>
  findContacts:                 () => Promise<PublisherModel[]>
  findFamily:                   (familyId: string) => Promise<PublisherModel[]>
  resetServiceGroup:            (serviceGroupId: string) => Promise<void>
  updateAddressOnFamilyMembers: (publisher: PublisherModel) => Promise<void>
  findByIdentifier:             (identifier: string) => Promise<PublisherModel | null>
  addReport:                    (publisherId: string, report: Report) => Promise<number | undefined>
  saveReport:                   (publisherId: string, report: Report, status: 'ACTIVE' | 'INACTIVE' | 'IRREGULAR') => Promise<number | undefined>
}

export interface ServiceYearService extends BaseService<ServiceYearModel> {
  find:              () => Promise<ServiceYearModel[]>
  findByServiceYear: (name: number) => Promise<ServiceYearModel | null>
  findOrCreate:      (name: number) => Promise<ServiceYearModel>
  addHistory:        (name: number, history: History) => void
}

export interface ServiceMonthService extends BaseService<ServiceMonthModel> {
  find:               () => Promise<ServiceMonthModel[]>
  findActive:         () => Promise<ServiceMonthModel | null>
  findByServiceMonth: (serviceMonth: string) => Promise<ServiceMonthModel | null>
  findByIds:          (ids: string[]) => Promise<ServiceMonthModel[]>
  closeActive:        () => Promise<void>
  deleteReport:       (date: string, publisherId: string) => Promise<void>
  saveReport:         (report: Report) => Promise<number | undefined>
  saveMeetings: (props: {
    meetings:       Meeting
    serviceMonthId: string
    name?:          string
  }) => Promise<number | undefined>
}

export interface ServiceGroupService extends BaseService<ServiceGroupModel> {
  find:   () => Promise<ServiceGroupModel[]>
  upsert: (data: ServiceGroupModel) => Promise<number>
}

export interface ResponsibilityService extends BaseService<ResponsibilityModel> {
  find:   () => Promise<ResponsibilityModel[]>
  upsert: (data: ResponsibilityModel) => Promise<number>
  remove: (data: ResponsibilityModel) => Promise<number>
}

export interface TaskService extends BaseService<TaskModel> {
  find:   () => Promise<TaskModel[]>
  upsert: (data: TaskModel) => Promise<number>
  remove: (data: TaskModel) => Promise<number>
}

export interface ImportantDateService extends BaseService<ImportantDateModel> {
  find:       () => Promise<ImportantDateModel[]>
  findByType: (type: string) => Promise<ImportantDateModel | null>
  upsert:     (data: ImportantDateModel) => Promise<number>
  remove:     (data: ImportantDateModel) => Promise<number>
}

export interface TemplateService extends BaseService<TemplateModel> {
  find:       () => Promise<TemplateModel[]>
  findByCode: (code: string) => Promise<TemplateModel>
  upsert:     (data: TemplateModel) => Promise<number>
}

export interface AuxiliaryService extends BaseService<AuxiliaryModel> {
  find:               () => Promise<AuxiliaryModel[]>
  findByServiceMonth: (serviceMonth: string) => Promise<AuxiliaryModel | null>
  deleteServiceMonth: (serviceMonth: string) => Promise<number>
  upsert:             ({ serviceMonth: string, name: string }) => Promise<AuxiliaryModel>
}

export interface ExportService extends BaseService<ExportModel> {
  find:   () => Promise<ExportModel[]>
  upsert: (name: string, format: string, method: string) => Promise<number>
}

export interface CircuitOverseerService extends BaseService<CircuitOverseerModel> {
  find:   () => Promise<CircuitOverseerModel | undefined>
  upsert: (data: CircuitOverseerModel) => Promise<number>
}
