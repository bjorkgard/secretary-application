import { useEffect }                              from 'react'
import { useForm, useWatch }                      from 'react-hook-form'
import { useTranslation }                         from 'react-i18next'
import { TrashIcon, UserMinusIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import type { PublisherModel }                    from 'src/types/models'
import { Modal }                                  from '@renderer/components/Modal'
import { Field }                                  from '@renderer/components/Field'

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
  name:      string
  shortcut?: string
  command:   string
  icon:      HeroIcon
}

interface EventForm {
  date:        string
  command:     string
  publisherId: string
}

export default function EventModal(props: EventModalProps): JSX.Element {
  const { t } = useTranslation()

  const events: Event[] = [
    { name: t('event.deceased'), icon: UserMinusIcon, command: 'DECEASED' },
    { name: t('event.reinstated'), icon: UserPlusIcon, command: 'REINSTATED' },
    { name: t('event.disassociation'), icon: UserMinusIcon, command: 'DISASSOCIATION' },
    { name: t('event.disfellowshipped'), icon: UserMinusIcon, command: 'DISFELLOWSHIPPED' },
    { name: t('event.delete'), icon: TrashIcon, command: 'DELETE' },
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
    control,
  } = useForm<EventForm>({
    defaultValues: {
      date:        '',
      publisherId: '',
      command:     '',
    },
  })
  const command = useWatch({ control, name: 'command' })

  useEffect(() => {
    setValue('date', new Date().toISOString().slice(0, 10))
    setValue('publisherId', props.publisher?._id || '')
    setValue('command', '')
  }, [props.publisher])

  useEffect(() => {
    if (command && command !== '')
      handleSubmit(storeEvent)()
  }, [command])

  return (
    <Modal
      open={props.open}
      onClose={() => props.setOpen(false)}
      title={`${props.publisher?.firstname} ${props.publisher?.lastname}`}
    >
      <div className="relative">
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

        <ul className="p-2 text-sm text-gray-700 dark:text-slate-400">
          <h2 className="sr-only">Quick actions</h2>
          {events.map(event => (
            <li
              key={event.command}
              onClick={() => setValue('command', event.command)}
              className="group -mx-3 flex cursor-default select-none items-center rounded-md px-3 py-2 hover:bg-gray-900/5 hover:text-gray-900 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <event.icon
                className="h-6 w-6 flex-none text-gray-900 text-opacity-40 group-hover:text-opacity-100 dark:text-slate-500 dark:text-opacity-100 dark:group-hover:!text-white"
                aria-hidden="true"
              />
              <span className="ml-3 flex-auto truncate">{event.name}</span>
              {event.shortcut && (
                <span className="ml-3 flex-none text-xs font-semibold text-gray-500 dark:text-slate-400">
                  <kbd className="kbd mr-1">⌘</kbd>
                  <kbd className="kbd">{event.shortcut}</kbd>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  )
}
