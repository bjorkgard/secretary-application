import { useEffect, useState }            from 'react'
import { useTranslation }                 from 'react-i18next'
import type { Report, ServiceMonthModel } from 'src/types/models'

interface Props {
  serviceMonths: ServiceMonthModel[]
  type:          string
}

export default function Reports({ serviceMonths, type }: Props): JSX.Element | null {
  const { t } = useTranslation()

  const [reports, setReports] = useState<Report[]>([])
  const [count, setCount]     = useState<number>(0)

  if (!serviceMonths) {
    return null
  }

  useEffect(() => {
    setReports([])
    setCount(0)
    for  (const serviceMonth of serviceMonths) {
      if (serviceMonth.status === 'DONE') {
        setCount(count => count + 1)
        const rawReports: Report[] = []

        for (let index = 0; index < serviceMonth.reports.length; index++) {
          if (type === 'PUBLISHER') {
            if (serviceMonth.reports[index].type === type && !serviceMonth.reports[index].auxiliary && serviceMonth.reports[index].hasBeenInService) {
              rawReports.push(serviceMonth.reports[index])
            }
          }
          else if (type === 'AUXILIARY') {
            if (serviceMonth.reports[index].auxiliary) {
              rawReports.push(serviceMonth.reports[index])
            }
          }
          else {
            if (serviceMonth.reports[index].type === type && serviceMonth.reports[index].hasBeenInService) {
              rawReports.push(serviceMonth.reports[index])
            }
          }
        }

        setReports(reports => [...reports.concat(rawReports)])
      }
    }
  }, [serviceMonths])

  if (reports.length === 0) {
    return null
  }

  return (
    <div className="rounded-md bg-gray-200 p-4 dark:bg-slate-800">
      <div className="px-4 sm:px-0">
        <h3 className="mt-0 text-base font-semibold text-gray-900 dark:text-white">{t(`label.${type.toLowerCase()}`)}</h3>
      </div>
      <div className="border-t border-gray-100 dark:border-white/10">
        <dl className="my-0 divide-y divide-gray-100 dark:divide-white/10">
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:mt-0 dark:text-white"></dt>
            <dd className="text-sm font-medium leading-6 text-gray-900 sm:mt-0 dark:text-white">{t('analysis.total')}</dd>
            <dd className="text-sm font-medium leading-6 text-gray-900 sm:mt-0 dark:text-white">{t('analysis.average')}</dd>
          </div>

          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:mt-0 dark:text-white">{t('analysis.amount')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{reports.length}</dd>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">
              {t('analysis.avrReports', { amount: Math.round(reports.length / count) })}
            </dd>
          </div>

          {type !== 'PUBLISHER' && (
            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900 sm:mt-0 dark:text-white">{t('analysis.hours')}</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{reports.reduce((a, b) => a + (b.hours || 0), 0).toLocaleString('sv')}</dd>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">
                {t('analysis.avrAmount', { amount: Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0) / reports.length) })}
              </dd>
            </div>
          )}
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:mt-0 dark:text-white">{t('analysis.studies')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{reports.reduce((a, b) => a + (b.studies || 0), 0).toLocaleString('sv')}</dd>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">
              {t('analysis.avrAmount', { amount: Math.round(reports.reduce((a, b) => a + (b.studies || 0), 0) / reports.length * 100) / 100 })}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
