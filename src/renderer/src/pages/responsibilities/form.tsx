import { useEffect, useState }                              from 'react'
import { useForm }                                          from 'react-hook-form'
import { useTranslation }                                   from 'react-i18next'
import { useNavigate, useParams }                           from 'react-router-dom'
import type { ResponsibilityModel }                         from 'src/types/models'
import { ErrorMessage, Field, FieldGroup, Fieldset, Label } from '@renderer/components/catalyst/fieldset'
import { Heading }                                          from '@renderer/components/catalyst/heading'
import { Text }                                             from '@renderer/components/catalyst/text'
import { Input }                                            from '@renderer/components/catalyst/input'
import { Button }                                           from '@renderer/components/catalyst/button'
import ROUTES                                               from '../../constants/routes.json'

export default function ResponsibilityForm(): JSX.Element {
  const { t }    = useTranslation()
  const { id }   = useParams()
  const navigate = useNavigate()

  const [responsibility, setResponsibility] = useState<ResponsibilityModel>()

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    setValue,
  } = useForm<ResponsibilityModel>({ defaultValues: {}, mode: 'onChange' })

  const onSubmit = (data: ResponsibilityModel): void => {
    if (data._id) {
      window.electron.ipcRenderer.invoke('update-responsibility', data).then(() => {
        navigate(ROUTES.RESPONSIBILITIES)
      })
    }
    else {
      window.electron.ipcRenderer.invoke('create-responsibility', data).then(() => {
        navigate(ROUTES.RESPONSIBILITIES)
      })
    }
  }

  useEffect(() => {
    if (id) {
      window.electron.ipcRenderer
        .invoke('get-responsibility', id)
        .then((result: ResponsibilityModel) => {
          setValue('_id', result._id)
          setValue('name', result.name)
          setValue('default', result.default)
          setResponsibility(result)
        })
    }
  }, [id])

  if (id && !responsibility) {
    // !This is a workaround wait for the responsibility to be loaded
    return <div />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <Heading>{id ? t('responisbilities.editHeadline') : t('responisbilities.addHeadline')}</Heading>
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
              <div className="sm:col-span-6 sm:flex sm:justify-between">
                <Button outline onClick={(): void => navigate(ROUTES.RESPONSIBILITIES)}>{t('button.abort')}</Button>
                <Button color="blue" type="submit" disabled={!isValid}>{t('button.save')}</Button>
              </div>
            </div>
          </FieldGroup>
        </div>
      </Fieldset>
    </form>
  )
}
