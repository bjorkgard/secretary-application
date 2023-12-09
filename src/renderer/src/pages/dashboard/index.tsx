import PublisherStats from './cards/publisherStats'
import CommonExports from './cards/commonExports'
import ActiveReport from './cards/activeReport'
import MissingReports from './cards/missingReports'
import Auxiliaries from './cards/auxiliaries'
import { useState } from 'react'

export default function Dashboard(): JSX.Element {
  const [time, setTime] = useState<number>(new Date().getTime())

  window.electron.ipcRenderer.on('updated-reports', () => {
    setTime(new Date().getTime())
  })

  return (
    <div className="-mt-2 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      <PublisherStats />
      <ActiveReport key={time + 1} />
      <MissingReports key={time + 2} />
      <Auxiliaries />
      <CommonExports />
    </div>
  )
}

Dashboard.displayName = 'Dashboard'
