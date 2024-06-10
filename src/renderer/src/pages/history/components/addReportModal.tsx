import { useTranslation }      from 'react-i18next'
import { Modal }               from '@renderer/components/Modal'
import type { PublisherModel } from 'src/types/models'
import { useForm }             from 'react-hook-form'
import { Field }               from '@renderer/components/Field'
import classNames              from '@renderer/utils/classNames'
import { useEffect }           from 'react'

interface EventModalProps {
  open:       boolean
  setOpen:    (open: boolean) => void
  publisher?: PublisherModel
  refresh:    () => void
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

export default function AddReportModal(props: EventModalProps): JSX.Element | null {
  const { t } = useTranslation()
  const today = new Date()

  const saveReport = (report: ReportForm): void => {
    window.electron.ipcRenderer.invoke('add-publisher-report', { publisherId: props.publisher?._id, report }).then(() => {
      props.refresh()
    })
  }

  const {
    clearErrors,
    handleSubmit,
    register,
    setError,
    setValue,
    watch,
    formState: { errors, isValid },
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
    if (props.open) {
      clearErrors()

      setValue('serviceYear', 0)
      setValue('serviceMonth', '')
      setValue('name', '')
      setValue('sortOrder', 0)
      setValue('type', 'PUBLISHER')
      setValue('publisherStatus', props.publisher?.status ?? 'ACTIVE')
      setValue('hasBeenInService', '')
      setValue('studies', undefined)
      setValue('hours', undefined)
      setValue('pioneer', props.publisher?.appointments.some(a => a.type === 'PIONEER') || false)
      setValue('specialPioneer', props.publisher?.appointments.some(a => a.type === 'SPECIALPIONEER') || false)
      setValue('missionary', props.publisher?.appointments.some(a => a.type === 'MISSIONARY') || false)
      setValue('auxiliary', props.publisher?.appointments.some(a => a.type === 'AUXILIARY') || false)
      setValue('remarks', '')
    }
  }, [props.open])

  return (
    <Modal
      open={props.open}
      onClose={() => props.setOpen(false)}
      title={props.publisher ? `${t('label.addReport')}: ${props.publisher?.firstname} ${props.publisher?.lastname}` : ''}
    >
      <form className="relative" onSubmit={handleSubmit(saveReport)}>
        <p className="text-sm">{t('report.description')}</p>
        <Field label={t('label.serviceMonth')} error={errors.serviceMonth?.message}>
          <input
            type="month"
            className="input input-bordered w-full"
            max={`${today.getFullYear()}-${today.getMonth() < 10 ? '0' : ''}${today.getMonth()}`}
            {...register('serviceMonth', {
              required: t('errors.required'),
              onChange(event) {
                clearErrors('serviceMonth')
                const exists = props.publisher?.reports.find(r => r.serviceMonth === event.target.value)

                if (exists) {
                  setError('serviceMonth', {
                    type:    'unique',
                    message: t('errors.serviceMonthExists'),
                  })
                }
              },
            })}
          />
        </Field>
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

        <button type="submit" className="btn btn-primary mt-4 justify-items-end" disabled={!isValid}>
          {t('button.save')}
        </button>
      </form>
    </Modal>
  )
}
