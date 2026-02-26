/**
 * ============================================================================
 * DESKTOP PREVIEW PAGE
 * ============================================================================
 *
 * Renders the shared AppShell + screens from @pathos/ui inside the
 * PreviewNavigationProvider. This is the primary verification surface
 * for desktop parity in the v0 sandbox.
 *
 * Navigation is in-memory: clicking sidebar items updates the visible
 * screen without triggering Next.js route changes.
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { PreviewNavigationProvider, usePreviewPathname } from '@/lib/adapters/preview-nav-adapter';
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

/** Map ?screen= param to an in-memory pathname */
const SCREEN_MAP: Record<string, string> = {
  career: '/dashboard/career',
  settings: '/settings',
  'guided-apply': '/guided-apply',
  'job-search': '/dashboard/job-search',
  'saved-jobs': '/dashboard/saved-jobs',
  'resume': '/dashboard/resume-builder',
};

// ---------------------------------------------------------------------------
// Screen router -- maps in-memory pathname to shared screen component
// ---------------------------------------------------------------------------

function PreviewScreenRouter() {
  const pathname = usePreviewPathname();

  if (pathname === '/dashboard/career') {
    return <CareerScreen userName="Jordan Rivera" />;
  }
  if (pathname === '/settings') {
    return <SettingsScreen userName="Jordan Rivera" isEmployee={false} />;
  }
  if (pathname === '/guided-apply') {
    return <GuidedApplyScreen jobTitle="IT Specialist (INFOSEC)" controlNumber="825742100" />;
  }
  if (pathname === '/dashboard/job-search') {
    return <JobSearchScreen />;
  }
  if (pathname === '/dashboard/saved-jobs') {
    return <SavedJobsScreen />;
  }
  if (pathname === '/dashboard/resume-builder') {
    return <ResumeBuilderScreen />;
  }
  // Default: dashboard
  return <DashboardScreen isEmployee={false} userName="Jordan Rivera" />;
}

// ---------------------------------------------------------------------------
// Preview shell -- wraps shared AppShell with sidebar/topbar config
// ---------------------------------------------------------------------------

function PreviewShell() {
  return (
    <SharedAppShell
      platform="desktop-preview"
      sidebar={{
        isEmployee: false,
        userName: 'Jordan Rivera',
        userSubtitle: 'Federal Applicant',
        alertBadgeCount: 3,
      }}
      topBar={{
        personaLabel: 'Job Seeker',
        isSensitiveHidden: false,
      }}
      rightRail={<PathAdvisorRail dock="right" />}
      advisorDock="right"
    >
      <PreviewScreenRouter />
    </SharedAppShell>
  );
}

// ---------------------------------------------------------------------------
// Page export
// ---------------------------------------------------------------------------

export default function DesktopPreviewPage() {
  const searchParams = useSearchParams();
  const screenParam = searchParams.get('screen') ?? '';
  const initialPath = SCREEN_MAP[screenParam] ?? '/dashboard';

  return (
    <PreviewNavigationProvider initialPath={initialPath}>
      <PreviewShell />
    </PreviewNavigationProvider>
  );
}
