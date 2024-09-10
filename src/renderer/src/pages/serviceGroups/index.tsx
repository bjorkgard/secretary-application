import { useEffect, useState }                                           from 'react'
import { useTranslation }                                                from 'react-i18next'
import { useNavigate }                                                   from 'react-router-dom'
import { PlusIcon }                                                      from '@heroicons/react/24/solid'
import { PencilIcon, TrashIcon }                                         from '@heroicons/react/20/solid'
import type { PublisherModel, ServiceGroupModel }                        from 'src/types/models'
import { useConfirmationModalContext }                                   from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import { Fieldset }                                                      from '@renderer/components/catalyst/fieldset'
import { Heading }                                                       from '@renderer/components/catalyst/heading'
import { Text }                                                          from '@renderer/components/catalyst/text'
import { Button }                                                        from '@renderer/components/catalyst/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@renderer/components/catalyst/table'
import ROUTES                                                            from '../../constants/routes.json'

export default function ServiceGroups(): JSX.Element {
  const { t }          = useTranslation()
  const navigate       = useNavigate()
  const confirmContext = useConfirmationModalContext()

  const [serviceGroups, setServiceGroups] = useState<ServiceGroupModel[]>([])
  const [responibles, setResponsibles]    = useState<PublisherModel[]>([])

  const getServiceGroups = (): void => {
    window.electron.ipcRenderer.invoke('get-serviceGroups').then((result: ServiceGroupModel[]) => {
      setServiceGroups(result)
    })
  }

  useEffect(() => {
    getServiceGroups()
  }, [])

  useEffect(() => {
    const respIds   = serviceGroups.map(serviceGroup => serviceGroup.responsibleId)
    const assistIds = serviceGroups.map(serviceGroup => serviceGroup.assistantId)
    let ids         = respIds.concat(assistIds.filter(item => !respIds.includes(item)))
    ids             = ids.filter(v => v !== undefined)

    window.electron.ipcRenderer
      .invoke('get-publishersByIds', { ids })
      .then((result: PublisherModel[]) => {
        setResponsibles(result)
      })
  }, [serviceGroups])

  const editServiceGroup = (id: string | undefined): void => {
    if (id)
      navigate(`${ROUTES.SERVICE_GROUPS}/${id}/edit`)
  }

  const deleteServiceGroup = async (id: string | undefined): Promise<void> => {
    if (id) {
      const result = await confirmContext.showConfirmation(
        t('serviceGroups.deleteConfirmation.headline'),
        t('serviceGroups.deleteConfirmation.body'),
      )
      if (result) {
        window.electron.ipcRenderer.invoke('delete-serviceGroup', id).then(() => {
          setServiceGroups(serviceGroups.filter(serviceGroup => serviceGroup._id !== id))
        })
      }
    }
  }

  return (
    <div>
      <Fieldset>
        <div className="flex justify-between">
          <Heading>{t('serviceGroups.headline')}</Heading>
          <div className="tooltip tooltip-left" data-tip={t('label.addServiceGroup')}>
            <Button
              onClick={(): void => navigate(`${ROUTES.SERVICE_GROUPS}/add`)}
              color="blue"
            >
              <PlusIcon className="size-6 text-white" />
              Lägg till
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <Text>{t('serviceGroups.description')}</Text>
          <div className="col-span-2">
            <Table dense grid striped className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
              <TableHead>
                <TableRow>
                  <TableHeader>{t('serviceGroups.header.name')}</TableHeader>
                  <TableHeader>{t('serviceGroups.header.responsible')}</TableHeader>
                  <TableHeader>{t('serviceGroups.header.assistant')}</TableHeader>
                  <TableHeader>{t('serviceGroups.header.receivers')}</TableHeader>
                  <TableHeader>&nbsp;</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceGroups.map((serviceGroup) => {
                  if (serviceGroup.name === 'TEMPORARY')
                    return null

                  const responsible = responibles.find(r => r._id === serviceGroup.responsibleId)
                  const assistant   = responibles.find(r => r._id === serviceGroup.assistantId)

                  return (
                    <TableRow key={serviceGroup._id} className="hover">
                      <TableCell>{serviceGroup.name}</TableCell>
                      <TableCell>{`${responsible?.firstname} ${responsible?.lastname}`}</TableCell>
                      <TableCell>{`${assistant?.firstname} ${assistant?.lastname}`}</TableCell>
                      <TableCell>{t(`label.${serviceGroup.receivers.toLowerCase()}`)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-4">
                          <div
                            className="tooltip tooltip-left"
                            data-tip={t('tooltip.editServiceGroup')}
                          >
                            <Button
                              outline
                              onClick={(): void => {
                                editServiceGroup(serviceGroup._id)
                              }}
                            >
                              <PencilIcon />
                            </Button>
                          </div>
                          <div
                            className="tooltip tooltip-left"
                            data-tip={t('tooltip.deleteServiceGroup')}
                          >
                            <Button
                              outline
                              onClick={(): void => {
                                deleteServiceGroup(serviceGroup._id)
                              }}
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

ServiceGroups.displayName = 'Service Groups'
