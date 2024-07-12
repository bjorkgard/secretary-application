import { useEffect, useState }                      from 'react'
import { useTranslation }                           from 'react-i18next'
import type { ServiceMonthModel, ServiceYearModel } from 'src/types/models'
import LastMonth                                    from './components/lastMonth'
import Meetings                                     from './components/meetings'
import HistoryTable                                 from './components/history'
import Reports                                      from './components/reports'

export default function StatsAnalysis(): JSX.Element {
  const { t } = useTranslation()

  const [serviceMonths, setServiceMonths]             = useState<ServiceMonthModel[]>([])
  const [serviceYears, setServiceYears]               = useState<ServiceYearModel[]>([])
  const [selectedServiceYear, setSelectedServiceYear] = useState<ServiceYearModel>()

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-serviceYears')
      .then((serviceYears: ServiceYearModel[]) => setServiceYears(serviceYears.reverse()))
  }, [])

  useEffect(() => {
    if (selectedServiceYear) {
      window.electron.ipcRenderer
        .invoke('get-serviceMonths-by-ids', { ids: selectedServiceYear.serviceMonths })
        .then((serviceMonths: ServiceMonthModel[]) => setServiceMonths(serviceMonths))
    }
    else {
      setServiceMonths([])
    }
  }, [selectedServiceYear])

  const selectServiceYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== '')
      setSelectedServiceYear(serviceYears.find(sy => sy._id === e.target.value))

    else
      setSelectedServiceYear(undefined)
  }

  const getLastDoneIndex = (): number => {
    for (let i = 0; i < serviceMonths.length; i++) {
      if (serviceMonths[i].status !== 'DONE') {
        return i - 1
      }
    }
    return 0
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between">
        <h1>{t('analysis.headline')}</h1>

        <div className="flex space-x-4">
          <button className="btn btn-primary invisible" onClick={() => {}}>{t('label.add')}</button>

          <select className="select select-bordered w-fit" onChange={selectServiceYear}>
            <option value="">{t('label.selectServiceYear')}</option>
            {serviceYears.map((sy) => {
              return (
                <option key={sy._id} value={sy._id}>
                  {sy.name}
                </option>
              )
            })}
          </select>
        </div>
      </div>
      {selectedServiceYear && (
        <div className="grid grid-cols-2 gap-8">
          <HistoryTable serviceYear={selectedServiceYear} serviceMonths={serviceMonths} />
          <LastMonth serviceMonth={serviceMonths[getLastDoneIndex()]} />
          <Meetings serviceMonths={serviceMonths} />
          <Reports serviceMonths={serviceMonths} type="PIONEER" />
          <Reports serviceMonths={serviceMonths} type="PUBLISHER" />
          <Reports serviceMonths={serviceMonths} type="AUXILIARY" />
          <Reports serviceMonths={serviceMonths} type="SPECIALPIONEER" />
          <Reports serviceMonths={serviceMonths} type="MISSIONARY" />
        </div>
      )}
    </div>
  )
}
