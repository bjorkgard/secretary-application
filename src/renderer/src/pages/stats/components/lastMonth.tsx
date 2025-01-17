import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@renderer/components/catalyst/description-list'
import { useTranslation }                                       from 'react-i18next'
import type { ServiceMonthModel }                               from 'src/types/models'

interface Props {
  serviceMonth: ServiceMonthModel
}

export default function LastMonth({ serviceMonth }: Props): JSX.Element | null {
  const { t } = useTranslation()

  if (!serviceMonth) {
    return null
  }

  return (
    <div className="rounded-md bg-gray-200 p-4 dark:border dark:border-white/10 dark:bg-transparent">
      <div className="px-4 sm:px-0">
        <h3 className="mt-0 text-base font-semibold text-gray-900 dark:text-white">{t('label.lastMonth')}</h3>
      </div>
      <div className="border-t border-gray-100 dark:border-white/10">
        <DescriptionList>
          <DescriptionTerm>{t('label.active')}</DescriptionTerm>
          <DescriptionDetails>{serviceMonth.stats.activePublishers}</DescriptionDetails>
          <DescriptionTerm>{t('label.regular')}</DescriptionTerm>
          <DescriptionDetails>{serviceMonth.stats.regularPublishers}</DescriptionDetails>
          <DescriptionTerm>{t('label.blind')}</DescriptionTerm>
          <DescriptionDetails>{serviceMonth.stats.blind}</DescriptionDetails>
          <DescriptionTerm>{t('label.deaf')}</DescriptionTerm>
          <DescriptionDetails>{serviceMonth.stats.deaf}</DescriptionDetails>
        </DescriptionList>
      </div>
    </div>
  )
}
