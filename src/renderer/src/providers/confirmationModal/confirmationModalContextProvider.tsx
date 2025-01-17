import React, { Fragment, createContext, useContext, useRef, useState }  from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { ExclamationTriangleIcon }                                       from '@heroicons/react/24/outline'
import { useTranslation }                                                from 'react-i18next'
import { Button }                                                        from '@renderer/components/catalyst/button'
import { Text }                                                          from '@renderer/components/catalyst/text'

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
    // eslint-disable-next-line ts/no-unused-expressions
    resolver.current && resolver.current(true)
    onHide()
  }

  const handleCancel = (): void => {
    // eslint-disable-next-line ts/no-unused-expressions
    resolver.current && resolver.current(false)
    onHide()
  }

  return (
    <ConfirmationModalContext.Provider value={modalContext}>
      {props.children}

      {content && (
        <Transition show={show} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            initialFocus={cancelButtonRef}
            onClose={handleCancel}
          >
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-zinc-700/75" />
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
                  <DialogPanel className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 dark:bg-zinc-900">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10 dark:bg-red-600">
                        <ExclamationTriangleIcon
                          className="size-6 text-red-600 dark:text-red-200"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <DialogTitle
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900 dark:text-slate-300"
                        >
                          {content.title}
                        </DialogTitle>
                        <div className="mt-2">
                          <Text>
                            {content.message}
                          </Text>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <Button color="blue" type="button" className="ml-4" onClick={handleOk}>
                        {t('button.ok')}
                      </Button>
                      <Button
                        type="button"
                        outline
                        onClick={handleCancel}
                        ref={cancelButtonRef}
                      >
                        {t('button.abort')}
                      </Button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </ConfirmationModalContext.Provider>
  )
}

const useConfirmationModalContext = (): ModalContextType => useContext(ConfirmationModalContext)

export { useModalShow, useConfirmationModalContext }

export default ConfirmationModalContextProvider
