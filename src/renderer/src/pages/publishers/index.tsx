import { useEffect, useState }           from 'react'
import { useTranslation }                from 'react-i18next'
import { useNavigate }                   from 'react-router-dom'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/solid'
import { EllipsisHorizontalIcon }        from '@heroicons/react/20/solid'
import {
  DocumentArrowDownIcon,
  PencilIcon,
  PlusIcon as PlusIconSmall,
} from '@heroicons/react/16/solid'
import { formatPhoneNumber }                                                    from 'react-phone-number-input'
import type { PublicCongregationModel, PublisherModel, ServiceGroupModel }      from 'src/types/models'
import { isTemplateCorrect }                                                    from '@renderer/utils/isTemplateCorrect'
import { Heading }                                                              from '@renderer/components/catalyst/heading'
import { Button }                                                               from '@renderer/components/catalyst/button'
import { InputGroupSmall, InputSmall }                                          from '@renderer/components/catalyst/input-small'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow }        from '@renderer/components/catalyst/table'
import { Badge }                                                                from '@renderer/components/catalyst/badge'
import { TextLink }                                                             from '@renderer/components/catalyst/text'
import { Dropdown, DropdownButton, DropdownHeader, DropdownItem, DropdownMenu } from '@renderer/components/catalyst/dropdown'
import ROUTES                                                                   from '../../constants/routes.json'
import EventModal                                                               from './components/eventModal'

export default function Publishers(): JSX.Element {
  const { t }    = useTranslation()
  const navigate = useNavigate()

  const [publishers, setPublishers]                   = useState<PublisherModel[]>([])
  const [publisher, setPublisher]                     = useState<PublisherModel>()
  const [openEventModal, setOpenEventModal]           = useState<boolean>(false)
  const [serviceGroups, setServiceGroups]             = useState<ServiceGroupModel[]>([])
  const [hasS21, setHasS21]                           = useState<boolean>(false)
  const [queryString, setQueryString]                 = useState<string>('')
  const [publicCongregations, setPublicCongregations] = useState<PublicCongregationModel[]>([])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryString(e.target.value)
  }

  const getPublishers = (sortField = 'lastname', queryString = ''): void => {
    window.electron.ipcRenderer
      .invoke('get-publishers', { sortField, queryString })
      .then((result: PublisherModel[]) => {
        setPublishers(result)
      })
  }

  const getServiceGroups = (): void => {
    window.electron.ipcRenderer.invoke('get-serviceGroups').then((result: ServiceGroupModel[]) => {
      setServiceGroups(result)
    })
  }

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-public-congregations').then((result: PublicCongregationModel[]) => {
      setPublicCongregations(result)
    })
  }, [])

  useEffect(() => {
    getServiceGroups()
    getPublishers('lastname', queryString)
    isTemplateCorrect('S-21').then((result) => {
      setHasS21(result)
    })
  }, [queryString])

  const editPublisher = (id: string | undefined): void => {
    if (id)
      navigate(`${ROUTES.PUBLISHERS}/${id}/edit`)
  }

  const exportS21 = (id: string | undefined): void => {
    if (id)
      window.electron.ipcRenderer.send('export-s21', id)
  }

  const exportExtendedRegisterCard = (id: string | undefined): void => {
    if (id)
      window.electron.ipcRenderer.send('export-extended-register-card', id)
  }

  const addEvent = (id: string | undefined): void => {
    if (id) {
      setPublisher(publishers.find(p => p._id === id))
      setOpenEventModal(true)
    }
  }

  return (
    <>
      <EventModal
        open={openEventModal}
        setOpen={function (open: boolean): void {
          setOpenEventModal(open)
        }}
        publisher={publisher}
        publicCongregations={publicCongregations}
        refresh={function (): void {
          getPublishers()
          setOpenEventModal(false)
        }}
      />
      <div className="flex flex-col">
        <div className="sticky flex w-full justify-between">
          <Heading>{t('publishers.headline')}</Heading>
          <div className="w-1/3">
            <InputGroupSmall>
              <MagnifyingGlassIcon />
              <InputSmall name="search" placeholder={t('search')} aria-label="Search" onChange={onChange} />
            </InputGroupSmall>
          </div>
          <div className="tooltip tooltip-left" data-tip={t('label.addPublisher')}>
            <Button
              onClick={(): void => navigate(ROUTES.PUBLISHER_PERSONAL_FORM)}
              color="blue"
            >
              <PlusIcon className="size-6 text-white" />
              Lägg till
            </Button>
          </div>
        </div>

        <Table dense grid striped className="mt-2 [--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
          <TableHead>
            <TableRow>
              <TableHeader></TableHeader>
              <TableHeader>{t('publishers.header.group')}</TableHeader>
              <TableHeader>{t('publishers.header.lastname')}</TableHeader>
              <TableHeader>{t('publishers.header.firstname')}</TableHeader>
              <TableHeader>{t('publishers.header.mobile')}</TableHeader>
              <TableHeader>{t('publishers.header.email')}</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {publishers.map((publisher) => {
              const serviceGroup = serviceGroups.find(sg => sg._id === publisher.serviceGroupId)
              const appointments
                  = publisher.appointments.map((a) => {
                    if (a.type)
                      return `badge.short.${a.type.toLowerCase()}`

                    return null
                  }) || []

              return (
                <TableRow key={publisher._id}>
                  <TableCell className="flex gap-1">
                    {appointments.map((appointment) => {
                      if (appointment) {
                        return (
                          <Badge key={appointment} color="blue">{t(appointment)}</Badge>
                        )
                      }
                      else {
                        return null
                      }
                    })}
                  </TableCell>
                  <TableCell>{serviceGroup?.name || '-'}</TableCell>
                  <TableCell>{publisher.firstname}</TableCell>
                  <TableCell>{publisher.lastname}</TableCell>
                  <TableCell>
                    <TextLink href={`sms:${publisher.mobile}`}>{publisher.mobile ? formatPhoneNumber(publisher.mobile) : ''}</TextLink>
                  </TableCell>
                  <TableCell>
                    <TextLink href={`mailto:${publisher.email}`}>{publisher.email}</TextLink>
                  </TableCell>
                  <TableCell>
                    <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                      <Dropdown>
                        <DropdownButton outline aria-label="More options">
                          <EllipsisHorizontalIcon />
                        </DropdownButton>
                        <DropdownMenu anchor="bottom end">
                          <DropdownHeader>
                            <div className="pr-6">
                              <div className="text-xs text-zinc-500 dark:text-zinc-400">{`${publisher.firstname} ${publisher.lastname}`}</div>
                            </div>
                          </DropdownHeader>
                          <DropdownItem
                            onClick={(): void => {
                              addEvent(publisher._id)
                            }}
                          >
                            <PlusIconSmall />
                            {t('menu.event')}
                          </DropdownItem>
                          <DropdownItem
                            onClick={(): void => {
                              exportS21(publisher._id)
                            }}
                            disabled={!hasS21}
                          >
                            <DocumentArrowDownIcon />
                            {t('menu.s21')}
                          </DropdownItem>
                          <DropdownItem
                            onClick={(): void => {
                              exportExtendedRegisterCard(publisher._id)
                            }}
                          >
                            <DocumentArrowDownIcon />
                            {t('menu.extendedRegisterCard')}
                          </DropdownItem>
                          <DropdownItem
                            onClick={(): void => {
                              editPublisher(publisher._id)
                            }}
                          >
                            <PencilIcon />
                            {t('menu.edit')}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

Publishers.displayName = 'Publishers'
