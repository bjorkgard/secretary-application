import { useEffect, useState }                                  from 'react'
import { useNavigate }                                          from 'react-router-dom'
import { Controller, useFieldArray, useForm }                   from 'react-hook-form'
import { useTranslation }                                       from 'react-i18next'
import { ChevronLeftIcon, ChevronRightIcon }                    from '@heroicons/react/24/solid'
import { usePublisherState }                                    from '@renderer/store/publisherStore'
import type { PublisherModel, ResponsibilityModel, TaskModel }  from 'src/types/models'
import { Field, Label }                                         from '@renderer/components/catalyst/fieldset'
import { Heading }                                              from '@renderer/components/catalyst/heading'
import { Button }                                               from '@renderer/components/catalyst/button'
import { Checkbox, CheckboxField, CheckboxGroup }               from '@renderer/components/catalyst/checkbox'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@renderer/components/catalyst/description-list'
import { Input }                                                from '@renderer/components/catalyst/input'
import ROUTES                                                   from '../../constants/routes.json'
import Progress                                                 from './components/progress'

export default function PublisherAppointmentForm(): JSX.Element {
  const { t }          = useTranslation()
  const navigate       = useNavigate()
  const publisherState = usePublisherState()

  const [dbResponsibilities, setResponsibilities] = useState<ResponsibilityModel[]>([])
  const [tasks, setTasks]                         = useState<TaskModel[]>([])

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

    window.electron.ipcRenderer.invoke('get-tasks').then((result: TaskModel[]) => {
      const parsedResult = result.map((resp) => {
        return { ...resp, name: resp.default ? t(resp.name) : resp.name }
      })

      setTasks(parsedResult.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)))
    })
  }, [])

  const { control, handleSubmit, register, setValue, watch } = useForm<PublisherModel>({
    defaultValues: publisherState.publisher,
  })

  useFieldArray({
    control,
    name: 'appointments', // unique name for your Field Array
  })

  const watchAppointments = watch('appointments')
  const formData          = watch()

  const quickSave = (): void => {
    const updatedPublisher = { ...publisherState.publisher, ...formData }

    window.electron.ipcRenderer.invoke('update-publisher', updatedPublisher).then(() => {
      window.Notification.requestPermission().then(() => {
        // eslint-disable-next-line no-new
        new window.Notification('SECRETARY', {
          body: t('publishers.notification.updated'),
        })
      })
      publisherState.delete()
      navigate(ROUTES.PUBLISHERS)
    })
  }

  const saveData = (data: PublisherModel): void => {
    data.appointments = data.appointments?.filter(appointment => appointment.type)

    publisherState.setPublisher({ ...publisherState.publisher, ...data })
    navigate(ROUTES.PUBLISHER_OTHER_FORM)
  }

  return (
    <div>
      <div className="flex justify-between">
        <Heading>
          {publisherState.publisher._id
            ? t('publishers.editHeadline')
            : t('publishers.addHeadline')}
        </Heading>
      </div>
      <Progress step="APPOINTMENTS" />
      <form onSubmit={handleSubmit(saveData)}>
        <div className="mx-auto grid w-10/12 grid-cols-1 gap-y-6 sm:grid-cols-6">
          {/* RESPONSIBILITIES */}
          <Field className="sm:col-span-6">
            <Label>{t('label.responsibilities')}</Label>
            <CheckboxGroup className="flex items-center">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {dbResponsibilities.map(responsibility => (
                  <Controller
                    name="responsibilities"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CheckboxField className="!gap-x-2">
                        <Checkbox
                          color="blue"
                          checked={value.includes(responsibility._id || '')}
                          onChange={() => {
                            if (value.includes(responsibility._id || '')) {
                              onChange(value.filter((v: string) => v !== responsibility._id))
                            }
                            else {
                              onChange([...value, responsibility._id || ''])
                            }
                          }}
                        />
                        <Label>
                          {responsibility.name}
                        </Label>
                      </CheckboxField>
                    )}
                  />
                ))}
              </div>
            </CheckboxGroup>
          </Field>

          {/* TASKS */}
          <Field className="sm:col-span-6">
            <Label>{t('label.tasks')}</Label>
            <CheckboxGroup className="flex items-center">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {tasks.map(task => (
                  <Controller
                    name="tasks"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CheckboxField className="!gap-x-2">
                        <Checkbox
                          color="blue"
                          checked={value.includes(task._id || '')}
                          onChange={() => {
                            if (value.includes(task._id || '')) {
                              onChange(value.filter((v: string) => v !== task._id))
                            }
                            else {
                              onChange([...value, task._id || ''])
                            }
                          }}
                        />
                        <Label>{task.name}</Label>
                      </CheckboxField>
                    )}
                  />
                ))}
              </div>
            </CheckboxGroup>
          </Field>

          {!publisherState.publisher._id && (
            <Field className="col-span-6 xl:col-span-2">
              <Label>{t('label.appointments')}</Label>
              <DescriptionList>
                <DescriptionTerm>
                  <Controller
                    name="appointments.0.type"
                    control={control}
                    render={({ field: { value } }) => (
                      <CheckboxField>
                        <Checkbox
                          color="blue"
                          value={value}
                          checked={!!watchAppointments?.find(a => a.type === 'PIONEER')}
                          onChange={() => {
                            if (watchAppointments?.find(a => a.type === 'PIONEER')) {
                              setValue('appointments.0.type', '')
                            }
                            else {
                              setValue('appointments.0.type', 'PIONEER')
                            }
                          }}
                        />
                        <Label>{t('appointment.pioneer')}</Label>
                      </CheckboxField>
                    )}
                  />
                </DescriptionTerm>
                <DescriptionDetails>
                  <Input
                    className="w-44"
                    type="date"
                    {...register('appointments.0.date')}
                    disabled={
                      !watchAppointments?.find(a => a.type === 'PIONEER')
                    }
                    onChange={(e) => {
                      setValue('appointments.0.date', e.target.value)
                    }}
                  />
                </DescriptionDetails>
                <DescriptionTerm>
                  <Controller
                    name="appointments.1.type"
                    control={control}
                    render={({ field: { value } }) => (
                      <CheckboxField>
                        <Checkbox
                          color="blue"
                          value={value}
                          checked={!!watchAppointments?.find(a => a.type === 'SPECIALPIONEER')}
                          onChange={() => {
                            if (watchAppointments?.find(a => a.type === 'SPECIALPIONEER')) {
                              setValue('appointments.1.type', '')
                            }
                            else {
                              setValue('appointments.1.type', 'SPECIALPIONEER')
                            }
                          }}
                        />
                        <Label>{t('appointment.specialpioneer')}</Label>
                      </CheckboxField>
                    )}
                  />
                </DescriptionTerm>
                <DescriptionDetails>
                  <Input
                    className="w-44"
                    type="date"
                    {...register('appointments.1.date' as const)}
                    disabled={
                      !watchAppointments?.find(a => a.type === 'SPECIALPIONEER')
                    }
                    onChange={(e) => {
                      setValue('appointments.1.date', e.target.value)
                    }}
                  />
                </DescriptionDetails>
                <DescriptionTerm>
                  <Controller
                    name="appointments.2.type"
                    control={control}
                    render={({ field: { value } }) => (
                      <CheckboxField>
                        <Checkbox
                          color="blue"
                          value={value}
                          checked={!!watchAppointments?.find(a => a.type === 'MISSIONARY')}
                          onChange={() => {
                            if (watchAppointments?.find(a => a.type === 'MISSIONARY')) {
                              setValue('appointments.2.type', '')
                            }
                            else {
                              setValue('appointments.2.type', 'MISSIONARY')
                            }
                          }}
                        />
                        <Label>{t('appointment.missionary')}</Label>
                      </CheckboxField>
                    )}
                  />
                </DescriptionTerm>
                <DescriptionDetails>
                  <Input
                    className="w-44"
                    type="date"
                    {...register('appointments.2.date' as const)}
                    disabled={
                      !watchAppointments?.find(a => a.type === 'MISSIONARY')
                    }
                    onChange={(e) => {
                      setValue('appointments.2.date', e.target.value)
                    }}
                  />
                </DescriptionDetails>
                <DescriptionTerm>
                  <Controller
                    name="appointments.3.type"
                    control={control}
                    render={({ field: { value } }) => (
                      <CheckboxField>
                        <Checkbox
                          color="blue"
                          value={value}
                          checked={!!watchAppointments?.find(a => a.type === 'CIRCUITOVERSEER')}
                          onChange={() => {
                            if (watchAppointments?.find(a => a.type === 'CIRCUITOVERSEER')) {
                              setValue('appointments.3.type', '')
                            }
                            else {
                              setValue('appointments.3.type', 'CIRCUITOVERSEER')
                            }
                          }}
                        />
                        <Label>{t('appointment.circuitoverseer')}</Label>
                      </CheckboxField>
                    )}
                  />
                </DescriptionTerm>
                <DescriptionDetails>
                  <Input
                    className="w-44"
                    type="date"
                    {...register('appointments.3.date' as const)}
                    disabled={
                      !watchAppointments?.find(a => a.type === 'CIRCUITOVERSEER')
                    }
                    onChange={(e) => {
                      setValue('appointments.3.date', e.target.value)
                    }}
                  />
                </DescriptionDetails>
                <DescriptionTerm>
                  <Controller
                    name="appointments.4.type"
                    control={control}
                    render={({ field: { value } }) => (
                      <CheckboxField>
                        <Checkbox
                          color="blue"
                          value={value}
                          checked={!!watchAppointments?.find(a => a.type === 'ELDER')}
                          onChange={() => {
                            if (watchAppointments?.find(a => a.type === 'ELDER')) {
                              setValue('appointments.4.type', '')
                            }
                            else {
                              setValue('appointments.4.type', 'ELDER')
                            }
                          }}
                        />
                        <Label>{t('appointment.elder')}</Label>
                      </CheckboxField>
                    )}
                  />
                </DescriptionTerm>
                <DescriptionDetails>
                  <Input
                    className="w-44"
                    type="date"
                    {...register('appointments.4.date' as const)}
                    disabled={
                      !watchAppointments?.find(a => a.type === 'ELDER')
                    }
                    onChange={(e) => {
                      setValue('appointments.4.date', e.target.value)
                    }}
                  />
                </DescriptionDetails>
                <DescriptionTerm>
                  <Controller
                    name="appointments.5.type"
                    control={control}
                    render={({ field: { value } }) => (
                      <CheckboxField>
                        <Checkbox
                          color="blue"
                          value={value}
                          checked={!!watchAppointments?.find(a => a.type === 'MINISTERIALSERVANT')}
                          onChange={() => {
                            if (watchAppointments?.find(a => a.type === 'MINISTERIALSERVANT')) {
                              setValue('appointments.5.type', '')
                            }
                            else {
                              setValue('appointments.5.type', 'MINISTERIALSERVANT')
                            }
                          }}
                        />
                        <Label>{t('appointment.ministerialservant')}</Label>
                      </CheckboxField>
                    )}
                  />
                </DescriptionTerm>
                <DescriptionDetails>
                  <Input
                    className="w-44"
                    type="date"
                    {...register('appointments.5.date' as const)}
                    disabled={
                      !watchAppointments?.find(a => a.type === 'MINISTERIALSERVANT')
                    }
                    onChange={(e) => {
                      setValue('appointments.5.date', e.target.value)
                    }}
                  />
                </DescriptionDetails>
              </DescriptionList>
            </Field>
          )}

          <div className="col-span-6 col-start-1 mt-2 flex justify-between">
            <Button
              outline
              onClick={(): void => navigate(ROUTES.PUBLISHER_CONTACT_FORM)}
            >
              <ChevronLeftIcon className="size-5" />
              {t('button.back')}
            </Button>
            {
              publisherState.publisher._id
              && (
                <Button color="indigo" onClick={(): void => quickSave()}>
                  {t('button.save')}
                </Button>
              )
            }
            <Button color="blue" type="submit">
              {t('button.next')}
              <ChevronRightIcon className="size-5" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
