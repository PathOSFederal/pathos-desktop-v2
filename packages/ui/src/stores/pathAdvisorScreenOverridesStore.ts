/**
 * ============================================================================
 * PATH ADVISOR SCREEN OVERRIDES STORE — Per-screen rail content
 * ============================================================================
 *
 * PURPOSE: Screens (e.g. Career & Resume) set viewingLabel, suggestedPrompts,
 * and briefingLabel when they mount so the shared PathAdvisor rail shows
 * context-appropriate content without the shell needing to be route-aware.
 * When a screen unmounts it clears the overrides so the rail falls back to
 * default (e.g. Dashboard). Platform-neutral; no next/electron.
 */

import { create } from 'zustand';

export interface PathAdvisorScreenOverrides {
  /** Chip label for "Viewing: ..." (e.g. "Resume Readiness"). */
  viewingLabel: string;
  /** Quick prompt strings for the rail chips. */
  suggestedPrompts: string[];
  /** Label above the "Do now" block (e.g. "From Resume Readiness"). When unset, card uses "From Today's Focus". */
  briefingLabel?: string;
  /** When set, empty-state body copy in the rail uses this instead of default (e.g. Job Search avoids compensation copy). */
  helperParagraph?: string;
}

interface PathAdvisorScreenOverridesState {
  overrides: PathAdvisorScreenOverrides | null;
  setOverrides: (overrides: PathAdvisorScreenOverrides | null) => void;
}

export const usePathAdvisorScreenOverridesStore = create<PathAdvisorScreenOverridesState>(function (set) {
  return {
    overrides: null,
    setOverrides: function (overrides) {
      set({ overrides });
    },
  };
});
