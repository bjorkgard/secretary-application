import { useEffect, useState }                                                           from 'react'
import { useTranslation }                                                                from 'react-i18next'
import { useNavigate }                                                                   from 'react-router-dom'
import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon, PlusIcon }                      from '@heroicons/react/24/solid'
import { EllipsisHorizontalIcon }                                                        from '@heroicons/react/20/solid'
import { ChevronDownIcon, DocumentArrowDownIcon, PencilIcon, PlusIcon as PlusIconSmall } from '@heroicons/react/16/solid'
import { formatPhoneNumber }                                                             from 'react-phone-number-input'
import type { PublicCongregationModel, PublisherModel, ServiceGroupModel }               from 'src/types/models'
import { isTemplateCorrect }                                                             from '@renderer/utils/isTemplateCorrect'
import { Heading }                                                                       from '@renderer/components/catalyst/heading'
import { Button }                                                                        from '@renderer/components/catalyst/button'
import { InputGroupSmall, InputSmall }                                                   from '@renderer/components/catalyst/input-small'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow }                 from '@renderer/components/catalyst/table'
import { Badge }                                                                         from '@renderer/components/catalyst/badge'
import { TextLink }                                                                      from '@renderer/components/catalyst/text'
import { Dropdown, DropdownButton, DropdownHeader, DropdownItem, DropdownMenu }          from '@renderer/components/catalyst/dropdown'
import clsx                                                                              from 'clsx'
import MultiSelect                                                                       from 'react-tailwindcss-select'
import ROUTES                                                                            from '../../constants/routes.json'
import EventModal                                                                        from './components/eventModal'

interface publisherTableData {
  publishers: PublisherModel[]
}

interface iFilter {
  text:          string
  appointments:  MultiSelectOption[]
  serviceGroups: MultiSelectOption[]
  firstname:     string
  lastname:      string
  email:         string
  mobile:        string
}

interface MultiSelectOption {
  label: string
  value: string
}

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
  const [sortedPublishers, setSortedPublishers]       = useState<publisherTableData>({
    publishers: [],
  })
  const [sortOrder, setSortOrder]                     = useState<'ASC' | 'DESC'>('ASC')
  const [sortBy, setSortBy]                           = useState<string>('lastname')
  const [expanded, setExpanded]                       = useState<boolean>(false)
  const [sgOptions, SetSgOptions]                     = useState<MultiSelectOption[]>([])
  const [appOptions, _setAppOptions]                  = useState<MultiSelectOption[]>([
    { value: 'PIONEER', label: t('appointment.pioneer') },
    { value: 'ELDER', label: t('appointment.elder') },
    { value: 'MINISTERIALSERVANT', label: t('appointment.ministerialservant') },
    { value: 'SPECIALPIONEER', label: t('appointment.specialpioneer') },
    { value: 'MISSIONARY', label: t('appointment.missionary') },
    { value: 'CIRCUITOVERSEER', label: t('appointment.circuitoverseer') },
  ])

  const [filter, setFilter] = useState<iFilter>({
    text:          '',
    serviceGroups: [],
    firstname:     '',
    lastname:      '',
    appointments:  [],
    email:         '',
    mobile:        '',
  })

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, text: e.target.value })
  }

  const onFilterChange = (column: string, value: string) => {
    setFilter((prevState) => {
      const state   = Object.assign({}, prevState)
      state[column] = value
      return state
    })
  }

  const handleSGFilter = (value: any) => {
    setFilter((prevState) => {
      const state         = Object.assign({}, prevState)
      state.serviceGroups = value
      return state
    })
  }

  const handleAPPFilter = (value: any) => {
    setFilter((prevState) => {
      const state        = Object.assign({}, prevState)
      state.appointments = value
      return state
    })
  }

  const getPublishers = (sortField = 'lastname', queryString = ''): void => {
    window.electron.ipcRenderer
      .invoke('get-publishers', { sortField, queryString })
      .then((result: PublisherModel[]) => {
        setPublishers(result)
      })
  }

  useEffect(() => {
    if (filter.text) {
      setQueryString(filter.text)
    }
    else {
      setQueryString('')
    }

    let sorted: PublisherModel[] = []

    if (sortOrder === 'ASC') {
      sorted = publishers.sort((a, b) => (a[sortBy] || '').localeCompare(b[sortBy] || ''))
    }
    else {
      sorted = publishers.sort((a, b) => (b[sortBy] || '').localeCompare(a[sortBy] || ''))
    }
    if (filter.lastname) {
      sorted = sorted.filter(p => p.lastname.toLowerCase().includes(filter.lastname.toLowerCase()))
    }
    if (filter.firstname) {
      sorted = sorted.filter(p => p.firstname.toLowerCase().includes(filter.firstname.toLowerCase()))
    }
    if (filter.mobile) {
      sorted = sorted.filter(p => p.mobile?.toLowerCase().includes(filter.mobile.toLowerCase()))
    }
    if (filter.email) {
      sorted = sorted.filter(p => p.email?.toLowerCase().includes(filter.email.toLowerCase()))
    }
    if (filter.serviceGroups && filter.serviceGroups.length) {
      const sgs: string[] = filter.serviceGroups.map(sg => sg.value)
      sorted              = sorted.filter(p => sgs.includes(p.serviceGroupId || ''))
    }
    if (filter.appointments && filter.appointments.length) {
      const apps: string[] = filter.appointments.map(sg => sg.value)
      sorted               = sorted.filter(p => p.appointments.some(a => apps.includes(a.type)))
    }

    setSortedPublishers({ ...sortedPublishers, publishers: sorted })
  }, [publishers, sortOrder, sortBy, filter])

  const getServiceGroups = (): void => {
    window.electron.ipcRenderer.invoke('get-serviceGroups').then((result: ServiceGroupModel[]) => {
      setServiceGroups(result)

      const options: MultiSelectOption[] = []
      result.forEach((sg) => {
        if (sg._id) {
          options.push({
            value: sg._id,
            label: sg.name,
          })
        }
      })
      SetSgOptions(options)
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
        <div className="flex w-full justify-between">
          <Heading>{t('publishers.headline')}</Heading>
          <div className="flex w-1/3 space-x-2">
            <div className="grow">
              <InputGroupSmall>
                <MagnifyingGlassIcon />
                <InputSmall name="search" placeholder={t('search')} aria-label="Search" onChange={onTextChange} type="search" />
              </InputGroupSmall>
            </div>
            <Button outline title={t('toggleFilter')} type="button" onClick={() => { setExpanded(!expanded) }}>
              <AdjustmentsHorizontalIcon className="size-6" />
            </Button>
          </div>
          <div title={t('label.addPublisher')}>
            <Button
              onClick={(): void => navigate(ROUTES.PUBLISHER_PERSONAL_FORM)}
              color="blue"
            >
              <PlusIcon className="size-6 text-white" />
              Lägg till
            </Button>
          </div>
        </div>

        <Table bleed dense grid sticky striped className="mt-2 [--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
          <TableHead>
            <TableRow className={clsx(['overflow-hidden transition-all duration-200 ease-out', !expanded && 'hidden'])}>
              <TableCell>
                <MultiSelect
                  placeholder=""
                  isMultiple
                  primaryColor="blue"
                  value={filter.appointments}
                  options={appOptions}
                  onChange={handleAPPFilter}
                  formatOptionLabel={data => (
                    <li
                      className="block cursor-pointer select-none truncate rounded p-2 text-gray-900 transition duration-200 hover:bg-blue-500 hover:text-white dark:text-white"
                      title={data.label}
                    >
                      {data.label}
                    </li>
                  )}
                  classNames={{
                    listItem: () => (
                      'block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded text-gray-900 hover:bg-blue-500 hover:text-white dark:text-white'
                    ),
                    menu:       'absolute z-[500] w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm dark:bg-zinc-800 border border-gray-300 data-[hover]:border-zinc-950/20 dark:border-zinc-600/20 dark:data-[hover]:border-white/20',
                    menuButton: () => (
                      clsx([
                        // Basic layout
                        'relative flex w-full appearance-none rounded-lg',
                        // Typography
                        'text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white',
                        // Border
                        'border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20',
                        // Background color
                        'bg-transparent dark:bg-white/5',
                        // Hide default focus styles
                        'focus:outline-none',
                      ])
                    ),
                    tagItem: () => ('bg-blue-300 border rounded-sm flex space-x-1 pl-1 dark:bg-blue-300 border-blue-400 dark:border-blue-400'),
                  }}
                />
              </TableCell>
              <TableCell>
                <MultiSelect
                  placeholder=""
                  isMultiple
                  primaryColor="blue"
                  value={filter.serviceGroups}
                  options={sgOptions}
                  onChange={handleSGFilter}
                  formatOptionLabel={data => (
                    <li
                      className="block cursor-pointer select-none truncate rounded p-2 text-gray-900 transition duration-200 hover:bg-blue-500 hover:text-white dark:text-white"
                      title={data.label}
                    >
                      {data.label}
                    </li>
                  )}
                  classNames={{
                    listItem: () => (
                      'block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded text-gray-900 hover:bg-blue-500 hover:text-white dark:text-white'
                    ),
                    menu:       'absolute z-[500] w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm dark:bg-zinc-800 border border-gray-300 data-[hover]:border-zinc-950/20 dark:border-zinc-600/20 dark:data-[hover]:border-white/20',
                    menuButton: () => (
                      clsx([
                        // Basic layout
                        'relative flex w-full appearance-none rounded-lg',
                        // Typography
                        'text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white',
                        // Border
                        'border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20',
                        // Background color
                        'bg-transparent dark:bg-white/5',
                        // Hide default focus styles
                        'focus:outline-none',
                      ])
                    ),
                    tagItem: () => ('bg-blue-300 border rounded-sm flex space-x-1 pl-1 dark:bg-blue-300 border-blue-400 dark:border-blue-400'),
                  }}
                />
              </TableCell>
              <TableCell><InputSmall name="lastname" onChange={e => onFilterChange('lastname', e.target.value)} /></TableCell>
              <TableCell><InputSmall name="firstname" onChange={e => onFilterChange('firstname', e.target.value)} /></TableCell>
              <TableCell><InputSmall name="mobile" onChange={e => onFilterChange('mobile', e.target.value)} /></TableCell>
              <TableCell><InputSmall name="email" onChange={e => onFilterChange('email', e.target.value)} /></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableHeader></TableHeader>
              <TableHeader>
                <div className="flex justify-between">
                  {t('publishers.header.group')}
                </div>
              </TableHeader>
              <TableHeader onClick={() => { setSortBy('lastname') }}>
                <div className="flex justify-between">
                  {t('publishers.header.lastname')}
                  <ChevronDownIcon
                    onClick={() => {
                      setSortOrder((val) => {
                        return val === 'ASC'
                          ? 'DESC'
                          : 'ASC'
                      })
                    }}
                    className={clsx([
                      'size-5 transition-transform duration-200 ease-out hover:opacity-90',
                      (sortBy !== 'lastname') && 'opacity-25',
                      (sortBy === 'lastname' && sortOrder === 'DESC') && 'rotate-180',
                    ])}
                  />
                </div>
              </TableHeader>
              <TableHeader onClick={() => { setSortBy('firstname') }}>
                <div className="flex justify-between">
                  {t('publishers.header.firstname')}
                  <ChevronDownIcon
                    onClick={() => {
                      setSortOrder((val) => {
                        return val === 'ASC'
                          ? 'DESC'
                          : 'ASC'
                      })
                    }}
                    className={clsx([
                      'size-5 transition-transform duration-200 ease-out hover:opacity-90',
                      (sortBy !== 'firstname') && 'opacity-25',
                      (sortBy === 'firstname' && sortOrder === 'DESC') && 'rotate-180',
                    ])}
                  />
                </div>
              </TableHeader>
              <TableHeader onClick={() => { setSortBy('mobile') }}>
                <div className="flex justify-between">
                  {t('publishers.header.mobile')}
                  <ChevronDownIcon
                    onClick={() => {
                      setSortOrder((val) => {
                        return val === 'ASC'
                          ? 'DESC'
                          : 'ASC'
                      })
                    }}
                    className={clsx([
                      'size-5 transition-transform duration-200 ease-out hover:opacity-90',
                      (sortBy !== 'mobile') && 'opacity-25',
                      (sortBy === 'mobile' && sortOrder === 'DESC') && 'rotate-180',
                    ])}
                  />
                </div>
              </TableHeader>
              <TableHeader onClick={() => { setSortBy('email') }}>
                <div className="flex justify-between">
                  {t('publishers.header.email')}
                  <ChevronDownIcon
                    onClick={() => {
                      setSortOrder((val) => {
                        return val === 'ASC'
                          ? 'DESC'
                          : 'ASC'
                      })
                    }}
                    className={clsx([
                      'size-5 transition-transform duration-200 ease-out hover:opacity-90',
                      (sortBy !== 'email') && 'opacity-25',
                      (sortBy === 'email' && sortOrder === 'DESC') && 'rotate-180',
                    ])}
                  />
                </div>
              </TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody data-sort={`${sortBy}-${sortOrder}`}>
            {sortedPublishers.publishers.map((publisher) => {
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
                  <TableCell>{publisher.lastname}</TableCell>
                  <TableCell>{publisher.firstname}</TableCell>
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
