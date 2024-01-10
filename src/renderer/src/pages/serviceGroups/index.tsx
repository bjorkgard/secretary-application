import { useEffect, useState }                    from 'react'
import { useTranslation }                         from 'react-i18next'
import { useNavigate }                            from 'react-router-dom'
import { PlusIcon }                               from '@heroicons/react/24/solid'
import { PencilIcon, TrashIcon }                  from '@heroicons/react/20/solid'
import type { PublisherModel, ServiceGroupModel } from 'src/types/models'
import { useConfirmationModalContext }            from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import ROUTES                                     from '../../constants/routes.json'

export default function ServiceGroups(): JSX.Element {
  const { t }          = useTranslation()
  const navigate       = useNavigate()
  const confirmContext = useConfirmationModalContext()

  const [serviceGroups, setServiceGroups] = useState<ServiceGroupModel[]>([])
  const [responibles, setResponsibles]    = useState<PublisherModel[]>([])

  const getServiceGroups = (): void => {
    window.electron.ipcRenderer.invoke('get-serviceGroups').then((result: ServiceGroupModel[]) => {
      setServiceGroups(result)
    })
  }

  useEffect(() => {
    getServiceGroups()
  }, [])

  useEffect(() => {
    const respIds   = serviceGroups.map(serviceGroup => serviceGroup.responsibleId)
    const assistIds = serviceGroups.map(serviceGroup => serviceGroup.assistantId)
    let ids         = respIds.concat(assistIds.filter(item => !respIds.includes(item)))
    ids             = ids.filter(v => v !== undefined)

    window.electron.ipcRenderer
      .invoke('get-publishersByIds', { ids })
      .then((result: PublisherModel[]) => {
        setResponsibles(result)
      })
  }, [serviceGroups])

  const editServiceGroup = (id: string | undefined): void => {
    if (id)
      navigate(`${ROUTES.SERVICE_GROUPS}/${id}/edit`)
  }

  const deleteServiceGroup = async (id: string | undefined): Promise<void> => {
    if (id) {
      const result = await confirmContext.showConfirmation(
        t('serviceGroups.deleteConfirmation.headline'),
        t('serviceGroups.deleteConfirmation.body'),
      )
      if (result) {
        window.electron.ipcRenderer.invoke('delete-serviceGroup', id).then(() => {
          setServiceGroups(serviceGroups.filter(serviceGroup => serviceGroup._id !== id))
        })
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1>{t('serviceGroups.headline')}</h1>
        <div className="tooltip tooltip-left" data-tip={t('label.addServiceGroup')}>
          <button
            className="btn btn-circle btn-outline"
            onClick={(): void => navigate(`${ROUTES.SERVICE_GROUPS}/add`)}
          >
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>{t('serviceGroups.header.name')}</th>
              <th>{t('serviceGroups.header.responsible')}</th>
              <th>{t('serviceGroups.header.assistant')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {serviceGroups.map((serviceGroup) => {
              const responsible = responibles.find(r => r._id === serviceGroup.responsibleId)
              const assistant   = responibles.find(r => r._id === serviceGroup.assistantId)
              return (
                <tr key={serviceGroup._id} className="hover">
                  <td>{serviceGroup.name}</td>
                  <td>
                    {responsible?.firstname}
                    {' '}
                    {responsible?.lastname}
                  </td>
                  <td>
                    {assistant?.firstname}
                    {' '}
                    {assistant?.lastname}
                  </td>
                  <td>
                    <div className="flex justify-end space-x-4">
                      <div
                        className="tooltip tooltip-left"
                        data-tip={t('tooltip.editServiceGroup')}
                      >
                        <button
                          className="btn btn-circle btn-outline btn-xs"
                          onClick={(): void => {
                            editServiceGroup(serviceGroup._id)
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div
                        className="tooltip tooltip-left"
                        data-tip={t('tooltip.deleteServiceGroup')}
                      >
                        <button
                          className="btn btn-circle btn-outline btn-xs"
                          onClick={(): void => {
                            deleteServiceGroup(serviceGroup._id)
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
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

ServiceGroups.displayName = 'Service Groups'
