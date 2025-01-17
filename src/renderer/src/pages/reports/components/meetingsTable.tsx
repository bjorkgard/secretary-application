import { Divider }                                                       from '@renderer/components/catalyst/divider'
import { Subheading }                                                    from '@renderer/components/catalyst/heading'
import { Input }                                                         from '@renderer/components/catalyst/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@renderer/components/catalyst/table'
import { useForm }                                                       from 'react-hook-form'
import { useTranslation }                                                from 'react-i18next'

interface ComponentProps {
  meetings: {
    midweek: number[]
    weekend: number[]
  }
  name:            string
  serviceMonthId?: string
}

export function MeetingsTable({ meetings, name, serviceMonthId }: ComponentProps): JSX.Element {
  const { t } = useTranslation()

  const useFormAttributes = useForm({
    defaultValues: { meetings, name, serviceMonthId },
    mode:          'onBlur',
  })

  const handleBlur = (meetings: {
    name:     string
    meetings: { midweek: number[], weekend: number[] }
  }): void => {
    window.electron.ipcRenderer.invoke('save-meetings', meetings).then(() => {
      window.Notification.requestPermission().then(() => {
        // eslint-disable-next-line no-new
        new window.Notification('SECRETARY', {
          body:   t('meetings.saved'),
          silent: true,
        })
      })
    })
  }

  return (
    <form onBlur={useFormAttributes.handleSubmit(handleBlur)}>
      <Subheading>{name}</Subheading>
      <Table dense bleed grid sticky striped className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
        <TableHead>
          <TableRow>
            <TableHeader></TableHeader>
            <TableHeader>{t('label.week1')}</TableHeader>
            <TableHeader>{t('label.week2')}</TableHeader>
            <TableHeader>{t('label.week3')}</TableHeader>
            <TableHeader>{t('label.week4')}</TableHeader>
            <TableHeader>{t('label.week5')}</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{t('label.midweekMeeting')}</TableCell>
            <TableCell>
              <Input
                {...useFormAttributes.register('meetings.midweek.0')}
                type="number"
                className="input input-md input-bordered w-full"
                min={0}
              />
            </TableCell>
            <TableCell>
              <Input
                {...useFormAttributes.register('meetings.midweek.1')}
                type="number"
                min={0}
              />
            </TableCell>
            <TableCell>
              <Input
                {...useFormAttributes.register('meetings.midweek.2')}
                type="number"
                min={0}
              />
            </TableCell>
            <TableCell>
              <Input
                {...useFormAttributes.register('meetings.midweek.3')}
                type="number"
                min={0}
              />
            </TableCell>
            <TableCell>
              <Input
                {...useFormAttributes.register('meetings.midweek.4')}
                type="number"
                min={0}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('label.weekendMeeting')}</TableCell>
            <TableCell>
              <Input
                {...useFormAttributes.register('meetings.weekend.0')}
                type="number"
                min={0}
              />
            </TableCell>
            <TableCell>
              <Input
                {...useFormAttributes.register('meetings.weekend.1')}
                type="number"
                min={0}
              />
            </TableCell>
            <TableCell>
              <Input
                {...useFormAttributes.register('meetings.weekend.2')}
                type="number"
                min={0}
              />
            </TableCell>
            <TableCell>
              <Input
                {...useFormAttributes.register('meetings.weekend.3')}
                type="number"
                min={0}
              />
            </TableCell>
            <TableCell>
              <Input
                {...useFormAttributes.register('meetings.weekend.4')}
                type="number"
                min={0}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Divider className="my-8" />
    </form>
  )
}
