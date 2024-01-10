import { useTranslation } from 'react-i18next'
import type { Meeting }   from 'src/types/models'

interface ComponentProps {
  meetings: Meeting[]
}

export default function ReportsComplilation({ meetings }: ComponentProps): JSX.Element {
  const { t } = useTranslation()

  let sumMidweek     = 0
  const countMidweek = meetings[0].midweek.length
  let sumWeekend     = 0
  const countWeekend = meetings[0].weekend.length

  return (
    <div className="border-b border-gray-300 dark:border-slate-600">
      <table className="table">
        <thead>
          <tr>
            <th className="text-lg">{t('meeting.headline')}</th>
            {meetings.map((meeting, index) => {
              return (
                <th key={index}>
                  {meeting.name
                    ? meeting.name
                    : meetings.length > 1
                      ? t('meeting.motherCongregation')
                      : t('label.total')}
                </th>
              )
            })}
            {meetings.length > 1 && <th>{t('label.total')}</th>}

            <th>{t('label.average')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{t('label.midweekMeeting')}</th>
            {meetings.map((meeting, index) => {
              sumMidweek += meeting.midweek.reduce((acc, value) => acc + value, 0)
              return <td key={index}>{meeting.midweek.reduce((acc, value) => acc + value, 0)}</td>
            })}
            {meetings.length > 1 && <td>{sumMidweek}</td>}
            <td>{Math.round(sumMidweek / countMidweek).toString()}</td>
          </tr>
          <tr>
            <th>{t('label.weekendMeeting')}</th>
            {meetings.map((meeting, index) => {
              sumWeekend += meeting.weekend.reduce((acc, value) => acc + value, 0)
              return <td key={index}>{meeting.weekend.reduce((acc, value) => acc + value, 0)}</td>
            })}
            {meetings.length > 1 && <td>{sumWeekend}</td>}
            <td>{Math.round(sumWeekend / countWeekend).toString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
