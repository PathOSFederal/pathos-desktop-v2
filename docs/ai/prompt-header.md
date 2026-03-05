# Cursor Prompt Header

> **Usage**: Copy this header to the beginning of any Cursor prompt to ensure consistent behavior.

---

## Standard Header (Copy This)

```
Do not commit or push.

Cursor/Codex: Read these first, in order:
1) docs/ai/cursor-house-rules.md
2) docs/ai/testing-standards.md
3) docs/ai/prompt-header.md
Process source of truth: docs/ai/cursor-house-rules.md

Then execute the task using the sections below.

## 1) Task Summary
- Day/ticket number, branch, goal, scope.

## 2) Constraints
- Repo-specific constraints and non-goals.
- Keep diffs minimal.

## 3) Commands To Run
- Preflight git state commands.
- Build/test/lint/typecheck commands needed for this ticket.

## 4) Gates To Run
- Human Simulation Gate decision (required yes/no, triggers hit, why).
- A11y/508-ready Gate when UI-impacting.

## 5) Patch Artifacts
- Generate required day patch artifacts.
- Record exact artifact metadata in docs/merge-notes/current.md.

## 6) Merge-Notes + Change Brief Updates
- Update docs/merge-notes/current.md (append-only) with commands, outputs, and evidence.
- Update docs/change-briefs/day-<N>.md for this day.

Task:
[Insert task details]
```

---

## Required Prompt Sections

Every prompt must include:

1. Task Summary
2. Constraints
3. Commands To Run
4. Gates To Run
5. Patch Artifacts
6. Merge-Notes + Change Brief Updates

---

## Tooltip Standard Callout

For UI work, enforce the tooltip standard from canonical docs:
- Interactive Feedback Standard also applies to all interactive UI states; see `docs/ai/cursor-house-rules.md`.
- Include name + short purpose + keyboard shortcut when available.
- Must work on hover and keyboard focus.
- Must not reveal private/sensitive data.
- Verify behavior in the A11y/508-ready Gate evidence.

---

*Last updated: March 2026*
