import { useEffect, useState } from 'react'
import PublisherStats from './cards/publisherStats'
import CommonExports from './cards/commonExports'
import ActiveReport from './cards/activeReport'
import MissingReports from './cards/missingReports'
import Auxiliaries from './cards/auxiliaries'
import TemplateWarning from './cards/templateWarning'
import TEMPLATES from '../../constants/templates.json'
import { TemplateModel } from 'src/types/models'

export default function Dashboard(): JSX.Element {
  const [time, setTime] = useState<number>(new Date().getTime())
  const [correctTemplates, setCorrectTemplates] = useState<boolean>(true)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-templates').then((templates: TemplateModel[]) => {
      if (!templates.length) {
        // No templates found
        setCorrectTemplates(false)
      } else {
        Object.keys(TEMPLATES).forEach((key) => {
          if (!templates.find((template) => template.code === key)) {
            setCorrectTemplates(false)
          } else {
            if (templates.find((template) => template.code === key)?.date !== TEMPLATES[key]) {
              setCorrectTemplates(false)
            }
          }
        })
      }
    })
  }, [])

  window.electron.ipcRenderer.on('updated-reports', () => {
    setTime(new Date().getTime())
  })

  return (
    <div className="-mt-2 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {!correctTemplates ? <TemplateWarning /> : null}
      <PublisherStats />
      <ActiveReport key={time + 1} />
      <MissingReports key={time + 2} />
      <Auxiliaries />
      <CommonExports />
    </div>
  )
}

Dashboard.displayName = 'Dashboard'
