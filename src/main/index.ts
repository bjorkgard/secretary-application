import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import windowStateKeeper from 'electron-window-state'
import log from 'electron-log'
import os from 'os'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import MenuBuilder from './menu'
import i18n from '../localization/i18next.config'
import {
  CircuitOverseerModel,
  PublisherModel,
  ResponsibilityModel,
  ServiceGroupModel,
  SettingsModel,
  TaskModel
} from '../types/models'
import ServiceYearService from './services/serviceYearService'
import ServiceMonthService from './services/serviceMonthService'
import SettingsService from './services/settingsService'
import PublisherService from './services/publisherService'
import ServiceGroupService from './services/serviceGroupService'
import ResponsibilityService from './services/responsibilityService'
import ExportService from './services/exportService'
import TaskService from './services/taskService'
import CircuitOverseerService from './services/circuitOverseerService'
import AuxiliaryService from './services/auxiliaryService'
import TemplateService from './services/templateService'
import migrateDatabase from './migrateDatabase'
import {
  importJson,
  getPublishersStats,
  exportAddressList,
  exportPublisherS21,
  getCommonExports,
  startReporting,
  generateXLSXReportForms,
  importServiceReports,
  updateSettings,
  getReportUpdates,
  closeReporting,
  importTemplate
} from './functions'

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

let mainWindow: BrowserWindow | null = null
let menuBuilder: MenuBuilder | null = null

const installExtensions = async (): Promise<void> => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS']

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(log.error)
}

async function createWindow(): Promise<void> {
  if (isDebug) {
    try {
      await installExtensions()
    } catch (error) {
      log.error('An error occurred: ', error)
    }
  }

  const mainWindowState = windowStateKeeper({
    defaultWidth: 1024,
    defaultHeight: 728
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    show: false,
    title: 'SECRETARY',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  menuBuilder = new MenuBuilder(mainWindow)

  if (isDebug) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }

    migrateDatabase()

    mainWindow.show()

    // Let us register listeners on the window, so we can update the state
    // automatically (the listeners will be removed when the window is closed)
    // and restore the maximized or full screen state
    mainWindowState.manage(mainWindow)
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.setTitle(`Secretary (v${app.getVersion()})`)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('ready', () => {
  getReportUpdates(mainWindow)

  setInterval(() => {
    getReportUpdates(mainWindow)
  }, 600000) // every 10 minute
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// Set up necessary bindings to update the menu items
// based on the current language selected
i18n.on('initialized', async () => {
  const settings = await settingsService.find()
  i18n.changeLanguage(settings?.congregation.locale || 'sv')

  i18n.off('initialized')
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
      language: lang,
      namespace: 'translation',
      resources: i18n.getResourceBundle(lang, 'translation')
    })
  }
})

ipcMain.handle('get-initial-translations', () => {
  return {
    language: 'sv',
    namespace: 'translation',
    resources: i18n.getResourceBundle('sv', 'translation')
  }
})

ipcMain.on('app-quit', () => {
  app.quit()
})

// Initialize services
const circuitOverseerService = new CircuitOverseerService()
const exportService = new ExportService()
const publisherService = new PublisherService()
const responsibiltyService = new ResponsibilityService()
const serviceGroupService = new ServiceGroupService()
const serviceYearService = new ServiceYearService()
const serviceMonthService = new ServiceMonthService()
const settingsService = new SettingsService()
const taskService = new TaskService()
const auxiliaryService = new AuxiliaryService()
const templateService = new TemplateService()

ipcMain.on('import', () => {
  if (!mainWindow) return
  importJson(
    mainWindow,
    serviceGroupService,
    publisherService,
    serviceMonthService,
    serviceYearService,
    auxiliaryService
  )
})

ipcMain.handle('registration', async (_, param: SettingsModel) => {
  // register online
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: 'Bearer ' + import.meta.env.MAIN_VITE_TOKEN
    },
    body: JSON.stringify({
      name: param.user.firstname + ' ' + param.user.lastname,
      email: param.user.email,
      device_platform: os.platform()
    })
  }

  await fetch(`${import.meta.env.MAIN_VITE_API}/register`, options)
    .then((response) => response.json())
    .then((data) => {
      param.token = data.token
    })
    .catch((error) => {
      log.error(error)
      const responseErrorOptions = {
        type: 'error' as const,
        buttons: ['OK'],
        defaultId: 0,
        title: 'Okänt fel',
        message: 'Okänt fel',
        detail: 'Det gick inte att registrera dig. Var vänlig och förösk om en stund igen.'
      }

      if (mainWindow) {
        dialog.showMessageBox(mainWindow, responseErrorOptions).then(() => {
          app.quit()
        })
      }
    })

  return await settingsService.create(param)
})

ipcMain.handle('get-settings', async () => {
  return await settingsService.find()
})

ipcMain.handle('update-settings', async (_, data: SettingsModel) => {
  return updateSettings(settingsService, data)
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

ipcMain.handle('get-publishers', async (_, args: { sortfield: string; queryString: string }) => {
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
    if (param.contact) {
      publisherService.updateAddressOnFamilyMembers(param)
    }
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
  if (param._id) {
    return await serviceGroupService.update(param._id, param)
  }

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
  if (param._id) {
    return await responsibiltyService.update(param._id, param)
  }

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
  if (param._id) {
    return await taskService.update(param._id, param)
  }

  return null
})

ipcMain.handle('delete-task', async (_, id) => {
  return await taskService.delete(id)
})

//DASHBOARD
ipcMain.handle('publishers-stats', async () => {
  return getPublishersStats(publisherService)
})

ipcMain.handle('common-exports', async () => {
  return getCommonExports(exportService)
})

// EXPORTS
ipcMain.on('export-addresslist-alphabetically-xlsx', async () => {
  if (!mainWindow) return

  exportService.upsert('ADDRESSLIST_ALPHA', 'XLSX', 'export-addresslist-alphabetically-xlsx')
  exportAddressList(mainWindow, publisherService, 'NAME', 'XLSX')
})

ipcMain.on('export-addresslist-alphabetically-pdf', async () => {
  if (!mainWindow) return

  exportService.upsert('ADDRESSLIST_ALPHA', 'PDF', 'export-addresslist-alphabetically-pdf')
  exportAddressList(mainWindow, publisherService, 'NAME', 'PDF')
})

ipcMain.on('export-addresslist-group-xlsx', async () => {
  if (!mainWindow) return

  exportService.upsert('ADDRESSLIST_GROUP', 'XLSX', 'export-addresslist-group-xlsx')
  exportAddressList(mainWindow, publisherService, 'GROUP', 'XLSX')
})

ipcMain.on('export-addresslist-group-pdf', async () => {
  if (!mainWindow) return

  exportService.upsert('ADDRESSLIST_GROUP', 'PDF', 'export-addresslist-group-pdf')
  exportAddressList(mainWindow, publisherService, 'GROUP', 'PDF')
})

// REPORTS
ipcMain.handle('active-service-month', async () => {
  const serviceMonth = await serviceMonthService.findActive()

  return serviceMonth
})

ipcMain.handle('current-service-month', async () => {
  const date = new Date()
  date.setDate(0)

  const serviceMonth = await serviceMonthService.findByServiceMonth(
    `${date.getFullYear()}-${date.getMonth() + 1}`
  )

  return serviceMonth
})

ipcMain.handle('start-reporting', async () => {
  return startReporting(
    mainWindow,
    serviceGroupService,
    serviceMonthService,
    publisherService,
    settingsService,
    serviceYearService,
    auxiliaryService
  )
})

ipcMain.handle('close-reporting', async () => {
  return closeReporting(
    mainWindow,
    serviceYearService,
    serviceMonthService,
    publisherService,
    settingsService,
    auxiliaryService
  )
})

ipcMain.handle('save-meetings', async (_, props) => {
  return serviceMonthService.saveMeetings(props)
})

ipcMain.handle('auxiliaries', async () => {
  const auxiliaries = await auxiliaryService.find()

  for await (const auxiliary of auxiliaries) {
    auxiliary.publishers = await publisherService.findByIds(auxiliary.publisherIds)
  }

  return auxiliaries
})

ipcMain.handle('add-auxiliary', async (_, props) => {
  const name = props.serviceMonth.split('-')
  const date = new Date(parseInt(name[0]), parseInt(name[1]) - 1, 1)
  const auxiliary = await auxiliaryService.upsert({
    ...props,
    name: date.toLocaleString('default', { month: 'long' }).toLowerCase()
  })

  if (auxiliary._id && auxiliary.publisherIds.indexOf(props.publisher) === -1) {
    auxiliary.publisherIds.push(props.publisher)
    return await auxiliaryService.update(auxiliary._id, auxiliary)
  }

  return null
})

ipcMain.handle('save-report', async (_, report) => {
  let newReport = report

  if (report.studies && report.studies !== '') {
    newReport = { ...newReport, studies: parseInt(report.studies) }
  } else {
    newReport = { ...newReport, studies: undefined }
  }

  if (report.hours && report.hours !== '') {
    newReport = { ...newReport, hours: parseInt(report.hours) }
  } else {
    newReport = { ...newReport, hours: undefined }
  }

  return serviceMonthService.saveReport(newReport)
})

ipcMain.handle('generate-excel-report-forms', async (_, serviceMonthId) => {
  if (!mainWindow) return

  generateXLSXReportForms(mainWindow, serviceGroupService, serviceMonthService, serviceMonthId)
})

ipcMain.handle('import-service-reports', async () => {
  if (!mainWindow) return

  importServiceReports(mainWindow, serviceMonthService)
})

ipcMain.on('export-s21', async (_, publisherId) => {
  if (!mainWindow) return

  exportPublisherS21(mainWindow, publisherId)
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
  if (!mainWindow) return

  importTemplate(mainWindow, templateService, args)
})
