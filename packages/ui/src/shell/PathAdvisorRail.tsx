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

/** Stub anchor context for rail: current selection or focus context. */
export interface PathAdvisorAnchorContext {
  anchorType: string;
  anchorTitle: string;
  anchorSummary: string;
}

export interface PathAdvisorRailProps {
  dock?: 'left' | 'right';
  /** Optional: chip label for current view (default "Dashboard") */
  viewingLabel?: string;
  /** Optional: privacy chip value (default "Local only") */
  privacyLabel?: string;
  /**
   * Optional controlled mode: when both messages and onSend are provided,
   * the rail does not own message state; the app handles send (e.g. append user
   * and schedule a simulated assistant reply).
   */
  messages?: PathAdvisorMessage[];
  /** When provided with messages, app handles send (e.g. append user + simulated reply). */
  onSend?: (text: string) => void;
  /** Optional stub anchor context (e.g. placeholder selection) for rail header. */
  anchorContext?: PathAdvisorAnchorContext;
}

/** Suggested prompts: dashboard-context quick questions; 3 items per mockup parity. */
const SUGGESTED_PROMPTS = [
  'What should I focus on first today?',
  'Why did my readiness score change?',
  'When can I expect a referral decision?',
];

/**
 * Rail wrapper that renders only PathAdvisorCard. When messages and onSend
 * are both provided (controlled mode), the app owns message state and send
 * behavior. Otherwise the rail holds message state locally and only appends
 * the user message (no assistant reply).
 */
export function PathAdvisorRail(props: PathAdvisorRailProps) {
  const [internalMessages, setInternalMessages] = useState<PathAdvisorMessage[]>([]);

  const hasMessages = props.messages !== undefined && props.messages !== null;
  const hasOnSend = props.onSend !== undefined && props.onSend !== null;
  const isControlled = hasMessages && hasOnSend;

  const handleSendInternal = useCallback(function (text: string) {
    const userMessage: PathAdvisorMessage = { role: 'user', content: text };
    setInternalMessages(function (prev) {
      const next = [];
      for (let i = 0; i < prev.length; i++) {
        next.push(prev[i]);
      }
      next.push(userMessage);
      return next;
    });
  }, []);

  const messages: PathAdvisorMessage[] =
    isControlled && props.messages !== undefined ? props.messages : internalMessages;
  const onSend: (text: string) => void =
    isControlled && props.onSend !== undefined ? props.onSend : handleSendInternal;

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 min-h-0 flex flex-col">
        <PathAdvisorCard
          messages={messages}
          suggestedPrompts={SUGGESTED_PROMPTS}
          onSend={onSend}
          viewingLabel={props.viewingLabel}
          privacyLabel={props.privacyLabel}
        />
      </div>
    </div>
  );
}
