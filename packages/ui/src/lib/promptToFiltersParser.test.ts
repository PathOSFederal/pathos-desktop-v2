/**
 * Tests for deterministic prompt-to-filters parser.
 * Locks: GS levels, agencies, remote type, location, keywords extraction.
 */

import { describe, it, expect } from 'vitest';
import { parsePromptToFilters } from './promptToFiltersParser';

describe('parsePromptToFilters', function () {
  it('parses GS level (GS-12) and adds to filters and evidence', function () {
    const result = parsePromptToFilters('Remote GS-12 cybersecurity roles');
    expect(result.filters.gradeBand).toBe('GS-12');
    expect(result.evidence.length).toBeGreaterThan(0);
    const gradeEv = result.evidence.find(function (e) {
      return e.type === 'grade';
    });
    expect(gradeEv !== undefined).toBe(true);
    if (gradeEv !== undefined) {
      expect(gradeEv.value).toBe('GS-12');
    }
  });

  it('parses multiple GS formats (GS-12, GS12)', function () {
    const result = parsePromptToFilters('GS-12 or GS13 roles');
    expect(result.filters.gradeBand !== undefined).toBe(true);
    expect(result.evidence.filter(function (e) {
      return e.type === 'grade';
    }).length).toBeGreaterThanOrEqual(1);
  });

  it('parses agency abbreviations (DHS, VA) into filter', function () {
    const result = parsePromptToFilters('roles at DHS or VA near DC');
    expect(result.filters.agency !== undefined).toBe(true);
    expect(
      result.filters.agency !== undefined &&
        (result.filters.agency.indexOf('Homeland') !== -1 || result.filters.agency.indexOf('Veterans') !== -1)
    ).toBe(true);
    const agencyEv = result.evidence.filter(function (e) {
      return e.type === 'agency';
    });
    expect(agencyEv.length).toBeGreaterThanOrEqual(1);
  });

  it('parses remote/telework/hybrid into remoteType', function () {
    const result = parsePromptToFilters('Remote GS-12 cybersecurity roles');
    expect(result.filters.remoteType).toBe('Remote');
    const remoteEv = result.evidence.find(function (e) {
      return e.type === 'remoteType';
    });
    expect(remoteEv !== undefined).toBe(true);
  });

  it('parses location phrase after "near"', function () {
    const result = parsePromptToFilters('roles near DC open for 2 weeks');
    expect(result.filters.location !== undefined).toBe(true);
    expect(result.filters.location !== undefined && result.filters.location.indexOf('DC') !== -1).toBe(true);
  });

  it('puts remainder into keywords', function () {
    const result = parsePromptToFilters('Remote GS-12 cybersecurity roles at DHS');
    expect(result.keywords !== undefined).toBe(true);
    expect(result.keywords.indexOf('cybersecurity') !== -1).toBe(true);
  });

  it('returns empty filters and evidence for empty string', function () {
    const result = parsePromptToFilters('');
    expect(result.filters).toEqual({});
    expect(result.evidence.length).toBe(0);
    expect(result.keywords).toBe('');
  });
});
