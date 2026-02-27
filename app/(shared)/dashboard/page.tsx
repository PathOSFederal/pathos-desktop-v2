'use client';

import { DashboardScreen } from '@pathos/ui';
import { SharedDashboardRouteShell } from './_components/SharedDashboardRouteShell';

export default function DashboardPage() {
  return (
    <SharedDashboardRouteShell>
      <DashboardScreen />
    </SharedDashboardRouteShell>
  );
}
