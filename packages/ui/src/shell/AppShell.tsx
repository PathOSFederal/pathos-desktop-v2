/**
 * ============================================================================
 * SHARED APP SHELL — Platform-agnostic application layout
 * ============================================================================
 *
 * BOUNDARY RULE: This file MUST NOT import from next/* or electron/*.
 *
 * Provides the consistent layout wrapper: TopBar, Sidebar, content area,
 * and an optional PathAdvisor rail placeholder.
 *
 * The web-specific AppShell (components/app-shell.tsx) adds Next.js features
 * like route transitions, guided tour overlay, and onboarding gating.
 * This shared version focuses on the structural layout that both
 * platforms need.
 */

'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import {
  DEFAULT_THEME_VARIANT,
  THEME_VARIANT_CHANGED_EVENT,
  THEME_VARIANT_STORAGE_KEY,
  loadThemeVariantPreference,
  resolveThemeVariant,
  type ThemeVariant,
} from '@pathos/core';
import { Sidebar, type SidebarProps } from './Sidebar';
import { TopBar, type TopBarProps } from './TopBar';

// Import shared theme tokens (single source of truth)
import '../styles/theme.css';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export type Platform = 'web' | 'desktop-preview' | 'desktop';
export type { ThemeVariant } from '@pathos/core';

export interface AppShellProps {
  children: React.ReactNode;

  /** Platform flag for tiny visual toggles (not component forks) */
  platform?: Platform;
  /** Optional debug override from route query (?theme=...). */
  themeVariant?: ThemeVariant;

  /** Sidebar configuration */
  sidebar?: Omit<SidebarProps, 'onNavigate'>;

  /** TopBar configuration */
  topBar?: TopBarProps;

  /** Optional right-rail content (e.g., PathAdvisor panel) */
  rightRail?: React.ReactNode;

  /** Dock position for the right-rail panel */
  advisorDock?: 'left' | 'right';

  /** Hide sidebar (e.g., immersive views like Benefits Workspace) */
  hideSidebar?: boolean;

  /** Hide advisor rail (e.g., dashboard with its own advisor) */
  hideAdvisor?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SharedAppShell(props: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [persistedTheme, setPersistedTheme] = useState<ThemeVariant | null>(null);
  const dock = props.advisorDock ?? 'right';
  const platform = props.platform ?? 'web';
  const themeVariant = resolveThemeVariant({
    queryTheme: props.themeVariant,
    persistedTheme,
    defaultTheme: DEFAULT_THEME_VARIANT,
  });

  useEffect(function () {
    function refreshThemeFromStorage() {
      setPersistedTheme(loadThemeVariantPreference());
    }

    function handleThemeChanged() {
      refreshThemeFromStorage();
    }

    refreshThemeFromStorage();

    function handleStorage(e: StorageEvent) {
      if (e.key === THEME_VARIANT_STORAGE_KEY || e.key === null) {
        refreshThemeFromStorage();
      }
    }

    window.addEventListener('storage', handleStorage);
    window.addEventListener(THEME_VARIANT_CHANGED_EVENT, handleThemeChanged);
    return function () {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(THEME_VARIANT_CHANGED_EVENT, handleThemeChanged);
    };
  }, []);

  const hamburger = (
    <button
      type="button"
      className="lg:hidden mr-2 h-9 w-9 flex items-center justify-center rounded-[var(--p-radius)] hover:bg-[var(--p-surface2)]"
      style={{ color: 'var(--p-text-muted)' }}
      onClick={function () { setMobileNavOpen(!mobileNavOpen); }}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Open navigation</span>
    </button>
  );

  return (
    <div
      className="pathos-theme flex min-h-screen flex-col"
      style={{ background: 'var(--p-bg-gradient)', color: 'var(--p-text)' }}
      data-platform={platform}
      data-theme={themeVariant}
    >
      <TopBar
        leading={hamburger}
        isSensitiveHidden={props.topBar?.isSensitiveHidden}
        onToggleSensitive={props.topBar?.onToggleSensitive}
        personaLabel={props.topBar?.personaLabel}
        onTogglePersona={props.topBar?.onTogglePersona}
        trailing={props.topBar?.trailing}
        platform={platform}
      />

      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={function () { setMobileNavOpen(false); }}
          />
          <div className="absolute left-0 top-0 h-full w-64 z-50">
            <Sidebar
              isEmployee={props.sidebar?.isEmployee}
              userName={props.sidebar?.userName}
              userSubtitle={props.sidebar?.userSubtitle}
              alertBadgeCount={props.sidebar?.alertBadgeCount}
              onNavigate={function () { setMobileNavOpen(false); }}
            />
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        {!props.hideSidebar && (
          <div className="hidden lg:block">
            <Sidebar
              isEmployee={props.sidebar?.isEmployee}
              userName={props.sidebar?.userName}
              userSubtitle={props.sidebar?.userSubtitle}
              alertBadgeCount={props.sidebar?.alertBadgeCount}
            />
          </div>
        )}

        {/* Left advisor rail */}
        {dock === 'left' && !props.hideAdvisor && props.rightRail && (
          <aside
            className="hidden lg:block w-80 flex-shrink-0"
            style={{ borderRight: '1px solid var(--p-border)', background: 'var(--p-bg)' }}
          >
            <div className="sticky top-2 h-[calc(100vh-5rem)] px-3 pt-3 pb-3">
              {props.rightRail}
            </div>
          </aside>
        )}

        {/* Content area */}
        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--p-bg)' }}>
          {props.children}
        </main>

        {/* Right advisor rail */}
        {dock === 'right' && !props.hideAdvisor && props.rightRail && (
          <aside
            className="hidden lg:block w-80 flex-shrink-0"
            style={{ borderLeft: '1px solid var(--p-border)', background: 'var(--p-surface)' }}
          >
            <div className="sticky top-2 h-[calc(100vh-5rem)] px-3 pt-3 pb-3">
              {props.rightRail}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
