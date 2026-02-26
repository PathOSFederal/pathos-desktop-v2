/**
 * ============================================================================
 * CAREER & RESUME PAGE (REFACTORED)
 * ============================================================================
 *
 * FILE PURPOSE:
 * This is the main Career & Resume page in the PathOS dashboard. It has been
 * refactored to follow first-principles UX design, answering four key questions
 * in 10-15 seconds:
 *   1. What should I do next?
 *   2. Why does it matter?
 *   3. How long will it take?
 *   4. Where do I click?
 *
 * WHY THIS REFACTOR:
 * The previous page design felt like a passive status dashboard with:
 *   - No clear call to action at the top
 *   - Competing progress metrics (completion % vs strength %)
 *   - Scattered sections without a decision flow
 *   - Inconsistent privacy labels
 *
 * KEY CHANGES (Day 14):
 * 1. Added Career Command Strip at the top (primary action surface)
 * 2. Reordered sections by decision flow (mobile-first)
 * 3. Merged Resume Overview + Strength/Sections into one card
 * 4. Converted Next Actions into completable task rows with deep links
 * 5. Added Primary badge/toggle to Target Roles
 * 6. Unified privacy display (consistent labels)
 *
 * SECTION ORDER (decision flow):
 * 1. Career Command Strip (dominant, always visible)
 * 2. Target Roles & Paths (user declares intent)
 * 3. Resume Readiness & Sections (merged card, shows progress)
 * 4. Next Actions (task list, scrollable target for "View plan")
 * 5. Promotion Readiness (secondary diagnosis)
 * 6. Career Snapshot (reference data, at bottom)
 *
 * PRIVACY DISPLAY:
 * Uses consistent terminology across the page:
 *   - "Privacy Mode: Hidden" when sensitive data is masked
 *   - "Privacy Mode: Visible" when data is shown
 * The PathAdvisor sidebar is updated to use the same labels.
 *
 * ARCHITECTURE FIT:
 * - Located at /dashboard/career
 * - Integrates with Resume Builder for editing
 * - Uses shared stores (resumeBuilderStore, userPreferencesStore)
 * - Communicates with PathAdvisor via advisor-context
 *
 * @version Day 14 - Career & Resume First-Principles Refactor
 */

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUserPreferencesStore } from '@/store/userPreferencesStore';
import { useAdvisorContext } from '@/contexts/advisor-context';
import { CareerCommandStrip } from '@/components/career-resume/career-command-strip';
import { TargetRolesCard } from '@/components/career-resume/target-roles-card';
import { ResumeReadinessCard } from '@/components/career-resume/resume-readiness-card';
import { NextActionsCard } from '@/components/career-resume/next-actions-card';
import { PromotionReadinessCard } from '@/components/career-resume/promotion-readiness-card';
import { CareerSnapshotCard } from '@/components/career-resume/career-snapshot-card';
import { PageShell } from '@/components/layout/page-shell';

/**
 * Section status type for resume sections.
 */
type SectionStatus = 'complete' | 'in-progress' | 'not-started';

/**
 * ResumeSection interface for the merged Resume Readiness card.
 */
interface ResumeSection {
  id: string;
  label: string;
  status: SectionStatus;
  stepParam: string;
  description: string;
}

/**
 * Mock resume sections data.
 * In a real implementation, this comes from the resumeBuilderStore.
 *
 * WHY MOCK DATA:
 * The actual resume data is in the store, but we need to map it to the
 * format expected by ResumeReadinessCard. This mock data demonstrates
 * the expected structure and behavior.
 */
const mockResumeSections: ResumeSection[] = [
  {
    id: 'contact',
    label: 'Contact & Core Info',
    status: 'complete',
    stepParam: 'profile',
    description: 'Name, email, phone, and federal eligibility',
  },
  {
    id: 'experience',
    label: 'Federal Experience',
    status: 'in-progress',
    stepParam: 'work-experience',
    description: 'Work history with duties and accomplishments',
  },
  {
    id: 'education',
    label: 'Education',
    status: 'complete',
    stepParam: 'education',
    description: 'Degrees, training, and certifications',
  },
  {
    id: 'certifications',
    label: 'Certifications & Training',
    status: 'not-started',
    stepParam: 'skills',
    description: 'Professional certifications and courses',
  },
  {
    id: 'awards',
    label: 'Awards & Recognition',
    status: 'not-started',
    stepParam: 'skills',
    description: 'Performance awards and achievements',
  },
];

/**
 * Calculate completion percentage from sections.
 * Complete = 100%, In Progress = 50%, Not Started = 0%
 *
 * @param sections - Array of resume sections
 * @returns Completion percentage (0-100)
 *
 * EXAMPLE:
 *   calculateCompletionPercent([{ status: 'complete' }, { status: 'not-started' }])
 *   -> 50
 */
function calculateCompletionPercent(sections: ResumeSection[]): number {
  if (sections.length === 0) {
    return 0;
  }

  let total = 0;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.status === 'complete') {
      total += 100;
    } else if (section.status === 'in-progress') {
      total += 50;
    }
    // not-started adds 0
  }

  return Math.round(total / sections.length);
}

/**
 * Determine status label based on completion percentage.
 *
 * @param percent - Completion percentage
 * @returns Status label
 */
function getStatusLabel(percent: number): 'Needs work' | 'Developing' | 'Strong' {
  if (percent >= 80) {
    return 'Strong';
  }
  if (percent >= 40) {
    return 'Developing';
  }
  return 'Needs work';
}

/**
 * CareerResumePage Component
 *
 * STEP-BY-STEP HOW IT WORKS:
 * 1. Reads global privacy state from userPreferencesStore
 * 2. Sets up advisor context for PathAdvisor sidebar
 * 3. Computes resume completion data from mock sections
 * 4. Manages primary target role state via callback from TargetRolesCard
 * 5. Renders sections in decision-flow order
 * 6. Provides scroll-to-tasks functionality for "View plan" button
 *
 * SCROLL BEHAVIOR:
 * The Command Strip has a "View plan" button that scrolls to the Next Actions
 * card. This uses a ref and scrollIntoView for smooth scrolling.
 */
export default function CareerResumePage() {
  // ==========================================================================
  // GLOBAL STATE AND CONTEXT
  // ==========================================================================

  // Read global privacy mode from the user preferences store
  // This determines if sensitive data should be masked
  const globalHide = useUserPreferencesStore(function (state) {
    return state.isSensitiveHidden;
  });

  // Get advisor context for setting screen info
  // This tells PathAdvisor what page we're on and how to help
  const advisorContextData = useAdvisorContext();
  const setScreenInfo = advisorContextData.setScreenInfo;

  // ==========================================================================
  // LOCAL STATE
  // ==========================================================================

  // Track primary target role from TargetRolesCard
  // This is used by the Command Strip to show context-aware guidance
  const [primaryRoleTitle, setPrimaryRoleTitle] = useState<string | null>(
    'IT Specialist (SYSADMIN)'
  );
  const [isPrimaryRoleComplete, setIsPrimaryRoleComplete] = useState(true);

  // Ref for scrolling to Next Actions section
  const nextActionsRef = useRef<HTMLDivElement>(null);

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  // Calculate resume completion from mock sections
  // In real implementation, this would read from resumeBuilderStore
  const completionPercent = calculateCompletionPercent(mockResumeSections);
  const statusLabel = getStatusLabel(completionPercent);

  // ==========================================================================
  // CALLBACKS
  // ==========================================================================

  /**
   * Callback when primary role changes in TargetRolesCard.
   * Updates local state so Command Strip can reflect the change.
   */
  const handlePrimaryRoleChange = useCallback(function (
    role: { title: string } | null,
    isComplete: boolean
  ) {
    if (role) {
      setPrimaryRoleTitle(role.title);
      setIsPrimaryRoleComplete(isComplete);
    } else {
      setPrimaryRoleTitle(null);
      setIsPrimaryRoleComplete(false);
    }
  }, []);

  /**
   * Scroll to the Next Actions section.
   * Called when user clicks "View plan" in the Command Strip.
   */
  const handleViewPlan = useCallback(function () {
    if (nextActionsRef.current) {
      nextActionsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  // ==========================================================================
  // EFFECTS
  // ==========================================================================

  /**
   * Effect: Scroll to top on mount.
   * Ensures page starts at the top when navigating here.
   */
  useEffect(function () {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
  }, []);

  /**
   * Effect: Set PathAdvisor screen info.
   * Tells PathAdvisor what this page is about so it can provide relevant help.
   */
  useEffect(
    function () {
      setScreenInfo(
        'Career & Resume',
        'Help the user manage their federal career trajectory, track promotion readiness, and view resume status. This is the overview workspace. For editing resume details, direct users to the Resume Builder.'
      );
    },
    [setScreenInfo]
  );

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <PageShell fullWidth>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* ================================================================
            PAGE HEADER
            ================================================================
            Shows page title, description, and unified privacy indicator.
            Privacy label uses consistent terminology:
            - "Privacy Mode: Hidden" when data is masked
            - "Privacy Mode: Visible" when data is shown
        ================================================================ */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Career & Resume
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Manage your federal career trajectory and track your resume completeness.
                Use the Resume Builder to edit your federal resume details.
              </p>
            </div>

            {/* ============================================================
                UNIFIED PRIVACY INDICATOR
                ============================================================
                Shows consistent privacy state across page and sidebar.
                Uses "Hidden" / "Visible" terminology for clarity.
                The Shield icon reinforces the privacy/security concept.
            ============================================================ */}
            <Badge
              variant="outline"
              className={
                'flex items-center gap-1.5 self-start sm:self-center ' +
                (globalHide
                  ? 'border-accent/50 text-accent bg-accent/5'
                  : 'border-muted-foreground/30 text-muted-foreground')
              }
            >
              <Shield className="w-3.5 h-3.5" />
              {globalHide ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span className="text-xs">Privacy Mode: Hidden</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-xs">Privacy Mode: Visible</span>
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* ================================================================
            SECTION 1: CAREER COMMAND STRIP (DOMINANT)
            ================================================================
            This is the PRIMARY ACTION SURFACE at the top of the page.
            It answers the user's four key questions:
              1. What should I do next? -> "Next best move" sentence
              2. Why does it matter? -> Impact rationale
              3. How long will it take? -> Time estimate
              4. Where do I click? -> "Fix now" CTA

            The strip uses the SAME completion percent as the Resume Readiness
            card below, ensuring a single source of truth.
        ================================================================ */}
        <CareerCommandStrip
          isSensitiveHidden={globalHide}
          onViewPlan={handleViewPlan}
          completionPercent={completionPercent}
          primaryRoleTitle={primaryRoleTitle}
          isPrimaryRoleComplete={isPrimaryRoleComplete}
        />

        {/* ================================================================
            MAIN GRID LAYOUT
            ================================================================
            Sections are ordered by DECISION FLOW:
            1. Target Roles & Paths (user declares intent)
            2. Resume Readiness (merged card, shows progress)
            3. Next Actions (task list)
            4. Promotion Readiness (secondary diagnosis)
            5. Career Snapshot (reference data)

            On mobile: single column, stacked vertically
            On desktop: 2-column grid with merged card spanning both
        ================================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ============================================================
              SECTION 2: TARGET ROLES & PATHS
              ============================================================
              User declares their intent by setting target roles.
              Exactly one role must be designated as primary.
              The onPrimaryRoleChange callback updates local state
              so the Command Strip can show the correct context.
          ============================================================ */}
          <TargetRolesCard onPrimaryRoleChange={handlePrimaryRoleChange} />

          {/* ============================================================
              SECTION 3: PROMOTION READINESS
              ============================================================
              Shows readiness checks for the user's target promotion.
              This is secondary to the Resume Readiness card but still
              important for understanding overall career trajectory.
          ============================================================ */}
          <PromotionReadinessCard />

          {/* ============================================================
              SECTION 4: RESUME READINESS (MERGED CARD)
              ============================================================
              This card REPLACES the separate Resume Overview and
              Resume Strength & Sections cards. It shows:
              - Single primary progress bar (same metric as Command Strip)
              - "Needed next" list (top 2 missing items)
              - Full sections list with status and Edit links

              The lg:col-span-2 makes it span both columns on desktop.
          ============================================================ */}
          <ResumeReadinessCard
            completionPercent={completionPercent}
            sections={mockResumeSections}
            statusLabel={statusLabel}
          />

          {/* ============================================================
              SECTION 5: NEXT ACTIONS (TASK LIST)
              ============================================================
              This is the target for the "View plan" scroll.
              Shows completable task rows with:
              - Action title (imperative)
              - Impact description
              - Time estimate
              - "Fix now" deep-link
              - Snooze/Dismiss actions

              The ref is used by handleViewPlan for smooth scrolling.
          ============================================================ */}
          <div ref={nextActionsRef} className="lg:col-span-2">
            <NextActionsCard />
          </div>

          {/* ============================================================
              SECTION 6: CAREER SNAPSHOT
              ============================================================
              Reference data at the bottom: current position, grade,
              agency, location, and service dates. This is "nice to know"
              but not the primary focus of the page.

              The lg:col-span-2 makes it span both columns on desktop.
          ============================================================ */}
          <div className="lg:col-span-2">
            <CareerSnapshotCard />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
