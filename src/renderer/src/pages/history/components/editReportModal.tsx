import { useTranslation } from 'react-i18next'
import { Modal }          from '@renderer/components/Modal'
import type { Report }    from 'src/types/models'
import { useForm }        from 'react-hook-form'
import { Field }          from '@renderer/components/Field'
import classNames         from '@renderer/utils/classNames'
import { useEffect }      from 'react'

interface EventModalProps {
  open:         boolean
  setOpen:      (open: boolean) => void
  report?:      Report
  publisherId?: string
  refresh:      () => void
}

interface ReportForm {
  hasBeenInService: string
  studies?:         number
  hours?:           number
  identifier:       string
  auxiliary:        boolean
  pioneer:          boolean
  specialPioneer:   boolean
  missionary:       boolean
  remarks?:         string
  serviceYear:      number
  serviceMonth:     string
  name:             string
  sortOrder:        number
  type:             string
  publisherStatus:  string
}

export default function ReportModal(props: EventModalProps): JSX.Element | null {
  const { t } = useTranslation()

  if (props.publisherId === '')
    return null

  const saveReport = (report: ReportForm): void => {
    window.electron.ipcRenderer.invoke('update-publisher-report', { publisherId: props.publisherId, report }).then(() => {
      props.refresh()
    })
  }

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReportForm>({
    defaultValues: {
      serviceYear:      0,
      serviceMonth:     '',
      name:             '',
      hasBeenInService: undefined,
      sortOrder:        0,
      identifier:       undefined,
      type:             'PUBLISHER',
      publisherStatus:  'ACTIVE',
      studies:          undefined,
      hours:            undefined,
      auxiliary:        false,
      pioneer:          false,
      specialPioneer:   false,
      missionary:       false,
      remarks:          undefined,
    },
  })

  useEffect(() => {
    if (props.report && props.publisherId) {
      setValue('serviceYear', props.report.serviceYear)
      setValue('serviceMonth', props.report.serviceMonth)
      setValue('name', props.report.name)
      setValue('sortOrder', props.report.sortOrder)
      setValue('identifier', props.report.identifier)
      setValue('type', props.report.type)
      setValue('publisherStatus', props.report.publisherStatus ?? 'ACTIVE')
      setValue('hasBeenInService', props.report.hasBeenInService ? 'YES' : 'NO')
      setValue('studies', props.report.studies)
      setValue('hours', props.report.hours)
      setValue('pioneer', props.report.type === 'PIONEER')
      setValue('specialPioneer', props.report.type === 'SPECIALPIONEER')
      setValue('missionary', props.report.type === 'MISSIONARY')
      setValue('auxiliary', (props.report.type === 'AUXILIARY' || props.report?.auxiliary) || false)
      setValue('remarks', props.report.remarks)
    }
  }, [props.publisherId, props.report])

  return (
    <Modal
      open={props.open}
      onClose={() => props.setOpen(false)}
      title={props.report ? `${t('label.editReport')}: ${props.report.serviceMonth}` : t('label.addReport')}
    >
      <form className="relative" onSubmit={handleSubmit(saveReport)}>
        <p className="text-sm">{t('report.description')}</p>
        <Field label={t('label.hasBeenInService')} error={errors.hasBeenInService?.message}>
          <select
            className={classNames(
              errors.hasBeenInService ? 'select-error' : '',
              'select select-bordered w-full',
            )}
            {...register('hasBeenInService', { required: t('errors.hasBeenInService.required') })}
          >
            <option value={undefined}>{t('label.select')}</option>
            <option value="YES">{t('label.yes')}</option>
            <option value="NO">{t('label.no')}</option>
          </select>
        </Field>

        <Field label={t('label.pioneerService')}>
          <div className="grid grid-cols-3">
            <div className="form-control col-span-3 text-left">
              <label className="label cursor-pointer justify-start">
                <input
                  {...register('auxiliary')}
                  type="checkbox"
                  className="checkbox-primary checkbox"
                  disabled={watch('hasBeenInService') === 'NO'}
                />
                <span className="label-text ml-2">{t('label.auxiliary')}</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer justify-start">
                <input
                  {...register('pioneer')}
                  type="checkbox"
                  className="checkbox-primary checkbox"
                  disabled={watch('hasBeenInService') === 'NO'}
                />
                <span className="label-text ml-2">{t('label.pioneer')}</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer justify-start">
                <input
                  {...register('specialPioneer')}
                  type="checkbox"
                  className="checkbox-primary checkbox"
                  disabled={watch('hasBeenInService') === 'NO'}
                />
                <span className="label-text ml-2">{t('label.specialPioneer')}</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer justify-start">
                <input
                  {...register('missionary')}
                  type="checkbox"
                  className="checkbox-primary checkbox"
                  disabled={watch('hasBeenInService') === 'NO'}
                />
                <span className="label-text ml-2">{t('label.missionary')}</span>
              </label>
            </div>
          </div>
        </Field>

        <Field label={t('label.studies')} error={errors.studies?.message}>
          <input
            className="input input-bordered w-full"
            {...register('studies')}
            disabled={watch('hasBeenInService') === 'NO'}
          />
        </Field>

        <Field label={t('label.hours')} error={errors.hours?.message}>
          <input
            {...register('hours')}
            className="input input-bordered w-full"
            disabled={watch('hasBeenInService') === 'NO' || (!watch('pioneer') && !watch('specialPioneer') && !watch('missionary') && !watch('auxiliary'))}
          />
        </Field>

        <Field label={t('label.remarks')} error={errors.remarks?.message}>
          <input
            {...register('remarks')}
            className="input input-bordered w-full"
          />
        </Field>

        <button type="submit" className="btn btn-primary mt-4 justify-items-end">
          {t('button.save')}
        </button>
      </form>
    </Modal>
  )
}
