import type { FC }  from 'react'
import { Suspense } from 'react'
import {
  Outlet,
  Route,
  createMemoryRouter,
  createRoutesFromElements,
  useLocation,
} from 'react-router-dom'
import StatsAnalysis                  from '@renderer/pages/stats/analysis'
import StatsDiary                     from '@renderer/pages/stats/diary'
import { PageTracker, UmamiProvider } from '@renderer/providers/umami'
import ROUTES                         from '@renderer/constants/routes.json'
import CircuitOverseer                from '@renderer/pages/circuitOverseer'
import Dashboard                      from '@renderer/pages/dashboard'
import HistoryCongregation            from '@renderer/pages/history/congregation'
import HistoryPublishers              from '@renderer/pages/history/publishers'
import Loading                        from '@renderer/pages/loading'
import Publishers                     from '@renderer/pages/publishers'
import PublisherContactForm           from '@renderer/pages/publishers/contact'
import PublisherPersonalForm          from '@renderer/pages/publishers/personal'
import PublisherAppointmentForm       from '@renderer/pages/publishers/appointment'
import PublisherOtherForm             from '@renderer/pages/publishers/other'
import ReportsCompletion              from '@renderer/pages/reports/completion'
import ReportsForm                    from '@renderer/pages/reports/form'
import ReportsMeetings                from '@renderer/pages/reports/meetings'
import Registration                   from '@renderer/pages/registration'
import Responsibilities               from '@renderer/pages/responsibilities'
import ResponibilityForm              from '@renderer/pages/responsibilities/form'
import Settings                       from '@renderer/pages/settings'
import ServiceGroups                  from '@renderer/pages/serviceGroups'
import ServiceGroupForm               from '@renderer/pages/serviceGroups/form'
import Tasks                          from '@renderer/pages/tasks'
import TaskForm                       from '@renderer/pages/tasks/form'
import Templates                      from '@renderer/pages/uploadedTemplates'
import LoadingPage                    from './LoadingPage'
import Layout                         from './Layout'

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
