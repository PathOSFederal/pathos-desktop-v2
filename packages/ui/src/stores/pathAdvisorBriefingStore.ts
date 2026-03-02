/**
 * ============================================================================
 * PATH ADVISOR BRIEFING STORE — Shared state for PathAdvisor “Briefing” content
 * ============================================================================
 *
 * FILE PURPOSE:
 * Holds the current briefing payload and visibility so the Dashboard can open
 * a briefing (e.g. “Why this is your next best move”, “How PathAdvisor estimates
 * timelines”) and the PathAdvisor rail can render it inside the existing
 * PathAdvisor card without layout shift on the dashboard.
 *
 * WHERE IT FITS:
 * - Dashboard “Ask PathAdvisor” buttons call openBriefing(briefing).
 * - PathAdvisorCard reads briefing + isOpen and renders the Briefing section;
 *   close control calls closeBriefing() / clearBriefing().
 *
 * SSR SAFETY:
 * No persistence in this pass; no localStorage. If persistence is added later,
 * guard localStorage access with typeof window !== 'undefined'.
 *
 * CONVENTIONS:
 * - No var; use const/let only. No ?. or ?? or spread in this file.
 */

import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BriefingSection {
  heading: string;
  body: string;
}

/** Generic briefing (Dashboard "Ask PathAdvisor" style): heading + body sections. */
export interface PathAdvisorBriefing {
  id: string;
  title: string;
  subtitle?: string;
  sections: BriefingSection[];
  sourceLabel?: string;
}

/**
 * Fit explanation briefing: deterministic "Why this fit?" from Job Search.
 * Dispatched when user clicks "Why this fit?" in results list; rail shows
 * stars, confidence, top reasons, inputs used/missing, and one CTA.
 */
export interface PathAdvisorBriefingFit {
  type: 'fit';
  jobId: string;
  jobTitle: string;
  stars: number;
  confidence: string;
  reasons: string[];
  inputsUsed: string[];
  missingInputs: string[];
  /** When true, show "Save + Start Tailoring"; when false, show "Tailor resume". */
  isJobSaved: boolean;
}

/** Union: rail can show either a generic briefing or a fit explanation. */
export type PathAdvisorBriefingPayload = PathAdvisorBriefing | PathAdvisorBriefingFit;

/** Type guard: true when payload is fit briefing. */
export function isFitBriefing(
  b: PathAdvisorBriefingPayload | null
): b is PathAdvisorBriefingFit {
  return b !== null && typeof b === 'object' && (b as PathAdvisorBriefingFit).type === 'fit';
}

interface PathAdvisorBriefingState {
  /** Current briefing payload; null when none. */
  briefing: PathAdvisorBriefingPayload | null;
  /** Whether the briefing panel is visible in the rail. */
  isOpen: boolean;
}

interface PathAdvisorBriefingActions {
  /** Set briefing and show it in the rail. */
  openBriefing: (briefing: PathAdvisorBriefingPayload) => void;
  /** Hide the briefing panel; keep briefing data so it can be reopened if desired. */
  closeBriefing: () => void;
  /** Clear briefing and close. */
  clearBriefing: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const usePathAdvisorBriefingStore = create<PathAdvisorBriefingState & PathAdvisorBriefingActions>(
  function (set) {
    return {
      briefing: null,
      isOpen: false,

      openBriefing: function (briefing: PathAdvisorBriefingPayload) {
        set({ briefing, isOpen: true });
      },

      closeBriefing: function () {
        set({ isOpen: false });
      },

      clearBriefing: function () {
        set({ briefing: null, isOpen: false });
      },
    };
  }
);
