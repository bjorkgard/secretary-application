import { useEffect, useState }                                           from 'react'
import { useTranslation }                                                from 'react-i18next'
import { useNavigate }                                                   from 'react-router-dom'
import { PencilIcon }                                                    from '@heroicons/react/16/solid'
import type { PublisherModel }                                           from 'src/types/models'
import { DashboardCard }                                                 from '@renderer/components/DashboardCard'
import { Heading }                                                       from '@renderer/components/catalyst/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@renderer/components/catalyst/table'
import ROUTES                                                            from '../../../constants/routes.json'

export default function WithOutServiceGroup(): JSX.Element | null {
  const { t }                       = useTranslation()
  const navigate                    = useNavigate()
  const [publishers, setPublishers] = useState<PublisherModel[]>([])
  const [reload, setReload]         = useState(true)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('temporary-servicegroup').then((result) => {
      setPublishers(result)
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
    <DashboardCard className="col-span-2 xl:col-span-8 2xl:col-span-6">
      <Heading>{t('label.withoutServiceGroup')}</Heading>
      <Table dense striped grid>
        <TableHead>
          <TableRow>
            <TableHeader>{t('label.lastname')}</TableHeader>
            <TableHeader>{t('label.firstname')}</TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {publishers.map((publisherModel) => {
            return (
              <TableRow key={publisherModel._id}>
                <TableCell>{publisherModel.lastname}</TableCell>
                <TableCell>{publisherModel.firstname}</TableCell>
                <TableCell className="flex justify-end space-x-4">
                  <span
                    onClick={(): void => {
                      editPublisher(publisherModel._id)
                    }}
                  >
                    <PencilIcon className="size-4" />
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
