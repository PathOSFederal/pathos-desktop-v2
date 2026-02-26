/**
 * ============================================================================
 * SHARED CAREER SCREEN -- Platform-agnostic career & resume view
 * ============================================================================
 *
 * BOUNDARY RULE: This file MUST NOT import from next/* or electron/*.
 */

'use client';

import type React from 'react';
import { useNav } from '@pathos/adapters';

export interface CareerScreenProps {
  userName?: string;
}

export function CareerScreen(_props: CareerScreenProps) {
  const nav = useNav();

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--p-text)' }}>Career & Resume</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--p-text-muted)' }}>
          Track your career trajectory, resume strength, and next actions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PlaceholderCard title="Resume Strength" />
        <PlaceholderCard title="Career Timeline" />
        <PlaceholderCard title="Next Actions" />
        <PlaceholderCard title="Target Roles" />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={function () { nav.push('/dashboard/resume-builder'); }}
          className="px-4 py-2 text-sm font-medium transition-colors"
          style={{
            background: 'var(--p-accent)',
            borderRadius: 'var(--p-radius)',
            color: 'var(--p-bg)',
            border: 'none',
          }}
        >
          Open Resume Builder
        </button>
        <button
          type="button"
          onClick={function () { nav.push('/dashboard'); }}
          className="px-4 py-2 text-sm font-medium transition-colors"
          style={{
            border: '1px solid var(--p-border)',
            borderRadius: 'var(--p-radius)',
            color: 'var(--p-text-muted)',
            background: 'transparent',
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

function PlaceholderCard(props: { title: string }) {
  return (
    <div
      className="p-5"
      style={{
        background: 'var(--p-surface)',
        border: '1px solid var(--p-border)',
        borderRadius: 'var(--p-radius-lg)',
        boxShadow: 'var(--p-shadow)',
      }}
    >
      <h3 className="text-sm font-semibold" style={{ color: 'var(--p-text)' }}>{props.title}</h3>
      <div
        className="mt-3 h-24 flex items-center justify-center"
        style={{
          background: 'var(--p-surface2)',
          borderRadius: 'var(--p-radius)',
        }}
      >
        <span className="text-xs" style={{ color: 'var(--p-text-dim)' }}>Content loading</span>
      </div>
    </div>
  );
}
