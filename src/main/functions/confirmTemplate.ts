import { PDFDocument, PDFForm } from 'pdf-lib'
import fs from 'fs-extra'

export default async function confirmTemplete(code: string, path: string): Promise<boolean> {
  const pdfBytes = fs.readFileSync(path)
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const form = pdfDoc.getForm()

  switch (code) {
    case 'S-21':
      return confirmS21(form)

    default:
      return false
  }
}

const confirmS21 = async (form: PDFForm): Promise<boolean> => {
  const fields = form.getFields()

  return fields.length === 75
}