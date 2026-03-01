/**
 * ============================================================================
 * JOB SEARCH V1 STORE — State and persistence for Job Search screen
 * ============================================================================
 *
 * PURPOSE: Holds lastQuery, filters, results (mock list with stable IDs),
 * selectedJobId, and "applied from prompt" audit. Persists to pathos_job_search_v1.
 * Saving a job adds to @pathos/core saved-jobs store so it appears in Saved Jobs.
 *
 * BOUNDARY: No next/* or electron/*. Uses @pathos/core for storage and Job type.
 */

import { create } from 'zustand';
import {
  storageGetJSON,
  storageSetJSON,
  JOB_SEARCH_V1_STORAGE_KEY,
  loadSavedJobsStore,
  saveSavedJobsStore,
  addSavedJobDirect,
  removeSavedJob,
  isJobInSaved,
} from '@pathos/core';
import { MOCK_JOBS, mockSearchJobs } from '../screens/jobSearchMockJobs';
import type { Job } from '@pathos/core';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface JobSearchLastQuery {
  keywords: string;
  location?: string;
}

export interface JobSearchFilters {
  gradeBand?: string;
  series?: string;
  agency?: string;
  remoteType?: string;
  appointmentType?: string;
  location?: string;
}

/** Snapshot of prompt used to apply filters (for "Applied from prompt" + View). */
export interface AppliedFromPrompt {
  promptText: string;
  timestamp: string;
}

export interface JobSearchV1State {
  lastQuery: JobSearchLastQuery;
  filters: JobSearchFilters;
  /** Mock results with stable IDs; empty until user runs search. */
  results: Job[];
  selectedJobId: string | null;
  loading: boolean;
  /** True after first run of search (drives empty vs no-results message). */
  hasSearched: boolean;
  /** Set when filters were applied from "Translate to filters" flow. */
  appliedFromPrompt: AppliedFromPrompt | null;
}

export interface JobSearchV1Actions {
  setLastQuery: (q: JobSearchLastQuery) => void;
  setFilters: (f: JobSearchFilters) => void;
  applyFilters: (f: JobSearchFilters) => void;
  clearAllFilters: () => void;
  runSearch: () => void;
  setSelectedJob: (id: string | null) => void;
  setAppliedFromPrompt: (p: AppliedFromPrompt | null) => void;
  /** Persist proposed filters from prompt flow into store and save audit. */
  applyProposedFiltersFromPrompt: (promptText: string, proposed: JobSearchFilters) => void;
  /** Load state from localStorage (call on mount). */
  loadFromStorage: () => void;
  /** Save current state to localStorage (called internally on mutations). */
  persist: () => void;
  /** Check if job is in core saved-jobs store. */
  isJobSaved: (jobId: string) => boolean;
  /** Add job to core saved-jobs store (so it appears in Saved Jobs screen). */
  saveJob: (job: Job) => void;
  /** Remove job from core saved-jobs store. */
  removeSavedJob: (jobId: string) => void;
  /** One-click evaluation: set results to MOCK_JOBS, hasSearched true, select first. */
  loadSampleJobs: () => void;
}

const defaultFilters: JobSearchFilters = {};
const defaultLastQuery: JobSearchLastQuery = { keywords: '' };

function getDefaultState(): JobSearchV1State {
  return {
    lastQuery: defaultLastQuery,
    filters: defaultFilters,
    results: [],
    selectedJobId: null,
    loading: false,
    hasSearched: false,
    appliedFromPrompt: null,
  };
}

/** Build a copy of filters with all keys cleared. */
function emptyFilters(): JobSearchFilters {
  return {};
}

/** Deep clone filters for persistence (no shared refs). */
function cloneFilters(f: JobSearchFilters): JobSearchFilters {
  const out: JobSearchFilters = {};
  if (f.gradeBand !== undefined) out.gradeBand = f.gradeBand;
  if (f.series !== undefined) out.series = f.series;
  if (f.agency !== undefined) out.agency = f.agency;
  if (f.remoteType !== undefined) out.remoteType = f.remoteType;
  if (f.appointmentType !== undefined) out.appointmentType = f.appointmentType;
  if (f.location !== undefined) out.location = f.location;
  return out;
}

function cloneLastQuery(q: JobSearchLastQuery): JobSearchLastQuery {
  const out: JobSearchLastQuery = { keywords: q.keywords };
  if (q.location !== undefined) out.location = q.location;
  return out;
}

/** Load persisted state from localStorage; invalid or missing returns default. */
function loadPersistedState(): JobSearchV1State {
  const raw = storageGetJSON<Record<string, unknown>>(JOB_SEARCH_V1_STORAGE_KEY, {});
  if (raw === null || typeof raw !== 'object') {
    return getDefaultState();
  }
  const lastQuery =
    raw.lastQuery !== null && typeof raw.lastQuery === 'object' && typeof (raw.lastQuery as Record<string, unknown>).keywords === 'string'
      ? cloneLastQuery(raw.lastQuery as JobSearchLastQuery)
      : defaultLastQuery;
  const filters =
    raw.filters !== null && typeof raw.filters === 'object'
      ? cloneFilters(raw.filters as JobSearchFilters)
      : defaultFilters;
  const results = Array.isArray(raw.results) ? (raw.results as Job[]) : [];
  const selectedJobId =
    typeof raw.selectedJobId === 'string' || raw.selectedJobId === null
      ? raw.selectedJobId
      : null;
  const hasSearched = raw.hasSearched === true;
  let appliedFromPrompt: AppliedFromPrompt | null = null;
  if (
    raw.appliedFromPrompt !== null &&
    typeof raw.appliedFromPrompt === 'object' &&
    typeof (raw.appliedFromPrompt as Record<string, unknown>).promptText === 'string' &&
    typeof (raw.appliedFromPrompt as Record<string, unknown>).timestamp === 'string'
  ) {
    appliedFromPrompt = raw.appliedFromPrompt as AppliedFromPrompt;
  }
  return {
    lastQuery,
    filters,
    results,
    selectedJobId,
    loading: false,
    hasSearched,
    appliedFromPrompt,
  };
}

/** Serialize state for persistence (exclude loading). */
function stateToPersist(s: JobSearchV1State): Record<string, unknown> {
  return {
    lastQuery: s.lastQuery,
    filters: s.filters,
    results: s.results,
    selectedJobId: s.selectedJobId,
    hasSearched: s.hasSearched,
    appliedFromPrompt: s.appliedFromPrompt,
  };
}

export const useJobSearchV1Store = create<JobSearchV1State & JobSearchV1Actions>(function (set, get) {
  return {
    ...getDefaultState(),

    setLastQuery: function (q) {
      set({ lastQuery: cloneLastQuery(q) });
      get().persist();
    },

    setFilters: function (f) {
      set({ filters: cloneFilters(f) });
      get().persist();
    },

    applyFilters: function (f) {
      set({ filters: cloneFilters(f) });
      get().persist();
    },

    clearAllFilters: function () {
      set({ filters: emptyFilters() });
      get().persist();
    },

    runSearch: function () {
      set({ loading: true });
      const state = get();
      // Deterministic mock search over MOCK_JOBS (keywords, location, filters).
      setTimeout(function () {
        const list = mockSearchJobs(
          {
            keywords: state.lastQuery.keywords,
            location: state.lastQuery.location,
            filters: state.filters,
          },
          MOCK_JOBS
        );
        const selectedId =
          state.selectedJobId && list.some(function (j) { return j.id === state.selectedJobId; })
            ? state.selectedJobId
            : list.length > 0
              ? list[0].id
              : null;
        set({
          results: list,
          selectedJobId: selectedId,
          loading: false,
          hasSearched: true,
        });
        get().persist();
      }, 400);
    },

    loadSampleJobs: function () {
      const list = MOCK_JOBS;
      const firstId = list.length > 0 ? list[0].id : null;
      set({
        results: list,
        selectedJobId: firstId,
        loading: false,
        hasSearched: true,
      });
      get().persist();
    },

    setSelectedJob: function (id) {
      set({ selectedJobId: id });
      get().persist();
    },

    setAppliedFromPrompt: function (p) {
      set({ appliedFromPrompt: p });
      get().persist();
    },

    applyProposedFiltersFromPrompt: function (promptText, proposed) {
      set({
        filters: cloneFilters(proposed),
        appliedFromPrompt: {
          promptText,
          timestamp: new Date().toISOString(),
        },
      });
      get().persist();
    },

    loadFromStorage: function () {
      const loaded = loadPersistedState();
      set(loaded);
    },

    persist: function () {
      const state = get();
      storageSetJSON(JOB_SEARCH_V1_STORAGE_KEY, stateToPersist(state));
    },

    isJobSaved: function (jobId) {
      const store = loadSavedJobsStore();
      return isJobInSaved(store, jobId);
    },

    saveJob: function (job) {
      const store = loadSavedJobsStore();
      const next = addSavedJobDirect(store, job);
      saveSavedJobsStore(next);
    },

    removeSavedJob: function (jobId) {
      const store = loadSavedJobsStore();
      const next = removeSavedJob(store, jobId);
      saveSavedJobsStore(next);
    },
  };
});
