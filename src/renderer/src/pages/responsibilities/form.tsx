import { useForm }                                     from 'react-hook-form'
import { useTranslation }                              from 'react-i18next'
import { useNavigate, useParams }                      from 'react-router-dom'
import type { ResponsibilityModel, ServiceGroupModel } from 'src/types/models'
import { Field }                                       from '@renderer/components/Field'
import classNames                                      from '@renderer/utils/classNames'
import { useEffect, useState }                         from 'react'
import ROUTES                                          from '../../constants/routes.json'

export default function ResponsibilityForm(): JSX.Element {
  const { t }    = useTranslation()
  const { id }   = useParams()
  const navigate = useNavigate()

  const [responsibility, setResponsibility] = useState<ResponsibilityModel>()

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<ResponsibilityModel>({ defaultValues: {}, mode: 'onSubmit' })

  const onSubmit = (data: ServiceGroupModel): void => {
    if (data._id) {
      window.electron.ipcRenderer.invoke('update-responsibility', data).then(() => {
        navigate(ROUTES.RESPONSIBILITIES)
      })
    }
    else {
      window.electron.ipcRenderer.invoke('create-responsibility', data).then(() => {
        navigate(ROUTES.RESPONSIBILITIES)
      })
    }
  }

  useEffect(() => {
    if (id) {
      window.electron.ipcRenderer
        .invoke('get-responsibility', id)
        .then((result: ResponsibilityModel) => {
          setValue('_id', result._id)
          setValue('name', result.name)
          setValue('default', result.default)
          setResponsibility(result)
        })
    }
  }, [id])

  if (id && !responsibility) {
    // !This is a workaround wait for the responsibility to be loaded
    return <div />
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1>{id ? t('responisbilities.editHeadline') : t('responisbilities.addHeadline')}</h1>
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
                  'input w-full input-bordered',
                )}
                {...register('name', {
                  required: t('errors.name.required'),
                })}
              />
            </Field>
          </div>

          <div className="col-span-6 col-start-1 mt-2 flex justify-between">
            <button
              className="btn btn-secondary"
              onClick={(): void => navigate(ROUTES.RESPONSIBILITIES)}
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
