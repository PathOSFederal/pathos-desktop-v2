/**
 * ============================================================================
 * PATH ADVISOR RAIL -- Shared advisor side panel (PathAdvisor AI)
 * ============================================================================
 *
 * BOUNDARY RULE: This file MUST NOT import from next/* or electron/*.
 *
 * Framed to match web PathAdvisor: header "PathAdvisor AI", context chips
 * (Viewing, Privacy), calm advisor message block, suggested prompts as
 * clickable rows, and input docked at bottom with subtle send button.
 */

'use client';

import type React from 'react';
import { useState } from 'react';
import { Sparkles, Eye, Shield, Send } from 'lucide-react';
import { ModuleCard } from '../components/ModuleCard';

export interface PathAdvisorRailProps {
  dock?: 'left' | 'right';
  /** Optional: chip label for current view (default "Dashboard") */
  viewingLabel?: string;
  /** Optional: privacy chip value (default "Local only") */
  privacyLabel?: string;
}

/* Suggested prompts: clickable rows, dashboard/decision workspace tone */
const SUGGESTED_PROMPTS = [
  'How does my expected salary compare to typical GS grades?',
  'What benefits matter most if I only stay 3 to 5 years?',
  'Explain the FERS pension estimate on my dashboard.',
  'What should I update in my assumptions next?',
];

export function PathAdvisorRail(props: PathAdvisorRailProps) {
  const viewing = props.viewingLabel !== undefined ? props.viewingLabel : 'Dashboard';
  const privacy = props.privacyLabel !== undefined ? props.privacyLabel : 'Local only';
  const [inputValue, setInputValue] = useState('');

  function handlePromptClick(prompt: string) {
    setInputValue(prompt);
  }

  function handleSend() {
    // Non-functional: mock rail only. In a full implementation this would submit to advisor.
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header: PathAdvisor AI (matches web panel) */}
      <div
        className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--p-border)' }}
      >
        <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--p-accent)' }} />
        <h2
          className="font-semibold"
          style={{ color: 'var(--p-text)', fontSize: 'var(--p-font-size-section)' }}
        >
          PathAdvisor AI
        </h2>
      </div>

      {/* Context: status chips (Viewing, Privacy) in ModuleCard */}
      <div className="px-3 pt-2 pb-2 flex-shrink-0">
        <ModuleCard title="Context" variant="dense">
          <div className="flex flex-wrap gap-1.5">
            <span
              className="pathos-context-chip flex items-center gap-1.5 px-2 py-1 text-[12px] font-medium"
              style={{
                background: 'var(--p-surface2)',
                border: '1px solid var(--p-accent-muted)',
                borderRadius: 'var(--p-radius)',
                color: 'var(--p-text-muted)',
              }}
            >
              <Eye className="w-3 h-3 flex-shrink-0" />
              Viewing: {viewing}
            </span>
            <span
              className="pathos-context-chip flex items-center gap-1.5 px-2 py-1 text-[12px] font-medium"
              style={{
                background: 'var(--p-surface2)',
                border: '1px solid var(--p-accent-muted)',
                borderRadius: 'var(--p-radius)',
                color: 'var(--p-text-muted)',
              }}
            >
              <Shield className="w-3 h-3 flex-shrink-0" />
              Privacy: {privacy}
            </span>
          </div>
        </ModuleCard>
      </div>

      {/* Advisor message block: framed with ModuleCard (dense) for consistent rail hierarchy */}
      <div className="px-3 pt-2 flex-shrink-0">
        <ModuleCard title="PathAdvisor" variant="dense">
          <p
            className="text-[13px]"
            style={{ color: 'var(--p-text-muted)' }}
          >
            Use this workspace to review your compensation estimates and decision drivers.
            Ask for help comparing grades, understanding benefits, or adjusting assumptions.
          </p>
        </ModuleCard>
      </div>

      {/* Suggested prompts: ModuleCard with action-like rows (hover/focus-visible) */}
      <div className="px-3 pt-2 flex-1 min-h-0 overflow-y-auto">
        <ModuleCard title="Suggested prompts" variant="dense" className="h-full flex flex-col min-h-0">
          <div className="flex flex-col gap-1 flex-1 min-h-0">
            {SUGGESTED_PROMPTS.map(function (prompt) {
              return (
                <button
                  key={prompt}
                  type="button"
                  onClick={function () { handlePromptClick(prompt); }}
                  className="pathos-prompt-row w-full text-left px-3 py-2 text-[12px] rounded-[var(--p-radius)] transition-colors border"
                  style={{
                    background: 'var(--p-surface2)',
                    borderColor: 'var(--p-border)',
                    color: 'var(--p-text)',
                  }}
                >
                  {prompt}
                </button>
              );
            })}
          </div>
        </ModuleCard>
      </div>

      {/* Input docked bottom with subtle send button */}
      <div className="p-2 flex-shrink-0" style={{ borderTop: '1px solid var(--p-border)' }}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask PathAdvisor..."
            value={inputValue}
            onChange={function (e) { setInputValue(e.target.value); }}
            onKeyDown={function (e) {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-1 min-w-0 px-3 py-2 text-[12px] rounded-[var(--p-radius)] outline-none"
            style={{
              background: 'var(--p-surface2)',
              border: '1px solid var(--p-border)',
              color: 'var(--p-text)',
            }}
          />
          <button
            type="button"
            onClick={handleSend}
            className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-[var(--p-radius)] transition-colors"
            style={{
              background: 'var(--p-accent)',
              color: 'var(--p-bg)',
            }}
            aria-label="Send"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
