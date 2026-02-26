/**
 * ============================================================================
 * SHARED TOP BAR -- Platform-agnostic top navigation bar
 * ============================================================================
 *
 * BOUNDARY RULE: This file MUST NOT import from next/* or electron/*.
 *
 * Simplified version of components/path-os-top-bar.tsx.
 * Platform-specific features (theme toggle, notification center) are passed
 * in as children or render slots.
 */

'use client';

import type React from 'react';
import { useState } from 'react';
import { Search, Eye, EyeOff, Users, Info, ShieldCheck, X } from 'lucide-react';
import type { Platform } from './AppShell';

export interface TopBarProps {
  /** Slot rendered at the leading edge (e.g., hamburger menu on mobile) */
  leading?: React.ReactNode;
  /** Slot rendered at the trailing edge (e.g., theme toggle, profile dropdown) */
  trailing?: React.ReactNode;
  /** Whether sensitive data is currently hidden */
  isSensitiveHidden?: boolean;
  /** Toggle sensitive data visibility */
  onToggleSensitive?: () => void;
  /** Current persona label (e.g., "Employee" / "Job Seeker") */
  personaLabel?: string;
  /** Toggle persona callback */
  onTogglePersona?: () => void;
  /** Platform hint passed down from AppShell */
  platform?: Platform;
}

export function TopBar(props: TopBarProps) {
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  return (
    <header
      className="relative h-14 lg:h-16 px-3 lg:px-6 flex items-center justify-between gap-2"
      style={{
        background: 'var(--p-surface)',
        borderBottom: '1px solid var(--p-border)',
      }}
    >
      <div className="flex items-center gap-2 lg:gap-3">
        {props.leading}
        <div
          className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center font-bold text-xs lg:text-sm"
          style={{
            background: 'var(--p-accent)',
            borderRadius: 'var(--p-radius)',
            color: 'var(--p-bg)',
          }}
        >
          P
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <h1 className="text-base lg:text-lg font-bold" style={{ color: 'var(--p-text)' }}>
            PathOS
          </h1>
          {(props.platform === 'desktop' || props.platform === 'desktop-preview') && (
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{
                color: 'var(--p-accent)',
                background: 'var(--p-accent-bg)',
                border: '1px solid color-mix(in srgb, var(--p-accent) 30%, transparent)',
              }}
            >
              Desktop
            </span>
          )}
          {/* Local-only badge with info toggle */}
          <button
            type="button"
            onClick={function () { setShowInfoPanel(!showInfoPanel); }}
            aria-label="Data privacy info: all data is stored locally"
            aria-expanded={showInfoPanel}
            className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded cursor-pointer"
            style={{
              color: 'var(--p-success)',
              background: 'color-mix(in srgb, var(--p-success) 12%, transparent)',
              border: '1px solid color-mix(in srgb, var(--p-success) 30%, transparent)',
            }}
          >
            <ShieldCheck className="w-3 h-3" />
            Local only
            <Info className="w-3 h-3 ml-0.5 opacity-60" />
          </button>
        </div>
      </div>

      {/* Info panel overlay */}
      {showInfoPanel && (
        <div
          className="absolute left-4 sm:left-16 top-full mt-1 z-50 w-80 p-4 space-y-3"
          style={{
            background: 'var(--p-surface)',
            border: '1px solid var(--p-border)',
            borderRadius: 'var(--p-radius-lg)',
            boxShadow: 'var(--p-shadow-lg, 0 8px 32px rgba(0,0,0,0.4))',
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" style={{ color: 'var(--p-success)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--p-text)' }}>Your Data Stays Local</span>
            </div>
            <button
              type="button"
              onClick={function () { setShowInfoPanel(false); }}
              className="h-6 w-6 flex items-center justify-center"
              style={{ color: 'var(--p-text-dim)', borderRadius: 'var(--p-radius)' }}
            >
              <X className="w-3.5 h-3.5" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <ul className="space-y-2 text-xs" style={{ color: 'var(--p-text-muted)' }}>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--p-success)' }} />
              All career data and application sessions are stored locally on this device.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--p-success)' }} />
              PathOS does not access your email or mailbox.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--p-success)' }} />
              PathOS does not handle your USAJOBS credentials.
            </li>
          </ul>
          <p className="text-[10px]" style={{ color: 'var(--p-text-dim)' }}>
            You can export or delete your data at any time from Settings &gt; Data Controls.
          </p>
        </div>
      )}

      {/* Search bar */}
      <div className="hidden md:block flex-1 max-w-md mx-4 lg:mx-8">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--p-text-dim)' }}
          />
          <input
            type="text"
            placeholder="Search paths, documents, scenarios..."
            className="w-full pl-10 h-9 text-sm focus:outline-none"
            style={{
              background: 'var(--p-surface2)',
              border: '1px solid var(--p-border)',
              borderRadius: 'var(--p-radius)',
              color: 'var(--p-text)',
              boxShadow: 'none',
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1 lg:gap-3">
        {/* Mobile search */}
        <button
          type="button"
          className="md:hidden h-8 w-8 flex items-center justify-center"
          style={{ color: 'var(--p-text-muted)', borderRadius: 'var(--p-radius)' }}
        >
          <Search className="w-4 h-4" />
          <span className="sr-only">Search</span>
        </button>

        {/* Persona toggle */}
        {props.onTogglePersona && (
          <button
            type="button"
            onClick={props.onTogglePersona}
            aria-label={'Switch persona, current: ' + (props.personaLabel ?? 'User')}
            className="hidden md:flex h-8 lg:h-9 px-2 lg:px-3 items-center gap-1.5 text-xs"
            style={{
              color: 'var(--p-text-muted)',
              border: '1px solid var(--p-border)',
              borderRadius: 'var(--p-radius)',
              background: 'transparent',
            }}
          >
            <Users className="w-4 h-4" />
            <span className="hidden lg:inline">{props.personaLabel ?? 'User'}</span>
          </button>
        )}

        {/* Privacy toggle */}
        {props.onToggleSensitive && (
          <button
            type="button"
            onClick={props.onToggleSensitive}
            aria-label={props.isSensitiveHidden ? 'Show sensitive data' : 'Hide sensitive data'}
            className="h-8 lg:h-9 px-2 flex items-center gap-1.5 text-xs"
            style={{ color: 'var(--p-text-muted)', borderRadius: 'var(--p-radius)' }}
          >
            {props.isSensitiveHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden lg:inline">{props.isSensitiveHidden ? 'Hidden' : 'Visible'}</span>
          </button>
        )}

        {props.trailing}
      </div>
    </header>
  );
}
