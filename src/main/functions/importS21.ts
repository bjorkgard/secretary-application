import type { BrowserWindow, OpenDialogOptions } from 'electron'
import { app, dialog }                           from 'electron'
import fs                                        from 'fs-extra'
import log                                       from 'electron-log'
import { PDFDocument }                           from 'pdf-lib'
import i18n                                      from '../../localization/i18next.config'
import generateIdentifier                        from '../utils/generateIdentifier'
import type { PublisherModel, Report }           from '../../types/models'
import PublisherService                          from '../services/publisherService'
import ServiceGroupService                       from '../services/serviceGroupService'

const isDevelopment       = import.meta.env.MAIN_VITE_NODE_ENV !== 'production'
const publisherService    = new PublisherService()
const serviceGroupService = new ServiceGroupService()

export default function importS21(mainWindow: BrowserWindow): void {
  const options: OpenDialogOptions = {
    title:       i18n.t('importS21.title'),
    buttonLabel: i18n.t('label.import'),
    filters:     [{ name: 'pdf', extensions: ['pdf'] }],
    properties:  ['openFile'],
  }

  const error             = { title: '', message: '' }
  const filename          = `${generateIdentifier()}.pdf`
  const userTemporaryPath = isDevelopment ? './temporary' : `${app.getPath('userData')}/temporary`
  try {
    fs.mkdirSync(userTemporaryPath, { recursive: true })
  }
  catch (e) {
    log.error('Cannot create folder ', e)
  }

  const generateMonthName = (index: number): string => {
    if (index === 20)
      return 'september'
    if (index === 21)
      return 'oktober'
    if (index === 22)
      return 'november'
    if (index === 23)
      return 'december'
    if (index === 24)
      return 'januari'
    if (index === 25)
      return 'februari'
    if (index === 26)
      return 'mars'
    if (index === 27)
      return 'april'
    if (index === 28)
      return 'maj'
    if (index === 29)
      return 'juni'
    if (index === 30)
      return 'juli'
    if (index === 31)
      return 'augusti'
    return ''
  }

  const generateServiceMonthName = (year: number, index: number): string => {
    if (index === 20)
      return `${year - 1}-09`
    if (index === 21)
      return `${year - 1}-10`
    if (index === 22)
      return `${year - 1}-11`
    if (index === 23)
      return `${year - 1}-12`
    if (index === 24)
      return `${year}-01`
    if (index === 25)
      return `${year}-02`
    if (index === 26)
      return `${year}-03`
    if (index === 27)
      return `${year}-04`
    if (index === 28)
      return `${year}-05`
    if (index === 29)
      return `${year}-06`
    if (index === 30)
      return `${year}-07`
    if (index === 31)
      return `${year}-08`
    return ''
  }

  dialog.showOpenDialog(mainWindow, options).then(async (result) => {
    if (!result.canceled) {
      const serviceGroup = await serviceGroupService.findOneByName('TEMPORARY')
      fs.copyFileSync(result.filePaths[0], `${userTemporaryPath}/${filename}`)

      const pdfBytes = fs.readFileSync(`${userTemporaryPath}/${filename}`)
      const pdfDoc   = await PDFDocument.load(new Uint8Array(pdfBytes))
      const pages    = pdfDoc.getPages()

      if (pages.length !== 1) {
        // PDF must have only one page
        error.title   = i18n.t('importS21.errorPages')
        error.message = i18n.t('importS21.errorTooManyPages')
      }
      else {
        const form      = pdfDoc.getForm()
        const nameField = form.getTextField('900_1_Text_SanSerif')

        if (!nameField) {
          // PDF must have a field named '900_1_Text_SanSerif'
          error.title   = i18n.t('importS21.errorFields')
          error.message = i18n.t('importS21.errorNameField')
        }
        else {
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

          const reports: Report[] = []
          const fullName          = form.getTextField('900_1_Text_SanSerif').getText()?.split(' ')
          publisher.firstname     = fullName ? fullName[0] : ''
          publisher.lastname      = fullName ? fullName.slice(-(fullName.length - 1)).join(' ') : ''
          publisher.birthday      = form.getTextField('900_2_Text_SanSerif').getText() || ''
          publisher.baptised      = form.getTextField('900_5_Text_SanSerif').getText() || ''
          publisher.gender        = form.getCheckBox('900_3_CheckBox').isChecked() ? 'MAN' : 'WOMAN'
          publisher.hope          = form.getCheckBox('900_6_CheckBox').isChecked() ? 'OTHER_SHEEP' : 'ANOINTED'
          if (form.getCheckBox('900_8_CheckBox').isChecked()) {
            publisher.appointments.push({
              type: 'ELDER',
            })
          }
          if (form.getCheckBox('900_9_CheckBox').isChecked()) {
            publisher.appointments.push({
              type: 'MINISTERIALSERVANT',
            })
          }
          if (form.getCheckBox('900_10_CheckBox').isChecked()) {
            publisher.appointments.push({
              type: 'PIONEER',
            })
          }
          if (form.getCheckBox('900_11_CheckBox').isChecked()) {
            publisher.appointments.push({
              type: 'SPECIALPIONEER',
            })
          }
          if (form.getCheckBox('900_12_CheckBox').isChecked()) {
            publisher.appointments.push({
              type: 'MISSIONARY',
            })
          }
          const serviceYear = form.getTextField('900_13_Text_C_SanSerif').getText()

          if (serviceYear && serviceYear !== '') {
            log.info('serviceYear', serviceYear)
            const serviceYearName = Number.parseInt(serviceYear)
            let counter           = 0
            const type            = form.getCheckBox('900_10_CheckBox').isChecked()
              ? 'PIONEER'
              : form.getCheckBox('900_11_CheckBox').isChecked()
                ? 'SPECIALPIONEER'
                : form.getCheckBox('900_12_CheckBox').isChecked()
                  ? 'MISSIONARY'
                  : 'PUBLISHER'

            for (let index = 20; index < 32; index++) {
              if (form.getCheckBox(`901_${index}_CheckBox`).isChecked()) {
                reports.push({
                  hasBeenInService:    form.getCheckBox(`901_${index}_CheckBox`).isChecked(),
                  hasNotBeenInService: !form.getCheckBox(`901_${index}_CheckBox`).isChecked(),
                  identifier:          generateIdentifier(),
                  type,
                  serviceMonth:        generateServiceMonthName(serviceYearName, index),
                  serviceYear:         serviceYearName,
                  sortOrder:           counter,
                  name:                generateMonthName(index),
                  auxiliary:           form.getCheckBox(`903_${index}_CheckBox`).isChecked(),
                  studies:             Number.parseInt(form.getTextField(`902_${index}_Text_C_SanSerif`).getText() || '') || undefined,
                  hours:               Number.parseInt(form.getTextField(`904_${index}_S21_Value`).getText() || '') || undefined,
                  remarks:             form.getTextField(`905_${index}_Text_SanSerif`).getText(),
                })
              }
              counter++
            }
          }

          publisher.reports = reports
          publisherService.create(publisher).then(() => {
            dialog.showMessageBox(mainWindow, {
              type:      'info' as const,
              buttons:   ['OK'],
              defaultId: 0,
              title:     i18n.t('importS21.imported'),
              message:   i18n.t('importS21.importDone'),
              detail:    '',
            })
          })
        }
      }

      if (error.title && error.message) {
        dialog.showMessageBox(mainWindow, {
          type:      'info' as const,
          buttons:   ['OK'],
          defaultId: 0,
          title:     error.title,
          message:   error.message,
          detail:    '',
        })
      }

      fs.remove(`${userTemporaryPath}/${filename}`)
    }
  })
}
