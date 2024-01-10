import { useNavigate }         from 'react-router-dom'
import { useForm }             from 'react-hook-form'
import { useTranslation }      from 'react-i18next'
import { ChevronLeftIcon }     from '@heroicons/react/24/solid'
import { usePublisherState }   from '@renderer/store/publisherStore'
import type { PublisherModel } from 'src/types/models'
import { Field }               from '@renderer/components/Field'
import classNames              from '@renderer/utils/classNames'
import ROUTES                  from '../../constants/routes.json'

export default function PublisherOtherForm(): JSX.Element {
  const { t }          = useTranslation()
  const navigate       = useNavigate()
  const publisherState = usePublisherState()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PublisherModel>({ defaultValues: publisherState.publisher, mode: 'onSubmit' })

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
          {/* FIRSTNAME */}
          <div className="sm:col-span-6">
            <Field label={t('label.other')} error={errors.other?.message}>
              <textarea
                id="other"
                placeholder={t('label.other')}
                rows={5}
                className={classNames(
                  errors.firstname ? 'textarea-error' : '',
                  'textarea w-full textarea-bordered',
                )}
                {...register('other')}
              />
            </Field>
          </div>

          <div className="col-span-6 col-start-1 mt-2 flex justify-between">
            <button
              className="btn btn-secondary"
              onClick={(): void => navigate(ROUTES.PUBLISHER_APPOINTMENTS_FORM)}
            >
              <ChevronLeftIcon className="h-5 w-5" />
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
