import { useEffect, useState }                                           from 'react'
import { useTranslation }                                                from 'react-i18next'
import type { ExportModel }                                              from 'src/types/models'
import { ArrowDownTrayIcon }                                             from '@heroicons/react/20/solid'
import { DashboardCard }                                                 from '@renderer/components/DashboardCard'
import { Heading }                                                       from '@renderer/components/catalyst/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@renderer/components/catalyst/table'

export default function CommonExports(): JSX.Element | null {
  const { t }                 = useTranslation()
  const [exports, setExports] = useState<ExportModel[]>([])
  const [reload, setReload]   = useState(true)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('common-exports').then((result) => {
      setExports(result)
      setReload(false)
    })
  }, [reload])

  if (!exports.length)
    return null

  return (
    <DashboardCard className="col-span-2 xl:col-span-12 2xl:col-span-6">
      <Heading>{t('label.commonExports')}</Heading>
      <Table dense striped grid>
        <TableHead>
          <TableRow>
            <TableHeader></TableHeader>
            <TableHeader>{t('label.type')}</TableHeader>
            <TableHeader>{t('label.format')}</TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {exports.map((exportModel) => {
            return (
              <TableRow key={exportModel._id}>
                <TableCell>{exportModel.count}</TableCell>
                <TableCell>{t(`label.${exportModel.name.toLowerCase()}`)}</TableCell>
                <TableCell>{exportModel.format}</TableCell>
                <TableCell className="flex justify-end space-x-4">
                  <span
                    className="btn btn-circle btn-outline btn-xs"
                    onClick={(): void => {
                      window.electron.ipcRenderer.send(exportModel.method)
                      setReload(true)
                    }}
                  >
                    <ArrowDownTrayIcon className="size-4" />
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
