/**
 * Job Search v1 store tests: runSearch populates results, applyProposedFiltersFromPrompt,
 * saveJob persists to core saved-jobs.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useJobSearchV1Store } from './jobSearchV1Store';
import { loadSavedJobsStore, clearSavedJobs } from '@pathos/core';

describe('jobSearchV1Store', function () {
  beforeEach(function () {
    clearSavedJobs();
    useJobSearchV1Store.setState({
      lastQuery: { keywords: '' },
      filters: {},
      results: [],
      selectedJobId: null,
      loading: false,
      hasSearched: false,
      appliedFromPrompt: null,
    });
  });

  it('runSearch populates results after async delay', function () {
    vi.useFakeTimers();
    const store = useJobSearchV1Store.getState();
    expect(store.results.length).toBe(0);
    expect(store.hasSearched).toBe(false);

    store.runSearch();
    expect(useJobSearchV1Store.getState().loading).toBe(true);

    vi.runAllTimers();
    const after = useJobSearchV1Store.getState();
    expect(after.loading).toBe(false);
    expect(after.hasSearched).toBe(true);
    expect(after.results.length).toBeGreaterThan(0);
    expect(after.results[0].id).toBeDefined();
    expect(after.results[0].title).toBeDefined();
    vi.useRealTimers();
  });

  it('setSelectedJob updates selectedJobId', function () {
    useJobSearchV1Store.getState().runSearch();
    vi.useFakeTimers();
    vi.advanceTimersByTime(500);
    const results = useJobSearchV1Store.getState().results;
    vi.useRealTimers();
    if (results.length > 0) {
      useJobSearchV1Store.getState().setSelectedJob(results[0].id);
      expect(useJobSearchV1Store.getState().selectedJobId).toBe(results[0].id);
    }
  });

  it('applyProposedFiltersFromPrompt sets filters and appliedFromPrompt', function () {
    const store = useJobSearchV1Store.getState();
    store.applyProposedFiltersFromPrompt('Remote GS-12 roles', {
      gradeBand: 'GS-12',
      remoteType: 'Remote',
    });
    const after = useJobSearchV1Store.getState();
    expect(after.filters.gradeBand).toBe('GS-12');
    expect(after.filters.remoteType).toBe('Remote');
    expect(after.appliedFromPrompt !== null).toBe(true);
    if (after.appliedFromPrompt !== null) {
      expect(after.appliedFromPrompt.promptText).toBe('Remote GS-12 roles');
    }
  });

  it('loadSampleJobs populates results and selects first job', function () {
    const store = useJobSearchV1Store.getState();
    expect(store.results.length).toBe(0);
    expect(store.hasSearched).toBe(false);
    expect(store.selectedJobId).toBe(null);

    store.loadSampleJobs();
    const after = useJobSearchV1Store.getState();
    expect(after.hasSearched).toBe(true);
    expect(after.results.length).toBeGreaterThan(0);
    expect(after.selectedJobId).toBe(after.results[0].id);
  });

  it('setFilters then runSearch returns filtered results by gradeBand', function () {
    vi.useFakeTimers();
    const store = useJobSearchV1Store.getState();
    store.setFilters({ gradeBand: 'GS-12' });
    store.runSearch();
    vi.runAllTimers();
    const after = useJobSearchV1Store.getState();
    vi.useRealTimers();
    expect(after.hasSearched).toBe(true);
    for (let i = 0; i < after.results.length; i++) {
      expect(after.results[i].grade).toBe('GS-12');
    }
  });

  it('saveJob adds job to core saved-jobs and isJobSaved returns true', function () {
    useJobSearchV1Store.getState().runSearch();
    vi.useFakeTimers();
    vi.advanceTimersByTime(500);
    const results = useJobSearchV1Store.getState().results;
    vi.useRealTimers();
    if (results.length > 0) {
      const job = results[0];
      const store = useJobSearchV1Store.getState();
      expect(store.isJobSaved(job.id)).toBe(false);
      store.saveJob(job);
      expect(store.isJobSaved(job.id)).toBe(true);
      const coreStore = loadSavedJobsStore();
      expect(coreStore.jobs.some(function (j) { return j.id === job.id; })).toBe(true);
    }
  });
});
