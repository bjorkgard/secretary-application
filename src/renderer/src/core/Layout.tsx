import { Fragment, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Dialog, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  SignalIcon,
  SignalSlashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useTranslation } from 'react-i18next'
import { Sidebar, SidebarSmall } from './Sidebar'
import { useSettingsState } from '@renderer/store/settingsStore'
import classNames from '@renderer/utils/classNames'

export default function Layout(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const settingsState = useSettingsState()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isOnline, setIsOnline] = useState<boolean>(false)

  useEffect(() => {
    setIsOnline(Object.values(settingsState.online).some((item) => item === true))
  }, [settingsState.online])

  return (
    <div
      className={classNames(
        'h-full w-full bg-white scrollbar-hide dark:bg-slate-900',
        import.meta.env.RENDERER_VITE_NODE_ENV !== 'production' ? 'debug-screens' : ''
      )}
    >
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={(): void => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 dark:bg-slate-900">
                  <nav className="mt-4 flex flex-1 flex-col">
                    <SidebarSmall />
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4 dark:border-slate-600 dark:bg-slate-900">
          <nav className="mt-4 flex flex-1 flex-col">
            <Sidebar />
          </nav>
        </div>
      </div>

      <div className="flex flex-col lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm dark:border-slate-600 dark:bg-slate-900 sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-slate-400 lg:hidden"
            onClick={(): void => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 dark:bg-slate-600 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="relative flex flex-1" action="#" method="GET">
              <MagnifyingGlassIcon
                className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 dark:text-slate-400"
                aria-hidden="true"
              />
              <input
                id="search-field"
                className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 dark:bg-slate-900 dark:text-slate-400 sm:text-sm"
                placeholder={t('label.search')}
                type="search"
                name="search"
              />
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:text-slate-400 dark:hover:text-slate-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                className={classNames(
                  isOnline
                    ? 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-500'
                    : 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500',
                  '-m-2.5 p-2.5'
                )}
                onClick={(): void => navigate('/settings')}
              >
                <span className="sr-only">View notifications</span>
                {isOnline ? (
                  <div className="tooltip tooltip-left" data-tip={t('label.online')}>
                    <SignalIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                ) : (
                  <div className="tooltip tooltip-left" data-tip={t('label.offline')}>
                    <SignalSlashIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        <main className="min-h-screen py-10">
          <div className="prose min-h-full min-w-full max-w-full px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
