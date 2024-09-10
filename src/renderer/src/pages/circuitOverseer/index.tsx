import { useEffect, useState }       from 'react'
import clsx                          from 'clsx'
import { useTranslation }            from 'react-i18next'
import type { SubmitHandler }        from 'react-hook-form'
import { useForm }                   from 'react-hook-form'
import PhoneInputWithCountry         from 'react-phone-number-input/react-hook-form'
import type { Country }              from 'react-phone-number-input'
import { isPossiblePhoneNumber }     from 'react-phone-number-input'
import type { CircuitOverseerModel } from 'src/types/models'
import { useSettingsState }          from '@renderer/store/settingsStore'
import { Heading }                   from '@renderer/components/catalyst/heading'
import { Text }                      from '@renderer/components/catalyst/text'
import { Input }                     from '@renderer/components/catalyst/input'
import { Button }                    from '@renderer/components/catalyst/button'
import {
  ErrorMessage,
  Field,
  FieldGroup,
  Fieldset,
  Label,
} from '@renderer/components/catalyst/fieldset'
import 'react-phone-number-input/style.css'

export default function CircuitOverseer(): JSX.Element {
  const { t }         = useTranslation()
  const settingsState = useSettingsState()

  const [data, setData] = useState<CircuitOverseerModel>()

  const {
    control,
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<CircuitOverseerModel>({
    values: data,
    mode:   'onChange',
  })

  const onSubmit: SubmitHandler<CircuitOverseerModel> = (data): void => {
    window.electron.ipcRenderer.invoke('update-circuitOverseer', data).then(() => {
      window.Notification.requestPermission().then(() => {
        // eslint-disable-next-line no-new
        new window.Notification('SECRETARY', {
          body: t('circuitOverseer.updated.body'),
        })
      })
    })
  }

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-circuitOverseer')
      .then((circuitOverseer: CircuitOverseerModel) => setData(circuitOverseer))
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <Heading>{t('circuitOverseer.headline')}</Heading>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <Text>{t('circuitOverseer.contactInformation')}</Text>
          <FieldGroup className="sm:col-span-2">
            <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-6 md:col-span-2">
              <Field className="sm:col-span-3">
                <Label>{t('label.firstname')}</Label>
                <Input {...register('firstname', {
                  required: t('errors.firstname.required'),
                })}
                />
                {errors.firstname && <ErrorMessage>{errors.firstname.message}</ErrorMessage>}
              </Field>
              <Field className="sm:col-span-3">
                <Label>{t('label.lastname')}</Label>
                <Input {...register('lastname', {
                  required: t('errors.lastname.required'),
                })}
                />
                {errors.lastname && <ErrorMessage>{errors.lastname.message}</ErrorMessage>}
              </Field>
              <Field className="sm:col-span-3">
                <Label>{t('label.mobile')}</Label>
                <PhoneInputWithCountry
                  name="mobile"
                  defaultCountry={settingsState.congregation.country as Country}
                  countrySelectProps={{ unicodeFlags: true }}
                  placeholder={t('label.mobile')}
                  control={control}
                  className={clsx(errors.phone ? 'border-red-500 hover:border-red-500' : '')}
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
              <Field className="sm:col-span-3">
                <Label>{t('label.phone')}</Label>
                <PhoneInputWithCountry
                  name="phone"
                  defaultCountry={settingsState.congregation.country as Country}
                  countrySelectProps={{ unicodeFlags: true }}
                  placeholder={t('label.phone')}
                  control={control}
                  className={clsx(errors.phone ? 'border-red-500 hover:border-red-500' : '')}
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

              <Field className="sm:col-span-6">
                <Label>{t('label.email')}</Label>
                <Input {...register('email')} />
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
              </Field>

              <Field className="sm:col-span-6">
                <Label>{t('label.address')}</Label>
                <Input {...register('address', {
                  required: t('errors.address.required'),
                })}
                />
                {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
              </Field>

              <Field className="sm:col-span-3">
                <Label>{t('label.zip')}</Label>
                <Input
                  {...register('zip', {
                    required: t('errors.zip.required'),
                  })}
                  invalid={!!errors.zip}
                />
                {errors.zip && <ErrorMessage>{errors.zip.message}</ErrorMessage>}
              </Field>

              <Field className="sm:col-span-3">
                <Label>{t('label.city')}</Label>
                <Input
                  {...register('city', {
                    required: t('errors.city.required'),
                  })}
                  invalid={!!errors.city}
                />
                {errors.city && <ErrorMessage>{errors.city.message}</ErrorMessage>}
              </Field>

              <div className="sm:col-span-6 sm:flex sm:justify-end">
                <Button color="blue" type="submit" disabled={!isValid}>{t('button.save')}</Button>
              </div>
            </div>
          </FieldGroup>
        </div>

      </Fieldset>
    </form>
  )
}
