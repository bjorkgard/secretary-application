import { FC, lazy, Suspense } from 'react'
import {
  Outlet,
  Route,
  createMemoryRouter,
  createRoutesFromElements,
  useLocation
} from 'react-router-dom'
import ROUTES from '../constants/routes.json'
import Layout from './Layout'
import ErrorPage from './ErrorPage'
import { UmamiProvider, PageTracker } from '../providers/umami'

// Lazy load pages
const Loading = lazy(() => import('../pages/loading'))
const Dashboard = lazy(() => import('../pages/dashboard'))
const Publishers = lazy(() => import('../pages/publishers'))
const PublisherPersonalForm = lazy(() => import('../pages/publishers/personal'))
const PublisherContactForm = lazy(() => import('../pages/publishers/contact'))
const PublisherAppointmentForm = lazy(() => import('../pages/publishers/appointment'))
const PublisherOtherForm = lazy(() => import('../pages/publishers/other'))
const Settings = lazy(() => import('../pages/settings'))
const ServiceGroups = lazy(() => import('../pages/serviceGroups'))
const ServiceGroupForm = lazy(() => import('../pages/serviceGroups/form'))
const Responsibilities = lazy(() => import('../pages/responsibilities'))
const ResponibilityForm = lazy(() => import('../pages/responsibilities/form'))
const Tasks = lazy(() => import('../pages/tasks'))
const TaskForm = lazy(() => import('../pages/tasks/form'))
const Registration = lazy(() => import('../pages/registration'))
const ReportsForm = lazy(() => import('../pages/reports/form'))
const ReportsMeetings = lazy(() => import('../pages/reports/meetings'))
const ReportsCompletion = lazy(() => import('../pages/reports/completion'))
const CircuitOverseer = lazy(() => import('../pages/circuitOverseer'))
const Templates = lazy(() => import('../pages/templates'))

const UMAMI_CONFIG = {
  apiUrl: 'https://stats.jwapp.info/',
  websiteId: 'cb1f28be-4500-40a7-aca9-9ef3b70f92f8',
  allowedDomains: [window.location.hostname] // or [window.location.hostname]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PageTrackerRR: FC<any> = () => {
  const location = useLocation()
  return <PageTracker pageUrl={location.pathname} />
}

function SuspenseLayout(): JSX.Element {
  return (
    <Suspense fallback={<ErrorPage />}>
      <UmamiProvider
        hostUrl={UMAMI_CONFIG.apiUrl}
        websiteId={UMAMI_CONFIG.websiteId}
        getCurrentUrl={(): string => window.location.pathname}
        domains={UMAMI_CONFIG.allowedDomains}
      >
        <PageTrackerRR />
        <Outlet />
      </UmamiProvider>
    </Suspense>
  )
}

const router = createMemoryRouter(
  createRoutesFromElements(
    <Route element={<SuspenseLayout />}>
      <Route path={ROUTES.LOADING} element={<Loading />} />
      <Route path={ROUTES.SETUP} element={<Registration />} />
      <Route path="/" element={<Layout />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

        <Route path={ROUTES.CIRCUIT_OVERSEER} element={<CircuitOverseer />} />
        <Route path={ROUTES.TEMPLATES} element={<Templates />} />

        <Route path={ROUTES.PUBLISHERS}>
          <Route index element={<Publishers />} />
          <Route path=":id/edit" element={<PublisherPersonalForm />} />
        </Route>
        <Route path={ROUTES.PUBLISHER_PERSONAL_FORM} element={<PublisherPersonalForm />} />
        <Route path={ROUTES.PUBLISHER_CONTACT_FORM} element={<PublisherContactForm />} />
        <Route path={ROUTES.PUBLISHER_APPOINTMENTS_FORM} element={<PublisherAppointmentForm />} />
        <Route path={ROUTES.PUBLISHER_OTHER_FORM} element={<PublisherOtherForm />} />

        <Route path={ROUTES.REPORTS}>
          <Route path={ROUTES.REPORTS_FORM} element={<ReportsForm />} />
          <Route path={ROUTES.REPORTS_MEETINGS} element={<ReportsMeetings />} />
          <Route path={ROUTES.REPORTS_COMPLETION} element={<ReportsCompletion />} />
        </Route>

        <Route path={ROUTES.SETTINGS} element={<Settings />} />

        <Route path={ROUTES.SERVICE_GROUPS}>
          <Route index element={<ServiceGroups />} />
          <Route path="add" element={<ServiceGroupForm />} />
          <Route path=":id/edit" element={<ServiceGroupForm />} />
        </Route>

        <Route path={ROUTES.RESPONSIBILITIES}>
          <Route index element={<Responsibilities />} />
          <Route path="add" element={<ResponibilityForm />} />
          <Route path=":id/edit" element={<ResponibilityForm />} />
        </Route>

        <Route path={ROUTES.TASKS}>
          <Route index element={<Tasks />} />
          <Route path="add" element={<TaskForm />} />
          <Route path=":id/edit" element={<TaskForm />} />
        </Route>
      </Route>
    </Route>
  )
)

export default router
