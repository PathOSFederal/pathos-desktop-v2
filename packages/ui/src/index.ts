/**
 * @pathos/ui — Shared AppShell, screens, and components.
 *
 * BOUNDARY RULE: This package MUST NOT import from next/* or electron/*.
 * Run `pnpm check:boundaries` to verify.
 */

// Shared components
export { ModuleCard, type ModuleCardProps } from './components/ModuleCard';

// Shell components
export { SharedAppShell, type AppShellProps, type Platform } from './shell/AppShell';
export { Sidebar, type SidebarProps } from './shell/Sidebar';
export { TopBar, type TopBarProps } from './shell/TopBar';
export { PathAdvisorRail, type PathAdvisorRailProps } from './shell/PathAdvisorRail';

// Screens
export { DashboardScreen, type DashboardScreenProps } from './screens/DashboardScreen';
export { CareerScreen, type CareerScreenProps } from './screens/CareerScreen';
export { SettingsScreen, type SettingsScreenProps } from './screens/SettingsScreen';
export { GuidedApplyScreen, type GuidedApplyScreenProps } from './screens/GuidedApplyScreen';
export { JobSearchScreen, type JobSearchScreenProps } from './screens/JobSearchScreen';
export { SavedJobsScreen, type SavedJobsScreenProps } from './screens/SavedJobsScreen';
export { ResumeBuilderScreen, type ResumeBuilderScreenProps } from './screens/ResumeBuilderScreen';
