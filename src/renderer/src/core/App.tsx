import { RouterProvider }               from 'react-router-dom'
import ConfirmationModalContextProvider from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import { useState }                     from 'react'
import { Spinner }                      from '@renderer/components/Spinner'
import type { iInactive }               from '@renderer/components/ShowInactive'
import { ShowInactive }                 from '@renderer/components/ShowInactive'
import router                           from './router'

function App(): JSX.Element {
  const [spinner, setSpinner]           = useState<boolean>(false)
  const [showInactive, setShowInactive] = useState<boolean>(false)
  const [inactives, setInactives]       = useState<iInactive[]>([])

  window.electron.ipcRenderer.on('show-spinner', (_, args) => {
    setSpinner(args.status)
  })

  window.electron.ipcRenderer.on('show-inactive-for-servicegroups', (_, args) => {
    setInactives(args.inactives as iInactive[])
    setSpinner(false)
    setShowInactive(true)
  })

  const closeDialog = () => {
    setShowInactive(false)
  }

  return (
    <ConfirmationModalContextProvider>
      <ShowInactive show={showInactive} inactives={inactives} handleClose={closeDialog} />
      <Spinner show={spinner} />
      <RouterProvider router={router} />
    </ConfirmationModalContextProvider>
  )
}

export default App
