import { useTranslation }         from 'react-i18next'
import type { ServiceMonthModel } from 'src/types/models'

interface Props {
  serviceMonth: ServiceMonthModel
}

export default function LastMonth({ serviceMonth }: Props): JSX.Element | null {
  const { t } = useTranslation()

  if (!serviceMonth) {
    return null
  }

  return (
    <div className="rounded-md bg-gray-200 p-4 dark:bg-slate-800">
      <div className="px-4 sm:px-0">
        <h3 className="mt-0 text-base font-semibold text-gray-900 dark:text-white">{t('label.lastMonth')}</h3>
      </div>
      <div className="border-t border-gray-100 dark:border-white/10">
        <dl className="my-0 divide-y divide-gray-100 dark:divide-white/10">
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">{t('label.active')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{serviceMonth.stats.activePublishers}</dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">{t('label.regular')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{serviceMonth.stats.regularPublishers}</dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">{t('label.blind')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{serviceMonth.stats.blind}</dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">{t('label.deaf')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{serviceMonth.stats.deaf}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
