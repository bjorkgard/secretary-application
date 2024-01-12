import { useEffect, useState }    from 'react'
import { useTranslation }         from 'react-i18next'
import type { SubmitHandler }     from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'
import { getCountries }           from 'react-phone-number-input/input'
import countryLabels              from 'react-phone-number-input/locale/en.json'
import { TrashIcon }              from '@heroicons/react/20/solid'
import type { SettingsModel }     from 'src/types/models'
import classNames                 from '@renderer/utils/classNames'
import { useSettingsState }       from '@renderer/store/settingsStore'
import { Field }                  from '@renderer/components/Field'
import { useUmamiEventTrack }     from '@renderer/providers/umami'

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
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<SettingsModel>({
    values: data,
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
    <form className="min-h-full" onSubmit={handleSubmit(onSubmit)}>
      <h1>{t('settings.headline')}</h1>
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3 dark:border-slate-400/50">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-slate-300">
              {t('settings.congregation.headline')}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-slate-300">
              {t('settings.congregation.information')}
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">{t('label.congregationName')}</span>
                </label>
                <input
                  type="text"
                  placeholder={t('label.congregationName')}
                  className={classNames(
                    errors.congregation?.name ? 'input-error' : '',
                    'input input-bordered w-full',
                  )}
                  defaultValue={data?.congregation?.name}
                  {...register('congregation.name', {
                    required: t('errors.congregationName.required'),
                  })}
                  aria-invalid={errors.congregation?.name ? 'true' : 'false'}
                />
                <label className="label">
                  {errors.congregation?.name && (
                    <span className="label-text-alt text-red-400">
                      {errors.congregation.name.message}
                    </span>
                  )}
                </label>
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">{t('label.congregationNumber')}</span>
                </label>
                <input
                  type="text"
                  placeholder={t('label.congregationNumber')}
                  className={classNames(
                    errors.congregation?.number ? 'input-error' : '',
                    'input input-bordered w-full',
                  )}
                  defaultValue={data?.congregation?.number}
                  {...register('congregation.number', {
                    required: t('errors.congregationNumber.required'),
                  })}
                  aria-invalid={errors.congregation?.number ? 'true' : 'false'}
                />
                <label className="label">
                  {errors.congregation?.number && (
                    <span className="label-text-alt text-red-400">
                      {errors.congregation.number.message}
                    </span>
                  )}
                </label>
              </div>
            </div>

            <div className="col-span-3">
              <Field label={t('label.country')} error={errors.congregation?.country?.message}>
                <select
                  className="select select-bordered w-full max-w-xs"
                  {...register('congregation.country', {
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
              </Field>
            </div>

            <div className="col-span-3">
              <Field label={t('label.locale')} error={errors.congregation?.locale?.message}>
                <select
                  className="select select-bordered w-full max-w-xs"
                  {...register('congregation.locale', {
                    required: t('errors.congregationLocale.required'),
                  })}
                >
                  <option value="en">English</option>
                  <option value="sv">Svenska</option>
                </select>
              </Field>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3 dark:border-slate-400/50">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-slate-300">
              {t('settings.languageGroup.headline')}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-slate-300">
              {t('settings.languageGroup.information')}
            </p>
          </div>
          <div className="max-w-2xl space-y-10 md:col-span-2">
            <fieldset>
              {fields.map((item, index) => {
                return (
                  <div key={item.id} className="grid grid-cols-6 gap-6">
                    <div className="sm:col-span-3">
                      <Field
                        label={t('label.name')}
                        error={errors.congregation?.languageGroups?.[index]?.name?.message}
                      >
                        <input
                          {...register(`congregation.languageGroups.${index}.name` as const, {
                            required: t('errors.languageGroup.name.required'),
                          })}
                          className="input input-bordered w-full"
                        />
                      </Field>
                    </div>

                    <div className="flex w-full items-center justify-end pt-4 sm:col-span-1">
                      <div className="tooltip" data-tip={t('tooltip.deleteChild')}>
                        <button
                          className="btn btn-circle btn-outline btn-xs"
                          onClick={(): void => {
                            remove(index)
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </fieldset>
            <button
              className="btn btn-secondary btn-sm"
              onClick={(): void => append({ name: '' })}
              type="button"
            >
              {t('button.addLanguageGroup')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3 dark:border-slate-400/50">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-slate-300">
              {t('settings.user.headline')}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-slate-300">
              {t('settings.user.information')}
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">{t('label.firstname')}</span>
                </label>
                <input
                  type="text"
                  placeholder={t('label.firstname')}
                  className={classNames(
                    errors.user?.firstname ? 'input-error' : '',
                    'input input-bordered w-full',
                  )}
                  {...register('user.firstname', {
                    required: t('errors.firstname.required'),
                  })}
                  aria-invalid={errors.user?.firstname ? 'true' : 'false'}
                />
                <label className="label">
                  {errors.user?.firstname && (
                    <span className="label-text-alt text-red-400">
                      {errors.user.firstname.message}
                    </span>
                  )}
                </label>
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">{t('label.lastname')}</span>
                </label>
                <input
                  type="text"
                  placeholder={t('label.lastname')}
                  className={classNames(
                    errors.user?.lastname ? 'input-error' : '',
                    'input input-bordered w-full',
                  )}
                  defaultValue={data?.user?.lastname}
                  {...register('user.lastname', {
                    required: t('errors.lastname.required'),
                  })}
                  aria-invalid={errors.user?.lastname ? 'true' : 'false'}
                />
                <label className="label">
                  {errors.user?.lastname && (
                    <span className="label-text-alt text-red-400">
                      {errors.user.lastname.message}
                    </span>
                  )}
                </label>
              </div>
            </div>

            <div className="sm:col-span-6">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">{t('label.email')}</span>
                </label>
                <input
                  type="text"
                  placeholder={t('label.email')}
                  className={classNames(
                    errors.user?.email ? 'input-error' : '',
                    'input input-bordered w-full',
                  )}
                  defaultValue={data?.user?.email}
                  {...register('user.email', {
                    required: t('errors.email.required'),
                    validate: value => !value.includes('jwpub.org') || t('errors.email.jwpub'),
                  })}
                  aria-invalid={errors.user?.email ? 'true' : 'false'}
                />
                <label className="label">
                  {errors.user?.email && (
                    <span className="label-text-alt text-red-400">{errors.user.email.message}</span>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3 dark:border-slate-400/50">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-slate-300">
              {t('settings.online.headline')}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-slate-300">
              {t('settings.online.information')}
            </p>
          </div>

          <div className="max-w-2xl space-y-10 md:col-span-2">
            <fieldset>
              <div className="mt-2 space-y-4">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="public"
                      type="checkbox"
                      {...register('online.public')}
                      className="checkbox-primary checkbox"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="public"
                      className="cursor-pointer font-medium text-gray-900 dark:text-slate-300"
                    >
                      {t('label.public')}
                    </label>
                    <p className="text-gray-500 dark:text-slate-400">
                      {t('settings.online.public')}
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="send_report_group"
                      type="checkbox"
                      {...register('online.send_report_group')}
                      className="checkbox-primary checkbox"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="send_report_group"
                      className="cursor-pointer font-medium text-gray-900 dark:text-slate-300"
                    >
                      {t('label.send_report_group')}
                    </label>
                    <p className="text-gray-500 dark:text-slate-400">
                      {t('settings.online.send_report_group')}
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="send_report_publisher"
                      type="checkbox"
                      {...register('online.send_report_publisher')}
                      className="checkbox-primary checkbox"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="send_report_publisher"
                      className="cursor-pointer font-medium text-gray-900 dark:text-slate-300"
                    >
                      {t('label.send_report_publisher')}
                    </label>
                    <p className="text-gray-500 dark:text-slate-400">
                      {t('settings.online.send_report_publisher')}
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="submit" className="btn btn-primary">
          {t('button.save')}
        </button>
      </div>
    </form>
  )
}

Settings.displayName = 'Settings'
