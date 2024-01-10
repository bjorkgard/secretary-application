import React, { Fragment, createContext, useContext, useRef, useState } from 'react'
import { Dialog, Transition }                                           from '@headlessui/react'
import { ExclamationTriangleIcon }                                      from '@heroicons/react/24/outline'
import { useTranslation }                                               from 'react-i18next'

interface UseModalShowReturnType {
  show:    boolean
  setShow: (value: boolean) => void
  onHide:  () => void
}

function useModalShow(): UseModalShowReturnType {
  const [show, setShow] = useState(false)

  const handleOnHide = (): void => {
    setShow(false)
  }

  return {
    show,
    setShow,
    onHide: handleOnHide,
  }
}

interface ModalContextType {
  showConfirmation: (title: string, message: string | JSX.Element) => Promise<boolean>
}

interface ConfirmationModalContextProviderProps {
  children: React.ReactNode
}

const ConfirmationModalContext = createContext<ModalContextType>({} as ModalContextType)

const ConfirmationModalContextProvider: React.FC<ConfirmationModalContextProviderProps> = (
  props,
) => {
  const { t }                     = useTranslation()
  const { setShow, show, onHide } = useModalShow()
  const [content, setContent]     = useState<{ title: string, message: string | JSX.Element } | null>()
  const resolver                  = useRef<(value: boolean) => void>()
  const cancelButtonRef           = useRef<HTMLButtonElement>(null)

  const handleShow = (title: string, message: string | JSX.Element): Promise<boolean> => {
    setContent({
      title,
      message,
    })
    setShow(true)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }

  const modalContext: ModalContextType = {
    showConfirmation: handleShow,
  }

  const handleOk = (): void => {
    resolver.current && resolver.current(true)
    onHide()
  }

  const handleCancel = (): void => {
    resolver.current && resolver.current(false)
    onHide()
  }

  return (
    <ConfirmationModalContext.Provider value={modalContext}>
      {props.children}

      {content && (
        <Transition.Root show={show} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            initialFocus={cancelButtonRef}
            onClose={handleCancel}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-slate-700/75" />
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
                  <Dialog.Panel className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 dark:bg-slate-900">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-red-600">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600 dark:text-red-200"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900 dark:text-slate-300"
                        >
                          {content.title}
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            {content.message}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button type="button" className="btn btn-secondary ml-4" onClick={handleOk}>
                        {t('button.ok')}
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleCancel}
                        ref={cancelButtonRef}
                      >
                        {t('button.abort')}
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </ConfirmationModalContext.Provider>
  )
}

const useConfirmationModalContext = (): ModalContextType => useContext(ConfirmationModalContext)

export { useModalShow, useConfirmationModalContext }

export default ConfirmationModalContextProvider
