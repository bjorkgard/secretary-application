import { RouterProvider }               from 'react-router-dom'
import ConfirmationModalContextProvider from '@renderer/providers/confirmationModal/confirmationModalContextProvider'
import { useState }                     from 'react'
import { Spinner }                      from '@renderer/components/Spinner'
import router                           from './router'

function App(): JSX.Element {
  const [spinner, setSpinner] = useState<boolean>(false)

  window.electron.ipcRenderer.on('show-spinner', (_, args) => {
    setSpinner(args.status)
  })

  return (
    <ConfirmationModalContextProvider>
      <Spinner show={spinner} />
      <RouterProvider router={router} />
    </ConfirmationModalContextProvider>
  )
}

export default App
