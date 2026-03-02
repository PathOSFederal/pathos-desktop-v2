/**
 * ============================================================================
 * TOOLTIP COPY — Tests for centralized Job Search tooltip strings
 * ============================================================================
 *
 * High-signal: verifies tooltip copy module exports and returns non-empty
 * strings for representative chips and sort options (Overlay Rule v1).
 */

import { describe, it, expect } from 'vitest';
import {
  chipTooltips,
  sortTooltips,
  fitTooltips,
  getChipTooltip,
  getSortTooltip,
  getFilterGroupTooltip,
} from './tooltipCopy';

describe('tooltipCopy', function () {
  describe('chipTooltips', function () {
    it('returns non-empty string for grade chip', function () {
      expect(typeof chipTooltips.grade).toBe('string');
      expect(chipTooltips.grade.length).toBeGreaterThan(0);
      expect(chipTooltips.grade.length).toBeLessThanOrEqual(140);
    });
    it('returns non-empty string for Remote and Closes soon', function () {
      expect(chipTooltips.Remote).toBeDefined();
      expect(chipTooltips.closesSoon).toBeDefined();
      expect(chipTooltips.Remote.length).toBeLessThanOrEqual(140);
    });
  });

  describe('getChipTooltip', function () {
    it('returns closesSoon for Closes soon label when isClosesSoon true', function () {
      const out = getChipTooltip('Closes soon', true);
      expect(out).toBe(chipTooltips.closesSoon);
    });
    it('returns closeDate for generic close date label', function () {
      const out = getChipTooltip('Closes Apr 1', false);
      expect(out).toBe(chipTooltips.closeDate);
    });
  });

  describe('sortTooltips', function () {
    it('returns non-empty string for likelihood and urgency', function () {
      expect(sortTooltips.likelihood).toBeDefined();
      expect(sortTooltips.urgency).toBeDefined();
      expect(sortTooltips.likelihood.length).toBeLessThanOrEqual(140);
    });
  });

  describe('getSortTooltip', function () {
    it('returns sort tooltip for known kind', function () {
      expect(getSortTooltip('likelihood')).toBe(sortTooltips.likelihood);
      expect(getSortTooltip('urgency')).toBe(sortTooltips.urgency);
    });
    it('returns empty string for unknown kind', function () {
      expect(getSortTooltip('unknown')).toBe('');
    });
  });

  describe('fitTooltips', function () {
    it('returns non-empty strings for fitStars and confidence', function () {
      expect(fitTooltips.fitStars).toBeDefined();
      expect(fitTooltips.confidence).toBeDefined();
      expect(fitTooltips.fitStars.length).toBeLessThanOrEqual(140);
    });
  });

  describe('getFilterGroupTooltip', function () {
    it('returns tooltip for Grades and Series', function () {
      expect(getFilterGroupTooltip('Grades')).toBeDefined();
      expect(getFilterGroupTooltip('Series')).toBeDefined();
    });
    it('returns empty string for unknown label', function () {
      expect(getFilterGroupTooltip('Unknown')).toBe('');
    });
  });
});
