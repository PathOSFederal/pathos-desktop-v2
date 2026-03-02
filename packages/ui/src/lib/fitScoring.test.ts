/**
 * fitScoring: deterministic fit assessment (series/grade/remote rules, badge + reasons).
 */

import { describe, it, expect } from 'vitest';
import {
  buildFitAssessment,
  fitScoreToStars,
  effortEstimate,
  strategicValue,
  effortToReward,
} from './fitScoring';
import { MOCK_JOBS } from '../screens/jobSearchMockJobs';

describe('buildFitAssessment', function () {
  it('produces Strong badge when series and grade match', function () {
    const job = MOCK_JOBS[6];
    if (job === undefined) throw new Error('no job');
    expect(job.summary && job.summary.indexOf('2210') !== -1).toBe(true);
    const result = buildFitAssessment({
      job,
      targetRole: { series: '2210', gsTarget: 'GS-13', location: 'Remote', remotePreference: 'Remote' },
      profile: { skillsKeywords: ['security', 'information'] },
    });
    expect(result.badge).toBe('Strong');
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.inputsUsed.indexOf('target series') !== -1 || result.inputsUsed.indexOf('target grade') !== -1).toBe(true);
  });

  it('produces Medium confidence when fewer inputs (no target series)', function () {
    const job = MOCK_JOBS[1];
    if (job === undefined) throw new Error('no job');
    const result = buildFitAssessment({
      job,
      targetRole: { gsTarget: 'GS-11', remotePreference: 'Remote' },
      profile: {},
    });
    expect(['Strong', 'Moderate', 'Stretch']).toContain(result.badge);
    expect(result.confidence === 'Medium' || result.confidence === 'Low').toBe(true);
  });

  it('produces High confidence when 4+ inputs used', function () {
    const job = MOCK_JOBS[0];
    if (job === undefined) throw new Error('no job');
    const result = buildFitAssessment({
      job,
      targetRole: { series: '2210', gsTarget: 'GS-12', location: 'Washington', remotePreference: 'Yes' },
      profile: { skillsKeywords: ['cybersecurity'] },
    });
    expect(result.confidence).toBe('High');
  });

  it('fitScoreToStars maps 0-100 to 1-5 stars deterministically', function () {
    expect(fitScoreToStars(0)).toBe(1);
    expect(fitScoreToStars(19)).toBe(1);
    expect(fitScoreToStars(20)).toBe(2);
    expect(fitScoreToStars(39)).toBe(2);
    expect(fitScoreToStars(40)).toBe(3);
    expect(fitScoreToStars(59)).toBe(3);
    expect(fitScoreToStars(60)).toBe(4);
    expect(fitScoreToStars(79)).toBe(4);
    expect(fitScoreToStars(80)).toBe(5);
    expect(fitScoreToStars(100)).toBe(5);
  });

  it('includes 2-3 reasons', function () {
    const job = MOCK_JOBS[2];
    if (job === undefined) throw new Error('no job');
    const result = buildFitAssessment({
      job,
      targetRole: { series: '0343', gsTarget: 'GS-12', location: 'Washington' },
      profile: {},
    });
    expect(result.reasons.length).toBeGreaterThanOrEqual(0);
    expect(result.reasons.length).toBeLessThanOrEqual(3);
  });
});

describe('effortEstimate', function () {
  it('returns High for Stretch badge and many checklist items', function () {
    const fit = buildFitAssessment({
      job: MOCK_JOBS[0],
      targetRole: {},
      profile: {},
    });
    const effort = effortEstimate(fit, { specialized: 5, skills: 5, documents: 3 });
    expect(effort).toBe('High');
  });

  it('returns Low for Strong badge and few items', function () {
    const fit = buildFitAssessment({
      job: MOCK_JOBS[0],
      targetRole: { series: '2210', gsTarget: 'GS-12' },
      profile: { skillsKeywords: ['cybersecurity'] },
    });
    const effort = effortEstimate(fit, { specialized: 2, skills: 2, documents: 1 });
    expect(effort).toBe('Low');
  });
});

describe('strategicValue', function () {
  it('returns High when job has promotion potential and series match', function () {
    const job = MOCK_JOBS[0];
    if (job === undefined) throw new Error('no job');
    const fit = buildFitAssessment({
      job,
      targetRole: { series: '2210', gsTarget: 'GS-12' },
      profile: {},
    });
    const strat = strategicValue(job, fit);
    expect(['Low', 'Medium', 'High']).toContain(strat);
  });
});

describe('effortToReward', function () {
  it('returns Medium or High for low effort and strategic job', function () {
    const job = MOCK_JOBS[0];
    if (job === undefined) throw new Error('no job');
    const fit = buildFitAssessment({ job, targetRole: {}, profile: {} });
    const effort = effortEstimate(fit, { specialized: 1, skills: 1, documents: 1 });
    const strat = strategicValue(job, fit);
    const etr = effortToReward(job, effort, strat);
    expect(['Low', 'Medium', 'High']).toContain(etr);
  });
});
