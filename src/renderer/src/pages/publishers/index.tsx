import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/24/solid'
import { PencilIcon } from '@heroicons/react/20/solid'
import { formatPhoneNumber } from 'react-phone-number-input'
import { PublisherModel, ServiceGroupModel } from 'src/types/models'
import ROUTES from '../../constants/routes.json'

export default function Publishers(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [publishers, setPublishers] = useState<PublisherModel[]>([])
  const [serviceGroups, setServiceGroups] = useState<ServiceGroupModel[]>([])

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
  }, [])

  const editPublisher = (id: string | undefined): void => {
    if (id) {
      navigate(`${ROUTES.PUBLISHERS}/${id}/edit`)
    }
  }

  return (
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
                      <div className="tooltip tooltip-left" data-tip={t('tooltip.editPublisher')}>
                        <button
                          className="btn btn-circle btn-outline btn-xs"
                          onClick={(): void => {
                            editPublisher(publisher._id)
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
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
  )
}

Publishers.displayName = 'Publishers'
