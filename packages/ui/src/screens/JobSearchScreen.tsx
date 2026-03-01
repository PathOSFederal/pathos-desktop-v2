/**
 * ============================================================================
 * JOB SEARCH SCREEN V1 — Local-only job browsing, prompted filters, PathAdvisor
 * ============================================================================
 *
 * BOUNDARY RULE: This file MUST NOT import from next/* or electron/*.
 *
 * TRUST-FIRST: No scraping, no auto-apply. Jobs from local mock; save adds to
 * core saved-jobs store so they appear in Saved Jobs screen.
 *
 * LAYOUT: Title/subtitle, Prompted Filters card, Search row, Filters bar,
 * Results list (left) + Job details (center). PathAdvisor rail via overrides.
 */

'use client';

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  ExternalLink,
  BookmarkPlus,
  BookmarkCheck,
  Briefcase,
  Inbox,
  Sparkles,
  X,
  Check,
} from 'lucide-react';
import { useNav } from '@pathos/adapters';
import { storageSetJSON, PROMPT_TO_FILTERS_AUDIT_KEY } from '@pathos/core';
import {
  createSession,
  addSession,
  loadGuidedApplyStore,
  saveGuidedApplyStore,
} from '@pathos/core';
import type { Job } from '@pathos/core';
import { useJobSearchV1Store } from '../stores/jobSearchV1Store';
import { usePathAdvisorScreenOverridesStore } from '../stores/pathAdvisorScreenOverridesStore';
import { AskPathAdvisorButton } from '../components/AskPathAdvisorButton';
import { useDashboardHeroDoNowStore } from '../stores/dashboardHeroDoNowStore';
import { parsePromptToFilters, type ParsedPromptResult } from '../lib/promptToFiltersParser';
import { getChecklistForJob } from './jobSearchMockChecklists';
import { MOCK_JOBS, MOCK_JOB_TAGS } from './jobSearchMockJobs';
import { FilterDropdown } from './_components/FilterDropdown';

const JOB_SEARCH_SUGGESTED_PROMPTS = [
  'Summarize in plain English',
  'Do I meet specialized experience?',
  'What should I do next?',
  'Compare to my resume',
];

const PLACEHOLDER_PROMPT =
  'Remote GS-12 cybersecurity roles at DHS or VA near DC, open for 2+ weeks';

/** Filter dropdown options: Grades (GS-9..GS-15 + All). */
const GRADE_OPTIONS = [
  { value: '', label: 'All Grades' },
  { value: 'GS-9', label: 'GS-9' },
  { value: 'GS-10', label: 'GS-10' },
  { value: 'GS-11', label: 'GS-11' },
  { value: 'GS-12', label: 'GS-12' },
  { value: 'GS-13', label: 'GS-13' },
  { value: 'GS-14', label: 'GS-14' },
  { value: 'GS-15', label: 'GS-15' },
];

/** Filter dropdown options: Series (2210, 0343, 0301, 1102 + All). */
const SERIES_OPTIONS = [
  { value: '', label: 'All Series' },
  { value: '2210', label: '2210' },
  { value: '0343', label: '0343' },
  { value: '0301', label: '0301' },
  { value: '1102', label: '1102' },
];

/** Filter dropdown options: Types = appointment type (Competitive, Excepted, Term + All). */
const TYPES_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'Competitive', label: 'Competitive' },
  { value: 'Excepted', label: 'Excepted' },
  { value: 'Term', label: 'Term' },
];

/** Derive unique agencies from MOCK_JOBS for filter dropdown (no spread). */
function getAgencyOptions(): Array<{ value: string; label: string }> {
  const out: Array<{ value: string; label: string }> = [{ value: '', label: 'All Agencies' }];
  const seen: Record<string, boolean> = {};
  for (let i = 0; i < MOCK_JOBS.length; i++) {
    const a = MOCK_JOBS[i].agency;
    if (a !== undefined && a !== '' && seen[a] !== true) {
      seen[a] = true;
      out.push({ value: a, label: a });
    }
  }
  out.sort(function (x, y) {
    return x.label.localeCompare(y.label);
  });
  return out;
}

/** Derive unique locations from MOCK_JOBS for filter dropdown (no spread). */
function getLocationOptions(): Array<{ value: string; label: string }> {
  const out: Array<{ value: string; label: string }> = [{ value: '', label: 'Any Location' }];
  const seen: Record<string, boolean> = {};
  for (let i = 0; i < MOCK_JOBS.length; i++) {
    const loc = MOCK_JOBS[i].location;
    if (loc !== undefined && loc !== '' && seen[loc] !== true) {
      seen[loc] = true;
      out.push({ value: loc, label: loc });
    }
  }
  out.sort(function (x, y) {
    return x.label.localeCompare(y.label);
  });
  return out;
}

const AGENCY_OPTIONS = getAgencyOptions();
const LOCATION_OPTIONS = getLocationOptions();

export interface JobSearchScreenProps {
  initialQuery?: string;
}

// ---------------------------------------------------------------------------
// Job list item (title, agency, location, close date, GS chip, fit, Save, tags)
// ---------------------------------------------------------------------------

function JobListItem(props: {
  job: Job;
  isSelected: boolean;
  isSaved: boolean;
  fitLabel: string;
  tag?: 'New' | 'Close date updated';
  onSelect: (id: string) => void;
  onSave: () => void;
}) {
  return (
    <div
      className="border-b last:border-b-0"
      style={{ borderColor: 'var(--p-border)' }}
    >
      <div className="flex items-start gap-2 px-3 py-2">
        <div className="flex-1 min-w-0">
          {props.tag !== undefined ? (
            <span
              className="text-[10px] font-medium uppercase tracking-wide block mb-0.5"
              style={{ color: 'var(--p-accent)' }}
            >
              {props.tag}
            </span>
          ) : null}
          <button
            type="button"
            onClick={function () { props.onSelect(props.job.id); }}
            className="w-full text-left"
          >
            <p className="text-sm font-medium truncate" style={{ color: 'var(--p-text)' }}>
              {props.job.title}
            </p>
          </button>
          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--p-text-muted)' }}>
            {props.job.agency}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--p-text-dim)' }}>
            {props.job.location}
            {props.job.location ? ' — ' : ''}Closes Apr 1
          </p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {props.job.grade !== undefined && props.job.grade !== '' ? (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                style={{ background: 'var(--p-accent-bg)', color: 'var(--p-accent)' }}
              >
                {props.job.grade}
              </span>
            ) : null}
            <span
              className="text-[10px]"
              style={{ color: 'var(--p-text-dim)' }}
            >
              {props.fitLabel} fit
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={props.onSave}
          className="flex-shrink-0 px-2 py-1 text-xs font-medium rounded"
          style={{
            background: props.isSaved ? 'var(--p-accent)' : 'var(--p-surface2)',
            color: props.isSaved ? 'var(--p-bg)' : 'var(--p-text-muted)',
            border: props.isSaved ? 'none' : '1px solid var(--p-border)',
            borderRadius: 'var(--p-radius)',
          }}
        >
          {props.isSaved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Job details panel — Executive briefing layout (header, requirements, action bar)
// Same card rhythm as ModuleCard: p-4, section spacing, line-height. No long paragraphs.
// ---------------------------------------------------------------------------

function JobDetailsPanel(props: {
  job: Job | undefined;
  isSaved: boolean;
  onSave: () => void;
  onTailor: () => void;
  onAskPathAdvisor: () => void;
}) {
  if (props.job === undefined || props.job === null) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center gap-3 p-8"
        style={{ color: 'var(--p-text-dim)' }}
      >
        <Briefcase className="w-10 h-10 opacity-40" />
        <p className="text-sm">Select a job to view details</p>
      </div>
    );
  }

  const job = props.job;
  const usajobsUrl = job.url !== undefined && job.url !== '' ? job.url : 'https://www.usajobs.gov';
  const checklist = getChecklistForJob(job.id);

  /* Meta chips: GS, Close date, Remote/Telework/Series if present (from summary/location). */
  const hasRemote = job.summary && job.summary.toLowerCase().indexOf('remote') !== -1;
  const hasTelework = job.summary && job.summary.toLowerCase().indexOf('telework') !== -1;
  const seriesMatch = job.summary && job.summary.match(/\bSeries\s+(\d+)\b/);
  const seriesLabel = seriesMatch ? seriesMatch[1] : null;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Scrollable content: executive card padding and section spacing (aligned with ModuleCard rhythm). */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5" style={{ lineHeight: 'var(--p-line-height-body)' }}>
        {/* Header block: title (primary), agency + location (secondary), meta chips, 1–2 line summary (muted). */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--p-text)' }}>
            {job.title}
          </h2>
          <p className="text-sm" style={{ color: 'var(--p-text-muted)' }}>
            {job.agency}
            {job.location ? ' · ' + job.location : ''}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {job.grade !== undefined && job.grade !== '' ? (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                style={{ background: 'var(--p-accent-bg)', color: 'var(--p-accent)' }}
              >
                {job.grade}
              </span>
            ) : null}
            <span className="text-[11px]" style={{ color: 'var(--p-text-dim)' }}>
              Closes Apr 1
            </span>
            {hasRemote ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--p-surface2)', color: 'var(--p-text-muted)' }}>
                Remote
              </span>
            ) : null}
            {hasTelework ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--p-surface2)', color: 'var(--p-text-muted)' }}>
                Telework
              </span>
            ) : null}
            {seriesLabel !== null ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--p-surface2)', color: 'var(--p-text-muted)' }}>
                Series {seriesLabel}
              </span>
            ) : null}
          </div>
          {job.summary !== undefined && job.summary !== '' ? (
            <p className="text-sm leading-relaxed max-w-none" style={{ color: 'var(--p-text-muted)' }}>
              {job.summary}
            </p>
          ) : null}
        </div>

        {/* Requirements block: specialized experience (checklist + calm icon), skills as chips, documents compact. */}
        {checklist !== null ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--p-text-dim)' }}>
                Specialized experience
              </h3>
              <ul className="list-none space-y-1.5">
                {checklist.specializedExperience.map(function (item, i) {
                  return (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--p-text-muted)' }}>
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--p-success)' }} aria-hidden />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--p-text-dim)' }}>
                Skills & keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {checklist.skillsKeywords.map(function (item, i) {
                  return (
                    <span
                      key={i}
                      className="text-[12px] px-2 py-1 rounded"
                      style={{ background: 'var(--p-surface2)', color: 'var(--p-text-muted)' }}
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--p-text-dim)' }}>
                Documents needed
              </h3>
              <ul className="list-none space-y-1">
                {checklist.documentsNeeded.map(function (item, i) {
                  return (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--p-text-muted)' }}>
                      <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--p-success)' }} aria-hidden />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : null}
      </div>

      {/* Action bar pinned to bottom of card: Save (primary), Tailor (secondary), Ask PathAdvisor (secondary). */}
      <div
        className="flex flex-wrap items-center gap-3 p-4 border-t flex-shrink-0"
        style={{ borderColor: 'var(--p-border)', background: 'var(--p-surface)' }}
      >
        <button
          type="button"
          onClick={props.isSaved ? function () {} : props.onSave}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded"
          style={{
            background: props.isSaved ? 'var(--p-accent)' : 'var(--p-accent)',
            color: 'var(--p-bg)',
            border: 'none',
            borderRadius: 'var(--p-radius)',
          }}
        >
          {props.isSaved ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
          {props.isSaved ? 'Saved' : 'Save job'}
        </button>
        <button
          type="button"
          onClick={props.onTailor}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded"
          style={{
            background: 'var(--p-surface2)',
            color: 'var(--p-text-muted)',
            border: '1px solid var(--p-border)',
            borderRadius: 'var(--p-radius)',
          }}
        >
          Tailor resume
        </button>
        <AskPathAdvisorButton
          onClick={props.onAskPathAdvisor}
          tooltipText="Get briefing for this job from PathAdvisor."
        />
        <a
          href={usajobsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded"
          style={{
            background: 'var(--p-surface2)',
            color: 'var(--p-text-muted)',
            border: '1px solid var(--p-border)',
            borderRadius: 'var(--p-radius)',
          }}
        >
          <ExternalLink className="w-4 h-4" />
          View on USAJOBS
        </a>
      </div>
      <p className="text-[11px] px-4 pb-2" style={{ color: 'var(--p-text-dim)' }}>
        Opens in your browser. PathOS does not access your USAJOBS account.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export function JobSearchScreen(props: JobSearchScreenProps) {
  const nav = useNav();
  const store = useJobSearchV1Store();
  const setOverrides = usePathAdvisorScreenOverridesStore(function (s) {
    return s.setOverrides;
  });
  const setHeroDoNow = useDashboardHeroDoNowStore(function (s) {
    return s.setAction;
  });

  const [mounted, setMounted] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [proposed, setProposed] = useState<ParsedPromptResult | null>(null);
  const [viewAuditOpen, setViewAuditOpen] = useState(false);

  useEffect(function () {
    store.loadFromStorage();
    if (props.initialQuery !== undefined && props.initialQuery !== '') {
      store.setLastQuery({ keywords: props.initialQuery });
    }
    queueMicrotask(function () {
      setMounted(true);
    });
  }, []);

  useEffect(function () {
    setOverrides({
      viewingLabel: 'Job Search',
      suggestedPrompts: JOB_SEARCH_SUGGESTED_PROMPTS,
      briefingLabel: 'From Job Search',
      helperParagraph:
        'Use this workspace to decode job requirements and decide your next best move. Ask about specialized experience, keywords, and what to do next.',
    });
    return function () {
      setOverrides(null);
      setHeroDoNow(null);
    };
  }, [setOverrides, setHeroDoNow]);

  const selectedJob =
    store.selectedJobId !== null
      ? store.results.find(function (j) {
          return j.id === store.selectedJobId;
        })
      : undefined;

  useEffect(function () {
    if (selectedJob !== undefined) {
      setHeroDoNow({
        label: 'Save and start tailoring',
        route: '/dashboard/resume-readiness',
      });
    } else {
      setHeroDoNow(null);
    }
  }, [selectedJob, setHeroDoNow]);

  const handleTranslate = useCallback(function () {
    const trimmed = promptInput.trim();
    if (trimmed === '') return;
    const result = parsePromptToFilters(trimmed);
    setProposed(result);
  }, [promptInput]);

  const handleApplyProposed = useCallback(function () {
    if (proposed === null) return;
    store.applyProposedFiltersFromPrompt(promptInput.trim(), proposed.filters);
    if (proposed.keywords.trim() !== '') {
      store.setLastQuery({
        keywords: proposed.keywords.trim(),
        location: store.lastQuery.location,
      });
    }
    storageSetJSON(PROMPT_TO_FILTERS_AUDIT_KEY, {
      promptText: promptInput.trim(),
      proposedFilters: proposed.filters,
      evidence: proposed.evidence,
      timestamp: new Date().toISOString(),
    });
    setProposed(null);
    store.runSearch();
  }, [proposed, promptInput, store]);

  const handleDiscardProposed = useCallback(function () {
    setProposed(null);
  }, []);

  const handleSearch = useCallback(function () {
    store.runSearch();
  }, [store]);

  const handleReset = useCallback(function () {
    store.setLastQuery({ keywords: '', location: '' });
    store.clearAllFilters();
    store.setAppliedFromPrompt(null);
    store.setFilters({});
    store.persist();
  }, [store]);

  const handleSelectJob = useCallback(
    function (id: string) {
      store.setSelectedJob(id);
    },
    [store]
  );

  const handleSaveJob = useCallback(
    function (job: Job) {
      store.saveJob(job);
    },
    [store]
  );

  const handleStartGuidedApply = useCallback(
    function () {
      if (selectedJob === undefined) return;
      const gaStore = loadGuidedApplyStore();
      const session = createSession(selectedJob.title, selectedJob.url !== undefined ? selectedJob.url : '');
      const updatedGaStore = addSession(gaStore, session);
      saveGuidedApplyStore(updatedGaStore);
      nav.push('/guided-apply');
    },
    [selectedJob, nav]
  );

  const interpretationParts: string[] = [];
  if (proposed !== null) {
    if (proposed.filters.remoteType !== undefined && proposed.filters.remoteType !== '') {
      interpretationParts.push(proposed.filters.remoteType + ' roles');
    }
    if (proposed.filters.gradeBand !== undefined && proposed.filters.gradeBand !== '') {
      interpretationParts.push(proposed.filters.gradeBand);
    }
    if (proposed.filters.agency !== undefined && proposed.filters.agency !== '') {
      interpretationParts.push(proposed.filters.agency);
    }
    if (proposed.filters.location !== undefined && proposed.filters.location !== '') {
      interpretationParts.push(proposed.filters.location + ' area');
    }
    if (proposed.keywords.trim() !== '') {
      interpretationParts.push("keywords '" + proposed.keywords.trim() + "'");
    }
  }
  const interpretationLine =
    proposed !== null && interpretationParts.length > 0
      ? 'Interpreted: ' + interpretationParts.join(', ') + '.'
      : proposed !== null
        ? 'Interpreted: (no structured filters extracted).'
        : '';

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64" style={{ color: 'var(--p-text-dim)' }}>
        <p className="text-sm">Loading job search...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ color: 'var(--p-text)' }}>
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--p-text)' }}>
          Job Search
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--p-text-muted)' }}>
          Explore roles, save targets, and reduce uncertainty.
        </p>
      </div>

      {/* Prompted Filters card */}
      <div
        className="mx-4 mt-2 p-4 rounded-lg border"
        style={{
          background: 'var(--p-surface)',
          borderColor: 'var(--p-border)',
          borderRadius: 'var(--p-radius-lg)',
        }}
      >
        <label className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--p-text)' }}>
          <Sparkles className="w-4 h-4" style={{ color: 'var(--p-accent)' }} />
          Describe what you&apos;re looking for (optional)
        </label>
        <input
          type="text"
          placeholder={PLACEHOLDER_PROMPT}
          value={promptInput}
          onChange={function (e: React.ChangeEvent<HTMLInputElement>) {
            setPromptInput(e.target.value);
          }}
          className="w-full mt-2 px-3 py-2 text-sm rounded border bg-transparent outline-none placeholder:opacity-60"
          style={{
            borderColor: 'var(--p-border)',
            color: 'var(--p-text)',
            borderRadius: 'var(--p-radius)',
          }}
        />
        <p className="text-[12px] mt-1.5" style={{ color: 'var(--p-text-dim)' }}>
          PathOS will translate this into filters you can review and edit before searching.
        </p>
        <button
          type="button"
          onClick={function () {
            setPromptInput(PLACEHOLDER_PROMPT);
          }}
          className="text-[12px] mt-1 block"
          style={{ color: 'var(--p-accent)' }}
        >
          Use example prompt
        </button>
        <button
          type="button"
          disabled={promptInput.trim() === ''}
          onClick={handleTranslate}
          className="mt-3 px-4 py-2 text-sm font-medium rounded"
          style={{
            background: promptInput.trim() === '' ? 'var(--p-surface2)' : 'var(--p-surface2)',
            color: promptInput.trim() === '' ? 'var(--p-text-dim)' : 'var(--p-text)',
            border: '1px solid var(--p-border)',
            borderRadius: 'var(--p-radius)',
          }}
        >
          Translate to filters
        </button>

        {proposed !== null ? (
          <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--p-border)' }}>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--p-text-dim)' }}>
              Proposed filters
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {proposed.filters.gradeBand !== undefined && proposed.filters.gradeBand !== '' ? (
                <span
                  className="text-[11px] px-2 py-0.5 rounded"
                  style={{ background: 'var(--p-surface2)', color: 'var(--p-text-muted)' }}
                >
                  {proposed.filters.gradeBand}
                </span>
              ) : null}
              {proposed.filters.agency !== undefined && proposed.filters.agency !== '' ? (
                <span
                  className="text-[11px] px-2 py-0.5 rounded"
                  style={{ background: 'var(--p-surface2)', color: 'var(--p-text-muted)' }}
                >
                  {proposed.filters.agency}
                </span>
              ) : null}
              {proposed.filters.remoteType !== undefined && proposed.filters.remoteType !== '' ? (
                <span
                  className="text-[11px] px-2 py-0.5 rounded"
                  style={{ background: 'var(--p-surface2)', color: 'var(--p-text-muted)' }}
                >
                  {proposed.filters.remoteType}
                </span>
              ) : null}
              {proposed.filters.location !== undefined && proposed.filters.location !== '' ? (
                <span
                  className="text-[11px] px-2 py-0.5 rounded"
                  style={{ background: 'var(--p-surface2)', color: 'var(--p-text-muted)' }}
                >
                  {proposed.filters.location}
                </span>
              ) : null}
              {proposed.keywords.trim() !== '' ? (
                <span
                  className="text-[11px] px-2 py-0.5 rounded"
                  style={{ background: 'var(--p-surface2)', color: 'var(--p-text-muted)' }}
                >
                  {proposed.keywords.trim()}
                </span>
              ) : null}
            </div>
            <p className="text-[11px] mb-3" style={{ color: 'var(--p-text-dim)' }}>
              {interpretationLine}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleApplyProposed}
                className="px-3 py-1.5 text-sm font-medium rounded"
                style={{
                  background: 'var(--p-accent)',
                  color: 'var(--p-bg)',
                  border: 'none',
                  borderRadius: 'var(--p-radius)',
                }}
              >
                Apply filters
              </button>
              <button
                type="button"
                onClick={function () {
                  setProposed(null);
                  setViewAuditOpen(false);
                }}
                className="px-3 py-1.5 text-sm font-medium rounded"
                style={{
                  background: 'var(--p-surface2)',
                  color: 'var(--p-text-muted)',
                  border: '1px solid var(--p-border)',
                  borderRadius: 'var(--p-radius)',
                }}
              >
                Edit filters
              </button>
              <button
                type="button"
                onClick={handleDiscardProposed}
                className="px-3 py-1.5 text-sm font-medium rounded"
                style={{
                  background: 'var(--p-surface2)',
                  color: 'var(--p-text-muted)',
                  border: '1px solid var(--p-border)',
                  borderRadius: 'var(--p-radius)',
                }}
              >
                Discard
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Search row */}
      <div
        className="mx-4 mt-4 flex flex-wrap items-center gap-3"
        style={{ borderBottom: '1px solid var(--p-border)', paddingBottom: '12px' }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--p-text-dim)' }} />
          <input
            type="text"
            placeholder="Job title, keywords, or series..."
            value={store.lastQuery.keywords}
            onChange={function (e: React.ChangeEvent<HTMLInputElement>) {
              store.setLastQuery({
                keywords: e.target.value,
                location: store.lastQuery.location,
              });
            }}
            className="flex-1 min-w-0 px-3 py-2 text-sm rounded border bg-transparent outline-none"
            style={{
              borderColor: 'var(--p-border)',
              color: 'var(--p-text)',
              borderRadius: 'var(--p-radius)',
            }}
          />
        </div>
        <div className="flex items-center gap-2 min-w-[180px]">
          <input
            type="text"
            placeholder="Location (optional)"
            value={store.lastQuery.location !== undefined ? store.lastQuery.location : ''}
            onChange={function (e: React.ChangeEvent<HTMLInputElement>) {
              store.setLastQuery({
                keywords: store.lastQuery.keywords,
                location: e.target.value.trim() !== '' ? e.target.value : undefined,
              });
            }}
            className="flex-1 min-w-0 px-3 py-2 text-sm rounded border bg-transparent outline-none"
            style={{
              borderColor: 'var(--p-border)',
              color: 'var(--p-text)',
              borderRadius: 'var(--p-radius)',
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2 text-sm font-medium rounded"
          style={{
            background: 'var(--p-accent)',
            color: 'var(--p-bg)',
            border: 'none',
            borderRadius: 'var(--p-radius)',
          }}
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium rounded"
          style={{
            background: 'var(--p-surface2)',
            color: 'var(--p-text-muted)',
            border: '1px solid var(--p-border)',
            borderRadius: 'var(--p-radius)',
          }}
        >
          Reset
        </button>
      </div>
      <p className="text-[11px] mx-4 mt-1" style={{ color: 'var(--p-text-dim)' }}>
        Results shown from saved snapshots (mock) for now.
      </p>

      {/* Filters bar: token-styled portaled dropdowns (Overlay Rule v1). */}
      <div className="mx-4 mt-3 flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Grades"
          value={store.filters.gradeBand !== undefined ? store.filters.gradeBand : ''}
          options={GRADE_OPTIONS}
          onSelect={function (v) {
            const next = Object.assign({}, store.filters);
            if (v === '') delete next.gradeBand;
            else next.gradeBand = v;
            store.setFilters(next);
          }}
        />
        <FilterDropdown
          label="Series"
          value={store.filters.series !== undefined ? store.filters.series : ''}
          options={SERIES_OPTIONS}
          onSelect={function (v) {
            const next = Object.assign({}, store.filters);
            if (v === '') delete next.series;
            else next.series = v;
            store.setFilters(next);
          }}
        />
        <FilterDropdown
          label="Agencies"
          value={store.filters.agency !== undefined ? store.filters.agency : ''}
          options={AGENCY_OPTIONS}
          onSelect={function (v) {
            const next = Object.assign({}, store.filters);
            if (v === '') delete next.agency;
            else next.agency = v;
            store.setFilters(next);
          }}
        />
        <FilterDropdown
          label="Location"
          value={store.filters.location !== undefined ? store.filters.location : ''}
          options={LOCATION_OPTIONS}
          onSelect={function (v) {
            const next = Object.assign({}, store.filters);
            if (v === '') delete next.location;
            else next.location = v;
            store.setFilters(next);
          }}
        />
        <FilterDropdown
          label="Types"
          value={store.filters.appointmentType !== undefined ? store.filters.appointmentType : ''}
          options={TYPES_OPTIONS}
          onSelect={function (v) {
            const next = Object.assign({}, store.filters);
            if (v === '') delete next.appointmentType;
            else next.appointmentType = v;
            store.setFilters(next);
          }}
        />
        <button
          type="button"
          onClick={store.clearAllFilters}
          className="text-xs px-2 py-1"
          style={{ color: 'var(--p-text-dim)' }}
        >
          Clear all filters
        </button>
        {store.appliedFromPrompt !== null && store.appliedFromPrompt !== undefined ? (
          <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--p-text-dim)' }}>
            Applied from prompt
            <button
              type="button"
              onClick={function () {
                setViewAuditOpen(!viewAuditOpen);
              }}
              className="underline"
            >
              View
            </button>
          </span>
        ) : null}
      </div>

      {viewAuditOpen && store.appliedFromPrompt !== null && store.appliedFromPrompt !== undefined ? (
        <div
          className="mx-4 mt-2 p-3 rounded border"
          style={{
            background: 'var(--p-surface2)',
            borderColor: 'var(--p-border)',
            borderRadius: 'var(--p-radius)',
          }}
        >
          <p className="text-xs font-medium" style={{ color: 'var(--p-text)' }}>
            Prompt
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--p-text-muted)' }}>
            {store.appliedFromPrompt.promptText}
          </p>
          <button
            type="button"
            onClick={function () {
              setViewAuditOpen(false);
            }}
            className="mt-2 text-xs flex items-center gap-1"
            style={{ color: 'var(--p-text-dim)' }}
          >
            <X className="w-3 h-3" />
            Close
          </button>
        </div>
      ) : null}

      {/* Main: 2-column grid — results (340–460px) + details (min 560px, 1fr). Scroll Invariant v1: min-h-0 so flex children can shrink. */}
      <div
        className="flex-1 min-h-0 mt-4 grid gap-4"
        style={{
          gridTemplateColumns: 'minmax(340px, min(460px, 400px)) minmax(560px, 1fr)',
        }}
      >
        <div
          className="flex flex-col rounded-lg border overflow-hidden min-w-0"
          style={{
            borderColor: 'var(--p-border)',
            background: 'var(--p-surface)',
            borderRadius: 'var(--p-radius-lg)',
          }}
        >
          <div className="flex-1 min-h-0 overflow-y-auto">
            {store.loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map(function (i) {
                  return (
                    <div
                      key={i}
                      className="h-16 rounded"
                      style={{ background: 'var(--p-surface2)' }}
                    />
                  );
                })}
              </div>
            ) : !store.hasSearched ? (
              <div
                className="flex flex-col items-center justify-center gap-3 p-8 text-center"
                style={{ color: 'var(--p-text-dim)' }}
              >
                <Inbox className="w-10 h-10 opacity-40" />
                <p className="text-sm">Run a search to view jobs.</p>
                <button
                  type="button"
                  onClick={function () { store.loadSampleJobs(); }}
                  className="px-4 py-2 text-sm font-medium rounded"
                  style={{
                    background: 'var(--p-surface2)',
                    color: 'var(--p-text)',
                    border: '1px solid var(--p-border)',
                    borderRadius: 'var(--p-radius)',
                  }}
                >
                  Load sample jobs
                </button>
              </div>
            ) : store.results.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center gap-3 p-8 text-center"
                style={{ color: 'var(--p-text-dim)' }}
              >
                <Inbox className="w-10 h-10 opacity-40" />
                <p className="text-sm">No jobs found.</p>
                <p className="text-xs">Try broadening keywords or clearing filters.</p>
              </div>
            ) : (
              store.results.map(function (job, idx) {
                const tag = MOCK_JOB_TAGS[job.id];
                const fitLabels = ['High', 'Medium', 'Low'];
                const fitLabel = fitLabels[idx % 3];
                return (
                  <div
                    key={job.id}
                    style={{
                      background:
                        store.selectedJobId === job.id ? 'var(--p-surface2)' : undefined,
                      borderLeft:
                        store.selectedJobId === job.id
                          ? '3px solid var(--p-accent)'
                          : '3px solid transparent',
                    }}
                  >
                    <JobListItem
                      job={job}
                      isSelected={store.selectedJobId === job.id}
                      isSaved={store.isJobSaved(job.id)}
                      fitLabel={fitLabel}
                      tag={tag}
                      onSelect={handleSelectJob}
                      onSave={function () {
                        if (store.isJobSaved(job.id)) {
                          store.removeSavedJob(job.id);
                        } else {
                          handleSaveJob(job);
                        }
                      }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div
          className="flex flex-col rounded-lg border overflow-hidden min-w-0"
          style={{
            borderColor: 'var(--p-border)',
            background: 'var(--p-surface)',
            borderRadius: 'var(--p-radius-lg)',
          }}
        >
          <JobDetailsPanel
            job={selectedJob}
            isSaved={selectedJob !== undefined ? store.isJobSaved(selectedJob.id) : false}
            onSave={function () {
              if (selectedJob !== undefined) handleSaveJob(selectedJob);
            }}
            onTailor={function () {
              nav.push('/dashboard/resume-readiness');
            }}
            onAskPathAdvisor={function () {}}
          />
        </div>
      </div>
    </div>
  );
}
