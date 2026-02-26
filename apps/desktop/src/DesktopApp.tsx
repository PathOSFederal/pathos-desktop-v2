/**
 * Desktop application root.
 *
 * Uses React Router for routing and wraps the shared AppShell from
 * @pathos/ui with the reactRouterNavAdapter from @pathos/adapters.
 *
 * Route table matches the screens verified in /desktop-preview:
 *   /dashboard, /dashboard/career, /settings, /guided-apply
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { NavigationProvider } from '@pathos/adapters';
import {
  SharedAppShell,
  DashboardScreen,
  CareerScreen,
  SettingsScreen,
  GuidedApplyScreen,
  JobSearchScreen,
  SavedJobsScreen,
  ResumeBuilderScreen,
  PathAdvisorRail,
} from '@pathos/ui';
import { useReactRouterNavAdapter } from './adapters/react-router-nav-adapter';
import { RouterNavLink } from './adapters/RouterNavLink';

export function DesktopApp() {
  const adapter = useReactRouterNavAdapter();

  return (
    <NavigationProvider adapter={adapter} linkComponent={RouterNavLink}>
      <SharedAppShell
        platform="desktop"
        rightRail={<PathAdvisorRail />}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/dashboard/career" element={<CareerScreen />} />
          <Route path="/dashboard/job-search" element={<JobSearchScreen />} />
          <Route path="/dashboard/saved-jobs" element={<SavedJobsScreen />} />
          <Route path="/dashboard/resume-builder" element={<ResumeBuilderScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/guided-apply" element={<GuidedApplyScreen />} />
        </Routes>
      </SharedAppShell>
    </NavigationProvider>
  );
}
