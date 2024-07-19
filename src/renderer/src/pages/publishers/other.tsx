import { useNavigate }            from 'react-router-dom'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation }         from 'react-i18next'
import { TrashIcon }              from '@heroicons/react/20/solid'
import { ChevronLeftIcon }        from '@heroicons/react/24/solid'
import { usePublisherState }      from '@renderer/store/publisherStore'
import type { PublisherModel }    from 'src/types/models'
import { Field }                  from '@renderer/components/Field'
import classNames                 from '@renderer/utils/classNames'
import ROUTES                     from '../../constants/routes.json'

export default function PublisherOtherForm(): JSX.Element {
  const { t }          = useTranslation()
  const navigate       = useNavigate()
  const publisherState = usePublisherState()

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PublisherModel>({ defaultValues: publisherState.publisher, mode: 'onSubmit' })

  const { fields, remove } = useFieldArray({
    control,
    name: 'histories', // unique name for your Field Array
  })

  const saveData = (data: PublisherModel): void => {
    publisherState.setPublisher({ ...publisherState.publisher, ...data })

    const newPublisher = { ...publisherState.publisher, ...data }
    if (newPublisher._id) {
      window.electron.ipcRenderer.invoke('update-publisher', newPublisher).then(() => {
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
    else {
      window.electron.ipcRenderer.invoke('create-publisher', newPublisher).then(() => {
        window.Notification.requestPermission().then(() => {
          // eslint-disable-next-line no-new
          new window.Notification('SECRETARY', {
            body: t('publishers.notification.saved'),
          })
        })
        publisherState.delete()
        navigate(ROUTES.PUBLISHERS)
      })
    }
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
          <li className="step step-primary">{t('publishers.step.other')}</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit(saveData)}>
        <div className="mx-auto grid w-10/12 grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
          {/* OTHER */}
          <div className="sm:col-span-6">
            <Field label={t('label.other')} error={errors.other?.message}>
              <textarea
                id="other"
                placeholder={t('label.other')}
                rows={5}
                className={classNames(
                  errors.firstname ? 'textarea-error' : '',
                  'textarea w-full textarea-bordered dark:placeholder:text-slate-500',
                )}
                {...register('other')}
              />
            </Field>
          </div>
          <div className="sm:col-span-6">
            {fields.length > 0 && (
              <fieldset className="fieldset col-span-6 mb-2">
                <legend className="bg-white px-1 text-sm font-bold text-gray-700 dark:bg-slate-900 dark:text-slate-400">
                  {t('label.events')}
                </legend>
                {fields.map((item, index) => {
                  return (
                    <div key={item.id} className="mb-2 grid grid-cols-12 gap-6">
                      <div className="col-span-3">
                        {item.date}
                      </div>
                      <div className="col-span-8 leading-tight">
                        {t(`event.${item.type.toLowerCase()}`)}
                        <span className="text-xs">
                          <br />
                          {item.information}
                        </span>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          className="btn btn-circle btn-outline btn-xs"
                          onClick={(): void => {
                            remove(index)
                          }}
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </fieldset>
            )}
          </div>

          <div className="col-span-6 col-start-1 mt-2 flex justify-between">
            <button
              className="btn btn-secondary"
              onClick={(): void => navigate(ROUTES.PUBLISHER_APPOINTMENTS_FORM)}
            >
              <ChevronLeftIcon className="size-5" />
              {t('button.back')}
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
