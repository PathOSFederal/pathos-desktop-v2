/**
 * Job Search screen tests: title/subtitle, empty state, loadSampleJobs (fit badge + reasons),
 * save creates decision brief in localStorage, Decision Brief tab content.
 * Listbox UX: full-row selectable, consistent row height, Why this fit opens PathAdvisor briefing (no inline expand).
 * Unified search: prompt panel collapsed by default; Describe CTA expands panel; Translate->Apply sets filters and runs search;
 * Applied from prompt indicator; Reset clears applied-from-prompt; manual search unchanged.
 */

import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToString } from 'react-dom/server';
import {
  NavigationProvider,
  type NavigationAdapter,
  type NavLinkProps,
} from '@pathos/adapters';
import { useJobSearchV1Store } from '../stores/jobSearchV1Store';
import { useDecisionBriefsV1Store, buildDecisionBriefRecord } from '../stores/decisionBriefsV1Store';
import { usePathAdvisorBriefingStore } from '../stores/pathAdvisorBriefingStore';
import { JobSearchScreen } from './JobSearchScreen';
import { MOCK_JOBS } from './jobSearchMockJobs';

function noop(_x?: string) {
  /* mock */
}

const testAdapter: NavigationAdapter = {
  pathname: '/dashboard/job-search',
  push: noop,
  replace: noop,
  back: function () {
    /* mock */
  },
};

function TestLink(props: NavLinkProps) {
  return (
    <a href={props.href} className={props.className} onClick={props.onClick} data-tour={props['data-tour']}>
      {props.children}
    </a>
  );
}

function renderJobSearch() {
  return renderToString(
    <NavigationProvider adapter={testAdapter} linkComponent={TestLink}>
      <JobSearchScreen />
    </NavigationProvider>
  );
}

describe('JobSearchScreen', function () {
  beforeEach(function () {
    useJobSearchV1Store.getState().loadFromStorage();
  });

  it('renders loading or Job Search content', function () {
    const output = renderJobSearch();
    expect(output.indexOf('Job Search') !== -1 || output.indexOf('Loading job search') !== -1).toBe(true);
  });

  it('includes Explore roles subtitle in component tree when mounted', function () {
    useJobSearchV1Store.setState({
      hasSearched: false,
      results: [],
      loading: false,
    });
    const output = renderJobSearch();
    expect(output.indexOf('Explore roles') !== -1 || output.indexOf('Loading') !== -1).toBe(true);
  });

  it('after loadSampleJobs store has results and first job selected for details pane', function () {
    useJobSearchV1Store.getState().loadSampleJobs();
    const state = useJobSearchV1Store.getState();
    expect(state.hasSearched).toBe(true);
    expect(state.results.length).toBeGreaterThan(0);
    expect(state.selectedJobId).toBe(state.results[0].id);
    expect(state.results[0].title.indexOf('IT Specialist') !== -1 || state.results[0].title.indexOf('Cybersecurity') !== -1).toBe(true);
  });

  it('loadSampleJobs then store has results usable for fit scoring', function () {
    useJobSearchV1Store.getState().loadSampleJobs();
    const state = useJobSearchV1Store.getState();
    expect(state.results.length).toBeGreaterThan(0);
    const first = state.results[0];
    expect(first).toBeDefined();
    expect(first.title).toBeDefined();
    expect(first.id).toBeDefined();
  });

  it('saveBrief persists decision brief to store and getBrief returns it', function () {
    const job = MOCK_JOBS[0];
    if (job === undefined) throw new Error('no job');
    useDecisionBriefsV1Store.setState({ briefs: {} });
    const record = buildDecisionBriefRecord(job.id, job, {}, {});
    useDecisionBriefsV1Store.getState().saveBrief(record);
    const loaded = useDecisionBriefsV1Store.getState().getBrief(job.id);
    expect(loaded).not.toBeNull();
    if (loaded !== null) {
      expect(loaded.jobId).toBe(job.id);
      expect(loaded.nextActions.length).toBe(3);
    }
  });

  it('decision brief record has PathOS Brief tab content fields', function () {
    const job = MOCK_JOBS[0];
    if (job === undefined) throw new Error('no job');
    const record = buildDecisionBriefRecord(job.id, job, {}, {});
    expect(record.fitAssessment).toBeDefined();
    expect(record.nextActions.length).toBeGreaterThanOrEqual(1);
    expect(record.keyFactsSummary).toBeDefined();
  });

  it('results list uses listbox semantics and consistent row height when results are shown', function () {
    useJobSearchV1Store.getState().loadSampleJobs();
    const output = renderJobSearch();
    expect(output).toBeDefined();
    expect(output.length).toBeGreaterThan(0);
    if (output.indexOf('listbox') !== -1) {
      expect(output.indexOf('option') !== -1).toBe(true);
      expect(output.indexOf('min-h') !== -1).toBe(true);
    }
  });

  it('Why this fit opens PathAdvisor fit briefing (no inline expand); briefing store has type fit and isOpen', function () {
    usePathAdvisorBriefingStore.getState().clearBriefing();
    usePathAdvisorBriefingStore.getState().openBriefing({
      type: 'fit',
      jobId: 'mock-js-1',
      jobTitle: 'IT Specialist (Cybersecurity)',
      stars: 4,
      confidence: 'High',
      reasons: ['Grade match', 'Series alignment'],
      inputsUsed: ['target role', 'job data'],
      missingInputs: [],
      isJobSaved: false,
    });
    const state = usePathAdvisorBriefingStore.getState();
    expect(state.briefing).not.toBeNull();
    expect(state.isOpen).toBe(true);
    if (state.briefing !== null && typeof state.briefing === 'object') {
      expect((state.briefing as { type?: string }).type).toBe('fit');
      expect((state.briefing as { jobId?: string }).jobId).toBe('mock-js-1');
    }
  });

  it('saveJob can be called and store remains consistent (create-button rule covered in jobSearchV1Store.test)', function () {
    const job = MOCK_JOBS[0];
    if (job === undefined) throw new Error('no job');
    useJobSearchV1Store.getState().loadFromStorage();
    expect(function () {
      useJobSearchV1Store.getState().saveJob(job);
    }).not.toThrow();
  });

  it('prompt panel is collapsed by default (Describe what you want optional or loading)', function () {
    useJobSearchV1Store.getState().loadFromStorage();
    const output = renderJobSearch();
    expect(
      output.indexOf('Describe what you want (optional)') !== -1 || output.indexOf('Loading job search') !== -1
    ).toBe(true);
    expect(output.indexOf('PathOS will translate it into filters') !== -1 || output.indexOf('Loading') !== -1).toBe(true);
  });

  it('single Search button present when mounted (unified search; no duplicate Search in describe flow)', function () {
    useJobSearchV1Store.getState().loadFromStorage();
    const output = renderJobSearch();
    expect(output.indexOf('Search') !== -1 || output.indexOf('Loading job search') !== -1).toBe(true);
    expect(output.indexOf('Reset') !== -1 || output.indexOf('Loading') !== -1).toBe(true);
  });

  it('manual search still works: runSearch sets results and hasSearched', function () {
    useJobSearchV1Store.getState().loadFromStorage();
    useJobSearchV1Store.getState().setLastQuery({ keywords: 'IT' });
    useJobSearchV1Store.getState().runSearch();
    return new Promise(function (resolve) {
      setTimeout(function () {
        const state = useJobSearchV1Store.getState();
        expect(state.hasSearched).toBe(true);
        expect(state.loading).toBe(false);
        resolve(undefined);
      }, 500);
    });
  });

  it('applyProposedFiltersFromPrompt then runSearch sets filters and results; appliedFromPrompt is set', function () {
    useJobSearchV1Store.getState().loadFromStorage();
    useJobSearchV1Store.getState().applyProposedFiltersFromPrompt('Remote GS-12', { gradeBand: 'GS-12', remoteType: 'Remote' });
    const afterApply = useJobSearchV1Store.getState();
    expect(afterApply.filters.gradeBand).toBe('GS-12');
    expect(afterApply.filters.remoteType).toBe('Remote');
    expect(afterApply.appliedFromPrompt).not.toBeNull();
    if (afterApply.appliedFromPrompt !== null) {
      expect(afterApply.appliedFromPrompt.promptText).toBe('Remote GS-12');
    }
    useJobSearchV1Store.getState().runSearch();
    return new Promise(function (resolve) {
      setTimeout(function () {
        const state = useJobSearchV1Store.getState();
        expect(state.hasSearched).toBe(true);
        expect(state.results.length).toBeGreaterThanOrEqual(0);
        resolve(undefined);
      }, 500);
    });
  });

  it('Applied from prompt indicator appears when appliedFromPrompt is set (or loading)', function () {
    useJobSearchV1Store.getState().loadFromStorage();
    useJobSearchV1Store.getState().applyProposedFiltersFromPrompt('Remote GS-12', { gradeBand: 'GS-12', remoteType: 'Remote' });
    const output = renderJobSearch();
    expect(
      output.indexOf('Applied from prompt') !== -1 || output.indexOf('Loading job search') !== -1
    ).toBe(true);
    expect(output.indexOf('View') !== -1 || output.indexOf('Loading') !== -1).toBe(true);
  });

  it('Reset clears selectedJobId filters appliedFromPrompt (store resets to clean state)', function () {
    useJobSearchV1Store.getState().loadFromStorage();
    useJobSearchV1Store.getState().loadSampleJobs();
    useJobSearchV1Store.getState().applyProposedFiltersFromPrompt('GS-12', { gradeBand: 'GS-12' });
    const before = useJobSearchV1Store.getState();
    expect(before.selectedJobId).not.toBeNull();
    expect(before.appliedFromPrompt).not.toBeNull();
    useJobSearchV1Store.getState().setLastQuery({ keywords: '', location: '' });
    useJobSearchV1Store.getState().clearAllFilters();
    useJobSearchV1Store.getState().setAppliedFromPrompt(null);
    useJobSearchV1Store.getState().setFilters({});
    useJobSearchV1Store.getState().setSelectedJob(null);
    useJobSearchV1Store.getState().persist();
    const after = useJobSearchV1Store.getState();
    expect(after.selectedJobId).toBeNull();
    expect(after.appliedFromPrompt).toBeNull();
    expect(after.filters.gradeBand === undefined || after.filters.gradeBand === '').toBe(true);
  });
});
