import { useEffect, useState }                from 'react'
import { useNavigate }                        from 'react-router-dom'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation }                     from 'react-i18next'
import { ChevronLeftIcon, ChevronRightIcon }  from '@heroicons/react/24/solid'
import PhoneInputWithCountry                  from 'react-phone-number-input/react-hook-form'
import type { Country }                       from 'react-phone-number-input'
import { isPossiblePhoneNumber }              from 'react-phone-number-input'
import { usePublisherState }                  from '@renderer/store/publisherStore'
import { useSettingsState }                   from '@renderer/store/settingsStore'
import type { PublisherModel }                from 'src/types/models'
import 'react-phone-number-input/style.css'
import { TrashIcon }                          from '@heroicons/react/20/solid'
import generateIdentifier                     from '@renderer/utils/generateIdentifier'
import { Input, InputGroup }                  from '@renderer/components/catalyst/input'
import { EnvelopeIcon }                       from '@heroicons/react/16/solid'
import * as Headless                          from '@headlessui/react'
import { Switch }                             from '@renderer/components/catalyst/switch'
import { Select }                             from '@renderer/components/catalyst/select'
import { Heading }                            from '@renderer/components/catalyst/heading'
import { Button }                             from '@renderer/components/catalyst/button'
import clsx                                   from 'clsx'
import {
  ErrorMessage,
  Field,
  Fieldset,
  Label,
  Legend,
} from '@renderer/components/catalyst/fieldset'
import ROUTES   from '../../constants/routes.json'
import Progress from './components/progress'

export default function PublisherContactForm(): JSX.Element {
  const { t }          = useTranslation()
  const navigate       = useNavigate()
  const publisherState = usePublisherState()
  const settingsState  = useSettingsState()

  const [contacts, setContacts] = useState<PublisherModel[]>([])

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm<PublisherModel>({ defaultValues: publisherState.publisher })

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'children', // unique name for your Field Array
  })

  const setAddress = (contactId: string): void => {
    const contact = contacts.find((contact) => {
      return contact._id === contactId
    })

    setValue('address', contact?.address || '')
    setValue('zip', contact?.zip || '')
    setValue('city', contact?.city || '')
  }

  const watchContact = watch('contact', false)

  const saveData = (data: PublisherModel): void => {
    publisherState.setPublisher({ ...publisherState.publisher, ...data })
    navigate(ROUTES.PUBLISHER_APPOINTMENTS_FORM)
  }

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-contacts', { sortField: 'lastname' })
      .then((result: PublisherModel[]) => {
        setContacts(result)
        if (publisherState.publisher.familyId)
          setValue('familyId', publisherState.publisher.familyId)
      })
  }, [])

  if (publisherState.publisher.familyId && !contacts.length)
    return <div />

  return (
    <div>
      <div className="flex justify-between">
        <Heading>
          {publisherState.publisher._id
            ? t('publishers.editHeadline')
            : t('publishers.addHeadline')}
        </Heading>
      </div>
      <Progress step="CONTACT" />
      <form onSubmit={handleSubmit(saveData)}>
        <div className="mx-auto grid w-10/12 grid-cols-1 gap-6 sm:grid-cols-6">
          {/* PHONE */}
          <Field className="sm:col-span-3">
            <Label>{t('label.phone')}</Label>
            <PhoneInputWithCountry
              name="phone"
              defaultCountry={settingsState.congregation.country as Country}
              countrySelectProps={{ unicodeFlags: true }}
              placeholder={t('label.phone')}
              control={control}
              rules={{
                validate: {
                  test: (v: string | null): string | null => {
                    let result = ''
                    if (v)
                      result = isPossiblePhoneNumber(v) ? '' : t('errors.phone.invalid')

                    return result !== '' ? result : null
                  },
                },
              }}
            />
            {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
          </Field>

          {/* MOBILE */}
          <Field className="sm:col-span-3">
            <Label>{t('label.mobile')}</Label>
            <PhoneInputWithCountry
              name="mobile"
              defaultCountry={settingsState.congregation.country as Country}
              countrySelectProps={{ unicodeFlags: true }}
              placeholder={t('label.mobile')}
              control={control}
              rules={{
                validate: {
                  test: (v: string | null): string | null => {
                    let result = ''
                    if (v)
                      result = isPossiblePhoneNumber(v) ? '' : t('errors.mobile.invalid')

                    return result !== '' ? result : null
                  },
                },
              }}
            />
            {errors.mobile && <ErrorMessage>{errors.mobile.message}</ErrorMessage>}
          </Field>

          {/* E-MAIL */}
          <Field className="sm:col-span-3">
            <Label>{t('label.email')}</Label>
            <InputGroup>
              <EnvelopeIcon />
              <Input
                type="email"
                placeholder={t('label.email')}
                {...register('email', { required: false, pattern:  {
                  value:   /^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('errors.email.invalid'),
                } })}
                invalid={!!errors.email}
              />
            </InputGroup>
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </Field>

          {/* CONTACT */}
          <Field className="!col-start-1 sm:col-span-2">
            <Label>{t('label.family')}</Label>
            <div className="flex h-12 w-full items-center space-x-4">
              <Headless.Field className="flex items-center gap-2">
                <Controller
                  name="contact"
                  control={control}
                  render={({ field: { onChange, value } }) => (<Switch color="blue" onChange={onChange} checked={value} />)}
                />
                <Label>{t('label.contact')}</Label>
              </Headless.Field>
            </div>
          </Field>

          {/* Family */}
          <Field className="sm:col-span-4">
            <Label>&nbsp;</Label>
            <Select
              {...register('familyId', {
                required: {
                  value:   !watchContact,
                  message: t('errors.familyId.required'),
                },
              })}
              disabled={watchContact}
              onChange={(e): void => {
                setAddress(e.target.value)
              }}
              invalid={!!errors.familyId}
            >
              <option value="">{t('label.selectFamily')}</option>
              {contacts.map((contact) => {
                return (
                  <option key={contact._id} value={contact._id}>
                    {contact.lastname}
                    ,
                    {' '}
                    {contact.firstname}
                  </option>
                )
              })}
            </Select>
          </Field>

          {/* ADDRESS */}
          <Field className="sm:col-span-6">
            <Label>{t('label.address')}</Label>
            <Input
              placeholder={t('label.address')}
              {...register('address', {
                required: {
                  value:   watchContact,
                  message: t('errors.zip.required'),
                },
              })}
              invalid={!!errors.address}
              readOnly={!watchContact}
            />
            {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
          </Field>

          {/* ZIP */}
          <Field className="sm:col-span-3">
            <Label>{t('label.zip')}</Label>
            <Input
              placeholder={t('label.zip')}
              {...register('zip', {
                required: {
                  value:   watchContact,
                  message: t('errors.zip.required'),
                },
              })}
              invalid={!!errors.zip}
              readOnly={!watchContact}
            />
            {errors.zip && <ErrorMessage>{errors.zip.message}</ErrorMessage>}
          </Field>

          {/* CITY */}
          <Field className="sm:col-span-3">
            <Label>{t('label.city')}</Label>
            <Input
              placeholder={t('label.city')}
              {...register('city', {
                required: {
                  value:   watchContact,
                  message: t('errors.city.required'),
                },
              })}
              invalid={!!errors.city}
              readOnly={!watchContact}
            />
            {errors.city && <ErrorMessage>{errors.city.message}</ErrorMessage>}
          </Field>

          {watchContact && (
            <div className="!col-start-1 sm:col-span-4">
              <>
                {fields.length > 0 && (
                  <Fieldset className="col-span-6 my-4 border border-zinc-950/10 p-4 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20">
                    <Legend className="-mt-7 mb-2 w-fit bg-white px-1 dark:bg-zinc-900">{t('label.children')}</Legend>
                    {fields.map((item, index) => {
                      return (
                        <div key={item.id} className="grid grid-cols-6 gap-6">
                          <Field className="sm:col-span-3">
                            <Label className={clsx(index === 0 ? 'block' : 'hidden')}>{t('label.firstname')}</Label>
                            <Input
                              {...register(`children.${index}.name` as const, {
                                required: t('errors.children.name.required'),
                              })}
                              invalid={!!errors.children?.[index]?.name}
                            />
                            {errors.children?.[index]?.name && <ErrorMessage>{errors.children?.[index]?.name?.message}</ErrorMessage>}
                          </Field>
                          <Field className="sm:col-span-2">
                            <Label className={clsx(index === 0 ? 'block' : 'hidden')}>{t('label.birthday')}</Label>
                            <Input
                              type="date"
                              {...register(`children.${index}.birthday` as const, {
                                required: t('errors.children.birthday.required'),
                              })}
                              invalid={!!errors.children?.[index]?.birthday}
                            />
                            {errors.children?.[index]?.birthday && <ErrorMessage>{errors.children?.[index]?.birthday?.message}</ErrorMessage>}
                          </Field>
                          <Field className="flex items-end justify-end sm:col-span-1">
                            <Label>&nbsp;</Label>
                            <Button
                              outline
                              onClick={(): void => {
                                remove(index)
                              }}
                            >
                              <TrashIcon className="size-4" />
                            </Button>
                          </Field>
                        </div>
                      )
                    })}
                  </Fieldset>
                )}

                <Button
                  color="indigo"
                  onClick={(): void =>
                    append({ name: '', birthday: '', identifier: generateIdentifier() })}
                  type="button"
                >
                  {t('button.addChild')}
                </Button>
              </>
            </div>
          )}

          <Fieldset className="col-span-6 mb-2 mt-4 border border-zinc-950/10 p-4 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20">
            <Legend className="-mt-7 mb-2 w-fit bg-white px-1 dark:bg-zinc-900">{t('label.emergencyContact')}</Legend>
            <div className="grid w-full grid-cols-6 gap-4">
              <Field className="col-span-2">
                <Label>{t('label.name')}</Label>
                <Input
                  placeholder={t('label.name')}
                  {...register('emergencyContact.name')}
                  invalid={!!errors.emergencyContact?.name}
                />
                {errors.emergencyContact?.name && <ErrorMessage>{errors.emergencyContact?.name?.message}</ErrorMessage>}
              </Field>
              <Field className="col-span-2">
                <Label>{t('label.email')}</Label>
                <Input
                  placeholder={t('label.email')}
                  {...register('emergencyContact.email')}
                  invalid={!!errors.emergencyContact?.email}
                />
                {errors.emergencyContact?.email && <ErrorMessage>{errors.emergencyContact?.email?.message}</ErrorMessage>}
              </Field>
              <Field className="col-span-2">
                <Label>{t('label.phone')}</Label>
                <PhoneInputWithCountry
                  name="emergencyContact.phone"
                  defaultCountry={settingsState.congregation.country as Country}
                  countrySelectProps={{ unicodeFlags: true }}
                  placeholder={t('label.phone')}
                  control={control}
                  rules={{
                    validate: {
                      test: (v: string | null): string | null => {
                        let result = ''
                        if (v)
                          result = isPossiblePhoneNumber(v) ? '' : t('errors.phone.invalid')

                        return result !== '' ? result : null
                      },
                    },
                  }}
                />
                {errors.emergencyContact?.phone && <ErrorMessage>{errors.emergencyContact?.phone?.message}</ErrorMessage>}
              </Field>
            </div>
          </Fieldset>

          <div className="col-span-6 col-start-1 mt-2 flex justify-between">
            <Button
              outline
              onClick={(): void => navigate(ROUTES.PUBLISHER_PERSONAL_FORM)}
            >
              <ChevronLeftIcon className="size-5" />
              {t('button.back')}
            </Button>
            {
              publisherState.publisher._id
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
      </form>
    </div>
  )
}
