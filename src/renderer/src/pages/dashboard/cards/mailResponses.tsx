import { useEffect, useState }               from 'react'
import { useTranslation }                    from 'react-i18next'
import { BoltIcon, SparklesIcon, TrashIcon } from '@heroicons/react/16/solid'
import { Card2 }                             from '@renderer/components/Card2'
import { useConfirmationModalContext }       from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import type { MailResponse }                 from 'src/types/models'

export default function MailResponses(): JSX.Element | null {
  const { t }                     = useTranslation()
  const [responses, setResponses] = useState<MailResponse[]>([])
  const [loading, setLoading]     = useState(true)
  const [reload, setReload]       = useState(true)
  const confirmContext            = useConfirmationModalContext()

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-mail-responses').then((result) => {
      setResponses(result)
      setLoading(false)
      setReload(false)
    })
  }, [reload])

  const fixResponse = async (email: string): Promise<void> => {
    const result = await confirmContext.showConfirmation(
      t('confirm.fixWarning.headline'),
      t('confirm.fixWarning.body'),
    )
    if (result) {
      window.electron.ipcRenderer.invoke('fix-mail-response', { email }).then(() => {
        setReload(true)
      })
    }
  }

  const deleteResponse = async (email: string): Promise<void> => {
    const result = await confirmContext.showConfirmation(
      t('confirm.deleteWarning.headline'),
      t('confirm.deleteWarning.body'),
    )
    if (result) {
      window.electron.ipcRenderer.invoke('delete-mail-response', { email }).then(() => {
        setReload(true)
      })
    }
  }

  if (!responses.length)
    return null

  return (
    <Card2 title={t('label.mailResponses')} loading={loading}>
      {loading
        ? (
            <div className="aspect-square w-full rounded-md bg-slate-200" />
          )
        : (
            <div className="w-full">
              <table className="table table-zebra -mt-2 w-full">
                <thead>
                  <tr>
                    <th>{t('label.email')}</th>
                    <th>{t('label.event')}</th>
                    <th>{t('label.description')}</th>
                    <th>{t('label.createdAt')}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response, index) => {
                    const date = new Date(response.created_at).toLocaleDateString('sv')
                    const time = new Date(response.created_at).toLocaleTimeString('sv')
                    return (
                      <tr key={index}>
                        <td>{response.publisher_email}</td>
                        <td>{response.event}</td>
                        <td>{response.description}</td>
                        <td>{`${date} ${time}`}</td>
                        <td className="flex justify-end space-x-4">
                          <div className="tooltip" data-tip={t('tooltip.waitingForFix')}>
                            <SparklesIcon className="size-4 text-yellow-600" />
                          </div>
                          <div className="tooltip" data-tip={t('tooltip.fixWarning')}>
                            <button
                              className="btn btn-circle btn-outline btn-xs"
                              onClick={(): void => {
                                fixResponse(response.publisher_email)
                              }}
                              disabled={response.fix}
                            >
                              <BoltIcon className="size-4" />
                            </button>
                          </div>
                          <div className="tooltip" data-tip={t('tooltip.deleteWarning')}>
                            <button
                              className="btn btn-circle btn-outline btn-xs"
                              onClick={(): void => {
                                deleteResponse(response.publisher_email)
                              }}
                              disabled={response.fix}
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
