/**
 * ============================================================================
 * SHARED DASHBOARD SCREEN — Command Center v1 (Mockup parity)
 * ============================================================================
 *
 * BOUNDARY RULE: This file MUST NOT import from next/* or electron/*.
 *
 * LAYOUT: Briefing row, Today's Focus (hero + 2 small cards), Your Active
 * Tracks (Saved Jobs, Applications, Resume), Signals (Updates, Readiness,
 * Timeline). Driven by optional data prop (e.g. from lib/dashboard/mockDashboardData).
 * Uses existing theme tokens and ModuleCard only; no theme drift.
 */

'use client';

import type React from 'react';
import { useCallback } from 'react';
import {
  FolderOpen,
  FileText,
  HelpCircle,
  Eye,
  Bell,
  TrendingUp,
  Clock,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  LayoutList,
} from 'lucide-react';
import { ModuleCard } from '../components/ModuleCard';
import { AskPathAdvisorButton } from '../components/AskPathAdvisorButton';
import { CardRowList } from './_components/CardRowList';
import { usePathAdvisorBriefingStore } from '../stores/pathAdvisorBriefingStore';

/** Data shape for dashboard content; app passes mock or real data. */
export interface DashboardData {
  briefing: Array<{ label: string; value: string; subtext: string; subtextPositive?: boolean }>;
  focusHero: {
    title: string;
    reason: string;
    ctaLabel: string;
    stepBadge: string;
    explainKnow: string;
    explainNotKnow: string;
    explainWhy: string;
    /** Optional hero density: estimated time, why it matters, what you'll do. */
    estimatedTime?: string;
    whyItMatters?: string;
    whatYoullDo?: string;
  } | null;
  focusSmall: Array<{ title: string; description: string; ctaLabel: string }>;
  savedJobs: Array<{ title: string; orgGrade: string; status: string; timeAgo: string }>;
  applications: Array<{
    title: string;
    submittedDate: string;
    status: string;
    statusVariant?: string;
  }>;
  resume: {
    progressPercent: number;
    checklist: Array<{ label: string; checked: boolean }>;
    openCtaLabel: string;
  };
  updatesSinceVisit: Array<{ icon: string; text: string; timeAgo: string }>;
  readinessDeltas: Array<{
    label: string;
    delta: string;
    deltaPositive?: boolean;
    deltaNegative?: boolean;
    explanation: string;
  }>;
  timelineEstimates: Array<{ label: string; range: string }>;
  timelineDisclaimer: string;
  timelineMethodology: string;
  /** When set, section headers show "Last updated: {lastUpdated}". When missing, label is hidden. */
  lastUpdated?: string;
}

export interface DashboardScreenProps {
  isEmployee?: boolean;
  userName?: string;
  /** When provided, dashboard content is driven from this data (mock or real). */
  data?: DashboardData;
  /**
   * When provided, a "Weekly briefing (60–90s)" button is shown in the header
   * area. Clicking it calls this callback (e.g. to open an Explainer modal in the app).
   */
  onOpenWeeklyBriefing?: () => void;
  /** Called by the "Fix resume gap" CTA in Today's Focus hero. */
  onFixResumeGap?: () => void;
  /** Called by the "Decode" CTA in Today's Focus small card (or "Track" when no apps). */
  onDecodeTrackedApp?: () => void;
  /** Called by the "Review" / "Start" CTA in Today's Focus small card. */
  onReviewQuestionnaire?: () => void;
  /**
   * When false (default), show "Start Guided Apply" in second right card.
   * When true, show "Tighten questionnaire alignment" from data.
   * Driven by mock or real guided-apply context; not wired to stores in this pass.
   */
  hasGuidedApplyContext?: boolean;
}

// ---------------------------------------------------------------------------
// Section header with optional "Last updated" (hidden when no timestamp)
// ---------------------------------------------------------------------------

function SectionHeader(props: { title: string; lastUpdated?: string }) {
  const showUpdated =
    props.lastUpdated !== undefined && props.lastUpdated !== null && props.lastUpdated !== '';
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
      <h2
        className="font-semibold uppercase tracking-[var(--p-letter-spacing-section)]"
        style={{ color: 'var(--p-text-dim)', fontSize: 'var(--p-font-size-section)' }}
      >
        {props.title}
      </h2>
      {showUpdated ? (
        <span className="text-[11px]" style={{ color: 'var(--p-text-dim)' }}>
          Last updated: {props.lastUpdated}
        </span>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Briefing: 4 compact tiles with value and subtext
// ---------------------------------------------------------------------------

const BRIEFING_ICONS: Record<string, React.ReactNode> = {
  'Saved Jobs': <FolderOpen className="w-4 h-4" style={{ color: 'var(--p-text-muted)' }} />,
  'Tracked Apps': <FileText className="w-4 h-4" style={{ color: 'var(--p-text-muted)' }} />,
  Readiness: <HelpCircle className="w-4 h-4" style={{ color: 'var(--p-text-muted)' }} />,
  'Next Milestone': <Eye className="w-4 h-4" style={{ color: 'var(--p-text-muted)' }} />,
};

function BriefingTile(props: {
  label: string;
  value: string;
  subtext: string;
  subtextPositive?: boolean;
}) {
  const icon = BRIEFING_ICONS[props.label];
  return (
    <div
      className="rounded-[var(--p-radius-lg)] border p-3 flex flex-col gap-0.5"
      style={{
        background: 'var(--p-surface)',
        borderColor: 'var(--p-border)',
        boxShadow: 'var(--p-shadow-elev-1)',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-[11px] uppercase tracking-wide"
          style={{ color: 'var(--p-text-dim)' }}
        >
          {props.label}
        </span>
        {icon != null ? <span className="flex-shrink-0">{icon}</span> : null}
      </div>
      <p className="font-semibold" style={{ color: 'var(--p-text)', fontSize: '1rem' }}>
        {props.value}
      </p>
      <p
        className="text-[11px]"
        style={{
          color: props.subtextPositive ? 'var(--p-success)' : 'var(--p-text-muted)',
        }}
      >
        {props.subtext}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Today's Focus: hero card; deep explanation opens in PathAdvisor rail (no inline expansion)
// ---------------------------------------------------------------------------

function FocusHeroCard(props: {
  title: string;
  reason: string;
  ctaLabel: string;
  stepBadge: string;
  explainKnow: string;
  explainNotKnow: string;
  explainWhy: string;
  estimatedTime?: string;
  whyItMatters?: string;
  whatYoullDo?: string;
  onCtaClick?: () => void;
  /** Optional grid placement (e.g. md:col-span-2 md:row-span-2) */
  className?: string;
}) {
  const openBriefing = usePathAdvisorBriefingStore(function (s) {
    return s.openBriefing;
  });

  const handleAskPathAdvisor = useCallback(function () {
    openBriefing({
      id: 'hero-focus',
      title: 'Why this is your next best move',
      sourceLabel: "Today's focus",
      sections: [
        { heading: 'What PathOS knows', body: props.explainKnow },
        { heading: 'What PathOS does not know', body: props.explainNotKnow },
        { heading: 'Why this is recommended', body: props.explainWhy },
      ],
    });
  }, [openBriefing, props.explainKnow, props.explainNotKnow, props.explainWhy]);

  const hasDensity =
    (props.estimatedTime !== undefined && props.estimatedTime !== '') ||
    (props.whyItMatters !== undefined && props.whyItMatters !== '') ||
    (props.whatYoullDo !== undefined && props.whatYoullDo !== '');

  return (
    <ModuleCard
      title={'✨ ' + props.title}
      action={
        <span
          className="rounded px-1.5 py-0.5 text-[10px] font-medium"
          style={{
            background: 'var(--p-accent-bg)',
            color: 'var(--p-accent)',
            border: '1px solid var(--p-accent-muted)',
          }}
        >
          {props.stepBadge}
        </span>
      }
      className={props.className}
    >
      <p className="font-medium" style={{ color: 'var(--p-text)', fontSize: 'var(--p-font-size-body)' }}>
        {props.title}
      </p>
      <p className="mt-1" style={{ color: 'var(--p-text-muted)', fontSize: 'var(--p-font-size-body)' }}>
        {props.reason}
      </p>
      {hasDensity ? (
        <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--p-border)' }}>
          <CardRowList>
            {props.estimatedTime !== undefined && props.estimatedTime !== '' ? (
              <p className="text-[11px] py-0" style={{ color: 'var(--p-text-dim)' }}>
                <strong style={{ color: 'var(--p-text-muted)' }}>Estimated time:</strong> {props.estimatedTime}
              </p>
            ) : null}
            {props.whyItMatters !== undefined && props.whyItMatters !== '' ? (
              <p className="text-[11px] py-0" style={{ color: 'var(--p-text-dim)' }}>
                <strong style={{ color: 'var(--p-text-muted)' }}>Why it matters:</strong> {props.whyItMatters}
              </p>
            ) : null}
            {props.whatYoullDo !== undefined && props.whatYoullDo !== '' ? (
              <p className="text-[11px] py-0" style={{ color: 'var(--p-text-dim)' }}>
                <strong style={{ color: 'var(--p-text-muted)' }}>What you&apos;ll do:</strong> {props.whatYoullDo}
              </p>
            ) : null}
          </CardRowList>
        </div>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={props.onCtaClick}
          className="rounded-[var(--p-radius)] px-3 py-1.5 text-sm font-medium transition-colors hover:opacity-90"
          style={{
            background: 'var(--p-accent)',
            color: 'var(--p-bg)',
          }}
        >
          {props.ctaLabel}
        </button>
        <AskPathAdvisorButton
          onClick={handleAskPathAdvisor}
          size="sm"
          tooltipId="focus-hero-ask-pathadvisor-tooltip"
        />
      </div>
    </ModuleCard>
  );
}

function FocusSmallCard(props: {
  title: string;
  description: string;
  ctaLabel: string;
  onCtaClick?: () => void;
  /** Optional tooltip for the CTA button (name + short description). */
  ctaTooltip?: string;
}) {
  return (
    <ModuleCard title={props.title}>
      <p className="mt-0.5" style={{ color: 'var(--p-text-muted)', fontSize: 'var(--p-font-size-body)' }}>
        {props.description}
      </p>
      <button
        type="button"
        onClick={props.onCtaClick}
        title={props.ctaTooltip}
        className="mt-3 rounded-[var(--p-radius)] px-3 py-1.5 text-sm font-medium transition-colors hover:opacity-90"
        style={{
          background: 'var(--p-surface2)',
          border: '1px solid var(--p-border)',
          color: 'var(--p-text)',
        }}
      >
        {props.ctaLabel}
      </button>
    </ModuleCard>
  );
}

// ---------------------------------------------------------------------------
// Your Active Tracks: Saved Jobs, Applications, Resume cards with lists
// ---------------------------------------------------------------------------

function SavedJobsCard(props: {
  items: Array<{ title: string; orgGrade: string; status: string; timeAgo: string }>;
}) {
  const count = props.items.length;
  return (
    <ModuleCard title="SAVED JOBS" subtitle={count + ' jobs'} variant="dense">
      <CardRowList className="mt-0">
        {props.items.map(function (item, i) {
          return (
            <div key={i} className="flex flex-wrap items-baseline justify-between gap-2 text-[12px] py-1">
              <div className="min-w-0 flex-1">
                <span style={{ color: 'var(--p-text)' }}>{item.title}</span>
                <span className="ml-1" style={{ color: 'var(--p-text-muted)' }}>
                  ({item.orgGrade})
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                  style={{
                    background: 'var(--p-surface2)',
                    border: '1px solid var(--p-border)',
                    color: 'var(--p-text-muted)',
                  }}
                >
                  {item.status}
                </span>
                <span style={{ color: 'var(--p-text-dim)', fontSize: '11px' }}>{item.timeAgo}</span>
              </div>
            </div>
          );
        })}
      </CardRowList>
    </ModuleCard>
  );
}

function ApplicationsCard(props: {
  items: Array<{
    title: string;
    submittedDate: string;
    status: string;
    statusVariant?: string;
  }>;
}) {
  const count = props.items.length;
  return (
    <ModuleCard title="APPLICATIONS" subtitle={count + ' tracked'} variant="dense">
      <CardRowList className="mt-0">
        {props.items.map(function (item, i) {
          const chipBg =
            item.statusVariant === 'info'
              ? 'var(--p-info-bg)'
              : item.statusVariant === 'warning'
                ? 'var(--p-warning-bg)'
                : 'var(--p-surface2)';
          const chipBorder =
            item.statusVariant === 'info'
              ? 'var(--p-info)'
              : item.statusVariant === 'warning'
                ? 'var(--p-warning)'
                : 'var(--p-border)';
          return (
            <div key={i} className="flex flex-wrap items-baseline justify-between gap-2 text-[12px] py-1">
              <div className="min-w-0 flex-1">
                <span style={{ color: 'var(--p-text)' }}>{item.title}</span>
                <span className="block text-[11px]" style={{ color: 'var(--p-text-dim)' }}>
                  {item.submittedDate}
                </span>
              </div>
              <span
                className="rounded px-1.5 py-0.5 text-[10px] font-medium shrink-0"
                style={{
                  background: chipBg,
                  border: '1px solid ' + chipBorder,
                  color: 'var(--p-text)',
                }}
              >
                {item.status}
              </span>
            </div>
          );
        })}
      </CardRowList>
      <p className="mt-2 text-[10px]" style={{ color: 'var(--p-text-dim)' }}>
        Statuses update automatically from USAJOBS
      </p>
    </ModuleCard>
  );
}

function ResumeCard(props: {
  progressPercent: number;
  checklist: Array<{ label: string; checked: boolean }>;
  openCtaLabel: string;
}) {
  return (
    <ModuleCard title="RESUME" subtitle={props.progressPercent + '% complete'} variant="dense">
      <div
        className="h-2 rounded-full overflow-hidden mt-1"
        style={{ background: 'var(--p-surface2)' }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: props.progressPercent + '%',
            background: 'var(--p-accent)',
          }}
        />
      </div>
      <CardRowList className="mt-3 text-[12px]">
        {props.checklist.map(function (item, i) {
          return (
            <div key={i} className="flex items-center gap-2 py-1" style={{ color: 'var(--p-text-muted)' }}>
              <span
                className="inline-block w-4 h-4 rounded border flex-shrink-0 grid place-items-center text-[10px]"
                style={{
                  borderColor: 'var(--p-border)',
                  background: item.checked ? 'var(--p-success)' : 'var(--p-surface2)',
                  color: item.checked ? 'var(--p-bg)' : 'var(--p-text-dim)',
                }}
              >
                {item.checked ? '✓' : ''}
              </span>
              {item.label}
            </div>
          );
        })}
      </CardRowList>
      <button
        type="button"
        className="mt-3 w-full rounded-[var(--p-radius)] px-3 py-2 text-sm font-medium transition-colors hover:opacity-90 flex items-center justify-center gap-1.5"
        style={{
          background: 'var(--p-surface2)',
          border: '1px solid var(--p-border)',
          color: 'var(--p-text)',
        }}
      >
        {props.openCtaLabel}
        <ExternalLink className="w-3.5 h-3.5" style={{ color: 'var(--p-text-muted)' }} />
      </button>
    </ModuleCard>
  );
}

// ---------------------------------------------------------------------------
// Signals: Updates since visit, Readiness deltas, Timeline estimates
// ---------------------------------------------------------------------------

const SIGNAL_ICONS: Record<string, React.ReactNode> = {
  bell: <Bell className="w-3.5 h-3.5" style={{ color: 'var(--p-text-muted)' }} />,
  document: <FileText className="w-3.5 h-3.5" style={{ color: 'var(--p-text-muted)' }} />,
  trend: <TrendingUp className="w-3.5 h-3.5" style={{ color: 'var(--p-success)' }} />,
  clock: <Clock className="w-3.5 h-3.5" style={{ color: 'var(--p-text-muted)' }} />,
  warning: <AlertTriangle className="w-3.5 h-3.5" style={{ color: 'var(--p-warning)' }} />,
};

function UpdatesSinceVisitCard(props: {
  items: Array<{ icon: string; text: string; timeAgo: string }>;
}) {
  return (
    <ModuleCard title="UPDATES SINCE LAST VISIT" variant="dense">
      <CardRowList className="mt-0">
        {props.items.map(function (item, i) {
          const iconEl = SIGNAL_ICONS[item.icon];
          return (
            <div key={i} className="flex gap-2 text-[12px] py-1">
              <span className="flex-shrink-0 mt-0.5">{iconEl != null ? iconEl : null}</span>
              <div className="min-w-0 flex-1">
                <span style={{ color: 'var(--p-text)' }}>{item.text}</span>
                <span className="block text-[11px]" style={{ color: 'var(--p-text-dim)' }}>
                  {item.timeAgo}
                </span>
              </div>
            </div>
          );
        })}
      </CardRowList>
    </ModuleCard>
  );
}

function ReadinessDeltasCard(props: {
  items: Array<{
    label: string;
    delta: string;
    deltaPositive?: boolean;
    deltaNegative?: boolean;
    explanation: string;
  }>;
}) {
  return (
    <ModuleCard title="READINESS DELTAS" variant="dense">
      <CardRowList className="mt-0">
        {props.items.map(function (item, i) {
          const deltaColor = item.deltaPositive
            ? 'var(--p-success)'
            : item.deltaNegative
              ? 'var(--p-danger)'
              : 'var(--p-text-muted)';
          return (
            <div key={i} className="text-[12px] py-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span style={{ color: 'var(--p-text)' }}>{item.label}</span>
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-medium shrink-0"
                  style={{
                    background: 'var(--p-surface2)',
                    border: '1px solid var(--p-border)',
                    color: deltaColor,
                  }}
                >
                  {item.delta}
                </span>
              </div>
              <p className="mt-0.5 text-[11px]" style={{ color: 'var(--p-text-muted)' }}>
                {item.explanation}
              </p>
            </div>
          );
        })}
      </CardRowList>
    </ModuleCard>
  );
}

function TimelineEstimatesCard(props: {
  disclaimer: string;
  items: Array<{ label: string; range: string }>;
  methodology: string;
}) {
  const openBriefing = usePathAdvisorBriefingStore(function (s) {
    return s.openBriefing;
  });

  const handleAskPathAdvisor = useCallback(function () {
    openBriefing({
      id: 'timeline-methodology',
      title: 'How PathAdvisor estimates timelines',
      sourceLabel: 'Timeline estimates',
      sections: [
        {
          heading: 'Data is historical',
          body: 'These estimates are derived from aggregated USAJOBS data and user-reported timelines.',
        },
        {
          heading: 'Ranges vary',
          body: 'Factors like agency workload, clearance requirements, and hiring authority type can significantly extend or shorten these windows.',
        },
        {
          heading: 'No guarantees',
          body: 'They reflect median values, not guarantees. Your timeline may be shorter or longer.',
        },
        {
          heading: 'What signals matter',
          body: 'PathAdvisor uses job series, agency, and submission date to align you with similar cases; updates may refine estimates as more data is available.',
        },
      ],
    });
  }, [openBriefing]);

  return (
    <ModuleCard title="TIMELINE ESTIMATES" variant="dense">
      <p className="text-[11px] flex items-start gap-1.5 mt-0" style={{ color: 'var(--p-text-muted)' }}>
        <span className="flex-shrink-0 mt-0.5">
          <LayoutList className="w-3.5 h-3.5" style={{ color: 'var(--p-info)' }} />
        </span>
        {props.disclaimer}
      </p>
      <div className="mt-2 pt-2 text-[12px]" style={{ borderTop: '1px solid var(--p-border-light)' }}>
        <CardRowList>
          {props.items.map(function (item, i) {
            return (
              <div key={i} className="flex justify-between gap-2 py-1">
                <span style={{ color: 'var(--p-text)' }}>{item.label}</span>
                <span style={{ color: 'var(--p-text-muted)' }}>{item.range}</span>
              </div>
            );
          })}
        </CardRowList>
      </div>
      <div className="mt-2">
        <AskPathAdvisorButton
          onClick={handleAskPathAdvisor}
          size="sm"
          tooltipId="timeline-ask-pathadvisor-tooltip"
          tooltipText="Opens PathAdvisor briefing explaining how timeline estimates are calculated."
        />
      </div>
    </ModuleCard>
  );
}

// ---------------------------------------------------------------------------
// Placeholder fallbacks when no data (minimal; match prior scaffold)
// ---------------------------------------------------------------------------

function FocusPlaceholderCard(props: { title: string; reason: string }) {
  return (
    <ModuleCard title={props.title}>
      <p className="mt-0.5" style={{ color: 'var(--p-text-muted)', fontSize: 'var(--p-font-size-body)' }}>
        {props.reason}
      </p>
      <button
        type="button"
        className="mt-3 rounded-[var(--p-radius)] px-3 py-1.5 text-sm font-medium opacity-60 cursor-not-allowed"
        style={{ background: 'var(--p-accent)', color: 'var(--p-bg)' }}
      >
        Do this
      </button>
    </ModuleCard>
  );
}

function TrackPlaceholderCard(props: { title: string }) {
  return (
    <ModuleCard title={props.title} variant="dense">
      <p className="mt-0.5" style={{ color: 'var(--p-text-muted)', fontSize: 'var(--p-font-size-body)' }}>
        Placeholder. No real logic in Pass 1.
      </p>
    </ModuleCard>
  );
}

function SignalPlaceholderCard(props: { title: string }) {
  return (
    <ModuleCard title={props.title} variant="dense">
      <p className="mt-0.5" style={{ color: 'var(--p-text-muted)', fontSize: 'var(--p-font-size-body)' }}>
        Stub. No real logic in Pass 1.
      </p>
    </ModuleCard>
  );
}

// ---------------------------------------------------------------------------
// Main dashboard screen — Command Center layout driven by optional data
// ---------------------------------------------------------------------------

export function DashboardScreen(props: DashboardScreenProps) {
  const hasWeeklyBriefing = props.onOpenWeeklyBriefing !== undefined && props.onOpenWeeklyBriefing !== null;
  const data = props.data;
  const hasData = data !== undefined && data !== null;
  const trackedAppsCount = hasData && data.applications ? data.applications.length : 0;
  const hasGuidedApplyContext = props.hasGuidedApplyContext === true;
  // State-aware right-side focus cards: no tracked apps -> "Track an application"; no guided-apply context -> "Start Guided Apply"
  const firstRightCard =
    hasData && data.focusSmall && data.focusSmall.length >= 1 && trackedAppsCount > 0
      ? data.focusSmall[0]
      : {
          title: 'Track an application',
          description:
            'Add an application to track, then PathOS can translate updates and next steps.',
          ctaLabel: 'Track',
        };
  const secondRightCard =
    hasGuidedApplyContext && hasData && data.focusSmall && data.focusSmall.length >= 2
      ? data.focusSmall[1]
      : {
          title: 'Start Guided Apply',
          description:
            'When you start an application, we will help align questionnaire responses to the announcement.',
          ctaLabel: 'Start',
        };

  return (
    <div className="p-4 lg:p-5 space-y-5">
      {/* Header: title, subtitle, optional Weekly briefing button */}
      <div className="flex flex-wrap items-start justify-between gap-3">
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
            Your command center for federal job search.
          </p>
        </div>
        {hasWeeklyBriefing ? (
          <button
            type="button"
            onClick={props.onOpenWeeklyBriefing}
            className="rounded-[var(--p-radius)] px-3 py-2 text-sm font-medium transition-colors hover:opacity-90 shrink-0 flex items-center gap-1.5"
            style={{
              background: 'var(--p-surface2)',
              border: '1px solid var(--p-border)',
              color: 'var(--p-text)',
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: 'var(--p-accent)' }} />
            Weekly briefing (60–90s)
          </button>
        ) : null}
      </div>

      {/* A) Briefing row: 4 compact tiles */}
      {hasData && data.briefing && data.briefing.length > 0 ? (
        <div>
          <SectionHeader title="Briefing" lastUpdated={data.lastUpdated} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.briefing.map(function (tile, i) {
              return (
                <BriefingTile
                  key={i}
                  label={tile.label}
                  value={tile.value}
                  subtext={tile.subtext}
                  subtextPositive={tile.subtextPositive}
                />
              );
            })}
          </div>
        </div>
      ) : null}

      {/* B) Today's Focus: 3-col grid — hero left (col-span-2 row-span-2), Decode top-right, Tighten/Start bottom-right */}
      <div>
        <SectionHeader title="Today's Focus" lastUpdated={hasData && data.lastUpdated ? data.lastUpdated : undefined} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hasData && data.focusHero != null ? (
            <FocusHeroCard
              title={data.focusHero.title}
              reason={data.focusHero.reason}
              ctaLabel={data.focusHero.ctaLabel}
              stepBadge={data.focusHero.stepBadge}
              explainKnow={data.focusHero.explainKnow}
              explainNotKnow={data.focusHero.explainNotKnow}
              explainWhy={data.focusHero.explainWhy}
              estimatedTime={data.focusHero.estimatedTime}
              whyItMatters={data.focusHero.whyItMatters}
              whatYoullDo={data.focusHero.whatYoullDo}
              onCtaClick={props.onFixResumeGap}
              className="md:col-span-2 md:row-span-2"
            />
          ) : (
            <div className="md:col-span-2 md:row-span-2">
              <FocusPlaceholderCard
                title="Focus item 1"
                reason="One-line reason placeholder."
              />
            </div>
          )}
          {hasData ? (
            <>
              <div className="md:col-start-3 md:row-start-1">
                <FocusSmallCard
                  title={firstRightCard.title}
                  description={firstRightCard.description}
                  ctaLabel={firstRightCard.ctaLabel}
                  onCtaClick={props.onDecodeTrackedApp}
                  ctaTooltip={
                    trackedAppsCount === 0
                      ? 'Track an application. Add an application to track, then PathOS can translate updates and next steps.'
                      : 'Decode your latest status. Understand what your USAJOBS application status means.'
                  }
                />
              </div>
              <div className="md:col-start-3 md:row-start-2">
                <FocusSmallCard
                  title={secondRightCard.title}
                  description={secondRightCard.description}
                  ctaLabel={secondRightCard.ctaLabel}
                  onCtaClick={props.onReviewQuestionnaire}
                  ctaTooltip={
                    hasGuidedApplyContext
                      ? 'Tighten questionnaire alignment. Review self-assessment responses against the announcement.'
                      : 'Start Guided Apply. We will help align questionnaire responses to the announcement.'
                  }
                />
              </div>
            </>
          ) : (
            <>
              <div className="md:col-start-3 md:row-start-1">
                <FocusPlaceholderCard title="Focus item 2" reason="One-line reason placeholder." />
              </div>
              <div className="md:col-start-3 md:row-start-2">
                <FocusPlaceholderCard title="Focus item 3" reason="One-line reason placeholder." />
              </div>
            </>
          )}
        </div>
      </div>

      {/* C) Your Active Tracks: Saved Jobs, Applications, Resume */}
      <div>
        <SectionHeader title="Your Active Tracks" lastUpdated={hasData && data.lastUpdated ? data.lastUpdated : undefined} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hasData && data.savedJobs && data.savedJobs.length > 0 ? (
            <SavedJobsCard items={data.savedJobs} />
          ) : (
            <TrackPlaceholderCard title="Saved Jobs" />
          )}
          {hasData && data.applications && data.applications.length > 0 ? (
            <ApplicationsCard items={data.applications} />
          ) : (
            <TrackPlaceholderCard title="Applications" />
          )}
          {hasData && data.resume ? (
            <ResumeCard
              progressPercent={data.resume.progressPercent}
              checklist={data.resume.checklist}
              openCtaLabel={data.resume.openCtaLabel}
            />
          ) : (
            <TrackPlaceholderCard title="Resume" />
          )}
        </div>
      </div>

      {/* D) Signals: Updates, Readiness deltas, Timeline estimates */}
      <div>
        <SectionHeader title="Signals" lastUpdated={hasData && data.lastUpdated ? data.lastUpdated : undefined} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {hasData && data.updatesSinceVisit && data.updatesSinceVisit.length > 0 ? (
            <UpdatesSinceVisitCard items={data.updatesSinceVisit} />
          ) : (
            <SignalPlaceholderCard title="Updates since last visit" />
          )}
          {hasData && data.readinessDeltas && data.readinessDeltas.length > 0 ? (
            <ReadinessDeltasCard items={data.readinessDeltas} />
          ) : (
            <SignalPlaceholderCard title="Readiness deltas" />
          )}
          {hasData && data.timelineEstimates && data.timelineEstimates.length > 0 ? (
            <TimelineEstimatesCard
              disclaimer={data.timelineDisclaimer}
              items={data.timelineEstimates}
              methodology={data.timelineMethodology}
            />
          ) : (
            <SignalPlaceholderCard title="Timeline estimates" />
          )}
        </div>
      </div>
    </div>
  );
}
