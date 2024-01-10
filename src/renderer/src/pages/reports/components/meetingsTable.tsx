import { useForm }        from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
    <form
      onBlur={useFormAttributes.handleSubmit(handleBlur)}
      className="border-b border-gray-300 dark:border-slate-600"
    >
      <h4>{name}</h4>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>{t('label.week1')}</th>
            <th>{t('label.week2')}</th>
            <th>{t('label.week3')}</th>
            <th>{t('label.week4')}</th>
            <th>{t('label.week5')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{t('label.midweekMeeting')}</th>
            <td>
              <input
                {...useFormAttributes.register('meetings.midweek.0')}
                type="number"
                className="input input-bordered input-md w-full"
                min={0}
              />
            </td>
            <td>
              <input
                {...useFormAttributes.register('meetings.midweek.1')}
                type="number"
                className="input input-bordered input-md w-full"
                min={0}
              />
            </td>
            <td>
              <input
                {...useFormAttributes.register('meetings.midweek.2')}
                type="number"
                className="input input-bordered input-md w-full"
                min={0}
              />
            </td>
            <td>
              <input
                {...useFormAttributes.register('meetings.midweek.3')}
                type="number"
                className="input input-bordered input-md w-full"
                min={0}
              />
            </td>
            <td>
              <input
                {...useFormAttributes.register('meetings.midweek.4')}
                type="number"
                className="input input-bordered input-md w-full"
                min={0}
              />
            </td>
          </tr>
          <tr>
            <th>{t('label.weekendMeeting')}</th>
            <td>
              <input
                {...useFormAttributes.register('meetings.weekend.0')}
                type="number"
                className="input input-bordered input-md w-full"
                min={0}
              />
            </td>
            <td>
              <input
                {...useFormAttributes.register('meetings.weekend.1')}
                type="number"
                className="input input-bordered input-md w-full"
                min={0}
              />
            </td>
            <td>
              <input
                {...useFormAttributes.register('meetings.weekend.2')}
                type="number"
                className="input input-bordered input-md w-full"
                min={0}
              />
            </td>
            <td>
              <input
                {...useFormAttributes.register('meetings.weekend.3')}
                type="number"
                className="input input-bordered input-md w-full"
                min={0}
              />
            </td>
            <td>
              <input
                {...useFormAttributes.register('meetings.weekend.4')}
                type="number"
                className="input input-bordered input-md w-full"
                min={0}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  )
}
