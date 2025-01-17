import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { DashboardCard }           from '@renderer/components/DashboardCard'
import { useTranslation }          from 'react-i18next'

export default function TemplateWarning(): JSX.Element {
  const { t } = useTranslation()

  return (
    <DashboardCard warning={true} className="col-span-full">
      <p className="text-sm leading-6 text-white">
        <ExclamationTriangleIcon className="mr-2 inline size-5" aria-hidden="true" />
        <strong className="font-semibold uppercase">{t('templates.headline')}</strong>
        <svg viewBox="0 0 2 2" className="mx-2 inline size-0.5 fill-current" aria-hidden="true">
          <circle cx={1} cy={1} r={1} />
        </svg>
        {t('templates.warning')}
      </p>
    </DashboardCard>
  )
}
