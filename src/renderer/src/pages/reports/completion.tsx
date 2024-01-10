import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffectOnce } from '@renderer/hooks/useOnMountUnsafe'
import { ServiceMonthModel } from 'src/types/models'
import ReportComplilation from './components/reportCompilation'
import MeetingComplilation from './components/meetingCompilation'
import { useConfirmationModalContext } from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import ROUTES from '../../constants/routes.json'

export default function ReportsCompletion(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const confirmContext = useConfirmationModalContext()

  const [activeServiceMonth, setActiveServiceMonth] = useState<boolean>(true)
  const [serviceMonth, setServiceMonth] = useState<ServiceMonthModel>()

  useEffectOnce(() => {
    window.electron.ipcRenderer
      .invoke('current-service-month')
      .then((serviceMonth: ServiceMonthModel) => {
        if (!serviceMonth || serviceMonth.status === 'DONE') {
          setActiveServiceMonth(false)
        } else {
          setServiceMonth(serviceMonth)
        }
      })
  })

  const closeServiceMonth = async (): Promise<void> => {
    const result = await confirmContext.showConfirmation(
      t('report.closeConfirmation.headline'),
      t('report.closeConfirmation.body')
    )

    if (result) {
      window.electron.ipcRenderer.invoke('close-reporting').then(() => {
        window.Notification.requestPermission().then(() => {
          new window.Notification('SECRETARY', {
            body: t('reporting.closed'),
            silent: false
          })
        })

        navigate(ROUTES.DASHBOARD)
      })
    }
  }

  return (
    <div>
      <div>
        <h1>{t('compilation.headline')}</h1>
      </div>
      <div className="-mt-4">
        {activeServiceMonth && serviceMonth ? (
          <>
            <ReportComplilation
              serviceMonth={serviceMonth.serviceMonth}
              reports={serviceMonth.reports}
            />
            <MeetingComplilation meetings={serviceMonth.meetings} />
            <div className="mt-8 flex justify-around">
              <button className="btn btn-primary" onClick={closeServiceMonth}>
                {t('report.closeServicMonth')}
              </button>
            </div>
          </>
        ) : (
          <h2>{t('reports.noActive')}</h2>
        )}
      </div>
    </div>
  )
}
