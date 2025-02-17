import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { XMarkIcon }                                                     from '@heroicons/react/24/outline'
import { Fragment, useState }                                            from 'react'
import { useTranslation }                                                from 'react-i18next'
import { Text }                                                          from './catalyst/text'
import { Button }                                                        from './catalyst/button'
import { Fieldset, Label }                                               from './catalyst/fieldset'
import { Checkbox, CheckboxField }                                       from './catalyst/checkbox'

export interface iInactive {
  id:   string
  name: string
}
export function ShowInactive({ show, inactives, type, handleClose }: { show: boolean, inactives: iInactive[], type: 'PDF' | 'XLSX', handleClose: () => void }): JSX.Element {
  const { t } = useTranslation()

  const [selectedInactives, setSelectedInactives] = useState<string[]>([])

  const onExport = () => {
    window.electron.ipcRenderer.send('export-service-groups', { inactives: selectedInactives, type })
    handleClose()
  }

  return (
    <Transition show={show} as={Fragment}>
      <Dialog className="relative z-10" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 dark:bg-zinc-900">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-zinc-900 dark:ring-offset-zinc-900"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="size-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="w-full sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900 dark:text-slate-300"
                    >
                      {t('serviceGroups.inactivePublishers')}
                      {type}
                    </DialogTitle>
                    <div className="mt-2 flex w-full flex-col">
                      <Text>{t('serviceGroups.selectInactivePublishers')}</Text>
                      <Fieldset className="mt-2 grid grid-cols-3 gap-y-2">
                        {inactives.map(inactive => (
                          <CheckboxField key={inactive.id}>
                            <Checkbox
                              color="blue"
                              value={inactive.id}
                              checked={selectedInactives.includes(inactive.id)}
                              onChange={() => {
                                if (!selectedInactives.includes(inactive.id))
                                  setSelectedInactives([...selectedInactives, inactive.id])
                                else
                                  setSelectedInactives(selectedInactives.filter(selected => selected !== inactive.id))
                              }}
                            />
                            <Label>{inactive.name}</Label>
                          </CheckboxField>
                        ))}
                      </Fieldset>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:space-x-4 sm:space-x-reverse">
                  <Button
                    type="button"
                    color="blue"
                    onClick={() => onExport()}
                  >
                    {t('label.export')}
                  </Button>
                  <Button
                    type="button"
                    outline
                    onClick={handleClose}
                  >
                    {t('label.cancel')}
                  </Button>
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
