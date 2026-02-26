/**
 * ============================================================================
 * SHARED DASHBOARD SCREEN -- Platform-agnostic dashboard view
 * ============================================================================
 *
 * BOUNDARY RULE: This file MUST NOT import from next/* or electron/*.
 *
 * LAYOUT: Benefits-style decision workspace. Numbers-first with hero value
 * cards, assumptions module, and top decision drivers. Mock values only;
 * no backend logic. Designed empty states only (no generic placeholders).
 */

'use client';

import type React from 'react';
import { RotateCcw } from 'lucide-react';
import { ModuleCard } from '../components/ModuleCard';

export interface DashboardScreenProps {
  isEmployee?: boolean;
  userName?: string;
}

// ---------------------------------------------------------------------------
// Mock data (display only; no persistence or API)
// ---------------------------------------------------------------------------

const MOCK_ANNUAL_VALUE_MIN = 23280;
const MOCK_ANNUAL_VALUE_MAX = 31496;
const MOCK_LONG_TERM_VALUE = 8000;
const MOCK_EXPECTED_SALARY = 80000;
const MOCK_HEALTH_COVERAGE = 'Self Only';
const MOCK_TENURE_LABEL = '3-5 years';

const MOCK_DECISION_DRIVERS = [
  { title: 'Paid Leave', value: '$13,538/year', subtitle: 'Annual leave and sick leave value' },
  { title: 'FERS Pension', value: '$8,000/year at retirement', subtitle: 'Estimated from high-3 and tenure' },
  { title: 'Health Insurance (FEHB)', value: '$7,200/year', subtitle: 'Employer contribution estimate' },
];

// ---------------------------------------------------------------------------
// Hero value card (Annual or Long-term) — ModuleCard with value/subtitle/footnote
// ---------------------------------------------------------------------------

function HeroValueCard(props: {
  title: string;
  value: string;
  subtitle: string;
  footnote: string;
  accent: 'orange' | 'cool';
}) {
  const isOrange = props.accent === 'orange';
  const valueColor = isOrange ? 'var(--p-accent-text)' : 'var(--p-info)';

  return (
    <ModuleCard title={props.title}>
      <p
        className="mt-1 font-semibold"
        style={{ color: valueColor, fontSize: '1.25rem' }}
      >
        {props.value}
      </p>
      <p className="mt-0.5" style={{ color: 'var(--p-text-muted)', fontSize: 'var(--p-font-size-body)' }}>
        {props.subtitle}
      </p>
      <p className="mt-2 text-[11px]" style={{ color: 'var(--p-text-dim)' }}>
        {props.footnote}
      </p>
    </ModuleCard>
  );
}

// ---------------------------------------------------------------------------
// Assumptions module — ModuleCard with grid and header action
// ---------------------------------------------------------------------------

function AssumptionsModule() {
  function handleReset() {
    // Non-functional per spec; no-op.
  }

  const resetAction = (
    <button
      type="button"
      onClick={handleReset}
      className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-90"
      style={{ color: 'var(--p-accent)' }}
    >
      <RotateCcw className="w-3.5 h-3.5" />
      Reset assumptions
    </button>
  );

  return (
    <ModuleCard title="Assumptions" action={resetAction}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: 'var(--p-text-dim)' }}>
            Expected Salary
          </p>
          <p className="mt-0.5 font-medium" style={{ color: 'var(--p-text)', fontSize: 'var(--p-font-size-body)' }}>
            {MOCK_EXPECTED_SALARY.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: 'var(--p-text-dim)' }}>
            Health Coverage
          </p>
          <p className="mt-0.5 font-medium" style={{ color: 'var(--p-text)', fontSize: 'var(--p-font-size-body)' }}>
            {MOCK_HEALTH_COVERAGE}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: 'var(--p-text-dim)' }}>
            Expected Tenure
          </p>
          <p className="mt-0.5 font-medium" style={{ color: 'var(--p-text)', fontSize: 'var(--p-font-size-body)' }}>
            {MOCK_TENURE_LABEL}
          </p>
        </div>
      </div>
    </ModuleCard>
  );
}

// ---------------------------------------------------------------------------
// Decision driver card — ModuleCard dense variant
// ---------------------------------------------------------------------------

function DecisionDriverCard(props: { title: string; value: string; subtitle: string }) {
  return (
    <ModuleCard title={props.title} variant="dense">
      <p className="mt-1 font-medium" style={{ color: 'var(--p-accent-text)', fontSize: 'var(--p-font-size-body)' }}>
        {props.value}
      </p>
      <p className="mt-0.5" style={{ color: 'var(--p-text-dim)', fontSize: '0.75rem' }}>
        {props.subtitle}
      </p>
    </ModuleCard>
  );
}

// ---------------------------------------------------------------------------
// Main dashboard screen
// ---------------------------------------------------------------------------

export function DashboardScreen(_props: DashboardScreenProps) {
  const annualRange =
    '$' + MOCK_ANNUAL_VALUE_MIN.toLocaleString() + ' - $' + MOCK_ANNUAL_VALUE_MAX.toLocaleString();
  const longTermLabel = '$' + MOCK_LONG_TERM_VALUE.toLocaleString() + '/year';

  return (
    <div className="p-4 lg:p-5 space-y-5">
      {/* Header: title + subtitle */}
      <div>
        <h1
          className="font-semibold"
          style={{ color: 'var(--p-text)', fontSize: 'var(--p-font-size-page-title)' }}
        >
          Dashboard
        </h1>
        <p
          className="mt-0.5"
          style={{ color: 'var(--p-text-muted)', fontSize: 'var(--p-font-size-body)' }}
        >
          Decision workspace for federal job search.
        </p>
      </div>

      {/* Two hero cards: Annual Value (orange), Long-term Value (cool) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HeroValueCard
          title="Annual Value (Today)"
          value={annualRange}
          subtitle="Estimated total compensation value this year"
          footnote="Based on current assumptions. Adjust assumptions to refine."
          accent="orange"
        />
        <HeroValueCard
          title="Long-term Value (Retirement)"
          value={longTermLabel}
          subtitle="Estimated annual value at retirement"
          footnote="FERS pension and TSP growth. Assumes 3-5 year tenure."
          accent="cool"
        />
      </div>

      {/* Assumptions module (single wide card) */}
      <AssumptionsModule />

      {/* Top Decision Drivers (3 cards) */}
      <div>
        <h2
          className="font-semibold uppercase tracking-[var(--p-letter-spacing-section)] mb-3"
          style={{ color: 'var(--p-text-dim)', fontSize: 'var(--p-font-size-section)' }}
        >
          Top Decision Drivers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MOCK_DECISION_DRIVERS.map(function (driver) {
            return (
              <DecisionDriverCard
                key={driver.title}
                title={driver.title}
                value={driver.value}
                subtitle={driver.subtitle}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
