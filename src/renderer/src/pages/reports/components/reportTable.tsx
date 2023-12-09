import { ChangeEvent } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Report } from 'src/types/models'

interface ComponentProps {
  reports: Report[]
  month: string
}

export const ReportsTable = ({ month, reports }: ComponentProps): JSX.Element => {
  const { t } = useTranslation()

  const { register, control, setValue, getValues, watch } = useForm({
    defaultValues: { reports: reports }
  })

  const { fields } = useFieldArray({
    control,
    name: 'reports'
  })
  const watchReports = watch('reports')

  const saveReport = (index: number): void => {
    const report = getValues(`reports.${index}`)

    window.electron.ipcRenderer.invoke('save-report', report).then(() => {
      window.Notification.requestPermission().then(() => {
        new window.Notification('SECRETARY', {
          body: t('reports.saved'),
          silent: true
        })
      })
    })
  }

  const handleBibleStudies = (index: number): void => {
    const report = getValues(`reports.${index}`)

    if (report.studies && report.studies > 0) {
      setValue(`reports.${index}.hasBeenInService`, true)
      setValue(`reports.${index}.hasNotBeenInService`, false)
    } else {
      setValue(`reports.${index}.hasBeenInService`, false)
      setValue(`reports.${index}.hasNotBeenInService`, false)
    }

    saveReport(index)
  }

  const handleAuxiliary = (index: number, e: ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.checked) {
      // Save the report if the auxiliary checkbox is unchecked otherwise we need hours to be filled before saving
      setValue(`reports.${index}.auxiliary`, false)
      setValue(`reports.${index}.hours`, undefined)
      saveReport(index)
    } else {
      setValue(`reports.${index}.auxiliary`, true)
    }
  }

  const handleHours = (index: number): void => {
    const report = getValues(`reports.${index}`)

    if (report.hours && report.hours > 0) {
      setValue(`reports.${index}.hasBeenInService`, true)
      setValue(`reports.${index}.hasNotBeenInService`, false)
    } else {
      setValue(`reports.${index}.hasBeenInService`, false)
      setValue(`reports.${index}.hasNotBeenInService`, true)
    }

    saveReport(index)
  }

  const handleRemarks = (index: number): void => {
    saveReport(index)
  }

  const handleHasBeenInService = (index: number, e: ChangeEvent<HTMLInputElement>): void => {
    const report = getValues(`reports.${index}`)

    if (e.target.checked) {
      setValue(`reports.${index}.hasBeenInService`, true)
      setValue(`reports.${index}.hasNotBeenInService`, false)
    } else {
      setValue(`reports.${index}.hasBeenInService`, true)
    }

    if (report.type === 'PUBLISHER' && !report.auxiliary) {
      saveReport(index)
    }
  }

  const handleHasNotBeenInService = (index: number, e: ChangeEvent<HTMLInputElement>): void => {
    const report = getValues(`reports.${index}`)

    if (e.target.checked) {
      setValue(`reports.${index}.hasBeenInService`, false)
      setValue(`reports.${index}.hasNotBeenInService`, true)
      setValue(`reports.${index}.studies`, undefined)
      setValue(`reports.${index}.hours`, undefined)
      setValue(`reports.${index}.auxiliary`, false)
    } else {
      setValue(`reports.${index}.hasNotBeenInService`, true)
    }

    if (report.type === 'PUBLISHER' && !report.auxiliary) {
      saveReport(index)
    }
  }

  return (
    <div className="overflow-x-auto">
      <form>
        <table className="table">
          <thead>
            <tr>
              <th>{t('label.name')}</th>
              <th>{t('label.attended')}</th>
              <th>{t('label.studies')}</th>
              <th>{t('label.aux')}</th>
              <th>{t('label.hours')}</th>
              <th>{t('label.remarks')}</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((report, index) => (
              <tr key={report.identifier}>
                <td>
                  {report.publisherName}
                  {month !== report.name ? (
                    <>
                      <br />
                      <span className="text-xs italic">{report.name}</span>
                    </>
                  ) : null}
                </td>
                <td>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <input
                        {...register(`reports.${index}.hasBeenInService`)}
                        type="checkbox"
                        className="checkbox-primary checkbox checkbox-xs"
                        onChange={(e): void => handleHasBeenInService(index, e)}
                      />
                      <span className="label-text text-xs">{t('label.yes')}</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <input
                        {...register(`reports.${index}.hasNotBeenInService`)}
                        type="checkbox"
                        className="checkbox-primary checkbox checkbox-xs"
                        onChange={(e): void => handleHasNotBeenInService(index, e)}
                      />
                      <span className="label-text text-xs">{t('label.no')}</span>
                    </label>
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    className="input input-bordered input-md w-full"
                    {...register(`reports.${index}.studies`)}
                    min={0}
                    onBlur={(): void => handleBibleStudies(index)}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox-primary checkbox checkbox-sm"
                    {...register(`reports.${index}.auxiliary`)}
                    onChange={(e): void => handleAuxiliary(index, e)}
                    disabled={
                      fields[index].type !== 'PUBLISHER' ||
                      fields[index].publisherStatus === 'INACTIVE'
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="input input-bordered input-md w-full"
                    {...register(`reports.${index}.hours`)}
                    disabled={fields[index].type === 'PUBLISHER' && !watchReports[index].auxiliary}
                    min={0}
                    onBlur={(): void => handleHours(index)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="input input-bordered input-md w-full"
                    {...register(`reports.${index}.remarks`)}
                    onBlur={(): void => handleRemarks(index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </div>
  )
}
