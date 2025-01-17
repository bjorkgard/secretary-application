import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@renderer/components/catalyst/description-list'
import { useEffect, useState }                                  from 'react'
import { useTranslation }                                       from 'react-i18next'
import type { ServiceMonthModel, ServiceYearModel }             from 'src/types/models'

interface Props {
  serviceYear:   ServiceYearModel
  serviceMonths: ServiceMonthModel[]
}

export default function HistoryTable({ serviceYear, serviceMonths }: Props): JSX.Element | null {
  const { t } = useTranslation()

  const [auxiliaryMonths, setAuxiliaryMonths] = useState<number>(0)

  if (!serviceYear || !serviceMonths) {
    return null
  }

  useEffect(() => {
    let am = 0
    for (const serviceMonth of serviceMonths) {
      if (serviceMonth.status === 'DONE') {
        am += serviceMonth.reports.filter(report => report.auxiliary).length
      }
    }
    setAuxiliaryMonths(am)
  }, [serviceMonths])

  const getHistoryDataNumber = (type: string): number => {
    return serviceYear?.history.filter(h => h.type === type).length || 0
  }

  return (
    <div className="row-span-2 rounded-md bg-gray-200 p-4 dark:border dark:border-white/10 dark:bg-transparent">
      <div className="px-4 sm:px-0">
        <h3 className="mt-0 text-base font-semibold text-gray-900 dark:text-white">{t('label.happendInYear')}</h3>
      </div>
      <div className="border-t border-gray-100 dark:border-white/10">
        <DescriptionList>
          <DescriptionTerm>{t('analysis.newPublishers')}</DescriptionTerm>
          <DescriptionDetails>{getHistoryDataNumber('PUBLISHER')}</DescriptionDetails>

          <DescriptionTerm>{t('analysis.baptised')}</DescriptionTerm>
          <DescriptionDetails>{getHistoryDataNumber('BAPTISED')}</DescriptionDetails>

          <DescriptionTerm>{t('analysis.auxiliaries')}</DescriptionTerm>
          <DescriptionDetails>{auxiliaryMonths}</DescriptionDetails>

          <DescriptionTerm>{t('analysis.movedIn')}</DescriptionTerm>
          <DescriptionDetails>{getHistoryDataNumber('MOVED_IN')}</DescriptionDetails>

          <DescriptionTerm>{t('analysis.movedOut')}</DescriptionTerm>
          <DescriptionDetails>{getHistoryDataNumber('MOVED_OUT')}</DescriptionDetails>

          <DescriptionTerm>{t('analysis.active')}</DescriptionTerm>
          <DescriptionDetails>{getHistoryDataNumber('ACTIVE')}</DescriptionDetails>

          <DescriptionTerm>{t('analysis.inactive')}</DescriptionTerm>
          <DescriptionDetails>{getHistoryDataNumber('INACTIVE')}</DescriptionDetails>

          <DescriptionTerm>{t('analysis.disassociation')}</DescriptionTerm>
          <DescriptionDetails>{getHistoryDataNumber('DISASSOCIATION')}</DescriptionDetails>

          <DescriptionTerm>{t('analysis.disfellowshipped')}</DescriptionTerm>
          <DescriptionDetails>{getHistoryDataNumber('DISFELLOWSHIPPED')}</DescriptionDetails>

          <DescriptionTerm>{t('analysis.reinstated')}</DescriptionTerm>
          <DescriptionDetails>{getHistoryDataNumber('REINSTATED')}</DescriptionDetails>
        </DescriptionList>
      </div>
    </div>
  )
}
