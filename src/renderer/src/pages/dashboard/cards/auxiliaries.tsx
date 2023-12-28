import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Card } from '@renderer/components/Card'
import { Modal } from '@renderer/components/Modal'
import { AuxiliaryModel, PublisherModel } from 'src/types/models'
import { useUmamiEventTrack } from '@renderer/providers/umami'
import { Field } from '@renderer/components/Field'
import classNames from '@renderer/utils/classNames'

interface AuxiliaryForm {
  publisher: PublisherModel
  serviceMonth: string
}

export default function Auxiliaries(): JSX.Element {
  const { t } = useTranslation()
  const umamiTrack = useUmamiEventTrack()
  const [loading, setLoading] = useState<boolean>(true)
  const [reload, setReload] = useState<boolean>(true)
  const [publishers, setPublishers] = useState<PublisherModel[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)
  const [auxiliaryArray, setAuxiliaryArray] = useState<AuxiliaryModel[]>([])

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-publishers', { sortField: 'lastname', queryString: '' })
      .then((result: PublisherModel[]) => {
        // filter out publishers that are not able to be auxiliary
        const publishers = result.filter(
          (p) =>
            (p.status === 'ACTIVE' || p.status === 'IRREGULAR') &&
            (p.baptised || p.unknown_baptised) &&
            !p.appointments.some(
              (a) =>
                a.type === 'PIONEER' ||
                a.type === 'AUXILIARY' ||
                a.type === 'MISSIONARY' ||
                a.type === 'SPECIALPIONEER' ||
                a.type === 'CIRCUITOVERSEER'
            )
        )
        setPublishers(publishers)
      })
  }, [])

  useEffect(() => {
    window.electron.ipcRenderer.invoke('auxiliaries').then((result) => {
      setAuxiliaryArray(result)
      setLoading(false)
      setReload(false)
    })
  }, [reload])

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<AuxiliaryForm>({ defaultValues: {}, mode: 'onSubmit' })

  const onSubmit: SubmitHandler<AuxiliaryForm> = (data): void => {
    umamiTrack('add-auxiliary', window.location.pathname)
    window.electron.ipcRenderer.invoke('add-auxiliary', data).then(() => {
      setShowModal(false)
      setReload(true)
    })
  }

  return (
    <Card title={t('label.auxiliaries')} loading={loading}>
      {loading ? (
        <div className="aspect-square w-full rounded-md bg-slate-200" />
      ) : (
        <>
          <div className="flex flex-col h-full w-full">
            <div className="join join-vertical text-left grow">
              {auxiliaryArray.map((auxiliary) => {
                return (
                  <div className="collapse collapse-arrow join-item" key={auxiliary.serviceMonth}>
                    <input type="radio" name="my-accordion" />
                    <div className="collapse-title  font-medium">
                      {auxiliary.name} ({auxiliary.publisherIds.length})
                    </div>
                    <div className="collapse-content text-sm">
                      {auxiliary.publishers?.map((publisher) => {
                        return (
                          <p key={publisher._id} className="!my-0">
                            {publisher.firstname} {publisher.lastname}
                          </p>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            <button className="btn btn-primary btn-sm self-end" onClick={() => setShowModal(true)}>
              {t('label.add')}
            </button>
          </div>
          <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={() => handleSubmit(onSubmit)()}
          >
            <div>
              <h3>{t('auxiliary.headline')}</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mx-auto grid w-full grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6 sm:mx-0">
                  <div className="sm:col-span-3">
                    <Field label={t('label.publisher')} error={errors.publisher?.message}>
                      <select
                        className={classNames(
                          errors.publisher ? 'select-error' : '',
                          'select select-bordered w-full'
                        )}
                        {...register('publisher', {
                          required: t('errors.publisher.required')
                        })}
                      >
                        <option value="">{t('label.selectPublisher')}</option>
                        {publishers.map((p) => {
                          return (
                            <option key={p._id} value={p._id}>
                              {p.lastname}, {p.firstname}
                            </option>
                          )
                        })}
                      </select>
                    </Field>
                  </div>
                  <div className="sm:col-span-3">
                    <Field label={t('label.month')} error={errors.serviceMonth?.message}>
                      <input
                        id="serviceMonth"
                        type="month"
                        placeholder={t('label.month')}
                        className={classNames(
                          errors.serviceMonth ? 'input-error' : '',
                          'input w-full input-bordered'
                        )}
                        {...register('serviceMonth', {
                          required: t('errors.serviceMonth.required')
                        })}
                      />
                    </Field>
                  </div>
                </div>
              </form>
            </div>
          </Modal>
        </>
      )}
    </Card>
  )
}
