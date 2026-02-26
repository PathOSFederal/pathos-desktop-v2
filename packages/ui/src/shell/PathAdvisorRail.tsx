/**
 * ============================================================================
 * PATH ADVISOR RAIL — Shared advisor side panel (PathAdvisor AI)
 * ============================================================================
 *
 * Renders a single PathAdvisorCard. All conversation UI (header, context pills,
 * conversation window, suggested prompts, composer) lives inside that card.
 * Trust-first microcopy (Viewing, Privacy) is shown as compact pills in the card.
 *
 * BOUNDARY RULE: This file MUST NOT import from next/* or electron/*.
 */

'use client';

import type React from 'react';
import { useState, useCallback } from 'react';
import {
  PathAdvisorCard,
  type PathAdvisorMessage,
} from './PathAdvisorCard';

export interface PathAdvisorRailProps {
  dock?: 'left' | 'right';
  /** Optional: chip label for current view (default "Dashboard") */
  viewingLabel?: string;
  /** Optional: privacy chip value (default "Local only") */
  privacyLabel?: string;
}

/** Suggested prompts: dashboard/decision workspace tone; rendered as chips in the card. */
const SUGGESTED_PROMPTS = [
  'How does my expected salary compare to typical GS grades?',
  'What benefits matter most if I only stay 3 to 5 years?',
  'Explain the FERS pension estimate on my dashboard.',
  'What should I update in my assumptions next?',
];

/**
 * Rail wrapper that renders only PathAdvisorCard. Message state is held here
 * so the card remains presentational; in a full implementation send would
 * call an API and append assistant replies.
 */
export function PathAdvisorRail(props: PathAdvisorRailProps) {
  const [messages, setMessages] = useState<PathAdvisorMessage[]>([]);

  const handleSend = useCallback(function (text: string) {
    const userMessage: PathAdvisorMessage = { role: 'user', content: text };
    setMessages(function (prev) {
      const next = [];
      for (let i = 0; i < prev.length; i++) {
        next.push(prev[i]);
      }
      next.push(userMessage);
      return next;
    });
    // In a full implementation we would call the advisor API and append assistant reply.
  }, []);

  return (
    <div className="h-full flex flex-col min-h-0">
      <PathAdvisorCard
        messages={messages}
        suggestedPrompts={SUGGESTED_PROMPTS}
        onSend={handleSend}
        viewingLabel={props.viewingLabel}
        privacyLabel={props.privacyLabel}
      />
    </div>
  );
}
