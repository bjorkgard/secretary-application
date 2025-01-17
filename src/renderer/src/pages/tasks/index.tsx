import { useEffect, useState }                                           from 'react'
import { useTranslation }                                                from 'react-i18next'
import { useNavigate }                                                   from 'react-router-dom'
import { PlusIcon }                                                      from '@heroicons/react/24/solid'
import { PencilIcon, TrashIcon }                                         from '@heroicons/react/20/solid'
import type { ResponsibilityModel, TaskModel }                           from 'src/types/models'
import { useConfirmationModalContext }                                   from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import { Fieldset }                                                      from '@renderer/components/catalyst/fieldset'
import { Heading }                                                       from '@renderer/components/catalyst/heading'
import { Button }                                                        from '@renderer/components/catalyst/button'
import { Text }                                                          from '@renderer/components/catalyst/text'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@renderer/components/catalyst/table'
import ROUTES                                                            from '../../constants/routes.json'

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
      <Fieldset>
        <div className="flex justify-between">
          <Heading>{t('tasks.headline')}</Heading>
          <div className="tooltip tooltip-left" data-tip={t('label.addTask')}>
            <Button
              onClick={(): void => navigate(`${ROUTES.TASKS}/add`)}
              color="blue"
            >
              <PlusIcon className="size-6 text-white" />
              Lägg till
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-3">
          <Text>{t('tasks.description')}</Text>
          <div className="col-span-2">
            <Table dense grid striped sticky className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
              <TableHead>
                <TableRow>
                  <TableHeader>{t('tasks.header.name')}</TableHeader>
                  <TableHeader>{t('tasks.header.responsibility')}</TableHeader>
                  <TableHeader>&nbsp;</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => {
                  const responsibility = responsibilities.find(r => r._id === task.responsibilityId)
                  return (
                    <TableRow key={task._id}>
                      <TableCell>{task.name}</TableCell>
                      <TableCell>{responsibility?.name}</TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-4">
                          <div
                            className="tooltip tooltip-left"
                            data-tip={t('tooltip.editResponsibility')}
                          >
                            <Button
                              outline
                              onClick={(): void => {
                                editTask(task._id)
                              }}
                              disabled={task.default}
                              className="disabled:cursor-not-allowed"
                            >
                              <PencilIcon className="size-4" />
                            </Button>
                          </div>
                          <div
                            className="tooltip tooltip-left"
                            data-tip={t('tooltip.deleteServiceGroup')}
                          >
                            <Button
                              outline
                              onClick={(): void => {
                                deleteTask(task._id)
                              }}
                              disabled={task.default}
                              className="disabled:cursor-not-allowed"
                            >
                              <TrashIcon className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </Fieldset>
    </div>
  )
}

Tasks.displayName = 'Tasks'
