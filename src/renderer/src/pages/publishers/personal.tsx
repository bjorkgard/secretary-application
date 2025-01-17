import { useNavigate, useParams }                 from 'react-router-dom'
import { Controller, useForm }                    from 'react-hook-form'
import { useTranslation }                         from 'react-i18next'
import { ChevronRightIcon }                       from '@heroicons/react/24/solid'
import { usePublisherState }                      from '@renderer/store/publisherStore'
import type { PublisherModel, ServiceGroupModel } from 'src/types/models'
import { useEffect, useState }                    from 'react'
import { Heading }                                from '@renderer/components/catalyst/heading'
import { ErrorMessage, Field, Fieldset, Label }   from '@renderer/components/catalyst/fieldset'
import { Input }                                  from '@renderer/components/catalyst/input'
import { Select }                                 from '@renderer/components/catalyst/select'
import { Button }                                 from '@renderer/components/catalyst/button'
import * as Headless                              from '@headlessui/react'
import { Switch }                                 from '@renderer/components/catalyst/switch'
import ROUTES                                     from '../../constants/routes.json'
import Progress                                   from './components/progress'

export default function PublisherPersonalForm(): JSX.Element {
  const { t }          = useTranslation()
  const { id }         = useParams()
  const navigate       = useNavigate()
  const publisherState = usePublisherState()

  const [publisher, setPublisher]         = useState<PublisherModel>(publisherState.publisher)
  const [serviceGroups, setServiceGroups] = useState<ServiceGroupModel[]>([])

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<PublisherModel>({ defaultValues: publisherState.publisher, mode: 'onSubmit' })

  const formData = watch()

  const quickSave = (): void => {
    const updatedPublisher = { ...publisherState.publisher, ...formData }

    window.electron.ipcRenderer.invoke('update-publisher', updatedPublisher).then(() => {
      window.Notification.requestPermission().then(() => {
        // eslint-disable-next-line no-new
        new window.Notification('SECRETARY', {
          body: t('publishers.notification.updated'),
        })
      })
      publisherState.delete()
      navigate(ROUTES.PUBLISHERS)
    })
  }

  const saveData = (data: PublisherModel): void => {
    publisherState.setPublisher({ ...publisherState.publisher, ...data })
    navigate(ROUTES.PUBLISHER_CONTACT_FORM)
  }

  const abort = (): void => {
    publisherState.delete()
    navigate(ROUTES.PUBLISHERS)
  }

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-serviceGroups').then((result: ServiceGroupModel[]) => {
      setServiceGroups(result)
    })
  }, [])

  useEffect(() => {
    if (id) {
      window.electron.ipcRenderer.invoke('get-publisher', id).then((result: PublisherModel) => {
        reset(result)
        setPublisher(result)
      })
    }
  }, [id])

  if (id && !publisher) {
    // !This is a workaround wait for the publisher to be loaded
    return <div />
  }

  return (
    <div>
      <div className="flex justify-between">
        <Heading>
          {publisherState.publisher._id
            ? t('publishers.editHeadline')
            : t('publishers.addHeadline')}
        </Heading>
      </div>
      <Progress step="PERSONAL" />
      <form onSubmit={handleSubmit(saveData)}>
        <Fieldset>
          <div className="mx-auto grid w-10/12 grid-cols-1 gap-6 sm:grid-cols-6">
            {/* FIRSTNAME */}
            <Field className="sm:col-span-3">
              <Label>{t('label.firstname')}</Label>
              <Input
                placeholder={t('label.firstname')}
                {...register('firstname', {
                  required: t('errors.firstname.required'),
                })}
                invalid={!!errors.firstname}
                autoFocus
              />
              {errors.firstname && <ErrorMessage>{errors.firstname.message}</ErrorMessage>}
            </Field>

            {/* LASTNAME */}
            <Field className="sm:col-span-3">
              <Label>{t('label.lastname')}</Label>
              <Input
                placeholder={t('label.lastname')}
                {...register('lastname', {
                  required: t('errors.lastname.required'),
                })}
                invalid={!!errors.lastname}
              />
              {errors.lastname && <ErrorMessage>{errors.lastname.message}</ErrorMessage>}
            </Field>

            {/* BIRTDAY */}
            <Field className="sm:col-span-3">
              <Label>{t('label.birthday')}</Label>
              <Input
                type="date"
                placeholder={t('label.birthday')}
                {...register('birthday', { required: false })}
                invalid={!!errors.birthday}
              />
              {errors.birthday && <ErrorMessage>{errors.birthday.message}</ErrorMessage>}
            </Field>

            {/* GENDER */}
            <Field className="sm:col-span-1">
              <Label>{t('label.gender')}</Label>
              <Select
                {...register('gender', { required: true })}
                invalid={!!errors.gender}
              >
                <option value="">{t('gender.select')}</option>
                <option value="MAN">{t('label.man')}</option>
                <option value="WOMAN">{t('label.woman')}</option>
              </Select>
              {errors.gender && <ErrorMessage>{errors.gender.message}</ErrorMessage>}
            </Field>

            {/* RESIDENT */}
            <Field className="sm:col-span-1">
              <Label>{t('label.resident')}</Label>
              <Select
                {...register('resident', { required: true })}
                invalid={!!errors.resident}
              >
                <option value="">{t('resident.select')}</option>
                <option value="SWEDEN">{t('resident.sweden')}</option>
                <option value="OTHER">{t('resident.other')}</option>
              </Select>
              {errors.resident && <ErrorMessage>{errors.resident.message}</ErrorMessage>}
            </Field>

            {/* BAPTSED */}
            <Field className="sm:col-span-2">
              <Label>{t('label.baptised')}</Label>
              <Input
                {...register('baptised', { required: false })}
                type="date"
                placeholder={t('label.baptised')}
                invalid={!!errors.baptised}
              />
              {errors.baptised && <ErrorMessage>{errors.baptised.message}</ErrorMessage>}
            </Field>

            {/* UNKNOWN BAPTSED */}
            <Headless.Field className="flex flex-col">
              <Label>&nbsp;</Label>
              <div className="flex h-12 items-center gap-2">
                <Controller
                  name="unknown_baptised"
                  control={control}
                  render={({ field: { onChange, value } }) => (<Switch color="blue" onChange={onChange} checked={value} />)}
                />
                <Label>{t('label.unknown_baptised')}</Label>
              </div>

            </Headless.Field>

            {/* HOPE */}
            <Field className="sm:col-span-1">
              <Label>{t('label.hope')}</Label>
              <Select
                {...register('hope', { required: true })}
                invalid={!!errors.hope}
              >
                <option value="">{t('hope.select')}</option>
                <option value="OTHER_SHEEP">{t('label.other_sheep')}</option>
                <option value="ANOINTED">{t('label.anointed')}</option>
              </Select>
              {errors.hope && <ErrorMessage>{errors.hope.message}</ErrorMessage>}
            </Field>

            {/* STATUS */}
            <Field className="sm:col-span-1">
              <Label>{t('label.status')}</Label>
              <Select
                {...register('status')}
                invalid={!!errors.status}
              >
                <option value="ACTIVE">{t('status.active')}</option>
                <option value="IRREGULAR">{t('status.irregular')}</option>
                <option value="INACTIVE">{t('status.inactive')}</option>
              </Select>
              {errors.status && <ErrorMessage>{errors.status.message}</ErrorMessage>}
            </Field>

            {/* FORMS */}
            <Headless.Field className="flex flex-col sm:col-span-3">
              <Label>{t('label.forms')}</Label>
              <div className="flex h-12 items-center gap-2">
                <Controller
                  name="s290"
                  control={control}
                  render={({ field: { onChange, value } }) => (<Switch color="blue" onChange={onChange} checked={value} />)}
                />
                <Label>{t('label.s290')}</Label>
              </div>
            </Headless.Field>

            {/* Service groups */}
            <Field className="sm:col-span-3">
              <Label>{t('label.serviceGroup')}</Label>
              <Select
                {...register('serviceGroupId', {
                  required: t('errors.serviceGroupId.required'),
                })}
                invalid={!!errors.serviceGroupId}
              >
                <option value="">{t('label.selectServiceGroup')}</option>
                {serviceGroups.map((sg) => {
                  return (
                    <option key={sg._id} value={sg._id}>
                      {sg.name}
                    </option>
                  )
                })}
              </Select>
              {errors.serviceGroupId && <ErrorMessage>{errors.serviceGroupId.message}</ErrorMessage>}
            </Field>

            {/* DISABILITY */}
            <Field className="sm:col-span-3">
              <Label>{t('label.disabilities')}</Label>
              <div className="flex h-12 w-full items-center space-x-4">
                <Headless.Field className="flex items-center gap-2">
                  <Controller
                    name="deaf"
                    control={control}
                    render={({ field: { onChange, value } }) => (<Switch color="blue" onChange={onChange} checked={value} />)}
                  />
                  <Label>{t('label.deaf')}</Label>
                </Headless.Field>
                <Headless.Field className="flex items-center gap-2">
                  <Controller
                    name="blind"
                    control={control}
                    render={({ field: { onChange, value } }) => (<Switch color="blue" onChange={onChange} checked={value} />)}
                  />
                  <Label>{t('label.blind')}</Label>
                </Headless.Field>
              </div>
            </Field>

            {/* SEND REPORTS */}
            <Headless.Field className="flex flex-col sm:col-span-3">
              <Label>{t('label.other')}</Label>
              <div className="flex h-12 items-center gap-2">
                <Controller
                  name="sendReports"
                  control={control}
                  render={({ field: { onChange, value } }) => (<Switch color="blue" onChange={onChange} checked={value} />)}
                />
                <Label>{t('label.sendEmailReports')}</Label>
              </div>
            </Headless.Field>

            <div className="col-span-6 col-start-1 mt-2 flex justify-between">
              <Button outline onClick={(): void => abort()}>
                {t('button.abort')}
              </Button>
              {
                publisher._id
                && (
                  <Button color="indigo" onClick={(): void => quickSave()}>
                    {t('button.save')}
                  </Button>
                )
              }
              <Button color="blue" type="submit">
                {t('button.next')}
                <ChevronRightIcon className="size-5" />
              </Button>
            </div>

          </div>
        </Fieldset>
      </form>
    </div>
  )
}
