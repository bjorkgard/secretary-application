import path                                               from 'node:path'
import type { PDFCheckBox, PDFFont, PDFTextField }        from 'pdf-lib'
import { PDFDocument, StandardFonts, TextAlignment, rgb } from 'pdf-lib'
import fontkit                                            from '@pdf-lib/fontkit'
import fs                                                 from 'fs-extra'
import TemplateService                                    from '../services/templateService'
import type { PublisherModel, Report }                    from '../../types/models'
import i18n                                               from '../../localization/i18next.config'
import isDev                                              from './isDev'

const templatesService = new TemplateService()

export default async function generatePublishersS21(
  publishers: PublisherModel[],
  serviceYear: number,
  flatten = false,
): Promise<Uint8Array> {
  // eslint-disable-next-line node/prefer-global/buffer
  const fontBytes = await new Promise((resolve: (data: null | Buffer) => void) =>
    fs.readFile(
      isDev()
        ? './resources/fonts/NotoSans-Regular.ttf'
        // eslint-disable-next-line node/prefer-global/process
        : path.join(process.resourcesPath, 'fonts', 'NotoSans-Regular.ttf'),
      (err, data) => {
        if (err)
          resolve(null)
        else resolve(data)
      },
    ),
  )

  const template = await templatesService.findByCode('S-21')
  let customFont: PDFFont

  if (template) {
    const templatePdfBytes = fs.readFileSync(template.path)
    // const pdfDoc            = await PDFDocument.load(new Uint8Array(templatePdfBytes))
    const pdfDoc            = await PDFDocument.create()
    const [embededTemplate] = await pdfDoc.embedPdf(new Uint8Array(templatePdfBytes))
    const templateDims      = embededTemplate.scale(1)

    if (fontBytes) {
      pdfDoc.registerFontkit(fontkit)
      await pdfDoc.embedFont(new Uint8Array(fontBytes))
      customFont = await pdfDoc.embedFont(new Uint8Array(fontBytes))
    }
    else {
      customFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    }

    const form = pdfDoc.getForm()
    form.updateFieldAppearances(customFont)

    for await (const publisher of publishers) {
      const publisherFullName = `${publisher.lastname}, ${publisher.firstname}`

      const page = pdfDoc.addPage()
      page.drawPage(embededTemplate, {
        ...templateDims,
        x: page.getWidth() / 2 - templateDims.width / 2,
        y: page.getHeight() - templateDims.height,
      })

      const name = form.createTextField(`${serviceYear}-${publisher._id}-name`)
      name.setText(publisherFullName)
      name.addToPage(page, { font: customFont, x: 51.983, y: 762.224, width: 526.307, height: 15.635, borderColor: rgb(1, 1, 1) })

      const birthday = form.createTextField(`${serviceYear}-${publisher._id}-birthday`)
      birthday.setText(publisher.birthday || '')
      birthday.addToPage(page, { font: customFont, x: 95.801, y: 745.494, width: 274.655, height: 15.635, borderColor: rgb(1, 1, 1) })

      const baptised = form.createTextField(`${serviceYear}-${publisher._id}-baptised`)
      baptised.setText(publisher.baptised ? publisher.baptised : publisher.unknown_baptised ? '?' : '')
      baptised.addToPage(page, { font: customFont, x: 76.282, y: 729.958, width: 294.174, height: 15.635, borderColor: rgb(1, 1, 1) })

      const manCheckbox = form.createCheckBox(`${serviceYear}-${publisher._id}-man`)
      manCheckbox.addToPage(page, { x: 384.1, y: 746.689, width: 10.356, height: 10.356 })
      if (publisher.gender === 'MAN') {
        manCheckbox.check()
        manCheckbox.defaultUpdateAppearances()
      }

      const womanCheckbox = form.createCheckBox(`${serviceYear}-${publisher._id}-woman`)
      womanCheckbox.addToPage(page, { x: 485.577, y: 746.689, width: 10.356, height: 10.356 })
      if (publisher.gender === 'WOMAN') {
        womanCheckbox.check()
        womanCheckbox.defaultUpdateAppearances()
      }

      const otherSheepCheckbox = form.createCheckBox(`${serviceYear}-${publisher._id}-otherSheep`)
      otherSheepCheckbox.addToPage(page, { x: 384.1, y: 730.357, width: 10.356, height: 10.356 })
      if (publisher.hope === 'OTHER_SHEEP') {
        otherSheepCheckbox.check()
        otherSheepCheckbox.defaultUpdateAppearances()
      }

      const anointedCheckbox = form.createCheckBox(`${serviceYear}-${publisher._id}-anointed`)
      anointedCheckbox.addToPage(page, { x: 485.577, y: 730.357, width: 10.356, height: 10.356 })
      if (publisher.hope === 'ANOINTED') {
        anointedCheckbox.check()
        anointedCheckbox.defaultUpdateAppearances()
      }

      const elderCheckbox = form.createCheckBox(`${serviceYear}-${publisher._id}-elder`)
      elderCheckbox.addToPage(page, { x: 16.83, y: 714.224, width: 10.356, height: 10.356 })

      const ministerialServantCheckbox = form.createCheckBox(`${serviceYear}-${publisher._id}-ministerialServant`)
      ministerialServantCheckbox.addToPage(page, { x: 84.647, y: 714.224, width: 10.356, height: 10.356 })

      const pioneerCheckbox = form.createCheckBox(`${serviceYear}-${publisher._id}-pioneer`)
      pioneerCheckbox.addToPage(page, { x: 218.788, y: 714.224, width: 10.356, height: 10.356 })

      const specialPioneerCheckbox = form.createCheckBox(`${serviceYear}-${publisher._id}-specialPioneer`)
      specialPioneerCheckbox.addToPage(page, { x: 336.199, y: 714.224, width: 10.356, height: 10.356 })

      const missionaryCheckbox = form.createCheckBox(`${serviceYear}-${publisher._id}-missionary`)
      missionaryCheckbox.addToPage(page, { x: 444.747, y: 714.224, width: 10.356, height: 10.356 })

      publisher.appointments.forEach((appointment) => {
        if (appointment.type === 'ELDER') {
          elderCheckbox.check()
          elderCheckbox.defaultUpdateAppearances()
        }

        if (appointment.type === 'MINISTERIALSERVANT') {
          ministerialServantCheckbox.check()
          ministerialServantCheckbox.defaultUpdateAppearances()
        }

        if (appointment.type === 'PIONEER') {
          pioneerCheckbox.check()
          pioneerCheckbox.defaultUpdateAppearances()
        }

        if (appointment.type === 'SPECIALPIONEER') {
          specialPioneerCheckbox.check()
          specialPioneerCheckbox.defaultUpdateAppearances()
        }

        if (appointment.type === 'MISSIONARY') {
          missionaryCheckbox.check()
          missionaryCheckbox.defaultUpdateAppearances()
        }
      })

      // Fill reports
      let serviceYearText   = ''
      let sumHours          = 0
      let reports: Report[] = []
      let hasBeenInServiceCheckbox: PDFCheckBox,
        studiesField: PDFTextField,
        auxiliaryCheckbox: PDFCheckBox,
        hoursField: PDFTextField,
        remarksField: PDFTextField

      if (publisher.status !== 'INACTIVE') {
        serviceYearText = serviceYear.toString()
        reports         = publisher.reports.filter(report => report.serviceYear === serviceYear)
      }
      else {
        // Get last active report and use this as current serviceYear
        const allReports = publisher.reports.sort((a, b) => b.serviceYear - a.serviceYear || b.sortOrder - a.sortOrder)
        const lastReport = allReports.find(r => r.hasBeenInService)

        if (lastReport) {
          reports         = publisher.reports.filter(report => report.serviceYear === lastReport.serviceYear)
          serviceYearText = lastReport.serviceYear.toString()
        }
        else {
          // no report is found
          serviceYearText = '?'
        }

        // Add inactive label
        page.drawText(i18n.t('label.inactive'), {
          x:    10,
          y:    page.getHeight() - 2 * 12,
          size: 12,
        })
      }

      const serviceYearField = form.createTextField(`${serviceYear}-${publisher._id}-serviceYear`)
      serviceYearField.setAlignment(TextAlignment.Center)
      serviceYearField.setText(serviceYearText)
      serviceYearField.addToPage(page, { font: customFont, x: 19.32, y: 650.29, width: 63.734, height: 17.03, borderColor: rgb(1, 1, 1) })

      for await (const report of reports) {
        switch (report.sortOrder) {
          case 0:
            hasBeenInServiceCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-0-hasBeenInService`)
            hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 625.593, width: 12.747, height: 12.747 })

            studiesField = form.createTextField(`${serviceYear}-${report.identifier}-0-studies`)
            studiesField.setAlignment(TextAlignment.Center)
            studiesField.setText(report.studies?.toString() || '')
            studiesField.addToPage(page, { font: customFont, x: 156.448, y: 623.502, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

            auxiliaryCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-0-auxiliary`)
            auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 625.593, width: 12.747, height: 12.747 })

            hoursField = form.createTextField(`${serviceYear}-${report.identifier}-0-hours`)
            hoursField.setAlignment(TextAlignment.Center)
            hoursField.setText(report.hours?.toString() || '')
            hoursField.addToPage(page, { font: customFont, x: 297.759, y: 623.502, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

            remarksField = form.createTextField(`${serviceYear}-${report.identifier}-0-remarks`)
            remarksField.setAlignment(TextAlignment.Center)
            remarksField.setText(report.remarks?.toString() || '')
            remarksField.addToPage(page, { font: customFont, x: 387.884, y: 623.502, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

            if (report.hasBeenInService) {
              hasBeenInServiceCheckbox.check()
              hasBeenInServiceCheckbox.defaultUpdateAppearances()
            }

            if (report.auxiliary) {
              auxiliaryCheckbox.check()
              auxiliaryCheckbox.defaultUpdateAppearances()
            }

            sumHours += report.hours || 0
            break
          case 1:
            hasBeenInServiceCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-1-hasBeenInService`)
            hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 605.876, width: 12.747, height: 12.747 })

            studiesField = form.createTextField(`${serviceYear}-${report.identifier}-1-studies`)
            studiesField.setAlignment(TextAlignment.Center)
            studiesField.setText(report.studies?.toString() || '')
            studiesField.addToPage(page, { font: customFont, x: 156.448, y: 603.685, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

            auxiliaryCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-1-auxiliary`)
            auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 605.876, width: 12.747, height: 12.747 })

            hoursField = form.createTextField(`${serviceYear}-${report.identifier}-1-hours`)
            hoursField.setAlignment(TextAlignment.Center)
            hoursField.setText(report.hours?.toString() || '')
            hoursField.addToPage(page, { font: customFont, x: 297.759, y: 603.685, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

            remarksField = form.createTextField(`${serviceYear}-${report.identifier}-1-remarks`)
            remarksField.setAlignment(TextAlignment.Center)
            remarksField.setText(report.remarks?.toString() || '')
            remarksField.addToPage(page, { font: customFont, x: 387.884, y: 603.685, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

            if (report.hasBeenInService) {
              hasBeenInServiceCheckbox.check()
              hasBeenInServiceCheckbox.defaultUpdateAppearances()
            }

            if (report.auxiliary) {
              auxiliaryCheckbox.check()
              auxiliaryCheckbox.defaultUpdateAppearances()
            }

            sumHours += report.hours || 0
            break
          case 2:
            hasBeenInServiceCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-2-hasBeenInService`)
            hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 586.058, width: 12.747, height: 12.747 })

            studiesField = form.createTextField(`${serviceYear}-${report.identifier}-2-studies`)
            studiesField.setAlignment(TextAlignment.Center)
            studiesField.setText(report.studies?.toString() || '')
            studiesField.addToPage(page, { font: customFont, x: 156.448, y: 583.768, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

            auxiliaryCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-2-auxiliary`)
            auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 586.058, width: 12.747, height: 12.747 })

            hoursField = form.createTextField(`${serviceYear}-${report.identifier}-2-hours`)
            hoursField.setAlignment(TextAlignment.Center)
            hoursField.setText(report.hours?.toString() || '')
            hoursField.addToPage(page, { font: customFont, x: 297.759, y: 583.768, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

            remarksField = form.createTextField(`${serviceYear}-${report.identifier}-2-remarks`)
            remarksField.setAlignment(TextAlignment.Center)
            remarksField.setText(report.remarks?.toString() || '')
            remarksField.addToPage(page, { font: customFont, x: 387.884, y: 583.768, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

            if (report.hasBeenInService) {
              hasBeenInServiceCheckbox.check()
              hasBeenInServiceCheckbox.defaultUpdateAppearances()
            }

            if (report.auxiliary) {
              auxiliaryCheckbox.check()
              auxiliaryCheckbox.defaultUpdateAppearances()
            }

            sumHours += report.hours || 0
            break
          case 3:
            hasBeenInServiceCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-3-hasBeenInService`)
            hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 566.34, width: 12.747, height: 12.747 })

            studiesField = form.createTextField(`${serviceYear}-${report.identifier}-3-studies`)
            studiesField.setAlignment(TextAlignment.Center)
            studiesField.setText(report.studies?.toString() || '')
            studiesField.addToPage(page, { font: customFont, x: 156.448, y: 563.95, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

            auxiliaryCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-3-auxiliary`)
            auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 566.34, width: 12.747, height: 12.747 })

            hoursField = form.createTextField(`${serviceYear}-${report.identifier}-3-hours`)
            hoursField.setAlignment(TextAlignment.Center)
            hoursField.setText(report.hours?.toString() || '')
            hoursField.addToPage(page, { font: customFont, x: 297.759, y: 563.95, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

            remarksField = form.createTextField(`${serviceYear}-${report.identifier}-3-remarks`)
            remarksField.setAlignment(TextAlignment.Center)
            remarksField.setText(report.remarks?.toString() || '')
            remarksField.addToPage(page, { font: customFont, x: 387.884, y: 563.95, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

            if (report.hasBeenInService) {
              hasBeenInServiceCheckbox.check()
              hasBeenInServiceCheckbox.defaultUpdateAppearances()
            }

            if (report.auxiliary) {
              auxiliaryCheckbox.check()
              auxiliaryCheckbox.defaultUpdateAppearances()
            }

            sumHours += report.hours || 0
            break
          case 4:
            hasBeenInServiceCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-4-hasBeenInService`)
            hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 546.523, width: 12.747, height: 12.747 })

            studiesField = form.createTextField(`${serviceYear}-${report.identifier}-4-studies`)
            studiesField.setAlignment(TextAlignment.Center)
            studiesField.setText(report.studies?.toString() || '')
            studiesField.addToPage(page, { font: customFont, x: 156.448, y: 544.133, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

            auxiliaryCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-4-auxiliary`)
            auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 546.523, width: 12.747, height: 12.747 })

            hoursField = form.createTextField(`${serviceYear}-${report.identifier}-4-hours`)
            hoursField.setAlignment(TextAlignment.Center)
            hoursField.setText(report.hours?.toString() || '')
            hoursField.addToPage(page, { font: customFont, x: 297.759, y: 544.133, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

            remarksField = form.createTextField(`${serviceYear}-${report.identifier}-4-remarks`)
            remarksField.setAlignment(TextAlignment.Center)
            remarksField.setText(report.remarks?.toString() || '')
            remarksField.addToPage(page, { font: customFont, x: 387.884, y: 544.133, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

            if (report.hasBeenInService) {
              hasBeenInServiceCheckbox.check()
              hasBeenInServiceCheckbox.defaultUpdateAppearances()
            }

            if (report.auxiliary) {
              auxiliaryCheckbox.check()
              auxiliaryCheckbox.defaultUpdateAppearances()
            }

            sumHours += report.hours || 0
            break
          case 5:
            hasBeenInServiceCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-5-hasBeenInService`)
            hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 526.705, width: 12.747, height: 12.747 })

            studiesField = form.createTextField(`${serviceYear}-${report.identifier}-5-studies`)
            studiesField.setAlignment(TextAlignment.Center)
            studiesField.setText(report.studies?.toString() || '')
            studiesField.addToPage(page, { font: customFont, x: 156.448, y: 524.315, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

            auxiliaryCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-5-auxiliary`)
            auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 526.705, width: 12.747, height: 12.747 })

            hoursField = form.createTextField(`${serviceYear}-${report.identifier}-5-hours`)
            hoursField.setAlignment(TextAlignment.Center)
            hoursField.setText(report.hours?.toString() || '')
            hoursField.addToPage(page, { font: customFont, x: 297.759, y: 524.315, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

            remarksField = form.createTextField(`${serviceYear}-${report.identifier}-5-remarks`)
            remarksField.setAlignment(TextAlignment.Center)
            remarksField.setText(report.remarks?.toString() || '')
            remarksField.addToPage(page, { font: customFont, x: 387.884, y: 524.315, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

            if (report.hasBeenInService) {
              hasBeenInServiceCheckbox.check()
              hasBeenInServiceCheckbox.defaultUpdateAppearances()
            }

            if (report.auxiliary) {
              auxiliaryCheckbox.check()
              auxiliaryCheckbox.defaultUpdateAppearances()
            }

            sumHours += report.hours || 0
            break
          case 6:
            hasBeenInServiceCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-6-hasBeenInService`)
            hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 506.689, width: 12.747, height: 12.747 })

            studiesField = form.createTextField(`${serviceYear}-${report.identifier}-6-studies`)
            studiesField.setAlignment(TextAlignment.Center)
            studiesField.setText(report.studies?.toString() || '')
            studiesField.addToPage(page, { font: customFont, x: 156.448, y: 504.398, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

            auxiliaryCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-6-auxiliary`)
            auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 506.689, width: 12.747, height: 12.747 })

            hoursField = form.createTextField(`${serviceYear}-${report.identifier}-6-hours`)
            hoursField.setAlignment(TextAlignment.Center)
            hoursField.setText(report.hours?.toString() || '')
            hoursField.addToPage(page, { font: customFont, x: 297.759, y: 504.398, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

            remarksField = form.createTextField(`${serviceYear}-${report.identifier}-6-remarks`)
            remarksField.setAlignment(TextAlignment.Center)
            remarksField.setText(report.remarks?.toString() || '')
            remarksField.addToPage(page, { font: customFont, x: 387.884, y: 504.398, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

            if (report.hasBeenInService) {
              hasBeenInServiceCheckbox.check()
              hasBeenInServiceCheckbox.defaultUpdateAppearances()
            }

            if (report.auxiliary) {
              auxiliaryCheckbox.check()
              auxiliaryCheckbox.defaultUpdateAppearances()
            }

            sumHours += report.hours || 0
            break
          case 7:
            hasBeenInServiceCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-7-hasBeenInService`)
            hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 486.971, width: 12.747, height: 12.747 })

            studiesField = form.createTextField(`${serviceYear}-${report.identifier}-7-studies`)
            studiesField.setAlignment(TextAlignment.Center)
            studiesField.setText(report.studies?.toString() || '')
            studiesField.addToPage(page, { font: customFont, x: 156.448, y: 484.581, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

            auxiliaryCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-7-auxiliary`)
            auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 486.971, width: 12.747, height: 12.747 })

            hoursField = form.createTextField(`${serviceYear}-${report.identifier}-7-hours`)
            hoursField.setAlignment(TextAlignment.Center)
            hoursField.setText(report.hours?.toString() || '')
            hoursField.addToPage(page, { font: customFont, x: 297.759, y: 484.581, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

            remarksField = form.createTextField(`${serviceYear}-${report.identifier}-7-remarks`)
            remarksField.setAlignment(TextAlignment.Center)
            remarksField.setText(report.remarks?.toString() || '')
            remarksField.addToPage(page, { font: customFont, x: 387.884, y: 484.581, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

            if (report.hasBeenInService) {
              hasBeenInServiceCheckbox.check()
              hasBeenInServiceCheckbox.defaultUpdateAppearances()
            }

            if (report.auxiliary) {
              auxiliaryCheckbox.check()
              auxiliaryCheckbox.defaultUpdateAppearances()
            }

            sumHours += report.hours || 0
            break
          case 8:
            hasBeenInServiceCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-8-hasBeenInService`)
            hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 467.154, width: 12.747, height: 12.747 })

            studiesField = form.createTextField(`${serviceYear}-${report.identifier}-8-studies`)
            studiesField.setAlignment(TextAlignment.Center)
            studiesField.setText(report.studies?.toString() || '')
            studiesField.addToPage(page, { font: customFont, x: 156.448, y: 464.763, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

            auxiliaryCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-8-auxiliary`)
            auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 467.154, width: 12.747, height: 12.747 })

            hoursField = form.createTextField(`${serviceYear}-${report.identifier}-8-hours`)
            hoursField.setAlignment(TextAlignment.Center)
            hoursField.setText(report.hours?.toString() || '')
            hoursField.addToPage(page, { font: customFont, x: 297.759, y: 464.763, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

            remarksField = form.createTextField(`${serviceYear}-${report.identifier}-8-remarks`)
            remarksField.setAlignment(TextAlignment.Center)
            remarksField.setText(report.remarks?.toString() || '')
            remarksField.addToPage(page, { font: customFont, x: 387.884, y: 464.763, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

            if (report.hasBeenInService) {
              hasBeenInServiceCheckbox.check()
              hasBeenInServiceCheckbox.defaultUpdateAppearances()
            }

            if (report.auxiliary) {
              auxiliaryCheckbox.check()
              auxiliaryCheckbox.defaultUpdateAppearances()
            }

            sumHours += report.hours || 0
            break
          case 9:
            hasBeenInServiceCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-9-hasBeenInService`)
            hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 447.336, width: 12.747, height: 12.747 })

            studiesField = form.createTextField(`${serviceYear}-${report.identifier}-9-studies`)
            studiesField.setAlignment(TextAlignment.Center)
            studiesField.setText(report.studies?.toString() || '')
            studiesField.addToPage(page, { font: customFont, x: 156.448, y: 444.946, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

            auxiliaryCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-9-auxiliary`)
            auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 447.336, width: 12.747, height: 12.747 })

            hoursField = form.createTextField(`${serviceYear}-${report.identifier}-9-hours`)
            hoursField.setAlignment(TextAlignment.Center)
            hoursField.setText(report.hours?.toString() || '')
            hoursField.addToPage(page, { font: customFont, x: 297.759, y: 444.946, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

            remarksField = form.createTextField(`${serviceYear}-${report.identifier}-9-remarks`)
            remarksField.setAlignment(TextAlignment.Center)
            remarksField.setText(report.remarks?.toString() || '')
            remarksField.addToPage(page, { font: customFont, x: 387.884, y: 444.946, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

            if (report.hasBeenInService) {
              hasBeenInServiceCheckbox.check()
              hasBeenInServiceCheckbox.defaultUpdateAppearances()
            }

            if (report.auxiliary) {
              auxiliaryCheckbox.check()
              auxiliaryCheckbox.defaultUpdateAppearances()
            }

            sumHours += report.hours || 0
            break
          case 10:
            hasBeenInServiceCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-10-hasBeenInService`)
            hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 427.519, width: 12.747, height: 12.747 })

            studiesField = form.createTextField(`${serviceYear}-${report.identifier}-10-studies`)
            studiesField.setAlignment(TextAlignment.Center)
            studiesField.setText(report.studies?.toString() || '')
            studiesField.addToPage(page, { font: customFont, x: 156.448, y: 425.029, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

            auxiliaryCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-10-auxiliary`)
            auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 427.519, width: 12.747, height: 12.747 })

            hoursField = form.createTextField(`${serviceYear}-${report.identifier}-10-hours`)
            hoursField.setAlignment(TextAlignment.Center)
            hoursField.setText(report.hours?.toString() || '')
            hoursField.addToPage(page, { font: customFont, x: 297.759, y: 425.029, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

            remarksField = form.createTextField(`${serviceYear}-${report.identifier}-10-remarks`)
            remarksField.setAlignment(TextAlignment.Center)
            remarksField.setText(report.remarks?.toString() || '')
            remarksField.addToPage(page, { font: customFont, x: 387.884, y: 425.029, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

            if (report.hasBeenInService) {
              hasBeenInServiceCheckbox.check()
              hasBeenInServiceCheckbox.defaultUpdateAppearances()
            }

            if (report.auxiliary) {
              auxiliaryCheckbox.check()
              auxiliaryCheckbox.defaultUpdateAppearances()
            }

            sumHours += report.hours || 0
            break
          case 11:
            hasBeenInServiceCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-11-hasBeenInService`)
            hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 407.602, width: 12.747, height: 12.747 })

            studiesField = form.createTextField(`${serviceYear}-${report.identifier}-11-studies`)
            studiesField.setAlignment(TextAlignment.Center)
            studiesField.setText(report.studies?.toString() || '')
            studiesField.addToPage(page, { font: customFont, x: 156.448, y: 405.212, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

            auxiliaryCheckbox = form.createCheckBox(`${serviceYear}-${report.identifier}-11-auxiliary`)
            auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 407.602, width: 12.747, height: 12.747 })

            hoursField = form.createTextField(`${serviceYear}-${report.identifier}-11-hours`)
            hoursField.setAlignment(TextAlignment.Center)
            hoursField.setText(report.hours?.toString() || '')
            hoursField.addToPage(page, { font: customFont, x: 297.759, y: 405.212, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

            remarksField = form.createTextField(`${serviceYear}-${report.identifier}-11-remarks`)
            remarksField.setAlignment(TextAlignment.Center)
            remarksField.setText(report.remarks?.toString() || '')
            remarksField.addToPage(page, { font: customFont, x: 387.884, y: 405.212, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

            if (report.hasBeenInService) {
              hasBeenInServiceCheckbox.check()
              hasBeenInServiceCheckbox.defaultUpdateAppearances()
            }

            if (report.auxiliary) {
              auxiliaryCheckbox.check()
              auxiliaryCheckbox.defaultUpdateAppearances()
            }

            sumHours += report.hours || 0
            break

          default:
            break
        }
      }

      const sumHoursField = form.createTextField(`${serviceYear}-${publisher._id}-sum`)
      sumHoursField.setAlignment(TextAlignment.Center)
      sumHoursField.setText(sumHours > 0 ? sumHours.toString() : '')
      sumHoursField.addToPage(page, { font: customFont, x: 297.759, y: 385.095, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })
    }

    const rawUpdateFieldAppearances = form.updateFieldAppearances.bind(form)
    form.updateFieldAppearances     = function () {
      return rawUpdateFieldAppearances(customFont)
    }

    if (flatten)
      form.flatten({ updateFieldAppearances: true })

    return await pdfDoc.save()
  }
  else {
    throw new Error('Template not found')
  }
}
