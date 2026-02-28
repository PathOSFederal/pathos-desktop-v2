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
import { useState, useRef, useEffect } from 'react';
import { Sparkles, Eye, Shield, Send, Trash2, Settings2, X } from 'lucide-react';
import { ModuleCard } from '../components/ModuleCard';
import { usePathAdvisorBriefingStore } from '../stores/pathAdvisorBriefingStore';
import { useDashboardHeroDoNowStore } from '../stores/dashboardHeroDoNowStore';
import { useNav } from '@pathos/adapters';

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
  /** Called when the user confirms clearing all visible chat messages. */
  onClearMessages?: () => void;
  /** Whether chat history should be kept on this device. */
  keepHistoryOnDevice?: boolean;
  /** Called when the user toggles local chat history preference. */
  onToggleStorage?: (enabled: boolean) => void;
  /** Optional export action surfaced in the settings menu. */
  onExportMessages?: () => void;
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
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [keepHistoryEnabled, setKeepHistoryEnabled] = useState(
    props.keepHistoryOnDevice !== undefined ? props.keepHistoryOnDevice : true
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerActionsRef = useRef<HTMLDivElement>(null);

  const briefing = usePathAdvisorBriefingStore(function (s) {
    return s.briefing;
  });
  const isBriefingOpen = usePathAdvisorBriefingStore(function (s) {
    return s.isOpen;
  });
  const closeBriefing = usePathAdvisorBriefingStore(function (s) {
    return s.clearBriefing;
  });
  const heroDoNow = useDashboardHeroDoNowStore(function (s) {
    return s.action;
  });
  const nav = useNav();

  useEffect(
    function () {
      if (props.keepHistoryOnDevice !== undefined) {
        setKeepHistoryEnabled(props.keepHistoryOnDevice);
      }
    },
    [props.keepHistoryOnDevice]
  );

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSend();
  }

  // Auto-scroll conversation to bottom when new messages are appended.
  useEffect(
    function () {
      const el = scrollContainerRef.current;
      if (el !== null && el !== undefined) {
        el.scrollTop = el.scrollHeight;
      }
    },
    [props.messages.length]
  );

  useEffect(function () {
    function handleDocumentPointerDown(e: MouseEvent) {
      const actionsEl = headerActionsRef.current;
      if (actionsEl !== null && !actionsEl.contains(e.target as Node)) {
        setIsClearConfirmOpen(false);
        setIsSettingsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleDocumentPointerDown);
    return function () {
      document.removeEventListener('mousedown', handleDocumentPointerDown);
    };
  }, []);

  function handleConfirmClear() {
    setIsClearConfirmOpen(false);
    if (props.onClearMessages !== undefined) {
      props.onClearMessages();
    }
  }

  function handleToggleStorage() {
    const nextEnabled = !keepHistoryEnabled;
    setKeepHistoryEnabled(nextEnabled);
    if (props.onToggleStorage !== undefined) {
      props.onToggleStorage(nextEnabled);
    }
  }

  function handleExportMessages() {
    setIsSettingsOpen(false);
    if (props.onExportMessages !== undefined) {
      props.onExportMessages();
    }
  }

  const actionButtonClassName =
    'h-7 w-7 grid place-items-center rounded-[var(--p-radius)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--p-accent)]';

  const headerActions = (
    <div
      ref={headerActionsRef}
      className="relative flex items-center gap-1"
    >
      <div className="relative group">
        <button
          type="button"
          className={actionButtonClassName}
          style={{
            background: 'var(--p-surface2)',
            border: '1px solid var(--p-border)',
            color: 'var(--p-text-muted)',
          }}
          aria-label="Clear chat"
          aria-describedby="pathadvisor-clear-tooltip"
          aria-expanded={isClearConfirmOpen}
          onClick={function () {
            setIsSettingsOpen(false);
            setIsClearConfirmOpen(!isClearConfirmOpen);
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <div
          id="pathadvisor-clear-tooltip"
          role="tooltip"
          className="pointer-events-none absolute right-0 top-full z-20 mt-1 w-52 rounded-[var(--p-radius)] border p-2 text-left text-[11px] opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          style={{
            background: 'var(--p-surface)',
            borderColor: 'var(--p-border)',
            color: 'var(--p-text-muted)',
          }}
        >
          <p className="font-semibold" style={{ color: 'var(--p-text)' }}>Clear chat</p>
          <p>Remove current conversation messages from this PathAdvisor view.</p>
        </div>
        {isClearConfirmOpen ? (
          <div
            className="absolute right-0 top-full z-30 mt-1 w-56 rounded-[var(--p-radius)] border p-2"
            style={{
              background: 'var(--p-surface)',
              borderColor: 'var(--p-border)',
            }}
          >
            <p className="text-[11px] mb-2" style={{ color: 'var(--p-text-muted)' }}>
              Clear all messages in this chat?
            </p>
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                className="h-7 px-2 rounded-[var(--p-radius)] text-[11px]"
                style={{
                  background: 'var(--p-surface2)',
                  border: '1px solid var(--p-border)',
                  color: 'var(--p-text-muted)',
                }}
                onClick={function () {
                  setIsClearConfirmOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h-7 px-2 rounded-[var(--p-radius)] text-[11px]"
                style={{
                  background: 'var(--p-accent)',
                  color: 'var(--p-bg)',
                }}
                onClick={handleConfirmClear}
              >
                Confirm
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative group">
        <button
          type="button"
          className={actionButtonClassName}
          style={{
            background: 'var(--p-surface2)',
            border: '1px solid var(--p-border)',
            color: 'var(--p-text-muted)',
          }}
          aria-label="PathAdvisor settings"
          aria-describedby="pathadvisor-settings-tooltip"
          aria-expanded={isSettingsOpen}
          onClick={function () {
            setIsClearConfirmOpen(false);
            setIsSettingsOpen(!isSettingsOpen);
          }}
        >
          <Settings2 className="w-3.5 h-3.5" />
        </button>
        <div
          id="pathadvisor-settings-tooltip"
          role="tooltip"
          className="pointer-events-none absolute right-0 top-full z-20 mt-1 w-56 rounded-[var(--p-radius)] border p-2 text-left text-[11px] opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          style={{
            background: 'var(--p-surface)',
            borderColor: 'var(--p-border)',
            color: 'var(--p-text-muted)',
          }}
        >
          <p className="font-semibold" style={{ color: 'var(--p-text)' }}>PathAdvisor settings</p>
          <p>Adjust local chat retention and optional export actions.</p>
        </div>
        {isSettingsOpen ? (
          <div
            className="absolute right-0 top-full z-30 mt-1 w-64 rounded-[var(--p-radius)] border p-2"
            style={{
              background: 'var(--p-surface)',
              borderColor: 'var(--p-border)',
            }}
          >
            <button
              type="button"
              className="w-full h-8 px-2 rounded-[var(--p-radius)] flex items-center justify-between text-[12px]"
              style={{
                background: 'var(--p-surface2)',
                border: '1px solid var(--p-border)',
                color: 'var(--p-text)',
              }}
              onClick={handleToggleStorage}
              aria-pressed={keepHistoryEnabled}
            >
              <span>Keep chat history on this device</span>
              <span style={{ color: 'var(--p-text-muted)' }}>
                {keepHistoryEnabled ? 'On' : 'Off'}
              </span>
            </button>
            {props.onExportMessages !== undefined ? (
              <button
                type="button"
                className="w-full h-8 mt-1 px-2 rounded-[var(--p-radius)] text-left text-[12px]"
                style={{
                  background: 'var(--p-surface2)',
                  border: '1px solid var(--p-border)',
                  color: 'var(--p-text)',
                }}
                onClick={handleExportMessages}
              >
                Export chat (JSON)
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );

  const messageList = props.messages;
  const promptList = props.suggestedPrompts;

  return (
    <ModuleCard
      icon={<Sparkles className="w-4 h-4" />}
      title="PathAdvisor AI"
      action={headerActions}
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

      {/* Do now: mirror of dashboard hero focus action; hide when invalid; label for clarity. */}
      <div className="flex-shrink-0 mb-3">
        <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: 'var(--p-text-dim)' }}>
          From Today&apos;s Focus
        </p>
        {heroDoNow !== null && heroDoNow !== undefined && heroDoNow.route !== null && heroDoNow.route !== '' ? (
          <button
            type="button"
            onClick={function () {
              nav.push(heroDoNow.route);
            }}
            className="w-full rounded-[var(--p-radius)] px-3 py-2 text-[12px] font-medium transition-colors hover:opacity-90 flex items-center justify-center gap-1.5"
            style={{
              background: 'var(--p-accent-bg)',
              border: '1px solid var(--p-accent-muted)',
              color: 'var(--p-accent)',
            }}
            aria-label={heroDoNow.label !== null && heroDoNow.label !== '' ? 'Do now: ' + heroDoNow.label : 'Do now'}
          >
            Do now: {heroDoNow.label !== null && heroDoNow.label !== '' ? heroDoNow.label : 'Open'}
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full rounded-[var(--p-radius)] px-3 py-2 text-[12px] font-medium flex items-center justify-center gap-1.5 opacity-60 cursor-not-allowed"
            style={{
              background: 'var(--p-surface2)',
              border: '1px solid var(--p-border)',
              color: 'var(--p-text-muted)',
            }}
            title="No action selected"
            aria-label="No action selected"
          >
            Do now
          </button>
        )}
      </div>

      {/* Conversation window: surface2 + subtle border; scrollable; briefing (when open) then chips then messages. */}
      <div
        ref={scrollContainerRef}
        className="pathos-scroll flex-1 min-h-0 overflow-y-auto rounded-[var(--p-radius)] mb-3 flex flex-col gap-2"
        style={{
          background: 'var(--p-surface2)',
          border: '1px solid var(--p-border)',
        }}
      >
        {/* PathAdvisor Briefing: deep explanation opened from Dashboard "Ask PathAdvisor"; above quick prompts. */}
        {briefing !== null && isBriefingOpen ? (
          <div className="flex-shrink-0 px-3 pt-2 pb-2">
            <div
              className="rounded-[var(--p-radius)] border p-3"
              style={{
                background: 'var(--p-surface)',
                borderColor: 'var(--p-border)',
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-[13px]" style={{ color: 'var(--p-text)' }}>
                  PathAdvisor Briefing
                </h3>
                <div className="relative group">
                  <button
                    type="button"
                    onClick={closeBriefing}
                    className="h-6 w-6 grid place-items-center rounded-[var(--p-radius)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--p-accent)]"
                    style={{
                      background: 'var(--p-surface2)',
                      border: '1px solid var(--p-border)',
                      color: 'var(--p-text-muted)',
                    }}
                    aria-label="Close briefing"
                    aria-describedby="pathadvisor-briefing-close-tooltip"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div
                    id="pathadvisor-briefing-close-tooltip"
                    role="tooltip"
                    className="pointer-events-none absolute right-0 top-full z-20 mt-1 w-48 rounded-[var(--p-radius)] border p-2 text-left text-[11px] opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                    style={{
                      background: 'var(--p-surface)',
                      borderColor: 'var(--p-border)',
                      color: 'var(--p-text-muted)',
                    }}
                  >
                    <p className="font-semibold" style={{ color: 'var(--p-text)' }}>Close briefing</p>
                    <p>Close this briefing and return to the default PathAdvisor view.</p>
                  </div>
                </div>
              </div>
              {briefing.sourceLabel !== undefined && briefing.sourceLabel !== '' ? (
                <p className="text-[11px] mb-2" style={{ color: 'var(--p-text-dim)' }}>
                  From: {briefing.sourceLabel}
                </p>
              ) : null}
              {briefing.sections.length > 0
                ? briefing.sections.map(function (sec, idx) {
                    const isFirst = idx === 0;
                    return (
                      <div key={idx} className={isFirst ? 'pt-0 pb-2' : 'pt-2 pb-2'}>
                        {isFirst ? null : (
                          <div
                            className="mx-4 mb-2 h-px"
                            style={{ background: 'var(--p-border)', opacity: 0.6 }}
                          />
                        )}
                        <p className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--p-text-muted)' }}>
                          {sec.heading}
                        </p>
                        <p className="text-[11px] mt-0" style={{ color: 'var(--p-text-dim)' }}>
                          {sec.body}
                        </p>
                      </div>
                    );
                  })
                : null}
            </div>
            <div
              className="mt-2 mx-0 h-px flex-shrink-0"
              style={{ background: 'var(--p-border)', opacity: 0.7 }}
            />
          </div>
        ) : null}

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

        {/* Composer: pinned to bottom with top divider. Input box and send are separate controls. */}
        <div
          className="flex-shrink-0 pt-3"
          style={{ borderTop: '1px solid var(--p-border)' }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2"
          >
            <div
              className="flex flex-1 min-w-0 h-11 px-3 rounded-[var(--p-radius)] focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-[var(--p-accent)]"
              style={{
                background: 'var(--p-surface2)',
                border: '1px solid var(--p-border)',
              }}
            >
              <input
                type="text"
                placeholder="Ask PathAdvisor..."
                value={inputValue}
                onChange={function (e) {
                  setInputValue(e.target.value);
                }}
                className="flex-1 min-w-0 h-full bg-transparent outline-none border-0"
                style={{ color: 'var(--p-text)' }}
              />
            </div>
            <button
              type="submit"
              className="flex-shrink-0 h-11 w-11 grid place-items-center rounded-[var(--p-radius)] transition-colors"
              style={{
                background: 'var(--p-accent)',
                color: 'var(--p-bg)',
              }}
              aria-label="Send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </ModuleCard>
  );
}
