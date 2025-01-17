import { useState }                    from 'react'
import { useNavigate }                 from 'react-router-dom'
import { useTranslation }              from 'react-i18next'
import { useEffectOnce }               from '@renderer/hooks/useOnMountUnsafe'
import type { ServiceMonthModel }      from 'src/types/models'
import { useConfirmationModalContext } from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import { Button }                      from '@renderer/components/catalyst/button'
import { Fieldset }                    from '@renderer/components/catalyst/fieldset'
import { Heading, Subheading }         from '@renderer/components/catalyst/heading'
import ROUTES                          from '../../constants/routes.json'
import ReportComplilation              from './components/reportCompilation'
import MeetingComplilation             from './components/meetingCompilation'

export default function ReportsCompletion(): JSX.Element {
  const { t }          = useTranslation()
  const navigate       = useNavigate()
  const confirmContext = useConfirmationModalContext()

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

  const closeServiceMonth = async (): Promise<void> => {
    const result = await confirmContext.showConfirmation(
      t('report.closeConfirmation.headline'),
      t('report.closeConfirmation.body'),
    )

    if (result) {
      window.electron.ipcRenderer.invoke('close-reporting').then(() => {
        window.Notification.requestPermission().then(() => {
          // eslint-disable-next-line no-new
          new window.Notification('SECRETARY', {
            body:   t('reporting.closed'),
            silent: false,
          })
        })

        navigate(ROUTES.DASHBOARD)
      })
    }
  }

  return (
    <div>
      <Fieldset>
        <div className="flex justify-between">
          <Heading>{t('compilation.headline')}</Heading>
        </div>
        <div>
          {activeServiceMonth && serviceMonth
            ? (
                <>
                  <ReportComplilation
                    serviceMonth={serviceMonth.serviceMonth}
                    reports={serviceMonth.reports}
                  />
                  <MeetingComplilation meetings={serviceMonth.meetings} />
                  <div className="mt-8 flex justify-around">
                    <Button color="blue" onClick={closeServiceMonth}>
                      {t('report.closeServicMonth')}
                    </Button>
                  </div>
                </>
              )
            : (
                <Subheading>{t('reports.noActive')}</Subheading>
              )}
        </div>
      </Fieldset>
    </div>
  )
}
