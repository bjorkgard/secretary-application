import { useEffect, useState }           from 'react'
import { useNavigate }                   from 'react-router-dom'
import { useTranslation }                from 'react-i18next'
import type { SubmitHandler }            from 'react-hook-form'
import { useForm }                       from 'react-hook-form'
import { v4 as uuidv4 }                  from 'uuid'
import { getCountries }                  from 'react-phone-number-input/input'
import countryLabels                     from 'react-phone-number-input/locale/en.json'
import { useSettingsState }              from '@renderer/store/settingsStore'
import { Heading, Subheading }           from '@renderer/components/catalyst/heading'
import { Text }                          from '@renderer/components/catalyst/text'
import { ErrorMessage, Field, Fieldset } from '@renderer/components/catalyst/fieldset'
import { Input }                         from '@renderer/components/catalyst/input'
import { Select }                        from '@renderer/components/catalyst/select'
import { Button }                        from '@renderer/components/catalyst/button'
import type { SettingsModel }            from '../../../../types/models'
import ROUTES                            from '../../constants/routes.json'

function abortApplication(): void {
  window.electron.ipcRenderer.send('app-quit')
}

interface IFormInputs {
  identifier:          string
  congregationName:    string
  congregationNumber:  string
  congregationCountry: string
  congregationLocale:  string
  firstname:           string
  lastname:            string
  email:               string
}

interface Country {
  code: string
  name: string
}

function Registration(): JSX.Element {
  const { t }                     = useTranslation()
  const navigate                  = useNavigate()
  const [countries, setCountries] = useState<Country[]>([])
  const settingsState             = useSettingsState()

  useEffect(() => {
    const c: Country[] = []
    getCountries().forEach((country) => {
      c.push({ code: country, name: countryLabels[country] })
    })
    c.sort((a, b) => (a.name > b.name ? 1 : -1))
    setCountries(c)
  }, [])

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>({
    defaultValues: { congregationCountry: 'SE', congregationLocale: 'sv' },
  })

  const onSubmit: SubmitHandler<IFormInputs> = (data): void => {
    const settings: SettingsModel = {
      identifier:   uuidv4(),
      token:        '',
      congregation: {
        name:           data.congregationName,
        number:         data.congregationNumber,
        country:        data.congregationCountry,
        locale:         data.congregationLocale,
        languageGroups: [],
      },
      user:       { firstname: data.firstname, lastname: data.lastname, email: data.email },
      online:     { send_report_group: false, send_report_publisher: false, public: false },
      mergePdf:   false,
      smsMessage: '',
    }

    window.electron.ipcRenderer.invoke('registration', settings).then(() => {
      settingsState.setSettings(settings)
      navigate(ROUTES.DASHBOARD)
    })
  }

  return (
    <div
      id="registration"
      className="grid h-screen content-center bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950"
    >
      <Heading className="text-center !text-3xl !font-black !leading-tight">{t('registration.headline')}</Heading>
      <Text className="text-center">
        {t('registration.p1')}
        <br />
        {t('registration.p2')}
      </Text>
      <form
        className="max-w-4xl space-y-6 justify-self-center pt-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Fieldset className="col-span-6 my-4 border border-zinc-950/10 p-4 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <Subheading>
                {t('registration.congregation.headline')}
              </Subheading>
              <Text>
                {t('registration.congregation.information')}
              </Text>
            </div>
            <div className="mt-5 space-y-6 md:col-span-2 md:mt-0 ">
              <div className="grid grid-cols-6 gap-6">
                <Field className="col-span-6">
                  <Input
                    type="text"
                    placeholder={t('label.congregationName')}
                    invalid={!!errors.congregationName}
                    {...register('congregationName', {
                      required: t('errors.congregationName.required'),
                    })}
                    aria-invalid={errors.congregationName ? 'true' : 'false'}
                  />
                  {errors.congregationName && <ErrorMessage>{errors.congregationName.message}</ErrorMessage>}

                </Field>

                <Field className="col-span-6">
                  <Input
                    id="congregationNumber"
                    type="text"
                    placeholder={t('label.congregationNumber')}
                    invalid={!!errors.congregationNumber}
                    {...register('congregationNumber', {
                      required: t('errors.congregationNumber.required'),
                    })}
                    aria-invalid={errors.congregationNumber ? 'true' : 'false'}
                  />
                  {errors.congregationNumber && <ErrorMessage>{errors.congregationNumber.message}</ErrorMessage>}
                </Field>

                <Field className="col-span-6">
                  <Select
                    {...register('congregationCountry', {
                      required: t('errors.congregationCountry.required'),
                    })}
                  >
                    {countries.map((country) => {
                      return (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      )
                    })}
                  </Select>

                  {errors.congregationCountry && <ErrorMessage>{errors.congregationCountry.message}</ErrorMessage>}
                </Field>

                <Field className="col-span-6">
                  <Select
                    {...register('congregationLocale', {
                      required: t('errors.congregationLocale.required'),
                    })}
                  >
                    <option value="en">English</option>
                    <option value="sv">Svenska</option>
                  </Select>

                  {errors.congregationLocale && <ErrorMessage>{errors.congregationLocale.message}</ErrorMessage>}
                </Field>
              </div>
            </div>
          </div>
        </Fieldset>

        <Fieldset className="col-span-6 my-4 border border-zinc-950/10 p-4 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <Subheading>
                {t('registration.personal.headline')}
              </Subheading>
              <Text>
                {t('registration.personal.information')}
              </Text>
            </div>
            <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
              <div className="grid grid-cols-6 gap-6">
                <Field className="col-span-6">
                  <Input
                    id="firstname"
                    type="text"
                    placeholder={t('label.firstname')}
                    invalid={!!errors.firstname}
                    {...register('firstname', { required: t('errors.firstname.required') })}
                    aria-invalid={errors.firstname ? 'true' : 'false'}
                  />
                  {errors.firstname && <ErrorMessage>{errors.firstname.message}</ErrorMessage>}
                </Field>

                <Field className="col-span-6">
                  <Input
                    id="lastname"
                    type="text"
                    placeholder={t('label.lastname')}
                    {...register('lastname', { required: t('errors.lastname.required') })}
                    invalid={!!errors.lastname}
                    aria-invalid={errors.lastname ? 'true' : 'false'}
                  />
                  {errors.lastname && <ErrorMessage>{errors.lastname.message}</ErrorMessage>}
                </Field>

                <Field className="col-span-6">
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('label.email')}
                    {...register('email', {
                      required: t('errors.email.required'),
                      validate: value => !value.includes('jwpub.org') || t('errors.email.jwpub'),
                    })}
                    invalid={!!errors.email}
                    aria-invalid={errors.email ? 'true' : 'false'}
                  />
                  {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </Field>
              </div>
            </div>
          </div>
        </Fieldset>

        <div className="flex justify-end space-x-6">
          <Button type="button" outline onClick={abortApplication}>
            {t('button.quit')}
          </Button>
          <Button type="submit" color="blue">
            {t('button.save')}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Registration
