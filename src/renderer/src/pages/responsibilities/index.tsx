import { useEffect, useState }                                           from 'react'
import { useTranslation }                                                from 'react-i18next'
import { useNavigate }                                                   from 'react-router-dom'
import { PlusIcon }                                                      from '@heroicons/react/24/solid'
import { PencilIcon, TrashIcon }                                         from '@heroicons/react/20/solid'
import type { ResponsibilityModel }                                      from 'src/types/models'
import { useConfirmationModalContext }                                   from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import { Fieldset }                                                      from '@renderer/components/catalyst/fieldset'
import { Heading }                                                       from '@renderer/components/catalyst/heading'
import { Button }                                                        from '@renderer/components/catalyst/button'
import { Text }                                                          from '@renderer/components/catalyst/text'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@renderer/components/catalyst/table'
import ROUTES                                                            from '../../constants/routes.json'

export default function Responsibilities(): JSX.Element {
  const { t }          = useTranslation()
  const navigate       = useNavigate()
  const confirmContext = useConfirmationModalContext()

  const [responsibilities, setResponsibilities] = useState<ResponsibilityModel[]>([])

  const getResponsibilities = (): void => {
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
  }

  useEffect(() => {
    getResponsibilities()
  }, [])

  const editResponsibility = (id: string | undefined): void => {
    if (id)
      navigate(`${ROUTES.RESPONSIBILITIES}/${id}/edit`)
  }

  const deleteResponsibility = async (id: string | undefined): Promise<void> => {
    if (id) {
      const result = await confirmContext.showConfirmation(
        t('responsibilities.deleteConfirmation.headline'),
        t('responsibilities.deleteConfirmation.body'),
      )
      if (result) {
        window.electron.ipcRenderer.invoke('delete-responsibility', id).then(() => {
          setResponsibilities(responsibilities.filter(resp => resp._id !== id))
        })
      }
    }
  }

  return (
    <div>
      <Fieldset>
        <div className="flex justify-between">
          <Heading>{t('responsibilities.headline')}</Heading>
          <div className="tooltip tooltip-left" data-tip={t('label.addResponsibility')}>
            <Button
              onClick={(): void => navigate(`${ROUTES.RESPONSIBILITIES}/add`)}
              color="blue"
            >
              <PlusIcon className="size-6 text-white" />
              Lägg till
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <Text>{t('responsibilities.description')}</Text>
          <div className="col-span-2">
            <Table dense grid striped className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
              <TableHead>
                <TableRow>
                  <TableHeader>{t('responsibilities.header.name')}</TableHeader>
                  <TableHeader>&nbsp;</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {responsibilities.map((resp) => {
                  return (
                    <TableRow key={resp._id}>
                      <TableCell>{resp.name}</TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-4">
                          <div
                            className="tooltip tooltip-left"
                            data-tip={t('tooltip.editResponsibility')}
                          >
                            <Button
                              outline
                              onClick={(): void => {
                                editResponsibility(resp._id)
                              }}
                              disabled={resp.default}
                            >
                              <PencilIcon className="size-4" />
                            </Button>
                          </div>
                          <div
                            className="tooltip tooltip-left"
                            data-tip={t('tooltip.deleteServiceGroup')}
                          >
                            <Button
                              outline
                              onClick={(): void => {
                                deleteResponsibility(resp._id)
                              }}
                              disabled={resp.default}
                            >
                              <TrashIcon className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </Fieldset>
    </div>
  )
}

Responsibilities.displayName = 'Responsibilities'
