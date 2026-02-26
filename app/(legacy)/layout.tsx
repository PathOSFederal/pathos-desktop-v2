import type React from 'react';
import { AppShell } from '@/components/app-shell';

/**
 * Legacy route group layout.
 *
 * Legacy pages continue to use the original Next AppShell wrapper.
 */
export default function LegacyGroupLayout(props: { children: React.ReactNode }) {
  return <AppShell>{props.children}</AppShell>;
}
