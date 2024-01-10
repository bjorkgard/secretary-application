import { useState } from 'react'
import { Combobox } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { CalendarIcon } from '@heroicons/react/20/solid'
import { TrashIcon, UserMinusIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { PublisherModel } from 'src/types/models'
import classNames from '@renderer/utils/classNames'
import { Modal } from '@renderer/components/Modal'

type EventModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  publisher: PublisherModel | undefined
  refresh: () => void
}

export type HeroIcon = React.ComponentType<
  React.PropsWithoutRef<React.ComponentProps<'svg'>> & {
    title?: string | undefined
    titleId?: string | undefined
  }
>

type Event = {
  name: string
  shortcut?: string
  command: string
  icon: HeroIcon
}

export default function EventModal(props: EventModalProps): JSX.Element {
  const { t } = useTranslation()
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10))

  const events: Event[] = [
    { name: t('event.deceased'), icon: UserMinusIcon, command: 'DECEASED' },
    { name: t('event.reinstated'), icon: UserPlusIcon, command: 'REINSTATED' },
    { name: t('event.disassociation'), icon: UserMinusIcon, command: 'DISASSOCIATION' },
    { name: t('event.disfellowshipped'), icon: UserMinusIcon, command: 'DISFELLOWSHIPPED' },
    { name: t('event.delete'), icon: TrashIcon, shortcut: 'X', command: 'DELETE' }
  ]

  const storeEvent = (command: string) => {
    const event = {
      date,
      command,
      publisherId: props.publisher?._id
    }

    window.electron.ipcRenderer.invoke('store-event', { event }).then(() => {
      props.refresh()
    })
  }

  return (
    <Modal
      open={props.open}
      onClose={() => props.setOpen(false)}
      title={`${props.publisher?.firstname} ${props.publisher?.lastname}`}
    >
      <div className="relative grid gap-8 p-7 lg:grid-cols-2">
        <p className="text-sm">{t('event.description')}</p>

        <Combobox onChange={(item: Event) => storeEvent(item.command)}>
          <Combobox.Label className="text-sm">{t('event.description')}</Combobox.Label>
          <div className="relative">
            <CalendarIcon
              className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
            <Combobox.Input
              as="input"
              className="h-12 w-full invinsible bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none font-bold dark:text-slate-400"
              type="date"
              value={date}
              placeholder={t('event.selectDate')}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <Combobox.Options static className="max-h-80 scroll-py-2">
            <li className="p-2">
              <h2 className="sr-only">Quick actions</h2>
              <ul className="text-sm text-gray-700 dark:text-slate-400">
                {events.map((event) => (
                  <Combobox.Option
                    key={event.command}
                    value={event}
                    className={({ active }) =>
                      classNames(
                        'flex cursor-default select-none items-center rounded-md px-3 py-2 -mx-3',
                        active
                          ? 'bg-gray-900 bg-opacity-5 text-gray-900 dark:bg-slate-800 dark:text-white'
                          : ''
                      )
                    }
                  >
                    {({ active }) => (
                      <>
                        <event.icon
                          className={classNames(
                            'h-6 w-6 flex-none text-gray-900 text-opacity-40 dark:text-slate-500 dark:text-opacity-100',
                            active ? 'text-opacity-100 dark:!text-white' : 'dark:text-slate-500'
                          )}
                          aria-hidden="true"
                        />
                        <span className="ml-3 flex-auto truncate">{event.name}</span>
                        {event.shortcut && (
                          <span className="ml-3 flex-none text-xs font-semibold text-gray-500 dark:text-slate-400">
                            <kbd className="kbd mr-1">⌘</kbd>
                            <kbd className="kbd">{event.shortcut}</kbd>
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))}
              </ul>
            </li>
          </Combobox.Options>
        </Combobox>
      </div>
    </Modal>
  )
}
