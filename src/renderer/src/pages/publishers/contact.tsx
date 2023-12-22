import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form'
import { Country, isPossiblePhoneNumber } from 'react-phone-number-input'
import { usePublisherState } from '@renderer/store/publisherStore'
import { useSettingsState } from '@renderer/store/settingsStore'
import { Field } from '@renderer/components/Field'
import classNames from '@renderer/utils/classNames'
import { PublisherModel } from 'src/types/models'
import ROUTES from '../../constants/routes.json'
import 'react-phone-number-input/style.css'
import { TrashIcon } from '@heroicons/react/20/solid'
import generateIdentifier from '@renderer/utils/generateIdentifier'

export default function PublisherContactForm(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const publisherState = usePublisherState()
  const settingsState = useSettingsState()

  const [contacts, setContacts] = useState<PublisherModel[]>([])

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
    setValue
  } = useForm<PublisherModel>({ defaultValues: publisherState.publisher })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'children' // unique name for your Field Array
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
        if (publisherState.publisher.familyId) {
          setValue('familyId', publisherState.publisher.familyId)
        }
      })
  }, [])

  if (publisherState.publisher.familyId && !contacts.length) {
    return <div />
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1>
          {publisherState.publisher._id
            ? t('publishers.editHeadline')
            : t('publishers.addHeadline')}
        </h1>
      </div>
      <div className="w-full">
        <ul className="steps w-full">
          <li className="step step-primary">{t('publishers.step.personal')}</li>
          <li className="step step-primary">{t('publishers.step.contact')}</li>
          <li className="step">{t('publishers.step.appointments')}</li>
          <li className="step">{t('publishers.step.other')}</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit(saveData)}>
        <div className="mx-auto grid w-10/12 grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
          {/* PHONE */}
          <div className="sm:col-span-3">
            <Field label={t('label.phone')} error={errors.phone?.message}>
              <PhoneInputWithCountry
                name="phone"
                defaultCountry={settingsState.congregation.country as Country}
                countrySelectProps={{ unicodeFlags: true }}
                placeholder={t('label.phone')}
                control={control}
                className={classNames(
                  errors.phone ? 'input-error' : '',
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

          {/* MOBILE */}
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

          {/* E-MAIL */}
          <div className="sm:col-span-3">
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

          {/* CONTACT */}
          <div className="!col-start-1 sm:col-span-2">
            <Field label={t('label.family')}>
              <div className="flex h-12 items-center space-x-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      {...register('contact')}
                      type="checkbox"
                      className="checkbox-primary checkbox"
                    />
                    <span className="label-text ml-2">{t('label.contact')}</span>
                  </label>
                </div>
              </div>
            </Field>
          </div>

          {/* Family */}
          <div className="sm:col-span-4">
            <Field label="&nbsp;" error={errors.familyId?.message}>
              <select
                className={classNames(
                  errors.familyId ? 'select-error' : '',
                  'select select-bordered w-full'
                )}
                {...register('familyId', {
                  required: {
                    value: !watchContact,
                    message: t('errors.familyId.required')
                  }
                })}
                disabled={watchContact}
                onChange={(e): void => {
                  setAddress(e.target.value)
                }}
              >
                <option value="">{t('label.selectFamily')}</option>
                {contacts.map((contact) => {
                  return (
                    <option key={contact._id} value={contact._id}>
                      {contact.lastname}, {contact.firstname}
                    </option>
                  )
                })}
              </select>
            </Field>
          </div>

          {/* ADDRESS */}
          <div className="sm:col-span-6">
            <Field label={t('label.address')} error={errors.address?.message}>
              <input
                id="address"
                placeholder={t('label.address')}
                className={classNames(
                  errors.address ? 'input-error' : '',
                  'input w-full input-bordered'
                )}
                {...register('address', {
                  required: {
                    value: watchContact,
                    message: t('errors.address.required')
                  }
                })}
                readOnly={!watchContact}
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
                  errors.zip ? 'input-error' : '',
                  'input w-full input-bordered'
                )}
                {...register('zip', {
                  required: {
                    value: watchContact,
                    message: t('errors.zip.required')
                  }
                })}
                readOnly={!watchContact}
              />
            </Field>
          </div>

          {/* CITY */}
          <div className="sm:col-span-3">
            <Field label={t('label.city')} error={errors.city?.message}>
              <input
                id="city"
                placeholder={t('label.city')}
                className={classNames(
                  errors.city ? 'input-error' : '',
                  'input w-full input-bordered'
                )}
                {...register('city', {
                  required: {
                    value: watchContact,
                    message: t('errors.city.required')
                  }
                })}
                readOnly={!watchContact}
              />
            </Field>
          </div>

          {watchContact && (
            <div className="!col-start-1 sm:col-span-4">
              <>
                {fields.length > 0 && (
                  <fieldset className="fieldset col-span-6 mb-2">
                    <legend className="bg-white px-1 text-sm font-bold text-gray-700 dark:bg-slate-900 dark:text-slate-400">
                      {t('label.children')}
                    </legend>
                    {fields.map((item, index) => {
                      return (
                        <div key={item.id} className="grid grid-cols-6 gap-6">
                          <div className="sm:col-span-3">
                            <Field
                              label={t('label.firstname')}
                              error={errors.children?.[index]?.name?.message}
                            >
                              <input
                                {...register(`children.${index}.name` as const, {
                                  required: t('errors.children.name.required')
                                })}
                                className="input input-bordered w-full"
                              />
                            </Field>
                          </div>
                          <div className="sm:col-span-2">
                            <Field label={t('label.birthday')}>
                              <input
                                {...register(`children.${index}.birthday` as const)}
                                type="date"
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
                )}

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={(): void =>
                    append({ name: '', birthday: '', identifier: generateIdentifier() })
                  }
                  type="button"
                >
                  {t('button.addChild')}
                </button>
              </>
            </div>
          )}

          <fieldset className="fieldset col-span-6 mb-2 mt-4 grid grid-cols-6 gap-4">
            <legend className="bg-white px-1 text-sm font-bold text-gray-700 dark:bg-slate-900 dark:text-slate-400">
              {t('label.emergencyContact')}
            </legend>
            {/* EMERGENCY CONTACT NAME */}
            <div className="!col-start-1 sm:col-span-2">
              <Field label={t('label.name')} error={errors.emergencyContact?.name?.message}>
                <input
                  placeholder={t('label.name')}
                  className={classNames(
                    errors.emergencyContact?.name ? 'input-error' : '',
                    'input w-full input-bordered'
                  )}
                  {...register('emergencyContact.name')}
                />
              </Field>
            </div>

            {/* EMERGENCY CONTACT EMAIL */}
            <div className="sm:col-span-2">
              <Field label={t('label.email')} error={errors.emergencyContact?.email?.message}>
                <input
                  type="email"
                  placeholder={t('label.email')}
                  className={classNames(
                    errors.emergencyContact?.email ? 'input-error' : '',
                    'input w-full input-bordered'
                  )}
                  {...register('emergencyContact.email')}
                />
              </Field>
            </div>

            {/* EMERGENCY CONTACT PHONE */}
            <div className="sm:col-span-2">
              <Field label={t('label.phone')} error={errors.emergencyContact?.phone?.message}>
                <PhoneInputWithCountry
                  name="emergencyContact.phone"
                  defaultCountry={settingsState.congregation.country as Country}
                  countrySelectProps={{ unicodeFlags: true }}
                  placeholder={t('label.phone')}
                  control={control}
                  className={classNames(
                    errors.emergencyContact?.phone ? 'input-error' : '',
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
          </fieldset>

          <div className="col-span-6 col-start-1 mt-2 flex justify-between">
            <button
              className="btn btn-accent"
              onClick={(): void => navigate(ROUTES.PUBLISHER_PERSONAL_FORM)}
            >
              <ChevronLeftIcon className="h-5 w-5" />
              {t('button.back')}
            </button>
            <button className="btn btn-primary" type="submit">
              {t('button.next')}
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
