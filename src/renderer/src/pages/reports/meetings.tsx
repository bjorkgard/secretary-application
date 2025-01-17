import { useState }               from 'react'
import { useTranslation }         from 'react-i18next'
import { useEffectOnce }          from '@renderer/hooks/useOnMountUnsafe'
import type { ServiceMonthModel } from 'src/types/models'
import { Heading, Subheading }    from '@renderer/components/catalyst/heading'
import { MeetingsTable }          from './components/meetingsTable'

export default function ReportsMeetings(): JSX.Element {
  const { t } = useTranslation()

  const [activeServiceMonth, setActiveServiceMonth] = useState<boolean>(true)
  const [serviceMonth, setServiceMonth]             = useState<ServiceMonthModel>()

  useEffectOnce(() => {
    window.electron.ipcRenderer
      .invoke('current-service-month')
      .then((serviceMonth: ServiceMonthModel) => {
        if (!serviceMonth || serviceMonth.status === 'DONE')
          setActiveServiceMonth(false)

        else
          setServiceMonth(serviceMonth)
      })
  })

  return (
    <div>
      <div>
        <Heading>{t('meeting.headline')}</Heading>
      </div>
      <div>
        {activeServiceMonth
          ? (
              serviceMonth?.meetings?.map((meeting, index) => {
                const name = meeting.name
                  ? meeting.name
                  : serviceMonth.meetings.length > 1
                    ? t('meeting.motherCongregation')
                    : ''

                return (
                  <MeetingsTable
                    key={index}
                    meetings={meeting}
                    name={name}
                    serviceMonthId={serviceMonth._id}
                  />
                )
              })
            )
          : (
              <Subheading>{t('reports.noActive')}</Subheading>
            )}
      </div>
    </div>
  )
}
