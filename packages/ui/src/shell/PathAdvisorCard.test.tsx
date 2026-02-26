/**
 * ============================================================================
 * PATH ADVISOR CARD SMOKE TEST
 * ============================================================================
 *
 * Verifies: (1) messages render in the conversation window, (2) suggested
 * prompts render as chips, (3) composer with send button is present so that
 * when the user submits, onSend is wired (full submit test would require DOM).
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { PathAdvisorCard } from './PathAdvisorCard';

function noop(_text: string) {
  /* mock */
}

describe('PathAdvisorCard', function () {
  it('renders messages in the conversation window', function () {
    const messages = [
      { role: 'user' as const, content: 'Hello' },
      { role: 'assistant' as const, content: 'Hi there.' },
    ];
    const output = renderToString(
      <PathAdvisorCard
        messages={messages}
        suggestedPrompts={[]}
        onSend={noop}
      />
    );
    expect(output).toContain('Hello');
    expect(output).toContain('Hi there.');
  });

  it('renders suggested prompts as chips', function () {
    const prompts = ['First prompt', 'Second prompt'];
    const output = renderToString(
      <PathAdvisorCard
        messages={[]}
        suggestedPrompts={prompts}
        onSend={noop}
      />
    );
    expect(output).toContain('First prompt');
    expect(output).toContain('Second prompt');
  });

  it('renders composer with send button so onSend can be invoked on submit', function () {
    const output = renderToString(
      <PathAdvisorCard
        messages={[]}
        suggestedPrompts={[]}
        onSend={noop}
      />
    );
    expect(output).toContain('aria-label="Send"');
    expect(output).toContain('Ask PathAdvisor');
  });
});
