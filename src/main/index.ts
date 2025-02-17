import os                                                                      from 'node:os'
import { join }                                                                from 'node:path'
import { BrowserWindow, Notification, app, clipboard, dialog, ipcMain, shell } from 'electron'
import { electronApp, is, optimizer }                                          from '@electron-toolkit/utils'
import { autoUpdater }                                                         from 'electron-updater'
import windowStateKeeper                                                       from 'electron-window-state'
import prompt                                                                  from 'electron-prompt'
import log                                                                     from 'electron-log'
import fs                                                                      from 'fs-extra'
// import Bugsnag                                        from '@bugsnag/electron'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import schedule                                    from 'node-schedule'
import icon                                        from '../../resources/icon.png?asset'
import i18n                                        from '../localization/i18next.config'
import type {
  AuxiliaryModel,
  CircuitOverseerModel,
  OrganizationModel,
  PublicCongregationModel,
  PublisherModel,
  Report,
  ResponsibilityModel,
  ServiceGroupModel,
  SettingsModel,
  TaskModel,
} from '../types/models'
import MenuBuilder            from './menu'
import ServiceYearService     from './services/serviceYearService'
import ServiceMonthService    from './services/serviceMonthService'
import SettingsService        from './services/settingsService'
import PublisherService       from './services/publisherService'
import ServiceGroupService    from './services/serviceGroupService'
import ResponsibilityService  from './services/responsibilityService'
import ExportService          from './services/exportService'
import TaskService            from './services/taskService'
import CircuitOverseerService from './services/circuitOverseerService'
import AuxiliaryService       from './services/auxiliaryService'
import TemplateService        from './services/templateService'
import migrateDatabase        from './migrateDatabase'
import {
  addMonths,
  closeReporting,
  dbBackup,
  dbRestore,
  deleteApplication,
  deleteMailResponse,
  exportActiveApplications,
  exportAddressList,
  exportAddressListEmergency,
  exportCompletionList,
  exportCongregationS21,
  exportExtendedRegisterCard,
  exportExtendedRegisterCards,
  exportMembersDocument,
  exportNameList,
  exportOrganizationSchema,
  exportPublisherS21,
  exportPublishersList,
  exportPublishersS21,
  exportRegularParticipantDocument,
  exportReportSummary,
  exportS88,
  exportServiceGroupList,
  exportSpiritualStatusLst,
  exportVotingList,
  fixMailResponse,
  generateXLSXReportForms,
  getCommonExports,
  getCommunications,
  getMailResponses,
  getMonthString,
  getPublisherStatus,
  getPublishersStats,
  getPublishersWithOldApplications,
  getPublishersWithoutServiceGroup,
  getReportUpdates,
  importJson,
  importServiceReports,
  importTemplate,
  renewApplication,
  startReporting,
  storeEvent,
  updateSettings,
} from './functions'
import getServiceYear                              from './utils/getServiceYear'
import ImportantDateService                        from './services/importantDateService'
import ExportServiceGroupInternalList              from './functions/exportServiceGroupInternalList'
import generateIdentifier                          from './utils/generateIdentifier'
import getSortOrder                                from './utils/getSortOrder'
import ExportAuxiliariesList                       from './functions/exportAuxiliariesList'
import importS21                                   from './functions/importS21'
import importExcel                                 from './functions/importExcel'
import GetInformationResponses                     from './functions/getInformation'
import DeleteInformation                           from './functions/deleteInformation'
import OrganizationService                         from './services/organizationService'
import forceUpdateReport                           from './functions/forceUpdateReport'
import getAllReportsFromServer                     from './functions/getAllReportFromServer'
import exportExtendedRegisterCardsDisfellowshipped from './functions/exportExtendedRegisterCardsDisfellowshipped'
import exportAddressListDisfellowshipped           from './functions/exportAddressListDisfellowshipped'
import getRandomInt                                from './utils/getRandomInt'

// Initialize services
const circuitOverseerService = new CircuitOverseerService()
const exportService          = new ExportService()
const publisherService       = new PublisherService()
const responsibiltyService   = new ResponsibilityService()
const serviceGroupService    = new ServiceGroupService()
const serviceYearService     = new ServiceYearService()
const serviceMonthService    = new ServiceMonthService()
const settingsService        = new SettingsService()
const taskService            = new TaskService()
const auxiliaryService       = new AuxiliaryService()
const templateService        = new TemplateService()
const importantDateService   = new ImportantDateService()
const organizationService    = new OrganizationService()

const isDebug
  // eslint-disable-next-line node/prefer-global/process
  = import.meta.env.MAIN_VITE_NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

let mainWindow: BrowserWindow | null = null
let menuBuilder: MenuBuilder | null  = null

if (isDebug) {
  log.transports.console.level = 'info'
  log.transports.file.level    = 'info'
  log.info('In development mode')
}
else {
  log.transports.console.level = false
  log.transports.file.level    = 'info'
}

autoUpdater.checkForUpdatesAndNotify()

async function createWindow(): Promise<void> {
  if (isDebug) {
    try {
      installExtension([REACT_DEVELOPER_TOOLS], {
        loadExtensionOptions: {
          allowFileAccess: true,
        },
      })
        .then(([ext]) => log.info(`Added Extension:  ${ext.name}`))
        .catch(err => log.info('An error occurred: ', err))
    }
    catch (error) {
      log.error('An error occurred: ', error)
    }
  }

  const mainWindowState = windowStateKeeper({
    defaultWidth:  1200,
    defaultHeight: 1024,
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x:              mainWindowState.x,
    y:              mainWindowState.y,
    width:          mainWindowState.width,
    height:         mainWindowState.height,
    show:           false,
    title:          'SECRETARY',
    // eslint-disable-next-line node/prefer-global/process
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  menuBuilder = new MenuBuilder(mainWindow)

  if (isDebug)
    mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow)
      throw new Error('"mainWindow" is not defined')

    migrateDatabase()

    mainWindow.show()

    // Let us register listeners on the window, so we can update the state
    // automatically (the listeners will be removed when the window is closed)
    // and restore the maximized or full screen state
    mainWindowState.manage(mainWindow)
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.setTitle(`Secretary ${import.meta.env.MAIN_VITE_APP_VERSION || app.getVersion()}`)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  // eslint-disable-next-line node/prefer-global/process
  if (is.dev && process.env.ELECTRON_RENDERER_URL)
    // eslint-disable-next-line node/prefer-global/process
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)

  else
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  // electronApp.setAppUserModelId('com.electron')
  electronApp.setAppUserModelId('se.bjorkgard.secretary')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})

app.on('ready', () => {
  getReportUpdates(mainWindow)
  getCommunications()

  setInterval(() => {
    getReportUpdates(mainWindow)
  }, 600000) // every 10 minute (600000)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  schedule.gracefulShutdown()

  // eslint-disable-next-line node/prefer-global/process
  if (process.platform !== 'darwin')
    app.quit()
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// Set up necessary bindings to update the menu items
// based on the current language selected
i18n.on('initialized', async () => {
  const settings = await settingsService.find()
  i18n.changeLanguage(settings?.congregation.locale || 'sv')

  i18n.off('initialized')

  // Schedule start reporting 3 am the first of every month (00 03 1 * *)
  if (settings?.automation) {
    schedule.scheduleJob(`${getRandomInt(0, 59)} ${getRandomInt(2, 3)} * * *`, (fireDate) => {
      mainWindow?.webContents.send('show-spinner', { status: true })

      startReporting(
        mainWindow,
        serviceGroupService,
        serviceMonthService,
        publisherService,
        settingsService,
        serviceYearService,
        auxiliaryService,
      ).then(() => {
        // Send to renderer process (missingReports, activeReports) to update the dashboard
        mainWindow?.webContents.send('updated-reports')

        new Notification({
          title: 'SECRETARY',
          body:  i18n.t('reports.autoStarted.body', { time: new Date().toLocaleString() }),
        }).show()
      }).finally(() => {
        mainWindow?.webContents.send('show-spinner', { status: false })
      })

      log.info(`This job was supposed to run at ${fireDate}, but actually ran at ${new Date()}`)
    })
  }
})

// When the i18n framework starts up, this event is called
// (presumably when the default language is initialized)
// BEFORE the "initialized" event is fired - this causes an
// error in the logs. To prevent said error, we only call the
// below code until AFTER the i18n framework has finished its
// "initialized" event.
i18n.on('languageChanged', (lang) => {
  if (i18n.isInitialized) {
    menuBuilder?.buildMenu(i18n)

    mainWindow?.webContents.send('change-translation', {
      language:  lang,
      namespace: 'translation',
      resources: i18n.getResourceBundle(lang, 'translation'),
    })
  }
})

ipcMain.handle('get-initial-translations', () => {
  return {
    language:  'sv',
    namespace: 'translation',
    resources: i18n.getResourceBundle('sv', 'translation'),
  }
})

ipcMain.on('app-quit', () => {
  schedule.gracefulShutdown()
  app.quit()
})

// deprecated import from old secretary 2025-01-09
ipcMain.on('import', () => {
  if (!mainWindow)
    return
  importJson(
    mainWindow,
    serviceGroupService,
    publisherService,
    serviceMonthService,
    serviceYearService,
    auxiliaryService,
    settingsService,
  )
})

ipcMain.on('import-s21', async () => {
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  const publishers = (await publisherService.find('lastname')).map((pub) => {
    return (
      {
        id:   pub._id,
        name: `${pub.lastname}, ${pub.firstname}`,
      }
    )
  })

  mainWindow?.webContents.send('show-publishers-for-import', { publishers })
})

ipcMain.on('import-s21-complete', async (_, args: { publisher: string | null }) => {
  if (!mainWindow)
    return

  importS21(mainWindow, args.publisher)
})

ipcMain.on('import-excel', () => {
  if (!mainWindow)
    return

  importExcel(mainWindow)
})

ipcMain.handle('registration', async (_, param: SettingsModel) => {
  // register online
  const options = {
    method:  'POST',
    headers: {
      'Accept':        'application/json',
      'Content-Type':  'application/json;charset=UTF-8',
      'Authorization': `Bearer ${import.meta.env.MAIN_VITE_TOKEN}`,
    },
    body: JSON.stringify({
      name:            `${param.user.firstname} ${param.user.lastname}`,
      email:           param.user.email,
      device_platform: os.platform(),
    }),
  }

  await fetch(`${import.meta.env.MAIN_VITE_API}/register`, options)
    .then(response => response.json())
    .then((data) => {
      param.token = data.token
    })
    .catch((error) => {
      log.error(error)
      const responseErrorOptions = {
        type:      'error' as const,
        buttons:   ['OK'],
        defaultId: 0,
        title:     'Okänt fel',
        message:   'Okänt fel',
        detail:    `Det gick inte att registrera dig. Var vänlig och försök om en stund igen. ${error.message}`,
      }

      if (mainWindow) {
        dialog.showMessageBox(mainWindow, responseErrorOptions).then(() => {
          app.quit()
        })
      }

      return null
    })

  return await settingsService.create(param)
})

ipcMain.handle('get-organization', async () => {
  return await organizationService.find()
})

ipcMain.handle('update-organization', async (_, data: OrganizationModel) => {
  return await organizationService.update(data._id || '', data)
})

ipcMain.handle('get-settings', async () => {
  return await settingsService.find()
})

ipcMain.handle('update-settings', async (_, data: SettingsModel) => {
  return updateSettings(settingsService, data)
})

ipcMain.handle('get-serviceYears', async () => {
  return await serviceYearService.find()
})

ipcMain.handle('get-serviceMonths', async () => {
  return await serviceMonthService.find()
})

ipcMain.handle('get-serviceMonths-by-ids', async (_, args: { ids: string[] }) => {
  return await serviceMonthService.findByIds(args.ids)
})

ipcMain.handle('get-circuitOverseer', async () => {
  return await circuitOverseerService.find()
})

ipcMain.handle('update-circuitOverseer', async (_, data: CircuitOverseerModel) => {
  return await circuitOverseerService.upsert(data)
})

ipcMain.handle('get-contacts', async () => {
  return await publisherService.findContacts()
})

ipcMain.handle('get-all-publishers', async (_, args: { sortfield: string, queryString: string }) => {
  return await publisherService.findAll(args.sortfield, args.queryString)
})

ipcMain.handle('get-publishers', async (_, args: { sortfield: string, queryString: string }) => {
  return await publisherService.find(args.sortfield, args.queryString)
})

ipcMain.handle('get-publisher', async (_, id: string) => {
  return await publisherService.findOneById(id)
})

ipcMain.handle('get-publishersByIds', async (_, args: { ids: string[] }) => {
  return await publisherService.findByIds(args.ids)
})

ipcMain.handle('create-publisher', async (_, param: PublisherModel) => {
  return await publisherService.create(param)
})

ipcMain.handle('update-publisher', async (_, param: PublisherModel) => {
  if (param._id) {
    if (param.contact)
      publisherService.updateAddressOnFamilyMembers(param)

    return await publisherService.update(param._id, param)
  }

  return null
})

// SERVICE GROUPS
ipcMain.handle('get-serviceGroup', async (_, id: string) => {
  return await serviceGroupService.findOneById(id)
})

ipcMain.handle('get-serviceGroups', async () => {
  return await serviceGroupService.find()
})

ipcMain.handle('create-serviceGroup', async (_, param: ServiceGroupModel) => {
  return await serviceGroupService.create(param)
})

ipcMain.handle('update-serviceGroup', async (_, param: ServiceGroupModel) => {
  if (param._id)
    return await serviceGroupService.update(param._id, param)

  return null
})

ipcMain.handle('delete-serviceGroup', async (_, id) => {
  // Reset group on publishers
  publisherService.resetServiceGroup(id)

  return await serviceGroupService.delete(id)
})

// RESPONSIBILITIES
ipcMain.handle('get-responsibilities', async () => {
  return await responsibiltyService.find()
})

ipcMain.handle('get-responsibility', async (_, id: string) => {
  return await responsibiltyService.findOneById(id)
})

ipcMain.handle('create-responsibility', async (_, param: ResponsibilityModel) => {
  return await responsibiltyService.create(param)
})

ipcMain.handle('update-responsibility', async (_, param: ResponsibilityModel) => {
  if (param._id)
    return await responsibiltyService.update(param._id, param)

  return null
})

ipcMain.handle('delete-responsibility', async (_, id) => {
  return await responsibiltyService.delete(id)
})

// TASKS
ipcMain.handle('get-tasks', async () => {
  return await taskService.find()
})

ipcMain.handle('get-task', async (_, id: string) => {
  return await taskService.findOneById(id)
})

ipcMain.handle('create-task', async (_, param: TaskModel) => {
  return await taskService.create(param)
})

ipcMain.handle('update-task', async (_, param: TaskModel) => {
  if (param._id)
    return await taskService.update(param._id, param)

  return null
})

ipcMain.handle('delete-task', async (_, id) => {
  return await taskService.delete(id)
})

// DASHBOARD
ipcMain.handle('publishers-stats', async () => {
  return getPublishersStats(publisherService)
})

ipcMain.handle('common-exports', async () => {
  return getCommonExports(exportService)
})

ipcMain.handle('temporary-servicegroup', async () => {
  return getPublishersWithoutServiceGroup(serviceGroupService, publisherService)
})

// EXPORTS
ipcMain.on('export-addresslist-alphabetically-xlsx', async () => {
  if (!mainWindow)
    return
  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('ADDRESSLIST_ALPHA', 'XLSX', 'export-addresslist-alphabetically-xlsx')
  exportAddressList(mainWindow, publisherService, 'NAME', 'XLSX')
})

ipcMain.on('export-addresslist-alphabetically-pdf', async () => {
  if (!mainWindow)
    return
  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('ADDRESSLIST_ALPHA', 'PDF', 'export-addresslist-alphabetically-pdf')
  exportAddressList(mainWindow, publisherService, 'NAME', 'PDF')
})

ipcMain.on('export-addresslist-disfellowshipped-pdf', async () => {
  if (!mainWindow)
    return
  mainWindow?.webContents.send('show-spinner', { status: true })

  exportAddressListDisfellowshipped(mainWindow, publisherService, 'PDF')
})

ipcMain.on('export-addresslist-disfellowshipped-xlsx', async () => {
  if (!mainWindow)
    return
  mainWindow?.webContents.send('show-spinner', { status: true })

  exportAddressListDisfellowshipped(mainWindow, publisherService, 'XLSX')
})

ipcMain.on('export-addresslist-group-xlsx', async () => {
  if (!mainWindow)
    return
  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('ADDRESSLIST_GROUP', 'XLSX', 'export-addresslist-group-xlsx')
  exportAddressList(mainWindow, publisherService, 'GROUP', 'XLSX')
})

ipcMain.on('export-addresslist-group-pdf', async () => {
  if (!mainWindow)
    return
  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('ADDRESSLIST_GROUP', 'PDF', 'export-addresslist-group-pdf')
  exportAddressList(mainWindow, publisherService, 'GROUP', 'PDF')
})

ipcMain.on('export-addresslist-group-emergency-pdf', async () => {
  if (!mainWindow)
    return
  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('ADDRESSLIST_GROUP_EMERGENCY', 'PDF', 'export-addresslist-group-emergency-pdf')
  exportAddressListEmergency(mainWindow, publisherService, 'GROUP', 'PDF')
})

ipcMain.on('export-addresslist-group-emergency-xlsx', async () => {
  if (!mainWindow)
    return
  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('ADDRESSLIST_GROUP_EMERGENCY', 'XLSX', 'export-addresslist-group-emergency-xlsx')
  exportAddressListEmergency(mainWindow, publisherService, 'GROUP', 'XLSX')
})

ipcMain.on('export-regular-participants', async () => {
  if (!mainWindow)
    return
  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('REGULAR_PARTICIPANTS', 'DOCX', 'export-regular-participants')
  exportRegularParticipantDocument(mainWindow, publisherService)
})

ipcMain.on('export-voting-list', async () => {
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('VOTING_LIST', 'PDF', 'export-voting-list')
  exportVotingList(mainWindow, publisherService)
})

ipcMain.on('export-members', async () => {
  if (!mainWindow)
    return
  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('MEMBERS', 'DOCX', 'export-members')
  exportMembersDocument(mainWindow, publisherService)
})

ipcMain.on('export-organization-schema', async (_event, args) => {
  if (!mainWindow)
    return
  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('ORGANIZATION_SCHEMA', args.type, 'export-organization-schema')
  exportOrganizationSchema(mainWindow, publisherService, args.type)
})

ipcMain.on('export-namelist', async (_event, args) => {
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('NAMELIST', args.type, 'export-namelist')

  exportNameList(mainWindow, publisherService, args.type)
})

ipcMain.on('export-needs-completions', async () => {
  if (!mainWindow)
    return
  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('COMPLETIONS', 'PDF', 'export-needs-completions')
  exportCompletionList(mainWindow, publisherService)
})

ipcMain.on('export-meeting-attendance', async (_event, args) => {
  if (!mainWindow)
    return
  mainWindow?.webContents.send('show-spinner', { status: true })

  let sy: number[] = []

  await serviceYearService.find().then((serviceYears) => {
    serviceYears.forEach((serviceYear) => {
      sy.push(serviceYear.name)
    })
  })

  if (args.type === 'latest')
    sy = sy.reverse().slice(0, 2)

  sy.sort()

  exportS88(mainWindow, sy)
})

ipcMain.on('export-auxiliary-list', async (_event) => {
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  const sm: string[] = []
  auxiliaryService.find().then((auxiliaries) => {
    auxiliaries.forEach((auxiliary) => {
      sm.push(auxiliary.serviceMonth)
    })
  })
  sm.sort((a, b) => (a > b ? -1 : 1))

  prompt({
    title:         i18n.t('dialog.selectServiceMonth'),
    label:         i18n.t('dialog.selectServiceMonthDescription'),
    type:          'select',
    selectOptions: sm,
    alwaysOnTop:   true,
    buttonLabels:  { cancel: i18n.t('label.cancel'), ok: i18n.t('label.ok') },
    resizable:     true,
  })
    .then(async (r: number | null) => {
      if (r !== null) {
        if (mainWindow) {
          const auxiliaryMonth = await auxiliaryService.findByServiceMonth(sm[r])
          ExportAuxiliariesList(mainWindow, publisherService, auxiliaryMonth?.publisherIds, auxiliaryMonth?.name)
        }
      }
      else {
        mainWindow?.webContents.send('show-spinner', { status: false })
      }
    })
    .catch((err: Error) => {
      mainWindow?.webContents.send('show-spinner', { status: false })
      log.error(err)
    })
})

ipcMain.on('export-register-card-congregation', async (_event) => {
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  const sy: string[] = []

  serviceYearService.find().then((serviceYears) => {
    serviceYears.forEach((serviceYear) => {
      sy.push(serviceYear.name.toString())
    })
  })

  sy.sort((a, b) => (a > b ? -1 : 1))

  prompt({
    title:         i18n.t('dialog.selectServiceYear'),
    label:         i18n.t('dialog.selectServiceYearDescription'),
    type:          'select',
    selectOptions: sy,
    alwaysOnTop:   true,
    buttonLabels:  { cancel: i18n.t('label.cancel'), ok: i18n.t('label.ok') },
    resizable:     true,
  })
    .then((r: number | null) => {
      if (r !== null) {
        if (mainWindow)
          exportCongregationS21(mainWindow, +sy[r])
      }
      else {
        mainWindow?.webContents.send('show-spinner', { status: false })
      }
    })
    .catch((err: Error) => {
      mainWindow?.webContents.send('show-spinner', { status: false })
      log.error(err)
    })
})

ipcMain.on('export-spiritual-status', async (_event, args) => {
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('SPIRITUAL_STATUS_LIST', args.type, 'export-spiritual-status')
  exportSpiritualStatusLst(mainWindow, settingsService, serviceGroupService, publisherService, args.type)
})

ipcMain.on('export-serviceGroups-internal-list', async (_event, args) => {
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('SERVICEGROUP_INTERNAL_LIST', args.type, 'export-serviceGroups-internal-list')
  ExportServiceGroupInternalList(mainWindow, settingsService, serviceGroupService, publisherService, args.type)
})

ipcMain.on('export-serviceGroups-list', async (_event, args) => {
  // This function is used to get all inactive publishers and send to the renderer
  // to be able to select which publishers to include in the export
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  const inactivePublishers = (await publisherService.findByStatus(['INACTIVE'])).map((pub) => {
    return (
      {
        id:   pub._id,
        name: `${pub.firstname} ${pub.lastname}`,
      }
    )
  })

  mainWindow?.webContents.send('show-inactive-for-servicegroups', { inactives: inactivePublishers, type: args.type })
})

ipcMain.on('export-service-groups', async (_event, args) => {
  // This function is used to export the service groups list with the selected inactive publishers from args
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('SERVICEGROUP_LIST', args.type, 'export-serviceGroups-list')
  exportServiceGroupList(mainWindow, settingsService, serviceGroupService, publisherService, args.type, args.inactives)
})

ipcMain.on('export-register-card', async (_event, args) => {
  if (!mainWindow)
    return
  mainWindow?.webContents.send('show-spinner', { status: true })

  const sy: string[] = []

  serviceYearService.find().then((serviceYears) => {
    serviceYears.forEach((serviceYear) => {
      sy.push(serviceYear.name.toString())
    })
  })

  sy.sort().reverse()

  prompt({
    title:         i18n.t('dialog.selectServiceYear'),
    label:         i18n.t('dialog.selectServiceYearDescription'),
    type:          'select',
    selectOptions: sy,
    alwaysOnTop:   true,
    buttonLabels:  { cancel: i18n.t('label.cancel'), ok: i18n.t('label.ok') },
    resizable:     true,
  })
    .then((r: number | null) => {
      if (r !== null) {
        if (mainWindow)
          exportPublishersS21(mainWindow, +sy[r], args.type)
      }
      else {
        mainWindow?.webContents.send('show-spinner', { status: false })
      }
    })
    .catch((err: Error) => {
      mainWindow?.webContents.send('show-spinner', { status: false })
      log.error(err)
    })
})

ipcMain.on('export-extended-register-card', async (_event, args) => {
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  exportExtendedRegisterCard(mainWindow, args)
})

ipcMain.on('export-extended-register-cards-disfellowshipped', async (_event) => {
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  exportExtendedRegisterCardsDisfellowshipped(mainWindow)
})

ipcMain.on('export-extended-register-cards', async (_event) => {
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  exportExtendedRegisterCards(mainWindow)
})

ipcMain.on('export-extended-register-cards-servicegroup', async (_event) => {
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  const sg: string[]   = []
  const sgId: string[] = []
  const splitDate      = new Date().toLocaleDateString('sv').split('-')

  const serviceYear = await serviceYearService.findByServiceYear(getServiceYear(`${splitDate[0]}-${splitDate[1]}`))

  if (!serviceYear)
    return

  serviceGroupService.find().then((serviceGroups) => {
    serviceGroups.forEach((serviceGroup) => {
      sg.push(serviceGroup.name)
      sgId.push(serviceGroup._id || '')
    })
  })

  sg.sort()

  prompt({
    title:         i18n.t('dialog.selectServiceGroup'),
    label:         i18n.t('dialog.selectServiceGroupDescription'),
    type:          'select',
    selectOptions: sg,
    alwaysOnTop:   true,
    buttonLabels:  { cancel: i18n.t('label.cancel'), ok: i18n.t('label.ok') },
    resizable:     true,
  })
    .then((r: number | null) => {
      if (r !== null) {
        if (mainWindow)
          exportExtendedRegisterCards(mainWindow, sgId[r])
      }
      else {
        mainWindow?.webContents.send('show-spinner', { status: false })
      }
    })
    .catch((err: Error) => {
      mainWindow?.webContents.send('show-spinner', { status: false })
      log.error(err)
    })
})

ipcMain.on('export-register-card-servicegroup', async (_event, args) => {
  if (!mainWindow)
    return
  mainWindow?.webContents.send('show-spinner', { status: true })

  const sy: string[]   = []
  const sg: string[]   = []
  const sgId: string[] = []

  await serviceYearService.find().then((serviceYears) => {
    serviceYears.forEach((serviceYear) => {
      sy.push(serviceYear.name.toString())
    })
    sy.sort((a, b) => (a > b ? -1 : 1))
  })

  if (!sy.length) {
    const newSplitDate   = new Date(new Date().setDate(0)).toLocaleDateString('sv').split('-')
    const newServiceYear = await serviceYearService.findByServiceYear(getServiceYear(`${newSplitDate[0]}-${newSplitDate[1]}`))

    if (!newServiceYear) {
      mainWindow?.webContents.send('show-spinner', { status: false })
      return
    }
    else {
      sy.push(newServiceYear.name.toString())
    }
  }

  serviceGroupService.find().then((serviceGroups) => {
    serviceGroups.forEach((serviceGroup) => {
      sg.push(serviceGroup.name)
      sgId.push(serviceGroup._id || '')
    })
  })

  sg.sort()

  prompt({
    title:         i18n.t('dialog.selectServiceGroup'),
    label:         i18n.t('dialog.selectServiceGroupDescription'),
    type:          'select',
    selectOptions: sg,
    alwaysOnTop:   true,
    buttonLabels:  { cancel: i18n.t('label.cancel'), ok: i18n.t('label.ok') },
    resizable:     true,
  })
    .then((r: number | null) => {
      if (r !== null) {
        prompt({
          title:         i18n.t('dialog.selectServiceYear'),
          label:         i18n.t('dialog.selectServiceYearDescription'),
          type:          'select',
          selectOptions: sy,
          alwaysOnTop:   true,
          buttonLabels:  { cancel: i18n.t('label.cancel'), ok: i18n.t('label.ok') },
          resizable:     true,
        })
          .then((sr: number | null) => {
            if (sr !== null) {
              if (mainWindow)
                exportPublishersS21(mainWindow, +sy[sr], args.type, sgId[r])
            }
            else {
              mainWindow?.webContents.send('show-spinner', { status: false })
            }
          })
          .catch((err: Error) => {
            mainWindow?.webContents.send('show-spinner', { status: false })
            log.error(err)
          })
      }
      else {
        mainWindow?.webContents.send('show-spinner', { status: false })
      }
    })
    .catch((err: Error) => {
      mainWindow?.webContents.send('show-spinner', { status: false })
      log.error(err)
    })
})

// REPORTS
ipcMain.handle('active-service-month', async () => {
  const serviceMonth = await serviceMonthService.findActive()

  return serviceMonth
})

ipcMain.handle('current-service-month', async () => {
  const date = new Date()
  date.setDate(0)
  const monthString = date.getMonth() + 1

  const serviceMonth = await serviceMonthService.findByServiceMonth(
    `${date.getFullYear()}-${monthString < 10 ? '0' : ''}${monthString}`,
  )

  return serviceMonth
})

ipcMain.handle('start-reporting', async () => {
  mainWindow?.webContents.send('show-spinner', { status: true })

  return startReporting(
    mainWindow,
    serviceGroupService,
    serviceMonthService,
    publisherService,
    settingsService,
    serviceYearService,
    auxiliaryService,
  )
})

ipcMain.handle('force-update-reports', async () => {
  mainWindow?.webContents.send('show-spinner', { status: true })

  return forceUpdateReport(
    mainWindow,
    serviceGroupService,
    serviceMonthService,
    publisherService,
    settingsService,
  )
})

ipcMain.handle('close-reporting', async () => {
  mainWindow?.webContents.send('show-spinner', { status: true })

  return closeReporting(
    mainWindow,
    serviceYearService,
    serviceMonthService,
    publisherService,
    settingsService,
    auxiliaryService,
  )
})

ipcMain.handle('save-meetings', async (_, props) => {
  return serviceMonthService.saveMeetings(props)
})

ipcMain.handle('auxiliaries', async () => {
  const start                         = new Date()
  const firstDay                      = new Date(start.getFullYear(), start.getMonth(), 1)
  const auxiliaries: AuxiliaryModel[] = []

  for (let index = 0; index < 6; index++) {
    const copiedDate = new Date(firstDay.getTime())
    const date       = addMonths(copiedDate, index)

    const tempAux = await auxiliaryService.findByServiceMonth(`${date.getFullYear()}-${getMonthString(date)}`)
    if (tempAux) {
      auxiliaries.push(tempAux)
    }
    else {
      auxiliaries.push({
        _id:          `${date.getFullYear()}-${getMonthString(date)}`,
        name:         date.toLocaleString('default', { month: 'long' }).toLowerCase(),
        serviceMonth: `${date.getFullYear()}-${getMonthString(date)}`,
        publisherIds: [],
        publishers:   [],
      })
    }
  }

  for await (const auxiliary of auxiliaries)
    auxiliary.publishers = await publisherService.findByIds(auxiliary.publisherIds)

  return auxiliaries
})

ipcMain.handle('add-auxiliary', async (_, props) => {
  const name      = props.serviceMonth.split('-')
  const date      = new Date(Number.parseInt(name[0]), Number.parseInt(name[1]) - 1, 1)
  const auxiliary = await auxiliaryService.upsert({
    ...props,
    name: date.toLocaleString('default', { month: 'long' }).toLowerCase(),
  })

  if (auxiliary._id && !auxiliary.publisherIds.includes(props.publisher)) {
    auxiliary.publisherIds.push(props.publisher)
    return await auxiliaryService.update(auxiliary._id, auxiliary)
  }

  return null
})

ipcMain.handle('remove-auxiliary', async (_, props) => {
  const auxiliaries = await auxiliaryService.findByServiceMonth(props.serviceMonth)

  if (auxiliaries?._id) {
    const index = auxiliaries.publisherIds.indexOf(props.publisher)
    if (index > -1) {
      auxiliaries.publisherIds.splice(index, 1)
      return await auxiliaryService.update(auxiliaries._id, auxiliaries)
    }
  }

  return null
})

ipcMain.handle('delete-report', async (_, args) => {
  return publisherService.deleteReport(args.publisherId, args.identifier)
})

ipcMain.handle('save-report', async (_, report) => {
  const settings = await settingsService.find()
  let newReport  = report

  if (report.studies && report.studies !== '')
    newReport = { ...newReport, studies: Number.parseInt(report.studies) }

  else
    newReport = { ...newReport, studies: undefined }

  if (report.hours && report.hours !== '')
    newReport = { ...newReport, hours: Number.parseInt(report.hours) }

  else
    newReport = { ...newReport, hours: undefined }

  if (settings?.online.send_report_group || settings?.online.send_report_publisher) {
    const options = {
      method:  'PUT',
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization':
          `Bearer ${await settingsService.token()}` || import.meta.env.MAIN_VITE_TOKEN,
      },
      body: JSON.stringify(newReport),
    }
    fetch(`${import.meta.env.MAIN_VITE_API}/reports/update`, options)
  }

  return serviceMonthService.saveReport(newReport)
})

ipcMain.handle('add-publisher-report', async (_, args) => {
  let newReport: Report = args.report

  const sm   = newReport.serviceMonth.split('-')
  const date = new Date(Number(sm[0]), Number(sm[1]) - 1, 1)  // -1 because months are 0-based

  newReport = { ...newReport, hasBeenInService: args.report.hasBeenInService === 'YES' }
  newReport = { ...newReport, hasNotBeenInService: args.report.hasBeenInService === 'NO' }

  if (args.report.studies && args.report.studies !== '')
    newReport = { ...newReport, studies: Number.parseInt(args.report.studies) }

  else
    newReport = { ...newReport, studies: undefined }

  if (args.report.hours && args.report.hours !== '')
    newReport = { ...newReport, hours: Number.parseInt(args.report.hours) }

  else
    newReport = { ...newReport, hours: undefined }

  if (args.report.pioneer)
    newReport = { ...newReport, type: 'PIONEER' }

  if (args.report.specialPioneer)
    newReport = { ...newReport, type: 'SPECIALPIONEER' }

  if (args.report.missionary)
    newReport = { ...newReport, type: 'MISSIONARY' }

  newReport = { ...newReport, serviceYear: getServiceYear(newReport.serviceMonth) }
  newReport = { ...newReport, sortOrder: getSortOrder(newReport.serviceMonth) }
  newReport = { ...newReport, name: date.toLocaleString('default', { month: 'long' }).toLowerCase() }
  newReport = { ...newReport, identifier: generateIdentifier() }

  return publisherService.addReport(args.publisherId, newReport).then(async () => {
    if (newReport.addToActive) {
      const serviceMonth = await serviceMonthService.findActive()
      log.info('serviceMonth', serviceMonth?._id)
      if (serviceMonth && serviceMonth._id) {
        await publisherService.findOneById(args.publisherId).then((publisher) => {
          if (publisher.status === 'ACTIVE' || publisher.status === 'IRREGULAR' || publisher.status === 'INACTIVE') {
            newReport.publisherId             = publisher._id
            newReport.publisherName           = `${publisher.lastname}, ${publisher.firstname}`
            newReport.publisherEmail          = publisher.email
            newReport.publisherMobile         = publisher.mobile
            newReport.publisherServiceGroupId = publisher.serviceGroupId
            newReport.publisherStatus         = publisher.status
            newReport.publisherSendEmail      = publisher.sendReports
          }
        })

        delete newReport.addToActive

        serviceMonth.reports.push(newReport)
        await serviceMonthService.update(serviceMonth._id, serviceMonth)
      }
    }
  })
})

ipcMain.handle('update-publisher-report', async (_, args) => {
  let newReport: Report = args.report

  const sm   = newReport.serviceMonth.split('-')
  const date = new Date(Number(sm[0]), Number(sm[1]) - 1, 1)  // -1 because months are 0-based

  newReport = { ...newReport, name: date.toLocaleString('default', { month: 'long' }).toLowerCase() }
  newReport = { ...newReport, hasBeenInService: args.report.hasBeenInService === 'YES' }
  newReport = { ...newReport, hasNotBeenInService: args.report.hasBeenInService === 'NO' }

  if (args.report.studies && args.report.studies !== '')
    newReport = { ...newReport, studies: Number.parseInt(args.report.studies) }

  else
    newReport = { ...newReport, studies: undefined }

  if (args.report.hours && args.report.hours !== '')
    newReport = { ...newReport, hours: Number.parseInt(args.report.hours) }

  else
    newReport = { ...newReport, hours: undefined }

  if (args.report.pioneer)
    newReport = { ...newReport, type: 'PIONEER' }

  if (args.report.specialPioneer)
    newReport = { ...newReport, type: 'SPECIALPIONEER' }

  if (args.report.missionary)
    newReport = { ...newReport, type: 'MISSIONARY' }

  const status = await getPublisherStatus(args.publisherId, newReport)

  return publisherService.saveReport(args.publisherId, newReport, status)
})

ipcMain.handle('generate-excel-report-forms', async (_, serviceMonthId) => {
  if (!mainWindow)
    return

  generateXLSXReportForms(mainWindow, serviceGroupService, serviceMonthService, serviceMonthId)
})

ipcMain.handle('export-report-summary', async (_, args) => {
  if (!mainWindow)
    return

  await exportReportSummary(
    mainWindow,
    serviceMonthService,
    settingsService,
    args.serviceMonth,
  )
})

ipcMain.handle('import-service-reports', async () => {
  if (!mainWindow)
    return

  importServiceReports(mainWindow, serviceMonthService)
})

ipcMain.on('export-s21', async (_, publisherId) => {
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  exportPublisherS21(mainWindow, publisherId)
})

ipcMain.handle('template-exists', async (_, args) => {
  return fs.existsSync(args.path)
})

ipcMain.handle('get-templates', async () => {
  const templates = await templateService.find()

  return templates
})

ipcMain.handle('get-template', async (_, props) => {
  const template = await templateService.findByCode(props.code)

  return template
})

ipcMain.handle('import-template', async (_, args) => {
  if (!mainWindow)
    return

  importTemplate(mainWindow, templateService, args)
})

ipcMain.handle('store-event', async (_, args) => {
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  await storeEvent(mainWindow, args.event)

  mainWindow?.webContents.send('show-spinner', { status: false })
})

ipcMain.on('generate-backup', async () => {
  if (!mainWindow)
    return

  importantDateService.upsert({ type: 'BACKUP' })
  dbBackup(mainWindow)
})

ipcMain.on('restore-backup', async () => {
  if (!mainWindow)
    return

  dbRestore(mainWindow)
})

ipcMain.handle('get-latest-backup', async () => {
  if (!mainWindow)
    return

  const date = await importantDateService.findByType('BACKUP')

  return date
})

ipcMain.handle('get-public-congregations', async () => {
  if (!mainWindow)
    return

  const options = {
    method:  'GET',
    headers: {
      'Accept':       'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization':
        `Bearer ${await settingsService.token()}` || import.meta.env.MAIN_VITE_TOKEN,
    },
  }

  const congregations = await fetch(`${import.meta.env.MAIN_VITE_API}/congregations/public`, options)
    .then(response => response.json())
    .then((response: { data: PublicCongregationModel[] }) => {
      return response.data
    })
    .catch((error) => {
      log.error(error)
    })
    .finally(() => {
      return []
    })

  return congregations
})

ipcMain.handle('resend-serviceGroupForm', async (_, args) => {
  if (!mainWindow)
    return

  const options = {
    method:  'PUT',
    headers: {
      'Accept':       'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization':
        `Bearer ${await settingsService.token()}` || import.meta.env.MAIN_VITE_TOKEN,
    },
  }

  await fetch(`${import.meta.env.MAIN_VITE_API}/serviceGroups/resend/${args.serviceGroupId}`, options)
    .then(response => response.json())
    .catch((error) => {
      log.error(error)
    })
    .finally(() => {
      return []
    })
})

ipcMain.handle('resend-publisher-report', async (_, args) => {
  if (!mainWindow)
    return

  const options = {
    method:  'PUT',
    headers: {
      'Accept':       'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization':
        `Bearer ${await settingsService.token()}` || import.meta.env.MAIN_VITE_TOKEN,
    },
  }

  await fetch(`${import.meta.env.MAIN_VITE_API}/reports/resend/${args.identifier}`, options)
    .then(response => response.json())
    .catch((error) => {
      log.error(error)
    })
    .finally(() => {
      return []
    })
})

ipcMain.handle('get-report-url', async (_, args) => {
  if (!mainWindow)
    return

  const options = {
    method:  'GET',
    headers: {
      'Accept':       'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization':
        `Bearer ${await settingsService.token()}` || import.meta.env.MAIN_VITE_TOKEN,
    },
  }

  const url = await fetch(`${import.meta.env.MAIN_VITE_API}/reports/url/${args.identifier}`, options)
    .then(response => response.json())
    .then((data) => {
      if (data.url) {
        clipboard.writeText(data.url)
        return data.url
      }
      return ''
    })
    .catch((error) => {
      log.error(error)
    })
    .finally(() => {
      return ''
    })

  return url
})

ipcMain.on('export-active-applications', async () => {
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('ACTIVE_APPLICATIONS', 'PDF', 'export-active-applications')
  exportActiveApplications(mainWindow, publisherService)
})

ipcMain.on('export-irregular-list', async () => {
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('IRREGULAR_LIST', 'PDF', 'export-irregular-list')
  exportPublishersList(mainWindow, publisherService, 'IRREGULAR')
})

ipcMain.on('export-inactive-list', async () => {
  if (!mainWindow)
    return

  mainWindow?.webContents.send('show-spinner', { status: true })

  exportService.upsert('INACTIVE_LIST', 'PDF', 'export-inactive-list')
  exportPublishersList(mainWindow, publisherService, 'INACTIVE')
})

ipcMain.handle('get-information', async () => {
  return GetInformationResponses()
})

ipcMain.handle('delete-information', async (_, args) => {
  return DeleteInformation(args.id)
})

ipcMain.handle('get-mail-responses', async () => {
  return getMailResponses()
})

ipcMain.handle('delete-mail-response', async (_, args) => {
  return deleteMailResponse(args.email)
})

ipcMain.handle('fix-mail-response', async (_, args) => {
  return fixMailResponse(args.email)
})

ipcMain.handle('get-inactive-applications', async () => {
  return getPublishersWithOldApplications(publisherService)
})

ipcMain.handle('renew-application', async (_, args) => {
  return renewApplication(args.id, args.type)
})

ipcMain.handle('delete-application', async (_, args) => {
  return deleteApplication(args.id, args.type)
})

ipcMain.handle('force-download-reports', async () => {
  getAllReportsFromServer(mainWindow)
})

ipcMain.handle('get-latest-version', async () => {
  if (!mainWindow)
    return

  let version: string | undefined
  const url = 'https://api.github.com/repos/bjorkgard/secretary-application/releases'

  try {
    const releases = await fetch(url, {
      headers: {
        Authorization: `Bearer ${import.meta.env.MAIN_VITE_PAT}`,
      },
    }).then(_ => _.json())

    for (const release of releases) {
      if (!release.draft) {
        version = release.tag_name
        break
      }

      continue
    }
  }
  catch (error) {
    log.error(error)
  }

  return version
})
