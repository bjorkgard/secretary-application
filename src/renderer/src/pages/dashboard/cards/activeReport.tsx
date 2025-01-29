import { useEffect, useState }                           from 'react'
import { useTranslation }                                from 'react-i18next'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Doughnut }                                      from 'react-chartjs-2'
import colors                                            from 'tailwindcss/colors'
import type { ServiceMonthModel }                        from 'src/types/models'
import { useConfirmationModalContext }                   from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import { DashboardCard }                                 from '@renderer/components/DashboardCard'
import { Heading, Subheading }                           from '@renderer/components/catalyst/heading'
import { Button }                                        from '@renderer/components/catalyst/button'
import CloudArrowDownIcon                                from '@heroicons/react/16/solid/CloudArrowDownIcon'
import clsx                                              from 'clsx'
import { useSettingsState }                              from '@renderer/store/settingsStore'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function ActiveReport(): JSX.Element | null {
  const { t }          = useTranslation()
  const settingsState  = useSettingsState()
  const confirmContext = useConfirmationModalContext()

  const [loading, setLoading]           = useState<boolean>(true)
  const [reload, setReload]             = useState<boolean>(true)
  const [serviceMonth, setServiceMonth] = useState<ServiceMonthModel>()
  const [stats, setStats]               = useState({ done: 0, waiting: 0 })

  const startReporting = async (): Promise<void> => {
    const result = await confirmContext.showConfirmation(
      t('reporting.startConfirmation.headline'),
      t('reporting.startConfirmation.body'),
    )
    if (result) {
      window.electron.ipcRenderer.invoke('start-reporting').then((response) => {
        if (response === 'ACTIVATED')
          setReload(true)
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

    serviceMonth?.reports.forEach((report) => {
      if (report.publisherStatus !== 'INACTIVE') {
        if (report.hasBeenInService || report.hasNotBeenInService)
          reportStats.done++
        else
          reportStats.waiting++
      }
    })

    setStats(reportStats)
  }, [serviceMonth])

  const forceDownloadAllReports = () => {
    // setServiceMonth(undefined)
    window.electron.ipcRenderer.invoke('force-download-reports')
  }

  const data = {
    labels:   [t('label.reports.done'), t('label.reports.waiting')],
    datasets: [
      {
        label:           t('label.amount'),
        data:            [stats.done, stats.waiting],
        backgroundColor: [colors.green[500], colors.red[500]],
        borderColor:     [colors.green[800], colors.red[800]],
        borderWidth:     1,
      },
    ],
  }

  const options = {
    animation:   { animateScale: false, animateRotate: true },
    aspectRatio: 1,
    plugins:     {
      legend: {
        position: 'bottom' as const,
        align:    'center' as const,
        display:  false,
        labels:   {
          color: colors.slate[400],
        },
      },
    },
    responsive: true,
  }

  if (serviceMonth?.status === 'DONE')
    return null

  return (
    <DashboardCard className="col-span-2 sm:col-span-1 xl:col-span-4 2xl:col-span-3">
      <Heading className="mb-4">{t('label.reporting')}</Heading>
      {loading
        ? (
            <div className="aspect-square w-full animate-pulse rounded-full bg-slate-200" />
          )
        : serviceMonth
          ? (
              <Doughnut data={data} options={options} />
            )
          : (
              <Button
                type="button"
                onClick={startReporting}
                className="m-12 leading-6"
                color="blue"
              >
                {t('label.startReporting')}
              </Button>
            )}
      <div className="mt-4 flex w-full justify-between">
        <Button
          plain
          title={t('tooltip.forceDownloadReports')}
          onClick={forceDownloadAllReports}
        >
          <CloudArrowDownIcon
            className={clsx([
              (!settingsState.online.send_report_publisher && !settingsState.online.send_report_group) && 'hidden',
              'size-6',
            ])}
          />
        </Button>
        <Subheading className="text-right">
          {t('label.reports.missing', {
            missing: stats.waiting,
            total:   stats.done + stats.waiting,
          })}
        </Subheading>
      </div>
    </DashboardCard>
  )
}
