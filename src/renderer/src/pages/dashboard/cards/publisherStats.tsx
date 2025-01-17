import { useEffect, useState }                           from 'react'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Doughnut }                                      from 'react-chartjs-2'
import { useTranslation }                                from 'react-i18next'
import colors                                            from 'tailwindcss/colors'
import { DashboardCard }                                 from '@renderer/components/DashboardCard'
import { Heading, Subheading }                           from '@renderer/components/catalyst/heading'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function PublisherStats(): JSX.Element {
  const { t }                 = useTranslation()
  const [stats, setStats]     = useState({ active: 0, irregular: 0, inactive: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('publishers-stats').then((result) => {
      setStats(result)
      setLoading(false)
    })
  }, [])

  const data = {
    labels:   [t('label.actives'), t('label.irregulars'), t('label.inactives')],
    datasets: [
      {
        label:           t('label.amount'),
        data:            [stats.active, stats.irregular, stats.inactive],
        backgroundColor: [colors.green[500], colors.yellow[500], colors.red[500]],
        borderColor:     [colors.green[800], colors.yellow[800], colors.red[800]],
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

  return (
    <DashboardCard className="col-span-2 sm:col-span-1 xl:col-span-4 2xl:col-span-3">
      <Heading className="mb-4">{t('label.publishers')}</Heading>
      {loading
        ? (
            <div className="aspect-square w-full animate-pulse rounded-full bg-slate-200" />
          )
        : (
            <Doughnut data={data} options={options} />
          )}
      <Subheading className="mt-4 w-full text-right">{t('label.numberActivePublishers', { amount: stats.active + stats.irregular })}</Subheading>
    </DashboardCard>
  )
}
