import { useEffect, useState }                              from 'react'
import { useForm }                                          from 'react-hook-form'
import { useTranslation }                                   from 'react-i18next'
import { useNavigate, useParams }                           from 'react-router-dom'
import type { ResponsibilityModel, TaskModel }              from 'src/types/models'
import { ErrorMessage, Field, FieldGroup, Fieldset, Label } from '@renderer/components/catalyst/fieldset'
import { Heading }                                          from '@renderer/components/catalyst/heading'
import { Text }                                             from '@renderer/components/catalyst/text'
import { Input }                                            from '@renderer/components/catalyst/input'
import { Button }                                           from '@renderer/components/catalyst/button'
import { Select }                                           from '@renderer/components/catalyst/select'
import ROUTES                                               from '../../constants/routes.json'

export default function TaskForm(): JSX.Element {
  const { t }    = useTranslation()
  const { id }   = useParams()
  const navigate = useNavigate()

  const [responisbilities, setResponsibilities] = useState<ResponsibilityModel[]>([])
  const [task, setTask]                         = useState<TaskModel>()

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    setValue,
  } = useForm<TaskModel>({ defaultValues: {}, mode: 'onChange' })

  const onSubmit = (data: TaskModel): void => {
    if (data._id) {
      window.electron.ipcRenderer.invoke('update-task', data).then(() => {
        navigate(ROUTES.TASKS)
      })
    }
    else {
      window.electron.ipcRenderer.invoke('create-task', data).then(() => {
        navigate(ROUTES.TASKS)
      })
    }
  }

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-responsibilities')
      .then((result: ResponsibilityModel[]) => {
        const parsedResult = result.map((resp) => {
          return { ...resp, name: resp.default ? t(resp.name) : resp.name }
        })

        setResponsibilities(
          parsedResult.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)),
        )
      })
  }, [])

  useEffect(() => {
    if (id) {
      window.electron.ipcRenderer.invoke('get-task', id).then((result: TaskModel) => {
        setValue('_id', result._id)
        setValue('name', result.name)
        setValue('responsibilityId', result.responsibilityId)
        setValue('default', result.default)
        setTask(result)
      })
    }
  }, [id])

  if (id && !task) {
    // !This is a workaround wait for the task to be loaded
    return <div />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <Heading>{id ? t('tasks.editHeadline') : t('tasks.addHeadline')}</Heading>
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
              <Field className="sm:col-span-3">
                <Label>{t('label.responsibility')}</Label>
                <Select {...register('responsibilityId', {
                  required: t('errors.responsibleId.required'),
                })}
                >
                  <option value="">{t('label.selectResponsibility')}</option>
                  {responisbilities.map((r) => {
                    return (
                      <option key={r._id} value={r._id}>
                        {r.name}
                      </option>
                    )
                  })}
                </Select>
                {errors.responsibilityId && <ErrorMessage>{errors.responsibilityId.message}</ErrorMessage>}
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
