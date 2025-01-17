import { CheckCircleIcon, PencilIcon, TrashIcon }                        from '@heroicons/react/16/solid'
import { useEffect, useState }                                           from 'react'
import { useTranslation }                                                from 'react-i18next'
import type { PublisherModel, Report }                                   from 'src/types/models'
import { useConfirmationModalContext }                                   from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import { Fieldset }                                                      from '@renderer/components/catalyst/fieldset'
import { Heading }                                                       from '@renderer/components/catalyst/heading'
import { Button }                                                        from '@renderer/components/catalyst/button'
import { PlusIcon, XCircleIcon }                                         from '@heroicons/react/20/solid'
import { Select }                                                        from '@renderer/components/catalyst/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@renderer/components/catalyst/table'
import AddReportModal                                                    from './components/addReportModal'
import EditReportModal                                                   from './components/editReportModal'

export default function HistoryPublishers(): JSX.Element {
  const { t }                                         = useTranslation()
  const [publishers, setPublishers]                   = useState<PublisherModel[]>([])
  const [selectedPublisher, setSelectedPublisher]     = useState<PublisherModel>()
  const [reports, setReports]                         = useState<Report[]>()
  const [openAddReportModal, setOpenAddReportModal]   = useState<boolean>(false)
  const [openEditReportModal, setOpenEditReportModal] = useState<boolean>(false)
  const [selectedReport, setSelectedReport]           = useState<Report>()

  const confirmContext = useConfirmationModalContext()

  const getPublishers = (publisherId?: string) => {
    window.electron.ipcRenderer
      .invoke('get-publishers', { sortfield: 'LASTNAME' })
      .then((publishers: PublisherModel[]) => {
        setPublishers(publishers)

        if (publisherId) {
          // refresh selected publisher and reports
          setSelectedPublisher(publishers.find(p => p._id === publisherId))
          setReports(publishers.find(p => p._id === publisherId)?.reports.sort((a, b) => b.serviceYear - a.serviceYear || b.sortOrder - a.sortOrder))
        }
      })
  }

  useEffect(() => {
    getPublishers()
  }, [])

  const selectPublisher = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== '') {
      setSelectedPublisher(publishers.find(p => p._id === e.target.value))

      setReports(publishers.find(p => p._id === e.target.value)?.reports.sort((a, b) => b.serviceYear - a.serviceYear || b.sortOrder - a.sortOrder))
    }

    else {
      setSelectedPublisher(undefined)
      setReports(undefined)
    }
  }

  const editReport = (identifier: string) => {
    setSelectedReport(reports?.find((r: Report) => r.identifier === identifier))
    setOpenEditReportModal(true)
  }

  const deleteReport = async (identifier: string) => {
    const result = await confirmContext.showConfirmation(
      t('publishers.deleteReport.headline'),
      t('publishers.deleteReport.body'),
    )
    if (result) {
      window.electron.ipcRenderer.invoke('delete-report', { publisherId: selectedPublisher?._id, identifier }).then(() => {
        getPublishers(selectedPublisher?._id)
      })
    }
  }

  const addReport = () => {
    setOpenAddReportModal(true)
  }

  return (
    <>
      <AddReportModal
        open={openAddReportModal}
        setOpen={function (open: boolean): void {
          setOpenAddReportModal(open)
        }}
        publisher={selectedPublisher}
        refresh={function (): void {
          getPublishers(selectedPublisher?._id)
          setOpenAddReportModal(false)
        }}
      />
      <EditReportModal
        open={openEditReportModal}
        setOpen={function (open: boolean): void {
          setOpenEditReportModal(open)
        }}
        report={selectedReport}
        publisherId={selectedPublisher?._id}
        refresh={function (): void {
          getPublishers(selectedPublisher?._id)
          setOpenEditReportModal(false)
        }}
      />

      <div>
        <Fieldset>
          <div className="flex justify-between">
            <Heading>{t('history.publisher')}</Heading>

            <div className="flex space-x-4">
              {selectedPublisher && (
                <div className="tooltip tooltip-left" data-tip={t('label.addReport')}>
                  <Button
                    onClick={() => addReport()}
                    color="blue"
                  >
                    <PlusIcon className="size-6 text-white" />
                    {t('label.addReport')}
                  </Button>
                </div>
              )}
              <div className="tooltip tooltip-left" data-tip={t('label.selectPublisher')}>
                <Select onChange={selectPublisher}>
                  <option value="">{t('label.selectPublisher')}</option>
                  {publishers.map((p) => {
                    return (
                      <option key={p._id} value={p._id}>
                        {`${p.lastname}, ${p.firstname}`}
                      </option>
                    )
                  })}
                </Select>
              </div>
            </div>
          </div>

          <div>
            {selectedPublisher && reports && (
              <Table dense bleed grid sticky striped className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
                <TableHead>
                  <TableRow>
                    <TableHeader>{t('label.month')}</TableHeader>
                    <TableHeader>{t('label.hasBeenInService')}</TableHeader>
                    <TableHeader>{t('label.studies')}</TableHeader>
                    <TableHeader>{t('label.auxiliary')}</TableHeader>
                    <TableHeader>{t('label.hours')}</TableHeader>
                    <TableHeader>{t('label.remarks')}</TableHeader>
                    <TableHeader>&nbsp;</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => {
                    return (
                      <TableRow key={report.identifier} className="hover">
                        <TableCell>{report.serviceMonth}</TableCell>
                        <TableCell>
                          {
                            report.hasBeenInService
                              ? <CheckCircleIcon className="size-5 text-green-500" />
                              : <XCircleIcon className="size-5 text-red-500" />
                          }
                        </TableCell>
                        <TableCell>{report.studies}</TableCell>
                        <TableCell>{report.auxiliary ? <CheckCircleIcon className="size-5 text-green-500" /> : ''}</TableCell>
                        <TableCell>{report.hours}</TableCell>
                        <TableCell>{report.remarks}</TableCell>
                        <TableCell className="flex justify-end">
                          <div className="tooltip tooltip-left" data-tip={t('label.editReport')}>
                            <Button
                              plain
                              onClick={() => editReport(report.identifier)}
                            >
                              <PencilIcon className="size-4" />
                            </Button>
                          </div>
                          <div className="tooltip tooltip-left" data-tip={t('label.deleteReport')}>
                            <Button
                              plain
                              onClick={() => deleteReport(report.identifier)}
                            >
                              <TrashIcon className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </div>

        </Fieldset>
      </div>
    </>
  )
}
