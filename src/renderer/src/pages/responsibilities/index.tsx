import { useEffect, useState }         from 'react'
import { useTranslation }              from 'react-i18next'
import { useNavigate }                 from 'react-router-dom'
import { PlusIcon }                    from '@heroicons/react/24/solid'
import { PencilIcon, TrashIcon }       from '@heroicons/react/20/solid'
import type { ResponsibilityModel }    from 'src/types/models'
import { useConfirmationModalContext } from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import ROUTES                          from '../../constants/routes.json'

export default function Responsibilities(): JSX.Element {
  const { t }          = useTranslation()
  const navigate       = useNavigate()
  const confirmContext = useConfirmationModalContext()

  const [responsibilities, setResponsibilities] = useState<ResponsibilityModel[]>([])

  const getResponsibilities = (): void => {
    window.electron.ipcRenderer
      .invoke('get-responsibilities')
      .then((result: ResponsibilityModel[]) => {
        const parsedResult = result.map((resp) => {
          return { ...resp, name: resp.default ? t(resp.name) : resp.name }
        })

        setResponsibilities(
          parsedResult.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)),
        )
      })
  }

  useEffect(() => {
    getResponsibilities()
  }, [])

  const editResponsibility = (id: string | undefined): void => {
    if (id)
      navigate(`${ROUTES.RESPONSIBILITIES}/${id}/edit`)
  }

  const deleteResponsibility = async (id: string | undefined): Promise<void> => {
    if (id) {
      const result = await confirmContext.showConfirmation(
        t('responsibilities.deleteConfirmation.headline'),
        t('responsibilities.deleteConfirmation.body'),
      )
      if (result) {
        window.electron.ipcRenderer.invoke('delete-responsibility', id).then(() => {
          setResponsibilities(responsibilities.filter(resp => resp._id !== id))
        })
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1>{t('responsibilities.headline')}</h1>
        <div className="tooltip tooltip-left" data-tip={t('label.addResponsibility')}>
          <button
            className="btn btn-circle btn-outline"
            onClick={(): void => navigate(`${ROUTES.RESPONSIBILITIES}/add`)}
          >
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-900 dark:text-slate-300">
              {t('responsibilities.description')}
            </p>
          </div>
          <div className="w-full md:col-span-2">
            <table className="table table-zebra mt-0">
              <thead>
                <tr>
                  <th>{t('responsibilities.header.name')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {responsibilities.map((resp) => {
                  return (
                    <tr key={resp._id} className="hover">
                      <td>{resp.name}</td>

                      <td>
                        <div className="flex justify-end space-x-4">
                          <div
                            className="tooltip tooltip-left"
                            data-tip={t('tooltip.editResponsibility')}
                          >
                            <button
                              className="btn btn-circle btn-outline btn-xs"
                              onClick={(): void => {
                                editResponsibility(resp._id)
                              }}
                              disabled={resp.default}
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
                                deleteResponsibility(resp._id)
                              }}
                              disabled={resp.default}
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
      </div>
    </div>
  )
}

Responsibilities.displayName = 'Responsibilities'
