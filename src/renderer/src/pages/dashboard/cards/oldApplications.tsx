import { useEffect, useState }           from 'react'
import { useTranslation }                from 'react-i18next'
import { ArrowPathIcon, TrashIcon }      from '@heroicons/react/16/solid'
import { Card2 }                         from '@renderer/components/Card2'
import { useConfirmationModalContext }   from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import type { PublisherWithApplication } from 'src/types/models'

export default function OldApplications(): JSX.Element | null {
  const { t }                       = useTranslation()
  const [publishers, setPublishers] = useState<PublisherWithApplication[]>([])
  const [loading, setLoading]       = useState(true)
  const [reload, setReload]         = useState(true)
  const confirmContext              = useConfirmationModalContext()

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-inactive-applications').then((result) => {
      setPublishers(result)
      setLoading(false)
      setReload(false)
    })
  }, [reload])

  const renewApplication = async (id: string, type: string): Promise<void> => {
    const result = await confirmContext.showConfirmation(
      t('confirm.renewApplication.headline'),
      t('confirm.renewApplication.body'),
    )
    if (result) {
      window.electron.ipcRenderer.invoke('renew-application', { id, type }).then(() => {
        setReload(true)
      })
    }
  }

  const deleteApplication = async (id: string, type: string): Promise<void> => {
    const result = await confirmContext.showConfirmation(
      t('confirm.deleteApplication.headline'),
      t('confirm.deleteApplication.body'),
    )
    if (result) {
      window.electron.ipcRenderer.invoke('delete-application', { id, type }).then(() => {
        setReload(true)
      })
    }
  }

  if (!publishers.length)
    return null

  return (
    <Card2 title={t('label.wthOldApplications')} loading={loading}>
      {loading
        ? (
          <div className="aspect-square w-full rounded-md bg-slate-200" />
          )
        : (
          <div className="w-full">
            <table className="table table-zebra -mt-2 w-full">
              <thead>
                <tr>
                  <th>{t('label.name')}</th>
                  <th>{t('label.application')}</th>
                  <th>{t('label.latestApprovalDate')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {publishers.map((publisherModel, index) => {
                  return (
                    <tr key={index}>
                      <td>{publisherModel.name}</td>
                      <td>{publisherModel.applicationType}</td>
                      <td>{publisherModel.applicationDate}</td>
                      <td className="flex justify-end space-x-4">
                        <div className="tooltip" data-tip={t('tooltip.renewApplication')}>
                          <button
                            className="btn btn-circle btn-outline btn-xs"
                            onClick={(): void => {
                              renewApplication(publisherModel.id, publisherModel.applicationType)
                            }}
                          >
                            <ArrowPathIcon className="size-4" />
                          </button>
                        </div>
                        <div className="tooltip" data-tip={t('tooltip.deleteApplication')}>
                          <button
                            className="btn btn-circle btn-outline btn-xs"
                            onClick={(): void => {
                              deleteApplication(publisherModel.id, publisherModel.applicationType)
                            }}
                          >
                            <TrashIcon className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          )}
    </Card2>
  )
}
