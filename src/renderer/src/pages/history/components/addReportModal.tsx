import { useTranslation }                       from 'react-i18next'
import { Modal }                                from '@renderer/components/Modal'
import type { PublisherModel }                  from 'src/types/models'
import { Controller, useForm }                  from 'react-hook-form'
import { useEffect }                            from 'react'
import { Button }                               from '@renderer/components/catalyst/button'
import { ErrorMessage, Field, Fieldset, Label } from '@renderer/components/catalyst/fieldset'
import { Text }                                 from '@renderer/components/catalyst/text'
import { Input }                                from '@renderer/components/catalyst/input'
import { Select }                               from '@renderer/components/catalyst/select'
import { Switch }                               from '@renderer/components/catalyst/switch'
import * as Headless                            from '@headlessui/react'

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
    control,
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
      <form onSubmit={handleSubmit(saveReport)}>
        <Fieldset>
          <div className="grid grid-cols-1 gap-y-4">
            <Text>{t('report.description')}</Text>
            <Field>
              <Label>{t('label.serviceMonth')}</Label>
              <Input
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
                type="month"
                max={`${today.getFullYear()}-${today.getMonth() < 10 ? '0' : ''}${today.getMonth()}`}
                invalid={!!errors.serviceMonth?.message}
                autoFocus
              />
              {errors.serviceMonth && <ErrorMessage>{errors.serviceMonth.message}</ErrorMessage>}
            </Field>
            <Field>
              <Label>{t('label.hasBeenInService')}</Label>
              <Select {...register('hasBeenInService', { required: t('errors.hasBeenInService.required') })}>
                <option value={undefined}>{t('label.select')}</option>
                <option value="YES">{t('label.yes')}</option>
                <option value="NO">{t('label.no')}</option>
              </Select>
            </Field>
            <Field>
              <Label>{t('label.pioneerService')}</Label>
              <div className="grid grid-cols-3">
                <div className="col-span-3 mb-2 text-left">
                  <Headless.Field className="flex items-center gap-2">
                    <Controller
                      name="auxiliary"
                      control={control}
                      render={({ field: { onChange, value } }) => (<Switch color="blue" onChange={onChange} checked={value} disabled={watch('hasBeenInService') === 'NO'} />)}
                    />
                    <Label>{t('label.auxiliary')}</Label>
                  </Headless.Field>
                </div>
                <Headless.Field className="flex items-center gap-2">
                  <Controller
                    name="pioneer"
                    control={control}
                    render={({ field: { onChange, value } }) => (<Switch color="blue" onChange={onChange} checked={value} disabled={watch('hasBeenInService') === 'NO'} />)}
                  />
                  <Label>{t('label.pioneer')}</Label>
                </Headless.Field>
                <Headless.Field className="flex items-center gap-2">
                  <Controller
                    name="specialPioneer"
                    control={control}
                    render={({ field: { onChange, value } }) => (<Switch color="blue" onChange={onChange} checked={value} disabled={watch('hasBeenInService') === 'NO'} />)}
                  />
                  <Label>{t('label.specialPioneer')}</Label>
                </Headless.Field>
                <Headless.Field className="flex items-center gap-2">
                  <Controller
                    name="missionary"
                    control={control}
                    render={({ field: { onChange, value } }) => (<Switch color="blue" onChange={onChange} checked={value} disabled={watch('hasBeenInService') === 'NO'} />)}
                  />
                  <Label>{t('label.missionary')}</Label>
                </Headless.Field>
              </div>
            </Field>
            <Field>
              <Label>{t('label.studies')}</Label>
              <Input
                {...register('studies')}
                disabled={watch('hasBeenInService') === 'NO'}
              />
            </Field>
            <Field>
              <Label>{t('label.hours')}</Label>
              <Input
                {...register('hours')}
                disabled={watch('hasBeenInService') === 'NO' || (!watch('pioneer') && !watch('specialPioneer') && !watch('missionary') && !watch('auxiliary'))}
              />
            </Field>
            <Field>
              <Label>{t('label.remarks')}</Label>
              <Input {...register('remarks')} />
            </Field>
          </div>
        </Fieldset>

        <div className="mt-4 flex justify-between">
          <Button outline onClick={() => props.setOpen(false)}>
            {t('button.abort')}
          </Button>
          <Button color="blue" type="submit" disabled={!isValid}>
            {t('button.save')}
          </Button>
        </div>

      </form>
    </Modal>
  )
}
