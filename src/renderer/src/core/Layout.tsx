import { Fragment, useState }                               from 'react'
import { Outlet }                                           from 'react-router-dom'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Bars3Icon, XMarkIcon }                             from '@heroicons/react/24/outline'
import classNames                                           from '@renderer/utils/classNames'
import { OnlineIcon }                                       from '@renderer/components/OnlineIcon'
import { WarningIcon }                                      from '@renderer/components/WarningIcon'
import { Updates }                                          from '@renderer/components/Updates'
import { Sidebar, SidebarSmall }                            from './Sidebar'

export default function Layout(): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div
      className={classNames(
        'h-full w-full bg-white scrollbar-hide dark:bg-slate-900',
        import.meta.env.RENDERER_VITE_NODE_ENV !== 'production' ? 'debug-screens' : '',
      )}
    >
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </TransitionChild>
          <div className="fixed inset-0 flex">
            <TransitionChild
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                <TransitionChild
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
                      <XMarkIcon className="size-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </TransitionChild>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 dark:bg-slate-900">
                  <nav className="mt-4 flex flex-1 flex-col">
                    <SidebarSmall />
                  </nav>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4 dark:border-slate-600 dark:bg-slate-900">
          <nav className="mt-4 flex flex-1 flex-col">
            <Sidebar />
          </nav>
        </div>
      </div>

      <div className="flex flex-col lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:border-slate-600 dark:bg-slate-900">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-slate-400"
            onClick={(): void => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="size-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden dark:bg-slate-600" aria-hidden="true" />

          <div className="flex flex-1 justify-end gap-x-4 lg:gap-x-6">

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Updates />
              <WarningIcon />
              <OnlineIcon />
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
