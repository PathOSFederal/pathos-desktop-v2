/**
 * ============================================================================
 * SCROLLBARS STYLE — Scoped dark scrollbar for main, PathAdvisor, and drawer
 * ============================================================================
 *
 * Injects global CSS only for:
 * - [data-scroll-container="main"] (main content area)
 * - .pathos-scroll (PathAdvisor rail conversation window)
 * - [data-scroll-container="filter-guide-drawer"] (filter guide drawer list)
 *
 * Uses existing --p-* tokens only. No hardcoded hex. Chromium (Electron/Chrome)
 * and Firefox (best effort). Thin 8px thumb, dark but not harsh, inset look.
 *
 * BOUNDARY RULE: No next/* or electron/* imports.
 */

'use client';

import type React from 'react';

const SCOPE_MAIN = '[data-scroll-container="main"]';
const SCOPE_PATHOS = '.pathos-scroll';
const SCOPE_FILTER_GUIDE_DRAWER = '[data-scroll-container="filter-guide-drawer"]';

/**
 * CSS for scoped scrollbars. Thumb uses --p-surface2 (dark, token-safe).
 * Track transparent. Thin width; border-radius for inset premium look.
 */
const scrollbarCSS = `
  /* Chromium: main content scroll container */
  ${SCOPE_MAIN}::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ${SCOPE_MAIN}::-webkit-scrollbar-track {
    background: transparent;
  }
  ${SCOPE_MAIN}::-webkit-scrollbar-thumb {
    background: var(--p-surface2);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  ${SCOPE_MAIN}::-webkit-scrollbar-thumb:hover {
    background: var(--p-border-strong);
    background-clip: padding-box;
  }

  /* Chromium: PathAdvisor rail scroll region */
  ${SCOPE_PATHOS}::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ${SCOPE_PATHOS}::-webkit-scrollbar-track {
    background: transparent;
  }
  ${SCOPE_PATHOS}::-webkit-scrollbar-thumb {
    background: var(--p-surface2);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  ${SCOPE_PATHOS}::-webkit-scrollbar-thumb:hover {
    background: var(--p-border-strong);
    background-clip: padding-box;
  }

  /* Chromium: filter guide drawer list (same dark desktop style) */
  ${SCOPE_FILTER_GUIDE_DRAWER}::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ${SCOPE_FILTER_GUIDE_DRAWER}::-webkit-scrollbar-track {
    background: transparent;
  }
  ${SCOPE_FILTER_GUIDE_DRAWER}::-webkit-scrollbar-thumb {
    background: var(--p-surface2);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  ${SCOPE_FILTER_GUIDE_DRAWER}::-webkit-scrollbar-thumb:hover {
    background: var(--p-border-strong);
    background-clip: padding-box;
  }

  /* Firefox: thumb and track (best effort; scrollbar-width thin) */
  ${SCOPE_MAIN} {
    scrollbar-width: thin;
    scrollbar-color: var(--p-surface2) transparent;
  }
  ${SCOPE_PATHOS} {
    scrollbar-width: thin;
    scrollbar-color: var(--p-surface2) transparent;
  }
  ${SCOPE_FILTER_GUIDE_DRAWER} {
    scrollbar-width: thin;
    scrollbar-color: var(--p-surface2) transparent;
  }
`;

/**
 * Renders a single <style> tag that applies dark, token-safe scrollbar styling
 * to the main content area and PathAdvisor scroll region only.
 */
export function ScrollbarsStyle(): React.ReactElement {
  return <style dangerouslySetInnerHTML={{ __html: scrollbarCSS }} />;
}
