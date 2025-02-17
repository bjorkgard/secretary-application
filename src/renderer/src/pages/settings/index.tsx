import { useEffect, useState }                                           from 'react'
import { useTranslation }                                                from 'react-i18next'
import type { SubmitHandler }                                            from 'react-hook-form'
import { Controller, useFieldArray, useForm }                            from 'react-hook-form'
import { getCountries }                                                  from 'react-phone-number-input/input'
import countryLabels                                                     from 'react-phone-number-input/locale/en.json'
import { PlusIcon, TrashIcon }                                           from '@heroicons/react/20/solid'
import type { SettingsModel }                                            from 'src/types/models'
import { useSettingsState }                                              from '@renderer/store/settingsStore'
import { useUmamiEventTrack }                                            from '@renderer/providers/umami'
import { Description, ErrorMessage, Field, FieldGroup, Fieldset, Label } from '@renderer/components/catalyst/fieldset'
import { Heading, Subheading }                                           from '@renderer/components/catalyst/heading'
import { Text }                                                          from '@renderer/components/catalyst/text'
import { Input }                                                         from '@renderer/components/catalyst/input'
import { Divider }                                                       from '@renderer/components/catalyst/divider'
import { Select }                                                        from '@renderer/components/catalyst/select'
import { Button }                                                        from '@renderer/components/catalyst/button'
import { Switch, SwitchField, SwitchGroup }                              from '@renderer/components/catalyst/switch'
import { Textarea }                                                      from '@renderer/components/catalyst/textarea'

interface Country {
  code: string
  name: string
}

export default function Settings(): JSX.Element {
  const [data, setData]           = useState<SettingsModel>()
  const [countries, setCountries] = useState<Country[]>([])
  const { t }                     = useTranslation()
  const settingsState             = useSettingsState()
  const umamiTrack                = useUmamiEventTrack()

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    control,
  } = useForm<SettingsModel>({
    values: data,
    mode:   'onChange',
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'congregation.languageGroups', // unique name for your Field Array
  })

  const onSubmit: SubmitHandler<SettingsModel> = (data): void => {
    umamiTrack('update-settings', 'settings')
    window.electron.ipcRenderer.invoke('update-settings', data).then(() => {
      settingsState.setSettings(data)

      window.Notification.requestPermission().then(() => {
        // eslint-disable-next-line no-new
        new window.Notification('SECRETARY', {
          body: t('settings.updated.body'),
        })
      })
    })
  }

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-settings')
      .then((settings: SettingsModel) => setData(settings))

    const c: Country[] = []
    getCountries().forEach((country) => {
      c.push({ code: country, name: countryLabels[country] })
    })
    c.sort((a, b) => (a.name > b.name ? 1 : -1))
    setCountries(c)
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <Heading>{t('settings.headline')}</Heading>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <div>
            <Subheading>{t('settings.congregation.headline')}</Subheading>
            <Text>{t('settings.congregation.information')}</Text>
          </div>
          <FieldGroup className="sm:col-span-2">
            <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-6 md:col-span-2">
              <Field className="sm:col-span-3">
                <Label>{t('label.congregationName')}</Label>
                <Input
                  {...register('congregation.name', {
                    required: t('errors.congregationName.required'),
                  })}
                  invalid={!!errors.congregation?.name}
                  autoFocus
                />
                {errors.congregation?.name && <ErrorMessage>{errors.congregation?.name.message}</ErrorMessage>}
              </Field>
              <Field className="sm:col-span-3">
                <Label>{t('label.congregationNumber')}</Label>
                <Input
                  {...register('congregation.number', {
                    required: t('errors.congregationNumber.required'),
                  })}
                  invalid={!!errors.congregation?.number}
                />
                {errors.congregation?.number && <ErrorMessage>{errors.congregation?.number.message}</ErrorMessage>}
              </Field>
              <Field className="sm:col-span-3">
                <Label>{t('label.country')}</Label>
                <Select
                  {...register('congregation.country', {
                    required: t('errors.congregationCountry.required'),
                  })}
                  invalid={!!errors.congregation?.country}
                >
                  {countries.map((country) => {
                    return (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    )
                  })}
                </Select>
                {errors.congregation?.country && <ErrorMessage>{errors.congregation?.country.message}</ErrorMessage>}
              </Field>
              <Field className="sm:col-span-3">
                <Label>{t('label.locale')}</Label>
                <Select
                  {...register('congregation.locale', {
                    required: t('errors.congregationLocale.required'),
                  })}
                  invalid={!!errors.congregation?.locale}
                >
                  <option value="en">English</option>
                  <option value="sv">Svenska</option>
                </Select>
                {errors.congregation?.locale && <ErrorMessage>{errors.congregation?.locale.message}</ErrorMessage>}
              </Field>
            </div>
          </FieldGroup>
        </div>
        <Divider className="my-4" />
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <div>
            <Subheading>{t('settings.languageGroup.headline')}</Subheading>
            <Text>{t('settings.languageGroup.information')}</Text>
          </div>
          <FieldGroup className="sm:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-6 md:col-span-2">
              {fields.map((item, index) => {
                return (
                  <div key={item.id} className="grid grid-cols-2 items-end justify-start gap-6 sm:col-span-6">
                    <Field>
                      <Label>{t('label.name')}</Label>
                      <Input
                        {...register(`congregation.languageGroups.${index}.name` as const, {
                          required: t('errors.languageGroup.name.required'),
                        })}
                      />
                    </Field>
                    <div className="flex justify-start pb-1.5" title={t('tooltip.deleteLanguageGroup')}>
                      <Button outline onClick={(): void => remove(index)}>
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>

                  </div>
                )
              })}
              <Button
                color="blue"
                className="col-span-1 sm:col-span-3"
                onClick={(): void => append({ name: '' })}
              >
                <PlusIcon />
                {t('button.addLanguageGroup')}
              </Button>
            </div>
          </FieldGroup>
        </div>
        <Divider className="my-4" />
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <div>
            <Subheading>{t('settings.user.headline')}</Subheading>
            <Text>{t('settings.user.information')}</Text>
          </div>
          <FieldGroup className="sm:col-span-2">
            <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-6 md:col-span-2">
              <Field className="sm:col-span-3">
                <Label>{t('label.firstname')}</Label>
                <Input
                  {...register('user.firstname', {
                    required: t('errors.firstname.required'),
                  })}
                  invalid={!!errors.user?.firstname}
                />
                {errors.user?.firstname && <ErrorMessage>{errors.user?.firstname.message}</ErrorMessage>}
              </Field>
              <Field className="sm:col-span-3">
                <Label>{t('label.lastname')}</Label>
                <Input
                  {...register('user.lastname', {
                    required: t('errors.lastname.required'),
                  })}
                  invalid={!!errors.user?.lastname}
                />
                {errors.user?.lastname && <ErrorMessage>{errors.user?.lastname.message}</ErrorMessage>}
              </Field>
              <Field className="col-span-6">
                <Label>{t('label.email')}</Label>
                <Input
                  type="email"
                  {...register('user.email', {
                    required: t('errors.email.required'),
                    validate: value => !value.includes('jwpub.org') || t('errors.email.jwpub'),
                  })}
                  invalid={!!errors.user?.email}
                />
                {errors.user?.email && <ErrorMessage>{errors.user?.email.message}</ErrorMessage>}
              </Field>
            </div>
          </FieldGroup>
        </div>
        <Divider className="my-4" />
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <div>
            <Subheading>{t('settings.online.headline')}</Subheading>
            <Text>{t('settings.online.information')}</Text>
          </div>
          <FieldGroup className="sm:col-span-2">
            <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-6 md:col-span-2">
              <SwitchGroup className="sm:col-span-6">
                <SwitchField>
                  <Controller
                    name="online.public"
                    control={control}
                    render={({ field: { onChange, value } }) => (<Switch color="blue" onChange={onChange} checked={value} />)}
                  />
                  <Label>{t('label.public')}</Label>
                  <Description>{t('settings.online.public')}</Description>
                </SwitchField>
                <SwitchField>
                  <Controller
                    name="online.send_report_group"
                    control={control}
                    render={({ field: { onChange, value } }) => (<Switch color="blue" onChange={onChange} checked={value} />)}
                  />
                  <Label>{t('label.send_report_group')}</Label>
                  <Description>{t('settings.online.send_report_group')}</Description>
                </SwitchField>
                <SwitchField>
                  <Controller
                    name="online.send_report_publisher"
                    control={control}
                    render={({ field: { onChange, value } }) => (<Switch color="blue" onChange={onChange} checked={value} />)}
                  />
                  <Label>{t('label.send_report_publisher')}</Label>
                  <Description>{t('settings.online.send_report_publisher')}</Description>
                </SwitchField>
              </SwitchGroup>
            </div>
          </FieldGroup>
        </div>
        <Divider className="my-4" />
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <div>
            <Subheading>{t('settings.sms.headline')}</Subheading>
            <Text>{t('settings.sms.information')}</Text>
          </div>
          <FieldGroup className="sm:col-span-2">
            <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-6 md:col-span-2">
              <Field className="col-span-6">
                <Label>{t('label.message')}</Label>
                <Textarea
                  {...register('smsMessage')}
                />
                {errors.smsMessage && <ErrorMessage>{errors.smsMessage.message}</ErrorMessage>}
              </Field>
            </div>
          </FieldGroup>
        </div>
        <Divider className="my-4" />
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <div>
            <Subheading>{t('settings.experimental.headline')}</Subheading>
            <Text>{t('settings.experimental.information')}</Text>
          </div>
          <FieldGroup className="sm:col-span-2">
            <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-6 md:col-span-2">
              <SwitchGroup className="sm:col-span-6">
                <SwitchField>
                  <Controller
                    name="automation"
                    control={control}
                    render={({ field: { onChange, value } }) => (<Switch color="blue" onChange={onChange} checked={value} />)}
                  />
                  <Label>{t('label.automation')}</Label>
                  <Description>{t('settings.automation')}</Description>
                </SwitchField>
              </SwitchGroup>
            </div>
          </FieldGroup>
          {
            /*
            <FieldGroup className="sm:col-span-2">
            <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-6 md:col-span-2">
              <SwitchGroup className="sm:col-span-6">
                <SwitchField>
                  <Controller
                    name="mergePdf"
                    control={control}
                    render={({ field: { onChange, value } }) => (<Switch color="blue" onChange={onChange} checked={value} />)}
                  />
                  <Label>{t('label.mergePdf')}</Label>
                  <Description>{t('settings.mergePdf')}</Description>
                </SwitchField>
              </SwitchGroup>
            </div>
          </FieldGroup>
            */
          }
        </div>
      </Fieldset>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button color="blue" type="submit" disabled={!isValid}>
          {t('button.save')}
        </Button>
      </div>
    </form>
  )
}

Settings.displayName = 'Settings'
