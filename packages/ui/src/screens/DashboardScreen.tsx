/**
 * ============================================================================
 * SHARED DASHBOARD SCREEN -- Platform-agnostic dashboard view
 * ============================================================================
 *
 * BOUNDARY RULE: This file MUST NOT import from next/* or electron/*.
 *
 * Phase 7: Added "Today" checklist section and quick-action links to
 * Saved Jobs, Resume Builder, and Guided Apply.
 */

'use client';

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Bookmark,
  FileText,
  ClipboardList,
  Search,
  Briefcase,
} from 'lucide-react';
import { useNav } from '@pathos/adapters';
import {
  loadTodayStore,
  saveTodayStore,
  seedTodayIfEmpty,
  addTodayItem,
  toggleTodayItem,
  removeTodayItem,
  clearCompletedItems,
  loadSavedJobsStore,
  loadGuidedApplyStore,
} from '@pathos/core';
import type { TodayStore } from '@pathos/core';

export interface DashboardScreenProps {
  isEmployee?: boolean;
  userName?: string;
}

// ---------------------------------------------------------------------------
// Today checklist sub-component
// ---------------------------------------------------------------------------

function TodayChecklist(props: {
  store: TodayStore;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (title: string) => void;
  onClearCompleted: () => void;
}) {
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = function () {
    if (!newTitle.trim()) return;
    props.onAdd(newTitle.trim());
    setNewTitle('');
  };

  const doneCount = props.store.items.filter(function (i) { return i.done; }).length;

  return (
    <div
      className="p-5"
      style={{
        background: 'var(--p-surface)',
        border: '1px solid var(--p-border)',
        borderRadius: 'var(--p-radius-lg)',
        boxShadow: 'var(--p-shadow)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--p-text)' }}>Today</h3>
        {doneCount > 0 && (
          <button
            type="button"
            onClick={props.onClearCompleted}
            className="text-[11px] font-medium px-2 py-1 rounded transition-colors"
            style={{
              color: 'var(--p-text-dim)',
              background: 'var(--p-surface2)',
            }}
          >
            Clear {doneCount} done
          </button>
        )}
      </div>

      <div className="space-y-1">
        {props.store.items.length === 0 && (
          <p className="text-xs py-2" style={{ color: 'var(--p-text-dim)' }}>
            No tasks for today. Add one below.
          </p>
        )}
        {props.store.items.map(function (item) {
          return (
            <div key={item.id} className="flex items-center gap-2 group py-1">
              <button
                type="button"
                onClick={function () { props.onToggle(item.id); }}
                className="flex-shrink-0"
                style={{ color: item.done ? 'var(--p-success)' : 'var(--p-text-dim)' }}
                aria-label={item.done ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {item.done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              </button>
              <span
                className="flex-1 text-sm"
                style={{
                  color: item.done ? 'var(--p-text-dim)' : 'var(--p-text)',
                  textDecoration: item.done ? 'line-through' : 'none',
                }}
              >
                {item.title}
              </span>
              <button
                type="button"
                onClick={function () { props.onRemove(item.id); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                style={{ color: 'var(--p-text-dim)' }}
                aria-label={'Remove ' + item.title}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--p-border)' }}>
        <input
          type="text"
          placeholder="Add a task..."
          value={newTitle}
          onChange={function (e) { setNewTitle(e.target.value); }}
          onKeyDown={function (e) { if (e.key === 'Enter') handleAdd(); }}
          className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-50"
          style={{ color: 'var(--p-text)' }}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newTitle.trim()}
          className="flex-shrink-0 h-7 w-7 flex items-center justify-center rounded transition-colors disabled:opacity-30"
          style={{ background: 'var(--p-accent)', color: 'var(--p-bg)' }}
          aria-label="Add task"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick action card sub-component
// ---------------------------------------------------------------------------

function QuickAction(props: {
  icon: React.ReactNode;
  label: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="flex items-start gap-3 p-4 text-left transition-colors w-full"
      style={{
        background: 'var(--p-surface)',
        border: '1px solid var(--p-border)',
        borderRadius: 'var(--p-radius-lg)',
        boxShadow: 'var(--p-shadow)',
      }}
    >
      <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--p-accent)' }}>{props.icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-medium" style={{ color: 'var(--p-text)' }}>{props.label}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--p-text-dim)' }}>{props.detail}</p>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main dashboard screen
// ---------------------------------------------------------------------------

export function DashboardScreen(props: DashboardScreenProps) {
  const nav = useNav();
  const isEmployee = props.isEmployee ?? false;
  const greeting = props.userName ? 'Welcome back, ' + props.userName : 'Welcome back';

  const [todayStore, setTodayStore] = useState<TodayStore>({
    schemaVersion: 1,
    items: [],
    lastViewedJobId: null,
  });
  const [savedCount, setSavedCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(function () {
    let today = loadTodayStore();
    today = seedTodayIfEmpty(today);
    setTodayStore(today);
    saveTodayStore(today);

    const saved = loadSavedJobsStore();
    setSavedCount(saved.jobs.length);

    const ga = loadGuidedApplyStore();
    setSessionCount(ga.sessions.length);

    setMounted(true);
  }, []);

  const persistToday = useCallback(function (next: TodayStore) {
    setTodayStore(next);
    saveTodayStore(next);
  }, []);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--p-text)' }}>{greeting}</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--p-text-muted)' }}>
          {isEmployee
            ? 'Your federal career intelligence at a glance.'
            : 'Your federal job search intelligence at a glance.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left column: Today checklist + quick actions */}
        <div className="space-y-6">
          {mounted && (
            <TodayChecklist
              store={todayStore}
              onToggle={function (id) { persistToday(toggleTodayItem(todayStore, id)); }}
              onRemove={function (id) { persistToday(removeTodayItem(todayStore, id)); }}
              onAdd={function (title) { persistToday(addTodayItem(todayStore, title)); }}
              onClearCompleted={function () { persistToday(clearCompletedItems(todayStore)); }}
            />
          )}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 px-1" style={{ color: 'var(--p-text-dim)' }}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <QuickAction
                icon={<Search className="w-4 h-4" />}
                label="Search Jobs"
                detail="Browse federal job listings"
                onClick={function () { nav.push('/dashboard/job-search'); }}
              />
              <QuickAction
                icon={<Bookmark className="w-4 h-4" />}
                label="Saved Jobs"
                detail={savedCount > 0 ? savedCount + ' job' + (savedCount !== 1 ? 's' : '') + ' saved' : 'No saved jobs yet'}
                onClick={function () { nav.push('/dashboard/saved-jobs'); }}
              />
              <QuickAction
                icon={<ClipboardList className="w-4 h-4" />}
                label="Guided Apply"
                detail={sessionCount > 0 ? sessionCount + ' active session' + (sessionCount !== 1 ? 's' : '') : 'Start a new session'}
                onClick={function () { nav.push('/guided-apply'); }}
              />
              <QuickAction
                icon={<FileText className="w-4 h-4" />}
                label="Resume Builder"
                detail="Build your federal resume"
                onClick={function () { nav.push('/dashboard/resume-builder'); }}
              />
            </div>
          </div>
        </div>

        {/* Right column: summary cards */}
        <div className="space-y-4">
          <DashboardCard
            title="Total Compensation"
            description={isEmployee ? 'Your current total compensation package' : 'Estimated federal compensation'}
          />
          <DashboardCard
            title={isEmployee ? 'Retirement Readiness' : 'Market Position'}
            description={isEmployee ? 'FERS and TSP projections' : 'Your fit and mobility heuristics'}
          />
          <DashboardCard
            title={isEmployee ? 'Leave Benefits' : 'Next Best Moves'}
            description={isEmployee ? 'Annual and sick leave balances' : 'Actionable career recommendations'}
          />
        </div>
      </div>
    </div>
  );
}

function DashboardCard(props: { title: string; description: string }) {
  return (
    <div
      className="p-5"
      style={{
        background: 'var(--p-surface)',
        border: '1px solid var(--p-border)',
        borderRadius: 'var(--p-radius-lg)',
        boxShadow: 'var(--p-shadow)',
      }}
    >
      <h3 className="text-sm font-semibold" style={{ color: 'var(--p-text)' }}>{props.title}</h3>
      <p className="text-xs mt-1" style={{ color: 'var(--p-text-dim)' }}>{props.description}</p>
      <div
        className="mt-4 h-20 flex items-center justify-center"
        style={{
          background: 'var(--p-surface2)',
          borderRadius: 'var(--p-radius)',
        }}
      >
        <span className="text-xs" style={{ color: 'var(--p-text-dim)' }}>Card data loading</span>
      </div>
    </div>
  );
}
