/**
 * mockSearchJobs: deterministic filter/sort for evaluation and filter testing.
 */

import { describe, it, expect } from 'vitest';
import { MOCK_JOBS, mockSearchJobs } from './jobSearchMockJobs';

describe('mockSearchJobs', function () {
  it('returns all jobs when input is empty', function () {
    const result = mockSearchJobs({}, MOCK_JOBS);
    expect(result.length).toBe(MOCK_JOBS.length);
  });

  it('filters by agency correctly', function () {
    const result = mockSearchJobs(
      { filters: { agency: 'Department of Veterans Affairs' } },
      MOCK_JOBS
    );
    expect(result.length).toBeGreaterThan(0);
    for (let i = 0; i < result.length; i++) {
      expect(result[i].agency.indexOf('Department of Veterans Affairs')).not.toBe(-1);
    }
  });

  it('filters by gradeBand correctly', function () {
    const result = mockSearchJobs(
      { filters: { gradeBand: 'GS-12' } },
      MOCK_JOBS
    );
    expect(result.length).toBeGreaterThan(0);
    for (let i = 0; i < result.length; i++) {
      expect(result[i].grade).toBe('GS-12');
    }
  });

  it('filters by keywords (title substring)', function () {
    const result = mockSearchJobs(
      { keywords: 'Analyst' },
      MOCK_JOBS
    );
    expect(result.length).toBeGreaterThan(0);
    for (let i = 0; i < result.length; i++) {
      const r = result[i];
      if (r === undefined) continue;
      const match =
        (r.title && r.title.toLowerCase().indexOf('analyst') !== -1) ||
        (r.summary && r.summary.toLowerCase().indexOf('analyst') !== -1);
      expect(match).toBe(true);
    }
  });

  it('filters by location substring', function () {
    const result = mockSearchJobs(
      { location: 'Remote' },
      MOCK_JOBS
    );
    expect(result.length).toBeGreaterThan(0);
    for (let i = 0; i < result.length; i++) {
      expect(result[i].location && result[i].location.toLowerCase().indexOf('remote') !== -1).toBe(true);
    }
  });

  it('sorts results in deterministic order', function () {
    const result = mockSearchJobs({}, MOCK_JOBS);
    expect(result[0].id).toBe('mock-js-1');
    expect(result[1].id).toBe('mock-js-2');
  });
});
