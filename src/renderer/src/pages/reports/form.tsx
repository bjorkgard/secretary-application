import { Fragment, useState }                                from 'react'
import { useTranslation }                                    from 'react-i18next'
import { Tab }                                               from '@headlessui/react'
import type { Report, ServiceGroupModel, ServiceMonthModel } from 'src/types/models'
import classNames                                            from '@renderer/utils/classNames'
import { useEffectOnce }                                     from '@renderer/hooks/useOnMountUnsafe'
import generateIdentifier                                    from '@renderer/utils/generateIdentifier'
import { ArrowDownTrayIcon, ArrowUpTrayIcon }                from '@heroicons/react/24/solid'
import { ReportsTable }                                      from './components/reportTable'

interface iTab {
  id:      string
  name:    string
  reports: Report[]
}

export default function ReportsForm(): JSX.Element {
  const { t } = useTranslation()

  const [activeServiceMonth, setActiveServiceMonth] = useState<boolean>(true)
  const [tabs, setTabs]                             = useState<iTab[]>([])
  const [serviceMonthId, setServiceMonthId]         = useState<string>()
  const [serviceMonthName, setServiceMonthName]     = useState<string>()

  const generateTab = (serviceGroup: ServiceGroupModel, reports: Report[]): iTab => {
    const tab = {
      id:   serviceGroup._id || generateIdentifier(),
      name: serviceGroup.name,
      reports,
    }

    return tab
  }

  const filterReports = (reports: Report[], serviceGroupId: string): Report[] => {
    const filteredActiveReports: Report[]   = []
    const filteredInactiveReports: Report[] = []

    reports.forEach((report) => {
      if (report.publisherServiceGroupId === serviceGroupId) {
        if (report.publisherStatus === 'INACTIVE')
          filteredInactiveReports.push(report)

        else
          filteredActiveReports.push(report)
      }
    })

    return filteredActiveReports.concat(filteredInactiveReports)
  }

  useEffectOnce(() => {
    window.electron.ipcRenderer
      .invoke('current-service-month')
      .then((serviceMonth: ServiceMonthModel) => {
        if (!serviceMonth || serviceMonth.status === 'DONE') {
          setActiveServiceMonth(false)
        }
        else {
          setServiceMonthId(serviceMonth._id)
          setServiceMonthName(serviceMonth.name)

          let allReports = serviceMonth.reports

          window.electron.ipcRenderer
            .invoke('get-serviceGroups')
            .then((serviceGroups: ServiceGroupModel[]) => {
              const tabs: iTab[] = []

              for (const serviceGroup of serviceGroups) {
                if (serviceGroup._id) {
                  const reports = filterReports(allReports, serviceGroup._id)
                  tabs.push(generateTab(serviceGroup, reports))

                  allReports = allReports.filter(report => !reports.includes(report))
                }
              }

              // If there are any reports left, add them to the 'other' tab
              if (allReports.length > 0)
                tabs.push(generateTab({ name: t('label.missingGroup') }, allReports))

              setTabs(tabs)
            })
        }
      })
  })

  const generateExcelFiles = (): void => {
    window.electron.ipcRenderer.invoke('generate-excel-report-forms', serviceMonthId)
  }

  const importExcelFile = (): void => {
    window.electron.ipcRenderer.invoke('import-service-reports')
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1>{t('reports.headline')}</h1>
        {activeServiceMonth
          ? (
            <div className="space-x-4">
              <div className="tooltip tooltip-left" data-tip={t('reports.uploadExcelFiles')}>
                <button className="btn btn-circle btn-outline" onClick={importExcelFile}>
                  <ArrowUpTrayIcon className="size-6" />
                </button>
              </div>
              <div className="tooltip tooltip-left" data-tip={t('reports.downloadExcelFiles')}>
                <button className="btn btn-circle btn-outline" onClick={generateExcelFiles}>
                  <ArrowDownTrayIcon className="size-6" />
                </button>
              </div>
            </div>
            )
          : null}
      </div>
      <div className="-mt-4">
        {activeServiceMonth
          ? (
            <Tab.Group>
              <Tab.List className="-mb-px flex border-b border-gray-200 dark:border-slate-200">
                {tabs.map((tab) => {
                  return (
                    <Tab as={Fragment} key={tab.id}>
                      {({ selected }): JSX.Element => (
                        <button
                          className={classNames(
                            selected
                              ? 'border-green-500 text-green-600 dark:border-sky-500 dark:text-sky-400'
                              : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700 dark:text-slate-400 dark:hover:border-slate-200 dark:hover:text-slate-200',
                            'grow flex whitespace-nowrap border-b-2 py-4 px-1 justify-center text-md font-medium no-underline',
                          )}
                        >
                          {tab.name}
                        </button>
                      )}
                    </Tab>
                  )
                })}
              </Tab.List>
              <Tab.Panels className="mt-2">
                {tabs.map(tab => (
                  <Tab.Panel key={tab.id}>
                    <ReportsTable serviceGroupId={tab.id} reports={tab.reports} month={serviceMonthName || ''} />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
            )
          : (
            <h2>{t('reports.noActive')}</h2>
            )}
      </div>
    </div>
  )
}
