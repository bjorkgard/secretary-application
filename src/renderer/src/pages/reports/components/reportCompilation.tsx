import { useTranslation }           from 'react-i18next'
import { ExclamationTriangleIcon }  from '@heroicons/react/20/solid'
import { inAuxiliaryService }       from '@renderer/utils/inAuxiliaryService'
import { inPioneerService }         from '@renderer/utils/inPioneerService'
import { inActivePublisherService } from '@renderer/utils/inActivePublisherService'
import { inSpecialPioneerService }  from '@renderer/utils/inSpecialPioneerService'
import { inMissionaryService }      from '@renderer/utils/inMissionaryService'
import { inCircuitOverseerService } from '@renderer/utils/inCircuitOverseerService'
import type { Report }              from 'src/types/models'

interface ComponentProps {
  reports:      Report[]
  serviceMonth: string
}

export default function ReportsComplilation({
  reports,
  serviceMonth,
}: ComponentProps): JSX.Element {
  const { t } = useTranslation()

  const activePublishers = reports.filter(
    report => report.publisherStatus !== 'INACTIVE' && report.serviceMonth === serviceMonth,
  ).length

  const totalReports
    = reports.filter(report => inActivePublisherService(report)).length
    + reports.filter(report => inAuxiliaryService(report)).length
    + reports.filter(report => inPioneerService(report)).length
    + reports.filter(report => inSpecialPioneerService(report)).length
    + reports.filter(report => inMissionaryService(report)).length
    + reports.filter(report => inCircuitOverseerService(report)).length

  const missingReports = reports.filter(
    report => !report.hasBeenInService && !report.hasNotBeenInService,
  ).length

  return (
    <div className="border-b border-gray-300 dark:border-slate-600">
      <table className="table">
        <thead>
          <tr>
            <th className="text-lg">{t('reports.headline')}</th>
            <th>{t('label.noReports')}</th>
            <th>{t('label.studies')}</th>
            <th>{t('label.hours')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{t('label.publishers')}</th>
            <td>{reports.filter(report => inActivePublisherService(report)).length}</td>
            <td>
              {reports
                .filter(report => inActivePublisherService(report))
                .reduce((acc, report) => acc + (report.studies || 0), 0)}
            </td>
            <td></td>
          </tr>
          <tr>
            <th>{t('label.auxiliaries')}</th>
            <td>{reports.filter(report => inAuxiliaryService(report)).length}</td>
            <td>
              {reports
                .filter(report => inAuxiliaryService(report))
                .reduce((acc, report) => acc + (report.studies || 0), 0)}
            </td>
            <td>
              {reports
                .filter(report => inAuxiliaryService(report))
                .reduce((acc, report) => acc + (report.hours || 0), 0)
                .toLocaleString()}
            </td>
          </tr>
          <tr>
            <th>{t('label.pioneers')}</th>
            <td>{reports.filter(report => inPioneerService(report)).length}</td>
            <td>
              {reports
                .filter(report => inPioneerService(report))
                .reduce((acc, report) => acc + (report.studies || 0), 0)}
            </td>
            <td>
              {reports
                .filter(report => inPioneerService(report))
                .reduce((acc, report) => acc + (report.hours || 0), 0)
                .toLocaleString()}
            </td>
          </tr>
          {reports.filter(report => inSpecialPioneerService(report)).length
            ? (
                <tr>
                  <th>{t('label.specialPioneers')}</th>
                  <td>{reports.filter(report => inSpecialPioneerService(report)).length}</td>
                  <td>
                    {reports
                      .filter(report => inSpecialPioneerService(report))
                      .reduce((acc, report) => acc + (report.studies || 0), 0)}
                  </td>
                  <td>
                    {reports
                      .filter(report => inSpecialPioneerService(report))
                      .reduce((acc, report) => acc + (report.hours || 0), 0)
                      .toLocaleString()}
                  </td>
                </tr>
              )
            : null}

          {reports.filter(report => inMissionaryService(report)).length
            ? (
                <tr>
                  <th>{t('label.missionaries')}</th>
                  <td>{reports.filter(report => inMissionaryService(report)).length}</td>
                  <td>
                    {reports
                      .filter(report => inMissionaryService(report))
                      .reduce((acc, report) => acc + (report.studies || 0), 0)}
                  </td>
                  <td>
                    {reports
                      .filter(report => inMissionaryService(report))
                      .reduce((acc, report) => acc + (report.hours || 0), 0)
                      .toLocaleString()}
                  </td>
                </tr>
              )
            : null}

          {reports.filter(report => inCircuitOverseerService(report)).length
            ? (
                <tr>
                  <th>{t('label.circuitOverseers')}</th>
                  <td>{reports.filter(report => inCircuitOverseerService(report)).length}</td>
                  <td>
                    {reports
                      .filter(report => inCircuitOverseerService(report))
                      .reduce((acc, report) => acc + (report.studies || 0), 0)}
                  </td>
                  <td>
                    {reports
                      .filter(report => inCircuitOverseerService(report))
                      .reduce((acc, report) => acc + (report.hours || 0), 0)
                      .toLocaleString()}
                  </td>
                </tr>
              )
            : null}
        </tbody>
        <tfoot>
          <tr>
            <th>{t('label.sum')}</th>
            <th className="flex justify-items-center">
              {totalReports}
              {missingReports > 0
                ? (
                    <div
                      className="tooltip ml-2"
                      data-tip={t('label.missingReports', { count: missingReports })}
                    >
                      <ExclamationTriangleIcon className="size-5 text-red-500" />
                    </div>
                  )
                : null}
            </th>
            <th>
              {reports
                .filter(report => inActivePublisherService(report))
                .reduce((acc, report) => acc + (report.studies || 0), 0)
                + reports
                  .filter(report => inAuxiliaryService(report))
                  .reduce((acc, report) => acc + (report.studies || 0), 0)
                  + reports
                    .filter(report => inPioneerService(report))
                    .reduce((acc, report) => acc + (report.studies || 0), 0)}
            </th>
            <th>
              {(
                reports
                  .filter(report => inAuxiliaryService(report))
                  .reduce((acc, report) => acc + (report.hours || 0), 0)
                  + reports
                    .filter(report => inPioneerService(report))
                    .reduce((acc, report) => acc + (report.hours || 0), 0)
              ).toLocaleString()}
            </th>
          </tr>
          <tr>
            <th>{t('label.activePublishers')}</th>
            <th>{activePublishers}</th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <th>{t('label.missingReports')}</th>
            <th>{missingReports}</th>
            <th></th>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
