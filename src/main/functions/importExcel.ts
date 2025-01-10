import type { BrowserWindow, OpenDialogOptions }  from 'electron'
import { dialog }                                 from 'electron'
import Excel                                      from 'exceljs'
import i18n                                       from '../../localization/i18next.config'
import type { PublisherModel, ServiceGroupModel } from '../../types/models'
import PublisherService                           from '../services/publisherService'
import ServiceGroupService                        from '../services/serviceGroupService'

const publisherService    = new PublisherService()
const serviceGroupService = new ServiceGroupService()

function getDefaultPublisher(serviceGroup: ServiceGroupModel | null): PublisherModel {
  const publisher: PublisherModel = {
    address:          '',
    appointments:     [],
    blind:            false,
    children:         [],
    city:             '',
    contact:          false,
    deaf:             false,
    firstname:        '',
    gender:           'MAN',
    histories:        [],
    hope:             'OTHER_SHEEP',
    lastname:         '',
    reports:          [],
    responsibilities: [],
    s290:             false,
    sendReports:      false,
    status:           'ACTIVE',
    tasks:            [],
    unknown_baptised: false,
    zip:              '',
    resident:         '',
    emergencyContact: {},
    serviceGroupId:   serviceGroup?._id,
  }

  return publisher
}

export default async function importExcel(mainWindow: BrowserWindow): Promise<void> {
  const serviceGroup               = await serviceGroupService.findOneByName('TEMPORARY')
  const options: OpenDialogOptions = {
    title:       i18n.t('importExcel.title'),
    buttonLabel: i18n.t('label.import'),
    filters:     [{ name: 'xlsx', extensions: ['xlsx'] }],
    properties:  ['openFile'],
  }

  let publisher: PublisherModel | null = null

  dialog.showOpenDialog(mainWindow, options).then((result) => {
    if (!result.canceled) {
      const workbook = new Excel.Workbook()
      workbook.xlsx.readFile(result.filePaths[0]).then(async () => {
        const worksheet = workbook.getWorksheet(1)

        if (worksheet) {
          worksheet.eachRow(async (row, rowNumber) => {
            if (rowNumber === 1)
              return

            const birthday = row.getCell('I').value?.toString() as string
            const baptised = row.getCell('J').value?.toString() as string

            publisher           = getDefaultPublisher(serviceGroup)
            publisher.lastname  = row.getCell('A').value?.toString() || ''
            publisher.firstname = row.getCell('B').value?.toString() || ''
            publisher.address   = row.getCell('C').value?.toString() || ''
            publisher.zip       = row.getCell('D').value?.toString() || ''
            publisher.city      = row.getCell('E').value?.toString() || ''
            publisher.phone     = row.getCell('F').value?.toString() || ''
            publisher.mobile    = row.getCell('G').value?.toString() || ''
            publisher.email     = row.getCell('H').value?.toString() || ''
            publisher.birthday  = birthday ? new Date(birthday).toLocaleDateString('sv') : ''
            publisher.baptised  = baptised ? new Date(baptised).toLocaleDateString('sv') : ''

            await publisherService.create(publisher)
          })
        }
      })

      dialog.showMessageBox(mainWindow, {
        type:      'info' as const,
        buttons:   ['OK'],
        defaultId: 0,
        title:     i18n.t('importExcel.imported'),
        message:   i18n.t('importExcel.importDone'),
        detail:    '',
      })
    }
  })
}
