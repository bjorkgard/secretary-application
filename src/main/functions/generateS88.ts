import type { PDFEmbeddedPage, PDFTextField }         from 'pdf-lib'
import { PDFDocument, rgb }                           from 'pdf-lib'
import fs                                             from 'fs-extra'
import i18n                                           from '../../localization/i18next.config'
import type { LanguageGroupModel, ServiceMonthModel } from '../../types/models'
import TemplateService                                from '../services/templateService'

interface MeetingAttendanceExport {
  serviceYear:   number
  serviceMonths: ServiceMonthModel[]
}

const templatesService = new TemplateService()

function average(arr: number[]): number {
  return Math.round(arr.reduce((p, c) => p + c, 0) / arr.length)
}

function sum(arr: number[]): number {
  return arr.reduce((p, c) => p + c, 0)
}

async function generatePage(counter: number, pdfDoc: PDFDocument, embededTemplate: PDFEmbeddedPage, label: string, year1: MeetingAttendanceExport, year2: MeetingAttendanceExport) {
  const page         = pdfDoc.addPage()
  const templateDims = embededTemplate.scale(1)
  page.drawPage(embededTemplate, {
    ...templateDims,
    x: page.getWidth() / 2 - templateDims.width / 2,
    y: page.getHeight() - templateDims.height,
  })

  const { height } = page.getSize()
  page.drawText(label !== 'COMBIND' ? label : i18n.t('export.altogether'), {
    x:    10,
    y:    height - 2 * 12,
    size: 12,
  })

  const averageTotal1: number[] = []
  const averageTotal2: number[] = []
  const averageTotal3: number[] = []
  const averageTotal4: number[] = []

  const form = pdfDoc.getForm()

  const sy_1 = year1.serviceYear

  const serviceYear_1 = form.createTextField(`${counter}_${sy_1}-1-year`)
  serviceYear_1.setText(sy_1.toString())
  serviceYear_1.addToPage(page, { x: 18.84, y: 715.12, width: 79.08, height: 17.70, borderColor: rgb(1, 1, 1) })

  const serviceYear_3 = form.createTextField(`${counter}_${sy_1}-3-year`)
  serviceYear_3.setText(sy_1.toString())
  serviceYear_3.addToPage(page, { x: 18.84, y: 366.16, width: 79.08, height: 17.70, borderColor: rgb(1, 1, 1) })

  let meetingsField: PDFTextField, attendanceField: PDFTextField, averageField: PDFTextField
  let meetingData:
    | { identifier: string, name?: string, midweek: number[], weekend: number[] }
    | undefined

  for await (const sm of year1.serviceMonths) {
    if (label !== 'COMBIND') {
      meetingData = sm.meetings.find(m => m.name || label === '')
    }
    else {
      meetingData = {
        identifier: 'COMBIND',
        name:       i18n.t('export.altogether'),
        midweek:    sm.meetings[0].midweek.map((_x, idx) =>
          sm.meetings.reduce((sum, curr) => sum + (curr.midweek[idx] || 0), 0),
        ),
        weekend: sm.meetings[0].weekend.map((_x, idx) =>
          sm.meetings.reduce((sum, curr) => sum + (curr.weekend[idx] || 0), 0),
        ),
      }
    }

    switch (sm.sortOrder) {
      case 0:
        // Midweek
        meetingsField = form.createTextField(`${counter}_${sy_1}-1-Meeting_1`)
        meetingsField.setText(meetingData?.midweek.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 695.2, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-1-Attendance_1`)
        attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 695.2, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-1-Average_1`)
        averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 695.2, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        // Weekend
        meetingsField = form.createTextField(`${counter}_${sy_1}-3-Meeting_1`)
        meetingsField.setText(meetingData?.weekend.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 346.24, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-3-Attendance_1`)
        attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 346.24, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-3-Average_1`)
        averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 346.24, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        if (meetingData) {
          averageTotal1.push(average(meetingData?.midweek))
          averageTotal3.push(average(meetingData?.weekend))
        }
        break
      case 1:
        // Midweek
        meetingsField = form.createTextField(`${counter}_${sy_1}-1-Meeting_2`)
        meetingsField.setText(meetingData?.midweek.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 675.28, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-1-Attendance_2`)
        attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 675.28, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-1-Average_2`)
        averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 675.28, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        // Weekend
        meetingsField = form.createTextField(`${counter}_${sy_1}-3-Meeting_2`)
        meetingsField.setText(meetingData?.weekend.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 326.44, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-3-Attendance_2`)
        attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 326.44, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-3-Average_2`)
        averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 326.44, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        if (meetingData) {
          averageTotal1.push(average(meetingData?.midweek))
          averageTotal3.push(average(meetingData?.weekend))
        }
        break
      case 2:
        // Midweek
        meetingsField = form.createTextField(`${counter}_${sy_1}-1-Meeting_3`)
        meetingsField.setText(meetingData?.midweek.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 655.48, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-1-Attendance_3`)
        attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 655.48, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-1-Average_3`)
        averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 655.48, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        // Weekend
        meetingsField = form.createTextField(`${counter}_${sy_1}-3-Meeting_3`)
        meetingsField.setText(meetingData?.weekend.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 306.52, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-3-Attendance_3`)
        attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 306.52, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-3-Average_3`)
        averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 306.52, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        if (meetingData) {
          averageTotal1.push(average(meetingData?.midweek))
          averageTotal3.push(average(meetingData?.weekend))
        }
        break
      case 3:
        // Midweek
        meetingsField = form.createTextField(`${counter}_${sy_1}-1-Meeting_4`)
        meetingsField.setText(meetingData?.midweek.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 635.56, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-1-Attendance_4`)
        attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 635.56, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-1-Average_4`)
        averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 635.56, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        // Weekend
        meetingsField = form.createTextField(`${counter}_${sy_1}-3-Meeting_4`)
        meetingsField.setText(meetingData?.weekend.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 286.6, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-3-Attendance_4`)
        attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 286.6, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-3-Average_4`)
        averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 286.6, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        if (meetingData) {
          averageTotal1.push(average(meetingData?.midweek))
          averageTotal3.push(average(meetingData?.weekend))
        }
        break
      case 4:
        // Midweek
        meetingsField = form.createTextField(`${counter}_${sy_1}-1-Meeting_5`)
        meetingsField.setText(meetingData?.midweek.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 615.76, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-1-Attendance_5`)
        attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 615.76, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-1-Average_5`)
        averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 615.76, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        // Weekend
        meetingsField = form.createTextField(`${counter}_${sy_1}-3-Meeting_5`)
        meetingsField.setText(meetingData?.weekend.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 266.8, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-3-Attendance_5`)
        attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 266.8, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-3-Average_5`)
        averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 266.8, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        if (meetingData) {
          averageTotal1.push(average(meetingData?.midweek))
          averageTotal3.push(average(meetingData?.weekend))
        }
        break
      case 5:
        // Midweek
        meetingsField = form.createTextField(`${counter}_${sy_1}-1-Meeting_6`)
        meetingsField.setText(meetingData?.midweek.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 595.96, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-1-Attendance_6`)
        attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 595.96, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-1-Average_6`)
        averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 595.96, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        // Weekend
        meetingsField = form.createTextField(`${counter}_${sy_1}-3-Meeting_6`)
        meetingsField.setText(meetingData?.weekend.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 247, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-3-Attendance_6`)
        attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 247, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-3-Average_6`)
        averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 247, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        if (meetingData) {
          averageTotal1.push(average(meetingData?.midweek))
          averageTotal3.push(average(meetingData?.weekend))
        }
        break
      case 6:
        // Midweek
        meetingsField = form.createTextField(`${counter}_${sy_1}-1-Meeting_7`)
        meetingsField.setText(meetingData?.midweek.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 576.16, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-1-Attendance_7`)
        attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 576.16, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-1-Average_7`)
        averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 576.16, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        // Weekend
        meetingsField = form.createTextField(`${counter}_${sy_1}-3-Meeting_7`)
        meetingsField.setText(meetingData?.weekend.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 227.2, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-3-Attendance_7`)
        attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 227.2, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-3-Average_7`)
        averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 227.2, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        if (meetingData) {
          averageTotal1.push(average(meetingData?.midweek))
          averageTotal3.push(average(meetingData?.weekend))
        }
        break
      case 7:
        // Midweek
        meetingsField = form.createTextField(`${counter}_${sy_1}-1-Meeting_8`)
        meetingsField.setText(meetingData?.midweek.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 556.24, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-1-Attendance_8`)
        attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 556.24, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-1-Average_8`)
        averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 556.24, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        // Weekend
        meetingsField = form.createTextField(`${counter}_${sy_1}-3-Meeting_8`)
        meetingsField.setText(meetingData?.weekend.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 207.28, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-3-Attendance_8`)
        attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 207.28, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-3-Average_8`)
        averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 207.28, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        if (meetingData) {
          averageTotal1.push(average(meetingData?.midweek))
          averageTotal3.push(average(meetingData?.weekend))
        }
        break
      case 8:
        // Midweek
        meetingsField = form.createTextField(`${counter}_${sy_1}-1-Meeting_9`)
        meetingsField.setText(meetingData?.midweek.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 536.44, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-1-Attendance_9`)
        attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 536.44, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-1-Average_9`)
        averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 536.44, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        // Weekend
        meetingsField = form.createTextField(`${counter}_${sy_1}-3-Meeting_9`)
        meetingsField.setText(meetingData?.weekend.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 187.48, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-3-Attendance_9`)
        attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 187.48, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-3-Average_9`)
        averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 187.48, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        if (meetingData) {
          averageTotal1.push(average(meetingData?.midweek))
          averageTotal3.push(average(meetingData?.weekend))
        }
        break
      case 9:
        // Midweek
        meetingsField = form.createTextField(`${counter}_${sy_1}-1-Meeting_10`)
        meetingsField.setText(meetingData?.midweek.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 516.64, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-1-Attendance_10`)
        attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 516.64, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-1-Average_10`)
        averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 516.64, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        // Weekend
        meetingsField = form.createTextField(`${counter}_${sy_1}-3-Meeting_10`)
        meetingsField.setText(meetingData?.weekend.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 167.68, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-3-Attendance_10`)
        attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 167.68, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-3-Average_10`)
        averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 167.68, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        if (meetingData) {
          averageTotal1.push(average(meetingData?.midweek))
          averageTotal3.push(average(meetingData?.weekend))
        }
        break
      case 10:
        // Midweek
        meetingsField = form.createTextField(`${counter}_${sy_1}-1-Meeting_11`)
        meetingsField.setText(meetingData?.midweek.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 496.72, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-1-Attendance_11`)
        attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 496.72, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-1-Average_11`)
        averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 496.72, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        // Weekend
        meetingsField = form.createTextField(`${counter}_${sy_1}-3-Meeting_11`)
        meetingsField.setText(meetingData?.weekend.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 147.88, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-3-Attendance_11`)
        attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 147.88, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-3-Average_11`)
        averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 147.88, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        if (meetingData) {
          averageTotal1.push(average(meetingData?.midweek))
          averageTotal3.push(average(meetingData?.weekend))
        }
        break
      case 11:
        // Midweek
        meetingsField = form.createTextField(`${counter}_${sy_1}-1-Meeting_12`)
        meetingsField.setText(meetingData?.midweek.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 477.04, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-1-Attendance_12`)
        attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 477.04, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-1-Average_12`)
        averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 477.04, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        // Weekend
        meetingsField = form.createTextField(`${counter}_${sy_1}-3-Meeting_12`)
        meetingsField.setText(meetingData?.weekend.length.toString())
        meetingsField.addToPage(page, { x: 99.6, y: 128.08, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

        attendanceField = form.createTextField(`${counter}_${sy_1}-3-Attendance_12`)
        attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
        attendanceField.addToPage(page, { x: 165.84, y: 128.08, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        averageField = form.createTextField(`${counter}_${sy_1}-3-Average_12`)
        averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
        averageField.addToPage(page, { x: 233.2, y: 128.08, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

        if (meetingData) {
          averageTotal1.push(average(meetingData?.midweek))
          averageTotal3.push(average(meetingData?.weekend))
        }
        break
      default:
        break
    }
  }

  const average_total_1 = form.createTextField(`${counter}_${sy_1}-average_total_1`)
  average_total_1.setText(averageTotal1.length > 0 ? average(averageTotal1).toString() : '')
  average_total_1.addToPage(page, { x: 233.08, y: 457.12, width: 64.92, height: 17.84, borderColor: rgb(1, 1, 1) })

  const average_total_3 = form.createTextField(`${counter}_${sy_1}-average_total_3`)
  average_total_3.setText(averageTotal3.length > 0 ? average(averageTotal3).toString() : '')
  average_total_3.addToPage(page, { x: 233.08, y: 108.16, width: 64.92, height: 17.84, borderColor: rgb(1, 1, 1) })

  if (year2) {
    const sy_2 = year2.serviceYear

    const serviceYear_2 = form.createTextField(`${counter}_${sy_2}-2-year`)
    serviceYear_2.setText(sy_2.toString())
    serviceYear_2.addToPage(page, { x: 299.28, y: 715.12, width: 79.08, height: 17.70, borderColor: rgb(1, 1, 1) })

    const serviceYear_4 = form.createTextField(`${counter}_${sy_2}-4-year`)
    serviceYear_4.setText(sy_2.toString())
    serviceYear_4.addToPage(page, { x: 299.28, y: 366.16, width: 79.08, height: 17.70, borderColor: rgb(1, 1, 1) })

    let meetingsField: PDFTextField, attendanceField: PDFTextField, averageField: PDFTextField
    let meetingData:
      | { identifier: string, name?: string, midweek: number[], weekend: number[] }
      | undefined

    for await (const sm of year2.serviceMonths) {
      if (label !== 'COMBIND') {
        meetingData = sm.meetings.find(m => m.name || label === '')
      }
      else {
        meetingData = {
          identifier: 'COMBIND',
          name:       i18n.t('export.altogether'),
          midweek:    sm.meetings[0].midweek.map((_x, idx) =>
            sm.meetings.reduce((sum, curr) => sum + (curr.midweek[idx] || 0), 0),
          ),
          weekend: sm.meetings[0].weekend.map((_x, idx) =>
            sm.meetings.reduce((sum, curr) => sum + (curr.weekend[idx] || 0), 0),
          ),
        }
      }

      switch (sm.sortOrder) {
        case 0:
        // Midweek
          meetingsField = form.createTextField(`${counter}_${sy_2}-2-Meeting_1`)
          meetingsField.setText(meetingData?.midweek.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 695.2, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-2-Attendance_1`)
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 695.2, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-2-Average_1`)
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 695.2, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          // Weekend
          meetingsField = form.createTextField(`${counter}_${sy_2}-4-Meeting_1`)
          meetingsField.setText(meetingData?.weekend.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 346.24, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-4-Attendance_1`)
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 346.24, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-4-Average_1`)
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 346.24, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          if (meetingData) {
            averageTotal2.push(average(meetingData?.midweek))
            averageTotal4.push(average(meetingData?.weekend))
          }
          break
        case 1:
        // Midweek
          meetingsField = form.createTextField(`${counter}_${sy_2}-2-Meeting_2`)
          meetingsField.setText(meetingData?.midweek.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 675.28, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-2-Attendance_2`)
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 675.28, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-2-Average_2`)
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 675.28, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          // Weekend
          meetingsField = form.createTextField(`${counter}_${sy_2}-4-Meeting_2`)
          meetingsField.setText(meetingData?.weekend.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 326.44, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-4-Attendance_2`)
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 326.44, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-4-Average_2`)
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 326.44, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          if (meetingData) {
            averageTotal2.push(average(meetingData?.midweek))
            averageTotal4.push(average(meetingData?.weekend))
          }
          break
        case 2:
        // Midweek
          meetingsField = form.createTextField(`${counter}_${sy_2}-2-Meeting_3`)
          meetingsField.setText(meetingData?.midweek.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 655.48, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-2-Attendance_3`)
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 655.48, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-2-Average_3`)
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 655.48, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          // Weekend
          meetingsField = form.createTextField(`${counter}_${sy_2}-4-Meeting_3`)
          meetingsField.setText(meetingData?.weekend.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 306.52, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-4-Attendance_3`)
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 306.52, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-4-Average_3`)
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 306.52, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          if (meetingData) {
            averageTotal2.push(average(meetingData?.midweek))
            averageTotal4.push(average(meetingData?.weekend))
          }
          break
        case 3:
        // Midweek
          meetingsField = form.createTextField(`${counter}_${sy_2}-2-Meeting_4`)
          meetingsField.setText(meetingData?.midweek.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 635.56, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-2-Attendance_4`)
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 635.56, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-2-Average_4`)
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 635.56, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          // Weekend
          meetingsField = form.createTextField(`${counter}_${sy_2}-4-Meeting_4`)
          meetingsField.setText(meetingData?.weekend.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 286.6, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-4-Attendance_4`)
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 286.6, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-4-Average_4`)
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 286.6, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          if (meetingData) {
            averageTotal2.push(average(meetingData?.midweek))
            averageTotal4.push(average(meetingData?.weekend))
          }
          break
        case 4:
        // Midweek
          meetingsField = form.createTextField(`${counter}_${sy_2}-2-Meeting_5`)
          meetingsField.setText(meetingData?.midweek.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 615.76, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-2-Attendance_5`)
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 615.76, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-2-Average_5`)
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 615.76, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          // Weekend
          meetingsField = form.createTextField(`${counter}_${sy_2}-4-Meeting_5`)
          meetingsField.setText(meetingData?.weekend.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 266.8, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-4-Attendance_5`)
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 266.8, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-4-Average_5`)
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 266.8, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          if (meetingData) {
            averageTotal2.push(average(meetingData?.midweek))
            averageTotal4.push(average(meetingData?.weekend))
          }
          break
        case 5:
        // Midweek
          meetingsField = form.createTextField(`${counter}_${sy_2}-2-Meeting_6`)
          meetingsField.setText(meetingData?.midweek.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 595.96, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-2-Attendance_6`)
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 595.96, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-2-Average_6`)
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 595.96, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          // Weekend
          meetingsField = form.createTextField(`${counter}_${sy_2}-4-Meeting_6`)
          meetingsField.setText(meetingData?.weekend.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 247, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-4-Attendance_6`)
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 247, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-4-Average_6`)
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 247, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          if (meetingData) {
            averageTotal2.push(average(meetingData?.midweek))
            averageTotal4.push(average(meetingData?.weekend))
          }
          break
        case 6:
        // Midweek
          meetingsField = form.createTextField(`${counter}_${sy_2}-2-Meeting_7`)
          meetingsField.setText(meetingData?.midweek.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 576.16, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-2-Attendance_7`)
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 576.16, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-2-Average_7`)
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 576.16, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          // Weekend
          meetingsField = form.createTextField(`${counter}_${sy_2}-4-Meeting_7`)
          meetingsField.setText(meetingData?.weekend.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 227.2, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-4-Attendance_7`)
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 227.2, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-4-Average_7`)
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 227.2, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          if (meetingData) {
            averageTotal2.push(average(meetingData?.midweek))
            averageTotal4.push(average(meetingData?.weekend))
          }
          break
        case 7:
        // Midweek
          meetingsField = form.createTextField(`${counter}_${sy_2}-2-Meeting_8`)
          meetingsField.setText(meetingData?.midweek.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 556.24, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-2-Attendance_8`)
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 556.24, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-2-Average_8`)
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 556.24, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          // Weekend
          meetingsField = form.createTextField(`${counter}_${sy_2}-4-Meeting_8`)
          meetingsField.setText(meetingData?.weekend.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 207.28, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-4-Attendance_8`)
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 207.28, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-4-Average_8`)
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 207.28, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          if (meetingData) {
            averageTotal2.push(average(meetingData?.midweek))
            averageTotal4.push(average(meetingData?.weekend))
          }
          break
        case 8:
        // Midweek
          meetingsField = form.createTextField(`${counter}_${sy_2}-2-Meeting_9`)
          meetingsField.setText(meetingData?.midweek.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 536.44, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-2-Attendance_9`)
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 536.44, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-2-Average_9`)
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 536.44, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          // Weekend
          meetingsField = form.createTextField(`${counter}_${sy_2}-4-Meeting_9`)
          meetingsField.setText(meetingData?.weekend.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 187.48, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-4-Attendance_9`)
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 187.48, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-4-Average_9`)
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 187.48, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          if (meetingData) {
            averageTotal2.push(average(meetingData?.midweek))
            averageTotal4.push(average(meetingData?.weekend))
          }
          break
        case 9:
        // Midweek
          meetingsField = form.createTextField(`${counter}_${sy_2}-2-Meeting_10`)
          meetingsField.setText(meetingData?.midweek.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 516.64, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-2-Attendance_10`)
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 516.64, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-2-Average_10`)
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 516.64, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          // Weekend
          meetingsField = form.createTextField(`${counter}_${sy_2}-4-Meeting_10`)
          meetingsField.setText(meetingData?.weekend.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 167.68, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-4-Attendance_10`)
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 167.68, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-4-Average_10`)
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 167.68, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          if (meetingData) {
            averageTotal2.push(average(meetingData?.midweek))
            averageTotal4.push(average(meetingData?.weekend))
          }
          break
        case 10:
        // Midweek
          meetingsField = form.createTextField(`${counter}_${sy_2}-2-Meeting_11`)
          meetingsField.setText(meetingData?.midweek.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 496.72, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-2-Attendance_11`)
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 496.72, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-2-Average_11`)
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 496.72, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          // Weekend
          meetingsField = form.createTextField(`${counter}_${sy_2}-4-Meeting_11`)
          meetingsField.setText(meetingData?.weekend.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 147.88, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-4-Attendance_11`)
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 147.88, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-4-Average_11`)
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 147.88, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          if (meetingData) {
            averageTotal2.push(average(meetingData?.midweek))
            averageTotal4.push(average(meetingData?.weekend))
          }
          break
        case 11:
        // Midweek
          meetingsField = form.createTextField(`${counter}_${sy_2}-2-Meeting_12`)
          meetingsField.setText(meetingData?.midweek.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 477.04, width: 62.56, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-2-Attendance_12`)
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 477.04, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-2-Average_12`)
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 477.04, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          // Weekend
          meetingsField = form.createTextField(`${counter}_${sy_2}-4-Meeting_12`)
          meetingsField.setText(meetingData?.weekend.length.toString())
          meetingsField.addToPage(page, { x: 381.04, y: 128.08, width: 62.55999, height: 17.84, borderColor: rgb(1, 1, 1) })

          attendanceField = form.createTextField(`${counter}_${sy_2}-4-Attendance_12`)
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          attendanceField.addToPage(page, { x: 447.28, y: 128.08, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          averageField = form.createTextField(`${counter}_${sy_2}-4-Average_12`)
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')
          averageField.addToPage(page, { x: 513.64, y: 128.08, width: 62.68, height: 17.84, borderColor: rgb(1, 1, 1) })

          if (meetingData) {
            averageTotal2.push(average(meetingData?.midweek))
            averageTotal4.push(average(meetingData?.weekend))
          }
          break
        default:
          break
      }
    }

    const average_total_2 = form.createTextField(`${counter}_${sy_2}-average_total_2`)
    average_total_2.setText(averageTotal2.length > 0 ? average(averageTotal2).toString() : '')
    average_total_2.addToPage(page, { x: 513.354, y: 457.12, width: 64.92, height: 17.84, borderColor: rgb(1, 1, 1) })

    const average_total_4 = form.createTextField(`${counter}_${sy_2}-average_total_4`)
    average_total_4.setText(averageTotal4.length > 0 ? average(averageTotal4).toString() : '')
    average_total_4.addToPage(page, { x: 513.354, y: 108.16, width: 64.92, height: 17.84, borderColor: rgb(1, 1, 1) })
  }
}

export default async function generateS88(
  meetingAttendanceExports: MeetingAttendanceExport[],
  languageGroups?: LanguageGroupModel[],
): Promise<Uint8Array> {
  const template = await templatesService.findByCode('S-88')

  if (template) {
    const templatePdfBytes = fs.readFileSync(template.path)
    // const pdfDoc           = await PDFDocument.load(new Uint8Array(originalPdfBytes))
    const pdfDoc            = await PDFDocument.create()
    const [embededTemplate] = await pdfDoc.embedPdf(new Uint8Array(templatePdfBytes))
    let counter             = 0

    // every meetingAttendanceExport has 2 years
    for (let index = 0; index < meetingAttendanceExports.length; index += 2) {
      await generatePage(counter, pdfDoc, embededTemplate, '', meetingAttendanceExports[index], meetingAttendanceExports[index + 1])
      counter = counter + 1

      if (languageGroups && languageGroups.length > 0) {
        for await (const languageGroup of languageGroups) {
          await generatePage(counter, pdfDoc, embededTemplate, languageGroup.name, meetingAttendanceExports[index], meetingAttendanceExports[index + 1])
          counter = counter + 1
        }

        await generatePage(counter, pdfDoc, embededTemplate, 'COMBIND', meetingAttendanceExports[index], meetingAttendanceExports[index + 1])
        counter = counter + 1
      }
    }
    /*
    // ServiceYear 1
    const serviceYear_1   = form.getTextField('Service Year_1')
    const serviceYear_3   = form.getTextField('Service Year_3')
    const average_total_1 = form.getTextField('1-Average_Total')
    const average_total_3 = form.getTextField('3-Average_Total')

    serviceYear_1.setText(year1.serviceYear.toString())
    serviceYear_3.setText(year1.serviceYear.toString())

    const averageTotal1: number[] = []
    const averageTotal2: number[] = []
    const averageTotal3: number[] = []
    const averageTotal4: number[] = []

    let meetingsField: PDFTextField, attendanceField: PDFTextField, averageField: PDFTextField
    let meetingData:
      | { identifier: string, name?: string, midweek: number[], weekend: number[] }
      | undefined

    for await (const sm of year1.serviceMonths) {
      if (label !== 'COMBIND') {
        meetingData = sm.meetings.find(m => m.name || label === '')
      }
      else {
        meetingData = {
          identifier: 'COMBIND',
          name:       i18n.t('export.altogether'),
          midweek:    sm.meetings[0].midweek.map((_x, idx) =>
            sm.meetings.reduce((sum, curr) => sum + (curr.midweek[idx] || 0), 0),
          ),
          weekend: sm.meetings[0].weekend.map((_x, idx) =>
            sm.meetings.reduce((sum, curr) => sum + (curr.weekend[idx] || 0), 0),
          ),
        }
      }

      switch (sm.sortOrder) {
        case 0:
          // Midweek
          meetingsField   = form.getTextField('1-Meeting_1')
          attendanceField = form.getTextField('1-Attendance_1')
          averageField    = form.getTextField('1-Average_1')
          meetingsField.setText(meetingData?.midweek.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

          // Weekend
          meetingsField   = form.getTextField('3-Meeting_1')
          attendanceField = form.getTextField('3-Attendance_1')
          averageField    = form.getTextField('3-Average_1')
          meetingsField.setText(meetingData?.weekend.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

          if (meetingData) {
            averageTotal1.push(average(meetingData?.midweek))
            averageTotal3.push(average(meetingData?.weekend))
          }
          break
        case 1:
          // Midweek
          meetingsField   = form.getTextField('1-Meeting_2')
          attendanceField = form.getTextField('1-Attendance_2')
          averageField    = form.getTextField('1-Average_2')
          meetingsField.setText(meetingData?.midweek.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

          // Weekend
          meetingsField   = form.getTextField('3-Meeting_2')
          attendanceField = form.getTextField('3-Attendance_2')
          averageField    = form.getTextField('3-Average_2')
          meetingsField.setText(meetingData?.weekend.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

          if (meetingData) {
            averageTotal1.push(average(meetingData?.midweek))
            averageTotal3.push(average(meetingData?.weekend))
          }
          break
        case 2:
          // Midweek
          meetingsField   = form.getTextField('1-Meeting_3')
          attendanceField = form.getTextField('1-Attendance_3')
          averageField    = form.getTextField('1-Average_3')
          meetingsField.setText(meetingData?.midweek.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

          // Weekend
          meetingsField   = form.getTextField('3-Meeting_3')
          attendanceField = form.getTextField('3-Attendance_3')
          averageField    = form.getTextField('3-Average_3')
          meetingsField.setText(meetingData?.weekend.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

          if (meetingData) {
            averageTotal1.push(average(meetingData?.midweek))
            averageTotal3.push(average(meetingData?.weekend))
          }
          break
        case 3:
          // Midweek
          meetingsField   = form.getTextField('1-Meeting_4')
          attendanceField = form.getTextField('1-Attendance_4')
          averageField    = form.getTextField('1-Average_4')
          meetingsField.setText(meetingData?.midweek.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

          // Weekend
          meetingsField   = form.getTextField('3-Meeting_4')
          attendanceField = form.getTextField('3-Attendance_4')
          averageField    = form.getTextField('3-Average_4')
          meetingsField.setText(meetingData?.weekend.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

          if (meetingData) {
            averageTotal1.push(average(meetingData?.midweek))
            averageTotal3.push(average(meetingData?.weekend))
          }
          break
        case 4:
          // Midweek
          meetingsField   = form.getTextField('1-Meeting_5')
          attendanceField = form.getTextField('1-Attendance_5')
          averageField    = form.getTextField('1-Average_5')
          meetingsField.setText(meetingData?.midweek.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

          // Weekend
          meetingsField   = form.getTextField('3-Meeting_5')
          attendanceField = form.getTextField('3-Attendance_5')
          averageField    = form.getTextField('3-Average_5')
          meetingsField.setText(meetingData?.weekend.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

          if (meetingData) {
            averageTotal1.push(average(meetingData?.midweek))
            averageTotal3.push(average(meetingData?.weekend))
          }
          break
        case 5:
          // Midweek
          meetingsField   = form.getTextField('1-Meeting_6')
          attendanceField = form.getTextField('1-Attendance_6')
          averageField    = form.getTextField('1-Average_6')
          meetingsField.setText(meetingData?.midweek.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

          // Weekend
          meetingsField   = form.getTextField('3-Meeting_6')
          attendanceField = form.getTextField('3-Attendance_6')
          averageField    = form.getTextField('3-Average_6')
          meetingsField.setText(meetingData?.weekend.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

          if (meetingData) {
            averageTotal1.push(average(meetingData?.midweek))
            averageTotal3.push(average(meetingData?.weekend))
          }
          break
        case 6:
          // Midweek
          meetingsField   = form.getTextField('1-Meeting_7')
          attendanceField = form.getTextField('1-Attendance_7')
          averageField    = form.getTextField('1-Average_7')
          meetingsField.setText(meetingData?.midweek.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

          // Weekend
          meetingsField   = form.getTextField('3-Meeting_7')
          attendanceField = form.getTextField('3-Attendance_7')
          averageField    = form.getTextField('3-Average_7')
          meetingsField.setText(meetingData?.weekend.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

          if (meetingData) {
            averageTotal1.push(average(meetingData?.midweek))
            averageTotal3.push(average(meetingData?.weekend))
          }
          break
        case 7:
          // Midweek
          meetingsField   = form.getTextField('1-Meeting_8')
          attendanceField = form.getTextField('1-Attendance_8')
          averageField    = form.getTextField('1-Average_8')
          meetingsField.setText(meetingData?.midweek.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

          // Weekend
          meetingsField   = form.getTextField('3-Meeting_8')
          attendanceField = form.getTextField('3-Attendance_8')
          averageField    = form.getTextField('3-Average_8')
          meetingsField.setText(meetingData?.weekend.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

          if (meetingData) {
            averageTotal1.push(average(meetingData?.midweek))
            averageTotal3.push(average(meetingData?.weekend))
          }
          break
        case 8:
          // Midweek
          meetingsField   = form.getTextField('1-Meeting_9')
          attendanceField = form.getTextField('1-Attendance_9')
          averageField    = form.getTextField('1-Average_9')
          meetingsField.setText(meetingData?.midweek.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

          // Weekend
          meetingsField   = form.getTextField('3-Meeting_9')
          attendanceField = form.getTextField('3-Attendance_9')
          averageField    = form.getTextField('3-Average_9')
          meetingsField.setText(meetingData?.weekend.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

          if (meetingData) {
            averageTotal1.push(average(meetingData?.midweek))
            averageTotal3.push(average(meetingData?.weekend))
          }
          break
        case 9:
          // Midweek
          meetingsField   = form.getTextField('1-Meeting_10')
          attendanceField = form.getTextField('1-Attendance_10')
          averageField    = form.getTextField('1-Average_10')
          meetingsField.setText(meetingData?.midweek.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

          // Weekend
          meetingsField   = form.getTextField('3-Meeting_10')
          attendanceField = form.getTextField('3-Attendance_10')
          averageField    = form.getTextField('3-Average_10')
          meetingsField.setText(meetingData?.weekend.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

          if (meetingData) {
            averageTotal1.push(average(meetingData?.midweek))
            averageTotal3.push(average(meetingData?.weekend))
          }
          break
        case 10:
          // Midweek
          meetingsField   = form.getTextField('1-Meeting_11')
          attendanceField = form.getTextField('1-Attendance_11')
          averageField    = form.getTextField('1-Average_11')
          meetingsField.setText(meetingData?.midweek.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

          // Weekend
          meetingsField   = form.getTextField('3-Meeting_11')
          attendanceField = form.getTextField('3-Attendance_11')
          averageField    = form.getTextField('3-Average_11')
          meetingsField.setText(meetingData?.weekend.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

          if (meetingData) {
            averageTotal1.push(average(meetingData?.midweek))
            averageTotal3.push(average(meetingData?.weekend))
          }
          break
        case 11:
          // Midweek
          meetingsField   = form.getTextField('1-Meeting_12')
          attendanceField = form.getTextField('1-Attendance_12')
          averageField    = form.getTextField('1-Average_12')
          meetingsField.setText(meetingData?.midweek.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

          // Weekend
          meetingsField   = form.getTextField('3-Meeting_12')
          attendanceField = form.getTextField('3-Attendance_12')
          averageField    = form.getTextField('3-Average_12')
          meetingsField.setText(meetingData?.weekend.length.toString())
          attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
          averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

          if (meetingData) {
            averageTotal1.push(average(meetingData?.midweek))
            averageTotal3.push(average(meetingData?.weekend))
          }
          break

        default:
          break
      }

      average_total_1.setText(averageTotal1.length > 0 ? average(averageTotal1).toString() : '')
      average_total_3.setText(averageTotal3.length > 0 ? average(averageTotal3).toString() : '')
    }

    if (year2) {
      // ServiceYear 2
      const serviceYear_2   = form.getTextField('Service Year_2')
      const serviceYear_4   = form.getTextField('Service Year_4')
      const average_total_2 = form.getTextField('2-Average_Total')
      const average_total_4 = form.getTextField('4-Average_Total')

      serviceYear_2.setText(year2.serviceYear.toString())
      serviceYear_4.setText(year2.serviceYear.toString())

      for await (const sm of year2.serviceMonths) {
        if (label !== 'COMBIND') {
          meetingData = sm.meetings.find(m => m.name || label === '')
        }
        else {
          meetingData = {
            identifier: 'COMBIND',
            name:       i18n.t('export.altogether'),
            midweek:    sm.meetings[0].midweek.map((_x, idx) =>
              sm.meetings.reduce((sum, curr) => sum + (curr.midweek[idx] || 0), 0),
            ),
            weekend: sm.meetings[0].weekend.map((_x, idx) =>
              sm.meetings.reduce((sum, curr) => sum + (curr.weekend[idx] || 0), 0),
            ),
          }
        }

        switch (sm.sortOrder) {
          case 0:
            // Midweek
            meetingsField   = form.getTextField('2-Meeting_1')
            attendanceField = form.getTextField('2-Attendance_1')
            averageField    = form.getTextField('2-Average_1')
            meetingsField.setText(meetingData?.midweek.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

            // Weekend
            meetingsField   = form.getTextField('4-Meeting_1')
            attendanceField = form.getTextField('4-Attendance_1')
            averageField    = form.getTextField('4-Average_1')
            meetingsField.setText(meetingData?.weekend.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

            if (meetingData) {
              averageTotal2.push(average(meetingData?.midweek))
              averageTotal4.push(average(meetingData?.weekend))
            }
            break
          case 1:
            // Midweek
            meetingsField   = form.getTextField('2-Meeting_2')
            attendanceField = form.getTextField('2-Attendance_2')
            averageField    = form.getTextField('2-Average_2')
            meetingsField.setText(meetingData?.midweek.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

            // Weekend
            meetingsField   = form.getTextField('4-Meeting_2')
            attendanceField = form.getTextField('4-Attendance_2')
            averageField    = form.getTextField('4-Average_2')
            meetingsField.setText(meetingData?.weekend.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

            if (meetingData) {
              averageTotal2.push(average(meetingData?.midweek))
              averageTotal4.push(average(meetingData?.weekend))
            }
            break
          case 2:
            // Midweek
            meetingsField   = form.getTextField('2-Meeting_3')
            attendanceField = form.getTextField('2-Attendance_3')
            averageField    = form.getTextField('2-Average_3')
            meetingsField.setText(meetingData?.midweek.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

            // Weekend
            meetingsField   = form.getTextField('4-Meeting_3')
            attendanceField = form.getTextField('4-Attendance_3')
            averageField    = form.getTextField('4-Average_3')
            meetingsField.setText(meetingData?.weekend.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

            if (meetingData) {
              averageTotal2.push(average(meetingData?.midweek))
              averageTotal4.push(average(meetingData?.weekend))
            }
            break
          case 3:
            // Midweek
            meetingsField   = form.getTextField('2-Meeting_4')
            attendanceField = form.getTextField('2-Attendance_4')
            averageField    = form.getTextField('2-Average_4')
            meetingsField.setText(meetingData?.midweek.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

            // Weekend
            meetingsField   = form.getTextField('4-Meeting_4')
            attendanceField = form.getTextField('4-Attendance_4')
            averageField    = form.getTextField('4-Average_4')
            meetingsField.setText(meetingData?.weekend.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

            if (meetingData) {
              averageTotal2.push(average(meetingData?.midweek))
              averageTotal4.push(average(meetingData?.weekend))
            }
            break
          case 4:
            // Midweek
            meetingsField   = form.getTextField('2-Meeting_5')
            attendanceField = form.getTextField('2-Attendance_5')
            averageField    = form.getTextField('2-Average_5')
            meetingsField.setText(meetingData?.midweek.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

            // Weekend
            meetingsField   = form.getTextField('4-Meeting_5')
            attendanceField = form.getTextField('4-Attendance_5')
            averageField    = form.getTextField('4-Average_5')
            meetingsField.setText(meetingData?.weekend.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

            if (meetingData) {
              averageTotal2.push(average(meetingData?.midweek))
              averageTotal4.push(average(meetingData?.weekend))
            }
            break
          case 5:
            // Midweek
            meetingsField   = form.getTextField('2-Meeting_6')
            attendanceField = form.getTextField('2-Attendance_6')
            averageField    = form.getTextField('2-Average_6')
            meetingsField.setText(meetingData?.midweek.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

            // Weekend
            meetingsField   = form.getTextField('4-Meeting_6')
            attendanceField = form.getTextField('4-Attendance_6')
            averageField    = form.getTextField('4-Average_6')
            meetingsField.setText(meetingData?.weekend.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

            if (meetingData) {
              averageTotal2.push(average(meetingData?.midweek))
              averageTotal4.push(average(meetingData?.weekend))
            }
            break
          case 6:
            // Midweek
            meetingsField   = form.getTextField('2-Meeting_7')
            attendanceField = form.getTextField('2-Attendance_7')
            averageField    = form.getTextField('2-Average_7')
            meetingsField.setText(meetingData?.midweek.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

            // Weekend
            meetingsField   = form.getTextField('4-Meeting_7')
            attendanceField = form.getTextField('4-Attendance_7')
            averageField    = form.getTextField('4-Average_7')
            meetingsField.setText(meetingData?.weekend.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

            if (meetingData) {
              averageTotal2.push(average(meetingData?.midweek))
              averageTotal4.push(average(meetingData?.weekend))
            }
            break
          case 7:
            // Midweek
            meetingsField   = form.getTextField('2-Meeting_8')
            attendanceField = form.getTextField('2-Attendance_8')
            averageField    = form.getTextField('2-Average_8')
            meetingsField.setText(meetingData?.midweek.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

            // Weekend
            meetingsField   = form.getTextField('4-Meeting_8')
            attendanceField = form.getTextField('4-Attendance_8')
            averageField    = form.getTextField('4-Average_8')
            meetingsField.setText(meetingData?.weekend.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

            if (meetingData) {
              averageTotal2.push(average(meetingData?.midweek))
              averageTotal4.push(average(meetingData?.weekend))
            }
            break
          case 8:
            // Midweek
            meetingsField   = form.getTextField('2-Meeting_9')
            attendanceField = form.getTextField('2-Attendance_9')
            averageField    = form.getTextField('2-Average_9')
            meetingsField.setText(meetingData?.midweek.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

            // Weekend
            meetingsField   = form.getTextField('4-Meeting_9')
            attendanceField = form.getTextField('4-Attendance_9')
            averageField    = form.getTextField('4-Average_9')
            meetingsField.setText(meetingData?.weekend.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

            if (meetingData) {
              averageTotal2.push(average(meetingData?.midweek))
              averageTotal4.push(average(meetingData?.weekend))
            }
            break
          case 9:
            // Midweek
            meetingsField   = form.getTextField('2-Meeting_10')
            attendanceField = form.getTextField('2-Attendance_10')
            averageField    = form.getTextField('2-Average_10')
            meetingsField.setText(meetingData?.midweek.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

            // Weekend
            meetingsField   = form.getTextField('4-Meeting_10')
            attendanceField = form.getTextField('4-Attendance_10')
            averageField    = form.getTextField('4-Average_10')
            meetingsField.setText(meetingData?.weekend.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

            if (meetingData) {
              averageTotal2.push(average(meetingData?.midweek))
              averageTotal4.push(average(meetingData?.weekend))
            }
            break
          case 10:
            // Midweek
            meetingsField   = form.getTextField('2-Meeting_11')
            attendanceField = form.getTextField('2-Attendance_11')
            averageField    = form.getTextField('2-Average_11')
            meetingsField.setText(meetingData?.midweek.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

            // Weekend
            meetingsField   = form.getTextField('4-Meeting_11')
            attendanceField = form.getTextField('4-Attendance_11')
            averageField    = form.getTextField('4-Average_11')
            meetingsField.setText(meetingData?.weekend.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

            if (meetingData) {
              averageTotal2.push(average(meetingData?.midweek))
              averageTotal4.push(average(meetingData?.weekend))
            }
            break
          case 11:
            // Midweek
            meetingsField   = form.getTextField('2-Meeting_12')
            attendanceField = form.getTextField('2-Attendance_12')
            averageField    = form.getTextField('2-Average_12')
            meetingsField.setText(meetingData?.midweek.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.midweek).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.midweek).toString() : '')

            // Weekend
            meetingsField   = form.getTextField('4-Meeting_12')
            attendanceField = form.getTextField('4-Attendance_12')
            averageField    = form.getTextField('4-Average_12')
            meetingsField.setText(meetingData?.weekend.length.toString())
            attendanceField.setText(meetingData ? sum(meetingData?.weekend).toString() : '')
            averageField.setText(meetingData ? average(meetingData?.weekend).toString() : '')

            if (meetingData) {
              averageTotal2.push(average(meetingData?.midweek))
              averageTotal4.push(average(meetingData?.weekend))
            }
            break

          default:
            break
        }

        average_total_2.setText(averageTotal2.length > 0 ? average(averageTotal2).toString() : '')
        average_total_4.setText(averageTotal4.length > 0 ? average(averageTotal4).toString() : '')
      }
    }

    const pages      = pdfDoc.getPages()
    const { height } = pages[0].getSize()
    pages[0].drawText(label !== 'COMBIND' ? label : i18n.t('export.altogether'), {
      x:    10,
      y:    height - 2 * 12,
      size: 12,
    })

    */
    return await pdfDoc.save()
  }
  else {
    throw new Error('Template not found')
  }
}
