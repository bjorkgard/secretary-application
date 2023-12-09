import { ResponsibilityModel, TaskModel } from '../types/models'
import ResponsibilityService from './services/responsibilityService'
import TaskService from './services/taskService'

const responsibiltyService = new ResponsibilityService()
const taskService = new TaskService()

// !Update or create database
const migrateDatabase = async (): Promise<void> => {
  // Upsert Responsibilities
  const responsibilities: ResponsibilityModel[] = [
    { name: 'responsibility.coordinator', default: true },
    { name: 'responsibility.secretary', default: true },
    { name: 'responsibility.serviceOverseer', default: true },
    { name: 'responsibility.meetingOverseer', default: true },
    { name: 'responsibility.advisor', default: true },
    { name: 'responsibility.wtStudy', default: true },
    { name: 'responsibility.languageGroupOverseer', default: true }
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
        responsibilityArray.find((r) => r.name === 'responsibility.serviceOverseer')?._id || '',
      default: true
    },
    {
      name: 'task.district',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.serviceOverseer')?._id || '',
      default: true
    },
    {
      name: 'task.literatureOverseer',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.serviceOverseer')?._id || '',
      default: true
    },
    {
      name: 'task.literature',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.serviceOverseer')?._id || '',
      default: true
    },
    {
      name: 'task.accounting',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.secretary')?._id || '',
      default: true
    },
    {
      name: 'task.accountingAssistant',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.secretary')?._id || '',
      default: true
    },
    {
      name: 'task.accountant',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.accountantAlternate',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.operationGroup',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.accountantOperationGroup',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.lecture',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.soundStageOverseer',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.soundStage',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.hostOverseer',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.host',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.readerWT',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.meetingOverseer')?._id || '',
      default: true
    },
    {
      name: 'task.readerBS',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.meetingOverseer')?._id || '',
      default: true
    },
    {
      name: 'task.prayer',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.cleaning',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.patient',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.technicalSupport',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.michrophones',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.interpreter',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.languageGroupOverseer')?._id ||
        '',
      default: true
    },
    {
      name: 'task.chairmanWeekendMeeting',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.chairmanMidweekMeeting',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.schema',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.coordinator')?._id || '',
      default: true
    },
    {
      name: 'task.wtStudyAssistant',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.wtStudy')?._id || '',
      default: true
    },
    {
      name: 'task.advisorAssistant',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.meetingOverseer')?._id || '',
      default: true
    },
    {
      name: 'task.languageGroup',
      responsibilityId:
        responsibilityArray.find((r) => r.name === 'responsibility.languageGroupOverseer')?._id ||
        '',
      default: true
    }
  ]
  tasks.map(async (task) => {
    await taskService.upsert(task)
  })

  // TODO: Remove Tasks
  const oldTasks: TaskModel[] = []

  oldTasks.map(async (task) => {
    await taskService.remove(task)
  })
}

export default migrateDatabase
