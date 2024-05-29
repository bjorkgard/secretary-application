import { PencilIcon }                  from '@heroicons/react/16/solid'
import { useEffect, useState }         from 'react'
import { useTranslation }              from 'react-i18next'
import type { PublisherModel, Report } from 'src/types/models'
import ReportModal                     from './components/reportModal'

export default function HistoryPublishers(): JSX.Element {
  const { t }                                     = useTranslation()
  const [publishers, setPublishers]               = useState<PublisherModel[]>([])
  const [selectedPublisher, setSelectedPublisher] = useState<PublisherModel>()
  const [reports, setReports]                     = useState<Report[]>()
  const [openReportModal, setOpenReportModal]     = useState<boolean>(false)
  const [selectedReport, setSelectedReport]       = useState<Report>()

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
    setOpenReportModal(true)
  }

  return (
    <>
      <ReportModal
        open={openReportModal}
        setOpen={function (open: boolean): void {
          setOpenReportModal(open)
        }}
        report={selectedReport}
        publisherId={selectedPublisher?._id}
        refresh={function (): void {
          getPublishers(selectedPublisher?._id)
          setOpenReportModal(false)
        }}
      />

      <div className="flex h-full flex-col">
        <div className="flex justify-between">
          <h1>{t('history.publisher')}</h1>

          <div className="flex space-x-4">
            <select className="select select-bordered w-fit" onChange={selectPublisher}>
              <option value="">{t('label.selectPublisher')}</option>
              {publishers.map((p) => {
                return (
                  <option key={p._id} value={p._id}>
                    {`${p.lastname}, ${p.firstname}`}
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        {selectedPublisher && reports && (
          <>
            <div className="w-full">
              <table className="table -mt-2 w-full">
                <thead>
                  <tr>
                    <th>{t('label.month')}</th>
                    <th>{t('label.hasBeenInService')}</th>
                    <th>{t('label.studies')}</th>
                    <th>{t('label.auxiliary')}</th>
                    <th>{t('label.hours')}</th>
                    <th>{t('label.remarks')}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => {
                    return (
                      <tr key={report.identifier}>
                        <th>{report.serviceMonth}</th>
                        <td>{report.hasBeenInService ? 'X' : ''}</td>
                        <td>{report.studies}</td>
                        <td>{report.auxiliary ? 'X' : ''}</td>
                        <td>{report.hours}</td>
                        <td>{report.remarks}</td>
                        <td>
                          <div className="tooltip tooltip-left" data-tip={t('label.editReport')}>
                            <button
                              className="btn btn-circle btn-ghost btn-sm"
                              onClick={() => editReport(report.identifier)}
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
          </>
        )}
      </div>
    </>
  )
}
