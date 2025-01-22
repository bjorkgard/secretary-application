import type { ResponsibilityModel, TaskModel } from '../types/models'
import OrganizationService                     from './services/organizationService'
import ResponsibilityService                   from './services/responsibilityService'
import TaskService                             from './services/taskService'
import generateIdentifier                      from './utils/generateIdentifier'

// import log from 'electron-log'

const organizationService  = new OrganizationService()
const responsibiltyService = new ResponsibilityService()
const taskService          = new TaskService()

// !Update or create database
async function migrateDatabase(): Promise<void> {
  // Upsert Responsibilities
  const responsibilities: ResponsibilityModel[] = [
    { name: 'responsibility.coordinator', default: true },
    { name: 'responsibility.secretary', default: true },
    { name: 'responsibility.serviceOverseer', default: true },
    { name: 'responsibility.meetingOverseer', default: true },
    { name: 'responsibility.advisor', default: true },
    { name: 'responsibility.wtStudy', default: true },
    { name: 'responsibility.languageGroupOverseer', default: true },
  ]

  responsibilities.map(async (responsibility) => {
    await responsibiltyService.upsert(responsibility)
  })

  // Remove old Responsibilities
  const oldResponsibilities: ResponsibilityModel[] = []

  oldResponsibilities.map(async (responsibility) => {
    await responsibiltyService.remove(responsibility)
  })

  let responsibilityArray: ResponsibilityModel[] = []
  await responsibiltyService.find().then((responsibilities) => {
    responsibilityArray = responsibilities
  })

  // Upsert Tasks
  const tasks: TaskModel[] = [
    {
      name: 'task.districtOverseer',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.serviceOverseer')?._id || '',
      default: true,
    },
    {
      name: 'task.district',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.serviceOverseer')?._id || '',
      default: true,
    },
    {
      name: 'task.literatureOverseer',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.serviceOverseer')?._id || '',
      default: true,
    },
    {
      name: 'task.literature',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.serviceOverseer')?._id || '',
      default: true,
    },
    {
      name: 'task.accounting',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.secretary')?._id || '',
      default: true,
    },
    {
      name: 'task.accountingAssistant',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.secretary')?._id || '',
      default: true,
    },
    {
      name: 'task.accountant',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.accountantAlternate',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.operationGroup',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.accountantOperationGroup',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.lecture',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.soundStageOverseer',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.soundStage',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.hostOverseer',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.host',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.readerWT',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.meetingOverseer')?._id || '',
      default: true,
    },
    {
      name: 'task.readerBS',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.meetingOverseer')?._id || '',
      default: true,
    },
    {
      name: 'task.prayer',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.cleaning',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.patient',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.technicalSupport',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.michrophones',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.interpreter',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.languageGroupOverseer')?._id
        || '',
      default: true,
    },
    {
      name: 'task.chairmanWeekendMeeting',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.chairmanMidweekMeeting',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.schema',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.coordinator')?._id || '',
      default: true,
    },
    {
      name: 'task.wtStudyAssistant',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.wtStudy')?._id || '',
      default: true,
    },
    {
      name: 'task.advisorAssistant',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.meetingOverseer')?._id || '',
      default: true,
    },
    {
      name: 'task.languageGroup',
      responsibilityId:
        responsibilityArray.find(r => r.name === 'responsibility.languageGroupOverseer')?._id
        || '',
      default: true,
    },
  ]
  tasks.map(async (task) => {
    await taskService.upsert(task)
  })

  // TODO: Remove Tasks
  const oldTasks: TaskModel[] = []

  oldTasks.map(async (task) => {
    await taskService.remove(task)
  })

  const newTasks = await taskService.find()

  // Upsert Organization
  organizationService.find().then((response) => {
    if (!response) {
      organizationService.upsert({
        identifier:       generateIdentifier(),
        responsibilities: [
          { active: true, type: 'responsibility.coordinator', sortOrder: 0 },
          { active: true, type: 'responsibility.secretary', sortOrder: 1 },
          { active: true, type: 'responsibility.serviceOverseer', sortOrder: 2 },
          { active: true, type: 'responsibility.wtStudy', sortOrder: 3 },
          { active: true, type: 'responsibility.meetingOverseer', sortOrder: 4 },
          { active: true, type: 'responsibility.advisor', sortOrder: 5 },
        ],
        tasks: [
          {
            type:      newTasks.find(nt => nt.name === 'task.district')?._id || '',
            manager:   newTasks.find(nt => nt.name === 'task.districtOverseer')?._id || '',
            assistant: newTasks.find(nt => nt.name === 'task.district')?._id,
            sortOrder: 0,
          },
          {
            type:      newTasks.find(nt => nt.name === 'task.operationGroup')?._id || '',
            manager:   newTasks.find(nt => nt.name === 'task.operationGroup')?._id || '',
            sortOrder: 1,
          },
          {
            type:      newTasks.find(nt => nt.name === 'task.lecture')?._id || '',
            manager:   newTasks.find(nt => nt.name === 'task.lecture')?._id || '',
            sortOrder: 2,
          },
          {
            type:      newTasks.find(nt => nt.name === 'task.literature')?._id || '',
            manager:   newTasks.find(nt => nt.name === 'task.literatureOverseer')?._id || '',
            assistant: newTasks.find(nt => nt.name === 'task.literature')?._id,
            sortOrder: 3,
          },
          {
            type:      newTasks.find(nt => nt.name === 'task.soundStage')?._id || '',
            manager:   newTasks.find(nt => nt.name === 'task.soundStageOverseer')?._id || '',
            assistant: newTasks.find(nt => nt.name === 'task.soundStage')?._id,
            sortOrder: 4,
          },
          {
            type:      newTasks.find(nt => nt.name === 'task.host')?._id || '',
            manager:   newTasks.find(nt => nt.name === 'task.hostOverseer')?._id || '',
            assistant: newTasks.find(nt => nt.name === 'task.host')?._id,
            sortOrder: 5,
          },
          {
            type:      newTasks.find(nt => nt.name === 'task.accountant')?._id || '',
            manager:   newTasks.find(nt => nt.name === 'task.accountant')?._id || '',
            assistant: newTasks.find(nt => nt.name === 'task.accountantAlternate')?._id,
            sortOrder: 6,
          },
          {
            type:      newTasks.find(nt => nt.name === 'task.accounting')?._id || '',
            manager:   newTasks.find(nt => nt.name === 'task.accounting')?._id || '',
            assistant: newTasks.find(nt => nt.name === 'task.accountingAssistant')?._id,
            sortOrder: 7,
          },
          {
            type:      newTasks.find(nt => nt.name === 'task.cleaning')?._id || '',
            manager:   newTasks.find(nt => nt.name === 'task.cleaning')?._id || '',
            sortOrder: 8,
          },
          {
            type:      newTasks.find(nt => nt.name === 'task.technicalSupport')?._id || '',
            manager:   newTasks.find(nt => nt.name === 'task.technicalSupport')?._id || '',
            sortOrder: 9,
          },
        ],
        appointments: [
          { active: true, type: 'ELDER', sortOrder: 0 },
          { active: true, type: 'MINISTERIALSERVANT', sortOrder: 1 },
          { active: true, type: 'SPECIALPIONEER', sortOrder: 2 },
          { active: true, type: 'PIONEER', sortOrder: 3 },
          { active: true, type: 'AUXILIARY', sortOrder: 4 },
        ],
      })
    }
  })
}

export default migrateDatabase
