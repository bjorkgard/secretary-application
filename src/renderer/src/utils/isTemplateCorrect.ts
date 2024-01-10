import log                    from 'electron-log'
import type { TemplateModel } from 'src/types/models'
import TEMPLATES              from '../constants/templates.json'

export async function isTemplateCorrect(code: string): Promise<boolean> {
  let response = false

  await window.electron.ipcRenderer
    .invoke('get-template', { code })
    .then((template: TemplateModel) => {
      if (template) {
        if (template.date === TEMPLATES[code])
          response = true
        else
          response = false
      }
      else {
        response = false
      }
    })
    .catch((err: Error) => {
      log.error(err)
      response = false
    })

  return response
}
