import type { ReactElement }  from 'react'
import { Fragment }           from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useTranslation }     from 'react-i18next'
import { XMarkIcon }          from '@heroicons/react/24/outline'

interface CardProps {
  children:   ReactElement
  title?:     string
  open:       boolean
  onClose:    () => void
  onConfirm?: () => void
}

export function Modal({ children, title, open, onClose, onConfirm }: CardProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative overflow-hidden rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 dark:bg-slate-900">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-slate-900 dark:ring-offset-slate-900"
                    onClick={() => onClose()}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="size-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="w-full sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900 dark:text-slate-300"
                    >
                      {title}
                    </Dialog.Title>
                    <div className="mt-2 w-full">{children}</div>
                  </div>
                </div>
                {onConfirm && (
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="btn btn-primary inline-flex w-full sm:ml-3 sm:w-auto"
                      onClick={() => onConfirm()}
                    >
                      {t('label.ok')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-accent mt-3 inline-flex w-full sm:mt-0 sm:w-auto"
                      onClick={() => onClose()}
                    >
                      {t('label.cancel')}
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
