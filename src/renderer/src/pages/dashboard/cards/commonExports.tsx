import { useEffect, useState } from 'react'
import { useTranslation }      from 'react-i18next'
import { Card2 }               from '@renderer/components/Card2'
import type { ExportModel }    from 'src/types/models'
import { ArrowDownTrayIcon }   from '@heroicons/react/20/solid'

export default function CommonExports(): JSX.Element | null {
  const { t }                 = useTranslation()
  const [exports, setExports] = useState<ExportModel[]>([])
  const [loading, setLoading] = useState(true)
  const [reload, setReload]   = useState(true)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('common-exports').then((result) => {
      setExports(result)
      setLoading(false)
      setReload(false)
    })
  }, [reload])

  if (!exports.length)
    return null

  return (
    <Card2 title={t('label.commonExports')} loading={loading}>
      {loading
        ? (
          <div className="aspect-square w-full rounded-md bg-slate-200" />
          )
        : (
          <div className="w-full">
            <table className="table table-zebra -mt-2 w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>{t('label.type')}</th>
                  <th>{t('label.format')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {exports.map((exportModel) => {
                  return (
                    <tr key={exportModel._id}>
                      <th>{exportModel.count}</th>
                      <td>
                        <div
                          className="tooltip"
                          data-tip={t('tooltip.latestExport', { date: exportModel.updatedAt })}
                        >
                          {t(`label.${exportModel.name.toLowerCase()}`)}
                        </div>
                      </td>
                      <td>{exportModel.format}</td>
                      <td>
                        <div className="tooltip" data-tip={t('tooltip.export')}>
                          <button
                            className="btn btn-circle btn-outline btn-xs"
                            onClick={(): void => {
                              window.electron.ipcRenderer.send(exportModel.method)
                              setReload(true)
                            }}
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
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
