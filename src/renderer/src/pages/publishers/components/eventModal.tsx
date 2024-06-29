import { useEffect, useState }                          from 'react'
import { useForm }                                      from 'react-hook-form'
import { useTranslation }                               from 'react-i18next'
import type { PublicCongregationModel, PublisherModel } from 'src/types/models'
import { Modal }                                        from '@renderer/components/Modal'
import { Field }                                        from '@renderer/components/Field'
import classNames                                       from '@renderer/utils/classNames'

interface EventModalProps {
  open:                boolean
  setOpen:             (open: boolean) => void
  publisher:           PublisherModel | undefined
  publicCongregations: PublicCongregationModel[]
  refresh:             () => void
}

export type HeroIcon = React.ComponentType<
  React.PropsWithoutRef<React.ComponentProps<'svg'>> & {
    title?:   string | undefined
    titleId?: string | undefined
  }
>

interface Event {
  name:    string
  command: string
}

interface EventForm {
  date:            string
  command:         string
  publisherId:     string
  newCongregation: string | null
}

export default function EventModal(props: EventModalProps): JSX.Element {
  const { t } = useTranslation()

  const [showCongregationSelector, setShowCongregationSelector] = useState<boolean>(false)

  const events: Event[] = [
    { name: t('event.a2'), command: 'A-2' },
    { name: t('event.a8'), command: 'A-8' },
    { name: t('event.a19'), command: 'A-19' },
    { name: t('event.co5a'), command: 'CO-5A' },
    { name: t('event.co4'), command: 'CO-4' },
    { name: t('event.movedIn'), command: 'MOVED_IN' },
    { name: t('event.movedOut'), command: 'MOVED_OUT' },
    { name: t('event.publisher'), command: 'PUBLISHER' },
    { name: t('event.baptised'), command: 'BAPTISED' },
    { name: t('event.auxiliaryStart'), command: 'AUXILIARY_START' },
    { name: t('event.pioneerStart'), command: 'PIONEER_START' },
    { name: t('event.auxiliaryStop'), command: 'AUXILIARY_STOP' },
    { name: t('event.pioneerStop'), command: 'PIONEER_STOP' },
    { name: t('event.pioneerSchool'), command: 'PIONEER_SCHOOL' },
    { name: t('event.deceased'), command: 'DECEASED' },
    { name: t('event.reinstated'), command: 'REINSTATED' },
    { name: t('event.disassociation'), command: 'DISASSOCIATION' },
    { name: t('event.disfellowshipped'), command: 'DISFELLOWSHIPPED' },
    { name: t('event.delete'), command: 'DELETE' },
  ]

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    switch (event.target.value) {
      case 'MOVED_OUT':
        setShowCongregationSelector(true)
        break

      default:
        setShowCongregationSelector(false)
        break
    }
  }

  const storeEvent = (event: EventForm): void => {
    window.electron.ipcRenderer.invoke('store-event', { event }).then(() => {
      props.refresh()
    })
  }

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<EventForm>({
    defaultValues: {
      date:            '',
      publisherId:     '',
      command:         '',
      newCongregation: null,
    },
  })

  useEffect(() => {
    setValue('date', new Date().toISOString().slice(0, 10))
    setValue('publisherId', props.publisher?._id || '')
  }, [props.publisher])

  return (
    <Modal
      open={props.open}
      onClose={() => props.setOpen(false)}
      title={`${props.publisher?.firstname} ${props.publisher?.lastname}`}
    >
      <form className="relative" onSubmit={handleSubmit(storeEvent)}>
        <p className="text-sm">{t('event.description')}</p>

        <input type="hidden" {...register('publisherId')} />
        <input type="hidden" {...register('command')} />
        <Field label={t('event.selectDate')} error={errors.date?.message}>
          <input
            type="date"
            className="input input-bordered w-full"
            {...register('date', { required: t('errors.date.required') })}
          />
        </Field>

        <Field label={t('event.selectEvent')} error={errors.command?.message}>
          <select
            className={classNames(
              errors.command ? 'select-error' : '',
              'select select-bordered w-full',
            )}
            {...register('command', {
              onChange: (e) => { handleChange(e) },
            })}
          >
            {events.map(event => (
              <option key={event.command} value={event.command}>{event.name}</option>
            ))}
          </select>
        </Field>

        {showCongregationSelector && (
          <Field label={t('event.transferToNewCongregation')} info={t('event.selectCongregation')} error={errors.newCongregation?.message}>
            <select
              className={classNames(
                errors.command ? 'select-error' : '',
                'select select-bordered w-full',
              )}
              {...register('newCongregation')}
            >
              <option value="">
                {t('event.doNotTransfer')}
              </option>
              {props.publicCongregations.map(congregation => (
                <option key={congregation.identifier} value={congregation.identifier}>
                  {congregation.congregation}
                </option>
              ))}
            </select>
          </Field>
        )}

        <button type="submit" className="btn btn-primary mt-4 justify-items-end">
          {t('button.save')}
        </button>
      </form>
    </Modal>
  )
}
