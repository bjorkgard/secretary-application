import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation }           from 'react-i18next'
import {
  BriefcaseIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  IdentificationIcon,
  RectangleGroupIcon,
  RectangleStackIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/20/solid'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from '@renderer/components/catalyst/sidebar'
import { useState } from 'react'
import ROUTES       from '../constants/routes.json'

export function Navigation(): JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const { t }    = useTranslation()

  const [reportingOpen, setReportingOpen] = useState<boolean>(false)
  const [statsOpen, setStatsOpen]         = useState<boolean>(false)
  const [historyOpen, setHistoryOpen]     = useState<boolean>(false)

  const clickNavigationItems = (item: 'REPORTING' | 'STATS' | 'HISTORY') => {
    switch (item) {
      case 'REPORTING':
        setReportingOpen(!reportingOpen)
        setStatsOpen(false)
        setHistoryOpen(false)
        break
      case 'STATS':
        setReportingOpen(false)
        setStatsOpen(!statsOpen)
        setHistoryOpen(false)
        break
      case 'HISTORY':
        setReportingOpen(false)
        setStatsOpen(false)
        setHistoryOpen(!historyOpen)
        break
      default:
        break
    }
  }

  return (
    <Sidebar>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem onClick={(): void => navigate(ROUTES.DASHBOARD)} current={location.pathname.includes(ROUTES.DASHBOARD)}>
            <RectangleGroupIcon />
            <SidebarLabel>{t('menu.dashboard')}</SidebarLabel>
          </SidebarItem>
          <SidebarItem onClick={(): void => navigate(ROUTES.PUBLISHERS)} current={location.pathname.includes(ROUTES.PUBLISHERS)}>
            <UsersIcon />
            <SidebarLabel>{t('menu.publishers')}</SidebarLabel>
          </SidebarItem>
          <SidebarItem onClick={() => clickNavigationItems('REPORTING')}>
            <BriefcaseIcon />
            <SidebarLabel>{t('menu.reporting')}</SidebarLabel>
            {!reportingOpen && (<ChevronRightIcon />)}
            {reportingOpen && (<ChevronDownIcon />)}
          </SidebarItem>
          {reportingOpen && (
            <>
              <SidebarItem className="pl-8" onClick={() => navigate(ROUTES.REPORTS_FORM)} current={location.pathname.includes(ROUTES.REPORTS)}>
                <SidebarLabel>{t('menu.monthlyReport')}</SidebarLabel>
              </SidebarItem>
              <SidebarItem className="pl-8" onClick={() => navigate(ROUTES.REPORTS_MEETINGS)} current={location.pathname.includes(ROUTES.REPORTS_MEETINGS)}>
                <SidebarLabel>{t('menu.monthlyMeetings')}</SidebarLabel>
              </SidebarItem>
              <SidebarItem className="pl-8" onClick={() => navigate(ROUTES.REPORTS_COMPLETION)} current={location.pathname.includes(ROUTES.REPORTS_COMPLETION)}>
                <SidebarLabel>{t('menu.monthlyCompletion')}</SidebarLabel>
              </SidebarItem>
            </>
          )}
          <SidebarItem onClick={(): void => clickNavigationItems('STATS')}>
            <ChartBarIcon />
            <SidebarLabel>{t('menu.stats')}</SidebarLabel>
            {!statsOpen && (<ChevronRightIcon />)}
            {statsOpen && (<ChevronDownIcon />)}
          </SidebarItem>
          {statsOpen && (
            <>
              <SidebarItem className="pl-8" onClick={() => navigate(ROUTES.ANALYSIS)} current={location.pathname.includes(ROUTES.ANALYSIS)}>
                <SidebarLabel>{t('menu.statsAnalysis')}</SidebarLabel>
              </SidebarItem>
              <SidebarItem className="pl-8" onClick={() => navigate(ROUTES.DIARY)} current={location.pathname.includes(ROUTES.DIARY)}>
                <SidebarLabel>{t('menu.statsDiary')}</SidebarLabel>
              </SidebarItem>
            </>
          )}
          <SidebarItem onClick={(): void => clickNavigationItems('HISTORY')}>
            <ClockIcon />
            <SidebarLabel>{t('menu.history')}</SidebarLabel>
            {!historyOpen && (<ChevronRightIcon />)}
            {historyOpen && (<ChevronDownIcon />)}
          </SidebarItem>
          {historyOpen && (
            <>
              <SidebarItem className="pl-8" onClick={() => navigate(ROUTES.HISTORY_PUBLISHERS)} current={location.pathname.includes(ROUTES.HISTORY_PUBLISHERS)}>
                <SidebarLabel>{t('menu.historyPublishers')}</SidebarLabel>
              </SidebarItem>
              <SidebarItem className="pl-8" onClick={() => navigate(ROUTES.HISTORY_CONGREGATION)} current={location.pathname.includes(ROUTES.HISTORY_CONGREGATION)}>
                <SidebarLabel>{t('menu.historyCongregation')}</SidebarLabel>
              </SidebarItem>
            </>
          )}
        </SidebarSection>
        <SidebarSection>
          <SidebarHeading>{t('label.administration')}</SidebarHeading>
          <SidebarItem onClick={(): void => navigate(ROUTES.SERVICE_GROUPS)} current={location.pathname.includes(ROUTES.SERVICE_GROUPS)}>
            <UserGroupIcon />
            <SidebarLabel>{t('menu.serviceGroups')}</SidebarLabel>
          </SidebarItem>
          <SidebarItem onClick={(): void => navigate(ROUTES.CIRCUIT_OVERSEER)} current={location.pathname.includes(ROUTES.CIRCUIT_OVERSEER)}>
            <UserIcon />
            <SidebarLabel>{t('menu.circuitOverseer')}</SidebarLabel>
          </SidebarItem>
          <SidebarItem onClick={(): void => navigate(ROUTES.RESPONSIBILITIES)} current={location.pathname.includes(ROUTES.RESPONSIBILITIES)}>
            <IdentificationIcon />
            <SidebarLabel>{t('menu.responsibilities')}</SidebarLabel>
          </SidebarItem>
          <SidebarItem onClick={(): void => navigate(ROUTES.TASKS)} current={location.pathname.includes(ROUTES.TASKS)}>
            <RectangleStackIcon />
            <SidebarLabel>{t('menu.tasks')}</SidebarLabel>
          </SidebarItem>
          <SidebarItem onClick={(): void => navigate(ROUTES.TEMPLATES)} current={location.pathname.includes(ROUTES.TEMPLATES)}>
            <DocumentTextIcon />
            <SidebarLabel>{t('menu.templates')}</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter>
        <SidebarSection>
          <SidebarItem onClick={(): void => navigate(ROUTES.SETTINGS)} current={location.pathname.includes(ROUTES.SETTINGS)}>
            <Cog6ToothIcon />
            <SidebarLabel>{t('menu.settings')}</SidebarLabel>
          </SidebarItem>

        </SidebarSection>
      </SidebarFooter>
    </Sidebar>
  )
}
