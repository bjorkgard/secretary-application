import { useEffect, useState } from 'react'
import type { TemplateModel }  from 'src/types/models'
import TEMPLATES               from '../../constants/templates.json'
import PublisherStats          from './cards/publisherStats'
import CommonExports           from './cards/commonExports'
import ActiveReport            from './cards/activeReport'
import MissingReports          from './cards/missingReports'
import Auxiliaries             from './cards/auxiliaries'
import TemplateWarning         from './cards/templateWarning'
import WithoutServiceGroup     from './cards/withoutServiceGroup'
import OldApplications         from './cards/oldApplications'
import MailResponses           from './cards/mailResponses'
import Information             from './cards/information'

export default function Dashboard(): JSX.Element {
  const [time, setTime]                         = useState<number>(new Date().getTime())
  const [correctTemplates, setCorrectTemplates] = useState<boolean>(true)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-templates').then((templates: TemplateModel[]) => {
      if (!templates.length) {
        // No templates found
        setCorrectTemplates(false)
      }
      else {
        Object.keys(TEMPLATES).forEach(async (key) => {
          if (!templates.find(template => template.code === key)) {
            setCorrectTemplates(false)
          }
          else {
            for (const template of templates) {
              const response = await window.electron.ipcRenderer.invoke('template-exists', { path: template.path }).then((response: boolean) => {
                return response
              })

              setCorrectTemplates(response)
              if (!response) {
                break
              }
            }

            if (templates.find(template => template.code === key)?.date !== TEMPLATES[key])
              setCorrectTemplates(false)
          }
        })
      }
    })
  }, [])

  window.electron.ipcRenderer.on('updated-reports', () => {
    setTime(new Date().getTime())
  })

  return (
    <div className="relative grid grid-cols-2 gap-[17px] xl:grid-cols-[repeat(12,_minmax(0,_1fr))]">
      {!correctTemplates ? <TemplateWarning /> : null}
      <Information />
      <PublisherStats />
      <ActiveReport key={time + 1} />
      <MissingReports key={time + 2} />
      <Auxiliaries />
      <WithoutServiceGroup />
      <OldApplications />
      <CommonExports />
      <MailResponses />
    </div>
  )
}

Dashboard.displayName = 'Dashboard'
