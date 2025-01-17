import { useEffect, useState }                                           from 'react'
import { useTranslation }                                                from 'react-i18next'
import { BoltIcon, SparklesIcon, TrashIcon }                             from '@heroicons/react/16/solid'
import { useConfirmationModalContext }                                   from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import type { MailResponse }                                             from 'src/types/models'
import { DashboardCard }                                                 from '@renderer/components/DashboardCard'
import { Heading }                                                       from '@renderer/components/catalyst/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@renderer/components/catalyst/table'
import { Badge }                                                         from '@renderer/components/catalyst/badge'

export default function MailResponses(): JSX.Element | null {
  const { t }                     = useTranslation()
  const [responses, setResponses] = useState<MailResponse[]>([])
  const [reload, setReload]       = useState(true)
  const confirmContext            = useConfirmationModalContext()

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-mail-responses').then((result) => {
      setResponses(result)
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
    <DashboardCard className="col-span-full">
      <Heading>{t('label.mailResponses')}</Heading>
      <Table dense grid striped className="max-w-full">
        <TableHead>
          <TableRow>
            <TableHeader>{t('label.email')}</TableHeader>
            <TableHeader>{t('label.event')}</TableHeader>
            <TableHeader>{t('label.description')}</TableHeader>
            <TableHeader>{t('label.createdAt')}</TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {responses.map((response, index) => {
            const date = new Date(response.created_at).toLocaleDateString('sv')
            const time = new Date(response.created_at).toLocaleTimeString('sv')
            return (
              <TableRow key={index}>
                <TableCell className="items-center">{response.publisher_email}</TableCell>
                <TableCell className="items-center"><Badge color="red">{response.event}</Badge></TableCell>
                <TableCell className="items-center text-wrap">{response.description}</TableCell>
                <TableCell className="items-center">{`${date} ${time}`}</TableCell>
                <TableCell className="items-center">
                  <div className="flex w-full justify-end space-x-4">
                    <div title={t('tooltip.waitingForFix')} className={response.fix ? 'block' : 'hidden'}>
                      <SparklesIcon className="size-4 text-yellow-600" />
                    </div>
                    <button
                      className="cursor-default"
                      onClick={(): void => {
                        fixResponse(response.publisher_email)
                      }}
                      disabled={response.fix}
                    >
                      <BoltIcon className="size-4" />
                    </button>
                    <button
                      className="cursor-default"
                      onClick={(): void => {
                        deleteResponse(response.publisher_email)
                      }}
                      disabled={response.fix}
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>

                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </DashboardCard>
  )
}
