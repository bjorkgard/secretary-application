import { useEffect, useState }                      from 'react'
import { useTranslation }                           from 'react-i18next'
import type { ServiceMonthModel, ServiceYearModel } from 'src/types/models'

interface Props {
  serviceYear:   ServiceYearModel
  serviceMonths: ServiceMonthModel[]
}

export default function HistoryTable({ serviceYear, serviceMonths }: Props): JSX.Element | null {
  const { t } = useTranslation()

  const [auxiliaryMonths, setAuxiliaryMonths] = useState<number>(0)

  if (!serviceYear || !serviceMonths) {
    return null
  }

  useEffect(() => {
    let am = 0
    for (const serviceMonth of serviceMonths) {
      if (serviceMonth.status === 'DONE') {
        am += serviceMonth.reports.filter(report => report.auxiliary).length
      }
    }
    setAuxiliaryMonths(am)
  }, [serviceMonths])

  const getHistoryDataNumber = (type: string): number => {
    return serviceYear?.history.filter(h => h.type === type).length || 0
  }

  return (
    <div className="row-span-2 rounded-md bg-gray-200 p-4 dark:bg-slate-800">
      <div className="px-4 sm:px-0">
        <h3 className="mt-0 text-base font-semibold text-gray-900 dark:text-white">{t('label.happendInYear')}</h3>
      </div>
      <div className="border-t border-gray-100 dark:border-white/10">
        <dl className="my-0 divide-y divide-gray-100 dark:divide-white/10">
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">{t('analysis.newPublishers')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{getHistoryDataNumber('PUBLISHER')}</dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">{t('analysis.baptised')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{getHistoryDataNumber('BAPTISED')}</dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">{t('analysis.auxiliaries')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{auxiliaryMonths}</dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">{t('analysis.movedIn')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{getHistoryDataNumber('MOVED_IN')}</dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">{t('analysis.movedOut')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{getHistoryDataNumber('MOVED_OUT')}</dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">{t('analysis.active')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{getHistoryDataNumber('ACTIVE')}</dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">{t('analysis.inactive')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{getHistoryDataNumber('INACTIVE')}</dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">{t('analysis.disassociation')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{getHistoryDataNumber('DISASSOCIATION')}</dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">{t('analysis.disfellowshipped')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{getHistoryDataNumber('DISFELLOWSHIPPED')}</dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">{t('analysis.reinstated')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{getHistoryDataNumber('REINSTATED')}</dd>
          </div>

        </dl>
      </div>
    </div>
  )
}
