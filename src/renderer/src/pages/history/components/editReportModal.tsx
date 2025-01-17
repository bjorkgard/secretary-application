import { useTranslation }         from 'react-i18next'
import { Modal }                  from '@renderer/components/Modal'
import type { Report }            from 'src/types/models'
import { Controller, useForm }    from 'react-hook-form'
import { useEffect }              from 'react'
import { Field, Fieldset, Label } from '@renderer/components/catalyst/fieldset'
import { Text }                   from '@renderer/components/catalyst/text'
import * as Headless              from '@headlessui/react'
import { Input }                  from '@renderer/components/catalyst/input'
import { Select }                 from '@renderer/components/catalyst/select'
import { Switch }                 from '@renderer/components/catalyst/switch'
import { Button }                 from '@renderer/components/catalyst/button'

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
    control,
    register,
    setValue,
    watch,
    formState: { isValid },
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
        <Fieldset>
          <div className="grid grid-cols-1 gap-y-4">
            <Text>{t('report.description')}</Text>
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
