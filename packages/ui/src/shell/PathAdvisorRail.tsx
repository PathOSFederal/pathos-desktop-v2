/**
 * ============================================================================
 * PATH ADVISOR RAIL -- Shared advisor side panel (Analyst Module)
 * ============================================================================
 *
 * BOUNDARY RULE: This file MUST NOT import from next/* or electron/*.
 *
 * Framed as an analyst module: Context (Viewing, Privacy), recommended
 * next steps, and a guidance-strip input (not chatbot tone).
 */

'use client';

import type React from 'react';
import { Compass, Eye, Shield } from 'lucide-react';

export interface PathAdvisorRailProps {
  dock?: 'left' | 'right';
}

/* Context chips: current view + privacy stance (system status) */
const CONTEXT_CHIPS = [
  { label: 'Viewing', icon: <Eye className="w-3 h-3" /> },
  { label: 'Privacy', icon: <Shield className="w-3 h-3" /> },
];

/* Recommended next steps (action-oriented, not conversational) */
const RECOMMENDED_NEXT_STEPS = [
  'Review compensation vs. target grade',
  'Update resume for current role focus',
  'Check retirement timeline assumptions',
  'Compare benefits options for next year',
];

export function PathAdvisorRail(_props: PathAdvisorRailProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Analyst Module header */}
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ borderBottom: '1px solid var(--p-border)' }}
      >
        <Compass className="w-4 h-4" style={{ color: 'var(--p-accent)' }} />
        <h2
          className="font-semibold"
          style={{ color: 'var(--p-text)', fontSize: 'var(--p-font-size-section)' }}
        >
          Analyst Module
        </h2>
      </div>

      {/* Context: Viewing, Privacy (system status chips) */}
      <div className="px-3 pt-2 pb-2">
        <p
          className="font-semibold uppercase tracking-[var(--p-letter-spacing-section)] mb-1.5"
          style={{ color: 'var(--p-text-dim)', fontSize: 'var(--p-font-size-section)' }}
        >
          Context
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CONTEXT_CHIPS.map(function (chip) {
            return (
              <span
                key={chip.label}
                className="flex items-center gap-1.5 px-2 py-1 text-[12px] font-medium"
                style={{
                  background: 'var(--p-surface2)',
                  border: '1px solid var(--p-border)',
                  borderRadius: 'var(--p-radius)',
                  color: 'var(--p-text-muted)',
                }}
              >
                {chip.icon}
                {chip.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Recommended next steps (guidance tone) */}
      <div className="px-3 pt-2 flex-1">
        <p
          className="font-semibold uppercase tracking-[var(--p-letter-spacing-section)] mb-1.5"
          style={{ color: 'var(--p-text-dim)', fontSize: 'var(--p-font-size-section)' }}
        >
          Recommended next steps
        </p>
        <div className="space-y-1">
          {RECOMMENDED_NEXT_STEPS.map(function (step) {
            return (
              <button
                key={step}
                type="button"
                className="w-full text-left px-3 py-1.5 text-[12px] transition-colors"
                style={{
                  background: 'var(--p-surface2)',
                  border: '1px solid transparent',
                  borderRadius: 'var(--p-radius)',
                  color: 'var(--p-text-muted)',
                }}
              >
                {step}
              </button>
            );
          })}
        </div>
      </div>

      {/* Guidance strip (not chatbot) */}
      <div className="p-2" style={{ borderTop: '1px solid var(--p-border)' }}>
        <div
          className="flex items-center gap-2 px-3 py-2 text-[12px]"
          style={{
            background: 'var(--p-surface2)',
            border: '1px solid var(--p-border)',
            borderRadius: 'var(--p-radius)',
            color: 'var(--p-text-dim)',
          }}
        >
          <Compass className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Next step or guidance...</span>
        </div>
      </div>
    </div>
  );
}
