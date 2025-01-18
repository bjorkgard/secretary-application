import path                                                         from 'node:path'
import type { PDFCheckBox, PDFEmbeddedPage, PDFFont, PDFTextField } from 'pdf-lib'
import { PDFDocument, TextAlignment, rgb }                          from 'pdf-lib'
import fontkit                                                      from '@pdf-lib/fontkit'
import fs                                                           from 'fs-extra'
import i18n                                                         from '../../localization/i18next.config'
import TemplateService                                              from '../services/templateService'
import type { PublisherModel, Report, ServiceMonthModel }           from '../../types/models'
import isDev                                                        from './isDev'

const templatesService = new TemplateService()

async function generatePage(congregationName: string, type: string, pdfDoc: PDFDocument, embededTemplate: PDFEmbeddedPage, serviceMonths: ServiceMonthModel[]): Promise<void> {
  const page         = pdfDoc.addPage()
  const templateDims = embededTemplate.scale(1)
  page.drawPage(embededTemplate, {
    ...templateDims,
    x: page.getWidth() / 2 - templateDims.width / 2,
    y: page.getHeight() - templateDims.height,
  })

  const form = pdfDoc.getForm()
  const name = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-name`)
  name.setText(congregationName)
  name.addToPage(page, { x: 51.983, y: 762.224, width: 526.307, height: 15.635, borderColor: rgb(1, 1, 1) })

  const manCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-man`)
  manCheckbox.addToPage(page, { x: 384.1, y: 746.689, width: 10.356, height: 10.356 })

  const womanCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-woman`)
  womanCheckbox.addToPage(page, { x: 485.577, y: 746.689, width: 10.356, height: 10.356 })

  const otherSheepCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-otherSheep`)
  otherSheepCheckbox.addToPage(page, { x: 384.1, y: 730.357, width: 10.356, height: 10.356 })

  const anointedCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-anointed`)
  anointedCheckbox.addToPage(page, { x: 485.577, y: 730.357, width: 10.356, height: 10.356 })

  const elderCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-elder`)
  elderCheckbox.addToPage(page, { x: 16.83, y: 714.224, width: 10.356, height: 10.356 })

  const ministerialServantCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-ministerialServant`)
  ministerialServantCheckbox.addToPage(page, { x: 84.647, y: 714.224, width: 10.356, height: 10.356 })

  const pioneerCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-pioneer`)
  pioneerCheckbox.addToPage(page, { x: 218.788, y: 714.224, width: 10.356, height: 10.356 })

  const specialPioneerCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-specialPioneer`)
  specialPioneerCheckbox.addToPage(page, { x: 336.199, y: 714.224, width: 10.356, height: 10.356 })

  const missionaryCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-missionary`)
  missionaryCheckbox.addToPage(page, { x: 444.747, y: 714.224, width: 10.356, height: 10.356 })

  if (type === 'PIONEER') {
    pioneerCheckbox.check()
    pioneerCheckbox.defaultUpdateAppearances()
  }

  if (type === 'SPECIALPIONEER') {
    specialPioneerCheckbox.check()
    specialPioneerCheckbox.defaultUpdateAppearances()
  }

  if (type === 'MISSIONARY') {
    missionaryCheckbox.check()
    missionaryCheckbox.defaultUpdateAppearances()
  }

  const serviceYearField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-serviceYear`)
  serviceYearField.setAlignment(TextAlignment.Center)
  serviceYearField.setText(serviceMonths[0].serviceYear.toString())
  serviceYearField.addToPage(page, { x: 19.32, y: 650.29, width: 63.734, height: 17.03, borderColor: rgb(1, 1, 1) })

  // Fill reports
  let sumHours = 0
  let hasBeenInServiceCheckbox: PDFCheckBox,
    studiesField: PDFTextField,
    auxiliaryCheckbox: PDFCheckBox,
    hoursField: PDFTextField,
    remarksField: PDFTextField

  for await (const serviceMonth of serviceMonths) {
    let reports: Report[]

    if (type === 'TOTAL') {
      reports = serviceMonth.reports.filter(report => report.hasBeenInService)
    }
    else if (type === 'PUBLISHER') {
      reports = serviceMonth.reports.filter(report => (report.type === type && !report.auxiliary) && report.hasBeenInService)
    }
    else if (type === 'AUXILIARY') {
      reports = serviceMonth.reports.filter(report => (report.type === type || report.auxiliary) && report.hasBeenInService)
    }
    else {
      reports = serviceMonth.reports.filter(report => report.type === type && report.hasBeenInService)
    }

    switch (serviceMonth.sortOrder) {
      case 0:
        hasBeenInServiceCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-0-hasBeenInService`)
        hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 625.593, width: 12.747, height: 12.747 })
        hasBeenInServiceCheckbox.check()
        hasBeenInServiceCheckbox.defaultUpdateAppearances()

        studiesField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-0-studies`)
        studiesField.setAlignment(TextAlignment.Center)
        studiesField.setText(reports.length ? Math.round(reports.reduce((a, b) => a + (b.studies || 0), 0)).toString() : '')
        studiesField.addToPage(page, { x: 156.448, y: 623.502, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

        auxiliaryCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-0-auxiliary`)
        auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 625.593, width: 12.747, height: 12.747 })
        if (type === 'AUXILIARY') {
          auxiliaryCheckbox.check()
          auxiliaryCheckbox.defaultUpdateAppearances()
        }

        hoursField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-0-hours`)
        hoursField.setAlignment(TextAlignment.Center)
        hoursField.setText(type !== 'PUBLISHER' ? Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)).toLocaleString() : '')
        hoursField.addToPage(page, { x: 297.759, y: 623.502, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

        remarksField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-0-remarks`)
        remarksField.setAlignment(TextAlignment.Center)
        remarksField.setText(reports.length ? i18n.t('export.countReports', { count: reports.length }) : '')
        remarksField.addToPage(page, { x: 387.884, y: 623.502, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

        sumHours += Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)) || 0
        break
      case 1:
        hasBeenInServiceCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-1-hasBeenInService`)
        hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 605.876, width: 12.747, height: 12.747 })
        hasBeenInServiceCheckbox.check()
        hasBeenInServiceCheckbox.defaultUpdateAppearances()

        studiesField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-1-studies`)
        studiesField.setAlignment(TextAlignment.Center)
        studiesField.setText(reports.length ? Math.round(reports.reduce((a, b) => a + (b.studies || 0), 0)).toString() : '')
        studiesField.addToPage(page, { x: 156.448, y: 603.685, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

        auxiliaryCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-1-auxiliary`)
        auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 605.876, width: 12.747, height: 12.747 })
        if (type === 'AUXILIARY') {
          auxiliaryCheckbox.check()
          auxiliaryCheckbox.defaultUpdateAppearances()
        }

        hoursField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-1-hours`)
        hoursField.setAlignment(TextAlignment.Center)
        hoursField.setText(type !== 'PUBLISHER' ? Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)).toLocaleString() : '')
        hoursField.addToPage(page, { x: 297.759, y: 603.685, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

        remarksField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-1-remarks`)
        remarksField.setAlignment(TextAlignment.Center)
        remarksField.setText(reports.length ? i18n.t('export.countReports', { count: reports.length }) : '')
        remarksField.addToPage(page, { x: 387.884, y: 603.685, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

        sumHours += Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)) || 0
        break
      case 2:
        hasBeenInServiceCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-2-hasBeenInService`)
        hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 586.058, width: 12.747, height: 12.747 })
        hasBeenInServiceCheckbox.check()
        hasBeenInServiceCheckbox.defaultUpdateAppearances()

        studiesField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-2-studies`)
        studiesField.setAlignment(TextAlignment.Center)
        studiesField.setText(reports.length ? Math.round(reports.reduce((a, b) => a + (b.studies || 0), 0)).toString() : '')
        studiesField.addToPage(page, { x: 156.448, y: 583.768, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

        auxiliaryCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-2-auxiliary`)
        auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 586.058, width: 12.747, height: 12.747 })
        if (type === 'AUXILIARY') {
          auxiliaryCheckbox.check()
          auxiliaryCheckbox.defaultUpdateAppearances()
        }

        hoursField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-2-hours`)
        hoursField.setAlignment(TextAlignment.Center)
        hoursField.setText(type !== 'PUBLISHER' ? Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)).toLocaleString() : '')
        hoursField.addToPage(page, { x: 297.759, y: 583.768, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

        remarksField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-2-remarks`)
        remarksField.setAlignment(TextAlignment.Center)
        remarksField.setText(reports.length ? i18n.t('export.countReports', { count: reports.length }) : '')
        remarksField.addToPage(page, { x: 387.884, y: 583.768, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

        sumHours += Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)) || 0
        break
      case 3:
        hasBeenInServiceCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-3-hasBeenInService`)
        hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 566.34, width: 12.747, height: 12.747 })
        hasBeenInServiceCheckbox.check()
        hasBeenInServiceCheckbox.defaultUpdateAppearances()

        studiesField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-3-studies`)
        studiesField.setAlignment(TextAlignment.Center)
        studiesField.setText(reports.length ? Math.round(reports.reduce((a, b) => a + (b.studies || 0), 0)).toString() : '')
        studiesField.addToPage(page, { x: 156.448, y: 563.95, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

        auxiliaryCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-3-auxiliary`)
        auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 566.34, width: 12.747, height: 12.747 })
        if (type === 'AUXILIARY') {
          auxiliaryCheckbox.check()
          auxiliaryCheckbox.defaultUpdateAppearances()
        }

        hoursField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-3-hours`)
        hoursField.setAlignment(TextAlignment.Center)
        hoursField.setText(type !== 'PUBLISHER' ? Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)).toLocaleString() : '')
        hoursField.addToPage(page, { x: 297.759, y: 563.95, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

        remarksField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-3-remarks`)
        remarksField.setAlignment(TextAlignment.Center)
        remarksField.setText(reports.length ? i18n.t('export.countReports', { count: reports.length }) : '')
        remarksField.addToPage(page, { x: 387.884, y: 563.95, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

        sumHours += Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)) || 0
        break
      case 4:
        hasBeenInServiceCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-4-hasBeenInService`)
        hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 546.523, width: 12.747, height: 12.747 })
        hasBeenInServiceCheckbox.check()
        hasBeenInServiceCheckbox.defaultUpdateAppearances()

        studiesField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-4-studies`)
        studiesField.setAlignment(TextAlignment.Center)
        studiesField.setText(reports.length ? Math.round(reports.reduce((a, b) => a + (b.studies || 0), 0)).toString() : '')
        studiesField.addToPage(page, { x: 156.448, y: 544.133, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

        auxiliaryCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-4-auxiliary`)
        auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 546.523, width: 12.747, height: 12.747 })
        if (type === 'AUXILIARY') {
          auxiliaryCheckbox.check()
          auxiliaryCheckbox.defaultUpdateAppearances()
        }

        hoursField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-4-hours`)
        hoursField.setAlignment(TextAlignment.Center)
        hoursField.setText(type !== 'PUBLISHER' ? Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)).toLocaleString() : '')
        hoursField.addToPage(page, { x: 297.759, y: 544.133, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

        remarksField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-4-remarks`)
        remarksField.setAlignment(TextAlignment.Center)
        remarksField.setText(reports.length ? i18n.t('export.countReports', { count: reports.length }) : '')
        remarksField.addToPage(page, { x: 387.884, y: 544.133, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

        sumHours += Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)) || 0
        break
      case 5:
        hasBeenInServiceCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-5-hasBeenInService`)
        hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 526.705, width: 12.747, height: 12.747 })
        hasBeenInServiceCheckbox.check()
        hasBeenInServiceCheckbox.defaultUpdateAppearances()

        studiesField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-5-studies`)
        studiesField.setAlignment(TextAlignment.Center)
        studiesField.setText(reports.length ? Math.round(reports.reduce((a, b) => a + (b.studies || 0), 0)).toString() : '')
        studiesField.addToPage(page, { x: 156.448, y: 524.315, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

        auxiliaryCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-5-auxiliary`)
        auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 526.705, width: 12.747, height: 12.747 })
        if (type === 'AUXILIARY') {
          auxiliaryCheckbox.check()
          auxiliaryCheckbox.defaultUpdateAppearances()
        }

        hoursField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-5-hours`)
        hoursField.setAlignment(TextAlignment.Center)
        hoursField.setText(type !== 'PUBLISHER' ? Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)).toLocaleString() : '')
        hoursField.addToPage(page, { x: 297.759, y: 524.315, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

        remarksField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-5-remarks`)
        remarksField.setAlignment(TextAlignment.Center)
        remarksField.setText(reports.length ? i18n.t('export.countReports', { count: reports.length }) : '')
        remarksField.addToPage(page, { x: 387.884, y: 524.315, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

        sumHours += Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)) || 0
        break
      case 6:
        hasBeenInServiceCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-6-hasBeenInService`)
        hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 506.689, width: 12.747, height: 12.747 })
        hasBeenInServiceCheckbox.check()
        hasBeenInServiceCheckbox.defaultUpdateAppearances()

        studiesField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-6-studies`)
        studiesField.setAlignment(TextAlignment.Center)
        studiesField.setText(reports.length ? Math.round(reports.reduce((a, b) => a + (b.studies || 0), 0)).toString() : '')
        studiesField.addToPage(page, { x: 156.448, y: 504.398, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

        auxiliaryCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-6-auxiliary`)
        auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 506.689, width: 12.747, height: 12.747 })
        if (type === 'AUXILIARY') {
          auxiliaryCheckbox.check()
          auxiliaryCheckbox.defaultUpdateAppearances()
        }

        hoursField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-6-hours`)
        hoursField.setAlignment(TextAlignment.Center)
        hoursField.setText(type !== 'PUBLISHER' ? Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)).toLocaleString() : '')
        hoursField.addToPage(page, { x: 297.759, y: 504.398, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

        remarksField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-6-remarks`)
        remarksField.setAlignment(TextAlignment.Center)
        remarksField.setText(reports.length ? i18n.t('export.countReports', { count: reports.length }) : '')
        remarksField.addToPage(page, { x: 387.884, y: 504.398, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

        sumHours += Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)) || 0
        break
      case 7:
        hasBeenInServiceCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-7-hasBeenInService`)
        hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 486.971, width: 12.747, height: 12.747 })
        hasBeenInServiceCheckbox.check()
        hasBeenInServiceCheckbox.defaultUpdateAppearances()

        studiesField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-7-studies`)
        studiesField.setAlignment(TextAlignment.Center)
        studiesField.setText(reports.length ? Math.round(reports.reduce((a, b) => a + (b.studies || 0), 0)).toString() : '')
        studiesField.addToPage(page, { x: 156.448, y: 484.581, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

        auxiliaryCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-7-auxiliary`)
        auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 486.971, width: 12.747, height: 12.747 })
        if (type === 'AUXILIARY') {
          auxiliaryCheckbox.check()
          auxiliaryCheckbox.defaultUpdateAppearances()
        }

        hoursField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-7-hours`)
        hoursField.setAlignment(TextAlignment.Center)
        hoursField.setText(type !== 'PUBLISHER' ? Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)).toLocaleString() : '')
        hoursField.addToPage(page, { x: 297.759, y: 484.581, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

        remarksField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-7-remarks`)
        remarksField.setAlignment(TextAlignment.Center)
        remarksField.setText(reports.length ? i18n.t('export.countReports', { count: reports.length }) : '')
        remarksField.addToPage(page, { x: 387.884, y: 484.581, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

        sumHours += Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)) || 0
        break
      case 8:
        hasBeenInServiceCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-8-hasBeenInService`)
        hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 467.154, width: 12.747, height: 12.747 })
        hasBeenInServiceCheckbox.check()
        hasBeenInServiceCheckbox.defaultUpdateAppearances()

        studiesField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-8-studies`)
        studiesField.setAlignment(TextAlignment.Center)
        studiesField.setText(reports.length ? Math.round(reports.reduce((a, b) => a + (b.studies || 0), 0)).toString() : '')
        studiesField.addToPage(page, { x: 156.448, y: 464.763, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

        auxiliaryCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-8-auxiliary`)
        auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 467.154, width: 12.747, height: 12.747 })
        if (type === 'AUXILIARY') {
          auxiliaryCheckbox.check()
          auxiliaryCheckbox.defaultUpdateAppearances()
        }

        hoursField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-8-hours`)
        hoursField.setAlignment(TextAlignment.Center)
        hoursField.setText(type !== 'PUBLISHER' ? Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)).toLocaleString() : '')
        hoursField.addToPage(page, { x: 297.759, y: 464.763, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

        remarksField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-8-remarks`)
        remarksField.setAlignment(TextAlignment.Center)
        remarksField.setText(reports.length ? i18n.t('export.countReports', { count: reports.length }) : '')
        remarksField.addToPage(page, { x: 387.884, y: 464.763, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

        sumHours += Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)) || 0
        break
      case 9:
        hasBeenInServiceCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-9-hasBeenInService`)
        hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 447.336, width: 12.747, height: 12.747 })
        hasBeenInServiceCheckbox.check()
        hasBeenInServiceCheckbox.defaultUpdateAppearances()

        studiesField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-9-studies`)
        studiesField.setAlignment(TextAlignment.Center)
        studiesField.setText(reports.length ? Math.round(reports.reduce((a, b) => a + (b.studies || 0), 0)).toString() : '')
        studiesField.addToPage(page, { x: 156.448, y: 444.946, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

        auxiliaryCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-9-auxiliary`)
        auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 447.336, width: 12.747, height: 12.747 })
        if (type === 'AUXILIARY') {
          auxiliaryCheckbox.check()
          auxiliaryCheckbox.defaultUpdateAppearances()
        }

        hoursField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-9-hours`)
        hoursField.setAlignment(TextAlignment.Center)
        hoursField.setText(type !== 'PUBLISHER' ? Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)).toLocaleString() : '')
        hoursField.addToPage(page, { x: 297.759, y: 444.946, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

        remarksField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-9-remarks`)
        remarksField.setAlignment(TextAlignment.Center)
        remarksField.setText(reports.length ? i18n.t('export.countReports', { count: reports.length }) : '')
        remarksField.addToPage(page, { x: 387.884, y: 444.946, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

        sumHours += Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)) || 0
        break
      case 10:
        hasBeenInServiceCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-10-hasBeenInService`)
        hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 427.519, width: 12.747, height: 12.747 })
        hasBeenInServiceCheckbox.check()
        hasBeenInServiceCheckbox.defaultUpdateAppearances()

        studiesField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-10-studies`)
        studiesField.setAlignment(TextAlignment.Center)
        studiesField.setText(reports.length ? Math.round(reports.reduce((a, b) => a + (b.studies || 0), 0)).toString() : '')
        studiesField.addToPage(page, { x: 156.448, y: 425.029, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

        auxiliaryCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-10-auxiliary`)
        auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 427.519, width: 12.747, height: 12.747 })
        if (type === 'AUXILIARY') {
          auxiliaryCheckbox.check()
          auxiliaryCheckbox.defaultUpdateAppearances()
        }

        hoursField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-10-hours`)
        hoursField.setAlignment(TextAlignment.Center)
        hoursField.setText(type !== 'PUBLISHER' ? Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)).toLocaleString() : '')
        hoursField.addToPage(page, { x: 297.759, y: 425.029, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

        remarksField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-10-remarks`)
        remarksField.setAlignment(TextAlignment.Center)
        remarksField.setText(reports.length ? i18n.t('export.countReports', { count: reports.length }) : '')
        remarksField.addToPage(page, { x: 387.884, y: 425.029, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

        sumHours += Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)) || 0
        break
      case 11:
        hasBeenInServiceCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-11-hasBeenInService`)
        hasBeenInServiceCheckbox.addToPage(page, { x: 113.228, y: 407.602, width: 12.747, height: 12.747 })
        hasBeenInServiceCheckbox.check()
        hasBeenInServiceCheckbox.defaultUpdateAppearances()

        studiesField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-11-studies`)
        studiesField.setAlignment(TextAlignment.Center)
        studiesField.setText(reports.length ? Math.round(reports.reduce((a, b) => a + (b.studies || 0), 0)).toString() : '')
        studiesField.addToPage(page, { x: 156.448, y: 405.212, width: 67.618, height: 17.029, borderColor: rgb(1, 1, 1) })

        auxiliaryCheckbox = form.createCheckBox(`${type}-${serviceMonths[0].serviceYear}-11-auxiliary`)
        auxiliaryCheckbox.addToPage(page, { x: 254.44, y: 407.602, width: 12.747, height: 12.747 })
        if (type === 'AUXILIARY') {
          auxiliaryCheckbox.check()
          auxiliaryCheckbox.defaultUpdateAppearances()
        }

        hoursField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-11-hours`)
        hoursField.setAlignment(TextAlignment.Center)
        hoursField.setText(type !== 'PUBLISHER' ? Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)).toLocaleString() : '')
        hoursField.addToPage(page, { x: 297.759, y: 405.212, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })

        remarksField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-11-remarks`)
        remarksField.setAlignment(TextAlignment.Center)
        remarksField.setText(reports.length ? i18n.t('export.countReports', { count: reports.length }) : '')
        remarksField.addToPage(page, { x: 387.884, y: 405.212, width: 187.817, height: 17.029, borderColor: rgb(1, 1, 1) })

        sumHours += Math.round(reports.reduce((a, b) => a + (b.hours || 0), 0)) || 0
        break

      default:
        break
    }
  }

  const sumHoursField = form.createTextField(`${type}-${serviceMonths[0].serviceYear}-sum`)
  sumHoursField.setAlignment(TextAlignment.Center)
  sumHoursField.setText(sumHours > 0 ? sumHours.toLocaleString() : '')
  sumHoursField.addToPage(page, { x: 297.759, y: 385.095, width: 87.436, height: 17.029, borderColor: rgb(1, 1, 1) })
}

export default async function generateCongregationS21(
  congregation: string,
  serviceMonths: ServiceMonthModel[],
  publishers: PublisherModel[],
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
    // const pdfDoc           = await PDFDocument.load(new Uint8Array(originalPdfBytes))
    const pdfDoc            = await PDFDocument.create()
    const [embededTemplate] = await pdfDoc.embedPdf(new Uint8Array(templatePdfBytes))

    if (fontBytes) {
      pdfDoc.registerFontkit(fontkit)
      await pdfDoc.embedFont(new Uint8Array(fontBytes))
      customFont = await pdfDoc.embedFont(new Uint8Array(fontBytes))
    }

    // SPECIAL PIONEERS
    if (publishers.some(p => p.appointments.some(a => a.type === 'SPECIALPIONEER'))) {
      await generatePage(congregation, 'SPECIALPIONEER', pdfDoc, embededTemplate, serviceMonths)
    }

    // MISSIONARY
    if (publishers.some(p => p.appointments.some(a => a.type === 'MISSIONARY'))) {
      await generatePage(congregation, 'MISSIONARY', pdfDoc, embededTemplate, serviceMonths)
    }

    // PIONEER
    if (publishers.some(p => p.appointments.some(a => a.type === 'PIONEER'))) {
      await generatePage(congregation, 'PIONEER', pdfDoc, embededTemplate, serviceMonths)
    }

    // AUXILIARY
    await generatePage(congregation, 'AUXILIARY', pdfDoc, embededTemplate, serviceMonths)

    // PUBLISHER
    await generatePage(congregation, 'PUBLISHER', pdfDoc, embededTemplate, serviceMonths)

    // TOTAL
    await generatePage(congregation, 'TOTAL', pdfDoc, embededTemplate, serviceMonths)

    const form = pdfDoc.getForm()

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
