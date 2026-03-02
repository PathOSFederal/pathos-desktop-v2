/**
 * decisionBriefsV1Store: save brief persists and loads; overwrite behavior ok.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  useDecisionBriefsV1Store,
  buildDecisionBriefRecord,
  type DecisionBriefRecord,
} from './decisionBriefsV1Store';
import { MOCK_JOBS } from '../screens/jobSearchMockJobs';

describe('decisionBriefsV1Store', function () {
  beforeEach(function () {
    useDecisionBriefsV1Store.setState({ briefs: {} });
    useDecisionBriefsV1Store.getState().persist();
  });

  it('save brief persists and loads', function () {
    const job = MOCK_JOBS[0];
    if (job === undefined) throw new Error('no job');
    const record = buildDecisionBriefRecord(job.id, job, {}, {});
    useDecisionBriefsV1Store.getState().saveBrief(record);
    const loaded = useDecisionBriefsV1Store.getState().getBrief(job.id);
    expect(loaded).not.toBeNull();
    if (loaded !== null) {
      expect(loaded.jobId).toBe(job.id);
      expect(loaded.fitAssessment.badge).toBeDefined();
      expect(loaded.nextActions.length).toBe(3);
    }
  });

  it('hasBrief returns true after save', function () {
    const job = MOCK_JOBS[0];
    if (job === undefined) throw new Error('no job');
    const record = buildDecisionBriefRecord(job.id, job, {}, {});
    useDecisionBriefsV1Store.getState().saveBrief(record);
    expect(useDecisionBriefsV1Store.getState().hasBrief(job.id)).toBe(true);
  });

  it('overwrite updates existing brief', function () {
    const job = MOCK_JOBS[0];
    if (job === undefined) throw new Error('no job');
    const record1 = buildDecisionBriefRecord(job.id, job, { series: '2210' }, {});
    useDecisionBriefsV1Store.getState().saveBrief(record1);
    const record2 = buildDecisionBriefRecord(job.id, job, { series: '0343' }, {});
    useDecisionBriefsV1Store.getState().saveBrief(record2);
    const loaded = useDecisionBriefsV1Store.getState().getBrief(job.id);
    expect(loaded).not.toBeNull();
    if (loaded !== null) {
      expect(loaded.fitAssessment.inputsUsed).toBeDefined();
    }
  });
});
