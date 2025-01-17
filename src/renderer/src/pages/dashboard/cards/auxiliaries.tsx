import { useEffect, useState }                  from 'react'
import { useTranslation }                       from 'react-i18next'
import type { SubmitHandler }                   from 'react-hook-form'
import { useForm }                              from 'react-hook-form'
import { Modal }                                from '@renderer/components/Modal'
import type { AuxiliaryModel, PublisherModel }  from 'src/types/models'
import { useUmamiEventTrack }                   from '@renderer/providers/umami'
import { TrashIcon }                            from '@heroicons/react/16/solid'
import { ErrorMessage, Field, Fieldset, Label } from '@renderer/components/catalyst/fieldset'
import { DashboardCard }                        from '@renderer/components/DashboardCard'
import { Heading, Subheading }                  from '@renderer/components/catalyst/heading'
import { Accordion, AccordionItem as Item }     from '@szhsin/react-accordion'
import { Button }                               from '@renderer/components/catalyst/button'
import { Select }                               from '@renderer/components/catalyst/select'
import { Input }                                from '@renderer/components/catalyst/input'
import { ChevronDownIcon }                      from '@heroicons/react/20/solid'

interface AuxiliaryForm {
  publisher:    PublisherModel
  serviceMonth: string
}

export default function Auxiliaries(): JSX.Element {
  const { t }                                       = useTranslation()
  const umamiTrack                                  = useUmamiEventTrack()
  const [reload, setReload]                         = useState<boolean>(false)
  const [publishers, setPublishers]                 = useState<PublisherModel[]>([])
  const [continuesAuxiliary, setContinuesAuxiliary] = useState<PublisherModel[]>([])
  const [showModal, setShowModal]                   = useState<boolean>(false)
  const [auxiliaryArray, setAuxiliaryArray]         = useState<AuxiliaryModel[]>([])

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-publishers', { sortField: 'lastname', queryString: '' })
      .then((result: PublisherModel[]) => {
        // get publishers that are continues auxiliary
        const auxiliaries = result.filter(p => p.appointments.some(a => a.type === 'AUXILIARY'))
        setContinuesAuxiliary(auxiliaries)
        // filter out publishers that are not able to be auxiliary
        const publishers = result.filter(
          p =>
            (p.status === 'ACTIVE' || p.status === 'IRREGULAR')
            && (p.baptised || p.unknown_baptised)
            && !p.appointments.some(
              a =>
                a.type === 'PIONEER'
                || a.type === 'AUXILIARY'
                || a.type === 'MISSIONARY'
                || a.type === 'SPECIALPIONEER'
                || a.type === 'CIRCUITOVERSEER',
            ),
        )
        setPublishers(publishers)
        setReload(true)
      })
  }, [])

  useEffect(() => {
    if (reload) {
      window.electron.ipcRenderer.invoke('auxiliaries').then((result) => {
        for (let i = 0; i < result.length; i += 1) {
          const auxiliary  = result[i]
          const monthStart = Date.parse(`${auxiliary.serviceMonth}-01`)

          for (let j = 0; j < continuesAuxiliary.length; j += 1) {
            const auxiliaryAppointment = continuesAuxiliary[j].appointments.find(a => a.type === 'AUXILIARY')

            if (auxiliaryAppointment && auxiliaryAppointment.date && Date.parse(auxiliaryAppointment.date) < monthStart)
              auxiliary.publishers.push(continuesAuxiliary[j])
          }

          result[i] = auxiliary
        }
        setAuxiliaryArray(result)
        setReload(false)
      })
    }
  }, [reload])

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AuxiliaryForm>({ defaultValues: {}, mode: 'onSubmit' })

  const onSubmit: SubmitHandler<AuxiliaryForm> = (data): void => {
    umamiTrack('add-auxiliary', window.location.pathname)
    window.electron.ipcRenderer.invoke('add-auxiliary', data).then(() => {
      setShowModal(false)
      setReload(true)
    })
  }

  const AccordionItem = ({ header, ...rest }) => (
    <Item
      {...rest}
      header={({ state: { isEnter } }) => (
        <>
          {header}
          <ChevronDownIcon
            className={`ml-auto size-5 text-zinc-950 transition-transform duration-200 ease-out dark:text-white ${
              isEnter && 'rotate-180'
            }`}
          />
        </>
      )}
      buttonProps={{
        className: () =>
          `flex w-full text-left`,
      }}
      contentProps={{
        className: 'transition-height duration-200 ease-out',
      }}
      panelProps={{ className: 'p-1' }}
    />
  )

  return (
    <>
      <DashboardCard className="col-span-2 sm:col-span-1 xl:col-span-4 2xl:col-span-3">
        <Heading className="mb-2">{t('label.auxiliaries')}</Heading>
        <Accordion transition transitionTimeout={250}>
          {auxiliaryArray.map((auxiliary) => {
            return (
              <AccordionItem
                key={auxiliary.name}
                header={(
                  <Subheading>
                    {t(`month.${auxiliary.name}`)}
                    {' '}
                    (
                    {auxiliary.publishers?.length}
                    )
                  </Subheading>
                )}
              >
                {auxiliary.publishers?.map((publisher) => {
                  return (
                    <p key={publisher._id} className="!my-0 mx-2 flex w-full items-center justify-between p-0.5 pl-1 text-xs text-zinc-950 hover:bg-gray-200 dark:text-white hover:dark:bg-slate-700">
                      <span>{`${publisher.firstname} ${publisher.lastname}`}</span>
                      {!publisher.appointments.find(a => a.type === 'AUXILIARY')?.date && (
                        <TrashIcon
                          className="size-4 text-red-400 hover:text-red-600"
                          onClick={() => {
                            window.electron.ipcRenderer.invoke('remove-auxiliary', {
                              publisher:    publisher._id,
                              serviceMonth: auxiliary.serviceMonth,
                            }).then(() => {
                              setReload(true)
                            })
                          }}
                        />
                      )}
                    </p>
                  )
                })}
              </AccordionItem>
            )
          })}
        </Accordion>
        <div className="mt-2 flex justify-end">
          <Button color="blue" onClick={() => setShowModal(true)}>
            {t('label.add')}
          </Button>
        </div>
      </DashboardCard>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => handleSubmit(onSubmit)()}
        title={t('auxiliary.headline')}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Fieldset>
            <div className="mx-auto grid w-full grid-cols-1 gap-x-6 gap-y-2 sm:mx-0 sm:grid-cols-6">
              <Field className="sm:col-span-3">
                <Label>{t('label.publisher')}</Label>
                <Select {...register('publisher', {
                  required: t('errors.publisher.required'),
                })}
                >
                  <option value="">{t('label.selectPublisher')}</option>
                  {publishers.map((p) => {
                    return (
                      <option key={p._id} value={p._id}>{`${p.lastname} ${p.firstname}`}</option>
                    )
                  })}
                </Select>
                {errors.publisher && <ErrorMessage>{errors.publisher.message}</ErrorMessage>}
              </Field>
              <Field className="sm:col-span-3">
                <Label>{t('label.month')}</Label>
                <Input
                  type="month"
                  {...register('serviceMonth', {
                    required: t('errors.serviceMonth.required'),
                  })}
                />
                {errors.serviceMonth && <ErrorMessage>{errors.serviceMonth.message}</ErrorMessage>}
              </Field>
            </div>
          </Fieldset>
        </form>
      </Modal>
    </>
  )
}
