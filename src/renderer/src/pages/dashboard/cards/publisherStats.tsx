import { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import colors from 'tailwindcss/colors'
import { Card } from '@renderer/components/Card'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function PublisherStats(): JSX.Element {
  const { t } = useTranslation()
  const [stats, setStats] = useState({ active: 0, irregular: 0, inactive: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('publishers-stats').then((result) => {
      setStats(result)
      setLoading(false)
    })
  }, [])

  const data = {
    labels: [t('label.actives'), t('label.irregulars'), t('label.inactives')],
    datasets: [
      {
        label: t('label.amount'),
        data: [stats.active, stats.irregular, stats.inactive],
        backgroundColor: [colors.green[500], colors.yellow[500], colors.red[500]],
        borderColor: [colors.green[800], colors.yellow[800], colors.red[800]],
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

  return (
    <Card
      title={t('label.publishers')}
      footer={t('label.numberActivePublishers', { amount: stats.active + stats.irregular })}
      loading={loading}
    >
      {loading ? (
        <div className="aspect-square w-full rounded-full bg-slate-200" />
      ) : (
        <Doughnut data={data} options={options} />
      )}
    </Card>
  )
}
