import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { PublisherModel, ServiceGroupModel } from 'src/types/models'
import ROUTES from '../../constants/routes.json'
import { Field } from '@renderer/components/Field'
import classNames from '@renderer/utils/classNames'
import { useEffect, useState } from 'react'

export default function ServiceGroupForm(): JSX.Element {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  const [publishers, setPublishers] = useState<PublisherModel[]>([])
  const [serviceGroup, setServiceGroup] = useState<ServiceGroupModel>()

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue
  } = useForm<ServiceGroupModel>({ defaultValues: {}, mode: 'onSubmit' })

  const onSubmit = (data: ServiceGroupModel): void => {
    if (data._id) {
      window.electron.ipcRenderer.invoke('update-serviceGroup', data).then(() => {
        navigate(ROUTES.SERVICE_GROUPS)
      })
    } else {
      window.electron.ipcRenderer.invoke('create-serviceGroup', data).then(() => {
        navigate(ROUTES.SERVICE_GROUPS)
      })
    }
  }

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-publishers', { sortField: 'lastname', queryString: '' })
      .then((result: PublisherModel[]) => {
        setPublishers(result)
      })
  }, [])

  useEffect(() => {
    if (id) {
      window.electron.ipcRenderer
        .invoke('get-serviceGroup', id)
        .then((result: ServiceGroupModel) => {
          setValue('_id', result._id)
          setValue('name', result.name)
          setValue('responsibleId', result.responsibleId)
          setValue('assistantId', result.assistantId)
          setServiceGroup(result)
        })
    }
  }, [id])

  if (id && !serviceGroup) {
    // !This is a workaround wait for the serviceGroup to be loaded
    return <div />
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1>{id ? t('serviceGroups.editHeadline') : t('serviceGroups.addHeadline')}</h1>
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

          {/* Responsible */}
          <div className="!col-start-1 sm:col-span-3">
            <Field label={t('label.responsible')} error={errors.responsibleId?.message}>
              <select
                className={classNames(
                  errors.responsibleId ? 'select-error' : '',
                  'select select-bordered w-full'
                )}
                {...register('responsibleId')}
              >
                <option value="">{t('label.selectResponsible')}</option>
                {publishers.map((p) => {
                  return (
                    <option key={p._id} value={p._id}>
                      {p.lastname}, {p.firstname}
                    </option>
                  )
                })}
              </select>
            </Field>
          </div>

          {/* Responsible */}
          <div className="sm:col-span-3">
            <Field label={t('label.assistant')} error={errors.assistantId?.message}>
              <select
                className={classNames(
                  errors.assistantId ? 'select-error' : '',
                  'select select-bordered w-full'
                )}
                {...register('assistantId')}
              >
                <option value="">{t('label.selectAssistant')}</option>
                {publishers.map((p) => {
                  return (
                    <option key={p._id} value={p._id}>
                      {p.lastname}, {p.firstname}
                    </option>
                  )
                })}
              </select>
            </Field>
          </div>

          <div className="col-span-6 col-start-1 mt-2 flex justify-between">
            <button
              className="btn btn-secondary"
              onClick={(): void => navigate(ROUTES.SERVICE_GROUPS)}
            >
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
