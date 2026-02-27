'use client';

import { CareerScreen } from '@pathos/ui';
import { SharedDashboardRouteShell } from '../_components/SharedDashboardRouteShell';

export default function CareerPage() {
  return (
    <SharedDashboardRouteShell>
      <CareerScreen />
    </SharedDashboardRouteShell>
  );
}
