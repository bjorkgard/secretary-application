import { useForm }                                          from 'react-hook-form'
import { useTranslation }                                   from 'react-i18next'
import { useNavigate, useParams }                           from 'react-router-dom'
import type { PublisherModel, ServiceGroupModel }           from 'src/types/models'
import { useEffect, useState }                              from 'react'
import { ErrorMessage, Field, FieldGroup, Fieldset, Label } from '@renderer/components/catalyst/fieldset'
import { Heading }                                          from '@renderer/components/catalyst/heading'
import { Text }                                             from '@renderer/components/catalyst/text'
import { Input }                                            from '@renderer/components/catalyst/input'
import { Select }                                           from '@renderer/components/catalyst/select'
import { Button }                                           from '@renderer/components/catalyst/button'
import ROUTES                                               from '../../constants/routes.json'

export default function ServiceGroupForm(): JSX.Element {
  const { t }    = useTranslation()
  const { id }   = useParams()
  const navigate = useNavigate()

  const [publishers, setPublishers]     = useState<PublisherModel[]>([])
  const [serviceGroup, setServiceGroup] = useState<ServiceGroupModel>()

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    setValue,
  } = useForm<ServiceGroupModel>({ defaultValues: {}, mode: 'onChange' })

  const onSubmit = (data: ServiceGroupModel): void => {
    if (data._id) {
      window.electron.ipcRenderer.invoke('update-serviceGroup', data).then(() => {
        navigate(ROUTES.SERVICE_GROUPS)
      })
    }
    else {
      window.electron.ipcRenderer.invoke('create-serviceGroup', data).then(() => {
        navigate(ROUTES.SERVICE_GROUPS)
      })
    }
  }

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-publishers', { sortField: 'lastname', queryString: '' })
      .then((result: PublisherModel[]) => {
        setPublishers(result)
      })
  }, [])

  useEffect(() => {
    if (id) {
      window.electron.ipcRenderer
        .invoke('get-serviceGroup', id)
        .then((result: ServiceGroupModel) => {
          setValue('_id', result._id)
          setValue('name', result.name)
          setValue('receivers', result.receivers)
          setValue('responsibleId', result.responsibleId)
          setValue('assistantId', result.assistantId)
          setServiceGroup(result)
        })
    }
  }, [id])

  if (id && !serviceGroup) {
    // !This is a workaround wait for the serviceGroup to be loaded
    return <div />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <Heading>{id ? t('serviceGroups.editHeadline') : t('serviceGroups.addHeadline')}</Heading>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <Text></Text>
          <FieldGroup className="sm:col-span-2">
            <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-6 md:col-span-2">
              <Field className="sm:col-span-3">
                <Label>{t('label.name')}</Label>
                <Input
                  {...register('name', {
                    required: t('errors.name.required'),
                  })}
                  invalid={!!errors.name}
                  autoFocus
                />
                {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
              </Field>
              <Field className="col-span-3">
                <Label>{t('label.receivers')}</Label>
                <Select
                  {...register('receivers')}
                >
                  <option value="NONE">{t('label.none')}</option>
                  <option value="BOTH">{t('label.both')}</option>
                  <option value="RESPONSIBLE">{t('label.responsible')}</option>
                  <option value="ASSISTANT">{t('label.assistant')}</option>
                </Select>
                {errors.receivers && <ErrorMessage>{errors.receivers.message}</ErrorMessage>}
              </Field>
              <Field className="col-span-3">
                <Label>{t('label.responsible')}</Label>
                <Select
                  {...register('responsibleId')}
                >
                  <option value="">{t('label.selectResponsible')}</option>
                  {publishers.map((p) => {
                    return (
                      <option key={p._id} value={p._id}>{`${p.lastname}, ${p.firstname}`}</option>
                    )
                  })}
                </Select>
                {errors.responsibleId && <ErrorMessage>{errors.responsibleId.message}</ErrorMessage>}
              </Field>
              <Field className="col-span-3">
                <Label>{t('label.assistant')}</Label>
                <Select
                  {...register('assistantId')}
                >
                  <option value="">{t('label.selectAssistant')}</option>
                  {publishers.map((p) => {
                    return (
                      <option key={p._id} value={p._id}>{`${p.lastname}, ${p.firstname}`}</option>
                    )
                  })}
                </Select>
                {errors.assistantId && <ErrorMessage>{errors.assistantId.message}</ErrorMessage>}
              </Field>

              <div className="sm:col-span-6 sm:flex sm:justify-between">
                <Button outline onClick={(): void => navigate(ROUTES.SERVICE_GROUPS)}>{t('button.abort')}</Button>
                <Button color="blue" type="submit" disabled={!isValid}>{t('button.save')}</Button>
              </div>
            </div>
          </FieldGroup>
        </div>
      </Fieldset>
    </form>
  )
}
