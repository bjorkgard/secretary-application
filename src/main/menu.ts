import type { BrowserWindow, MenuItemConstructorOptions } from 'electron'
import { Menu, app, ipcMain, shell }                      from 'electron'
import i18next                                            from 'i18next'

// import log from 'electron-log'
import Whitelist from '../localization/whitelist'

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string
  submenu?:  DarwinMenuItemConstructorOptions[] | Menu
}

export default class MenuBuilder {
  mainWindow: BrowserWindow

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
  }

  buildMenu(i18n: typeof i18next): Menu {
    if (import.meta.env.MAIN_VITE_NODE_ENV === 'development')
      this.setupDevelopmentEnvironment()

    // eslint-disable-next-line node/prefer-global/process
    const template = process.platform === 'darwin'
      ? this.buildDarwinTemplate(i18n)
      : this.buildDefaultTemplate(i18n)

    const menu = Menu.buildFromTemplate(template as MenuItemConstructorOptions[])
    Menu.setApplicationMenu(menu)
    return menu
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: (): void => {
            this.mainWindow.webContents.inspectElement(x, y)
          },
        },
      ]).popup({ window: this.mainWindow })
    })
  }

  buildDarwinTemplate(i18n: typeof i18next): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions  = {
      label:   'Secretary',
      submenu: [
        {
          label:    i18n.t('Om Secretary'),
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        { label: i18n.t('Tjänster'), submenu: [] },
        { type: 'separator' },
        {
          label:       i18n.t('Göm Secretary'),
          accelerator: 'Command+H',
          selector:    'hide:',
        },
        {
          label:       i18n.t('Göm övriga'),
          accelerator: 'Command+Shift+H',
          selector:    'hideOtherApplications:',
        },
        { label: i18n.t('Visa alla'), selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label:       i18n.t('Avsluta Secretary'),
          accelerator: 'Command+Q',
          click:       (): void => {
            app.quit()
          },
        },
      ],
    }
    const subMenuEdit: DarwinMenuItemConstructorOptions   = {
      label:   i18n.t('Redigera'),
      submenu: [
        { label: i18n.t('Ångra'), accelerator: 'Command+Z', selector: 'undo:' },
        {
          label:       i18n.t('Upprepa'),
          accelerator: 'Shift+Command+Z',
          selector:    'redo:',
        },
        { type: 'separator' },
        {
          label:       i18n.t('Klipp ut'),
          accelerator: 'Command+X',
          selector:    'cut:',
        },
        {
          label:       i18n.t('Kopiera'),
          accelerator: 'Command+C',
          selector:    'copy:',
        },
        {
          label:       i18n.t('Klistra in'),
          accelerator: 'Command+V',
          selector:    'paste:',
        },
        {
          label:       i18n.t('Markera allt'),
          accelerator: 'Command+A',
          selector:    'selectAll:',
        },
      ],
    }
    const subMenuViewDev: MenuItemConstructorOptions      = {
      label:   i18n.t('Visa'),
      submenu: [
        {
          label:       i18n.t('Ladda om'),
          accelerator: 'Command+R',
          click:       (): void => {
            this.mainWindow.webContents.reload()
          },
        },
        {
          label:       i18n.t('Helskärmsläge'),
          accelerator: 'Ctrl+Command+F',
          click:       (): void => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
          },
        },
        {
          label:       i18n.t('Växla utvecklarverktyg'),
          accelerator: 'Alt+Command+I',
          click:       (): void => {
            this.mainWindow.webContents.toggleDevTools()
          },
        },
      ],
    }
    const subMenuViewProd: MenuItemConstructorOptions     = {
      label:   i18n.t('Visa'),
      submenu: [
        {
          label:       i18n.t('Helskärmsläge'),
          accelerator: 'Ctrl+Command+F',
          click:       (): void => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
          },
        },
      ],
    }
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label:   i18n.t('Fönster'),
      submenu: [
        {
          label:       i18n.t('Minimera'),
          accelerator: 'Command+M',
          selector:    'performMiniaturize:',
        },
        {
          label:       i18n.t('Stäng'),
          accelerator: 'Command+W',
          selector:    'performClose:',
        },
        { type: 'separator' },
        { label: i18n.t('Flytta fram alla'), selector: 'arrangeInFront:' },
      ],
    }

    const subMenuImport: MenuItemConstructorOptions = {
      label:   i18n.t('mainMenu.import'),
      submenu: [
        {
          label: i18n.t('mainMenu.importFromS21'),
          click: (): void => {
            ipcMain.emit('import-s21')
          },
        },
        {
          label: i18n.t('mainMenu.importFromExcel'),
          click: (): void => {
            ipcMain.emit('import-excel')
          },
        },
      ],
    }

    const subMenuExport: MenuItemConstructorOptions = {
      label:   i18n.t('mainMenu.export'),
      submenu: [
        {
          label:   i18n.t('mainMenu.addressList'),
          submenu: [
            {
              label:   i18n.t('mainMenu.addressListAlphabetically'),
              submenu: [
                {
                  label: i18n.t('mainMenu.pdf'),
                  click: (): void => {
                    ipcMain.emit('export-addresslist-alphabetically-pdf')
                  },
                },
                {
                  label: i18n.t('mainMenu.xlsx'),
                  click: (): void => {
                    ipcMain.emit('export-addresslist-alphabetically-xlsx')
                  },
                },
              ],
            },
            {
              label:   i18n.t('mainMenu.addressListGroup'),
              submenu: [
                {
                  label: i18n.t('mainMenu.pdf'),
                  click: (): void => {
                    ipcMain.emit('export-addresslist-group-pdf')
                  },
                },
                {
                  label: i18n.t('mainMenu.xlsx'),
                  click: (): void => {
                    ipcMain.emit('export-addresslist-group-xlsx')
                  },
                },
              ],
            },
            {
              label:   i18n.t('mainMenu.addressListGroupEmergencyContacts'),
              submenu: [
                {
                  label: i18n.t('mainMenu.pdf'),
                  click: (): void => {
                    ipcMain.emit('export-addresslist-group-emergency-pdf')
                  },
                },
                {
                  label: i18n.t('mainMenu.xlsx'),
                  click: (): void => {
                    ipcMain.emit('export-addresslist-group-emergency-xlsx')
                  },
                },
              ],
            },
            {
              label:   i18n.t('mainMenu.addressListDisfellowshipped'),
              submenu: [
                {
                  label: i18n.t('mainMenu.pdf'),
                  click: (): void => {
                    ipcMain.emit('export-addresslist-disfellowshipped-pdf')
                  },
                },
                {
                  label: i18n.t('mainMenu.xlsx'),
                  click: (): void => {
                    ipcMain.emit('export-addresslist-disfellowshipped-xlsx')
                  },
                },
              ],
            },
          ],
        },
        {
          label:   i18n.t('mainMenu.registerCard'),
          submenu: [
            {
              label: i18n.t('mainMenu.exportCongregationRegisterCard'),
              click: (): void => {
                ipcMain.emit('export-register-card-congregation', null, { type: 'complete' })
              },
            },
            {
              label: i18n.t('mainMenu.exportCompleteRegisterCard'),
              click: (): void => {
                ipcMain.emit('export-register-card', null, { type: 'complete' })
              },
            },
            {
              label: i18n.t('mainMenu.exportServiceGroupRegisterCard'),
              click: (): void => {
                ipcMain.emit('export-register-card-servicegroup', null, { type: 'serviceGroup' })
              },
            },
            {
              label: i18n.t('mainMenu.exportFullTimeRegisterCard'),
              click: (): void => {
                ipcMain.emit('export-register-card', null, { type: 'fullTime' })
              },
            },
            {
              label: i18n.t('mainMenu.exportPublisherRegisterCard'),
              click: (): void => {
                ipcMain.emit('export-register-card', null, { type: 'publishers' })
              },
            },
            {
              label: i18n.t('mainMenu.exportIrregularRegisterCard'),
              click: (): void => {
                ipcMain.emit('export-register-card', null, { type: 'irregular' })
              },
            },
            {
              label: i18n.t('mainMenu.exportInactiveRegisterCard'),
              click: (): void => {
                ipcMain.emit('export-register-card', null, { type: 'inactive' })
              },
            },
          ],
        },
        {
          label:   i18n.t('mainMenu.extendedRegisterCard'),
          submenu: [
            {
              label: i18n.t('mainMenu.exportCompleteRegisterCard'),
              click: (): void => {
                ipcMain.emit('export-extended-register-cards')
              },
            },
            {
              label: i18n.t('mainMenu.exportServiceGroupRegisterCard'),
              click: (): void => {
                ipcMain.emit('export-extended-register-cards-servicegroup')
              },
            },
            {
              label: i18n.t('mainMenu.exportDisfellowshippedRegisterCard'),
              click: (): void => {
                ipcMain.emit('export-extended-register-cards-disfellowshipped')
              },
            },
          ],
        },
        {
          label:   i18n.t('mainMenu.meetingAttendance'),
          submenu: [
            {
              label: i18n.t('mainMenu.exportLatestMeetingAttendance'),
              click: (): void => {
                ipcMain.emit('export-meeting-attendance', null, { type: 'latest' })
              },
            },
            {
              label: i18n.t('mainMenu.exportCompleteMeetingAttendance'),
              click: (): void => {
                ipcMain.emit('export-meeting-attendance', null, { type: 'complete' })
              },
            },
          ],
        },
        {
          label:   i18n.t('mainMenu.congregation'),
          submenu: [
            {
              label:   i18n.t('mainMenu.organizationSchema'),
              submenu: [
                {
                  label: i18n.t('mainMenu.pdf'),
                  click: (): void => {
                    ipcMain.emit('export-organization-schema', null, { type: 'PDF' })
                  },
                },
                {
                  label: i18n.t('mainMenu.xlsx'),
                  click: (): void => {
                    ipcMain.emit('export-organization-schema', null, { type: 'XLSX' })
                  },
                },
              ],
            },
          ],
        },
        {
          label:   i18n.t('mainMenu.publishers'),
          submenu: [
            {
              label:   i18n.t('mainMenu.nameList'),
              submenu: [
                {
                  label: i18n.t('mainMenu.pdf'),
                  click: (): void => {
                    ipcMain.emit('export-namelist', null, { type: 'PDF' })
                  },
                },
                {
                  label: i18n.t('mainMenu.xlsx'),
                  click: (): void => {
                    ipcMain.emit('export-namelist', null, { type: 'XLSX' })
                  },
                },
              ],
            },
            {
              label:   i18n.t('mainMenu.spiritualStatus'),
              submenu: [
                {
                  label: i18n.t('mainMenu.pdf'),
                  click: (): void => {
                    ipcMain.emit('export-spiritual-status', null, { type: 'PDF' })
                  },
                },
                {
                  label: i18n.t('mainMenu.xlsx'),
                  click: (): void => {
                    ipcMain.emit('export-spiritual-status', null, { type: 'XLSX' })
                  },
                },
              ],
            },
            {
              label: i18n.t('mainMenu.needsCompletions'),
              click: (): void => {
                ipcMain.emit('export-needs-completions', null, {})
              },
            },
            {
              label: i18n.t('mainMenu.activeApplications'),
              click: (): void => {
                ipcMain.emit('export-active-applications', null, {})
              },
            },
            {
              label: i18n.t('mainMenu.exportMembers'),
              click: (): void => {
                ipcMain.emit('export-members', null, {})
              },
            },
            {
              label: i18n.t('mainMenu.regularParticipants'),
              click: (): void => {
                ipcMain.emit('export-regular-participants', null, {})
              },
            },
            {
              label: i18n.t('mainMenu.votingList'),
              click: (): void => {
                ipcMain.emit('export-voting-list', null, {})
              },
            },
            {
              label: i18n.t('mainMenu.irregulars'),
              click: (): void => {
                ipcMain.emit('export-irregular-list', null, {})
              },
            },
            {
              label: i18n.t('mainMenu.inactives'),
              click: (): void => {
                ipcMain.emit('export-inactive-list', null, {})
              },
            },
            {
              label: i18n.t('mainMenu.auxiliaries'),
              click: (): void => {
                ipcMain.emit('export-auxiliary-list', null, {})
              },
            },
          ],
        },
        {
          label:   i18n.t('mainMenu.serviceGroups'),
          submenu: [
            {
              label:   i18n.t('mainMenu.serviceGroupsList'),
              submenu: [
                {
                  label: i18n.t('mainMenu.pdf'),
                  click: (): void => {
                    ipcMain.emit('export-serviceGroups-list', null, { type: 'PDF' })
                  },
                },
                {
                  label: i18n.t('mainMenu.xlsx'),
                  click: (): void => {
                    ipcMain.emit('export-serviceGroups-list', null, { type: 'XLSX' })
                  },
                },
              ],
            },
            {
              label:   i18n.t('mainMenu.serviceGroupsInternalList'),
              submenu: [
                {
                  label: i18n.t('mainMenu.pdf'),
                  click: (): void => {
                    ipcMain.emit('export-serviceGroups-internal-list', null, { type: 'PDF' })
                  },
                },
                {
                  label: i18n.t('mainMenu.xlsx'),
                  click: (): void => {
                    ipcMain.emit('export-serviceGroups-internal-list', null, { type: 'XLSX' })
                  },
                },
              ],
            },
          ],
        },
      ],
    }

    const subMenuMaintenance: MenuItemConstructorOptions = {
      label:   i18n.t('mainMenu.maintenance'),
      submenu: [
        {
          label: i18n.t('mainMenu.backup'),
          click: (): void => {
            ipcMain.emit('generate-backup')
          },
        },
        {
          label: i18n.t('mainMenu.restore'),
          click: (): void => {
            ipcMain.emit('restore-backup')
          },
        },
      ],
    }

    const subMenuLanguage: MenuItemConstructorOptions = {
      label:   i18n.t('Språk'),
      submenu: Whitelist.buildSubmenu('switch-language', i18n),
    }

    const subMenuHelp: MenuItemConstructorOptions = {
      label:   i18n.t('Hjälp'),
      submenu: [
        {
          label: i18n.t('Dokumentation'),
          click: (): void => {
            shell.openExternal('https://github.com/bjorkgard/secretary-application/wiki')
          },
        },
        {
          label: i18n.t('Rapportera problem'),
          click: (): void => {
            shell.openExternal('https://github.com/bjorkgard/secretary-application/issues/new?assignees=&labels=bug&projects=&template=bug_report.yml')
          },
        },
        {
          label: i18n.t('Saknad funktion'),
          click: (): void => {
            shell.openExternal('https://github.com/bjorkgard/secretary-application/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.yml')
          },
        },
        {
          label: i18n.t('Textfel/Översättning'),
          click: (): void => {
            shell.openExternal('https://github.com/bjorkgard/secretary-application/issues/new?assignees=&labels=&projects=&template=typo.yml')
          },
        },
      ],
    }

    const subMenuView
      // eslint-disable-next-line node/prefer-global/process
      = import.meta.env.MAIN_VITE_NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd

    return [
      subMenuAbout,
      subMenuEdit,
      subMenuView,
      subMenuWindow,
      subMenuImport,
      subMenuExport,
      subMenuMaintenance,
      subMenuLanguage,
      subMenuHelp,
    ]
  }

  buildDefaultTemplate(i18n: typeof i18next): MenuItemConstructorOptions[] {
    const templateDefault = [
      {
        label:   i18n.t('&Arkiv'),
        submenu: [
          {
            label:       i18n.t('&Stäng'),
            accelerator: 'Ctrl+W',
            click:       (): void => {
              this.mainWindow.close()
            },
          },
        ],
      },
      {
        label: i18n.t('&Visa'),
        submenu:
          // eslint-disable-next-line node/prefer-global/process
          import.meta.env.MAIN_VITE_NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label:       i18n.t('&Ladda om'),
                  accelerator: 'Ctrl+R',
                  click:       (): void => {
                    this.mainWindow.webContents.reload()
                  },
                },
                {
                  label:       i18n.t('Växla &Helskärmsläge'),
                  accelerator: 'F11',
                  click:       (): void => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
                  },
                },
                {
                  label:       i18n.t('Växla &Utvecklarverktyg'),
                  accelerator: 'Alt+Ctrl+I',
                  click:       (): void => {
                    this.mainWindow.webContents.toggleDevTools()
                  },
                },
              ]
            : [
                {
                  label:       i18n.t('Växla &Helskärmsläge'),
                  accelerator: 'F11',
                  click:       (): void => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
                  },
                },
              ],
      },
      {
        label:   i18n.t('mainMenu.import'),
        submenu: [
          {
            label: i18n.t('mainMenu.importFromS21'),
            click: (): void => {
              ipcMain.emit('import-s21')
            },
          },
          {
            label: i18n.t('mainMenu.importFromExcel'),
            click: (): void => {
              ipcMain.emit('import-excel')
            },
          },
        ],
      },
      {
        label:   i18n.t('mainMenu.export'),
        submenu: [
          {
            label:   i18n.t('mainMenu.addressList'),
            submenu: [
              {
                label:   i18n.t('mainMenu.addressListAlphabetically'),
                submenu: [
                  {
                    label: i18n.t('mainMenu.pdf'),
                    click: (): void => {
                      ipcMain.emit('export-addresslist-alphabetically-pdf')
                    },
                  },
                  {
                    label: i18n.t('mainMenu.xlsx'),
                    click: (): void => {
                      ipcMain.emit('export-addresslist-alphabetically-xlsx')
                    },
                  },
                ],
              },
              {
                label:   i18n.t('mainMenu.addressListGroup'),
                submenu: [
                  {
                    label: i18n.t('mainMenu.pdf'),
                    click: (): void => {
                      ipcMain.emit('export-addresslist-group-pdf')
                    },
                  },
                  {
                    label: i18n.t('mainMenu.xlsx'),
                    click: (): void => {
                      ipcMain.emit('export-addresslist-group-xlsx')
                    },
                  },
                ],
              },
              {
                label:   i18n.t('mainMenu.addressListGroupEmergencyContacts'),
                submenu: [
                  {
                    label: i18n.t('mainMenu.pdf'),
                    click: (): void => {
                      ipcMain.emit('export-addresslist-group-emergency-pdf')
                    },
                  },
                  {
                    label: i18n.t('mainMenu.xlsx'),
                    click: (): void => {
                      ipcMain.emit('export-addresslist-group-emergency-xlsx')
                    },
                  },
                ],
              },
              {
                label:   i18n.t('mainMenu.addressListDisfellowshipped'),
                submenu: [
                  {
                    label: i18n.t('mainMenu.pdf'),
                    click: (): void => {
                      ipcMain.emit('export-addresslist-disfellowshipped-pdf')
                    },
                  },
                  {
                    label: i18n.t('mainMenu.xlsx'),
                    click: (): void => {
                      ipcMain.emit('export-addresslist-disfellowshipped-xlsx')
                    },
                  },
                ],
              },
            ],
          },
          {
            label:   i18n.t('mainMenu.registerCard'),
            submenu: [
              {
                label: i18n.t('mainMenu.exportCongregationRegisterCard'),
                click: (): void => {
                  ipcMain.emit('export-register-card-congregation', null, { type: 'complete' })
                },
              },
              {
                label: i18n.t('mainMenu.exportCompleteRegisterCard'),
                click: (): void => {
                  ipcMain.emit('export-register-card', null, { type: 'complete' })
                },
              },
              {
                label: i18n.t('mainMenu.exportServiceGroupRegisterCard'),
                click: (): void => {
                  ipcMain.emit('export-register-card-servicegroup', null, { type: 'serviceGroup' })
                },
              },
              {
                label: i18n.t('mainMenu.exportFullTimeRegisterCard'),
                click: (): void => {
                  ipcMain.emit('export-register-card', null, { type: 'fullTime' })
                },
              },
              {
                label: i18n.t('mainMenu.exportPublisherRegisterCard'),
                click: (): void => {
                  ipcMain.emit('export-register-card', null, { type: 'publishers' })
                },
              },
              {
                label: i18n.t('mainMenu.exportIrregularRegisterCard'),
                click: (): void => {
                  ipcMain.emit('export-register-card', null, { type: 'irregular' })
                },
              },
              {
                label: i18n.t('mainMenu.exportInactiveRegisterCard'),
                click: (): void => {
                  ipcMain.emit('export-register-card', null, { type: 'inactive' })
                },
              },
            ],
          },
          {
            label:   i18n.t('mainMenu.extendedRegisterCard'),
            submenu: [
              {
                label: i18n.t('mainMenu.exportCompleteRegisterCard'),
                click: (): void => {
                  ipcMain.emit('export-extended-register-cards')
                },
              },
              {
                label: i18n.t('mainMenu.exportServiceGroupRegisterCard'),
                click: (): void => {
                  ipcMain.emit('export-extended-register-cards-servicegroup')
                },
              },
              {
                label: i18n.t('mainMenu.exportDisfellowshippedRegisterCard'),
                click: (): void => {
                  ipcMain.emit('export-extended-register-cards-disfellowshipped')
                },
              },
            ],
          },
          {
            label:   i18n.t('mainMenu.meetingAttendance'),
            submenu: [
              {
                label: i18n.t('mainMenu.exportLatestMeetingAttendance'),
                click: (): void => {
                  ipcMain.emit('export-meeting-attendance', null, { type: 'latest' })
                },
              },
              {
                label: i18n.t('mainMenu.exportCompleteMeetingAttendance'),
                click: (): void => {
                  ipcMain.emit('export-meeting-attendance', null, { type: 'complete' })
                },
              },
            ],
          },
          {
            label:   i18n.t('mainMenu.congregation'),
            submenu: [
              {
                label:   i18n.t('mainMenu.organizationSchema'),
                submenu: [
                  {
                    label: i18n.t('mainMenu.pdf'),
                    click: (): void => {
                      ipcMain.emit('export-organization-schema', null, { type: 'PDF' })
                    },
                  },
                  {
                    label: i18n.t('mainMenu.xlsx'),
                    click: (): void => {
                      ipcMain.emit('export-organization-schema', null, { type: 'XLSX' })
                    },
                  },
                ],
              },
            ],
          },
          {
            label:   i18n.t('mainMenu.publishers'),
            submenu: [
              {
                label:   i18n.t('mainMenu.nameList'),
                submenu: [
                  {
                    label: i18n.t('mainMenu.pdf'),
                    click: (): void => {
                      ipcMain.emit('export-namelist', null, { type: 'PDF' })
                    },
                  },
                  {
                    label: i18n.t('mainMenu.xlsx'),
                    click: (): void => {
                      ipcMain.emit('export-namelist', null, { type: 'XLSX' })
                    },
                  },
                ],
              },
              {
                label:   i18n.t('mainMenu.spiritualStatus'),
                submenu: [
                  {
                    label: i18n.t('mainMenu.pdf'),
                    click: (): void => {
                      ipcMain.emit('export-spiritual-status', null, { type: 'PDF' })
                    },
                  },
                  {
                    label: i18n.t('mainMenu.xlsx'),
                    click: (): void => {
                      ipcMain.emit('export-spiritual-status', null, { type: 'XLSX' })
                    },
                  },
                ],
              },
              {
                label: i18n.t('mainMenu.needsCompletions'),
                click: (): void => {
                  ipcMain.emit('export-needs-completions', null, {})
                },
              },
              {
                label: i18n.t('mainMenu.activeApplications'),
                click: (): void => {
                  ipcMain.emit('export-active-applications', null, {})
                },
              },
              {
                label: i18n.t('mainMenu.exportMembers'),
                click: (): void => {
                  ipcMain.emit('export-members', null, {})
                },
              },
              {
                label: i18n.t('mainMenu.regularParticipants'),
                click: (): void => {
                  ipcMain.emit('export-regular-participants', null, {})
                },
              },
              {
                label: i18n.t('mainMenu.votingList'),
                click: (): void => {
                  ipcMain.emit('export-voting-list', null, {})
                },
              },
              {
                label: i18n.t('mainMenu.irregulars'),
                click: (): void => {
                  ipcMain.emit('export-irregular-list', null, {})
                },
              },
              {
                label: i18n.t('mainMenu.inactives'),
                click: (): void => {
                  ipcMain.emit('export-inactive-list', null, {})
                },
              },
              {
                label: i18n.t('mainMenu.auxiliaries'),
                click: (): void => {
                  ipcMain.emit('export-auxiliary-list', null, {})
                },
              },
            ],
          },
          {
            label:   i18n.t('mainMenu.serviceGroups'),
            submenu: [
              {
                label: i18n.t('mainMenu.serviceGroupsList'),
                click: (): void => {
                  ipcMain.emit('export-serviceGroups-list', null, {})
                },
              },
              {
                label: i18n.t('mainMenu.serviceGroupsInternalList'),
                click: (): void => {
                  ipcMain.emit('export-serviceGroups-internal-list', null, {})
                },
              },
            ],
          },
        ],
      },
      {
        label:   i18n.t('mainMenu.maintenance'),
        submenu: [
          {
            label: i18n.t('mainMenu.backup'),
            click: (): void => {
              ipcMain.emit('generate-backup')
            },
          },
          {
            label: i18n.t('mainMenu.restore'),
            click: (): void => {
              ipcMain.emit('restore-backup')
            },
          },
          { type: 'separator' },
          {
            label: i18n.t('mainMenu.import'),
            click: (): void => {
              ipcMain.emit('import')
            },
          },
        ],
      },
      {
        label:   i18n.t('Språk'),
        submenu: Whitelist.buildSubmenu('switch-language', i18next),
      },
      {
        label:   i18n.t('Hjälp'),
        submenu: [
          {
            label: i18n.t('Dokumentation'),
            click: (): void => {
              shell.openExternal('https://github.com/bjorkgard/secretary-application/wiki')
            },
          },
          {
            label: i18n.t('Rapportera problem'),
            click: (): void => {
              shell.openExternal('https://github.com/bjorkgard/secretary-application/issues/new?assignees=&labels=bug&projects=&template=bug_report.yml')
            },
          },
          {
            label: i18n.t('Saknad funktion'),
            click: (): void => {
              shell.openExternal('https://github.com/bjorkgard/secretary-application/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.yml')
            },
          },
          {
            label: i18n.t('Textfel/Översättning'),
            click: (): void => {
              shell.openExternal('https://github.com/bjorkgard/secretary-application/issues/new?assignees=&labels=&projects=&template=typo.yml')
            },
          },
        ],
      },
    ]

    return templateDefault
  }
}
