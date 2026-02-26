/**
 * ============================================================================
 * PATH ADVISOR CARD — Single dedicated card for PathAdvisor conversation
 * ============================================================================
 *
 * All messages to/from PathAdvisor render inside this card. Layout:
 * Header -> Context pills -> Conversation window (scroll) -> Composer (pinned).
 * Suggested prompts render as chips above the message list inside the same card.
 * Composer (input + send) is pinned to the bottom of the card.
 *
 * BOUNDARY RULE: This file MUST NOT import from next/* or electron/*.
 */

'use client';

import type React from 'react';
import { useState } from 'react';
import { Sparkles, Eye, Shield, Send } from 'lucide-react';
import { ModuleCard } from '../components/ModuleCard';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Single message in the PathAdvisor conversation. */
export interface PathAdvisorMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface PathAdvisorCardProps {
  /** Conversation messages (user and assistant) to show in the scroll area. */
  messages: PathAdvisorMessage[];
  /** Suggested prompt strings rendered as chips above the message list. */
  suggestedPrompts: string[];
  /** Called when the user submits the composer (send button or Enter). */
  onSend: (text: string) => void;
  /** Optional chip label for current view (default "Dashboard"). */
  viewingLabel?: string;
  /** Optional privacy chip value (default "Local only"). */
  privacyLabel?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders the PathAdvisor conversation inside one ModuleCard: header, context
 * pills, scrollable conversation (suggested chips + messages), and pinned composer.
 */
export function PathAdvisorCard(props: PathAdvisorCardProps) {
  const viewing =
    props.viewingLabel !== undefined && props.viewingLabel !== null
      ? props.viewingLabel
      : 'Dashboard';
  const privacy =
    props.privacyLabel !== undefined && props.privacyLabel !== null
      ? props.privacyLabel
      : 'Local only';

  const [inputValue, setInputValue] = useState('');

  function handlePromptClick(prompt: string) {
    setInputValue(prompt);
  }

  function handleSend() {
    const trimmed = inputValue.trim();
    if (trimmed !== '') {
      props.onSend(trimmed);
      setInputValue('');
    }
  }

  const messageList = props.messages;
  const promptList = props.suggestedPrompts;

  return (
    <ModuleCard
      icon={<Sparkles className="w-4 h-4" />}
      title="PathAdvisor AI"
      variant="dense"
      className="h-full flex flex-col min-h-0"
    >
      {/* Wrapper so conversation window can flex and scroll; pills/composer stay fixed. */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Context pills: compact trust-first microcopy (Viewing, Privacy). */}
        <div className="flex flex-wrap gap-1.5 mb-3 flex-shrink-0">
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

      {/* Conversation window: surface2 + subtle border; scrollable; chips then messages. */}
      <div
        className="flex-1 min-h-0 overflow-y-auto rounded-[var(--p-radius)] mb-3 flex flex-col gap-2"
        style={{
          background: 'var(--p-surface2)',
          border: '1px solid var(--p-border)',
        }}
      >
        {/* Suggested prompts as chips above the message list. */}
        {promptList.length > 0 ? (
          <div className="p-2 flex flex-wrap gap-1.5 flex-shrink-0">
            {promptList.map(function (prompt) {
              return (
                <button
                  key={prompt}
                  type="button"
                  onClick={function () {
                    handlePromptClick(prompt);
                  }}
                  className="pathos-prompt-row px-3 py-1.5 text-[12px] rounded-[var(--p-radius)] transition-colors border"
                  style={{
                    background: 'var(--p-surface)',
                    borderColor: 'var(--p-border)',
                    color: 'var(--p-text)',
                  }}
                >
                  {prompt}
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Message list: user and assistant messages in order. */}
        <div className="px-3 pb-3 flex-1 min-h-0">
          {messageList.length === 0 ? (
            <p
              className="text-[13px]"
              style={{ color: 'var(--p-text-muted)' }}
            >
              Use this workspace to review your compensation estimates and
              decision drivers. Ask for help comparing grades, understanding
              benefits, or adjusting assumptions.
            </p>
          ) : (
            messageList.map(function (msg, index) {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={index}
                  className={'mb-2 text-[13px] ' + (isUser ? 'text-right' : '')}
                  style={{
                    color: isUser ? 'var(--p-text)' : 'var(--p-text-muted)',
                  }}
                >
                  {msg.content}
                </div>
              );
            })
          )}
        </div>
      </div>

        {/* Composer: pinned to bottom with top divider. */}
        <div
          className="flex-shrink-0 pt-3"
          style={{ borderTop: '1px solid var(--p-border)' }}
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask PathAdvisor..."
              value={inputValue}
              onChange={function (e) {
                setInputValue(e.target.value);
              }}
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
    </ModuleCard>
  );
}
