import { Controller, useFieldArray, useForm }                            from 'react-hook-form'
import { useTranslation }                                                from 'react-i18next'
import type { Report }                                                   from 'src/types/models'
import { useSettingsState }                                              from '@renderer/store/settingsStore'
import classNames                                                        from '@renderer/utils/classNames'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@renderer/components/catalyst/table'
import { Button }                                                        from '@renderer/components/catalyst/button'
import { Input }                                                         from '@renderer/components/catalyst/input'
import { Switch, SwitchField, SwitchGroup }                              from '@renderer/components/catalyst/switch'
import { Checkbox, CheckboxField, CheckboxGroup }                        from '@renderer/components/catalyst/checkbox'
import { Label }                                                         from '@renderer/components/catalyst/fieldset'

interface ComponentProps {
  reports:        Report[]
  month:          string
  serviceGroupId: string
}

export function ReportsTable({ month, reports, serviceGroupId }: ComponentProps): JSX.Element {
  const { t }         = useTranslation()
  const settingsState = useSettingsState()

  const { register, control, setValue, getValues, watch } = useForm({
    defaultValues: { reports },
  })

  const { fields }   = useFieldArray({
    control,
    name: 'reports',
  })
  const watchReports = watch('reports')

  const saveReport = (index: number): void => {
    const report = getValues(`reports.${index}`)

    window.electron.ipcRenderer.invoke('save-report', report).then(() => {
      window.Notification.requestPermission().then(() => {
        // eslint-disable-next-line no-new
        new window.Notification('SECRETARY', {
          body:   t('reports.saved'),
          silent: true,
        })
      })
    })
  }

  const handleBibleStudies = (index: number): void => {
    const report = getValues(`reports.${index}`)

    if (report.studies && report.studies > 0) {
      setValue(`reports.${index}.hasBeenInService`, true)
      setValue(`reports.${index}.hasNotBeenInService`, false)
    }
    else {
      setValue(`reports.${index}.hasBeenInService`, false)
      setValue(`reports.${index}.hasNotBeenInService`, false)
    }

    saveReport(index)
  }

  const handleAuxiliary = (index: number): void => {
    const report = getValues(`reports.${index}`)

    if (report.auxiliary) {
      // Save the report if the auxiliary checkbox is unchecked otherwise we need hours to be filled before saving
      setValue(`reports.${index}.auxiliary`, false)
      setValue(`reports.${index}.hours`, undefined)
      saveReport(index)
    }
    else {
      setValue(`reports.${index}.auxiliary`, true)
    }
  }

  const handleHours = (index: number): void => {
    const report = getValues(`reports.${index}`)

    if (report.hours && report.hours > 0) {
      setValue(`reports.${index}.hasBeenInService`, true)
      setValue(`reports.${index}.hasNotBeenInService`, false)
    }
    else {
      setValue(`reports.${index}.hasBeenInService`, false)
      setValue(`reports.${index}.hasNotBeenInService`, true)
    }

    saveReport(index)
  }

  const handleRemarks = (index: number): void => {
    saveReport(index)
  }

  const handleHasBeenInService = (index: number): void => {
    const report = getValues(`reports.${index}`)

    setValue(`reports.${index}.hasBeenInService`, true)
    setValue(`reports.${index}.hasNotBeenInService`, false)

    if (report.type === 'PUBLISHER' && !report.auxiliary)
      saveReport(index)
  }

  const handleHasNotBeenInService = (index: number): void => {
    const report = getValues(`reports.${index}`)

    setValue(`reports.${index}.hasBeenInService`, false)
    setValue(`reports.${index}.hasNotBeenInService`, true)
    setValue(`reports.${index}.studies`, undefined)
    setValue(`reports.${index}.hours`, undefined)
    setValue(`reports.${index}.auxiliary`, false)

    if (report.type === 'PUBLISHER' && !report.auxiliary)
      saveReport(index)
  }

  const resendReportForm = (serviceGroupId: string): void  => {
    window.electron.ipcRenderer.invoke('resend-serviceGroupForm', { serviceGroupId }).then(() => {
      window.Notification.requestPermission().then(() => {
        // eslint-disable-next-line no-new
        new window.Notification('SECRETARY', {
          body:   t('reports.serviceGroupReportsResent'),
          silent: false,
        })
      })
    })
  }

  return (
    <div className="overflow-x-auto">
      <form>
        <Table dense bleed grid sticky striped className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]" margin={255}>
          <TableHead>
            <TableRow>
              <TableHeader>{t('label.name')}</TableHeader>
              <TableHeader>{t('label.attended')}</TableHeader>
              <TableHeader>{t('label.studies')}</TableHeader>
              <TableHeader>{t('label.aux')}</TableHeader>
              <TableHeader>{t('label.hours')}</TableHeader>
              <TableHeader>{t('label.remarks')}</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((report, index) => (
              <TableRow key={report.identifier}>
                <TableCell>
                  {report.publisherName}
                  {month !== report.name
                    ? (
                        <>
                          <br />
                          <span className="text-xs italic">{report.name}</span>
                        </>
                      )
                    : null}
                </TableCell>
                <TableCell>
                  <CheckboxGroup>
                    <CheckboxField>
                      <Controller
                        name={`reports.${index}.hasBeenInService`}
                        control={control}
                        render={({ field: { value } }) => (
                          <Checkbox
                            color="blue"
                            onChange={() => {
                              handleHasBeenInService(index)
                            }}
                            checked={value}
                          />
                        )}
                      />
                      <Label>{t('label.yes')}</Label>
                    </CheckboxField>
                    <CheckboxField>
                      <Controller
                        name={`reports.${index}.hasNotBeenInService`}
                        control={control}
                        render={({ field: { value } }) => (
                          <Checkbox
                            color="blue"
                            onChange={() => {
                              handleHasNotBeenInService(index)
                            }}
                            checked={value}
                          />
                        )}
                      />
                      <Label>{t('label.no')}</Label>
                    </CheckboxField>
                  </CheckboxGroup>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    {...register(`reports.${index}.studies`)}
                    min={0}
                    onBlur={(): void => handleBibleStudies(index)}
                  />
                </TableCell>
                <TableCell>
                  <SwitchGroup>
                    <SwitchField>
                      <Controller
                        name={`reports.${index}.auxiliary`}
                        control={control}
                        render={({ field: { value } }) => (
                          <Switch
                            color="blue"
                            onChange={() => { handleAuxiliary(index) }}
                            checked={value}
                            disabled={
                              fields[index].type !== 'PUBLISHER'
                              || fields[index].publisherStatus === 'INACTIVE'
                            }
                          />
                        )}
                      />
                    </SwitchField>
                  </SwitchGroup>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    {...register(`reports.${index}.hours`)}
                    disabled={fields[index].type === 'PUBLISHER' && !watchReports[index].auxiliary}
                    min={0}
                    onBlur={(): void => handleHours(index)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    {...register(`reports.${index}.remarks`)}
                    onBlur={(): void => handleRemarks(index)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </form>
      <div className="mt-4 flex w-full justify-end">
        <Button color="blue" className={classNames(!settingsState.online.send_report_group ? 'invisible' : '')} onClick={() => resendReportForm(serviceGroupId)}>{t('label.resendServiceGroupReports')}</Button>
      </div>
    </div>
  )
}
