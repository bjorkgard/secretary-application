import type { Task }                        from '../databases/schemas'
import { TaskSchema }                       from '../databases/schemas'
import type { TaskModel }                   from '../../types/models'
import type { TaskService as ITaskService } from '../../types/type'
import TaskStore                            from '../databases/taskStore'

const taskStore = new TaskStore('tasks.db', TaskSchema)

function parseTaskModel(data: TaskModel): Task {
  const task: Task = {
    name:             '',
    responsibilityId: '',
    default:          false,
  }

  task.name             = data.name
  task.responsibilityId = data.responsibilityId
  task.default          = data.default ? data.default : false

  return task
}

function parseTask(data: Task): TaskModel {
  const taskModel: TaskModel = {
    name:             '',
    responsibilityId: '',
    default:          false,
  }

  taskModel._id              = data._id
  taskModel.name             = data.name
  taskModel.responsibilityId = data.responsibilityId
  taskModel.default          = data.default ? data.default : false
  taskModel.createdAt        = data.createdAt?.toLocaleString('sv-SE')
  taskModel.updatedAt        = data.updatedAt?.toLocaleString('sv-SE')

  return taskModel
}

export default class TaskService implements ITaskService {
  async find(): Promise<TaskModel[]> {
    const tasks = (await taskStore.find()) as Task[]

    return tasks.map(t => parseTask(t))
  }

  async create(data: TaskModel): Promise<TaskModel> {
    const task    = parseTaskModel(data)
    const newTask = (await taskStore.create(task)) as Task

    return parseTask(newTask)
  }

  async update(id: string, data: TaskModel): Promise<number> {
    const task = parseTaskModel(data)
    return (await taskStore.update(id, task)) as number
  }

  async upsert(data: TaskModel): Promise<number> {
    const task = parseTaskModel(data)
    return (await taskStore.upsert(task)) as number
  }

  async remove(data: TaskModel): Promise<number> {
    const task = parseTaskModel(data)
    return (await taskStore.remove(task)) as number
  }

  async delete(id: string): Promise<number> {
    return (await taskStore.delete(id)) as number
  }

  async findOneById(id: string): Promise<TaskModel> {
    const task = (await taskStore.findOneById(id)) as Task
    return parseTask(task)
  }

  async drop(): Promise<void> {
    taskStore.drop()
  }
}
