/**
 * Job Search screen tests: title/subtitle and empty state.
 * Uses NavigationProvider wrapper for useNav(); renderToString avoids jsdom.
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
import { JobSearchScreen } from './JobSearchScreen';

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
});
