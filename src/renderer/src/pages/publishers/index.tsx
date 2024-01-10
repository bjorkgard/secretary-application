import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/24/solid'
import {
  DevicePhoneMobileIcon,
  DocumentArrowDownIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon as PlusIconSmall
} from '@heroicons/react/20/solid'
import { formatPhoneNumber } from 'react-phone-number-input'
import { PublisherModel, ServiceGroupModel } from 'src/types/models'
import ROUTES from '../../constants/routes.json'
import { isTemplateCorrect } from '@renderer/utils/isTemplateCorrect'
import EventModal from './components/eventModal'

export default function Publishers(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [publishers, setPublishers] = useState<PublisherModel[]>([])
  const [publisher, setPublisher] = useState<PublisherModel>()
  const [openEventModal, setOpenEventModal] = useState<boolean>(false)
  const [serviceGroups, setServiceGroups] = useState<ServiceGroupModel[]>([])
  const [hasS21, setHasS21] = useState<boolean>(false)

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
    getServiceGroups()
    getPublishers()
    isTemplateCorrect('S-21').then((result) => {
      setHasS21(result)
    })
  }, [])

  const editPublisher = (id: string | undefined): void => {
    if (id) {
      navigate(`${ROUTES.PUBLISHERS}/${id}/edit`)
    }
  }

  const exportS21 = (id: string | undefined): void => {
    if (id) {
      window.electron.ipcRenderer.send('export-s21', id)
    }
  }

  const addEvent = (id: string | undefined): void => {
    if (id) {
      setPublisher(publishers.find((p) => p._id === id))
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
        refresh={function (): void {
          getPublishers()
          setOpenEventModal(false)
        }}
      />
      <div className="flex h-full flex-col">
        <div className="flex justify-between">
          <h1>{t('publishers.headline')}</h1>
          <div className="tooltip tooltip-left" data-tip={t('label.addPublisher')}>
            <button
              className="btn btn-circle btn-outline"
              onClick={(): void => navigate(ROUTES.PUBLISHER_PERSONAL_FORM)}
            >
              <PlusIcon className="h-6 w-6" />
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
                const serviceGroup = serviceGroups.find((sg) => sg._id === publisher.serviceGroupId)
                const appointments =
                  publisher.appointments.map((a) => `badge.short.${a.type.toLowerCase()}`) || []
                return (
                  <tr key={publisher._id} className="hover">
                    <td>
                      {appointments.map((appointment) => {
                        return (
                          <div className="badge badge-primary badge-sm mr-1" key={appointment}>
                            {t(appointment)}
                          </div>
                        )
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
                            <EllipsisHorizontalIcon className="h-4 w-4" />
                          </div>
                          <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content rounded-box w-52 z-10 border border-gray-900/10 dark:border-slate-400/50 shadow-xl dark:bg-slate-800 bg-gray-50"
                          >
                            <li className="m-0 py-1 menu-title">
                              {publisher.firstname} {publisher.lastname}
                            </li>
                            <li className="m-0 py-1">
                              <button
                                className="pl-0"
                                onClick={(): void => {
                                  addEvent(publisher._id)
                                }}
                              >
                                <PlusIconSmall className="h-5 w-5 ml-2" />
                                {t('menu.event')}
                              </button>
                            </li>
                            <li className="m-0 py-1">
                              <button
                                className="pl-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={(): void => {
                                  exportS21(publisher._id)
                                }}
                                disabled={!hasS21}
                              >
                                <DocumentArrowDownIcon className="h-5 w-5 ml-2" />
                                {t('menu.s21')}
                              </button>
                            </li>
                            <li className="m-0 py-1">
                              <button
                                className="pl-0"
                                onClick={(): void => {
                                  editPublisher(publisher._id)
                                }}
                              >
                                <PencilIcon className="h-5 w-5 ml-2" />
                                {t('menu.edit')}
                              </button>
                            </li>
                            <li className="m-0 py-1 hidden">
                              <button
                                className="pl-0"
                                onClick={(): void => {
                                  console.log('send contact')
                                }}
                              >
                                <DevicePhoneMobileIcon className="h-5 w-5 ml-2" />
                                {t('menu.sendContact')}
                              </button>
                            </li>
                            <li className="m-0 py-1 hidden">
                              <button
                                className="pl-0"
                                onClick={(): void => {
                                  console.log('export s21')
                                }}
                              >
                                <TrashIcon className="h-5 w-5 ml-2" />
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
