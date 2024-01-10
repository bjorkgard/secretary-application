import log from 'electron-log'
import { TemplateModel } from 'src/types/models'
import TEMPLATES from '../constants/templates.json'

export const isTemplateCorrect = async (code: string): Promise<boolean> => {
  let response = false

  await window.electron.ipcRenderer
    .invoke('get-template', { code: code })
    .then((template: TemplateModel) => {
      if (template) {
        if (template.date === TEMPLATES[code]) {
          response = true
        } else {
          response = false
        }
      } else {
        response = false
      }
    })
    .catch((err: Error) => {
      log.error(err)
      response = false
    })

  return response
}
