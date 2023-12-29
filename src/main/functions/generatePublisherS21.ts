import { PDFCheckBox, PDFDocument, PDFFont, PDFTextField } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import fs from 'fs-extra'
import isDev from 'electron-is-dev'
import path from 'path'
import TemplateService from '../services/templateService'
import { PublisherModel } from '../../types/models'

const templatesService = new TemplateService()

export default async function generatePublisherS21(
  publisher: PublisherModel,
  serviceYear: number
): Promise<Uint8Array> {
  const fontBytes = await new Promise((resolve: (data: null | Buffer) => void) =>
    fs.readFile(
      isDev
        ? './resources/fonts/NotoSans-Regular.ttf'
        : path.join(process.resourcesPath, 'fonts', 'NotoSans-Regular.ttf'),
      (err, data) => {
        if (err) resolve(null)
        else resolve(data)
      }
    )
  )

  const template = await templatesService.findByCode('S-21')
  const publisherFullName = publisher.firstname + ' ' + publisher.lastname
  let customFont: PDFFont
  let sumHours = 0

  if (template) {
    const originalPdfBytes = fs.readFileSync(template.path)
    const pdfDoc = await PDFDocument.load(originalPdfBytes)

    if (fontBytes) {
      pdfDoc.registerFontkit(fontkit)
      await pdfDoc.embedFont(fontBytes)
      customFont = await pdfDoc.embedFont(fontBytes)
    }

    const form = pdfDoc.getForm()
    const rawUpdateFieldAppearances = form.updateFieldAppearances.bind(form)
    form.updateFieldAppearances = function () {
      return rawUpdateFieldAppearances(customFont)
    }

    // get form fields
    const nameField = form.getTextField('900_1_Text_SanSerif')
    const birthdayField = form.getTextField('900_2_Text_SanSerif')
    const manCheckbox = form.getCheckBox('900_3_CheckBox')
    const womanCheckbox = form.getCheckBox('900_4_CheckBox')
    const baptisedField = form.getTextField('900_5_Text_SanSerif')
    const otherSheepCheckbox = form.getCheckBox('900_6_CheckBox')
    const anointedCheckbox = form.getCheckBox('900_7_CheckBox')
    const elderCheckbox = form.getCheckBox('900_8_CheckBox')
    const ministerialServantCheckbox = form.getCheckBox('900_9_CheckBox')
    const pioneerCheckbox = form.getCheckBox('900_10_CheckBox')
    const specialPioneerCheckbox = form.getCheckBox('900_11_CheckBox')
    const missionaryCheckbox = form.getCheckBox('900_12_CheckBox')
    const serviceYearField = form.getTextField('900_13_Text_C_SanSerif')
    const sumHoursField = form.getTextField('904_32_S21_Value')

    // Fill form fields
    nameField.setText(publisherFullName)
    birthdayField.setText(publisher.birthday || '')
    baptisedField.setText(
      publisher.baptised ? publisher.baptised : publisher.unknown_baptised ? '?' : ''
    )
    serviceYearField.setText(serviceYear.toString())

    if (publisher.gender === 'MAN') {
      manCheckbox.check()
    } else {
      womanCheckbox.check()
    }

    if (publisher.hope === 'OTHER_SHEEP') {
      otherSheepCheckbox.check()
    } else {
      anointedCheckbox.check()
    }

    publisher.appointments.forEach((appointment) => {
      if (appointment.type === 'ELDER') {
        elderCheckbox.check()
      }
      if (appointment.type === 'MINISTERIAL_SERVANT') {
        ministerialServantCheckbox.check()
      }
      if (appointment.type === 'PIONEER') {
        pioneerCheckbox.check()
      }
      if (appointment.type === 'SPECIAL_PIONEER') {
        specialPioneerCheckbox.check()
      }
      if (appointment.type === 'MISSIONARY') {
        missionaryCheckbox.check()
      }
    })

    let hasBeenInServiceCheckbox: PDFCheckBox,
      studiesField: PDFTextField,
      auxiliaryCheckbox: PDFCheckBox,
      hoursField: PDFTextField,
      remarksField: PDFTextField

    // Fill reports
    const reports = publisher.reports.filter((report) => report.serviceYear === serviceYear)
    for await (const report of reports) {
      switch (report.sortOrder) {
        case 0:
          hasBeenInServiceCheckbox = form.getCheckBox('901_20_CheckBox')
          studiesField = form.getTextField('902_20_Text_C_SanSerif')
          auxiliaryCheckbox = form.getCheckBox('903_20_CheckBox')
          hoursField = form.getTextField('904_20_S21_Value')
          remarksField = form.getTextField('905_20_Text_SanSerif')

          if (report.hasBeenInService) {
            hasBeenInServiceCheckbox.check()
          }
          studiesField.setText(report.studies?.toString() || '')
          if (report.auxiliary) {
            auxiliaryCheckbox.check()
          }
          hoursField.setText(report.hours?.toString() || '')
          remarksField.setText(report.remarks?.toString() || '')
          sumHours += report.hours || 0
          break
        case 1:
          hasBeenInServiceCheckbox = form.getCheckBox('901_21_CheckBox')
          studiesField = form.getTextField('902_21_Text_C_SanSerif')
          auxiliaryCheckbox = form.getCheckBox('903_21_CheckBox')
          hoursField = form.getTextField('904_21_S21_Value')
          remarksField = form.getTextField('905_21_Text_SanSerif')

          if (report.hasBeenInService) {
            hasBeenInServiceCheckbox.check()
          }
          studiesField.setText(report.studies?.toString() || '')
          if (report.auxiliary) {
            auxiliaryCheckbox.check()
          }
          hoursField.setText(report.hours?.toString() || '')
          remarksField.setText(report.remarks?.toString() || '')
          sumHours += report.hours || 0
          break
        case 2:
          hasBeenInServiceCheckbox = form.getCheckBox('901_22_CheckBox')
          studiesField = form.getTextField('902_22_Text_C_SanSerif')
          auxiliaryCheckbox = form.getCheckBox('903_22_CheckBox')
          hoursField = form.getTextField('904_22_S21_Value')
          remarksField = form.getTextField('905_22_Text_SanSerif')

          if (report.hasBeenInService) {
            hasBeenInServiceCheckbox.check()
          }
          studiesField.setText(report.studies?.toString() || '')
          if (report.auxiliary) {
            auxiliaryCheckbox.check()
          }
          hoursField.setText(report.hours?.toString() || '')
          remarksField.setText(report.remarks?.toString() || '')
          sumHours += report.hours || 0
          break
        case 3:
          hasBeenInServiceCheckbox = form.getCheckBox('901_23_CheckBox')
          studiesField = form.getTextField('902_23_Text_C_SanSerif')
          auxiliaryCheckbox = form.getCheckBox('903_23_CheckBox')
          hoursField = form.getTextField('904_23_S21_Value')
          remarksField = form.getTextField('905_23_Text_SanSerif')

          if (report.hasBeenInService) {
            hasBeenInServiceCheckbox.check()
          }
          studiesField.setText(report.studies?.toString() || '')
          if (report.auxiliary) {
            auxiliaryCheckbox.check()
          }
          hoursField.setText(report.hours?.toString() || '')
          remarksField.setText(report.remarks?.toString() || '')
          sumHours += report.hours || 0
          break
        case 4:
          hasBeenInServiceCheckbox = form.getCheckBox('901_24_CheckBox')
          studiesField = form.getTextField('902_24_Text_C_SanSerif')
          auxiliaryCheckbox = form.getCheckBox('903_24_CheckBox')
          hoursField = form.getTextField('904_24_S21_Value')
          remarksField = form.getTextField('905_24_Text_SanSerif')

          if (report.hasBeenInService) {
            hasBeenInServiceCheckbox.check()
          }
          studiesField.setText(report.studies?.toString() || '')
          if (report.auxiliary) {
            auxiliaryCheckbox.check()
          }
          hoursField.setText(report.hours?.toString() || '')
          remarksField.setText(report.remarks?.toString() || '')
          sumHours += report.hours || 0
          break
        case 5:
          hasBeenInServiceCheckbox = form.getCheckBox('901_25_CheckBox')
          studiesField = form.getTextField('902_25_Text_C_SanSerif')
          auxiliaryCheckbox = form.getCheckBox('903_25_CheckBox')
          hoursField = form.getTextField('904_25_S21_Value')
          remarksField = form.getTextField('905_25_Text_SanSerif')

          if (report.hasBeenInService) {
            hasBeenInServiceCheckbox.check()
          }
          studiesField.setText(report.studies?.toString() || '')
          if (report.auxiliary) {
            auxiliaryCheckbox.check()
          }
          hoursField.setText(report.hours?.toString() || '')
          remarksField.setText(report.remarks?.toString() || '')
          sumHours += report.hours || 0
          break
        case 6:
          hasBeenInServiceCheckbox = form.getCheckBox('901_26_CheckBox')
          studiesField = form.getTextField('902_26_Text_C_SanSerif')
          auxiliaryCheckbox = form.getCheckBox('903_26_CheckBox')
          hoursField = form.getTextField('904_26_S21_Value')
          remarksField = form.getTextField('905_26_Text_SanSerif')

          if (report.hasBeenInService) {
            hasBeenInServiceCheckbox.check()
          }
          studiesField.setText(report.studies?.toString() || '')
          if (report.auxiliary) {
            auxiliaryCheckbox.check()
          }
          hoursField.setText(report.hours?.toString() || '')
          remarksField.setText(report.remarks?.toString() || '')
          sumHours += report.hours || 0
          break
        case 7:
          hasBeenInServiceCheckbox = form.getCheckBox('901_27_CheckBox')
          studiesField = form.getTextField('902_27_Text_C_SanSerif')
          auxiliaryCheckbox = form.getCheckBox('903_27_CheckBox')
          hoursField = form.getTextField('904_27_S21_Value')
          remarksField = form.getTextField('905_27_Text_SanSerif')

          if (report.hasBeenInService) {
            hasBeenInServiceCheckbox.check()
          }
          studiesField.setText(report.studies?.toString() || '')
          if (report.auxiliary) {
            auxiliaryCheckbox.check()
          }
          hoursField.setText(report.hours?.toString() || '')
          remarksField.setText(report.remarks?.toString() || '')
          sumHours += report.hours || 0
          break
        case 8:
          hasBeenInServiceCheckbox = form.getCheckBox('901_28_CheckBox')
          studiesField = form.getTextField('902_28_Text_C_SanSerif')
          auxiliaryCheckbox = form.getCheckBox('903_28_CheckBox')
          hoursField = form.getTextField('904_28_S21_Value')
          remarksField = form.getTextField('905_28_Text_SanSerif')

          if (report.hasBeenInService) {
            hasBeenInServiceCheckbox.check()
          }
          studiesField.setText(report.studies?.toString() || '')
          if (report.auxiliary) {
            auxiliaryCheckbox.check()
          }
          hoursField.setText(report.hours?.toString() || '')
          remarksField.setText(report.remarks?.toString() || '')
          sumHours += report.hours || 0
          break
        case 9:
          hasBeenInServiceCheckbox = form.getCheckBox('901_29_CheckBox')
          studiesField = form.getTextField('902_29_Text_C_SanSerif')
          auxiliaryCheckbox = form.getCheckBox('903_29_CheckBox')
          hoursField = form.getTextField('904_29_S21_Value')
          remarksField = form.getTextField('905_29_Text_SanSerif')

          if (report.hasBeenInService) {
            hasBeenInServiceCheckbox.check()
          }
          studiesField.setText(report.studies?.toString() || '')
          if (report.auxiliary) {
            auxiliaryCheckbox.check()
          }
          hoursField.setText(report.hours?.toString() || '')
          remarksField.setText(report.remarks?.toString() || '')
          sumHours += report.hours || 0
          break
        case 10:
          hasBeenInServiceCheckbox = form.getCheckBox('901_30_CheckBox')
          studiesField = form.getTextField('902_30_Text_C_SanSerif')
          auxiliaryCheckbox = form.getCheckBox('903_30_CheckBox')
          hoursField = form.getTextField('904_30_S21_Value')
          remarksField = form.getTextField('905_30_Text_SanSerif')

          if (report.hasBeenInService) {
            hasBeenInServiceCheckbox.check()
          }
          studiesField.setText(report.studies?.toString() || '')
          if (report.auxiliary) {
            auxiliaryCheckbox.check()
          }
          hoursField.setText(report.hours?.toString() || '')
          remarksField.setText(report.remarks?.toString() || '')
          sumHours += report.hours || 0
          break
        case 11:
          hasBeenInServiceCheckbox = form.getCheckBox('901_31_CheckBox')
          studiesField = form.getTextField('902_31_Text_C_SanSerif')
          auxiliaryCheckbox = form.getCheckBox('903_31_CheckBox')
          hoursField = form.getTextField('904_31_S21_Value')
          remarksField = form.getTextField('905_31_Text_SanSerif')

          if (report.hasBeenInService) {
            hasBeenInServiceCheckbox.check()
          }
          studiesField.setText(report.studies?.toString() || '')
          if (report.auxiliary) {
            auxiliaryCheckbox.check()
          }
          hoursField.setText(report.hours?.toString() || '')
          remarksField.setText(report.remarks?.toString() || '')
          sumHours += report.hours || 0
          break

        default:
          break
      }
    }

    sumHoursField.setText(sumHours > 0 ? sumHours.toString() : '')

    return await pdfDoc.save()
  } else {
    throw new Error('Template not found')
  }
}
