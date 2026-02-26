/**
 * ============================================================================
 * DASHBOARD PAGE (Day 13 - Job Seeker Dashboard First-Principles Refactor)
 * ============================================================================
 *
 * FILE PURPOSE:
 * This is the main dashboard page for PathOS. It serves as the personalized
 * intelligence hub for both Federal Employees and Job Seekers. The layout
 * and content adapt based on the user's persona.
 *
 * WHERE IT FITS IN ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                         Next.js App Router                              │
 * │  ┌─────────────────────────────────────────────────────────────────┐   │
 * │  │                    app/dashboard/page.tsx                       │   │
 * │  │                       (THIS FILE)                                │   │
 * │  └─────────────────────────────────────────────────────────────────┘   │
 * │                                │                                        │
 * │            ┌───────────────────┼───────────────────┐                   │
 * │            ▼                   ▼                   ▼                   │
 * │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
 * │  │  Profile Store  │  │ Job Search Store│  │ Resume Builder  │        │
 * │  │  (profileStore) │  │ (jobSearchStore)│  │     Store       │        │
 * │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * PERSONA-DRIVEN LAYOUT:
 * The dashboard renders different content based on user.currentEmployee:
 *
 * FEDERAL EMPLOYEE (user.currentEmployee === true):
 * - PathAdvisor Insights card (AI-powered career analysis)
 * - Standard dashboard cards grid
 *
 * JOB SEEKER (user.currentEmployee === false):
 * - Market Position card (fit, salary, mobility heuristics)
 * - Next Best Moves card (actionable recommendations)
 * - Benefits Switching card (gain/loss of switching to federal)
 * - Standard dashboard cards grid
 *
 * Day 13 CHANGES:
 * - Added conditional rendering for Job Seeker vs Employee
 * - Job Seekers now see three new cards instead of PathAdvisor
 * - Federal Employees continue to see PathAdvisor (no change)
 * - All new cards have per-card visibility toggles
 *
 * MOBILE-FIRST DESIGN:
 * - Mobile defines what exists
 * - Desktop adds depth via better spacing, not different content
 * - All cards are responsive and work on all screen sizes
 */

'use client';

import { useEffect } from 'react';
import { useProfileStore, type GradeBandKey } from '@/store/profileStore';
import { useOnboardingStore, selectIsOnboardingMode } from '@/store/onboardingStore';
import { useGuidedTourStore } from '@/store/guidedTourStore';
import { OnboardingModeOverlay } from '@/components/dashboard/OnboardingModeOverlay';

// Dashboard card components (shared or employee-focused)
import { TotalCompensationCard } from '@/components/dashboard/total-compensation';
import { RetirementReadinessCard } from '@/components/dashboard/retirement-readiness';
import { LeaveBenefitsCard } from '@/components/dashboard/leave-benefits';
import { FehbComparisonCard } from '@/components/dashboard/fehb-comparison';
import { TaxInsightsCard } from '@/components/dashboard/tax-insights';
import { PcsRelocationCard } from '@/components/dashboard/pcs-relocation';
import { PathAdvisorInsightsCard } from '@/components/dashboard/pathadvisor-insights-card';

// Job Seeker specific components (Day 35)
// Day 35: Hybrid Advisor + Mission Board Dashboard
// The Job Seeker dashboard now uses a guided session approach:
// - PRIMARY: CoachSessionPanel (PathAdvisor session)
// - SECONDARY: MissionBoardV1 + EvidenceDrawerV1
// This replaces the previous card-based layout (Market Position, Next Best Moves, etc.)
import { JobSeekerCoachDashboardV1 } from '@/components/dashboard/JobSeekerCoachDashboardV1';

// Layout shell
import { PageShell } from '@/components/layout/page-shell';

/**
 * ============================================================================
 * HELPER FUNCTION: getGradeBandDisplayText
 * ============================================================================
 *
 * PURPOSE:
 * Converts a grade band key (e.g., 'entry', 'early', 'mid') into a human-readable
 * string for display in the dashboard header. This helps job seekers understand
 * their target grade range at a glance.
 *
 * HOW IT WORKS:
 * 1. Takes the grade band key from profile.goals.gradeBand
 * 2. For preset bands (entry, early, mid, senior), returns a formatted string
 * 3. For 'custom' band, uses targetFrom and targetTo values
 * 4. For 'unsure', indicates the user is still exploring
 *
 * EXAMPLE:
 * - band = 'early' → "Aspiring GS-7–GS-9"
 * - band = 'custom', targetFrom = 'GS-11', targetTo = 'GS-13' → "Aspiring GS-11–GS-13"
 *
 * @param band - The grade band key from CareerGoals
 * @param targetFrom - Custom target grade start (for 'custom' band)
 * @param targetTo - Custom target grade end (for 'custom' band)
 * @returns Human-readable string describing the target grade range
 */
function getGradeBandDisplayText(
  band: GradeBandKey,
  targetFrom: string | null,
  targetTo: string | null
): string {
  // Use if/else instead of switch for clarity and to avoid fall-through issues
  if (band === 'entry') {
    return 'Aspiring GS-5–GS-7';
  }
  if (band === 'early') {
    return 'Aspiring GS-7–GS-9';
  }
  if (band === 'mid') {
    return 'Aspiring GS-9–GS-11';
  }
  if (band === 'senior') {
    return 'Aspiring GS-12–GS-13';
  }
  if (band === 'unsure') {
    return 'Exploring starting levels';
  }
  if (band === 'custom') {
    if (targetFrom && targetTo) {
      return 'Aspiring ' + targetFrom + '–' + targetTo;
    }
    return 'Set your target grades';
  }
  // Default fallback
  return 'Set your target grades';
}

/**
 * ============================================================================
 * MAIN COMPONENT: DashboardPage
 * ============================================================================
 *
 * PURPOSE:
 * Renders the main dashboard with persona-aware content. The layout adapts
 * based on whether the user is a Federal Employee or Job Seeker.
 *
 * HOW IT WORKS:
 * 1. Read user and profile from profileStore
 * 2. Scroll to top on mount (instant, no animation)
 * 3. Render page header with appropriate messaging
 * 4. For Job Seekers: Render three new dashboard sections
 * 5. For Employees: Render PathAdvisor Insights
 * 6. Render common dashboard cards grid
 *
 * RENDERING LOGIC (Day 13):
 * - Job Seekers see: Market Position → Next Best Moves → Benefits Switching → Cards Grid
 * - Employees see: PathAdvisor Insights → Cards Grid
 *
 * This change was made because Job Seekers need a clearer, more actionable
 * dashboard flow than the AI-powered PathAdvisor insights provide.
 */
export default function DashboardPage() {
  // ============================================================================
  // STORE SUBSCRIPTIONS
  // Read user and profile to determine persona and display appropriate content.
  // ============================================================================

  const user = useProfileStore(function (state) {
    return state.user;
  });
  const profile = useProfileStore(function (state) {
    return state.profile;
  });
  const isOnboardingComplete = useProfileStore(function (state) {
    return state.isOnboardingComplete;
  });

  // ============================================================================
  // ONBOARDING STATE (Day 36)
  // Check if onboarding mode should be active and initialize if needed.
  // ============================================================================

  const isOnboardingMode = useOnboardingStore(selectIsOnboardingMode);
  const onboardingHydrate = useOnboardingStore(function (state) {
    return state.hydrateFromStorage;
  });
  const onboardingStart = useOnboardingStore(function (state) {
    return state.startOnboarding;
  });
  const onboardingComplete = useOnboardingStore(function (state) {
    return state.completeOnboarding;
  });
  const onboardingCurrentStepId = useOnboardingStore(function (state) {
    return state.currentStepId;
  });

  // Hydrate onboarding store on mount
  useEffect(function () {
    onboardingHydrate();
  }, [onboardingHydrate]);

  // Day 36: Hydrate guided tour store on mount
  const tourHydrate = useGuidedTourStore(function (state) {
    return state.hydrateFromStorage;
  });
  useEffect(function () {
    tourHydrate();
  }, [tourHydrate]);

  // Check if onboarding should start on mount
  useEffect(
    function checkOnboardingStart() {
      // Start onboarding if profile is incomplete or onboardingComplete is false
      const shouldStartOnboarding = !isOnboardingComplete || !profile.isComplete;
      if (shouldStartOnboarding && !isOnboardingMode) {
        onboardingStart();
      }
    },
    [isOnboardingComplete, profile.isComplete, isOnboardingMode, onboardingStart]
  );

  // Auto-complete onboarding when reaching the complete step
  // Day 36: Note - completion is now handled in OnboardingPathAdvisorConversation
  // for the intro step tour trigger, so this effect is only a fallback for the
  // 'complete' step if it's reached directly
  useEffect(
    function handleOnboardingComplete() {
      if (isOnboardingMode && onboardingCurrentStepId === 'complete') {
        // Small delay to let user see the completion message before exiting onboarding mode
        const timeoutId = setTimeout(function () {
          onboardingComplete();
        }, 3000);
        return function cleanup() {
          clearTimeout(timeoutId);
        };
      }
    },
    [isOnboardingMode, onboardingCurrentStepId, onboardingComplete]
  );

  // Day 40: Lock scrolling during onboarding to prevent PathAdvisor modal positioning issues
  // When onboarding is active, lock body scroll to prevent user from scrolling
  // This ensures PathAdvisor modal is always positioned correctly regardless of scroll position
  useEffect(function lockScrollDuringOnboarding() {
    if (!isOnboardingMode) {
      return;
    }
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    // Lock body scroll during onboarding
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyWidth = document.body.style.width;
    const originalBodyTop = document.body.style.top;
    const originalBodyLeft = document.body.style.left;
    
    const originalHtmlOverflow = document.documentElement.style.overflow;

    // Lock body
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollTop}px`;
    document.body.style.left = `-${scrollLeft}px`;
    
    // Lock html element
    document.documentElement.style.overflow = 'hidden';

    // Prevent scroll via wheel and touch events
    const preventScroll = function (e: Event) {
      e.preventDefault();
      e.stopPropagation();
    };
    
    const preventScrollOptions = { passive: false, capture: true };
    window.addEventListener('wheel', preventScroll, preventScrollOptions);
    window.addEventListener('touchmove', preventScroll, preventScrollOptions);
    window.addEventListener('scroll', preventScroll, preventScrollOptions);

    return function cleanup() {
      // Restore body
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.width = originalBodyWidth;
      document.body.style.top = originalBodyTop;
      document.body.style.left = originalBodyLeft;
      
      // Restore html
      document.documentElement.style.overflow = originalHtmlOverflow;
      
      // Restore scroll position
      window.scrollTo(scrollLeft, scrollTop);
      
      // Remove event listeners
      window.removeEventListener('wheel', preventScroll, true);
      window.removeEventListener('touchmove', preventScroll, true);
      window.removeEventListener('scroll', preventScroll, true);
    };
  }, [isOnboardingMode]);

  // ============================================================================
  // SCROLL TO TOP ON MOUNT
  // Ensures dashboard always shows from the top when navigating to it.
  //
  // WHY WE USE scrollTo(0, 0) INSTEAD OF { behavior: 'instant' }:
  // TypeScript's DOM typings for ScrollBehavior only allow 'auto' or 'smooth'.
  // The 'instant' value is a browser-specific extension not in the official spec.
  // Using scrollTo(0, 0) achieves the same instant scroll without animation
  // and is fully type-safe across all browsers.
  // ============================================================================

  useEffect(function () {
    window.scrollTo(0, 0);
  }, []);

  // ============================================================================
  // HELPER: getCareerSummaryText
  // Returns a one-line summary of the user's career goals for the header.
  // ============================================================================

  const getCareerSummaryText = function (): string {
    // For Job Seekers: Show their target grade band
    if (profile.persona === 'job_seeker') {
      return getGradeBandDisplayText(
        profile.goals.gradeBand,
        profile.goals.targetGradeFrom,
        profile.goals.targetGradeTo
      );
    }

    // For Federal Employees: Show their promotion target
    if (profile.goals.targetGradeFrom && profile.goals.targetGradeTo) {
      return (
        'Planning promotion from ' +
        profile.goals.targetGradeFrom +
        ' to ' +
        profile.goals.targetGradeTo
      );
    }
    return 'Set your promotion target grades in Profile & Settings';
  };

  // ============================================================================
  // DETERMINE PERSONA
  // user.currentEmployee === false means Job Seeker
  // user.currentEmployee === true means Federal Employee
  //
  // PERSONA SOURCE CONSISTENCY:
  // This component uses user.currentEmployee for rendering decisions but the
  // header summary (getCareerSummaryText) uses profile.persona. These two
  // sources should remain in sync. The profileStore sets both together,
  // but we add a dev-only runtime check below to catch drift early.
  //
  // Future refactors should consolidate to a single persona source.
  // ============================================================================

  const isJobSeeker = !user.currentEmployee;

  // ============================================================================
  // DEV-ONLY PERSONA DRIFT WARNING
  // Detects if user.currentEmployee and profile.persona have drifted apart.
  // This runs only in development to catch bugs early without impacting prod.
  //
  // HOW IT WORKS:
  // 1. If user.currentEmployee is false, we expect profile.persona === 'job_seeker'
  // 2. If user.currentEmployee is true, we expect profile.persona === 'federal_employee'
  // 3. Any mismatch triggers a console.warn for developer awareness
  //
  // WHY DEV-ONLY:
  // - We don't want console noise in production
  // - Store logic should prevent drift; this is a safety net for development
  // ============================================================================

  useEffect(function () {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Check for persona drift
    const userIsEmployee = user.currentEmployee;
    const profilePersona = profile.persona;

    // Expected mappings:
    // user.currentEmployee === true  → profile.persona === 'federal_employee'
    // user.currentEmployee === false → profile.persona === 'job_seeker'
    let hasDrift = false;

    if (userIsEmployee && profilePersona !== 'federal_employee') {
      hasDrift = true;
    }
    if (!userIsEmployee && profilePersona !== 'job_seeker') {
      hasDrift = true;
    }

    if (hasDrift) {
      console.warn(
        '[PathOS Dashboard] Persona drift detected: ' +
        'user.currentEmployee=' + String(userIsEmployee) + ' but ' +
        'profile.persona="' + profilePersona + '". ' +
        'These values should be kept in sync by profileStore.'
      );
    }
  }, [user.currentEmployee, profile.persona]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <PageShell fullWidth>
      <div className="p-4 lg:p-8 space-y-4 lg:space-y-6 max-w-screen-2xl mx-auto">
        {/* ================================================================== */}
        {/* PAGE HEADER                                                        */}
        {/* Shows title, subtitle, and career summary based on persona.        */}
        {/* ================================================================== */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {isJobSeeker
                ? 'Plan your path into federal service'
                : 'Your personalized federal career intelligence hub'}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-muted-foreground">
              {getCareerSummaryText()}
              {profile.location.currentMetroArea && (
                <span className="hidden sm:inline">
                  {' '}
                  · {profile.location.currentMetroArea.split(',')[0]}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* ================================================================== */}
        {/* PERSONA-SPECIFIC CONTENT                                           */}
        {/* Job Seekers see the reorganized dashboard (Day 13 Follow-up).     */}
        {/* Federal Employees see PathAdvisor Insights + cards grid.          */}
        {/* Day 36: Wrapped in OnboardingModeOverlay to dim cards during onboarding */}
        {/* ================================================================== */}
        <OnboardingModeOverlay isOnboardingMode={isOnboardingMode}>
          {isJobSeeker ? (
          /* -------------------------------------------------------------- */
          /* JOB SEEKER DASHBOARD FLOW (Day 35 - Hybrid Advisor + Mission Board) */
          /*                                                                 */
          /* PRIMARY CONTENT:                                                 */
          /* - CoachSessionPanel: PathAdvisor guided session                  */
          /*   - Title: "Your Plan"                                           */
          /*   - Process-certainty messaging (no guarantees)                  */
          /*   - Initial messages with evidence chips                         */
          /*   - Choice prompt: "Fastest win" vs "Highest impact"             */
          /*   - Primary CTA button (sticky at bottom)                        */
          /*                                                                 */
          /* SECONDARY CONTENT:                                              */
          /* - MissionBoardV1: 3-step mission board                          */
          /*   1. Target the right roles                                      */
          /*   2. Qualify and prove it                                       */
          /*   3. Apply with precision                                        */
          /* - EvidenceDrawerV1: Collapsible evidence cards                  */
          /*   - Market Snapshot                                              */
          /*   - Eligibility Blockers                                         */
          /*   - Today's Focus                                                */
          /*   - Next Best Move                                               */
          /*                                                                 */
          /* LAYOUT:                                                          */
          /* - Desktop: 2-column (Coach left, Mission+Evidence right)        */
          /* - Mobile: Single column (Coach full-width, Mission compact)     */
          /*                                                                 */
          /* DESIGN PRINCIPLES:                                               */
          /* - Real, authentic, friendly                                      */
          /* - High-confidence via process certainty                          */
          /* - Calm and low-noise                                             */
          /* - "I'm being guided" not "I'm reading analytics"                */
          /*                                                                 */
          /* NOTE: Benefits and Offer Preview are now subtle "Explore later"  */
          /* links instead of large cards on the default dashboard.          */
          /*                                                                 */
          /* Day 36: Pass isOnboardingMode prop to enable onboarding conversation */
          /* -------------------------------------------------------------- */
          <>
            <JobSeekerCoachDashboardV1 isOnboardingMode={isOnboardingMode} />
          </>
        ) : (
          /* -------------------------------------------------------------- */
          /* FEDERAL EMPLOYEE DASHBOARD FLOW                                 */
          /* PathAdvisor Insights - AI-powered career analysis               */
          /* Followed by the standard dashboard cards grid                   */
          /*                                                                 */
          /* NOTE: Federal Employee flow is unchanged by Day 13 Follow-up.   */
          /* They continue to see PathAdvisor + all dashboard cards.         */
          /* -------------------------------------------------------------- */
          <>
            <PathAdvisorInsightsCard />

            {/* ============================================================ */}
            {/* DASHBOARD CARDS GRID (Federal Employees only)                 */}
            {/* These cards show employee-specific views with actual data.    */}
            {/* Each card has its own employee-view.tsx component.            */}
            {/* ============================================================ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              <TotalCompensationCard />
              <RetirementReadinessCard />
              <FehbComparisonCard />
              <LeaveBenefitsCard />
              <TaxInsightsCard />
              <PcsRelocationCard />
            </div>
          </>
          )}
        </OnboardingModeOverlay>
      </div>
    </PageShell>
  );
}
