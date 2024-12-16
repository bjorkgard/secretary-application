import { Suspense } from 'react'
import type { FC }  from 'react'
import {
  Outlet,
  Route,
  createMemoryRouter,
  createRoutesFromElements,
  useLocation,
} from 'react-router-dom'
import StatsAnalysis                  from '@renderer/pages/stats/analysis'
import StatsDiary                     from '@renderer/pages/stats/diary'
import ROUTES                         from '../constants/routes.json'
import CircuitOverseer                from '../pages/circuitOverseer'
import Dashboard                      from '../pages/dashboard'
import HistoryCongregation            from '../pages/history/congregation'
import HistoryPublishers              from '../pages/history/publishers'
import Loading                        from '../pages/loading'
import Publishers                     from '../pages/publishers'
import PublisherContactForm           from '../pages/publishers/contact'
import PublisherPersonalForm          from '../pages/publishers/personal'
import PublisherAppointmentForm       from '../pages/publishers/appointment'
import PublisherOtherForm             from '../pages/publishers/other'
import ReportsCompletion              from '../pages/reports/completion'
import ReportsForm                    from '../pages/reports/form'
import ReportsMeetings                from '../pages/reports/meetings'
import Registration                   from '../pages/registration'
import Responsibilities               from '../pages/responsibilities'
import ResponibilityForm              from '../pages/responsibilities/form'
import Settings                       from '../pages/settings'
import ServiceGroups                  from '../pages/serviceGroups'
import ServiceGroupForm               from '../pages/serviceGroups/form'
import Tasks                          from '../pages/tasks'
import TaskForm                       from '../pages/tasks/form'
import Templates                      from '../pages/uploadedTemplates'
import { PageTracker, UmamiProvider } from '../providers/umami'
import Layout                         from './Layout'
import LoadingPage                    from './LoadingPage'

const UMAMI_CONFIG = {
  apiUrl:         'https://stats.jwapp.info/',
  websiteId:      'cb1f28be-4500-40a7-aca9-9ef3b70f92f8',
  allowedDomains: [window.location.hostname], // or [window.location.hostname]
}

const PageTrackerRR: FC<any> = () => {
  const location = useLocation()
  return <PageTracker pageUrl={location.pathname} />
}

function SuspenseLayout(): JSX.Element {
  return (
    <Suspense fallback={<LoadingPage />}>
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

        <Route path={ROUTES.STATS}>
          <Route path={ROUTES.ANALYSIS} element={<StatsAnalysis />} />
          <Route path={ROUTES.DIARY} element={<StatsDiary />} />
        </Route>

        <Route path={ROUTES.HISTORY}>
          <Route path={ROUTES.HISTORY_PUBLISHERS} element={<HistoryPublishers />} />
          <Route path={ROUTES.HISTORY_CONGREGATION} element={<HistoryCongregation />} />
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
    </Route>,
  ),
)

export default router
