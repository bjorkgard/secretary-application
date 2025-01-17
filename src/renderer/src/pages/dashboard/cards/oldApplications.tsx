import { useEffect, useState }                                           from 'react'
import { useTranslation }                                                from 'react-i18next'
import { ArrowPathIcon, TrashIcon }                                      from '@heroicons/react/16/solid'
import { useConfirmationModalContext }                                   from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import type { PublisherWithApplication }                                 from 'src/types/models'
import { DashboardCard }                                                 from '@renderer/components/DashboardCard'
import { Heading }                                                       from '@renderer/components/catalyst/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@renderer/components/catalyst/table'

export default function OldApplications(): JSX.Element | null {
  const { t }                       = useTranslation()
  const [publishers, setPublishers] = useState<PublisherWithApplication[]>([])
  const [reload, setReload]         = useState(true)
  const confirmContext              = useConfirmationModalContext()

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-inactive-applications').then((result) => {
      setPublishers(result)
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
    <DashboardCard className="col-span-2 xl:col-span-12 2xl:col-span-6">
      <Heading>{t('label.wthOldApplications')}</Heading>
      <Table dense striped grid>
        <TableHead>
          <TableRow>
            <TableHeader>{t('label.name')}</TableHeader>
            <TableHeader>{t('label.application')}</TableHeader>
            <TableHeader>{t('label.latestApprovalDate')}</TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {publishers.map((publisherModel, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{publisherModel.name}</TableCell>
                <TableCell>{publisherModel.applicationType}</TableCell>
                <TableCell>{publisherModel.applicationDate}</TableCell>
                <TableCell className="flex justify-end space-x-4">
                  <span
                    onClick={(): void => {
                      renewApplication(publisherModel.id, publisherModel.applicationType)
                    }}
                  >
                    <ArrowPathIcon className="size-4" />
                  </span>
                  <span
                    onClick={(): void => {
                      deleteApplication(publisherModel.id, publisherModel.applicationType)
                    }}
                  >
                    <TrashIcon className="size-4" />
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </DashboardCard>
  )
}
