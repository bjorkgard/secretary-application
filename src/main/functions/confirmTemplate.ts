import type { PDFForm } from 'pdf-lib'
import { PDFDocument }  from 'pdf-lib'
import fs               from 'fs-extra'
import log              from 'electron-log'

export default async function confirmTemplete(code: string, path: string): Promise<boolean> {
  const pdfBytes = fs.readFileSync(path)
  const pdfDoc   = await PDFDocument.load(pdfBytes)
  const form     = pdfDoc.getForm()

  switch (code) {
    case 'S-21':
      return confirmS21(form)
    case 'S-88':
      return confirmS88(form)

    default:
      return false
  }
}

async function confirmS21(form: PDFForm): Promise<boolean> {
  const fields = form.getFields()

  return fields.length === 75
}

async function confirmS88(form: PDFForm): Promise<boolean> {
  try {
    const fields = form.getFields()

    return fields.length === 152
  }
  catch (error) {
    log.error(error)
    return false
  }
}
