import { Disclosure }               from '@headlessui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation }           from 'react-i18next'
import {
  BriefcaseIcon,
  ChartBarIcon,
  ClockIcon,
  Cog6ToothIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import {
  ChevronRightIcon,
  DocumentTextIcon,
  IdentificationIcon,
  RectangleStackIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/20/solid'
import ROUTES     from '../constants/routes.json'
import classNames from '../utils/classNames'

const navigation = [
  { name: 'menu.dashboard', route: ROUTES.DASHBOARD, icon: HomeIcon },
  {
    name:  'menu.publishers',
    route: ROUTES.PUBLISHERS,
    icon:  UsersIcon,
  },
  {
    name:     'menu.reporting',
    route:    ROUTES.REPORTS,
    icon:     BriefcaseIcon,
    children: [
      { name: 'menu.monthlyReport', route: ROUTES.REPORTS_FORM },
      { name: 'menu.monthlyMeetings', route: ROUTES.REPORTS_MEETINGS },
      { name: 'menu.monthlyCompletion', route: ROUTES.REPORTS_COMPLETION },
    ],
  },
  {
    name:     'menu.stats',
    route:    ROUTES.STATS,
    icon:     ChartBarIcon,
    children: [
      { name: 'menu.statsDiary', route: ROUTES.DIARY },
    ],
  },
  {
    name:     'menu.history',
    route:    ROUTES.HISTORY,
    icon:     ClockIcon,
    children: [
      { name: 'menu.historyPublishers', route: ROUTES.HISTORY_PUBLISHERS },
      { name: 'menu.historyCongregation', route: ROUTES.HISTORY_CONGREGATION },
    ],
  },
]

const administration = [
  { name: 'menu.serviceGroups', route: ROUTES.SERVICE_GROUPS, icon: UserGroupIcon },
  { name: 'menu.circuitOverseer', route: ROUTES.CIRCUIT_OVERSEER, icon: UserIcon },
  { name: 'menu.responsibilities', route: ROUTES.RESPONSIBILITIES, icon: IdentificationIcon },
  { name: 'menu.tasks', route: ROUTES.TASKS, icon: RectangleStackIcon },
  { name: 'menu.templates', route: ROUTES.TEMPLATES, icon: DocumentTextIcon },
]

export function SidebarSmall(): JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const { t }    = useTranslation()

  const SmallChildSingle = (item: any, index: number | undefined) => {
    return (
      <button
        type="button"
        onClick={(): void => navigate(item.route)}
        onKeyDown={(): void => navigate(item.route)}
        tabIndex={index}
        className={classNames(
          location.pathname.includes(item.route)
            ? 'bg-gray-50 text-teal-600 dark:bg-slate-800 dark:text-white'
            : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800',
          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full',
        )}
      >
        <item.icon
          className={classNames(
            location.pathname.includes(item.route)
              ? 'text-teal-600 dark:text-white'
              : 'text-gray-400 group-hover:text-teal-600 dark:text-slate-400 dark:group-hover:text-white',
            'h-6 w-6 shrink-0',
          )}
          aria-hidden="true"
        />
        {t(item.name)}
      </button>
    )
  }

  const SmallChildChildren = (item: any) => {
    return (
      <Disclosure
        as="div"
        defaultOpen={location.pathname.includes(item.route)}
        key={location.pathname}
      >
        {({ open }): JSX.Element => (
          <>
            <Disclosure.Button
              className={classNames(
                location.pathname.includes(item.route)
                  ? 'bg-gray-50 text-teal-600 dark:bg-slate-800 dark:text-white'
                  : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800',
                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full',
              )}
            >
              <item.icon className="size-6 shrink-0 text-gray-400" aria-hidden="true" />
              {t(item.name)}
              <ChevronRightIcon
                className={classNames(
                  open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                  'ml-auto h-5 w-5 shrink-0',
                )}
                aria-hidden="true"
              />
            </Disclosure.Button>
            <Disclosure.Panel as="ul" className="mt-1 px-2">
              {item.children.map(subItem => (
                <li key={subItem.name}>
                  {/* 44px */}
                  <Disclosure.Button
                    as="a"
                    onClick={(): void => navigate(subItem.route)}
                    className={classNames(
                      location.pathname.includes(subItem.route)
                        ? 'bg-gray-50 text-teal-600 dark:bg-slate-800 dark:text-white'
                        : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800',
                      'group flex gap-x-3 rounded-md py-2 pl-9 pr-2 text-sm leading-6 font-semibold w-full',
                    )}
                  >
                    {t(subItem.name)}
                  </Disclosure.Button>
                </li>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    )
  }

  return (
    <ul className="flex flex-1 flex-col gap-y-7">
      <li>
        <ul className="-mx-2 space-y-1">
          {navigation.map((item, index) => (
            <li key={item.name}>
              {!item.children
                ? (
                    SmallChildSingle(item, index)
                  )
                : (
                    SmallChildChildren(item)

                  )}
            </li>
          ))}
        </ul>
      </li>
      <li>
        <div className="text-xs font-semibold leading-6 text-gray-400">
          {t('label.administration')}
        </div>
        <ul className="-mx-2 space-y-1">
          {administration.map((item, index) => (
            <li key={item.name}>
              <button
                type="button"
                onClick={(): void => navigate(item.route)}
                onKeyDown={(): void => navigate(item.route)}
                tabIndex={index}
                className={classNames(
                  location.pathname.includes(item.route)
                    ? 'bg-gray-50 text-teal-600 dark:bg-slate-800 dark:text-white'
                    : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800',
                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full',
                )}
              >
                <item.icon
                  className={classNames(
                    location.pathname.includes(item.route)
                      ? 'text-teal-600 dark:text-white'
                      : 'text-gray-400 group-hover:text-teal-600 dark:text-slate-400 dark:group-hover:text-white',
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium',
                  )}
                  aria-hidden="true"
                />
                {t(item.name)}
              </button>
            </li>
          ))}
        </ul>
      </li>
      <li className="mt-auto">
        <button
          type="button"
          onClick={(): void => navigate(ROUTES.SETTINGS)}
          className={classNames(
            'group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-teal-600 ',
            'dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
          )}
        >
          <Cog6ToothIcon
            className="size-6 shrink-0 text-gray-400 group-hover:text-teal-600 dark:text-slate-400 dark:group-hover:text-white"
            aria-hidden="true"
          />
          {t('menu.settings')}
        </button>
      </li>
    </ul>
  )
}

export function Sidebar(): JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const { t }    = useTranslation()

  const ChildSingle = (item: any, index: number | undefined) => {
    return (
      <button
        type="button"
        onClick={(): void => navigate(item.route)}
        onKeyDown={(): void => navigate(item.route)}
        tabIndex={index}
        className={classNames(
          location.pathname.includes(item.route)
            ? 'bg-gray-50 text-teal-600 dark:bg-slate-800 dark:text-white'
            : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800',
          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full',
        )}
      >
        <item.icon
          className={classNames(
            location.pathname.includes(item.route)
              ? 'text-teal-600 dark:text-white'
              : 'text-gray-400 group-hover:text-teal-600 dark:text-slate-400 dark:group-hover:text-white',
            'h-6 w-6 shrink-0',
          )}
          aria-hidden="true"
        />
        {t(item.name)}
      </button>
    )
  }

  const ChildChildren = (item: any) => {
    return (
      <Disclosure
        as="div"
        defaultOpen={location.pathname.includes(item.route)}
        key={location.pathname}
      >
        {({ open }): JSX.Element => (
          <>
            <Disclosure.Button
              className={classNames(
                location.pathname.includes(item.route)
                  ? 'bg-gray-50 text-teal-600 dark:bg-slate-800 dark:text-white'
                  : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800',
                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full',
              )}
            >
              <item.icon className="size-6 shrink-0 text-gray-400" aria-hidden="true" />
              {t(item.name)}
              <ChevronRightIcon
                className={classNames(
                  open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                  'ml-auto h-5 w-5 shrink-0',
                )}
                aria-hidden="true"
              />
            </Disclosure.Button>
            <Disclosure.Panel as="ul" className="mt-1 px-2">
              {item.children.map(subItem => (
                <li key={subItem.name}>
                  {/* 44px */}
                  <Disclosure.Button
                    onClick={(): void => navigate(subItem.route)}
                    className={classNames(
                      location.pathname.includes(subItem.route)
                        ? 'bg-gray-50 text-teal-600 dark:bg-slate-800 dark:text-white'
                        : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800',
                      'group flex gap-x-3 rounded-md pl-9 pr-2 py-2 text-sm leading-6 font-semibold w-full',
                    )}
                  >
                    {t(subItem.name)}
                  </Disclosure.Button>
                </li>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    )
  }

  return (
    <ul className="flex flex-1 flex-col gap-y-7">
      <li>
        <ul className="-mx-2 space-y-1">
          {navigation.map((item, index) => (
            <li key={item.name}>
              {!item.children
                ? (
                    ChildSingle(item, index)
                  )
                : (
                    ChildChildren(item)
                  )}
            </li>
          ))}
        </ul>
      </li>

      <li>
        <div className="text-xs font-semibold leading-6 text-gray-400">
          {t('label.administration')}
        </div>
        <ul className="-mx-2 space-y-1">
          {administration.map((item, index) => (
            <li key={item.name}>
              <button
                type="button"
                onClick={(): void => navigate(item.route)}
                onKeyDown={(): void => navigate(item.route)}
                tabIndex={index}
                className={classNames(
                  location.pathname.includes(item.route)
                    ? 'bg-gray-50 text-teal-600 dark:bg-slate-800 dark:text-white'
                    : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800',
                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full',
                )}
              >
                <item.icon
                  className={classNames(
                    location.pathname.includes(item.route)
                      ? 'text-teal-600 dark:text-white'
                      : 'text-gray-400 group-hover:text-teal-600 dark:text-slate-400 dark:group-hover:text-white',
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium',
                  )}
                  aria-hidden="true"
                />
                {t(item.name)}
              </button>
            </li>
          ))}
        </ul>
      </li>

      <li className="mt-auto">
        <button
          type="button"
          onClick={(): void => navigate(ROUTES.SETTINGS)}
          className={classNames(
            'group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700',
            'hover:bg-gray-50 hover:text-teal-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
          )}
        >
          <Cog6ToothIcon
            className="size-6 shrink-0 text-gray-400 group-hover:text-teal-600 dark:text-slate-400 dark:group-hover:text-white"
            aria-hidden="true"
          />
          {t('menu.settings')}
        </button>
      </li>
    </ul>
  )
}
