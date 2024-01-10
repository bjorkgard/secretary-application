import type Excel from 'exceljs'

function adjustColumnWidth(worksheet: Excel.Worksheet): void {
  worksheet.columns.forEach((column) => {
    const lengths   = column.values?.map(v => v?.toString().length || 0) || []
    const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'))
    column.width    = maxLength
  })
}

export default adjustColumnWidth
