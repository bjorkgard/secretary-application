import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { useTranslation }          from 'react-i18next'

export default function TemplateWarning(): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="col-span-4 flex items-center justify-between gap-x-6 rounded-md bg-red-600 px-6 py-2.5 sm:pr-3.5 lg:pl-8">
      <p className="text-sm leading-6 text-white">
        <ExclamationTriangleIcon className="mr-2 inline size-5" aria-hidden="true" />
        <strong className="font-semibold uppercase">{t('templates.headline')}</strong>
        <svg viewBox="0 0 2 2" className="mx-2 inline size-0.5 fill-current" aria-hidden="true">
          <circle cx={1} cy={1} r={1} />
        </svg>
        {t('templates.warning')}
      </p>
    </div>
  )
}
