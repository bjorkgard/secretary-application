import { Outlet }     from 'react-router-dom'
import { FullLayout } from '@renderer/components/catalyst/full-layout'
import { Navigation } from './Navigation'
import { Header }     from './Header'

export default function Layout(): JSX.Element {
  return (
    <FullLayout navbar={<Header />} sidebar={<Navigation />}>
      <Outlet />
    </FullLayout>
  )
}
