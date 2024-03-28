import { useNavigate, useParams }                 from 'react-router-dom'
import { useForm }                                from 'react-hook-form'
import { useTranslation }                         from 'react-i18next'
import { ChevronRightIcon }                       from '@heroicons/react/24/solid'
import { usePublisherState }                      from '@renderer/store/publisherStore'
import type { PublisherModel, ServiceGroupModel } from 'src/types/models'
import { Field }                                  from '@renderer/components/Field'
import classNames                                 from '@renderer/utils/classNames'
import { useEffect, useState }                    from 'react'
import ROUTES                                     from '../../constants/routes.json'

export default function PublisherPersonalForm(): JSX.Element {
  const { t }          = useTranslation()
  const { id }         = useParams()
  const navigate       = useNavigate()
  const publisherState = usePublisherState()

  const [publisher, setPublisher]         = useState<PublisherModel>(publisherState.publisher)
  const [serviceGroups, setServiceGroups] = useState<ServiceGroupModel[]>([])

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<PublisherModel>({ defaultValues: publisherState.publisher, mode: 'onSubmit' })

  const saveData = (data: PublisherModel): void => {
    publisherState.setPublisher({ ...publisherState.publisher, ...data })
    navigate(ROUTES.PUBLISHER_CONTACT_FORM)
  }

  const abort = (): void => {
    publisherState.delete()
    navigate(ROUTES.PUBLISHERS)
  }

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-serviceGroups').then((result: ServiceGroupModel[]) => {
      setServiceGroups(result)
    })
  }, [])

  useEffect(() => {
    if (id) {
      window.electron.ipcRenderer.invoke('get-publisher', id).then((result: PublisherModel) => {
        reset(result)
        setPublisher(result)
      })
    }
  }, [id])

  if (id && !publisher) {
    // !This is a workaround wait for the publisher to be loaded
    return <div />
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
          <li className="step">{t('publishers.step.contact')}</li>
          <li className="step">{t('publishers.step.appointments')}</li>
          <li className="step">{t('publishers.step.other')}</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit(saveData)}>
        <div className="mx-auto grid w-10/12 grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
          {/* FIRSTNAME */}
          <div className="sm:col-span-3">
            <Field label={t('label.firstname')} error={errors.firstname?.message}>
              <input
                id="firstname"
                placeholder={t('label.firstname')}
                className={classNames(
                  errors.firstname ? 'input-error' : '',
                  'input w-full input-bordered dark:placeholder:text-slate-500',
                )}
                {...register('firstname', {
                  required: t('errors.firstname.required'),
                })}
              />
            </Field>
          </div>

          {/* LASTNAME */}
          <div className="sm:col-span-3">
            <Field label={t('label.lastname')} error={errors.lastname?.message}>
              <input
                id="lastname"
                placeholder={t('label.lastname')}
                className={classNames(
                  errors.lastname ? 'input-error' : '',
                  'input w-full input-bordered dark:placeholder:text-slate-500',
                )}
                {...register('lastname', {
                  required: t('errors.lastname.required'),
                })}
              />
            </Field>
          </div>

          {/* BIRTDAY */}
          <div className="sm:col-span-3">
            <Field label={t('label.birthday')}>
              <input
                id="birthday"
                type="date"
                placeholder={t('label.birthday')}
                className={classNames(
                  errors.birthday ? 'input-error' : '',
                  'input w-full input-bordered dark:placeholder:text-slate-500',
                )}
                {...register('birthday', { required: false })}
              />
            </Field>
          </div>

          {/* GENDER */}
          <div className="sm:col-span-3">
            <Field label={t('label.gender')}>
              <div className="flex h-12 items-center space-x-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      {...register('gender')}
                      type="radio"
                      value="MAN"
                      className="radio-primary radio"
                      name="gender"
                    />

                    <span className="label-text ml-2">{t('label.man')}</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      {...register('gender')}
                      type="radio"
                      value="WOMAN"
                      className="radio-primary radio"
                      name="gender"
                    />
                    <span className="label-text ml-2">{t('label.woman')}</span>
                  </label>
                </div>
              </div>
            </Field>
          </div>

          {/* BAPTSED */}
          <div className="sm:col-span-2">
            <Field label={t('label.baptised')}>
              <input
                {...register('baptised', { required: false })}
                id="baptised"
                type="date"
                placeholder={t('label.baptised')}
                className={classNames(
                  errors.baptised ? 'input-error' : '',
                  'input w-full input-bordered dark:placeholder:text-slate-500',
                )}
              />
            </Field>
          </div>

          {/* UNKNOWN BAPTSED */}
          <div className="sm:col-span-1">
            <Field label="&nbsp;">
              <div className="flex h-12 items-center space-x-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      {...register('unknown_baptised')}
                      type="checkbox"
                      className="checkbox-primary checkbox"
                    />
                    <span className="label-text ml-2">{t('label.unknown_baptised')}</span>
                  </label>
                </div>
              </div>
            </Field>
          </div>

          {/* HOPE */}
          <div className="sm:col-span-2">
            <Field label={t('label.hope')}>
              <div className="flex h-12 items-center space-x-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      {...register('hope')}
                      type="radio"
                      value="OTHER_SHEEP"
                      className="radio-primary radio"
                      name="hope"
                    />

                    <span className="label-text ml-2">{t('label.other_sheep')}</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      {...register('hope')}
                      type="radio"
                      value="ANOINTED"
                      className="radio-primary radio"
                      name="hope"
                    />
                    <span className="label-text ml-2">{t('label.anointed')}</span>
                  </label>
                </div>
              </div>
            </Field>
          </div>

          {/* STATUS */}
          <div className="sm:col-span-1">
            <Field label={t('label.status')}>
              <select
                className={classNames(
                  errors.status ? 'select-error' : '',
                  'select select-bordered w-full',
                )}
                {...register('status')}
              >
                <option value="ACTIVE">{t('status.active')}</option>
                <option value="IRREGULAR">{t('status.irregular')}</option>
                <option value="INACTIVE">{t('status.inactive')}</option>
              </select>
            </Field>
          </div>

          {/* S290 */}
          <div className="sm:col-span-3">
            <Field label={t('label.forms')}>
              <div className="flex h-12 items-center space-x-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      {...register('s290')}
                      type="checkbox"
                      className="checkbox-primary checkbox"
                    />
                    <span className="label-text ml-2">{t('label.s290')}</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      {...register('registerCard')}
                      type="checkbox"
                      className="checkbox-primary checkbox"
                    />
                    <span className="label-text ml-2">{t('label.registerCard')}</span>
                  </label>
                </div>
              </div>
            </Field>
          </div>

          {/* Service groups */}
          <div className="sm:col-span-3">
            <Field label={t('label.serviceGroup')} error={errors.serviceGroupId?.message}>
              <select
                className={classNames(
                  errors.serviceGroupId ? 'select-error' : '',
                  'select select-bordered w-full',
                )}
                {...register('serviceGroupId', {
                  required: t('errors.serviceGroupId.required'),
                })}
              >
                <option value="">{t('label.selectServiceGroup')}</option>
                {serviceGroups.map((sg) => {
                  return (
                    <option key={sg._id} value={sg._id}>
                      {sg.name}
                    </option>
                  )
                })}
              </select>
            </Field>
          </div>

          {/* DISABILITY */}
          <div className="sm:col-span-3">
            <Field label={t('label.disabilities')}>
              <div className="flex h-12 items-center space-x-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      {...register('deaf')}
                      type="checkbox"
                      className="checkbox-primary checkbox"
                    />
                    <span className="label-text ml-2">{t('label.deaf')}</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      {...register('blind')}
                      type="checkbox"
                      className="checkbox-primary checkbox"
                    />
                    <span className="label-text ml-2">{t('label.blind')}</span>
                  </label>
                </div>
              </div>
            </Field>
          </div>

          <div className="col-span-6 col-start-1 mt-2 flex justify-between">
            <button className="btn btn-secondary" onClick={(): void => abort()}>
              {t('button.abort')}
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
