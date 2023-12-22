import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { ResponsibilityModel, TaskModel } from 'src/types/models'
import ROUTES from '../../constants/routes.json'
import { Field } from '@renderer/components/Field'
import classNames from '@renderer/utils/classNames'
import { useEffect, useState } from 'react'

export default function TaskForm(): JSX.Element {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  const [responisbilities, setResponsibilities] = useState<ResponsibilityModel[]>([])
  const [task, setTask] = useState<TaskModel>()

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue
  } = useForm<TaskModel>({ defaultValues: {}, mode: 'onSubmit' })

  const onSubmit = (data: TaskModel): void => {
    if (data._id) {
      window.electron.ipcRenderer.invoke('update-task', data).then(() => {
        navigate(ROUTES.TASKS)
      })
    } else {
      window.electron.ipcRenderer.invoke('create-task', data).then(() => {
        navigate(ROUTES.TASKS)
      })
    }
  }

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-responsibilities')
      .then((result: ResponsibilityModel[]) => {
        const parsedResult = result.map((resp) => {
          return { ...resp, name: resp.default ? t(resp.name) : resp.name }
        })

        setResponsibilities(
          parsedResult.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
        )
      })
  }, [])

  useEffect(() => {
    if (id) {
      window.electron.ipcRenderer.invoke('get-task', id).then((result: TaskModel) => {
        setValue('_id', result._id)
        setValue('name', result.name)
        setValue('responsibilityId', result.responsibilityId)
        setValue('default', result.default)
        setTask(result)
      })
    }
  }, [id])

  if (id && !task) {
    // !This is a workaround wait for the task to be loaded
    return <div />
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1>{id ? t('tasks.editHeadline') : t('tasks.addHeadline')}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto grid w-10/12 grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
          {/* Name */}
          <div className="sm:col-span-3">
            <Field label={t('label.name')} error={errors.name?.message}>
              <input
                id="name"
                placeholder={t('label.name')}
                className={classNames(
                  errors.name ? 'input-error' : '',
                  'input w-full input-bordered'
                )}
                {...register('name', {
                  required: t('errors.name.required')
                })}
              />
            </Field>
          </div>

          {/* Responsibility */}
          <div className="sm:col-span-3">
            <Field label={t('label.responsibility')} error={errors.responsibilityId?.message}>
              <select
                className={classNames(
                  errors.responsibilityId ? 'select-error' : '',
                  'select select-bordered w-full'
                )}
                {...register('responsibilityId', {
                  required: t('errors.responsibleId.required')
                })}
              >
                <option value="">{t('label.selectResponsibility')}</option>
                {responisbilities.map((r) => {
                  return (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  )
                })}
              </select>
            </Field>
          </div>

          <div className="col-span-6 col-start-1 mt-2 flex justify-between">
            <button className="btn btn-secondary" onClick={(): void => navigate(ROUTES.TASKS)}>
              {t('button.abort')}
            </button>
            <button className="btn btn-primary" type="submit">
              {t('button.save')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
