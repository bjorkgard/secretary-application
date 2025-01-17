import { useEffect, useState }    from 'react'
import { useTranslation }         from 'react-i18next'
import type { ServiceMonthModel } from 'src/types/models'

interface Props {
  serviceMonths: ServiceMonthModel[]
}

export default function Meetings({ serviceMonths }: Props): JSX.Element | null {
  const { t } = useTranslation()

  const [midweeks, setMidweeks] = useState<number[]>([])
  const [weekens, setWeekends]  = useState<number[]>([])

  if (!serviceMonths) {
    return null
  }

  useEffect(() => {
    setMidweeks([])
    setWeekends([])

    for (const serviceMonth of serviceMonths) {
      if (serviceMonth.status === 'DONE') {
        // !Special: We are combidning all midweek and weekend for language groups into one array
        const midweeks: number[][] = []
        const weekends: number[][] = []

        for (let index = 0; index < serviceMonth.meetings.length; index++) {
          midweeks.push(serviceMonth.meetings[index].midweek)
          weekends.push(serviceMonth.meetings[index].weekend)
        }

        const mws = midweeks[0].map((_, idx) => midweeks.reduce((sum, curr) => sum + (curr[idx] || 0), 0))
        const ws  = weekends[0].map((_, idx) => weekends.reduce((sum, curr) => sum + (curr[idx] || 0), 0))

        setMidweeks(midweeks => [...midweeks.concat(mws)])
        setWeekends(weekends => [...weekends.concat(ws)])
      }
    }
  }, [serviceMonths])

  return (
    <div className="rounded-md bg-gray-200 p-4 dark:border dark:border-white/10 dark:bg-transparent">
      <div className="px-4 sm:px-0">
        <h3 className="mt-0 text-base font-semibold text-gray-900 dark:text-white">{t('label.meetingAttendees')}</h3>
      </div>
      <div className="border-t border-gray-100 dark:border-white/10">
        <dl className="my-0 divide-y divide-gray-100 dark:divide-white/10">
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt></dt>
            <dd className="text-sm font-medium leading-6 text-gray-900 sm:mt-0 dark:text-white">{t('analysis.total')}</dd>
            <dd className="text-sm font-medium leading-6 text-gray-900 sm:mt-0 dark:text-white">{t('analysis.average')}</dd>
          </div>

          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:mt-0 dark:text-white">{t('analysis.weekend')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{weekens.reduce((a, b) => a + b, 0).toLocaleString('sv')}</dd>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{Math.round(weekens.reduce((a, b) => a + b, 0) / weekens.length || 0)}</dd>
          </div>

          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900 sm:mt-0 dark:text-white">{t('analysis.midweek')}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{midweeks.reduce((a, b) => a + b, 0).toLocaleString('sv')}</dd>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 dark:text-gray-400">{Math.round(midweeks.reduce((a, b) => a + b, 0) / midweeks.length || 0)}</dd>
          </div>

        </dl>
      </div>
    </div>
  )
}
