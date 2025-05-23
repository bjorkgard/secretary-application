import { RouterProvider }               from 'react-router-dom'
import ConfirmationModalContextProvider from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import { useState }                     from 'react'
import { Spinner }                      from '@renderer/components/Spinner'
import type { iInactive }               from '@renderer/components/ShowInactive'
import { ShowInactive }                 from '@renderer/components/ShowInactive'
import type { iPublisher }              from '@renderer/components/ShowImport'
import { ShowImport }                   from '@renderer/components/ShowImport'
import router                           from './router'

function App(): JSX.Element {
  const [spinner, setSpinner]           = useState<boolean>(false)
  const [showInactive, setShowInactive] = useState<boolean>(false)
  const [showImport, setShowImport]     = useState<boolean>(false)
  const [inactives, setInactives]       = useState<iInactive[]>([])
  const [publishers, setPublishers]     = useState<iInactive[]>([])
  const [type, setType]                 = useState<'PDF' | 'XLSX'>('PDF')

  window.electron.ipcRenderer.on('show-spinner', (_, args) => {
    setSpinner(args.status)
  })

  window.electron.ipcRenderer.on('show-inactive-for-servicegroups', (_, args) => {
    setInactives(args.inactives as iInactive[])
    setSpinner(false)
    setShowInactive(true)
    setType(args.type)
  })

  window.electron.ipcRenderer.on('show-publishers-for-import', (_, args) => {
    setPublishers(args.publishers as iPublisher[])
    setSpinner(false)
    setShowImport(true)
  })

  const closeDialog = () => {
    setShowInactive(false)
    setShowImport(false)
  }

  return (
    <ConfirmationModalContextProvider>
      <ShowInactive show={showInactive} inactives={inactives} handleClose={closeDialog} type={type} />
      <ShowImport show={showImport} publishers={publishers} handleClose={closeDialog} />
      <Spinner show={spinner} />
      <RouterProvider router={router} />
    </ConfirmationModalContextProvider>
  )
}

export default App
