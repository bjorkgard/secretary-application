import { useTranslation }                                                                        from 'react-i18next'
import { ExclamationTriangleIcon }                                                               from '@heroicons/react/20/solid'
import { inAuxiliaryService }                                                                    from '@renderer/utils/inAuxiliaryService'
import { inPioneerService }                                                                      from '@renderer/utils/inPioneerService'
import { inActivePublisherService }                                                              from '@renderer/utils/inActivePublisherService'
import { inSpecialPioneerService }                                                               from '@renderer/utils/inSpecialPioneerService'
import { inMissionaryService }                                                                   from '@renderer/utils/inMissionaryService'
import { inCircuitOverseerService }                                                              from '@renderer/utils/inCircuitOverseerService'
import type { Report }                                                                           from 'src/types/models'
import { Table, TableBody, TableCell, TableFoot, TableFooter, TableHead, TableHeader, TableRow } from '@renderer/components/catalyst/table'

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
    <Table dense bleed grid striped className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
      <TableHead>
        <TableRow>
          <TableHeader>{t('reports.headline')}</TableHeader>
          <TableHeader>{t('label.noReports')}</TableHeader>
          <TableHeader>{t('label.studies')}</TableHeader>
          <TableHeader>{t('label.hours')}</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>{t('label.publishers')}</TableCell>
          <TableCell>{reports.filter(report => inActivePublisherService(report)).length}</TableCell>
          <TableCell>
            {reports
              .filter(report => inActivePublisherService(report))
              .reduce((acc, report) => acc + (report.studies || 0), 0)}
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t('label.auxiliaries')}</TableCell>
          <TableCell>{reports.filter(report => inAuxiliaryService(report)).length}</TableCell>
          <TableCell>
            {reports
              .filter(report => inAuxiliaryService(report))
              .reduce((acc, report) => acc + (report.studies || 0), 0)}
          </TableCell>
          <TableCell>
            {reports
              .filter(report => inAuxiliaryService(report))
              .reduce((acc, report) => acc + (report.hours || 0), 0)
              .toLocaleString()}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t('label.pioneers')}</TableCell>
          <TableCell>{reports.filter(report => inPioneerService(report)).length}</TableCell>
          <TableCell>
            {reports
              .filter(report => inPioneerService(report))
              .reduce((acc, report) => acc + (report.studies || 0), 0)}
          </TableCell>
          <TableCell>
            {reports
              .filter(report => inPioneerService(report))
              .reduce((acc, report) => acc + (report.hours || 0), 0)
              .toLocaleString()}
          </TableCell>
        </TableRow>
        {reports.filter(report => inSpecialPioneerService(report)).length
          ? (
              <TableRow>
                <TableCell>{t('label.specialPioneers')}</TableCell>
                <TableCell>{reports.filter(report => inSpecialPioneerService(report)).length}</TableCell>
                <TableCell>
                  {reports
                    .filter(report => inSpecialPioneerService(report))
                    .reduce((acc, report) => acc + (report.studies || 0), 0)}
                </TableCell>
                <TableCell>
                  {reports
                    .filter(report => inSpecialPioneerService(report))
                    .reduce((acc, report) => acc + (report.hours || 0), 0)
                    .toLocaleString()}
                </TableCell>
              </TableRow>
            )
          : null}

        {reports.filter(report => inMissionaryService(report)).length
          ? (
              <TableRow>
                <TableCell>{t('label.missionaries')}</TableCell>
                <TableCell>{reports.filter(report => inMissionaryService(report)).length}</TableCell>
                <TableCell>
                  {reports
                    .filter(report => inMissionaryService(report))
                    .reduce((acc, report) => acc + (report.studies || 0), 0)}
                </TableCell>
                <TableCell>
                  {reports
                    .filter(report => inMissionaryService(report))
                    .reduce((acc, report) => acc + (report.hours || 0), 0)
                    .toLocaleString()}
                </TableCell>
              </TableRow>
            )
          : null}

        {reports.filter(report => inCircuitOverseerService(report)).length
          ? (
              <TableRow>
                <TableCell>{t('label.circuitOverseers')}</TableCell>
                <TableCell>{reports.filter(report => inCircuitOverseerService(report)).length}</TableCell>
                <TableCell>
                  {reports
                    .filter(report => inCircuitOverseerService(report))
                    .reduce((acc, report) => acc + (report.studies || 0), 0)}
                </TableCell>
                <TableCell>
                  {reports
                    .filter(report => inCircuitOverseerService(report))
                    .reduce((acc, report) => acc + (report.hours || 0), 0)
                    .toLocaleString()}
                </TableCell>
              </TableRow>
            )
          : null}
      </TableBody>
      <TableFoot>
        <TableRow>
          <TableFooter>{t('label.sum')}</TableFooter>
          <TableFooter className="flex justify-items-center">
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
          </TableFooter>
          <TableFooter>
            {reports
              .filter(report => inActivePublisherService(report))
              .reduce((acc, report) => acc + (report.studies || 0), 0)
              + reports
                .filter(report => inAuxiliaryService(report))
                .reduce((acc, report) => acc + (report.studies || 0), 0)
                + reports
                  .filter(report => inPioneerService(report))
                  .reduce((acc, report) => acc + (report.studies || 0), 0)}
          </TableFooter>
          <TableFooter>
            {(
              reports
                .filter(report => inAuxiliaryService(report))
                .reduce((acc, report) => acc + (report.hours || 0), 0)
                + reports
                  .filter(report => inPioneerService(report))
                  .reduce((acc, report) => acc + (report.hours || 0), 0)
            ).toLocaleString()}
          </TableFooter>
        </TableRow>
        <TableRow>
          <TableFooter>{t('label.activePublishers')}</TableFooter>
          <TableFooter colSpan={3}>{activePublishers}</TableFooter>
        </TableRow>
        <TableRow>
          <TableFooter>{t('label.missingReports')}</TableFooter>
          <TableFooter colSpan={3}>{missingReports}</TableFooter>
        </TableRow>
      </TableFoot>
    </Table>
  )
}
