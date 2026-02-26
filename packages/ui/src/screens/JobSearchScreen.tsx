/**
 * ============================================================================
 * JOB SEARCH SCREEN -- Local-only job browsing + Guided Apply handoff
 * ============================================================================
 *
 * BOUNDARY RULE: This file MUST NOT import from next/* or electron/*.
 *
 * TRUST-FIRST: No scraping, no auto-apply, no credentials.
 * Jobs are from a local mock dataset. USAJOBS links open externally.
 *
 * PERSISTENCE: All state stored locally via @pathos/core job-storage.
 */

'use client';

import type React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search,
  ExternalLink,
  BookmarkPlus,
  BookmarkCheck,
  ClipboardList,
  MapPin,
  Building2,
  DollarSign,
  Briefcase,
  ChevronRight,
  Inbox,
} from 'lucide-react';
import { useNav } from '@pathos/adapters';
import {
  loadJobSearchStore,
  saveJobSearchStore,
  loadMockResultsIfEmpty,
  ensureValidSelection,
  selectJob,
  getSelectedJob,
  saveJob as saveJobToStore,
  removeJob,
  isJobSaved,
  updateSearchQuery,
  createSession,
  addSession,
  loadGuidedApplyStore,
  saveGuidedApplyStore,
} from '@pathos/core';
import type { Job, JobSearchStore } from '@pathos/core';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface JobSearchScreenProps {
  /** Optional initial search query */
  initialQuery?: string;
}

// ---------------------------------------------------------------------------
// Sub-component: Job list item
// ---------------------------------------------------------------------------

function JobListItem(props: {
  job: Job;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={function () { props.onSelect(props.job.id); }}
      className="w-full text-left px-4 py-3 transition-colors"
      style={{
        background: props.isSelected ? 'var(--p-surface2)' : 'transparent',
        borderLeft: props.isSelected ? '3px solid var(--p-accent)' : '3px solid transparent',
      }}
    >
      <p className="text-sm font-medium truncate" style={{ color: 'var(--p-text)' }}>
        {props.job.title}
      </p>
      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--p-text-muted)' }}>
        {props.job.agency}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[11px]" style={{ color: 'var(--p-text-dim)' }}>
          {props.job.location}
        </span>
        {props.job.grade && (
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ background: 'var(--p-accent-bg)', color: 'var(--p-accent)' }}
          >
            {props.job.grade}
          </span>
        )}
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Job details panel (right pane)
// ---------------------------------------------------------------------------

function JobDetailsPanel(props: {
  job: Job | undefined;
  isSaved: boolean;
  onSave: () => void;
  onRemove: () => void;
  onStartGuidedApply: () => void;
}) {
  if (!props.job) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8" style={{ color: 'var(--p-text-dim)' }}>
        <Briefcase className="w-10 h-10 opacity-40" />
        <p className="text-sm">Select a job to view details</p>
      </div>
    );
  }

  const job = props.job;
  const usajobsUrl = job.url || 'https://www.usajobs.gov';

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--p-text)' }}>
          {job.title}
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: 'var(--p-text-muted)' }}>
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" style={{ color: 'var(--p-accent)' }} />
            {job.agency}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--p-text-dim)' }} />
            {job.location}
          </span>
        </div>
      </div>

      {/* Key details */}
      <div
        className="grid gap-3 grid-cols-2 p-4 rounded-lg"
        style={{ background: 'var(--p-surface2)', borderRadius: 'var(--p-radius-lg)' }}
      >
        {job.grade && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--p-text-dim)' }}>Grade</p>
            <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--p-text)' }}>{job.grade}</p>
          </div>
        )}
        {job.salaryRange && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--p-text-dim)' }}>Salary Range</p>
            <p className="text-sm font-semibold mt-0.5 flex items-center gap-1" style={{ color: 'var(--p-success)' }}>
              <DollarSign className="w-3.5 h-3.5" />
              {job.salaryRange}
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      {job.summary && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--p-text-dim)' }}>Summary</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--p-text-muted)' }}>{job.summary}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-2">
        {/* View on USAJOBS */}
        <a
          href={usajobsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
          style={{
            background: 'var(--p-accent)',
            color: 'var(--p-bg)',
            borderRadius: 'var(--p-radius)',
          }}
        >
          <ExternalLink className="w-4 h-4" />
          View on USAJOBS
        </a>

        {/* Save / Remove */}
        <button
          type="button"
          onClick={props.isSaved ? props.onRemove : props.onSave}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
          style={{
            background: props.isSaved ? 'var(--p-surface2)' : 'transparent',
            color: props.isSaved ? 'var(--p-success)' : 'var(--p-text-muted)',
            border: '1px solid var(--p-border)',
            borderRadius: 'var(--p-radius)',
          }}
        >
          {props.isSaved ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
          {props.isSaved ? 'Saved' : 'Save Job'}
        </button>

        {/* Start Guided Apply */}
        <button
          type="button"
          onClick={props.onStartGuidedApply}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
          style={{
            background: 'color-mix(in srgb, var(--p-success) 15%, transparent)',
            color: 'var(--p-success)',
            border: '1px solid color-mix(in srgb, var(--p-success) 30%, transparent)',
            borderRadius: 'var(--p-radius)',
          }}
        >
          <ClipboardList className="w-4 h-4" />
          Start Guided Apply
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Trust microcopy */}
      <p className="text-[11px] pt-2" style={{ color: 'var(--p-text-dim)' }}>
        Opens in your browser. PathOS does not access your USAJOBS account.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Empty state
// ---------------------------------------------------------------------------

function EmptySearchState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: 'var(--p-surface2)' }}
      >
        <Inbox className="w-8 h-8" style={{ color: 'var(--p-text-dim)' }} />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium" style={{ color: 'var(--p-text)' }}>No results found</p>
        <p className="text-xs" style={{ color: 'var(--p-text-dim)' }}>
          Try a different search term or browse all available positions.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export function JobSearchScreen(props: JobSearchScreenProps) {
  const nav = useNav();
  const [store, setStore] = useState<JobSearchStore>({
    schemaVersion: 1,
    savedJobs: [],
    selectedJobId: null,
    lastSearchQuery: props.initialQuery ?? '',
  });
  const [mounted, setMounted] = useState(false);
  const [searchInput, setSearchInput] = useState(props.initialQuery ?? '');

  // Load from localStorage on mount
  useEffect(function () {
    let loaded = loadJobSearchStore();
    loaded = loadMockResultsIfEmpty(loaded);
    loaded = ensureValidSelection(loaded);
    setStore(loaded);
    setSearchInput(loaded.lastSearchQuery || '');
    setMounted(true);
  }, []);

  // Persist on every change (after mount)
  const persist = useCallback(function (next: JobSearchStore) {
    setStore(next);
    saveJobSearchStore(next);
  }, []);

  // Filtered results based on search
  const filteredJobs = useMemo(function () {
    if (!searchInput.trim()) return store.savedJobs;
    const q = searchInput.toLowerCase();
    return store.savedJobs.filter(function (j) {
      return (
        j.title.toLowerCase().indexOf(q) !== -1 ||
        j.agency.toLowerCase().indexOf(q) !== -1 ||
        j.location.toLowerCase().indexOf(q) !== -1 ||
        (j.grade && j.grade.toLowerCase().indexOf(q) !== -1)
      );
    });
  }, [store.savedJobs, searchInput]);

  const selectedJob = getSelectedJob(store);
  const jobIsSaved = selectedJob ? isJobSaved(store, selectedJob.id) : false;

  // --- Handlers ---

  const handleSelectJob = useCallback(function (jobId: string) {
    persist(selectJob(store, jobId));
  }, [store, persist]);

  const handleSearchChange = useCallback(function (e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
    persist(updateSearchQuery(store, e.target.value));
  }, [store, persist]);

  const handleSaveJob = useCallback(function () {
    if (!selectedJob) return;
    // Already in the list from mock data, just confirm it is persisted
    persist(store);
  }, [selectedJob, store, persist]);

  const handleRemoveJob = useCallback(function () {
    if (!selectedJob) return;
    persist(removeJob(store, selectedJob.id));
  }, [selectedJob, store, persist]);

  const handleStartGuidedApply = useCallback(function () {
    if (!selectedJob) return;
    // Create a Guided Apply session for this job
    const gaStore = loadGuidedApplyStore();
    const session = createSession(
      selectedJob.title,
      selectedJob.url || ''
    );
    const updatedGaStore = addSession(gaStore, session);
    saveGuidedApplyStore(updatedGaStore);
    // Navigate to Guided Apply
    nav.push('/guided-apply');
  }, [selectedJob, nav]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64" style={{ color: 'var(--p-text-dim)' }}>
        <p className="text-sm">Loading job search...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ color: 'var(--p-text)' }}>
      {/* Search bar */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ borderBottom: '1px solid var(--p-border)' }}
      >
        <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--p-text-dim)' }} />
        <input
          type="text"
          placeholder="Search jobs by title, agency, or location..."
          value={searchInput}
          onChange={handleSearchChange}
          className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-50"
          style={{ color: 'var(--p-text)' }}
        />
        <span className="text-xs tabular-nums" style={{ color: 'var(--p-text-dim)' }}>
          {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Main layout: list + details */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: results list */}
        <div
          className="w-72 lg:w-80 flex-shrink-0 overflow-y-auto"
          style={{ borderRight: '1px solid var(--p-border)' }}
        >
          {filteredJobs.length === 0 ? (
            <EmptySearchState />
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--p-border)' }}>
              {filteredJobs.map(function (job) {
                return (
                  <JobListItem
                    key={job.id}
                    job={job}
                    isSelected={store.selectedJobId === job.id}
                    onSelect={handleSelectJob}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Right: job details */}
        <JobDetailsPanel
          job={selectedJob}
          isSaved={jobIsSaved}
          onSave={handleSaveJob}
          onRemove={handleRemoveJob}
          onStartGuidedApply={handleStartGuidedApply}
        />
      </div>
    </div>
  );
}
