/**
 * ============================================================================
 * JOB SEARCH MOCK JOBS — Evaluation-quality mock dataset and mock search
 * ============================================================================
 *
 * PURPOSE: Stable mock jobs (8–12) for one-click evaluation and filter testing.
 * mockSearchJobs is a pure, deterministic filter/sort; no network.
 * BOUNDARY: No next/* or electron/*. Uses @pathos/core Job type.
 */

import type { Job } from '@pathos/core';

// ---------------------------------------------------------------------------
// Stable mock jobs: variety of agencies, grades, locations, remote/onsite
// ---------------------------------------------------------------------------

const MOCK_SAVED_AT = '2025-02-01T12:00:00.000Z';

/** 10 mock jobs with stable ids for evaluation and filter testing. */
export const MOCK_JOBS: Job[] = [
  {
    id: 'mock-js-1',
    title: 'IT Specialist (Cybersecurity)',
    agency: 'Department of Homeland Security',
    location: 'Washington, DC',
    grade: 'GS-12',
    url: 'https://www.usajobs.gov/job/sample1',
    summary: 'Cybersecurity roles supporting DHS mission. Remote work possible.',
    savedAt: MOCK_SAVED_AT,
  },
  {
    id: 'mock-js-2',
    title: 'Management Analyst',
    agency: 'Department of Veterans Affairs',
    location: 'Remote',
    grade: 'GS-11',
    url: 'https://www.usajobs.gov/job/sample2',
    summary: 'Organizational analysis and process improvement. Series 0343.',
    savedAt: MOCK_SAVED_AT,
  },
  {
    id: 'mock-js-3',
    title: 'Program Analyst',
    agency: 'Department of Veterans Affairs',
    location: 'Washington, DC',
    grade: 'GS-12',
    url: 'https://www.usajobs.gov/job/sample3',
    summary: 'Program evaluation and metrics. Hybrid telework.',
    savedAt: MOCK_SAVED_AT,
  },
  {
    id: 'mock-js-4',
    title: 'Budget Analyst',
    agency: 'Department of Defense',
    location: 'Arlington, VA',
    grade: 'GS-12',
    url: 'https://www.usajobs.gov/job/sample4',
    summary: 'Budget formulation and execution. On-site.',
    savedAt: MOCK_SAVED_AT,
  },
  {
    id: 'mock-js-5',
    title: 'Human Resources Specialist',
    agency: 'Department of Homeland Security',
    location: 'Washington, DC',
    grade: 'GS-13',
    url: 'https://www.usajobs.gov/job/sample5',
    summary: 'Staffing and classification. Series 0201.',
    savedAt: MOCK_SAVED_AT,
  },
  {
    id: 'mock-js-6',
    title: 'Contract Specialist',
    agency: 'General Services Administration',
    location: 'Kansas City, MO',
    grade: 'GS-11',
    url: 'https://www.usajobs.gov/job/sample6',
    summary: 'Contract administration and negotiation.',
    savedAt: MOCK_SAVED_AT,
  },
  {
    id: 'mock-js-7',
    title: 'IT Specialist (INFOSEC)',
    agency: 'Department of Defense',
    location: 'Remote',
    grade: 'GS-13',
    url: 'https://www.usajobs.gov/job/sample7',
    summary: 'Information security programs. Series 2210.',
    savedAt: MOCK_SAVED_AT,
  },
  {
    id: 'mock-js-8',
    title: 'Program Analyst',
    agency: 'Office of Personnel Management',
    location: 'Washington, DC',
    grade: 'GS-12',
    url: 'https://www.usajobs.gov/job/sample8',
    summary: 'Policy analysis and program evaluation.',
    savedAt: MOCK_SAVED_AT,
  },
  {
    id: 'mock-js-9',
    title: 'Financial Analyst',
    agency: 'Department of Veterans Affairs',
    location: 'Remote',
    grade: 'GS-12',
    url: 'https://www.usajobs.gov/job/sample9',
    summary: 'Financial analysis and reporting. Series 0560.',
    savedAt: MOCK_SAVED_AT,
  },
  {
    id: 'mock-js-10',
    title: 'Policy Analyst',
    agency: 'Department of Homeland Security',
    location: 'Washington, DC',
    grade: 'GS-14',
    url: 'https://www.usajobs.gov/job/sample10',
    summary: 'Policy development and strategic planning.',
    savedAt: MOCK_SAVED_AT,
  },
];

/**
 * Which mock job ids show "New" or "Close date updated" tag.
 * Used by JobSearchScreen when rendering the list.
 */
export const MOCK_JOB_TAGS: Record<string, 'New' | 'Close date updated'> = {
  'mock-js-1': 'New',
  'mock-js-2': 'Close date updated',
};

/**
 * Order of ids by "close date soonest first" for deterministic sort.
 * Ids not in this array are appended after, in original order.
 */
const CLOSE_DATE_ORDER: string[] = [
  'mock-js-1',
  'mock-js-2',
  'mock-js-3',
  'mock-js-4',
  'mock-js-5',
  'mock-js-6',
  'mock-js-7',
  'mock-js-8',
  'mock-js-9',
  'mock-js-10',
];

// ---------------------------------------------------------------------------
// Mock search: inputs and filter shape (aligned with store)
// ---------------------------------------------------------------------------

export interface MockSearchInput {
  keywords?: string;
  location?: string;
  filters?: {
    gradeBand?: string;
    series?: string;
    agency?: string;
    remoteType?: string;
    appointmentType?: string;
    location?: string;
  };
}

/**
 * Pure, deterministic mock search. Matches keywords (title/summary), location,
 * and filters (grade, agency, location, remoteType via location string).
 * Returns jobs sorted by closeDate order (soonest first).
 */
export function mockSearchJobs(
  input: MockSearchInput,
  jobs: Job[]
): Job[] {
  const keywords = (input.keywords !== undefined ? input.keywords : '').trim().toLowerCase();
  const location = (input.location !== undefined ? input.location : '').trim().toLowerCase();
  const filters = input.filters !== undefined ? input.filters : {};

  let list: Job[] = [];
  for (let i = 0; i < jobs.length; i++) {
    list.push(jobs[i]);
  }

  if (keywords !== '') {
    const next: Job[] = [];
    for (let i = 0; i < list.length; i++) {
      const j = list[i];
      const titleMatch = j.title && j.title.toLowerCase().indexOf(keywords) !== -1;
      const summaryMatch = j.summary && j.summary.toLowerCase().indexOf(keywords) !== -1;
      const seriesInSummary = j.summary && j.summary.toLowerCase().indexOf(keywords) !== -1;
      if (titleMatch || summaryMatch || seriesInSummary) {
        next.push(j);
      }
    }
    list = next;
  }

  if (location !== '') {
    const next: Job[] = [];
    for (let i = 0; i < list.length; i++) {
      const j = list[i];
      if (j.location && j.location.toLowerCase().indexOf(location) !== -1) {
        next.push(j);
      }
    }
    list = next;
  }

  if (filters.gradeBand !== undefined && filters.gradeBand !== '') {
    const next: Job[] = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].grade === filters.gradeBand) {
        next.push(list[i]);
      }
    }
    list = next;
  }

  if (filters.agency !== undefined && filters.agency !== '') {
    const next: Job[] = [];
    for (let i = 0; i < list.length; i++) {
      const a = list[i].agency;
      if (a && a.indexOf(filters.agency) !== -1) {
        next.push(list[i]);
      }
    }
    list = next;
  }

  if (filters.series !== undefined && filters.series !== '') {
    const next: Job[] = [];
    for (let i = 0; i < list.length; i++) {
      const s = list[i].summary;
      if (s && s.indexOf(filters.series) !== -1) {
        next.push(list[i]);
      }
    }
    list = next;
  }

  if (filters.location !== undefined && filters.location !== '') {
    const next: Job[] = [];
    for (let i = 0; i < list.length; i++) {
      const loc = list[i].location;
      if (loc && loc.indexOf(filters.location) !== -1) {
        next.push(list[i]);
      }
    }
    list = next;
  }

  if (filters.remoteType !== undefined && filters.remoteType !== '') {
    const next: Job[] = [];
    const rt = filters.remoteType.toLowerCase();
    for (let i = 0; i < list.length; i++) {
      const job = list[i];
      if (job === undefined) continue;
      const loc = job.location ? job.location.toLowerCase() : '';
      const sum = job.summary ? job.summary.toLowerCase() : '';
      const match = loc.indexOf(rt) !== -1 || sum.indexOf(rt) !== -1;
      if (match) {
        next.push(job);
      }
    }
    list = next;
  }

  if (filters.appointmentType !== undefined && filters.appointmentType !== '') {
    const next: Job[] = [];
    for (let i = 0; i < list.length; i++) {
      const s = list[i].summary;
      if (s && s.indexOf(filters.appointmentType) !== -1) {
        next.push(list[i]);
      }
    }
    list = next;
  }

  // Sort by close-date order (soonest first). Ids not in CLOSE_DATE_ORDER go at end.
  const orderIndex: Record<string, number> = {};
  for (let i = 0; i < CLOSE_DATE_ORDER.length; i++) {
    orderIndex[CLOSE_DATE_ORDER[i]] = i;
  }
  list.sort(function (a, b) {
    const ai = orderIndex[a.id] !== undefined ? orderIndex[a.id] : CLOSE_DATE_ORDER.length;
    const bi = orderIndex[b.id] !== undefined ? orderIndex[b.id] : CLOSE_DATE_ORDER.length;
    if (ai !== bi) return ai - bi;
    return 0;
  });

  return list;
}
