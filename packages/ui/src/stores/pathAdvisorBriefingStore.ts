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

export interface PathAdvisorBriefing {
  id: string;
  title: string;
  subtitle?: string;
  sections: BriefingSection[];
  sourceLabel?: string;
}

interface PathAdvisorBriefingState {
  /** Current briefing payload; null when none. */
  briefing: PathAdvisorBriefing | null;
  /** Whether the briefing panel is visible in the rail. */
  isOpen: boolean;
}

interface PathAdvisorBriefingActions {
  /** Set briefing and show it in the rail. */
  openBriefing: (briefing: PathAdvisorBriefing) => void;
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

      openBriefing: function (briefing: PathAdvisorBriefing) {
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
