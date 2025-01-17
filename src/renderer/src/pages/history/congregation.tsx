import { PlusIcon }                                                                              from '@heroicons/react/24/solid'
import { Button }                                                                                from '@renderer/components/catalyst/button'
import { Divider }                                                                               from '@renderer/components/catalyst/divider'
import { Fieldset }                                                                              from '@renderer/components/catalyst/fieldset'
import { Heading }                                                                               from '@renderer/components/catalyst/heading'
import { Select }                                                                                from '@renderer/components/catalyst/select'
import { Table, TableBody, TableCell, TableFoot, TableFooter, TableHead, TableHeader, TableRow } from '@renderer/components/catalyst/table'
import { useEffect, useState }                                                                   from 'react'
import { useTranslation }                                                                        from 'react-i18next'
import type { Meeting, ServiceMonthModel }                                                       from 'src/types/models'

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
    <div>
      <Fieldset>
        <div className="flex justify-between">
          <Heading>{t('history.congregation')}</Heading>
          <div className="flex space-x-4">
            <div className="tooltip tooltip-left invisible" data-tip={t('label.add')}>
              <Button
                onClick={() => {}}
                color="blue"
              >
                <PlusIcon className="size-6 text-white" />
                {t('label.add')}
              </Button>
            </div>
            <div className="tooltip tooltip-left" data-tip={t('label.selectServiceMonth')}>
              <Select onChange={selectServiceMonth}>
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
              </Select>
            </div>
          </div>
        </div>

        {selectedServiceMonth && (
          <div>
            <Table dense bleed grid striped className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
              <TableHead>
                <TableRow>
                  <TableHeader></TableHeader>
                  <TableHeader>{t('label.noReports')}</TableHeader>
                  <TableHeader>{t('label.studies')}</TableHeader>
                  <TableHeader>{t('label.hours')}</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{publisherReport.type}</TableCell>
                  <TableCell>{Math.round(publisherReport.reports)}</TableCell>
                  <TableCell>{Math.round(publisherReport.studies)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{auxiliaryReport.type}</TableCell>
                  <TableCell>{Math.round(auxiliaryReport.reports)}</TableCell>
                  <TableCell>{Math.round(auxiliaryReport.studies)}</TableCell>
                  <TableCell>{Math.round(auxiliaryReport.hours)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{pioneerReport.type}</TableCell>
                  <TableCell>{Math.round(pioneerReport.reports)}</TableCell>
                  <TableCell>{Math.round(pioneerReport.studies)}</TableCell>
                  <TableCell>{Math.round(pioneerReport.hours)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{specialPioneerReport.type}</TableCell>
                  <TableCell>{Math.round(specialPioneerReport.reports)}</TableCell>
                  <TableCell>{Math.round(specialPioneerReport.studies)}</TableCell>
                  <TableCell>{Math.round(specialPioneerReport.hours)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{missionaryReport.type}</TableCell>
                  <TableCell>{Math.round(missionaryReport.reports)}</TableCell>
                  <TableCell>{Math.round(missionaryReport.studies)}</TableCell>
                  <TableCell>{Math.round(missionaryReport.hours)}</TableCell>
                </TableRow>
              </TableBody>
              <TableFoot>
                <TableRow>
                  <TableFooter>{t('label.total')}</TableFooter>
                  <TableFooter>{Math.round(publisherReport.reports + auxiliaryReport.reports + pioneerReport.reports + specialPioneerReport.reports + missionaryReport.reports)}</TableFooter>
                  <TableFooter>{Math.round(publisherReport.studies + auxiliaryReport.studies + pioneerReport.studies + specialPioneerReport.studies + missionaryReport.studies)}</TableFooter>
                  <TableFooter>{Math.round(auxiliaryReport.hours + pioneerReport.hours + specialPioneerReport.hours + missionaryReport.hours)}</TableFooter>
                </TableRow>
              </TableFoot>
            </Table>

            <Divider className="my-6" />

            <Table dense bleed grid striped className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
              <TableHead>
                <TableRow>
                  <TableHeader className="w-56">{t('label.publishers')}</TableHeader>
                  <TableHeader>{t('label.amount')}</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{t('label.actives')}</TableCell>
                  <TableCell>{selectedServiceMonth.stats.activePublishers}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{`- ${t('label.regulars')}`}</TableCell>
                  <TableCell>{selectedServiceMonth.stats.regularPublishers}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{`- ${t('label.irregulars')}`}</TableCell>
                  <TableCell>{selectedServiceMonth.stats.irregularPublishers}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('label.inactives')}</TableCell>
                  <TableCell>{selectedServiceMonth.stats.inactivePublishers}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Divider className="my-6" />

            <Table dense bleed grid striped className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
              <TableHead>
                <TableRow>
                  {meetingHeadlines.map((headline, index) => {
                    return (
                      <TableHeader key={`headline-${index}`}>{headline}</TableHeader>
                    )
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {meetingRows.map((row, rowIndex) => {
                  return (
                    <TableRow key={`row-${rowIndex}`}>
                      {row.map((cell, index) => {
                        return (
                          <TableCell key={`cell-${rowIndex}-${index}`}>{cell}</TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <div className="flex justify-between">
              {selectedServiceMonth && (
                <Button color="blue" className="invisible" onClick={() => {}}>{t('label.edit')}</Button>
              )}
              {selectedServiceMonth && (
                <Button color="blue" onClick={() => exportSummary(selectedServiceMonth?.serviceMonth || '')}>{t('label.export')}</Button>
              )}
            </div>
          </div>
        )}

      </Fieldset>
    </div>
  )
}
