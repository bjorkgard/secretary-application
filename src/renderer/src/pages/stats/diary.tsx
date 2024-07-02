import { useEffect, useState }                            from 'react'
import { useTranslation }                                 from 'react-i18next'
import type { History, PublisherModel, ServiceYearModel } from 'src/types/models'

export default function StatsDiary(): JSX.Element {
  const { t } = useTranslation()

  const [publishers, setPublishers]                   = useState<PublisherModel[]>([])
  const [serviceYears, setServiceYears]               = useState<ServiceYearModel[]>([])
  const [selectedServiceYear, setSelectedServiceYear] = useState<ServiceYearModel>()

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-serviceYears')
      .then((serviceYears: ServiceYearModel[]) => setServiceYears(serviceYears.reverse()))

    window.electron.ipcRenderer
      .invoke('get-publishers', { sortfield: 'LASTNAME' })
      .then((publishers: PublisherModel[]) => setPublishers(publishers))
  }, [])

  const selectServiceYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== '')
      setSelectedServiceYear(serviceYears.find(sy => sy._id === e.target.value))

    else
      setSelectedServiceYear(undefined)
  }

  const getHistoryData = (type: string): History[] => {
    return selectedServiceYear?.history.filter(h => h.type === type) || []
  }

  const getAuxiliaries = (): History[] => {
    const auxiliaries: History[] = []

    for (const publisher of publishers) {
      const months: string[] = []
      for (const report of publisher.reports) {
        if (report.serviceYear === selectedServiceYear?.name) {
          if (report.auxiliary || report.type === 'AUXILIARY') {
            months.push(t(`month.${report.name}`))
          }
        }
      }

      if (months.length) {
        auxiliaries.push({
          date:        `${publisher.lastname} ${publisher.firstname}`,
          information: months.join(', '),
          type:        'AUXILIARY',
        })
      }
    }

    return auxiliaries
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between">
        <h1>{t('diary.headline')}</h1>

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
        <div>
          {getHistoryData('MOVED_IN').length
            ? (
                <>
                  <div className="px-4 sm:px-0">
                    <h3 className="mb-1 text-base font-semibold leading-7 text-gray-900 dark:text-white">{t('event.movedIut')}</h3>
                  </div>
                  <div className="border-t border-gray-100">
                    <dl className="my-1">
                      {getHistoryData('MOVED_IN').map(h => (
                        <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={h.information}>
                          <dt className="m-0 text-sm font-medium leading-6 text-gray-900 dark:text-white">{h.date}</dt>
                          <dd className="m-0 text-sm leading-6 text-gray-700 sm:col-span-2 dark:text-gray-400">{h.information}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )
            : null}
          {getHistoryData('MOVED_OUT').length
            ? (
                <>
                  <div className="px-4 sm:px-0">
                    <h3 className="mb-1 text-base font-semibold leading-7 text-gray-900 dark:text-white">{t('event.movedOut')}</h3>
                  </div>
                  <div className="border-t border-gray-100">
                    <dl className="my-1">
                      {getHistoryData('MOVED_OUT').map(h => (
                        <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={h.information}>
                          <dt className="m-0 text-sm font-medium leading-6 text-gray-900 dark:text-white">{h.date}</dt>
                          <dd className="m-0 text-sm leading-6 text-gray-700 sm:col-span-2 dark:text-gray-400">{h.information}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )
            : null}
          {getHistoryData('PUBLISHER').length
            ? (
                <>
                  <div className="px-4 sm:px-0">
                    <h3 className="mb-1 text-base font-semibold leading-7 text-gray-900 dark:text-white">{t('event.publisher')}</h3>
                  </div>
                  <div className="border-t border-gray-100">
                    <dl className="my-1">
                      {getHistoryData('PUBLISHER').map(h => (
                        <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={h.information}>
                          <dt className="m-0 text-sm font-medium leading-6 text-gray-900 dark:text-white">{h.date}</dt>
                          <dd className="m-0 text-sm leading-6 text-gray-700 sm:col-span-2 dark:text-gray-400">{h.information}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )
            : null}
          {getHistoryData('PIONEER_START').length
            ? (
                <>
                  <div className="px-4 sm:px-0">
                    <h3 className="mb-1 text-base font-semibold leading-7 text-gray-900 dark:text-white">{t('event.pioneer_start')}</h3>
                  </div>
                  <div className="border-t border-gray-100">
                    <dl className="my-1">
                      {getHistoryData('PIONEER_START').map(h => (
                        <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={h.information}>
                          <dt className="m-0 text-sm font-medium leading-6 text-gray-900 dark:text-white">{h.date}</dt>
                          <dd className="m-0 text-sm leading-6 text-gray-700 sm:col-span-2 dark:text-gray-400">{h.information}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )
            : null}
          {getHistoryData('PIONEER_SCHOOL').length
            ? (
                <>
                  <div className="px-4 sm:px-0">
                    <h3 className="mb-1 text-base font-semibold leading-7 text-gray-900 dark:text-white">{t('event.pioneer_school')}</h3>
                  </div>
                  <div className="border-t border-gray-100">
                    <dl className="my-1">
                      {getHistoryData('PIONEER_SCHOOL').map(h => (
                        <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={h.information}>
                          <dt className="m-0 text-sm font-medium leading-6 text-gray-900 dark:text-white">{h.date}</dt>
                          <dd className="m-0 text-sm leading-6 text-gray-700 sm:col-span-2 dark:text-gray-400">{h.information}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )
            : null}
          {getHistoryData('PIONEER_STOP').length
            ? (
                <>
                  <div className="px-4 sm:px-0">
                    <h3 className="mb-1 text-base font-semibold leading-7 text-gray-900 dark:text-white">{t('event.pioneer_stop')}</h3>
                  </div>
                  <div className="border-t border-gray-100">
                    <dl className="my-1">
                      {getHistoryData('PIONEER_STOP').map(h => (
                        <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={h.information}>
                          <dt className="m-0 text-sm font-medium leading-6 text-gray-900 dark:text-white">{h.date}</dt>
                          <dd className="m-0 text-sm leading-6 text-gray-700 sm:col-span-2 dark:text-gray-400">{h.information}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )
            : null}
          {getAuxiliaries().length
            ? (
                <>
                  <div className="px-4 sm:px-0">
                    <h3 className="mb-1 text-base font-semibold leading-7 text-gray-900 dark:text-white">{t('label.auxiliaries')}</h3>
                  </div>
                  <div className="border-t border-gray-100">
                    <dl className="my-1">
                      {getAuxiliaries().map(h => (
                        <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={h.date}>
                          <dt className="m-0 text-sm font-medium leading-6 text-gray-900 dark:text-white">{h.date}</dt>
                          <dd className="m-0 text-sm leading-6 text-gray-700 sm:col-span-2 dark:text-gray-400">{h.information}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )
            : null}
          {getHistoryData('BAPTISED').length
            ? (
                <>
                  <div className="px-4 sm:px-0">
                    <h3 className="mb-1 text-base font-semibold leading-7 text-gray-900 dark:text-white">{t('event.baptised')}</h3>
                  </div>
                  <div className="border-t border-gray-100">
                    <dl className="my-1">
                      {getHistoryData('BAPTISED').map(h => (
                        <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={h.information}>
                          <dt className="m-0 text-sm font-medium leading-6 text-gray-900 dark:text-white">{h.date}</dt>
                          <dd className="m-0 text-sm leading-6 text-gray-700 sm:col-span-2 dark:text-gray-400">{h.information}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )
            : null}
          {getHistoryData('START_MINISTERIAL_SERVANT').length
            ? (
                <>
                  <div className="px-4 sm:px-0">
                    <h3 className="mb-1 text-base font-semibold leading-7 text-gray-900 dark:text-white">{t('event.ministerialServantStart')}</h3>
                  </div>
                  <div className="border-t border-gray-100">
                    <dl className="my-1">
                      {getHistoryData('START_MINISTERIAL_SERVANT').map(h => (
                        <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={h.information}>
                          <dt className="m-0 text-sm font-medium leading-6 text-gray-900 dark:text-white">{h.date}</dt>
                          <dd className="m-0 text-sm leading-6 text-gray-700 sm:col-span-2 dark:text-gray-400">{h.information}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )
            : null}
          {getHistoryData('STOP_MINISTERIAL_SERVANT').length
            ? (
                <>
                  <div className="px-4 sm:px-0">
                    <h3 className="mb-1 text-base font-semibold leading-7 text-gray-900 dark:text-white">{t('event.ministerialServantStop')}</h3>
                  </div>
                  <div className="border-t border-gray-100">
                    <dl className="my-1">
                      {getHistoryData('STOP_MINISTERIAL_SERVANT').map(h => (
                        <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={h.information}>
                          <dt className="m-0 text-sm font-medium leading-6 text-gray-900 dark:text-white">{h.date}</dt>
                          <dd className="m-0 text-sm leading-6 text-gray-700 sm:col-span-2 dark:text-gray-400">{h.information}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )
            : null}
          {getHistoryData('START_ELDER').length
            ? (
                <>
                  <div className="px-4 sm:px-0">
                    <h3 className="mb-1 text-base font-semibold leading-7 text-gray-900 dark:text-white">{t('event.elderStart')}</h3>
                  </div>
                  <div className="border-t border-gray-100">
                    <dl className="my-1">
                      {getHistoryData('START_ELDER').map(h => (
                        <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={h.information}>
                          <dt className="m-0 text-sm font-medium leading-6 text-gray-900 dark:text-white">{h.date}</dt>
                          <dd className="m-0 text-sm leading-6 text-gray-700 sm:col-span-2 dark:text-gray-400">{h.information}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )
            : null}
          {getHistoryData('STOP_ELDER').length
            ? (
                <>
                  <div className="px-4 sm:px-0">
                    <h3 className="mb-1 text-base font-semibold leading-7 text-gray-900 dark:text-white">{t('event.elderStop')}</h3>
                  </div>
                  <div className="border-t border-gray-100">
                    <dl className="my-1">
                      {getHistoryData('STOP_ELDER').map(h => (
                        <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={h.information}>
                          <dt className="m-0 text-sm font-medium leading-6 text-gray-900 dark:text-white">{h.date}</dt>
                          <dd className="m-0 text-sm leading-6 text-gray-700 sm:col-span-2 dark:text-gray-400">{h.information}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )
            : null}
          {getHistoryData('DECEASED').length
            ? (
                <>
                  <div className="px-4 sm:px-0">
                    <h3 className="mb-1 text-base font-semibold leading-7 text-gray-900 dark:text-white">{t('event.deceased')}</h3>
                  </div>
                  <div className="border-t border-gray-100">
                    <dl className="my-1">
                      {getHistoryData('DECEASED').map(h => (
                        <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={h.information}>
                          <dt className="m-0 text-sm font-medium leading-6 text-gray-900 dark:text-white">{h.date}</dt>
                          <dd className="m-0 text-sm leading-6 text-gray-700 sm:col-span-2 dark:text-gray-400">{h.information}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )
            : null}
          {getHistoryData('DISASSOCIATION').length
            ? (
                <>
                  <div className="px-4 sm:px-0">
                    <h3 className="mb-1 text-base font-semibold leading-7 text-gray-900 dark:text-white">{t('event.disassociation')}</h3>
                  </div>
                  <div className="border-t border-gray-100">
                    <dl className="my-1">
                      {getHistoryData('DISASSOCIATION').map(h => (
                        <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={h.information}>
                          <dt className="m-0 text-sm font-medium leading-6 text-gray-900 dark:text-white">{h.date}</dt>
                          <dd className="m-0 text-sm leading-6 text-gray-700 sm:col-span-2 dark:text-gray-400">{h.information}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )
            : null}
          {getHistoryData('DISFELLOWSHIPPED').length
            ? (
                <>
                  <div className="px-4 sm:px-0">
                    <h3 className="mb-1 text-base font-semibold leading-7 text-gray-900 dark:text-white">{t('event.disfellowshipped')}</h3>
                  </div>
                  <div className="border-t border-gray-100">
                    <dl className="my-1">
                      {getHistoryData('DISFELLOWSHIPPED').map(h => (
                        <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={h.information}>
                          <dt className="m-0 text-sm font-medium leading-6 text-gray-900 dark:text-white">{h.date}</dt>
                          <dd className="m-0 text-sm leading-6 text-gray-700 sm:col-span-2 dark:text-gray-400">{h.information}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )
            : null}
        </div>
      )}
    </div>
  )
}
