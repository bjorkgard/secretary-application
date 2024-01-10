import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import colors from 'tailwindcss/colors'
import { Card } from '@renderer/components/Card'
import { ServiceMonthModel } from 'src/types/models'
import { useConfirmationModalContext } from '@renderer/providers/confirmationModal/confirmationModalContextProvider'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function ActiveReport(): JSX.Element | null {
  const { t } = useTranslation()
  const confirmContext = useConfirmationModalContext()

  const [loading, setLoading] = useState<boolean>(true)
  const [reload, setReload] = useState<boolean>(true)
  const [serviceMonth, setServiceMonth] = useState<ServiceMonthModel>()
  const [stats, setStats] = useState({ done: 0, waiting: 0 })

  const startReporting = async (): Promise<void> => {
    const result = await confirmContext.showConfirmation(
      t('reporting.startConfirmation.headline'),
      t('reporting.startConfirmation.body')
    )
    if (result) {
      window.electron.ipcRenderer.invoke('start-reporting').then((response) => {
        if (response === 'ACTIVATED') {
          setReload(true)
        }
      })
    }
  }

  useEffect(() => {
    window.electron.ipcRenderer.invoke('current-service-month').then((result) => {
      setServiceMonth(result)
      setLoading(false)
      setReload(false)
    })
  }, [reload])

  useEffect(() => {
    const reportStats = { done: 0, waiting: 0 }

    serviceMonth?.reports.map((report) => {
      if (report.publisherStatus !== 'INACTIVE') {
        if (report.hasBeenInService || report.hasNotBeenInService) {
          reportStats.done++
        } else {
          reportStats.waiting++
        }
      }
    })

    setStats(reportStats)
  }, [serviceMonth])

  const data = {
    labels: [t('label.reports.done'), t('label.reports.waiting')],
    datasets: [
      {
        label: t('label.amount'),
        data: [stats.done, stats.waiting],
        backgroundColor: [colors.green[500], colors.red[500]],
        borderColor: [colors.green[800], colors.red[800]],
        borderWidth: 1
      }
    ]
  }

  const options = {
    animation: { animateScale: false, animateRotate: true },
    aspectRatio: 1,
    plugins: {
      legend: {
        position: 'bottom' as const,
        align: 'center' as const,
        display: false,
        labels: {
          color: colors.slate[400]
        }
      }
    },
    responsive: true
  }

  if (serviceMonth?.status === 'DONE') {
    return null
  }

  return (
    <Card
      title={t('label.reporting')}
      footer={
        serviceMonth
          ? t('label.reports.missing', {
              missing: stats.waiting,
              total: stats.done + stats.waiting
            })
          : ''
      }
      loading={loading}
    >
      {loading ? (
        <div className="mt-2 aspect-square w-full rounded-full bg-slate-200" />
      ) : serviceMonth ? (
        <Doughnut data={data} options={options} />
      ) : (
        <button
          type="button"
          onClick={startReporting}
          className="btn btn-accent btn-lg m-12 leading-6"
        >
          {t('label.startReporting')}
        </button>
      )}
    </Card>
  )
}
