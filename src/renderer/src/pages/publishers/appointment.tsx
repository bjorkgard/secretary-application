import { useEffect, useState }                                 from 'react'
import { useNavigate }                                         from 'react-router-dom'
import { useFieldArray, useForm }                              from 'react-hook-form'
import { useTranslation }                                      from 'react-i18next'
import { ChevronLeftIcon, ChevronRightIcon }                   from '@heroicons/react/24/solid'
import { usePublisherState }                                   from '@renderer/store/publisherStore'
import { Field }                                               from '@renderer/components/Field'
import type { PublisherModel, ResponsibilityModel, TaskModel } from 'src/types/models'
import ROUTES                                                  from '../../constants/routes.json'

export default function PublisherAppointmentForm(): JSX.Element {
  const { t }          = useTranslation()
  const navigate       = useNavigate()
  const publisherState = usePublisherState()

  const [responsibilities, setResponsibilities] = useState<ResponsibilityModel[]>([])
  const [tasks, setTasks]                       = useState<TaskModel[]>([])

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

  const { control, handleSubmit, register, watch } = useForm<PublisherModel>({
    defaultValues: publisherState.publisher,
  })

  useFieldArray({
    control,
    name: 'appointments', // unique name for your Field Array
  })

  const watchAppointments = watch('appointments')

  const saveData = (data: PublisherModel): void => {
    data.appointments = data.appointments?.filter(appointment => appointment.type)

    publisherState.setPublisher({ ...publisherState.publisher, ...data })
    navigate(ROUTES.PUBLISHER_OTHER_FORM)
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1>
          {publisherState.publisher._id
            ? t('publishers.editHeadline')
            : t('publishers.addHeadline')}
        </h1>
      </div>
      <div className="w-full">
        <ul className="steps w-full">
          <li className="step step-primary">{t('publishers.step.personal')}</li>
          <li className="step step-primary">{t('publishers.step.contact')}</li>
          <li className="step step-primary">{t('publishers.step.appointments')}</li>
          <li className="step">{t('publishers.step.other')}</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit(saveData)}>
        <div className="mx-auto grid w-10/12 grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
          {/* RESPONSIBILITIES */}
          <div className="sm:col-span-6">
            <Field label={t('label.responsibilities')}>
              <div className="flex flex-wrap items-center">
                {responsibilities.map((responsibility) => {
                  return (
                    <label key={responsibility._id} className="label mr-4 cursor-pointer">
                      <input
                        {...register('responsibilities')}
                        type="checkbox"
                        value={responsibility._id}
                        className="checkbox-primary checkbox"
                        name="responsibilities"
                      />
                      <span className="label-text ml-2">{responsibility.name}</span>
                    </label>
                  )
                })}
              </div>
            </Field>
          </div>

          {/* TASKS */}
          <div className="sm:col-span-6">
            <Field label={t('label.tasks')}>
              <div className="flex flex-wrap items-center">
                {tasks.map((task) => {
                  return (
                    <label key={task._id} className="label mr-4 cursor-pointer">
                      <input
                        {...register('tasks')}
                        type="checkbox"
                        value={task._id}
                        className="checkbox-primary checkbox"
                        name="tasks"
                      />
                      <span className="label-text ml-2">{task.name}</span>
                    </label>
                  )
                })}
              </div>
            </Field>
          </div>

          {!publisherState.publisher._id && (
            <div className="sm:col-span-6">
              <Field label={t('label.appointments')}>
                <dl className="my-0 py-0">
                  <div className="mb-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="mt-0">
                      <label className="label mr-4 cursor-pointer justify-start">
                        <input
                          {...register('appointments.0.type' as const)}
                          type="checkbox"
                          value="PIONEER"
                          className="checkbox-primary checkbox"
                        />

                        <span className="label-text ml-2">{t('appointment.pioneer')}</span>
                      </label>
                    </dt>
                    <dd className="sm:col-span-2 sm:mt-0">
                      <input
                        {...register('appointments.0.date' as const, { required: false })}
                        type="date"
                        className="input input-bordered w-48"
                        disabled={
                          !watchAppointments?.find(a => a.type === 'PIONEER')
                        }
                      />
                    </dd>
                  </div>
                  <div className="mb-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="mt-0">
                      <label className="label mr-4 cursor-pointer justify-start">
                        <input
                          {...register('appointments.1.type' as const)}
                          type="checkbox"
                          value="SPECIALPIONEER"
                          className="checkbox-primary checkbox"
                        />

                        <span className="label-text ml-2">{t('appointment.specialpioneer')}</span>
                      </label>
                    </dt>
                    <dd className="sm:col-span-2 sm:mt-0">
                      <input
                        {...register('appointments.1.date' as const, { required: false })}
                        type="date"
                        className="input input-bordered w-48"
                        disabled={
                          !watchAppointments?.find(a => a.type === 'SPECIALPIONEER')
                        }
                      />
                    </dd>
                  </div>
                  <div className="mb-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="mt-0">
                      <label className="label mr-4 cursor-pointer justify-start">
                        <input
                          {...register('appointments.2.type' as const)}
                          type="checkbox"
                          value="MISSIONARY"
                          className="checkbox-primary checkbox"
                        />

                        <span className="label-text ml-2">{t('appointment.missionary')}</span>
                      </label>
                    </dt>
                    <dd className="sm:col-span-2 sm:mt-0">
                      <input
                        {...register('appointments.2.date' as const, { required: false })}
                        type="date"
                        className="input input-bordered w-48"
                        disabled={
                          !watchAppointments?.find(a => a.type === 'MISSIONARY')
                        }
                      />
                    </dd>
                  </div>
                  <div className="mb-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="mt-0">
                      <label className="label mr-4 cursor-pointer justify-start">
                        <input
                          {...register('appointments.3.type' as const)}
                          type="checkbox"
                          value="CIRCUITOVERSEER"
                          className="checkbox-primary checkbox"
                        />

                        <span className="label-text ml-2">{t('appointment.circuitoverseer')}</span>
                      </label>
                    </dt>
                    <dd className="sm:col-span-2 sm:mt-0">
                      <input
                        {...register('appointments.3.date' as const, { required: false })}
                        type="date"
                        className="input input-bordered w-48"
                        disabled={
                          !watchAppointments?.find(a => a.type === 'CIRCUITOVERSEER')
                        }
                      />
                    </dd>
                  </div>
                  <div className="mb-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="mt-0">
                      <label className="label mr-4 cursor-pointer justify-start">
                        <input
                          {...register('appointments.4.type' as const)}
                          type="checkbox"
                          value="ELDER"
                          className="checkbox-primary checkbox"
                        />

                        <span className="label-text ml-2">{t('appointment.elder')}</span>
                      </label>
                    </dt>
                    <dd className="sm:col-span-2 sm:mt-0">
                      <input
                        {...register('appointments.4.date' as const, { required: false })}
                        type="date"
                        className="input input-bordered w-48"
                        disabled={!watchAppointments?.find(a => a.type === 'ELDER')}
                      />
                    </dd>
                  </div>
                  <div className="mb-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="mt-0">
                      <label className="label mr-4 cursor-pointer justify-start">
                        <input
                          {...register('appointments.5.type' as const)}
                          type="checkbox"
                          value="MINISTERIALSERVANT"
                          className="checkbox-primary checkbox"
                        />

                        <span className="label-text ml-2">
                          {t('appointment.ministerialservant')}
                        </span>
                      </label>
                    </dt>
                    <dd className="sm:col-span-2 sm:mt-0">
                      <input
                        {...register('appointments.5.date' as const, { required: false })}
                        type="date"
                        className="input input-bordered w-48"
                        disabled={
                          !watchAppointments?.find(a => a.type === 'MINISTERIALSERVANT')
                        }
                      />
                    </dd>
                  </div>
                </dl>
              </Field>
            </div>
          )}

          <div className="col-span-6 col-start-1 mt-2 flex justify-between">
            <button
              className="btn btn-accent"
              onClick={(): void => navigate(ROUTES.PUBLISHER_CONTACT_FORM)}
            >
              <ChevronLeftIcon className="size-5" />
              {t('button.back')}
            </button>
            <button className="btn btn-primary" type="submit">
              {t('button.next')}
              <ChevronRightIcon className="size-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
