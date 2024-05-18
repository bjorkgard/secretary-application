import { useEffect, useState } from 'react'
import { useTranslation }      from 'react-i18next'
import { useNavigate }         from 'react-router-dom'
import { PencilIcon }          from '@heroicons/react/20/solid'
import { Card2 }               from '@renderer/components/Card2'
import type { PublisherModel } from 'src/types/models'
import ROUTES                  from '../../../constants/routes.json'

export default function WithOutServiceGroup(): JSX.Element | null {
  const { t }                       = useTranslation()
  const navigate                    = useNavigate()
  const [publishers, setPublishers] = useState<PublisherModel[]>([])
  const [loading, setLoading]       = useState(true)
  const [reload, setReload]         = useState(true)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('temporary-servicegroup').then((result) => {
      setPublishers(result)
      setLoading(false)
      setReload(false)
    })
  }, [reload])

  const editPublisher = (id: string | undefined): void => {
    if (id)
      navigate(`${ROUTES.PUBLISHERS}/${id}/edit`)
  }

  if (!publishers.length)
    return null

  return (
    <Card2 title={t('label.withoutServiceGroup')} loading={loading}>
      {loading
        ? (
          <div className="aspect-square w-full rounded-md bg-slate-200" />
          )
        : (
          <div className="w-full">
            <table className="table table-zebra -mt-2 w-full">
              <thead>
                <tr>
                  <th>{t('label.lastname')}</th>
                  <th>{t('label.firstname')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {publishers.map((publisherModel) => {
                  return (
                    <tr key={publisherModel._id}>
                      <td>{publisherModel.lastname}</td>
                      <td>{publisherModel.firstname}</td>
                      <td>
                        <div className="tooltip" data-tip={t('tooltip.editPublisher')}>
                          <button
                            className="btn btn-circle btn-outline btn-xs"
                            onClick={(): void => {
                              editPublisher(publisherModel._id)
                            }}
                          >
                            <PencilIcon className="size-4" />
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
