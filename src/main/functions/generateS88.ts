import type { PDFTextField }      from 'pdf-lib'
import { PDFDocument }            from 'pdf-lib'
import fs                         from 'fs-extra'
import i18n                       from '../../localization/i18next.config'
import type { ServiceMonthModel } from '../../types/models'
import TemplateService            from '../services/templateService'

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

export default async function generateS88(
  label: string,
  year1: MeetingAttendanceExport,
  year2?: MeetingAttendanceExport,
): Promise<Uint8Array> {
  const template = await templatesService.findByCode('S-88')

  if (template) {
    const originalPdfBytes = fs.readFileSync(template.path)
    const pdfDoc           = await PDFDocument.load(originalPdfBytes)
    const form             = pdfDoc.getForm()

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

    return await pdfDoc.save()
  }
  else {
    throw new Error('Template not found')
  }
}
