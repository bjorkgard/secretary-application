import { RouterProvider } from 'react-router-dom'
import router from './router'
import ConfirmationModalContextProvider from '@renderer/components/modalConfirmationContext'

function App(): JSX.Element {
  return (
    <ConfirmationModalContextProvider>
      <RouterProvider router={router} />
    </ConfirmationModalContextProvider>
  )
}

export default App
