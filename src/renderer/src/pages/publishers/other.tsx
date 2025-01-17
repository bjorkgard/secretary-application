import { useNavigate }                                  from 'react-router-dom'
import { useFieldArray, useForm }                       from 'react-hook-form'
import { useTranslation }                               from 'react-i18next'
import { TrashIcon }                                    from '@heroicons/react/20/solid'
import { ChevronLeftIcon }                              from '@heroicons/react/24/solid'
import { usePublisherState }                            from '@renderer/store/publisherStore'
import type { PublisherModel }                          from 'src/types/models'
import { ErrorMessage, Field, Fieldset, Label, Legend } from '@renderer/components/catalyst/fieldset'
import { Heading }                                      from '@renderer/components/catalyst/heading'
import { Button }                                       from '@renderer/components/catalyst/button'
import { Textarea }                                     from '@renderer/components/catalyst/textarea'
import ROUTES                                           from '../../constants/routes.json'
import Progress                                         from './components/progress'

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
        <Heading>
          {publisherState.publisher._id
            ? t('publishers.editHeadline')
            : t('publishers.addHeadline')}
        </Heading>
      </div>
      <Progress step="OTHER" />
      <form onSubmit={handleSubmit(saveData)}>
        <div className="mx-auto grid w-10/12 grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
          {/* OTHER */}
          <Field className="sm:col-span-6">
            <Label>{t('label.other')}</Label>
            <Textarea
              id="other"
              placeholder={t('label.other')}
              rows={5}
              {...register('other')}
            />
            {errors.other && <ErrorMessage>{errors.other.message}</ErrorMessage>}
          </Field>

          <div className="sm:col-span-6">
            {fields.length > 0 && (
              <Fieldset className="col-span-6 my-4 border border-zinc-950/10 p-4 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20">
                <Legend className="-mt-7 mb-2 w-fit bg-white px-1 dark:bg-zinc-900">{t('label.events')}</Legend>

                {fields.map((item, index) => {
                  return (
                    <div key={item.id} className="mb-2 grid grid-cols-12 gap-6 text-sm text-zinc-950 dark:text-white">
                      <div className="col-span-3 my-auto">
                        {item.date}
                      </div>
                      <div className="col-span-8 my-auto leading-tight">
                        {t(`event.${item.type.toLowerCase()}`)}
                        <span className="text-xs">
                          <br />
                          {item.information}
                        </span>
                      </div>
                      <div className="col-span-1 flex items-center justify-end">
                        <Button
                          outline
                          onClick={(): void => {
                            remove(index)
                          }}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </Fieldset>
            )}
          </div>

          <div className="col-span-6 col-start-1 mt-2 flex justify-between">
            <Button
              outline
              onClick={(): void => navigate(ROUTES.PUBLISHER_APPOINTMENTS_FORM)}
            >
              <ChevronLeftIcon className="size-5" />
              {t('button.back')}
            </Button>
            <Button color="blue" type="submit">
              {t('button.save')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
