import { useEffect, useState }             from 'react'
import { useTranslation }                  from 'react-i18next'
import type { Meeting, ServiceMonthModel } from 'src/types/models'

interface ReportData {
  type:    string
  reports: number
  studies: number
  hours:   number
}

export default function HistoryCongregation(): JSX.Element {
  const { t }                                           = useTranslation()
  const [serviceMonths, setServiceMonths]               = useState<ServiceMonthModel[]>([])
  const [selectedServiceMonth, setSelectedServiceMonth] = useState<ServiceMonthModel>()
  const [publisherReport, setPublisherReport]           = useState<ReportData>({ type: t('label.publishers'), reports: 0, studies: 0, hours: 0 })
  const [auxiliaryReport, setAuxiliaryReport]           = useState<ReportData>({ type: t('label.auxiliaries'), reports: 0, studies: 0, hours: 0 })
  const [pioneerReport, setPioneerReport]               = useState<ReportData>({ type: t('label.pioneers'), reports: 0, studies: 0, hours: 0 })
  const [missionaryReport, setMissionaryReport]         = useState<ReportData>({ type: t('label.missionaries'), reports: 0, studies: 0, hours: 0 })
  const [specialPioneerReport, setSpecialPioneerReport] = useState<ReportData>({ type: t('label.specialPioneers'), reports: 0, studies: 0, hours: 0 })
  const [meetingHeadlines, setMeetingHeadlines]         = useState<string[]>([])
  const [meetingRows, setMeetingRows]                   = useState<string[][]>([])

  const setDefaultValues = () => {
    setPublisherReport({ type: t('label.publishers'), reports: 0, studies: 0, hours: 0 })
    setAuxiliaryReport({ type: t('label.auxiliaries'), reports: 0, studies: 0, hours: 0 })
    setPioneerReport({ type: t('label.pioneers'), reports: 0, studies: 0, hours: 0 })
    setMissionaryReport({ type: t('label.missionaries'), reports: 0, studies: 0, hours: 0 })
    setSpecialPioneerReport({ type: t('label.specialPioneers'), reports: 0, studies: 0, hours: 0 })
    setMeetingHeadlines([])
    setMeetingRows([])
  }

  useEffect(() => {
    setDefaultValues()
    window.electron.ipcRenderer
      .invoke('get-serviceMonths')
      .then((serviceMonths: ServiceMonthModel[]) => setServiceMonths(serviceMonths.reverse()))
  }, [])

  const exportSummary = (serviceMonth: string) => {
    if (serviceMonth !== '')
      window.electron.ipcRenderer.invoke('export-report-summary', { serviceMonth })
  }

  const createMeetingHeadlines = (meetings: Meeting[]): string[] => {
    const headlines: string[] = []
    headlines.push(t('meeting.headline').toUpperCase())
    meetings.forEach((meeting) => {
      headlines.push(
        meeting.name
          ? meeting.name
          : meetings.length > 1
            ? t('meeting.motherCongregationSimple')
            : t('label.total'),
      )
    })
    if (meetings.length > 1)
      headlines.push(t('label.total'))

    headlines.push(t('label.average'))

    return headlines
  }

  const createMeetingRows = (meetings: Meeting[]): string[][] => {
    let sumMidweek         = 0
    let sumWeekend         = 0
    const rows: string[][] = []
    const row1: string[]   = []
    const row2: string[]   = []
    row1.push(t('label.midweekMeeting'))
    meetings.forEach((meeting) => {
      sumMidweek += meeting.midweek.reduce((acc, value) => acc + value, 0)
      row1.push(meeting.midweek.reduce((acc, value) => acc + value, 0).toLocaleString() || '0')
    })
    row1.push(sumMidweek.toLocaleString())
    row1.push(Math.round(sumMidweek / meetings[0].midweek.length).toLocaleString())
    rows.push(row1)

    row2.push(t('label.weekendMeeting'))
    meetings.forEach((meeting) => {
      sumWeekend += meeting.weekend.reduce((acc, value) => acc + value, 0)
      row2.push(meeting.weekend.reduce((acc, value) => acc + value, 0).toLocaleString() || '0')
    })
    row2.push(sumWeekend.toLocaleString())
    row2.push(Math.round(sumWeekend / meetings[0].weekend.length).toLocaleString())
    rows.push(row2)

    return rows
  }

  useEffect(() => {
    if (selectedServiceMonth) {
      setMeetingHeadlines(createMeetingHeadlines(selectedServiceMonth.meetings))
      setMeetingRows(createMeetingRows(selectedServiceMonth.meetings))

      selectedServiceMonth.reports.forEach((report) => {
        if (report.hasBeenInService) {
          switch (report.type) {
            case 'PUBLISHER':
              if (!report.auxiliary) {
                setPublisherReport(prevState => ({
                  ...prevState,
                  reports: prevState.reports + 1,
                  studies: prevState.studies + (report.studies || 0),
                }))
              }
              else {
                setAuxiliaryReport(prevState => ({
                  ...prevState,
                  reports: prevState.reports + 1,
                  studies: prevState.studies + (report.studies || 0),
                  hours:   prevState.hours + (report.hours || 0),
                }))
              }

              break
            case 'AUXILIARY':
              setAuxiliaryReport(prevState => ({
                ...prevState,
                reports: prevState.reports + 1,
                studies: prevState.studies + (report.studies || 0),
                hours:   prevState.hours + (report.hours || 0),
              }))
              break
            case 'PIONEER':
              setPioneerReport(prevState => ({
                ...prevState,
                reports: prevState.reports + 1,
                studies: prevState.studies + (report.studies || 0),
                hours:   prevState.hours + (report.hours || 0),
              }))
              break
            case 'SPECIALPIONEER':
              setSpecialPioneerReport(prevState => ({
                ...prevState,
                reports: prevState.reports + 1,
                studies: prevState.studies + (report.studies || 0),
                hours:   prevState.hours + (report.hours || 0),
              }))
              break
            case 'MISSIONARY':
              setMissionaryReport(prevState => ({
                ...prevState,
                reports: prevState.reports + 1,
                studies: prevState.studies + (report.studies || 0),
                hours:   prevState.hours + (report.hours || 0),
              }))
              break

            default:
              break
          }
        }
      })
    }
    else {
      setDefaultValues()
    }
  }, [selectedServiceMonth])

  const selectServiceMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDefaultValues()
    if (e.target.value !== '')
      setSelectedServiceMonth(serviceMonths.find(sm => sm._id === e.target.value))

    else
      setSelectedServiceMonth(undefined)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between">
        <h1>{t('history.congregation')}</h1>

        <div className="flex space-x-4">
          <button className="btn btn-primary" onClick={() => {}}>{t('label.add')}</button>

          <select className="select select-bordered w-fit" onChange={selectServiceMonth}>
            <option value="">{t('label.selectServiceMonth')}</option>
            {serviceMonths.map((sm) => {
              if (sm.status === 'ACTIVE')
                return null

              return (
                <option key={sm._id} value={sm._id}>
                  {sm.serviceMonth}
                </option>
              )
            })}
          </select>
        </div>

      </div>

      {selectedServiceMonth && (
        <>
          <div className="w-full">
            <table className="table -mt-2 w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>{t('label.noReports')}</th>
                  <th>{t('label.studies')}</th>
                  <th>{t('label.hours')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>{publisherReport.type}</th>
                  <td>{Math.round(publisherReport.reports)}</td>
                  <td>{Math.round(publisherReport.studies)}</td>
                  <td></td>
                </tr>
                <tr>
                  <th>{auxiliaryReport.type}</th>
                  <td>{Math.round(auxiliaryReport.reports)}</td>
                  <td>{Math.round(auxiliaryReport.studies)}</td>
                  <td>{Math.round(auxiliaryReport.hours)}</td>
                </tr>
                <tr>
                  <th>{pioneerReport.type}</th>
                  <td>{Math.round(pioneerReport.reports)}</td>
                  <td>{Math.round(pioneerReport.studies)}</td>
                  <td>{Math.round(pioneerReport.hours)}</td>
                </tr>
                <tr>
                  <th>{specialPioneerReport.type}</th>
                  <td>{Math.round(specialPioneerReport.reports)}</td>
                  <td>{Math.round(specialPioneerReport.studies)}</td>
                  <td>{Math.round(specialPioneerReport.hours)}</td>
                </tr>
                <tr>
                  <th>{missionaryReport.type}</th>
                  <td>{Math.round(missionaryReport.reports)}</td>
                  <td>{Math.round(missionaryReport.studies)}</td>
                  <td>{Math.round(missionaryReport.hours)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>{t('label.total')}</th>
                  <td>{Math.round(publisherReport.reports + auxiliaryReport.reports + pioneerReport.reports + specialPioneerReport.reports + missionaryReport.reports)}</td>
                  <td>{Math.round(publisherReport.studies + auxiliaryReport.studies + pioneerReport.studies + specialPioneerReport.studies + missionaryReport.studies)}</td>
                  <td>{Math.round(auxiliaryReport.hours + pioneerReport.hours + specialPioneerReport.hours + missionaryReport.hours)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="divider mb-6"></div>

          <div className="w-full">
            <table className="table -mt-2 w-full">
              <thead>
                <tr>
                  {meetingHeadlines.map((headline, index) => {
                    return (
                      <th key={`headline-${index}`}>{headline}</th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {meetingRows.map((row, rowIndex) => {
                  return (
                    <tr key={`row-${rowIndex}`}>
                      {row.map((cell, index) => {
                        return (
                          <td key={`cell-${rowIndex}-${index}`}>{cell}</td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between">
            {selectedServiceMonth && (
              <button className="btn btn-primary" onClick={() => {}}>{t('label.edit')}</button>
            )}
            {selectedServiceMonth && (
              <button className="btn btn-primary" onClick={() => exportSummary(selectedServiceMonth?.serviceMonth || '')}>{t('label.export')}</button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
