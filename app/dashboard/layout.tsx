import type React from 'react';
import { AppShell } from '@/components/app-shell';

/**
 * Legacy dashboard layout wrapper.
 *
 * Keeps existing Next dashboard sub-routes on the legacy shell while shared
 * routes are hosted under app/(shared).
 */
export default function LegacyDashboardLayout(props: { children: React.ReactNode }) {
  return <AppShell>{props.children}</AppShell>;
}
