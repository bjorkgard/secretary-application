import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@renderer/components/Card'
import { ServiceMonthModel } from 'src/types/models'
import { useEffectOnce } from '@renderer/hooks/useOnMountUnsafe'
import { DevicePhoneMobileIcon, EnvelopeIcon } from '@heroicons/react/20/solid'

interface missingReport {
  identifier: string
  name: string
  email?: string
  mobile?: string
}

export default function MissingReports(): JSX.Element | null {
  const { t } = useTranslation()

  const [loading, setLoading] = useState<boolean>(true)
  const [serviceMonth, setServiceMonth] = useState<ServiceMonthModel>()
  const [missingReports, setMissingReports] = useState<missingReport[]>([])

  useEffectOnce(() => {
    window.electron.ipcRenderer.invoke('current-service-month').then((result) => {
      setServiceMonth(result)
      setLoading(false)
    })
  })

  useEffect(() => {
    serviceMonth?.reports.map((report) => {
      if (report.publisherStatus !== 'INACTIVE') {
        if (!report.hasBeenInService && !report.hasNotBeenInService) {
          setMissingReports((prev) => [
            ...prev,
            {
              identifier: report.identifier,
              name: report.publisherName || '',
              email: report.publisherEmail,
              mobile: report.publisherMobile
            }
          ])
        }
      }
    })
  }, [serviceMonth])

  if (!serviceMonth || serviceMonth?.status === 'DONE') {
    // The report for this month is DONE, so there are no missing reports
    return null
  }

  return (
    <Card title={t('label.missingReports', { count: missingReports.length })} loading={loading}>
      {loading ? (
        <div className="mt-2 aspect-square w-full rounded-full bg-slate-200" />
      ) : serviceMonth ? (
        <div className="h-48 w-full overflow-x-auto md:h-[416px] lg:h-64 xl:h-80 2xl:h-[28rem]">
          <table className="table table-zebra table-xs mt-0">
            <tbody>
              {missingReports.map((report) => (
                <tr key={report.identifier}>
                  <td>{report.name}</td>
                  <td className="flex grow justify-end">
                    {report.email ? (
                      <a href={`mailto:${report.email}`}>
                        <EnvelopeIcon className="h-5 w-5" />
                      </a>
                    ) : null}

                    {report.mobile ? (
                      <a href={`sms:${report.mobile}?body=${t('sms.missingReport')}`}>
                        <DevicePhoneMobileIcon className="h-5 w-5" />
                      </a>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Card>
  )
}
