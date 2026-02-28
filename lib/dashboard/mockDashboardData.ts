/**
 * Mock dashboard data for Command Center v1 mockup parity.
 * Drives dashboard UI from a single source; no store wiring in this pass.
 * Shape must match DashboardData from @pathos/ui.
 */

export interface BriefingTile {
  label: string;
  value: string;
  subtext: string;
  subtextPositive?: boolean;
}

export interface FocusHero {
  title: string;
  reason: string;
  ctaLabel: string;
  stepBadge: string;
  explainKnow: string;
  explainNotKnow: string;
  explainWhy: string;
  estimatedTime?: string;
  whyItMatters?: string;
  whatYoullDo?: string;
}

export interface FocusSmall {
  title: string;
  description: string;
  ctaLabel: string;
}

export interface SavedJobItem {
  title: string;
  orgGrade: string;
  status: string;
  timeAgo: string;
}

export interface ApplicationItem {
  title: string;
  submittedDate: string;
  status: string;
  statusVariant?: 'default' | 'info' | 'warning';
}

export interface ResumeCheckItem {
  label: string;
  checked: boolean;
}

export interface ResumeTrack {
  progressPercent: number;
  checklist: ResumeCheckItem[];
  openCtaLabel: string;
}

export interface SignalUpdateItem {
  icon: 'bell' | 'document' | 'trend' | 'clock' | 'warning';
  text: string;
  timeAgo: string;
}

export interface ReadinessDeltaItem {
  label: string;
  delta: string;
  deltaPositive?: boolean;
  deltaNegative?: boolean;
  explanation: string;
}

export interface TimelineEstimateItem {
  label: string;
  range: string;
}

export interface MockDashboardData {
  briefing: BriefingTile[];
  focusHero: FocusHero | null;
  focusSmall: FocusSmall[];
  savedJobs: SavedJobItem[];
  applications: ApplicationItem[];
  resume: ResumeTrack;
  updatesSinceVisit: SignalUpdateItem[];
  readinessDeltas: ReadinessDeltaItem[];
  timelineEstimates: TimelineEstimateItem[];
  timelineDisclaimer: string;
  timelineMethodology: string;
  lastUpdated?: string;
}

function getMockDashboardData(): MockDashboardData {
  return {
    briefing: [
      { label: 'Saved Jobs', value: '3', subtext: '+1 this week', subtextPositive: true },
      { label: 'Tracked Apps', value: '2', subtext: '1 updated' },
      { label: 'Readiness', value: '68/100', subtext: '+4', subtextPositive: true },
      { label: 'Next Milestone', value: 'Referral review', subtext: 'typical 2-6 weeks' },
    ],
    focusHero: {
      title: 'Your next best move',
      reason:
        'Your resume is missing specialized experience phrasing for GS-0343. Fixing this is the fastest path to referral.',
      ctaLabel: 'Fix resume gap',
      stepBadge: 'Step 1 of 3',
      estimatedTime: '15–20 min',
      whyItMatters: 'Specialized experience is the top referral filter for GS-0343.',
      whatYoullDo: 'Add 2–3 bullets with program evaluation and data analysis phrasing.',
      explainKnow:
        'Your uploaded resume targets GS-0301 (Miscellaneous Admin). The job you saved (Program Analyst GS-0343-12) requires specialized experience in program evaluation and data analysis.',
      explainNotKnow:
        'Whether you have actual experience in program evaluation that simply is not documented, or if you need to reframe existing experience.',
      explainWhy:
        'Specialized experience language is the #1 reason qualified applicants fail to get referred. Adding 2-3 bullet points with GS-0343 keywords has the highest ROI right now.',
    },
    focusSmall: [
      {
        title: '📄 Decode your latest status',
        description: 'Your USAJOBS application was updated. Understand what "Received" actually means.',
        ctaLabel: 'Decode',
      },
      {
        title: '☰ Tighten questionnaire alignment',
        description: 'Your self-assessment responses may overstate GS-12 competencies.',
        ctaLabel: 'Review',
      },
    ],
    savedJobs: [
      { title: 'Program Analyst', orgGrade: 'HHS • GS-0343-12', status: 'Open', timeAgo: '2d ago' },
      {
        title: 'Management Analyst',
        orgGrade: 'HHS • GS-0343-12',
        status: 'Closing soon',
        timeAgo: '5d ago',
      },
      { title: 'Budget Analyst', orgGrade: 'OMB • GS-0560-12', status: 'Open', timeAgo: '1w ago' },
    ],
    applications: [
      {
        title: 'Program Analyst - HHS',
        submittedDate: 'Submitted Feb 15, 2026',
        status: 'Received',
        statusVariant: 'info',
      },
      {
        title: 'IT Specialist - VA',
        submittedDate: 'Submitted Feb 10, 2026',
        status: 'Reviewing',
        statusVariant: 'warning',
      },
    ],
    resume: {
      progressPercent: 50,
      checklist: [
        { label: 'Specialized experience for GS-0343', checked: false },
        { label: 'Quantified accomplishments', checked: false },
        { label: 'Keywords from target announcement', checked: true },
        { label: 'Federal resume format', checked: true },
      ],
      openCtaLabel: 'Open Resume Builder',
    },
    updatesSinceVisit: [
      { icon: 'bell', text: 'Application status changed: Program Analyst - HHS', timeAgo: '2h ago' },
      { icon: 'document', text: 'Resume analysis complete - 3 gaps identified', timeAgo: '5h ago' },
      {
        icon: 'trend',
        text: 'New job match: Management Analyst at DOL (92% fit)',
        timeAgo: '1d ago',
      },
      { icon: 'clock', text: 'Saved job closing in 3 days: Budget Analyst - OMB', timeAgo: '1d ago' },
      {
        icon: 'warning',
        text: 'Questionnaire alignment dropped below threshold',
        timeAgo: '2d ago',
      },
    ],
    readinessDeltas: [
      {
        label: 'Specialized experience match',
        delta: '-8',
        deltaNegative: true,
        explanation: 'New job announcement uses different keywords',
      },
      {
        label: 'Resume completeness',
        delta: '+4',
        deltaPositive: true,
        explanation: 'Added quantified accomplishments',
      },
      {
        label: 'Application timeline',
        delta: '-',
        explanation: 'On track for typical processing',
      },
    ],
    timelineEstimates: [
      { label: 'Referral decision', range: '2-6 weeks' },
      { label: 'Interview (if referred)', range: '3-8 weeks' },
      { label: 'Selection (if interviewed)', range: '1-4 weeks' },
    ],
    timelineDisclaimer: 'Estimates are based on historical data and may vary significantly.',
    timelineMethodology:
      'These estimates are derived from aggregated USAJOBS data and user-reported timelines. They reflect median values, not guarantees. Factors like agency workload, clearance requirements, and hiring authority type can significantly extend or shorten these windows.',
    lastUpdated: '2m ago',
  };
}

export const mockDashboardData: MockDashboardData = getMockDashboardData();
