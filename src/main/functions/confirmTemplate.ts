// import type { PDFForm } from 'pdf-lib'
// import { PDFDocument }  from 'pdf-lib'
// import fs               from 'fs-extra'
import log from 'electron-log'

export default async function confirmTemplete(code: string, path: string): Promise<boolean> {
  // const pdfBytes = fs.readFileSync(path)
  // const pdfDoc   = await PDFDocument.load(new Uint8Array(pdfBytes))
  // const form     = pdfDoc.getForm()
  log.info(path)

  switch (code) {
    case 'S-21':
      return true
    case 'S-88':
      return true

    default:
      return false
  }
}

/*
async function confirmS21(form: PDFForm): Promise<boolean> {
  try {
    const fields = form.getFields()

    return fields.length === 75
  }
  catch (error) {
    log.error(error)
    return false
  }
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
  */
