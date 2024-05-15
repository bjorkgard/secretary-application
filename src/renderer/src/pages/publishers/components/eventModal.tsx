import { useEffect }           from 'react'
import { useForm }             from 'react-hook-form'
import { useTranslation }      from 'react-i18next'
import type { PublisherModel } from 'src/types/models'
import { Modal }               from '@renderer/components/Modal'
import { Field }               from '@renderer/components/Field'
import classNames              from '@renderer/utils/classNames'

interface EventModalProps {
  open:      boolean
  setOpen:   (open: boolean) => void
  publisher: PublisherModel | undefined
  refresh:   () => void
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
  date:        string
  command:     string
  publisherId: string
}

export default function EventModal(props: EventModalProps): JSX.Element {
  const { t } = useTranslation()

  const events: Event[] = [
    { name: t('event.movedIn'), command: 'MOVED_IN' },
    { name: t('event.movedOut'), command: 'MOVED_OUT' },
    { name: t('event.publisher'), command: 'PUBLISHER' },
    { name: t('event.auxiliaryStart'), command: 'AUXILIARY_START' },
    { name: t('event.pioneerStart'), command: 'PIONEER_START' },
    { name: t('event.auxiliaryStop'), command: 'AUXILIARY_STOP' },
    { name: t('event.pioneerStop'), command: 'PIONEER_STOP' },
    { name: t('event.deceased'), command: 'DECEASED' },
    { name: t('event.reinstated'), command: 'REINSTATED' },
    { name: t('event.disassociation'), command: 'DISASSOCIATION' },
    { name: t('event.disfellowshipped'), command: 'DISFELLOWSHIPPED' },
    { name: t('event.delete'), command: 'DELETE' },
  ]

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
      date:        '',
      publisherId: '',
      command:     '',
    },
  })
  // const command = useWatch({ control, name: 'command' })

  useEffect(() => {
    setValue('date', new Date().toISOString().slice(0, 10))
    setValue('publisherId', props.publisher?._id || '')
    // setValue('command', selectedEvent?.command || '')
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
            {...register('command')}
          >
            {events.map(event => (
              <option key={event.command} value={event.command}>{event.name}</option>
            ))}
          </select>
        </Field>

        <button type="submit" className="btn btn-primary mt-4 justify-items-end">
          {t('button.save')}
        </button>
      </form>
    </Modal>
  )
}
