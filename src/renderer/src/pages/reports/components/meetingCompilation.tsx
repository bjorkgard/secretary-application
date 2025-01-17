import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@renderer/components/catalyst/table'
import { useTranslation }                                                from 'react-i18next'
import type { Meeting }                                                  from 'src/types/models'

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
    <Table dense bleed grid striped className="mt-8 [--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
      <TableHead>
        <TableRow>
          <TableHeader>{t('meeting.headline')}</TableHeader>
          {meetings.map((meeting, index) => {
            return (
              <TableHeader key={index}>
                {meeting.name
                  ? meeting.name
                  : meetings.length > 1
                    ? t('meeting.motherCongregation')
                    : t('label.total')}
              </TableHeader>
            )
          })}
          {meetings.length > 1 && <TableHeader>{t('label.total')}</TableHeader>}

          <TableHeader>{t('label.average')}</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>{t('label.midweekMeeting')}</TableCell>
          {meetings.map((meeting, index) => {
            sumMidweek += meeting.midweek.reduce((acc, value) => acc + value, 0)
            return <TableCell key={index}>{meeting.midweek.reduce((acc, value) => acc + value, 0)}</TableCell>
          })}
          {meetings.length > 1 && <TableCell>{sumMidweek}</TableCell>}
          <TableCell>{Math.round(sumMidweek / countMidweek).toString()}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t('label.weekendMeeting')}</TableCell>
          {meetings.map((meeting, index) => {
            sumWeekend += meeting.weekend.reduce((acc, value) => acc + value, 0)
            return <TableCell key={index}>{meeting.weekend.reduce((acc, value) => acc + value, 0)}</TableCell>
          })}
          {meetings.length > 1 && <TableCell>{sumWeekend}</TableCell>}
          <TableCell>{Math.round(sumWeekend / countWeekend).toString()}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
