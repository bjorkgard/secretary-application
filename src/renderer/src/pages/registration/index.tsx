import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import { useTranslation }      from 'react-i18next'
import type { SubmitHandler }  from 'react-hook-form'
import { useForm }             from 'react-hook-form'
import { v4 as uuidv4 }        from 'uuid'
import { getCountries }        from 'react-phone-number-input/input'
import countryLabels           from 'react-phone-number-input/locale/en.json'
import classNames              from '@renderer/utils/classNames'
import { useSettingsState }    from '@renderer/store/settingsStore'
import type { SettingsModel }  from '../../../../types/models'
import ROUTES                  from '../../constants/routes.json'

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
      user:     { firstname: data.firstname, lastname: data.lastname, email: data.email },
      online:   { send_report_group: false, send_report_publisher: false, public: false },
      mergePdf: false,
    }

    window.electron.ipcRenderer.invoke('registration', settings).then(() => {
      settingsState.setSettings(settings)
      navigate(ROUTES.DASHBOARD)
    })
  }

  return (
    <div
      id="registration"
      className="grid h-screen content-center bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-300"
    >
      <h1 className="text-center text-3xl font-black leading-tight">
        {t('registration.headline')}
      </h1>
      <p className="text-center">
        {t('registration.p1')}
        <br />
        {t('registration.p2')}
      </p>
      <form
        className="max-w-4xl space-y-6 justify-self-center pt-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6 dark:border dark:border-slate-500 dark:bg-slate-900">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-slate-400">
                {t('registration.congregation.headline')}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t('registration.congregation.information')}
              </p>
            </div>
            <div className="mt-5 space-y-6 md:col-span-2 md:mt-0 ">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <div className="form-control w-full">
                    <input
                      type="text"
                      placeholder={t('label.congregationName')}
                      className={classNames(
                        errors.congregationName ? 'input-error' : '',
                        'input w-full input-bordered',
                      )}
                      {...register('congregationName', {
                        required: t('errors.congregationName.required'),
                      })}
                      aria-invalid={errors.congregationName ? 'true' : 'false'}
                    />
                    <label className="label" htmlFor="congregationName">
                      {errors.congregationName && (
                        <span className="label-text-alt text-red-400">
                          {errors.congregationName.message}
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="form-control w-full">
                    <input
                      id="congregationNumber"
                      type="text"
                      placeholder={t('label.congregationNumber')}
                      className={classNames(
                        errors.congregationNumber ? 'input-error' : '',
                        'input w-full input-bordered',
                      )}
                      {...register('congregationNumber', {
                        required: t('errors.congregationNumber.required'),
                      })}
                      aria-invalid={errors.congregationNumber ? 'true' : 'false'}
                    />
                    <label className="label" htmlFor="congregationNumber">
                      {errors.congregationNumber && (
                        <span className="label-text-alt text-red-400">
                          {errors.congregationNumber.message}
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="form-control w-full">
                    <select
                      className="select select-bordered w-full"
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
                    </select>

                    <label className="label" htmlFor="congregationCountry">
                      {errors.congregationCountry && (
                        <span className="label-text-alt text-red-400">
                          {errors.congregationCountry.message}
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="form-control w-full">
                    <select
                      className="select select-bordered w-full"
                      {...register('congregationLocale', {
                        required: t('errors.congregationLocale.required'),
                      })}
                    >
                      <option value="en">English</option>
                      <option value="sv">Svenska</option>
                    </select>

                    <label className="label" htmlFor="congregationLocale">
                      {errors.congregationLocale && (
                        <span className="label-text-alt text-red-400">
                          {errors.congregationLocale.message}
                        </span>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6 dark:border dark:border-slate-500 dark:bg-slate-900">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-slate-400">
                {t('registration.personal.headline')}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t('registration.personal.information')}
              </p>
            </div>
            <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <div className="form-control w-full">
                    <input
                      id="firstname"
                      type="text"
                      placeholder={t('label.firstname')}
                      className={classNames(
                        errors.firstname ? 'input-error' : '',
                        'input w-full input-bordered',
                      )}
                      {...register('firstname', { required: t('errors.firstname.required') })}
                      aria-invalid={errors.firstname ? 'true' : 'false'}
                    />
                    <label className="label" htmlFor="firstname">
                      {errors.firstname && (
                        <span className="label-text-alt text-red-400">
                          {errors.firstname.message}
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="form-control w-full">
                    <input
                      id="lastname"
                      type="text"
                      placeholder={t('label.lastname')}
                      className={classNames(
                        errors.lastname ? 'input-error' : '',
                        'input w-full input-bordered',
                      )}
                      {...register('lastname', { required: t('errors.lastname.required') })}
                      aria-invalid={errors.lastname ? 'true' : 'false'}
                    />
                    <label className="label" htmlFor="lastname">
                      {errors.lastname && (
                        <span className="label-text-alt text-red-400">
                          {errors.lastname.message}
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="form-control w-full">
                    <input
                      id="email"
                      type="email"
                      placeholder={t('label.email')}
                      className={classNames(
                        errors.email ? 'input-error' : '',
                        'input w-full input-bordered',
                      )}
                      {...register('email', {
                        required: t('errors.email.required'),
                        validate: value => !value.includes('jwpub.org') || t('errors.email.jwpub'),
                      })}
                      aria-invalid={errors.email ? 'true' : 'false'}
                    />
                    <label className="label" htmlFor="email">
                      {errors.email && (
                        <span className="label-text-alt text-red-400">{errors.email.message}</span>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-6">
          <button type="button" className="btn btn-secondary" onClick={abortApplication}>
            {t('button.quit')}
          </button>
          <button type="submit" className="btn btn-primary">
            {t('button.save')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Registration
