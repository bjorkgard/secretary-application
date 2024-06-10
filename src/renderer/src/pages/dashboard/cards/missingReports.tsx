import { useEffect, useState }                                from 'react'
import { ClipboardIcon, DevicePhoneMobileIcon, EnvelopeIcon } from '@heroicons/react/16/solid'
import { useTranslation }                                     from 'react-i18next'
import { Card }                                               from '@renderer/components/Card'
import { useEffectOnce }                                      from '@renderer/hooks/useOnMountUnsafe'
import { useSettingsState }                                   from '@renderer/store/settingsStore'
import type { ServiceMonthModel }                             from 'src/types/models'

interface missingReport {
  identifier: string
  name:       string
  email?:     string
  mobile?:    string
}

export default function MissingReports(): JSX.Element | null {
  const { t }         = useTranslation()
  const settingsState = useSettingsState()

  const [loading, setLoading]               = useState<boolean>(true)
  const [serviceMonth, setServiceMonth]     = useState<ServiceMonthModel>()
  const [missingReports, setMissingReports] = useState<missingReport[]>([])

  useEffectOnce(() => {
    window.electron.ipcRenderer.invoke('current-service-month').then((result) => {
      setServiceMonth(result)
      setLoading(false)
    })
  })

  useEffect(() => {
    serviceMonth?.reports.forEach((report) => {
      if (report.publisherStatus !== 'INACTIVE') {
        if (!report.hasBeenInService && !report.hasNotBeenInService) {
          setMissingReports(prev => [
            ...prev,
            {
              identifier: report.identifier,
              name:       report.publisherName || '',
              email:      report.publisherEmail,
              mobile:     report.publisherMobile,
            },
          ])
        }
      }
    })
  }, [serviceMonth])

  const resendPublisherReport = (identifier: string) => {
    window.electron.ipcRenderer.invoke('resend-publisher-report', { identifier }).then(() => {
      window.Notification.requestPermission().then(() => {
        // eslint-disable-next-line no-new
        new window.Notification('SECRETARY', {
          body:   t('reports.resend'),
          silent: false,
        })
      })
    })
  }

  const getReportUrl = (identifier: string) => {
    window.electron.ipcRenderer.invoke('get-report-url', { identifier }).then((url) => {
      window.Notification.requestPermission().then(() => {
        if (url !== '') {
          // eslint-disable-next-line no-new
          new window.Notification('SECRETARY', {
            body:   t('reports.urlCopied'),
            silent: false,
          })
        }
        else {
          // eslint-disable-next-line no-new
          new window.Notification('SECRETARY', {
            body:   t('reports.noReportUrl'),
            silent: true,
          })
        }
      })
    })
  }

  if (!serviceMonth || serviceMonth?.status === 'DONE') {
    // The report for this month is DONE, so there are no missing reports
    return null
  }

  return (
    <Card title={t('label.missingReports', { count: missingReports.length })} loading={loading}>
      {loading
        ? (
          <div className="mt-2 aspect-square w-full rounded-full bg-slate-200" />
          )
        : serviceMonth
          ? (
            <div className="h-48 w-full overflow-x-auto md:h-[416px] lg:h-64 xl:h-80 2xl:h-[28rem]">
              <table className="table table-zebra table-xs mt-0">
                <tbody>
                  {missingReports.map(report => (
                    <tr key={report.identifier}>
                      <td>{report.name}</td>
                      <td className="flex grow justify-end space-x-2">
                        {report.email
                          ? settingsState.online.send_report_publisher
                            ? (
                              <span className="tooltip tooltip-left" data-tip={t('tooltip.resendReport')} onClick={() => resendPublisherReport(report.identifier)}>
                                <EnvelopeIcon className="size-4" />
                              </span>
                              )
                            : (
                              <a className="tooltip tooltip-left" data-tip={t('tooltip.sendEmail')} href={`mailto:${report.email}`}>
                                <EnvelopeIcon className="size-4" />
                              </a>
                              )
                          : null}

                        {report.mobile
                          ? (
                            <a className="tooltip tooltip-left" data-tip={t('tooltip.sendReportMessage')} href={`sms:${report.mobile}?body=${t('sms.missingReport')}`}>
                              <DevicePhoneMobileIcon className="size-4" />
                            </a>
                            )
                          : null}

                        {settingsState.online.send_report_publisher
                          ? (
                            <span className="tooltip tooltip-left" data-tip={t('tooltip.copyReportUrl')} onClick={() => { getReportUrl(report.identifier) }}>
                              <ClipboardIcon className="size-4" />
                            </span>
                            )
                          : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )
          : null}
    </Card>
  )
}
