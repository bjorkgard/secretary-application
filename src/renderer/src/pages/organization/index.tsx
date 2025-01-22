import { PlusIcon, TrashIcon }                                                    from '@heroicons/react/16/solid'
import { Button }                                                                 from '@renderer/components/catalyst/button'
import { Divider }                                                                from '@renderer/components/catalyst/divider'
import { Fieldset }                                                               from '@renderer/components/catalyst/fieldset'
import { Heading }                                                                from '@renderer/components/catalyst/heading'
import { Input }                                                                  from '@renderer/components/catalyst/input'
import { Select }                                                                 from '@renderer/components/catalyst/select'
import { Switch }                                                                 from '@renderer/components/catalyst/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow }          from '@renderer/components/catalyst/table'
import { Text }                                                                   from '@renderer/components/catalyst/text'
import { clsx }                                                                   from 'clsx'
import { useEffect, useState }                                                    from 'react'
import { useTranslation }                                                         from 'react-i18next'
import type { OrganizationModel, PublisherModel, ResponsibilityModel, TaskModel } from 'src/types/models'

function getPublishersWithResponsibility(publishers: PublisherModel[], responsibillityId?: string): PublisherModel[] {
  const filteredPublishers: PublisherModel[] = []

  if (responsibillityId) {
    for (const publisher of publishers) {
      if (publisher.responsibilities.includes(responsibillityId)) {
        filteredPublishers.push(publisher)
      }
    }
  }

  return filteredPublishers
}

function getPublishersWithAppointment(publishers: PublisherModel[], type: string): PublisherModel[] {
  const filteredPublishers: PublisherModel[] = []

  for (const publisher of publishers) {
    for (const appointment of publisher.appointments) {
      if (appointment.type === type) {
        filteredPublishers.push(publisher)
      }
    }
  }

  return filteredPublishers
}

function getPublishersWithTask(publishers: PublisherModel[], taskId: string | undefined): PublisherModel[] {
  const filteredPublishers: PublisherModel[] = []

  if (taskId) {
    for (const publisher of publishers) {
      if (publisher.tasks.includes(taskId)) {
        filteredPublishers.push(publisher)
      }
    }
  }

  return filteredPublishers
}

export default function Organization(): JSX.Element {
  const { t } = useTranslation()

  const [publishers, setPublishers]                 = useState<PublisherModel[]>([])
  const [responsibilities, setResponsibilities]     = useState<ResponsibilityModel[]>([])
  const [tasks, setTasks]                           = useState<TaskModel[]>([])
  const [organization, setOrganization]             = useState<OrganizationModel>()
  const [elder, setElder]                           = useState<{ active: boolean, sortOrder: number }>({ active: false, sortOrder: 0 })
  const [ministerialServant, setMinisterialServant] = useState<{ active: boolean, sortOrder: number }>({ active: false, sortOrder: 0 })
  const [specialPioneer, setSpecialPioneer]         = useState<{ active: boolean, sortOrder: number }>({ active: false, sortOrder: 0 })
  const [pioneer, setPioneer]                       = useState<{ active: boolean, sortOrder: number }>({ active: false, sortOrder: 0 })
  const [auxiliary, setAuxiliary]                   = useState<{ active: boolean, sortOrder: number }>({ active: false, sortOrder: 0 })

  const getPublishers = (sortField = 'lastname', queryString = ''): void => {
    window.electron.ipcRenderer
      .invoke('get-publishers', { sortField, queryString })
      .then((result: PublisherModel[]) => {
        setPublishers(result)
      })
  }

  const getResponsibilities = (): void => {
    window.electron.ipcRenderer
      .invoke('get-responsibilities')
      .then((result: ResponsibilityModel[]) => {
        setResponsibilities(result)
      })
  }

  const getTasks = (): void => {
    window.electron.ipcRenderer
      .invoke('get-tasks')
      .then((result: TaskModel[]) => {
        const tasks: TaskModel[] = []
        result.forEach((task) => {
          tasks.push({ ...task, name: t(task.name) })
        })

        tasks.sort((a, b) => a.name.localeCompare(b.name))

        return tasks
      })
      .then((tasks) => {
        setTasks(tasks)
      })
  }

  const getOrganization = (): void => {
    window.electron.ipcRenderer
      .invoke('get-organization')
      .then((organization: OrganizationModel) => {
        // sort all data on sortOrder
        organization.responsibilities?.sort((a, b) => a.sortOrder - b.sortOrder)
        organization.tasks?.sort((a, b) => a.sortOrder - b.sortOrder)
        organization.appointments?.sort((a, b) => a.sortOrder - b.sortOrder)

        return organization
      })
      .then(organization => setOrganization(organization))
  }

  useEffect(() => {
    getOrganization()
    getResponsibilities()
    getTasks()
    getPublishers()
  }, [])

  useEffect(() => {
    if (organization) {
      organization.appointments.forEach((a) => {
        switch (a.type) {
          case 'ELDER':
            setElder({ active: a.active, sortOrder: a.sortOrder })
            break
          case 'MINISTERIALSERVANT':
            setMinisterialServant({ active: a.active, sortOrder: a.sortOrder })
            break
          case 'SPECIALPIONEER':
            setSpecialPioneer({ active: a.active, sortOrder: a.sortOrder })
            break
          case 'PIONEER':
            setPioneer({ active: a.active, sortOrder: a.sortOrder })
            break
          case 'AUXILIARY':
            setAuxiliary({ active: a.active, sortOrder: a.sortOrder })
            break

          default:
            break
        }
      })
    }
  }, [organization])

  const handleResponsibilityActive = (name: string) => {
    const tmpOrganization = { ...organization }
    const index           = tmpOrganization.responsibilities?.findIndex(a => a.type === name)

    if (index !== undefined && index >= 0) {
      if (tmpOrganization.responsibilities) {
        tmpOrganization.responsibilities[index] = {
          ...tmpOrganization.responsibilities[index],
          active: !tmpOrganization.responsibilities[index].active,
        }
      }
    }
    else {
      // add a new responsibility
      let newSortOrder = 0
      if (tmpOrganization.responsibilities) {
        newSortOrder = Math.max(...tmpOrganization.responsibilities.map(r => r.sortOrder ?? 0)) + 1
      }

      tmpOrganization.responsibilities?.push({ active: true, type: name, sortOrder: newSortOrder })
    }

    setOrganization(tmpOrganization as OrganizationModel)
  }

  const handleResponsibilitySortOrder = (name: string, sortOrder: string) => {
    const tmpOrganization = { ...organization }
    const index           = tmpOrganization.responsibilities?.findIndex(a => a.type === name)
    if (index !== undefined && index >= 0) {
      if (tmpOrganization.responsibilities) {
        tmpOrganization.responsibilities[index] = {
          ...tmpOrganization.responsibilities[index],
          sortOrder: Number.parseInt(sortOrder),
        }
      }
    }

    tmpOrganization.responsibilities?.sort((a, b) => a.sortOrder - b.sortOrder)

    setOrganization(tmpOrganization as OrganizationModel)
  }

  const handleAppointmentActive = (name: string) => {
    const tmpOrganization = { ...organization }
    const index           = tmpOrganization.appointments?.findIndex(a => a.type === name)

    if (index !== undefined && index >= 0) {
      if (tmpOrganization.appointments) {
        tmpOrganization.appointments[index] = {
          ...tmpOrganization.appointments[index],
          active: !tmpOrganization.appointments[index].active,
        }
      }
    }
    else {
      // add a new responsibility
      let newSortOrder = 0
      if (tmpOrganization.appointments) {
        newSortOrder = Math.max(...tmpOrganization.appointments.map(a => a.sortOrder ?? 0)) + 1
      }

      tmpOrganization.appointments?.push({ active: true, type: name, sortOrder: newSortOrder })
    }

    setOrganization(tmpOrganization as OrganizationModel)
  }

  const handleAppointmentSortOrder = (name: string, sortOrder: string) => {
    const tmpOrganization = { ...organization }
    const index           = tmpOrganization.appointments?.findIndex(a => a.type === name)
    if (index !== undefined && index >= 0) {
      if (tmpOrganization.appointments) {
        tmpOrganization.appointments[index] = {
          ...tmpOrganization.appointments[index],
          sortOrder: Number.parseInt(sortOrder),
        }
      }
    }

    tmpOrganization.appointments?.sort((a, b) => a.sortOrder - b.sortOrder)

    setOrganization(tmpOrganization as OrganizationModel)
  }

  const handleTaskChange = (type: string, option: string, value: string) => {
    const tmpOrganization = { ...organization }
    const index           = tmpOrganization.tasks?.findIndex(a => a.type === type)

    if (index !== undefined && index >= 0) {
      if (tmpOrganization.tasks) {
        tmpOrganization.tasks[index][option] = value

        setOrganization(tmpOrganization as OrganizationModel)
      }
    }
  }

  const handleTaskSortOrder = (type: string, sortOrder: string) => {
    const tmpOrganization = { ...organization }
    const index           = tmpOrganization.tasks?.findIndex(a => a.type === type)
    if (index !== undefined && index >= 0) {
      if (tmpOrganization.tasks) {
        tmpOrganization.tasks[index] = {
          ...tmpOrganization.tasks[index],
          sortOrder: Number.parseInt(sortOrder),
        }
      }
    }

    tmpOrganization.tasks?.sort((a, b) => a.sortOrder - b.sortOrder)

    setOrganization(tmpOrganization as OrganizationModel)
  }

  const deleteTask = (type: string) => {
    const tmpOrganization = { ...organization }
    const index           = tmpOrganization.tasks?.findIndex(a => a.type === type)

    if (index !== undefined && index >= 0) {
      tmpOrganization.tasks?.splice(index, 1)
    }

    tmpOrganization.tasks?.sort((a, b) => a.sortOrder - b.sortOrder)

    setOrganization(tmpOrganization as OrganizationModel)
  }

  const addTask = () => {
    const tmpOrganization = { ...organization }
    tmpOrganization.tasks?.push({ type: '', manager: '', sortOrder: Math.max(...tmpOrganization.tasks.map(a => a.sortOrder ?? 0)) + 1 })

    setOrganization(tmpOrganization as OrganizationModel)
  }

  const saveOrganization = () => {
    window.electron.ipcRenderer
      .invoke('update-organization', organization)
      .then(() => {
        // eslint-disable-next-line no-new
        new window.Notification('SECRETARY', {
          body: t('organization.notification.updated'),
        })
      })
  }

  return (
    <div>
      <Fieldset>
        <div className="flex justify-between">
          <Heading>{t('organization.headline')}</Heading>
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <Text className="md:col-span-2">{t('organization.description')}</Text>

          <div>
            <Table dense grid>
              <TableHead>
                <TableRow>
                  <TableHeader></TableHeader>
                  <TableHeader>{t('label.responsibility')}</TableHeader>
                  <TableHeader>{t('label.sortOrder')}</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {responsibilities.map((resp) => {
                  const checked   = organization?.responsibilities.find(r => r.type === resp.name)?.active || false
                  const sortOrder = organization?.responsibilities.find(r => r.type === resp.name)?.sortOrder.toString() || ''
                  return (
                    <TableRow key={resp._id}>
                      <TableCell><Switch color="blue" checked={checked} onChange={() => handleResponsibilityActive(resp.name)} /></TableCell>
                      <TableCell>{t(resp.name)}</TableCell>
                      <TableCell><Input type="number" value={sortOrder} min={0} onChange={e => handleResponsibilitySortOrder(resp.name, e.target.value)} /></TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <Table dense grid>
              <TableHead>
                <TableRow>
                  <TableHeader>{t('label.task')}</TableHeader>
                  <TableHeader>{t('label.manager')}</TableHeader>
                  <TableHeader>{t('label.assistant')}</TableHeader>
                  <TableHeader>{t('label.sortOrder')}</TableHeader>
                  <TableHeader></TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {organization?.tasks.map((task, index) => {
                  return (
                    <TableRow key={`${task.type}-${index}`}>
                      <TableCell className={clsx((task.type !== '') && 'hidden')}>
                        <Select value={task.manager} onChange={(e) => { handleTaskChange(task.type, 'type', e.target.value) }}>
                          <option value="">{t('label.select')}</option>
                          {tasks.map((content) => {
                            return (
                              <option key={content._id} value={content._id}>{content.name}</option>
                            )
                          })}
                        </Select>
                      </TableCell>
                      <TableCell className={clsx((task.type === '') && 'hidden')}>
                        {t(tasks.find(resp => resp._id === task.type)?.name || '')}
                      </TableCell>
                      <TableCell>
                        <Select value={task.manager} onChange={(e) => { handleTaskChange(task.type, 'manager', e.target.value) }}>
                          <option value="">{t('label.select')}</option>
                          {tasks.map((content) => {
                            return (
                              <option key={content._id} value={content._id}>{content.name}</option>
                            )
                          })}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select value={task.assistant} onChange={(e) => { handleTaskChange(task.type, 'assistant', e.target.value) }}>
                          <option value="">{t('label.select')}</option>
                          {tasks.map((content) => {
                            return (
                              <option key={content._id} value={content._id}>{content.name}</option>
                            )
                          })}
                        </Select>
                      </TableCell>
                      <TableCell><Input type="number" value={task.sortOrder} min={0} onChange={e => handleTaskSortOrder(task.type, e.target.value)} /></TableCell>
                      <TableCell><Button onClick={() => deleteTask(task.type)}><TrashIcon className="size-5" /></Button></TableCell>
                    </TableRow>
                  )
                })}
                <TableRow>
                  <TableCell className="text-right" colSpan={5}><Button onClick={() => addTask()}><PlusIcon className="size-5" /></Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Table dense grid>
              <TableHead>
                <TableRow>
                  <TableHeader></TableHeader>
                  <TableHeader>{t('label.appointments')}</TableHeader>
                  <TableHeader>{t('label.sortOrder')}</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell><Switch color="blue" checked={elder.active} onChange={() => handleAppointmentActive('ELDER')} /></TableCell>
                  <TableCell>{t('appointment.elder')}</TableCell>
                  <TableCell><Input type="number" value={elder.sortOrder} min={0} onChange={e => handleAppointmentSortOrder('ELDER', e.target.value)} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Switch color="blue" checked={ministerialServant.active} onChange={() => handleAppointmentActive('MINISTERIALSERVANT')} /></TableCell>
                  <TableCell>{t('appointment.ministerialservant')}</TableCell>
                  <TableCell><Input type="number" value={ministerialServant.sortOrder} min={0} onChange={e => handleAppointmentSortOrder('MINISTERIALSERVANT', e.target.value)} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Switch color="blue" checked={specialPioneer.active} onChange={() => handleAppointmentActive('SPECIALPIONEER')} /></TableCell>
                  <TableCell>{t('appointment.specialpioneer')}</TableCell>
                  <TableCell><Input type="number" value={specialPioneer.sortOrder} min={0} onChange={e => handleAppointmentSortOrder('SPECIALPIONEER', e.target.value)} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Switch color="blue" checked={pioneer.active} onChange={() => handleAppointmentActive('PIONEER')} /></TableCell>
                  <TableCell>{t('appointment.pioneer')}</TableCell>
                  <TableCell><Input type="number" value={pioneer.sortOrder} min={0} onChange={e => handleAppointmentSortOrder('PIONEER', e.target.value)} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Switch color="blue" checked={auxiliary.active} onChange={() => handleAppointmentActive('AUXILIARY')} /></TableCell>
                  <TableCell>{t('appointment.auxiliary')}</TableCell>
                  <TableCell><Input type="number" value={auxiliary.sortOrder} min={0} onChange={e => handleAppointmentSortOrder('AUXILIARY', e.target.value)} /></TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="mt-2 flex w-full justify-end">
              <Button color="blue" type="button" onClick={saveOrganization}>
                {t('button.save')}
              </Button>
            </div>
          </div>

          <Divider className="block md:col-span-2 md:hidden" />

          <div className="bg-zinc-800 p-4">
            <Heading className="mt-0">{t('label.preview')}</Heading>
            <Table dense grid className="mb-4 !text-xs">
              <TableBody>
                {organization?.responsibilities.map((r) => {
                  if (!r.active) {
                    return null
                  }

                  const names = getPublishersWithResponsibility(publishers, responsibilities.find(resp => resp.name === r.type)?._id)

                  return (
                    <TableRow key={r.type}>
                      <TableCell className="font-bold">{t(r.type)}</TableCell>
                      <TableCell colSpan={2}>{names.map(n => `${n.firstname} ${n.lastname}`).join(', ')}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <Table dense grid className="my-4 !text-xs">
              <TableHead>
                <TableRow>
                  <TableHeader>{t('label.task')}</TableHeader>
                  <TableHeader>{t('label.manager')}</TableHeader>
                  <TableHeader>{t('label.assistant')}</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {organization?.tasks.map((task) => {
                  const managers  = getPublishersWithTask(publishers, task.manager)
                  const assitants = getPublishersWithTask(publishers, task.assistant)

                  if (!managers.length) {
                    return null
                  }

                  return (
                    <TableRow key={task.type}>
                      <TableCell className="font-bold">{t(tasks.find(resp => resp._id === task.type)?.name || '')}</TableCell>
                      <TableCell className="text-wrap">{managers.map(n => `${n.firstname} ${n.lastname}`).join(', ')}</TableCell>
                      <TableCell className="text-wrap">{assitants.map(n => `${n.firstname} ${n.lastname}`).join(', ')}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <Table dense grid className="mt-4 !text-xs">
              <TableBody>
                {organization?.appointments.map((a) => {
                  if (!a.active) {
                    return null
                  }

                  const names = getPublishersWithAppointment(publishers, a.type)

                  if (!names.length) {
                    return null
                  }

                  return (
                    <TableRow key={a.type}>
                      <TableCell className="font-bold">{t(`appointment.${a.type.toLowerCase()}`)}</TableCell>
                      <TableCell className="text-wrap" colSpan={2}>{names.map(n => `${n.firstname} ${n.lastname}`).join(', ')}</TableCell>
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

Organization.displayName = 'Organization'
