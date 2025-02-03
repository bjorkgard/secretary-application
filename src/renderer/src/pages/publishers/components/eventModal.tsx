import { useEffect, useState }                                 from 'react'
import { Controller, useForm }                                 from 'react-hook-form'
import { useTranslation }                                      from 'react-i18next'
import type { PublicCongregationModel, PublisherModel }        from 'src/types/models'
import { Modal }                                               from '@renderer/components/Modal'
import { Input }                                               from '@renderer/components/catalyst/input'
import { Description, ErrorMessage, Field, FieldGroup, Label } from '@renderer/components/catalyst/fieldset'
import { Text }                                                from '@renderer/components/catalyst/text'
import { Select }                                              from '@renderer/components/catalyst/select'
import { Button }                                              from '@renderer/components/catalyst/button'
import { Switch, SwitchField }                                 from '@renderer/components/catalyst/switch'

interface EventModalProps {
  open:                boolean
  setOpen:             (open: boolean) => void
  publisher:           PublisherModel | undefined
  publicCongregations: PublicCongregationModel[]
  refresh:             () => void
}

export type HeroIcon = React.ComponentType<
  React.PropsWithoutRef<React.ComponentProps<'svg'>> & {
    title?:   string | undefined
    titleId?: string | undefined
  }
>

interface Event {
  name:       string
  command:    string
  restricted: boolean
}

interface EventForm {
  date:            string
  command:         string
  publisherId:     string
  newCongregation: string | null
  keepPublisher:   boolean
  description:     string | null
}

export default function EventModal(props: EventModalProps): JSX.Element {
  const { t } = useTranslation()

  const [showCongregationSelector, setShowCongregationSelector] = useState<boolean>(false)
  const [showKeepPublisher, shetShowKeepPublisher]              = useState<boolean>(false)

  const events: Event[] = [
    { restricted: true, name: t('event.a2'), command: 'A-2' },
    { restricted: true, name: t('event.a8'), command: 'A-8' },
    { restricted: true, name: t('event.a19'), command: 'A-19' },
    { restricted: true, name: t('event.g8'), command: 'G-8' },
    { restricted: true, name: t('event.co5a'), command: 'CO-5A' },
    { restricted: true, name: t('event.co4'), command: 'CO-4' },
    { restricted: true, name: t('event.movedIn'), command: 'MOVED_IN' },
    { restricted: true, name: t('event.movedOut'), command: 'MOVED_OUT' },
    { restricted: true, name: t('event.publisher'), command: 'PUBLISHER' },
    { restricted: true, name: t('event.baptised'), command: 'BAPTISED' },
    { restricted: true, name: t('event.auxiliaryStart'), command: 'AUXILIARY_START' },
    { restricted: true, name: t('event.pioneerStart'), command: 'PIONEER_START' },
    { restricted: true, name: t('event.auxiliaryStop'), command: 'AUXILIARY_STOP' },
    { restricted: true, name: t('event.pioneerStop'), command: 'PIONEER_STOP' },
    { restricted: true, name: t('event.pioneerSchool'), command: 'PIONEER_SCHOOL' },
    { restricted: true, name: t('event.ministerialServantStart'), command: 'START_MINISTERIAL_SERVANT' },
    { restricted: true, name: t('event.ministerialServantStop'), command: 'STOP_MINISTERIAL_SERVANT' },
    { restricted: true, name: t('event.elderStart'), command: 'START_ELDER' },
    { restricted: true, name: t('event.elderStop'), command: 'STOP_ELDER' },
    { restricted: true, name: t('event.startRestriction'), command: 'START_RESTRICTION' },
    { restricted: true, name: t('event.stopRestriction'), command: 'STOP_RESTRICTION' },
    { restricted: false, name: t('event.visit'), command: 'VISIT' },
    { restricted: false, name: t('event.reinstated'), command: 'REINSTATED' },
    { restricted: true, name: t('event.disfellowshipped'), command: 'DISFELLOWSHIPPED' },
    { restricted: true, name: t('event.disassociation'), command: 'DISASSOCIATION' },
    { restricted: false, name: t('event.deceased'), command: 'DECEASED' },
    { restricted: false, name: t('event.delete'), command: 'DELETE' },
  ]

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    shetShowKeepPublisher(false)
    setShowCongregationSelector(false)

    switch (event.target.value) {
      case 'MOVED_OUT':
        setShowCongregationSelector(true)
        break
      case 'DISFELLOWSHIPPED':
      case 'DISASSOCIATION':
        shetShowKeepPublisher(true)
        break

      default:
        shetShowKeepPublisher(false)
        setShowCongregationSelector(false)
        break
    }
  }

  const storeEvent = (event: EventForm): void => {
    window.electron.ipcRenderer.invoke('store-event', { event }).then(() => {
      props.refresh()
    })
  }

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<EventForm>({
    defaultValues: {
      date:            '',
      publisherId:     '',
      command:         '',
      newCongregation: null,
      keepPublisher:   false,
    },
  })

  useEffect(() => {
    setValue('date', new Date().toISOString().slice(0, 10))
    setValue('publisherId', props.publisher?._id || '')
  }, [props.publisher])

  return (
    <Modal
      open={props.open}
      onClose={() => props.setOpen(false)}
      title={`${props.publisher?.firstname} ${props.publisher?.lastname}`}
    >
      <form className="relative" onSubmit={handleSubmit(storeEvent)}>
        <Text>{t('event.description')}</Text>

        <Input type="hidden" {...register('publisherId')} />
        <Input type="hidden" {...register('command')} />
        <FieldGroup>
          <Field>
            <Label>{t('event.selectDate')}</Label>
            <Input
              type="date"
              {...register('date', { required: t('errors.date.required') })}
              invalid={!!errors.date}
              autoFocus
            />
            {errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
          </Field>

          <Field>
            <Label>{t('event.selectEvent')}</Label>
            <Select
              {...register('command', {
                onChange: (e) => { handleChange(e) },
              })}
              invalid={!!errors.command}
            >
              {events.map(event => (
                <option key={event.command} value={event.command}>{event.name}</option>
              ))}
            </Select>
            {errors.command && <ErrorMessage>{errors.command.message}</ErrorMessage>}
          </Field>

          {showCongregationSelector && (
            <Field>
              <Label>{t('event.transferToNewCongregation')}</Label>
              <Select {...register('newCongregation')}>
                <option value="">
                  {t('event.doNotTransfer')}
                </option>
                {props.publicCongregations?.map(congregation => (
                  <option key={congregation.identifier} value={congregation.identifier}>
                    {congregation.congregation}
                  </option>
                ))}
              </Select>
              <Description>{t('event.selectCongregation')}</Description>
            </Field>
          )}

          {showKeepPublisher && (
            <SwitchField>
              <Controller
                name="keepPublisher"
                control={control}
                render={({ field: { onChange, value } }) => (<Switch color="blue" onChange={onChange} checked={value} />)}
              />
              <Label>{t('event.keepPublisher')}</Label>
              <Description>{t('event.keepPublisherDescription')}</Description>
            </SwitchField>
          )}

          <Field>
            <Label>{t('event.information')}</Label>
            <Input {...register('description')} invalid={!!errors.description} />
            {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
          </Field>
        </FieldGroup>

        <div className="mt-8 flex w-full justify-between">
          <Button
            outline
            onClick={() => props.setOpen(false)}
          >
            {t('button.abort')}
          </Button>
          <Button type="submit" color="blue">
            {t('button.save')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
