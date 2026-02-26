/**
 * ============================================================================
 * PATH ADVISOR RAIL -- Shared advisor side panel
 * ============================================================================
 *
 * BOUNDARY RULE: This file MUST NOT import from next/* or electron/*.
 *
 * Styled placeholder for the PathAdvisor panel. Phase 2 version adds
 * module chips, suggested prompts, and themed surfaces.
 */

'use client';

import type React from 'react';
import { MessageSquare, Sparkles, Briefcase, DollarSign, Shield, FileText } from 'lucide-react';

export interface PathAdvisorRailProps {
  dock?: 'left' | 'right';
}

const MODULE_CHIPS = [
  { label: 'Career', icon: <Briefcase className="w-3 h-3" /> },
  { label: 'Compensation', icon: <DollarSign className="w-3 h-3" /> },
  { label: 'Benefits', icon: <Shield className="w-3 h-3" /> },
  { label: 'Resume', icon: <FileText className="w-3 h-3" /> },
];

const SUGGESTED_PROMPTS = [
  'What GS grade should I target next?',
  'Compare my FEHB plan options',
  'How strong is my resume for GS-13?',
  'Estimate my retirement timeline',
];

export function PathAdvisorRail(_props: PathAdvisorRailProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-3"
        style={{ borderBottom: '1px solid var(--p-border)' }}
      >
        <Sparkles className="w-4 h-4" style={{ color: 'var(--p-accent)' }} />
        <h2 className="text-sm font-semibold" style={{ color: 'var(--p-text)' }}>
          PathAdvisor
        </h2>
      </div>

      {/* Module chips */}
      <div className="px-3 pt-3 pb-2">
        <p className="text-xs font-medium mb-2" style={{ color: 'var(--p-text-dim)' }}>
          MODULES
        </p>
        <div className="flex flex-wrap gap-1.5">
          {MODULE_CHIPS.map(function (chip) {
            return (
              <button
                key={chip.label}
                type="button"
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-colors"
                style={{
                  background: 'var(--p-surface2)',
                  border: '1px solid var(--p-border)',
                  borderRadius: 'var(--p-radius)',
                  color: 'var(--p-text-muted)',
                }}
              >
                {chip.icon}
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggested prompts */}
      <div className="px-3 pt-2 flex-1">
        <p className="text-xs font-medium mb-2" style={{ color: 'var(--p-text-dim)' }}>
          SUGGESTED QUESTIONS
        </p>
        <div className="space-y-1.5">
          {SUGGESTED_PROMPTS.map(function (prompt) {
            return (
              <button
                key={prompt}
                type="button"
                className="w-full text-left px-3 py-2 text-xs transition-colors"
                style={{
                  background: 'var(--p-surface2)',
                  borderRadius: 'var(--p-radius)',
                  color: 'var(--p-text-muted)',
                }}
              >
                {prompt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input placeholder */}
      <div className="p-3" style={{ borderTop: '1px solid var(--p-border)' }}>
        <div
          className="flex items-center gap-2 px-3 py-2 text-xs"
          style={{
            background: 'var(--p-surface2)',
            border: '1px solid var(--p-border)',
            borderRadius: 'var(--p-radius)',
            color: 'var(--p-text-dim)',
          }}
        >
          <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Ask PathAdvisor...</span>
        </div>
      </div>
    </div>
  );
}
