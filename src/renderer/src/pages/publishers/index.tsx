import { useEffect, useState } from 'react'
import { useTranslation }      from 'react-i18next'
import { useNavigate }         from 'react-router-dom'
import { PlusIcon }            from '@heroicons/react/24/solid'
import {
  DevicePhoneMobileIcon,
  DocumentArrowDownIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon as PlusIconSmall,
  TrashIcon,
} from '@heroicons/react/20/solid'
import { formatPhoneNumber }                                               from 'react-phone-number-input'
import type { PublicCongregationModel, PublisherModel, ServiceGroupModel } from 'src/types/models'
import { isTemplateCorrect }                                               from '@renderer/utils/isTemplateCorrect'
import ROUTES                                                              from '../../constants/routes.json'
import EventModal                                                          from './components/eventModal'

export default function Publishers(): JSX.Element {
  const { t }    = useTranslation()
  const navigate = useNavigate()

  const [publishers, setPublishers]                   = useState<PublisherModel[]>([])
  const [publisher, setPublisher]                     = useState<PublisherModel>()
  const [openEventModal, setOpenEventModal]           = useState<boolean>(false)
  const [serviceGroups, setServiceGroups]             = useState<ServiceGroupModel[]>([])
  const [hasS21, setHasS21]                           = useState<boolean>(false)
  const [queryString, setQueryString]                 = useState<string>('')
  const [publicCongregations, setPublicCongregations] = useState<PublicCongregationModel[]>([])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryString(e.target.value)
  }

  const getPublishers = (sortField = 'lastname', queryString = ''): void => {
    window.electron.ipcRenderer
      .invoke('get-publishers', { sortField, queryString })
      .then((result: PublisherModel[]) => {
        setPublishers(result)
      })
  }

  const getServiceGroups = (): void => {
    window.electron.ipcRenderer.invoke('get-serviceGroups').then((result: ServiceGroupModel[]) => {
      setServiceGroups(result)
    })
  }

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-public-congregations').then((result: PublicCongregationModel[]) => {
      setPublicCongregations(result)
    })
  }, [])

  useEffect(() => {
    getServiceGroups()
    getPublishers('lastname', queryString)
    isTemplateCorrect('S-21').then((result) => {
      setHasS21(result)
    })
  }, [queryString])

  const editPublisher = (id: string | undefined): void => {
    if (id)
      navigate(`${ROUTES.PUBLISHERS}/${id}/edit`)
  }

  const exportS21 = (id: string | undefined): void => {
    if (id)
      window.electron.ipcRenderer.send('export-s21', id)
  }

  const exportExtendedRegisterCard = (id: string | undefined): void => {
    if (id)
      window.electron.ipcRenderer.send('export-extended-register-card', id)
  }

  const addEvent = (id: string | undefined): void => {
    if (id) {
      setPublisher(publishers.find(p => p._id === id))
      setOpenEventModal(true)
    }
  }

  return (
    <>
      <EventModal
        open={openEventModal}
        setOpen={function (open: boolean): void {
          setOpenEventModal(open)
        }}
        publisher={publisher}
        publicCongregations={publicCongregations}
        refresh={function (): void {
          getPublishers()
          setOpenEventModal(false)
        }}
      />
      <div className="flex h-full flex-col">
        <div className="flex justify-between">
          <h1>{t('publishers.headline')}</h1>
          <div className="relative mx-12 block h-12 w-full text-slate-500">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2" />
            <input autoComplete="off" spellCheck="false" aria-autocomplete="list" name="publisher-filter" type="search" className="input input-bordered w-full pl-12 dark:placeholder:text-slate-500" placeholder={t('search')} onChange={onChange} />
          </div>
          <div className="tooltip tooltip-left" data-tip={t('label.addPublisher')}>
            <button
              className="btn btn-circle btn-outline"
              onClick={(): void => navigate(ROUTES.PUBLISHER_PERSONAL_FORM)}
            >
              <PlusIcon className="size-6" />
            </button>
          </div>
        </div>
        <div className="h-full">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>{t('publishers.header.group')}</th>
                <th>{t('publishers.header.lastname')}</th>
                <th>{t('publishers.header.firstname')}</th>
                <th>{t('publishers.header.mobile')}</th>
                <th>{t('publishers.header.email')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {publishers.map((publisher) => {
                const serviceGroup = serviceGroups.find(sg => sg._id === publisher.serviceGroupId)
                const appointments
                  = publisher.appointments.map((a) => {
                    if (a.type)
                      return `badge.short.${a.type.toLowerCase()}`

                    return null
                  }) || []
                return (
                  <tr key={publisher._id} className="hover">
                    <td>
                      {appointments.map((appointment) => {
                        if (appointment) {
                          return (
                            <div className="badge badge-primary badge-sm mr-1" key={appointment}>
                              {t(appointment)}
                            </div>
                          )
                        }
                        else {
                          return null
                        }
                      })}
                    </td>
                    <td>{serviceGroup?.name || '-'}</td>
                    <td>{publisher.lastname}</td>
                    <td>{publisher.firstname}</td>
                    <td>
                      <a className="link-hover link" href={`sms:${publisher.mobile}`}>
                        {publisher.mobile ? formatPhoneNumber(publisher.mobile) : ''}
                      </a>
                    </td>
                    <td>
                      <a className="link-hover link" href={`mailto:${publisher.email}`}>
                        {publisher.email}
                      </a>
                    </td>
                    <td>
                      <div className="flex justify-end space-x-4">
                        <div className="dropdown dropdown-left">
                          <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-circle btn-outline btn-xs"
                          >
                            <EllipsisHorizontalIcon className="size-4" />
                          </div>
                          <ul
                            tabIndex={0}
                            className="menu dropdown-content menu-sm z-10 w-52 rounded-box border border-gray-900/10 bg-gray-50 shadow-xl dark:border-slate-400/50 dark:bg-slate-800"
                          >
                            <li className="menu-title m-0 py-1">
                              {publisher.firstname}
                              {' '}
                              {publisher.lastname}
                            </li>
                            <li className="m-0 py-1">
                              <button
                                className="pl-0"
                                onClick={(): void => {
                                  addEvent(publisher._id)
                                }}
                              >
                                <PlusIconSmall className="ml-2 size-5" />
                                {t('menu.event')}
                              </button>
                            </li>
                            <li className="m-0 py-1">
                              <button
                                className="pl-0 disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={(): void => {
                                  exportS21(publisher._id)
                                }}
                                disabled={!hasS21}
                              >
                                <DocumentArrowDownIcon className="ml-2 size-5" />
                                {t('menu.s21')}
                              </button>
                            </li>
                            <li className="m-0 py-1">
                              <button
                                className="pl-0 disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={(): void => {
                                  exportExtendedRegisterCard(publisher._id)
                                }}
                              >
                                <DocumentArrowDownIcon className="ml-2 size-5" />
                                {t('menu.extendedRegisterCard')}
                              </button>
                            </li>
                            <li className="m-0 py-1">
                              <button
                                className="pl-0"
                                onClick={(): void => {
                                  editPublisher(publisher._id)
                                }}
                              >
                                <PencilIcon className="ml-2 size-5" />
                                {t('menu.edit')}
                              </button>
                            </li>
                            <li className="m-0 hidden py-1">
                              <button
                                className="pl-0"
                                onClick={(): void => {
                                  // eslint-disable-next-line no-console
                                  console.log('send contact')
                                }}
                              >
                                <DevicePhoneMobileIcon className="ml-2 size-5" />
                                {t('menu.sendContact')}
                              </button>
                            </li>
                            <li className="m-0 hidden py-1">
                              <button
                                className="pl-0"
                                onClick={(): void => {
                                  // eslint-disable-next-line no-console
                                  console.log('delete')
                                }}
                              >
                                <TrashIcon className="ml-2 size-5" />
                                {t('menu.delete')}
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

Publishers.displayName = 'Publishers'
