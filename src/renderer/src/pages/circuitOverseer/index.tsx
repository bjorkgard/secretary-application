import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SubmitHandler, useForm } from 'react-hook-form'
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form'
import { Country, isPossiblePhoneNumber } from 'react-phone-number-input'
import { CircuitOverseerModel } from 'src/types/models'
import classNames from '@renderer/utils/classNames'
import { Field } from '@renderer/components/Field'
import { useSettingsState } from '@renderer/store/settingsStore'
import 'react-phone-number-input/style.css'

export default function CircuitOverseer(): JSX.Element {
  const { t } = useTranslation()
  const settingsState = useSettingsState()

  const [data, setData] = useState<CircuitOverseerModel>()

  const {
    control,
    register,
    formState: { errors },
    handleSubmit
  } = useForm<CircuitOverseerModel>({
    values: data
  })

  const onSubmit: SubmitHandler<CircuitOverseerModel> = (data): void => {
    window.electron.ipcRenderer.invoke('update-circuitOverseer', data).then(() => {
      window.Notification.requestPermission().then(() => {
        new window.Notification('SECRETARY', {
          body: t('circuitOverseer.updated.body')
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
    <form className="min-h-full" onSubmit={handleSubmit(onSubmit)}>
      <h1>{t('circuitOverseer.headline')}</h1>
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-slate-300">
              {t('circuitOverseer.contactInformation')}
            </h2>
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <Field label={t('label.firstname')} error={errors.firstname?.message}>
                <input
                  id="firstname"
                  placeholder={t('label.firstname')}
                  className={classNames(
                    errors.firstname ? 'input-error' : '',
                    'input w-full input-bordered'
                  )}
                  {...register('firstname', {
                    required: t('errors.firstname.required')
                  })}
                />
              </Field>
            </div>

            <div className="sm:col-span-3">
              <Field label={t('label.lastname')} error={errors.lastname?.message}>
                <input
                  id="lastname"
                  placeholder={t('label.lastname')}
                  className={classNames(
                    errors.firstname ? 'input-error' : '',
                    'input w-full input-bordered'
                  )}
                  {...register('lastname', {
                    required: t('errors.lastname.required')
                  })}
                />
              </Field>
            </div>

            <div className="sm:col-span-3">
              <Field label={t('label.mobile')} error={errors.mobile?.message}>
                <PhoneInputWithCountry
                  name="mobile"
                  defaultCountry={settingsState.congregation.country as Country}
                  countrySelectProps={{ unicodeFlags: true }}
                  placeholder={t('label.mobile')}
                  control={control}
                  className={classNames(
                    errors.mobile ? 'input-error' : '',
                    'input input-bordered w-full'
                  )}
                  rules={{
                    validate: {
                      test: (v: string | null): string | null => {
                        let result = ''
                        if (v) {
                          result = isPossiblePhoneNumber(v) ? '' : t('errors.mobile.invalid')
                        }
                        return result !== '' ? result : null
                      }
                    }
                  }}
                />
              </Field>
            </div>

            <div className="sm:col-span-3">
              <Field label={t('label.phone')} error={errors.phone?.message}>
                <PhoneInputWithCountry
                  name="phone"
                  defaultCountry={settingsState.congregation.country as Country}
                  countrySelectProps={{ unicodeFlags: true }}
                  placeholder={t('label.phone')}
                  control={control}
                  className={classNames(
                    errors.mobile ? 'input-error' : '',
                    'input input-bordered w-full'
                  )}
                  rules={{
                    validate: {
                      test: (v: string | null): string | null => {
                        let result = ''
                        if (v) {
                          result = isPossiblePhoneNumber(v) ? '' : t('errors.phone.invalid')
                        }
                        return result !== '' ? result : null
                      }
                    }
                  }}
                />
              </Field>
            </div>

            {/* E-MAIL */}
            <div className="sm:col-span-6">
              <Field label={t('label.email')} error={errors.email?.message}>
                <input
                  id="email"
                  type="email"
                  placeholder={t('label.email')}
                  className={classNames(
                    errors.email ? 'input-error' : '',
                    'input input-bordered w-full'
                  )}
                  {...register('email')}
                />
              </Field>
            </div>

            {/* ADDRESS */}
            <div className="sm:col-span-6">
              <Field label={t('label.address')} error={errors.address?.message}>
                <input
                  id="address"
                  placeholder={t('label.address')}
                  className={classNames(
                    errors.email ? 'input-error' : '',
                    'input input-bordered w-full'
                  )}
                  {...register('address', {
                    required: t('errors.address.required')
                  })}
                />
              </Field>
            </div>

            {/* ZIP */}
            <div className="sm:col-span-3">
              <Field label={t('label.zip')} error={errors.zip?.message}>
                <input
                  id="zip"
                  placeholder={t('label.zip')}
                  className={classNames(
                    errors.email ? 'input-error' : '',
                    'input input-bordered w-full'
                  )}
                  {...register('zip', {
                    required: t('errors.zip.required')
                  })}
                />
              </Field>
            </div>

            {/* CITY */}
            <div className="sm:col-span-3">
              <Field label={t('label.city')} error={errors.zip?.message}>
                <input
                  id="city"
                  placeholder={t('label.city')}
                  className={classNames(
                    errors.email ? 'input-error' : '',
                    'input input-bordered w-full'
                  )}
                  {...register('city', {
                    required: t('errors.city.required')
                  })}
                />
              </Field>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
        <div></div>
        <div className="sm:grid-cols-6">
          <button type="submit" className="btn btn-primary">
            {t('button.save')}
          </button>
        </div>
      </div>
    </form>
  )
}
