/**
 * getChecklistForJob: returns checklist for mock job ids (mock-js-* map to content).
 */

import { describe, it, expect } from 'vitest';
import { getChecklistForJob } from './jobSearchMockChecklists';

describe('getChecklistForJob', function () {
  it('returns checklist for mock-js-1 so details pane can render checklists', function () {
    const checklist = getChecklistForJob('mock-js-1');
    expect(checklist !== null).toBe(true);
    if (checklist !== null) {
      expect(checklist.specializedExperience.length).toBeGreaterThan(0);
      expect(checklist.skillsKeywords.length).toBeGreaterThan(0);
      expect(checklist.documentsNeeded.length).toBeGreaterThan(0);
    }
  });

  it('returns null for unknown job id', function () {
    expect(getChecklistForJob('unknown-id')).toBe(null);
  });
});
