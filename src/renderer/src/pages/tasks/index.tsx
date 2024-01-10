import { useEffect, useState }                 from 'react'
import { useTranslation }                      from 'react-i18next'
import { useNavigate }                         from 'react-router-dom'
import { PlusIcon }                            from '@heroicons/react/24/solid'
import { PencilIcon, TrashIcon }               from '@heroicons/react/20/solid'
import type { ResponsibilityModel, TaskModel } from 'src/types/models'
import { useConfirmationModalContext }         from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import ROUTES                                  from '../../constants/routes.json'

export default function Tasks(): JSX.Element {
  const { t }          = useTranslation()
  const navigate       = useNavigate()
  const confirmContext = useConfirmationModalContext()

  const [tasks, setTasks]                       = useState<TaskModel[]>([])
  const [responsibilities, setResponsibilities] = useState<ResponsibilityModel[]>([])

  const getTasks = (): void => {
    window.electron.ipcRenderer.invoke('get-tasks').then((result: TaskModel[]) => {
      const parsedResult = result.map((resp) => {
        return { ...resp, name: resp.default ? t(resp.name) : resp.name }
      })

      setTasks(parsedResult.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)))
    })
  }

  useEffect(() => {
    getTasks()
  }, [])

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-responsibilities')
      .then((result: ResponsibilityModel[]) => {
        const parsedResult = result.map((resp) => {
          return { ...resp, name: resp.default ? t(resp.name) : resp.name }
        })

        setResponsibilities(
          parsedResult.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)),
        )
      })
  }, [tasks])

  const editTask = (id: string | undefined): void => {
    if (id)
      navigate(`${ROUTES.TASKS}/${id}/edit`)
  }

  const deleteTask = async (id: string | undefined): Promise<void> => {
    if (id) {
      const result = await confirmContext.showConfirmation(
        t('tasks.deleteConfirmation.headline'),
        t('tasks.deleteConfirmation.body'),
      )
      if (result) {
        window.electron.ipcRenderer.invoke('delete-task', id).then(() => {
          setTasks(tasks.filter(t => t._id !== id))
        })
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1>{t('tasks.headline')}</h1>
        <div className="tooltip tooltip-left" data-tip={t('label.addTask')}>
          <button
            className="btn btn-circle btn-outline"
            onClick={(): void => navigate(`${ROUTES.TASKS}/add`)}
          >
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>{t('tasks.header.name')}</th>
              <th>{t('tasks.header.responsibility')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const responsibility = responsibilities.find(r => r._id === task.responsibilityId)

              return (
                <tr key={task._id} className="hover">
                  <td>{task.name}</td>
                  <td>{responsibility?.name}</td>
                  <td>
                    <div className="flex justify-end space-x-4">
                      <div className="tooltip tooltip-left" data-tip={t('tooltip.editTask')}>
                        <button
                          className="btn btn-circle btn-outline btn-xs"
                          onClick={(): void => {
                            editTask(task._id)
                          }}
                          disabled={task.default}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="tooltip tooltip-left" data-tip={t('tooltip.deleteTask')}>
                        <button
                          className="btn btn-circle btn-outline btn-xs"
                          onClick={(): void => {
                            deleteTask(task._id)
                          }}
                          disabled={task.default}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

Tasks.displayName = 'Tasks'
