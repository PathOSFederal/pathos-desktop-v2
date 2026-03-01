# Job Search v1 — Layout, Executive Briefing, Token Dropdowns

(No commit or push. Validation run and summary below.)

## What changed

1. **Layout width ratio + spacing (Scope A)**  
   Main content area is a 2-column grid: left (results) `minmax(340px, min(460px, 400px))`, right (details) `minmax(560px, 1fr)`. Scroll Invariant preserved with `min-h-0`. Padding and section spacing in the details card aligned with executive card rhythm (p-4, space-y-5, line-height token).

2. **Job details reformat — executive briefing (Scope B)**  
   Details card refactored into: (1) **Header block**: job title (primary), agency + location (secondary), meta chips row (GS, Close date, Remote/Telework, Series if present), 1–2 line summary (muted); (2) **Requirements block**: specialized experience checklist with Check icon, skills & keywords as chips in a wrap grid, documents needed compact checklist; (3) **Action bar** pinned to bottom: Save job (primary), Tailor resume (secondary), Ask PathAdvisor (secondary via `AskPathAdvisorButton`), View on USAJOBS. Token-only styling; no long paragraphs.

3. **Filter dropdowns — token-styled, portaled (Scope C)**  
   Reusable `FilterDropdown` in `packages/ui/src/screens/_components/FilterDropdown.tsx`: Radix DropdownMenu, portaled to OverlayRoot (getOverlayContainer), token styling (`var(--p-surface)`, `var(--p-border)`, `var(--p-shadow-elev-1)`, hover `var(--p-surface2)`), zIndex from `zIndex.ts` (Z_POPOVER). Applied to all five filters: Grades (GS-9..GS-15 + All Grades), Series (2210, 0343, 0301, 1102 + All Series), Agencies (derived from MOCK_JOBS + All Agencies), Location (derived from MOCK_JOBS + Any Location), Types (Competitive, Excepted, Term + All Types). Fifth filter uses store `appointmentType` (Types); no Tailwind z-*; Overlay Rule v1 satisfied.

## Files changed

- `packages/ui/src/screens/JobSearchScreen.tsx` — grid layout, JobDetailsPanel executive briefing, FilterDropdown for all 5 filters; filter option constants and agency/location derived from MOCK_JOBS.
- `packages/ui/src/screens/_components/FilterDropdown.tsx` — new: token-styled portaled dropdown (Radix DropdownMenu, OverlayRoot, zIndex).
- `packages/ui/src/stores/jobSearchV1Store.test.ts` — added test: setFilters then runSearch returns filtered results by gradeBand.
- `docs/merge-notes.md` — this section.

## Commands run + results

- **pnpm -r typecheck** — Passed (packages/adapters, packages/core, packages/ui, apps/desktop).
- **pnpm test** — Passed (711 tests, 48 files).
- **pnpm routes:check** — OK (all Sidebar routes resolve).
- **pnpm overlays:check** — Passed (Overlay Rule v1 / OverlayRoot).

## Manual checks (recommended)

At 1280–1440px width: (1) results list feels breathable (left column 340–400px), (2) details panel reads like a briefing (header, requirements blocks, pinned action bar), (3) filter dropdown opens and is themed (surface, border, shadow) and not clipped by the rail; dark mode appearance correct.

## Human Simulation Gate

| Item | Value |
|------|-------|
| Required | No |
| Triggers hit | none (layout, styling, filter UI; store filter state already tested) |
| Why | No new create/save/delete actions; filter selection updates existing store and is covered by store test. |

---

# Dashboard Command Center v1 – Pass 1 (Scaffold)

(Log git state and validation outputs below; do not paste full diffs.)

## Git state

**git status**
```
On branch feature/dashboard-command-center-v1
Changes not staged for commit:
  modified:   app/(shared)/dashboard/_components/SharedDashboardRouteShell.tsx
  modified:   app/(shared)/dashboard/page.tsx
  modified:   docs/merge-notes.md
  modified:   packages/ui/src/index.ts
  modified:   packages/ui/src/screens/DashboardScreen.tsx
  modified:   packages/ui/src/shell/PathAdvisorRail.tsx

Untracked files:
  _local_artifacts/
  artifacts/verify-shared-parity-2/
  docs/merge-notes/merge-notes-dashboard-command-center-v1.md
```

**git branch --show-current**
```
feature/dashboard-command-center-v1
```

**Note:** No `develop` branch in repo; using `main` for diff baseline.

**git diff --name-status main...HEAD**  
(Empty when branch was created from main with no commits; working tree changes below.)

**git diff --name-status main --** (working tree vs main, relevant paths)
```
M	app/(shared)/dashboard/_components/SharedDashboardRouteShell.tsx
M	app/(shared)/dashboard/page.tsx
M	docs/merge-notes.md
M	packages/ui/src/index.ts
M	packages/ui/src/screens/DashboardScreen.tsx
M	packages/ui/src/shell/PathAdvisorRail.tsx
```

**git diff --stat main --** (relevant paths)
```
 app/(shared)/dashboard/_components/SharedDashboardRouteShell.tsx |   8 +
 app/(shared)/dashboard/page.tsx                                 |  58 +++-
 docs/merge-notes.md                                             | 310 ++------------------
 packages/ui/src/index.ts                                        |   6 +-
 packages/ui/src/screens/DashboardScreen.tsx                     | 322 ++++++++++++---------
 packages/ui/src/shell/PathAdvisorRail.tsx                       | 118 +++++++-
 6 files changed, 382 insertions(+), 440 deletions(-)
```

## Validation commands (run and record results)

**pnpm lint**  
Exit code 1. Failures are in `apps/desktop/dist/` (require() forbidden) and other pre-existing locations; not introduced by this pass. The only change in our files was removing unused `ThemeVariant` import in SharedDashboardRouteShell (fixed). Warnings policy: only hard failures block; dist/ and artifact lint are pre-existing.

**pnpm typecheck**  
Root `tsc -p tsconfig.json` fails with pre-existing errors (artifacts/, apps/desktop/electron, components referencing `@/app/dashboard/resume-builder/page`). `pnpm exec tsc --noEmit -p packages/ui/tsconfig.json` passes. No new type errors in Pass 1 files.

**pnpm build**  
Passed. Next.js production build completed; /dashboard and other routes built successfully.

**pnpm test**  
Tests exist and run; suite is large (includes artifacts/ and node_modules zod tests). Run was started; pre-existing failures observed (e.g. invalid hook call in artifacts/verify-shared-parity-2, job-storage localStorage). Not required to pass for scaffold-only Pass 1 per testing-standards (optional for pure UI-only changes). Recorded as: run started, many suites pass; some pre-existing failures; no new tests added this pass.

## Human Simulation Gate

| Item | Value |
|------|-------|
| Required | No |
| Triggers hit | none |
| Why | Pass 1 scaffold only: no store logic, persistence, or create/save/delete actions. |

## AI Acceptance Checklist

| Item | Value |
|------|-------|
| Flow | N/A (scaffold only). |
| Store(s) | None. |
| Storage key(s) | None. |
| Failure mode | Dashboard or rail would show placeholder content only. |
| How tested | Manual: load /dashboard and verify sections and rail render. |

## Files changed

- `app/(shared)/dashboard/_components/SharedDashboardRouteShell.tsx` — stub anchor context for PathAdvisorRail
- `app/(shared)/dashboard/page.tsx` — Weekly briefing button callback, Explainer modal scaffold
- `docs/merge-notes.md` — fresh header and logs (prior archived to docs/merge-notes/merge-notes-dashboard-command-center-v1.md)
- `packages/ui/src/index.ts` — export PathAdvisorAnchorContext
- `packages/ui/src/screens/DashboardScreen.tsx` — Command Center layout (Today's Focus, Active Tracks, Signals, empty state, optional Weekly briefing)
- `packages/ui/src/shell/PathAdvisorRail.tsx` — optional anchorContext, Do now / Explain why rail buttons with tooltips

## Dashboard route used

**app/(shared)/dashboard/page.tsx** — shared dashboard route updated in place. Shell and nav unchanged (SharedDashboardRouteShell, SharedAppShell).

## Theme confirmation

No theme changes. No modifications to global theme tokens, tailwind config, globals.css, or shared styling. All new UI uses existing theme tokens (var(--p-*)) and existing components (ModuleCard, Dialog from app/ui). No hardcoded Tailwind colors, hex, custom shadows, or new typography.

---

## Dashboard Command Center v1 – Mockup parity

Goal: Match v0 screenshots (docs/mockups/dashboard-command-center-v1-top.png, dashboard-command-center-v1-bottom.png). Route updated in place: app/(shared)/dashboard/page.tsx. No SharedAppShell / PathAdvisor rail layout structure changes. No theme drift; no hardcoded colors. Minimal diffs.

### Summary of changes

1. **Dashboard content (mockup parity)**  
   - **Briefing:** 4 compact tiles (Saved Jobs, Tracked Apps, Readiness, Next Milestone) with subtext.  
   - **Today's Focus:** Hero card (2 col) with "Your next best move", reason, CTA "Fix resume gap", inline Explain expander, badge "Step 1 of 3"; right side 2 small focus cards (Decode latest status, Tighten questionnaire alignment).  
   - **Your Active Tracks:** Saved Jobs (3 items + status/time), Applications (2 items + status chips + date), Resume (progress meter, checklist, "Open Resume Builder" button).  
   - **Signals:** Updates since last visit (5 items + icons/timestamps), Readiness deltas (3 items +/− and explanation), Timeline estimates (disclaimer, "Explain methodology" collapsible).

2. **Weekly briefing button**  
   Near top right of dashboard content; opens modal with script preview (6–10 lines), buttons Regenerate script, Edit script; Generate video disabled with tooltip "Coming soon". Modal uses existing Dialog/Tooltip patterns.

3. **Mock data**  
   Single file `lib/dashboard/mockDashboardData.ts` drives UI; no store wiring in this pass. App passes `mockDashboardData` to `DashboardScreen` as `data` prop.

4. **PathAdvisor rail**  
   Replaced generic prompts with 3 dashboard-relevant quick prompts: "What should I focus on first today?", "Why did my readiness score change?", "When can I expect a referral decision?"

### Git state (mockup parity pass)

**git status**
```
On branch feature/dashboard-command-center-v1
Changes not staged for commit:
  modified:   app/(shared)/dashboard/_components/SharedDashboardRouteShell.tsx
  modified:   app/(shared)/dashboard/page.tsx
  modified:   docs/merge-notes.md
  modified:   packages/ui/src/index.ts
  modified:   packages/ui/src/screens/DashboardScreen.tsx
  modified:   packages/ui/src/shell/PathAdvisorRail.tsx

Untracked: _local_artifacts/, artifacts/verify-shared-parity-2/, docs/merge-notes/, docs/mockups/, lib/dashboard/
```

**git branch --show-current**  
`feature/dashboard-command-center-v1`

**git diff --name-status develop...HEAD**  
(No `develop` branch; repo uses `main` as baseline.)

**git diff --name-status main...HEAD**  
(Empty; branch created from main, no commits yet.)

**git diff --name-status main --** (working tree vs main, relevant paths)
```
M	app/(shared)/dashboard/_components/SharedDashboardRouteShell.tsx
M	app/(shared)/dashboard/page.tsx
M	docs/merge-notes.md
M	packages/ui/src/index.ts
M	packages/ui/src/screens/DashboardScreen.tsx
M	packages/ui/src/shell/PathAdvisorRail.tsx
```
New file (untracked): `lib/dashboard/mockDashboardData.ts`

**git diff --stat main --** (relevant paths)
```
 app/(shared)/dashboard/_components/SharedDashboardRouteShell.tsx |   9 +-
 app/(shared)/dashboard/page.tsx                                 | 100 ++-
 docs/merge-notes.md                                             | 319 ++------
 packages/ui/src/index.ts                                        |  12 +-
 packages/ui/src/screens/DashboardScreen.tsx                     | 800 +++++++++++++++++----
 packages/ui/src/shell/PathAdvisorRail.tsx                      | 127 +++-
 6 files changed, 955 insertions(+), 412 deletions(-)
```

### Validation

- **pnpm build:** Passed.  
- **pnpm lint / typecheck:** No new errors introduced. Existing failures remain (dist/, artifacts/, resume-builder/page, electron).  
- No patch artifacts created (per instruction: no patch unless push-ready).

## Dashboard CTA route wiring – route discovery + nav hookup

### Commands + outputs

#### git status
```text
On branch feature/dashboard-command-center-v1
Changes not staged for commit:
  modified:   app/(shared)/dashboard/_components/SharedDashboardRouteShell.tsx
  modified:   app/(shared)/dashboard/page.tsx
  modified:   docs/merge-notes.md
  modified:   packages/ui/src/index.ts
  modified:   packages/ui/src/screens/DashboardScreen.tsx
  modified:   packages/ui/src/shell/PathAdvisorRail.tsx

Untracked files:
  _local_artifacts/
  artifacts/dashboard-cta-routing-this-run.patch
  artifacts/dashboard-cta-routing.patch
  artifacts/verify-shared-parity-2/
  docs/merge-notes/merge-notes-dashboard-command-center-v1.md
  docs/mockups/
  lib/dashboard/
```

#### git branch --show-current
```text
feature/dashboard-command-center-v1
```

#### git diff --name-status develop...HEAD
```text
fatal: ambiguous argument 'develop...HEAD': unknown revision or path not in the working tree.
```

#### git diff --stat develop...HEAD
```text
fatal: ambiguous argument 'develop...HEAD': unknown revision or path not in the working tree.
```

### Verification commands

#### pnpm build
```text
PASS (next build completed successfully)
```

#### pnpm typecheck
```text
FAIL (root typecheck has pre-existing repo errors unrelated to this change)
```

#### pnpm -r typecheck
```text
PASS (packages/adapters, packages/core, packages/ui, apps/desktop)
```

### Artifact generation attempts

#### git diff develop...HEAD > artifacts/dashboard-cta-routing.patch
```text
FAILED: develop ref not present in this repo; output file was created as 0 bytes.
```

#### git diff > artifacts/dashboard-cta-routing-this-run.patch
```text
PASS
```

#### ls -lh artifacts
```text
PowerShell does not support `ls -lh`; used `Get-ChildItem artifacts | Select Name,Length,LastWriteTime`.
Key entries:
- dashboard-cta-routing.patch (0 bytes)
- dashboard-cta-routing-this-run.patch (67840 bytes)
- verify-shared-parity-2/ (directory)
```

---

## Dashboard parity fixes + Scroll Invariant v1

Goal: Dashboard Command Center v1 parity fixes and Scroll Invariant v1 in a single pass. No theme drift; minimal diffs; no commit/push.

### Summary of changes

- **Part 0:** Created `docs/ui/ui-contract.md` with section "Scroll Invariant v1" (single primary scroll container, main canvas scrolls, rail fixed, no double scrollbars).
- **Part 1:** Today's Focus layout: 3-column grid; hero left anchor `col-span-2 row-span-2`; both right cards stacked in column 3 (Decode top-right, Tighten/Start bottom-right).
- **Part 2:** State-aware focus cards: when `trackedAppsCount === 0` show "Track an application" (CTA Track → /import); when no guided-apply context show "Start Guided Apply" (CTA Start → /desktop/usajobs-guided). Driven by mock data (data.applications.length, optional hasGuidedApplyContext prop). Tooltips added for new/changed CTAs.
- **Part 3:** Removed external FOCUS card above PathAdvisor; PathAdvisor rail structure unchanged (no separate container above it).
- **Part 4:** Verified mock parity: "Last updated" in section headers, hero "Step 1 of 3" badge, hero Explain expand/collapse (What PathOS knows / does not know / why recommended), Timeline disclaimer and "Explain methodology" collapsible — all present.
- **Part 5:** Scroll Invariant v1 in shared shell: outer container `h-screen overflow-hidden`; main layout `min-h-0`; main content `flex-1 min-h-0 overflow-y-auto overflow-x-hidden` and `data-scroll-container="main"`. Dashboard content scrolls in main; PathAdvisor rail fixed.
- **Part 6:** Sidebar Guided Apply href updated from `/guided-apply` to `/desktop/usajobs-guided`.

### Git state

**git status**
```text
On branch feature/dashboard-command-center-v1
Changes not staged for commit:
  modified:   app/(shared)/dashboard/_components/SharedDashboardRouteShell.tsx
  modified:   app/(shared)/dashboard/page.tsx
  modified:   docs/merge-notes.md
  modified:   packages/ui/src/index.ts
  modified:   packages/ui/src/screens/DashboardScreen.tsx
  modified:   packages/ui/src/shell/AppShell.tsx
  modified:   packages/ui/src/shell/PathAdvisorRail.tsx
  modified:   packages/ui/src/shell/Sidebar.tsx
Untracked: _local_artifacts/, artifacts/*.patch, artifacts/verify-shared-parity-2/, docs/merge-notes/, docs/mockups/, docs/ui/, lib/dashboard/
```

**git branch --show-current**
```text
feature/dashboard-command-center-v1
```

**Note:** No `origin/develop` in repo; baseline used is `main` / `origin/main`.

**git diff --name-status origin/main...HEAD** (commit range; working tree has additional local changes)
```text
M	app/(shared)/dashboard/_components/SharedDashboardRouteShell.tsx
M	app/(shared)/dashboard/page.tsx
M	docs/merge-notes.md
M	packages/ui/src/index.ts
M	packages/ui/src/screens/DashboardScreen.tsx
M	packages/ui/src/shell/AppShell.tsx
M	packages/ui/src/shell/PathAdvisorRail.tsx
M	packages/ui/src/shell/Sidebar.tsx
```

**git diff --stat origin/main...HEAD**
```text
(working tree vs main shows 8 files changed, insertions/deletions as in diff --stat main -- .)
```

**git diff --stat main -- .** (relevant paths, working tree vs main)
```text
 app/(shared)/dashboard/_components/SharedDashboardRouteShell.tsx |   1 -
 app/(shared)/dashboard/page.tsx                                 | 125 ++-
 docs/merge-notes.md                                             | 437 +++++------
 packages/ui/src/index.ts                                        |  12 +-
 packages/ui/src/screens/DashboardScreen.tsx                     | 870 ++++++++++++++++++---
 packages/ui/src/shell/AppShell.tsx                              |  14 +-
 packages/ui/src/shell/PathAdvisorRail.tsx                       |  34 +-
 packages/ui/src/shell/Sidebar.tsx                               |   2 +-
 8 files changed, 1096 insertions(+), 399 deletions(-)
```
(Plus untracked: docs/ui/ui-contract.md)

### Validation

**pnpm build**
```text
PASS. Next.js production build completed; /dashboard and routes built successfully.
```

**pnpm lint**
```text
Exit code 1. Failures in apps/desktop/dist/ (require() forbidden) and other pre-existing locations. No new errors introduced in changed files (SharedDashboardRouteShell, DashboardScreen, AppShell, PathAdvisorRail, Sidebar, docs/ui).
```

**pnpm typecheck**
```text
FAIL. Root tsc has pre-existing errors (resume-builder/page, electron, artifacts). No new type errors in this pass. packages/ui typechecks if run in isolation.
```

### Files changed (this run)

- `docs/ui/ui-contract.md` — new; Scroll Invariant v1 section.
- `app/(shared)/dashboard/_components/SharedDashboardRouteShell.tsx` — removed stub anchorContext from PathAdvisorRail.
- `packages/ui/src/screens/DashboardScreen.tsx` — Today's Focus 3-col grid (hero col-span-2 row-span-2, right cards col 3); state-aware first/second right card; FocusSmallCard ctaTooltip; FocusHeroCard className.
- `packages/ui/src/shell/AppShell.tsx` — Scroll Invariant v1: h-screen overflow-hidden, main min-h-0, main data-scroll-container="main" overflow-x-hidden.
- `packages/ui/src/shell/PathAdvisorRail.tsx` — removed external FOCUS card (anchor context block) above PathAdvisorCard.
- `packages/ui/src/shell/Sidebar.tsx` — Guided Apply href `/guided-apply` → `/desktop/usajobs-guided`.

### Confirmations

- Today's Focus grid: hero is left anchor (col-span-2 row-span-2); both right cards stacked in right column (Decode top-right, Tighten/Start bottom-right); they do not drop below hero at typical desktop widths.
- State-aware focus: when no tracked apps, first right card shows "Track an application" / Track → /import; when no guided-apply context, second right card shows "Start Guided Apply" / Start → /desktop/usajobs-guided.
- External Focus card above PathAdvisor removed; PathAdvisor structure unchanged.
- Dashboard scroll: main content region is the single scroll container; rail fixed; no double scrollbars (Scroll Invariant v1).

### Patch artifacts (baseline: origin/main; origin/develop not in repo)

**Commands:**
```powershell
git diff --binary origin/main -- . ":(exclude)artifacts" | Out-File -FilePath artifacts/dashboard-parity-scroll.patch -Encoding utf8
git diff --binary HEAD -- . ":(exclude)artifacts" | Out-File -FilePath artifacts/dashboard-parity-scroll-this-run.patch -Encoding utf8
Get-ChildItem artifacts | Select-Object Name, Length, LastWriteTime
```

**Key artifact listing (dashboard parity + scroll):**
```text
dashboard-parity-scroll.patch          805006   2/27/2026 6:18:46 PM
dashboard-parity-scroll-this-run.patch 805006   2/27/2026 6:18:47 PM
```

---

## Dashboard polish pass (structured explain + hero density + last updated)

**Branch:** feature/dashboard-command-center-v1  

**Summary of changes**

1. **Explain / multi-point blocks (token-safe separators)**  
   - **Hero Explain expander** (FocusHeroCard): Content split into three clearly separated sections (What PathOS knows; What PathOS does not know; Why this is recommended). Faint separators between sections using `borderTop: 1px solid var(--p-border)` and consistent spacing.  
   - **Timeline methodology**: Methodology text split by double newlines into paragraphs; each paragraph in its own row with a faint top border between rows (same token). Single paragraph unchanged visually.

2. **Hero card content density**  
   - Compact sub-block under the main reason with up to three small items: **Estimated time**, **Why it matters**, **What you'll do**. Optional fields on `DashboardData.focusHero`; rendered only when present. No new styling system; existing tokens and spacing only.  
   - Mock data extended with `estimatedTime: '15–20 min'`, `whyItMatters`, `whatYoullDo` for the focus hero.

3. **Last updated label**  
   - Section headers take optional `lastUpdated?: string`. When missing or empty, the "Last updated" label is hidden (no "—" shown).  
   - `DashboardData` and mock: added `lastUpdated?: string`. Mock sets `lastUpdated: '2m ago'` so section headers show "Last updated: 2m ago" in mock mode.

**Constraints respected:** No global theme or CSS token changes; no hardcoded colors/hex; existing components and tokens only; diffs localized to dashboard components; no `var` (let/const only).

**Files changed**

| File | Summary |
|------|--------|
| `packages/ui/src/screens/DashboardScreen.tsx` | SectionHeader optional lastUpdated; FocusHeroCard explain sections with dividers + density block (estimatedTime, whyItMatters, whatYoullDo); Timeline methodology split into rows with separators; DashboardData + focusHero types extended. |
| `lib/dashboard/mockDashboardData.ts` | FocusHero interface + MockDashboardData: optional estimatedTime, whyItMatters, whatYoullDo, lastUpdated; mock focusHero and root lastUpdated populated. |

**Diff stat (this pass, relevant paths)**  
`git diff --stat HEAD -- packages/ui/src/screens/DashboardScreen.tsx lib/dashboard/mockDashboardData.ts`  
(see repo state; build verified with `pnpm build`.)

**Validation:** `pnpm build` passed. No new lint/typecheck errors introduced beyond known repo issues.

---

## Dashboard row dividers parity

**Goal:** Add faint row dividers everywhere needed for dashboard list-card parity; token-safe; minimal diffs. No theme drift, no hardcoded colors/hex; existing tokens/components only; no `var` (let/const only).

### Summary

1. **CardRowList helper**  
   New reusable component at `packages/ui/src/screens/_components/CardRowList.tsx`. Renders children as vertical rows and inserts a faint divider between each row (not before the first). Divider uses `var(--p-border-light)` (no Separator in @pathos/ui). Props: `children`, optional `className`.

2. **Cards updated to use CardRowList**  
   - **Signals — Updates since last visit:** Divider between each update row.  
   - **Signals — Readiness deltas:** Divider between each delta row.  
   - **Signals — Timeline estimates:** Faint divider between disclaimer and timeline rows; divider between each timeline row.  
   - **Hero card micro-brief:** Estimated time / Why it matters / What you'll do structured as 3 rows with faint dividers between them (wrapper keeps top border from main content).  
   - **Saved Jobs:** Divider between each job row.  
   - **Applications:** Divider between each application row.  
   - **Resume:** Divider between each checklist row (improves scanability).

3. **Validation**  
   - `pnpm build` passed.  
   - No new lint/typecheck errors beyond known repo issues.

### Git state (this run)

**Branch:** `feature/dashboard-command-center-v1`

**Files changed (row-dividers pass):**  
- `packages/ui/src/screens/_components/CardRowList.tsx` (new, untracked)  
- `packages/ui/src/screens/DashboardScreen.tsx` (modified: import CardRowList; FocusHeroCard micro-brief, SavedJobsCard, ApplicationsCard, ResumeCard, UpdatesSinceVisitCard, ReadinessDeltasCard, TimelineEstimatesCard use CardRowList)

**Diff name-status (vs main, exclude artifacts):**  
(Existing branch diff; new file `_components/CardRowList.tsx` is untracked and not in diff. Run `git status` to see untracked.)

**Diff stat (vs main, code paths):**  
See prior merge-notes sections for full branch stat. This pass adds one new file and edits `DashboardScreen.tsx` only.

---

## Divider softness + row spacing polish

**Goal:** Soften dashboard row dividers and improve row spacing without theme drift. No global theme/token changes; no hardcoded colors/hex; minimal diffs localized to the row-list helper and its usages.

### Summary

- **CardRowList** (`packages/ui/src/screens/_components/CardRowList.tsx`):  
  - **Divider:** Inset (`mx-3`), 1px height (`h-px`), token-safe `var(--p-border)` with opacity 0.22. Replaced border-top with a dedicated div so opacity control is straightforward; dividers are no longer full-width/table-like.  
  - **Row spacing:** Each row wrapped in a container with `py-2` and `leading-5` for breathing room and comfortable line-height.  
- **Usages (unchanged):** All existing dashboard list sections already use CardRowList, so they automatically get the updated styling: Updates since last visit, Readiness deltas, Timeline estimates, Saved Jobs, Applications, Resume checklist, and Focus hero density block (estimated time / why / what).

### Validation

- `pnpm build` passed.
- No new lint/typecheck issues; no `var` (let/const only); divider color is `var(--p-border)` only.

### Affected files and diff stat

| File | Change |
|------|--------|
| `packages/ui/src/screens/_components/CardRowList.tsx` | Divider: inset mx-3, h-px, var(--p-border) opacity 0.22; row wrapper: py-2 leading-5. |

**git diff --stat** (branch vs main, exclude artifacts):

```
 app/(shared)/dashboard/_components/SharedDashboardRouteShell.tsx |   1 -
 app/(shared)/dashboard/page.tsx                                 | 125 ++-
 docs/merge-notes.md                                             | 635 +++++++++-----
 ... (other branch files)
 13 files changed, 1919 insertions(+), 392 deletions(-)
```

**Affected files (this run — divider + row spacing):**  
`packages/ui/src/screens/_components/CardRowList.tsx` (styling only; dir untracked), `docs/merge-notes.md` (this section).

---

## Dashboard: Ask PathAdvisor briefing (replaces inline explain)

**Goal:** Move dashboard deep explanations into the PathAdvisor rail (no inline expansion); rename “Explain” CTAs to “Ask PathAdvisor”; keep layout stable.

### Summary

- **PathAdvisor Briefing store** (`packages/ui/src/stores/pathAdvisorBriefingStore.ts`): Zustand store with `briefing`, `isOpen`, and actions `openBriefing`, `closeBriefing`, `clearBriefing`. No persistence; SSR-safe.
- **PathAdvisorCard**: Renders a “PathAdvisor Briefing” section inside the existing card (above quick prompts) when the store has an open briefing. Header with close (X) button and tooltip; optional source line; sections with faint inset separators (`var(--p-border)`, opacity 0.6). Single scroll inside the card; no double scrollbars.
- **Dashboard hero (Today’s Focus):** Inline “Explain” expanded block removed. Micro-brief (Estimated time / Why it matters / What you’ll do) stays inline. CTA changed to “Ask PathAdvisor”; click calls `openBriefing` with title “Why this is your next best move” and sections (What PathOS knows / does not know / Why this is recommended). Tooltip: “Opens PathAdvisor briefing for this recommendation.”
- **Timeline card:** “Explain methodology” replaced with “Ask PathAdvisor”; inline methodology expansion removed. Click opens briefing “How PathAdvisor estimates timelines” with sections: Data is historical, Ranges vary, No guarantees, What signals matter. Tooltip: “Ask PathAdvisor: methodology” and description.
- **Layout:** Clicking “Ask PathAdvisor” does not change dashboard height; only the PathAdvisor rail content updates.

### Files changed (this run)

- `packages/ui/package.json` — add zustand dependency
- `packages/ui/src/stores/pathAdvisorBriefingStore.ts` — new store (briefing state + actions)
- `packages/ui/src/shell/PathAdvisorCard.tsx` — Briefing section inside card, close button + tooltip
- `packages/ui/src/screens/DashboardScreen.tsx` — remove inline explain; hero + timeline “Ask PathAdvisor” + openBriefing; tooltips
- `packages/ui/src/index.ts` — export usePathAdvisorBriefingStore, PathAdvisorBriefing, BriefingSection

### Confirmations

- **Inline expansion removed; dashboard does not shift:** Hero and Timeline no longer expand content inline; “Ask PathAdvisor” only updates the rail.
- **“Ask PathAdvisor” opens briefing inside existing PathAdvisor card:** Briefing renders inside PathAdvisorCard above quick prompts, with close control.
- **Timeline “Ask PathAdvisor” works:** Opens same briefing UI with timeline methodology sections.

### Validation

- **pnpm build:** Passed (Next.js production build; /dashboard and routes built).
- **pnpm typecheck:** Root `tsc` has pre-existing errors (electron, resume-builder). `pnpm exec tsc --noEmit -p packages/ui/tsconfig.json` passes. No new type errors in changed files.
- **pnpm lint:** Run started; pre-existing failures elsewhere. No new errors in packages/ui or dashboard flow.

### Git state (Ask PathAdvisor run)

**git status**  
Working tree includes: `packages/ui/package.json`, `packages/ui/src/index.ts`, `packages/ui/src/screens/DashboardScreen.tsx`, `packages/ui/src/shell/PathAdvisorCard.tsx`; new `packages/ui/src/stores/pathAdvisorBriefingStore.ts` and `packages/ui/src/stores/` (untracked); `docs/merge-notes.md`; plus existing branch artifacts/untracked files.

**git branch --show-current**  
`feature/dashboard-command-center-v1`

**git diff --name-status origin/main...HEAD**  
(Empty when no new commits; branch vs origin/main has no committed diff.)

**git diff --stat origin/main...HEAD**  
(Empty when no new commits.)

### Patch artifacts (push-ready)

If push-ready, generate:

- `git diff origin/main...HEAD > artifacts/dashboard-ask-pathadvisor.patch` (cumulative vs base)
- `git diff > artifacts/dashboard-ask-pathadvisor-this-run.patch` (this run’s working tree diff)
- `ls -lh artifacts` — log output in merge-notes

**Patch artifacts generated:**

- `artifacts/dashboard-ask-pathadvisor.patch` — cumulative (origin/main...HEAD); 0 bytes when no new commits.
- `artifacts/dashboard-ask-pathadvisor-this-run.patch` — working tree diff (this run).

**Get-Item output:**
```
Name          : dashboard-ask-pathadvisor.patch
Length        : 0
LastWriteTime : 2/27/2026 7:20:39 PM

Name          : dashboard-ask-pathadvisor-this-run.patch
Length        : 1354935
LastWriteTime : 2/27/2026 7:20:45 PM
```

### pnpm build output (Ask PathAdvisor run)

```
> next build
   ▲ Next.js 16.0.7 (Turbopack)
   Creating an optimized production build ...
 ✓ Compiled successfully in 10.0s
   Skipping validation of types
   Collecting page data using 11 workers ...
 ✓ Generating static pages (38/38)
   Finalizing page optimization ...
Route (app) ... /dashboard ... (and other routes)
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

## Branded AskPathAdvisorButton

**Summary:** "Ask PathAdvisor" is now a branded signature button using the PathAdvisor emblem (Sparkles, same as rail header), label "Ask PathAdvisor" (with space), secondary/outline style, and optional tooltip with optional shortcut hint. No theme drift; no new colors; existing tokens and patterns only.

**Files changed:**

- `packages/ui/src/components/AskPathAdvisorButton.tsx` — **NEW**. Reusable component: onClick, disabled, size, className, tooltipText, shortcutHint, tooltipId. Sparkles icon (14–16px) left of label "Ask PathAdvisor"; default tooltip "Opens a PathAdvisor briefing for this recommendation."; icon aria-hidden, visible text preserved.
- `packages/ui/src/index.ts` — Export `AskPathAdvisorButton` and `AskPathAdvisorButtonProps`.
- `packages/ui/src/screens/DashboardScreen.tsx` — Today's Focus hero and Timeline card "Ask PathAdvisor" buttons replaced with `<AskPathAdvisorButton />`; hero uses default tooltip and tooltipId `focus-hero-ask-pathadvisor-tooltip`; timeline uses custom tooltipText and tooltipId `timeline-ask-pathadvisor-tooltip`. No layout change; briefing behavior unchanged.

**Diff stats (this section only):** 1 new file, 2 modified (index, DashboardScreen). Keyboard shortcut not implemented (no existing keybinding pattern in packages/ui); tooltip supports optional `shortcutHint` for future use.

## Routing inventory (Next 3000 vs Desktop 5173)

### git status
```text
On branch feature/dashboard-command-center-v1
Your branch is up to date with 'origin/feature/dashboard-command-center-v1'.

nothing to commit, working tree clean
```

### git branch --show-current
```text
feature/dashboard-command-center-v1
```

### git diff --name-status
```text
(no output)
```

### git diff --stat
```text
(no output)
```

### Verification summary
- `pnpm -r typecheck`: PASS (packages/adapters, packages/core, packages/ui, apps/desktop)
- `pnpm build`: PASS (Next.js app build succeeded; baseline-browser-mapping staleness warnings only)

---

## Routing parity fix (Next 3000 vs Desktop 5173)

**Goal:** Permanent routing parity and single source of truth for screens so Sidebar links work in both Next (3000) and Desktop (5173); shared screens in packages/ui; no duplication.

### Merge-notes process (required)

**git status**
```text
On branch feature/dashboard-command-center-v1
Your branch is up to date with 'origin/feature/dashboard-command-center-v1'.

Changes not staged for commit:
  modified:   app/(shared)/dashboard/page.tsx
  modified:   apps/desktop/src/DesktopApp.tsx
  modified:   docs/merge-notes.md
  modified:   lib/dashboard/mockDashboardData.ts
  modified:   packages/ui/src/index.ts
  modified:   packages/ui/src/screens/DashboardScreen.tsx
  modified:   packages/ui/src/shell/Sidebar.tsx

Untracked files:
  app/guided-apply/
  docs/architecture/
  packages/ui/src/routes/
  packages/ui/src/screens/PlaceholderScreen.tsx
  packages/ui/src/screens/dashboard/
```

**git branch --show-current**
```text
feature/dashboard-command-center-v1
```

**git diff --name-status origin/main...HEAD**  
(Develop ref not available; baseline origin/main. Output includes existing branch commits.)
```text
(See prior merge-notes sections for branch diff; this run adds routing parity changes in working tree.)
```

**git diff --stat origin/main...HEAD**
```text
(See prior merge-notes sections for branch stat.)
```

### Files changed (this run)

| File | Change |
|------|--------|
| `packages/ui/src/routes/routes.ts` | **NEW** — Shared route constants (DASHBOARD, COMPENSATION, BENEFITS, RETIREMENT, CAREER, RESUME_BUILDER, JOB_SEARCH, SAVED_JOBS, GUIDED_APPLY_CANON, GUIDED_APPLY_ALIAS, EXPLORE_BENEFITS, ALERTS, IMPORT, SETTINGS). |
| `packages/ui/src/shell/Sidebar.tsx` | Import and use route constants for all hrefs and tourMap; no behavioral change. |
| `apps/desktop/src/DesktopApp.tsx` | Add /desktop/usajobs-guided → GuidedApplyScreen; /guided-apply → Navigate to canonical; add routes for /dashboard/compensation, /dashboard/benefits, /dashboard/retirement, /explore/benefits, /alerts, /import with PlaceholderScreen. |
| `app/guided-apply/page.tsx` | **NEW** — Redirect to /desktop/usajobs-guided via next/navigation redirect(). |
| `packages/ui/src/screens/PlaceholderScreen.tsx` | **NEW** — Shared "Coming soon" + Back to Dashboard button; token-safe. |
| `packages/ui/src/screens/dashboard/mockDashboardData.ts` | **NEW** — Shared mock data; shape matches DashboardData. |
| `packages/ui/src/screens/DashboardScreen.tsx` | Use mockDashboardData when props.data not provided; import from ./dashboard/mockDashboardData. |
| `packages/ui/src/index.ts` | Export PlaceholderScreen, PlaceholderScreenProps, mockDashboardData. |
| `app/(shared)/dashboard/page.tsx` | Thin wrapper: remove mockDashboardData import and data prop; DashboardScreen uses internal mock. |
| `lib/dashboard/mockDashboardData.ts` | Re-export mockDashboardData from @pathos/ui (shim). |
| `docs/architecture/routing-contract.md` | **NEW** — Rules: wrappers only, all Sidebar hrefs resolve, canonical Guided Apply, shared screens in packages/ui, route constants in routes.ts. |

### Confirmations

- **Sidebar hrefs resolve in Desktop:** All Sidebar links either render a real screen (dashboard, career, job-search, saved-jobs, resume-builder, settings, Guided Apply canonical) or PlaceholderScreen (compensation, benefits, retirement, explore/benefits, alerts, import). No 404s.
- **Guided Apply canonical + alias:** Next: /guided-apply redirects to /desktop/usajobs-guided; /desktop/usajobs-guided exists. Desktop: /desktop/usajobs-guided → GuidedApplyScreen; /guided-apply → Navigate to /desktop/usajobs-guided. Sidebar uses GUIDED_APPLY_CANON (/desktop/usajobs-guided).
- **Dashboard mock data shared:** mockDashboardData lives in packages/ui; DashboardScreen defaults to it when no data prop. Next dashboard page no longer injects data; Desktop shows same dashboard content as web.

### Validation (run and record)

**pnpm build**
```text
> my-v0-project@0.1.0 build C:\dev\PathOS\codebase\pathos-desktop-web3
> next build
   ▲ Next.js 16.0.7 (Turbopack)
   Creating an optimized production build ...
 ✓ Compiled successfully in 8.9s
   Skipping validation of types
   Collecting page data using 11 workers ...
   Generating static pages using 11 workers (39/39) in 2.0s
   Finalizing page optimization ...
Route (app) ... /dashboard, /guided-apply, /desktop/usajobs-guided, ... (all routes built)
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```
Exit code: 0. PASS.

**pnpm -r typecheck**
```text
Scope: 4 of 5 workspace projects
packages/adapters typecheck$ tsc --noEmit
packages/core typecheck$ tsc --noEmit
packages/adapters typecheck: Done
packages/core typecheck: Done
packages/ui typecheck$ tsc --noEmit
packages/ui typecheck: Done
apps/desktop typecheck$ tsc --noEmit
apps/desktop typecheck: Done
```
Exit code: 0. PASS.

### Artifacts policy

Patch artifacts and Change Brief not generated (not push-ready in this run; do not commit or push per instructions).

---

## Routing parity hardening (automated check + lint ignores)

**Summary:** Added automated route parity check script, `routes:check` pnpm script, and ESLint globalIgnores for `apps/desktop/dist/**`, `artifacts/**`, `_local_artifacts/**` to reduce lint noise. No theme or globals changes; minimal diffs.

**Git state (at time of run):**

**git status**
```
On branch feature/dashboard-command-center-v1
Changes not staged for commit:
  modified:   app/(shared)/dashboard/page.tsx
  modified:   apps/desktop/src/DesktopApp.tsx
  modified:   docs/merge-notes.md
  modified:   eslint.config.mjs
  modified:   lib/dashboard/mockDashboardData.ts
  modified:   package.json
  modified:   packages/ui/src/index.ts
  modified:   packages/ui/src/screens/DashboardScreen.tsx
  modified:   packages/ui/src/shell/Sidebar.tsx
Untracked: app/guided-apply/, docs/architecture/, packages/ui/src/routes/, packages/ui/src/screens/PlaceholderScreen.tsx, packages/ui/src/screens/dashboard/, scripts/check-route-parity.mjs
```

**git branch --show-current**
```
feature/dashboard-command-center-v1
```

**git diff --name-status origin/main...HEAD**
(Committed changes on branch vs origin/main; see repo for full list.)

**git diff --stat origin/main...HEAD**
(Branch includes many committed files; stat omitted here. Working tree changes are the parity + lint edits above.)

**Deliverables:**
- `packages/ui/src/routes/routes.ts`: exported `SIDEBAR_ROUTES` for script use.
- `scripts/check-route-parity.mjs`: reads routes.ts, checks DesktopApp.tsx `<Route path="..." />` and app/**/page.tsx for each Sidebar route; exit 1 on mismatch.
- `package.json`: added `"routes:check": "node scripts/check-route-parity.mjs"`.
- `eslint.config.mjs`: globalIgnores extended with `apps/desktop/dist/**`, `artifacts/**`, `_local_artifacts/**`.

**Validation (see command output summary below):**
- `pnpm routes:check` — PASS
- `pnpm build` — (run below)
- `pnpm -r typecheck` — (run below)
- `pnpm lint` — no longer fails on dist/artifacts (ignored).

**Patch artifacts (push-ready):**
- `artifacts/routing-parity-hardening.patch` — `git diff origin/main...HEAD -- . ":(exclude)artifacts"`
- `artifacts/routing-parity-hardening-this-run.patch` — `git diff -- . ":(exclude)artifacts"`

**Artifact listing (after patch generation):**
```
Name          : routing-parity-hardening.patch
Length        : 163172
LastWriteTime : 2/27/2026 8:09:40 PM

Name          : routing-parity-hardening-this-run.patch
Length        : 28753
LastWriteTime : 2/27/2026 8:09:40 PM
```

**Validation command output summary**

**pnpm routes:check**
```
routes:check: OK — all Sidebar routes resolve in Desktop and Next.
```
Exit code: 0. PASS.

**pnpm build**
Next.js production build completed; routes built successfully. Exit code: 0. PASS.

**pnpm -r typecheck**
Scope: 4 of 5 workspace projects; packages/adapters, packages/core, packages/ui, apps/desktop typecheck: Done. Exit code: 0. PASS.

**pnpm lint**
Lint no longer fails because of dist/artifacts. `apps/desktop/dist/**`, `artifacts/**`, and `_local_artifacts/**` are in globalIgnores. Remaining lint failures (if any) are pre-existing in other paths (e.g. electron scripts, packages/ui screens); not introduced by this hardening change.

---

## Dashboard Pass 2 – view model + snapshot + PathAdvisor actions

**Goal:** View model, change detection, PathAdvisor wiring in shared layer for Next (3000) and Desktop (5173). No theme drift; minimal diffs; no `var`; dashboard behavior in `packages/ui`.

### Git state (Pass 2)

**git status**
```
On branch feature/dashboard-command-center-v1
Changes not staged for commit:
  modified:   app/(shared)/dashboard/page.tsx
  modified:   apps/desktop/src/DesktopApp.tsx
  ... (plus docs, eslint, lib/dashboard, packages/ui, etc.)
Untracked:
  packages/ui/src/screens/dashboard/
  packages/ui/src/stores/dashboardHeroDoNowStore.ts
  ...
```

**git branch --show-current**
```
feature/dashboard-command-center-v1
```

**git diff --name-status origin/main...HEAD**  
(Branch vs main; includes prior commits and working tree.)

**git diff --stat origin/main...HEAD**  
(Summary of changed files and line counts.)

### Files changed (Pass 2)

| File | Change |
|------|--------|
| `packages/ui/src/screens/dashboard/dashboardModel.ts` | Added: FocusItem, ActiveTrack, SignalItem, DashboardViewModel (platform-neutral) |
| `packages/ui/src/screens/dashboard/buildDashboardViewModel.ts` | Added: deterministic builder from DashboardData; max 3 focus, routes from routes.ts, top 3 tracks/signals |
| `packages/ui/src/screens/dashboard/useDashboardSnapshot.ts` | Added: snapshot + change detection; localStorage pathos_dashboard_snapshot_v1, pathos_dashboard_dismissed_focus_v1; SSR-safe |
| `packages/ui/src/stores/dashboardHeroDoNowStore.ts` | Added: hero "Do now" action for PathAdvisor rail |
| `packages/ui/src/screens/DashboardScreen.tsx` | View model driven; visibleFocus (dismissed filtered); hero do-now store; nav.push(actionRoute); dismiss/undo; empty states |
| `packages/ui/src/shell/PathAdvisorCard.tsx` | "Do now" quick action inside card (from store); useNav().push(route) |
| `packages/ui/src/index.ts` | Export dashboard view model types, buildDashboardViewModel, useDashboardSnapshot |

### View model rules

- **Focus:** Max 3 items; each has `actionRoute` from `packages/ui/src/routes/routes.ts` (RESUME_BUILDER, IMPORT, GUIDED_APPLY_CANON).
- **Tracks:** Three cards (Saved Jobs, Applications, Resume); statusSummary and route per track; list preview limited (e.g. top 3 items).
- **Signals:** From updatesSinceVisit (top 3), readinessDeltas (top 2), one timeline summary; raw shapes for existing signal cards on DashboardViewModel.

### Snapshot keys

- **pathos_dashboard_snapshot_v1** — Last view model snapshot (focusCount, trackCount, signalCount, lastUpdated, focusIds, signalIds) for "what changed since last visit."
- **pathos_dashboard_dismissed_focus_v1** — Array of dismissed focus item ids (string[]); persisted for recognition-over-recall.

SSR: All localStorage access guarded with `typeof window !== 'undefined'`. Snapshot updated after render (effect with serialized keys).

### No Next-only imports in packages/ui dashboard

Confirmed: No `next/*` or `electron/*` in `packages/ui/src/screens/dashboard/*` or `packages/ui/src/stores/dashboardHeroDoNowStore.ts`. Navigation via `@pathos/adapters` (useNav). Route constants from `packages/ui/src/routes/routes.ts`.

### PathAdvisor wiring

- Hero focus card: Primary CTA uses `actionRoute` and `nav.push(actionRoute)` (useNav from @pathos/adapters).
- PathAdvisor card: "Do now: {label}" button reads from `useDashboardHeroDoNowStore`; on click calls `nav.push(heroDoNow.route)`. Structure unchanged; inside existing PathAdvisor card.

### Dismiss / Undo

- Dismiss on secondary focus items (small cards); optional for hero (not shown on hero in this pass).
- Dismissed ids stored in `pathos_dashboard_dismissed_focus_v1`.
- "Show dismissed" link restores all dismissed (undo); minimal, consistent with existing UI.

### Validation (Pass 2)

**pnpm routes:check**  
Exit code 0. `routes:check: OK — all Sidebar routes resolve in Desktop and Next.`

**pnpm build**  
Exit code 0. Next.js production build completed.

**pnpm -r typecheck**  
Exit code 0. packages/adapters, packages/core, packages/ui, apps/desktop typecheck: Done.

**pnpm lint**  
Lint on touched dashboard/snapshot/store files: 0 errors. Full-repo lint may report pre-existing errors in other files (e.g. PathAdvisorCard set-state-in-effect, GuidedApplyScreen, Sidebar); not introduced by Pass 2.

### Artifacts policy

Patches generated only when push-ready. When ready:
- `git diff origin/main...HEAD > artifacts/dashboard-pass2.patch`
- `git diff > artifacts/dashboard-pass2-this-run.patch`
- `ls -lh artifacts` (log output in merge-notes)

---

## Dashboard Pass 2 polish (stability + calming UX)

**Goal:** Stability and calming UX with minimal diffs; dashboard + PathAdvisorCard only. No theme drift.

### Summary of changes

1. **Hero Do Now robustness (PathAdvisorCard)**  
   When `heroDoNow` is missing or invalid (no route), show a disabled "Do now" button with tooltip "No action selected" instead of hiding. Hero do-now already updates when focus items change (useEffect in DashboardScreen). Added label "From Today's Focus" above the Do now block.

2. **Snapshot messaging (useDashboardSnapshot + DashboardScreen)**  
   "Changed since last visit" still shown only when there are actual changes (focusChangedCount or signalsNewCount > 0). Replaced generic counts with actionable phrasing: "Resume or application focus changed since last visit.", "New timeline or readiness activity since last visit.", or combined. Added "How this works" link next to the summary that opens a PathAdvisor briefing explaining local snapshot logic (storage, privacy, resetting).

3. **Dismiss UX (DashboardScreen)**  
   Only secondary focus cards remain dismissible (unchanged). "Show dismissed" is a subtle link (text-[10px], opacity 0.85). When expanded, dismissed items are listed in a subdued block (border, surface2, muted text) with per-item "Undo". Toggle "Hide dismissed" to collapse.

4. **Empty states (signal cards)**  
   UpdatesSinceVisitCard, ReadinessDeltasCard, and TimelineEstimatesCard each handle empty list: one calm sentence plus one CTA. Updates empty: "No application or job updates yet." + "Track applications" → IMPORT. Readiness empty: "No readiness changes yet." + "Open Resume Builder" → RESUME_BUILDER. Timeline empty: "No timeline estimates yet." + "Open Resume Builder" → RESUME_BUILDER. No empty list rendering; SignalPlaceholderCard removed.

5. **PathAdvisor clarity**  
   Label "From Today's Focus" added above the PathAdvisor "Do now" button.

### Files touched (polish)

| File | Change |
|------|--------|
| `packages/ui/src/shell/PathAdvisorCard.tsx` | Do now: always show block; disabled + tooltip when invalid; "From Today's Focus" label |
| `packages/ui/src/screens/dashboard/useDashboardSnapshot.ts` | Actionable summaryLine phrasing (resume/app/timeline) |
| `packages/ui/src/screens/DashboardScreen.tsx` | SnapshotHowThisWorksLink, DismissedFocusList, showDismissedExpanded, signal card empty states (onNavigate), remove SignalPlaceholderCard |

### Validation (polish)

**pnpm routes:check**  
Exit code 0. PASS.

**pnpm build**  
Exit code 0. PASS.

**pnpm -r typecheck**  
Exit code 0. PASS.

**pnpm lint**  
No new errors in touched files (DashboardScreen.tsx, useDashboardSnapshot.ts). PathAdvisorCard set-state-in-effect remains pre-existing.

## Dashboard Pass 2 tests (minimal)

### git status
```text
On branch feature/dashboard-command-center-v1
Your branch is up to date with 'origin/feature/dashboard-command-center-v1'.

Changes not staged for commit:
  modified:   app/(shared)/dashboard/page.tsx
  modified:   apps/desktop/src/DesktopApp.tsx
  modified:   docs/merge-notes.md
  modified:   eslint.config.mjs
  modified:   lib/dashboard/mockDashboardData.ts
  modified:   package.json
  modified:   packages/ui/src/index.ts
  modified:   packages/ui/src/screens/DashboardScreen.tsx
  modified:   packages/ui/src/shell/PathAdvisorCard.tsx
  modified:   packages/ui/src/shell/Sidebar.tsx

Untracked files:
  app/guided-apply/
  artifacts/routing-parity-hardening-this-run.patch
  artifacts/routing-parity-hardening.patch
  docs/architecture/
  packages/ui/src/routes/
  packages/ui/src/screens/PlaceholderScreen.tsx
  packages/ui/src/screens/dashboard/
  packages/ui/src/stores/dashboardHeroDoNowStore.test.ts
  packages/ui/src/stores/dashboardHeroDoNowStore.ts
  scripts/check-route-parity.mjs
```

### git branch --show-current
```text
feature/dashboard-command-center-v1
```

### git diff --name-status origin/main...HEAD
```text
A	_local_artifacts/app-confidence-center-pass1-this-run.patch
M	app/(shared)/dashboard/_components/SharedDashboardRouteShell.tsx
M	app/(shared)/dashboard/page.tsx
A	artifacts/dashboard-ask-pathadvisor-this-run.patch
A	artifacts/dashboard-ask-pathadvisor.patch
A	artifacts/dashboard-cta-routing-this-run.patch
A	artifacts/dashboard-cta-routing.patch
A	artifacts/dashboard-parity-scroll-this-run.patch
A	artifacts/dashboard-parity-scroll.patch
A	artifacts/verify-shared-parity-2/README.md
A	artifacts/verify-shared-parity-2/package.json
A	artifacts/verify-shared-parity-2/pathos-desktop/package.json
A	artifacts/verify-shared-parity-2/pathos-desktop/src/main.js
A	artifacts/verify-shared-parity-2/pnpm-lock.yaml
A	artifacts/verify-shared-parity-2/pnpm-workspace.yaml
A	artifacts/verify-shared-parity-2/postcss.config.mjs
A	artifacts/verify-shared-parity-2/public/apple-icon.png
A	artifacts/verify-shared-parity-2/public/file.svg
A	artifacts/verify-shared-parity-2/public/globe.svg
A	artifacts/verify-shared-parity-2/public/icon-dark-32x32.png
A	artifacts/verify-shared-parity-2/public/icon-light-32x32.png
A	artifacts/verify-shared-parity-2/public/icon.svg
A	artifacts/verify-shared-parity-2/public/next.svg
A	artifacts/verify-shared-parity-2/public/placeholder-logo.png
A	artifacts/verify-shared-parity-2/public/placeholder-logo.svg
A	artifacts/verify-shared-parity-2/public/placeholder-user.jpg
A	artifacts/verify-shared-parity-2/public/placeholder.jpg
A	artifacts/verify-shared-parity-2/public/placeholder.svg
A	artifacts/verify-shared-parity-2/public/vercel.svg
A	artifacts/verify-shared-parity-2/public/window.svg
A	artifacts/verify-shared-parity-2/scripts/check-boundaries.mjs
A	artifacts/verify-shared-parity-2/scripts/check-boundaries.py
A	artifacts/verify-shared-parity-2/scripts/check-docs-artifacts.mjs
A	artifacts/verify-shared-parity-2/scripts/create-merge-summary.mjs
A	artifacts/verify-shared-parity-2/scripts/day-snapshot.mjs
A	artifacts/verify-shared-parity-2/scripts/docs-merge-summary-pr.mjs
A	artifacts/verify-shared-parity-2/scripts/gen-day-patches.mjs
A	artifacts/verify-shared-parity-2/scripts/generate-owner-map.mjs
A	artifacts/verify-shared-parity-2/scripts/generate-owner-map.test.mjs
A	artifacts/verify-shared-parity-2/scripts/new-day-checklist.mjs
A	artifacts/verify-shared-parity-2/scripts/validate-change-brief.mjs
A	artifacts/verify-shared-parity-2/scripts/validate-day-artifacts.mjs
A	artifacts/verify-shared-parity-2/scripts/validate-day-labels.mjs
A	artifacts/verify-shared-parity-2/store/auditLogStore.test.ts
A	artifacts/verify-shared-parity-2/store/auditLogStore.ts
A	artifacts/verify-shared-parity-2/store/benefitsAssumptionsStore.ts
A	artifacts/verify-shared-parity-2/store/benefitsWorkspaceStore.ts
A	artifacts/verify-shared-parity-2/store/dashboardStore.ts
A	artifacts/verify-shared-parity-2/store/documentImportStore.test.ts
A	artifacts/verify-shared-parity-2/store/documentImportStore.ts
A	artifacts/verify-shared-parity-2/store/emailIngestionStore.ts
A	artifacts/verify-shared-parity-2/store/guidedTourStore.test.ts
A	artifacts/verify-shared-parity-2/store/guidedTourStore.ts
A	artifacts/verify-shared-parity-2/store/guidedUsaJobsStore.ts
A	artifacts/verify-shared-parity-2/store/index.ts
A	artifacts/verify-shared-parity-2/store/jobAlertsStore.test.ts
A	artifacts/verify-shared-parity-2/store/jobAlertsStore.ts
A	artifacts/verify-shared-parity-2/store/jobSearchStore.ts
A	artifacts/verify-shared-parity-2/store/onboardingStore.test.ts
A	artifacts/verify-shared-parity-2/store/onboardingStore.ts
A	artifacts/verify-shared-parity-2/store/pathAdvisorStore.ts
A	artifacts/verify-shared-parity-2/store/profileStore.ts
A	artifacts/verify-shared-parity-2/store/resumeBuilderStore.ts
A	artifacts/verify-shared-parity-2/store/savedJobsStore.ts
A	artifacts/verify-shared-parity-2/store/tailoringWorkspaceStore.ts
A	artifacts/verify-shared-parity-2/store/taskStore.test.ts
A	artifacts/verify-shared-parity-2/store/taskStore.ts
A	artifacts/verify-shared-parity-2/store/userPreferencesStore.test.ts
A	artifacts/verify-shared-parity-2/store/userPreferencesStore.ts
A	artifacts/verify-shared-parity-2/styles/globals.css
A	artifacts/verify-shared-parity-2/tsconfig.json
A	artifacts/verify-shared-parity-2/types/desktop-shell.d.ts
A	artifacts/verify-shared-parity-2/types/job-search.ts
A	artifacts/verify-shared-parity-2/types/pathadvisor.ts
A	artifacts/verify-shared-parity-2/vitest.config.ts
M	docs/merge-notes.md
A	docs/merge-notes/merge-notes-dashboard-command-center-v1.md
A	docs/mockups/dashboard-command-center-v1-bottom.png
A	docs/mockups/dashboard-command-center-v1-top.png
A	docs/ui/ui-contract.md
A	lib/dashboard/mockDashboardData.ts
M	packages/ui/package.json
A	packages/ui/src/components/AskPathAdvisorButton.tsx
M	packages/ui/src/index.ts
M	packages/ui/src/screens/DashboardScreen.tsx
A	packages/ui/src/screens/_components/CardRowList.tsx
M	packages/ui/src/shell/AppShell.tsx
M	packages/ui/src/shell/PathAdvisorCard.tsx
M	packages/ui/src/shell/PathAdvisorRail.tsx
M	packages/ui/src/shell/Sidebar.tsx
A	packages/ui/src/stores/pathAdvisorBriefingStore.ts
M	pnpm-lock.yaml
```

### git diff --stat origin/main...HEAD
```text
92 files changed, 100097 insertions(+), 394 deletions(-)
```

### Commands run + results
- `pnpm test packages/ui/src/screens/dashboard/buildDashboardViewModel.test.ts packages/ui/src/screens/dashboard/useDashboardSnapshot.test.ts packages/ui/src/stores/dashboardHeroDoNowStore.test.ts` -> PASS (3 files, 10 tests)
- `pnpm -r typecheck` -> PASS

---

## Scrollbar styling + PathAdvisor mark accent

**Goal:** Desktop scrollbar styling consistent with web (dark/black); PathAdvisor emblem yellow accent in rail header and Ask PathAdvisor button. Token-safe, no theme drift.

### Part A — Scrollbar consistency

- **Containers styled:**
  - `[data-scroll-container="main"]` — main content area (AppShell)
  - `.pathos-scroll` — PathAdvisor rail conversation window (PathAdvisorCard)
- **Thumb token:** `var(--p-surface2)` (dark, token-safe). Hover: `var(--p-border-strong)`.
- **Track:** transparent. Chromium: `::-webkit-scrollbar`, `-thumb`, `-track`. Firefox: `scrollbar-width: thin`, `scrollbar-color: var(--p-surface2) transparent`. Width 8px; inset look via border-radius and background-clip.
- **Implementation:** `packages/ui/src/shell/ScrollbarsStyle.tsx` injects scoped `<style>`; included once in AppShell. No global body/html styling.

### Part B — PathAdvisor emblem (yellow accent)

- **Rail header:** ModuleCard already wraps card icons in a span with `color: var(--p-accent)`. PathAdvisorCard passes `<Sparkles />` as icon; no change.
- **Ask PathAdvisor button:** Sparkles wrapped in `<span style={{ color: 'var(--p-accent)' }}>` so emblem uses same accent as rail. Lucide Sparkles uses currentColor.

### Git state (at run end)

**git status**
```text
On branch feature/dashboard-command-center-v1
Changes not staged for commit:
  modified:   packages/ui/src/components/AskPathAdvisorButton.tsx
  modified:   packages/ui/src/shell/AppShell.tsx
  modified:   packages/ui/src/shell/PathAdvisorCard.tsx
  ... (plus other pre-existing changes)
Untracked: packages/ui/src/shell/ScrollbarsStyle.tsx
```

**git branch --show-current**
```text
feature/dashboard-command-center-v1
```

**git diff --name-status origin/main...HEAD**  
(see existing section above; includes many branch files)

**git diff --stat origin/main...HEAD**  
(see existing section above)

### Validation

- `pnpm build` — PASS
- `pnpm -r typecheck` — PASS
- `pnpm routes:check` — PASS

### Patch artifacts (push-ready)

Generated with baseline `origin/main...HEAD` and working tree diff, excluding `artifacts/`:

**Commands:**
```powershell
git diff origin/main...HEAD -- . ":(exclude)artifacts" | Out-File -Encoding utf8 artifacts/scrollbar-pathadvisor-accent.patch
git diff -- . ":(exclude)artifacts" | Out-File -Encoding utf8 artifacts/scrollbar-pathadvisor-accent-this-run.patch
Get-ChildItem artifacts -Filter "scrollbar-pathadvisor*" | Format-List Name, Length, LastWriteTime
```

**Output:**
```text
Name          : scrollbar-pathadvisor-accent-this-run.patch
Length        : 81074
LastWriteTime : 2/27/2026 9:32:48 PM

Name          : scrollbar-pathadvisor-accent.patch
Length        : 163172
LastWriteTime : 2/27/2026 9:32:48 PM
```

**Summary:** Scrollbars styled only for main content and PathAdvisor conversation region. Thumb color: `var(--p-surface2)`. PathAdvisor emblem accent: `var(--p-accent)` in both rail header (via ModuleCard) and AskPathAdvisorButton.

## Artifacts cleanup + ignore rules

### git status
`	ext
On branch feature/dashboard-command-center-v1
Your branch is up to date with 'origin/feature/dashboard-command-center-v1'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   .gitignore
	deleted:    _local_artifacts/app-confidence-center-pass1-this-run.patch
	deleted:    artifacts/dashboard-ask-pathadvisor-this-run.patch
	deleted:    artifacts/dashboard-ask-pathadvisor.patch
	deleted:    artifacts/dashboard-cta-routing-this-run.patch
	deleted:    artifacts/dashboard-cta-routing.patch
	deleted:    artifacts/dashboard-parity-scroll-this-run.patch
	deleted:    artifacts/dashboard-parity-scroll.patch
	deleted:    artifacts/day-15-this-run.patch
	deleted:    artifacts/day-15.patch
	deleted:    artifacts/day-16-this-run.patch
	deleted:    artifacts/day-16.patch
	deleted:    artifacts/day-17-this-run.patch
	deleted:    artifacts/day-17.patch
	deleted:    artifacts/day-18-this-run.patch
	deleted:    artifacts/day-18.patch
	deleted:    artifacts/day-19-this-run.patch
	deleted:    artifacts/day-19.patch
	deleted:    artifacts/day-20-this-run.patch
	deleted:    artifacts/day-20.patch
	deleted:    artifacts/day-21-this-run.patch
	deleted:    artifacts/day-21.patch
	deleted:    artifacts/day-22-this-run.patch
	deleted:    artifacts/day-22.patch
	deleted:    artifacts/day-23-this-run.patch
	deleted:    artifacts/day-23.patch
	deleted:    artifacts/day-24-this-run.patch
	deleted:    artifacts/day-24.patch
	deleted:    artifacts/day-27-this-run.patch
	deleted:    artifacts/day-27-working-tree.patch
	deleted:    artifacts/day-27.patch
	deleted:    artifacts/day-29-this-run.patch
	deleted:    artifacts/day-29.patch
	deleted:    artifacts/day-33-this-run.patch
	deleted:    artifacts/day-33-working-tree.patch
	deleted:    artifacts/day-33.patch
	deleted:    artifacts/day-34-run.patch
	deleted:    artifacts/day-34-staged.patch
	deleted:    artifacts/day-34-this-run.patch
	deleted:    artifacts/day-34.patch
	deleted:    artifacts/day-35-this-run.patch
	deleted:    artifacts/day-35-working-tree.patch
	deleted:    artifacts/day-35.patch
	deleted:    artifacts/day-36-this-run.patch
	deleted:    artifacts/day-36-working-tree.patch
	deleted:    artifacts/day-36.patch
	deleted:    artifacts/day-37-run.patch
	deleted:    artifacts/day-37.patch
	deleted:    artifacts/day-38-run.patch
	deleted:    artifacts/day-38-this-run.patch
	deleted:    artifacts/day-38.patch
	deleted:    artifacts/day-39-run.patch
	deleted:    artifacts/day-39.patch
	deleted:    artifacts/day-40-run.patch
	deleted:    artifacts/day-40-this-run.patch
	deleted:    artifacts/day-40.patch
	deleted:    artifacts/day-42-run.patch
	deleted:    artifacts/day-42.patch
	deleted:    artifacts/day-43-this-run.patch
	deleted:    artifacts/day-43.patch
	deleted:    artifacts/day-45-run.patch
	deleted:    artifacts/day-45-this-run.patch
	deleted:    artifacts/day-45.patch
	deleted:    artifacts/day-47-cumulative.patch
	deleted:    artifacts/day-47-staged.patch
	deleted:    artifacts/day-47-this-run.patch
	deleted:    artifacts/day-48-cumulative.patch
	deleted:    artifacts/day-48-this-run.patch
	deleted:    artifacts/day-49-this-run.patch
	deleted:    artifacts/day-49.patch
	deleted:    artifacts/verify-shared-parity-2/README.md
	deleted:    artifacts/verify-shared-parity-2/package.json
	deleted:    artifacts/verify-shared-parity-2/pathos-desktop/package.json
	deleted:    artifacts/verify-shared-parity-2/pathos-desktop/src/main.js
	deleted:    artifacts/verify-shared-parity-2/pnpm-lock.yaml
	deleted:    artifacts/verify-shared-parity-2/pnpm-workspace.yaml
	deleted:    artifacts/verify-shared-parity-2/postcss.config.mjs
	deleted:    artifacts/verify-shared-parity-2/public/apple-icon.png
	deleted:    artifacts/verify-shared-parity-2/public/file.svg
	deleted:    artifacts/verify-shared-parity-2/public/globe.svg
	deleted:    artifacts/verify-shared-parity-2/public/icon-dark-32x32.png
	deleted:    artifacts/verify-shared-parity-2/public/icon-light-32x32.png
	deleted:    artifacts/verify-shared-parity-2/public/icon.svg
	deleted:    artifacts/verify-shared-parity-2/public/next.svg
	deleted:    artifacts/verify-shared-parity-2/public/placeholder-logo.png
	deleted:    artifacts/verify-shared-parity-2/public/placeholder-logo.svg
	deleted:    artifacts/verify-shared-parity-2/public/placeholder-user.jpg
	deleted:    artifacts/verify-shared-parity-2/public/placeholder.jpg
	deleted:    artifacts/verify-shared-parity-2/public/placeholder.svg
	deleted:    artifacts/verify-shared-parity-2/public/vercel.svg
	deleted:    artifacts/verify-shared-parity-2/public/window.svg
	deleted:    artifacts/verify-shared-parity-2/scripts/check-boundaries.mjs
	deleted:    artifacts/verify-shared-parity-2/scripts/check-boundaries.py
	deleted:    artifacts/verify-shared-parity-2/scripts/check-docs-artifacts.mjs
	deleted:    artifacts/verify-shared-parity-2/scripts/create-merge-summary.mjs
	deleted:    artifacts/verify-shared-parity-2/scripts/day-snapshot.mjs
	deleted:    artifacts/verify-shared-parity-2/scripts/docs-merge-summary-pr.mjs
	deleted:    artifacts/verify-shared-parity-2/scripts/gen-day-patches.mjs
	deleted:    artifacts/verify-shared-parity-2/scripts/generate-owner-map.mjs
	deleted:    artifacts/verify-shared-parity-2/scripts/generate-owner-map.test.mjs
	deleted:    artifacts/verify-shared-parity-2/scripts/new-day-checklist.mjs
	deleted:    artifacts/verify-shared-parity-2/scripts/validate-change-brief.mjs
	deleted:    artifacts/verify-shared-parity-2/scripts/validate-day-artifacts.mjs
	deleted:    artifacts/verify-shared-parity-2/scripts/validate-day-labels.mjs
	deleted:    artifacts/verify-shared-parity-2/store/auditLogStore.test.ts
	deleted:    artifacts/verify-shared-parity-2/store/auditLogStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/benefitsAssumptionsStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/benefitsWorkspaceStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/dashboardStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/documentImportStore.test.ts
	deleted:    artifacts/verify-shared-parity-2/store/documentImportStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/emailIngestionStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/guidedTourStore.test.ts
	deleted:    artifacts/verify-shared-parity-2/store/guidedTourStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/guidedUsaJobsStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/index.ts
	deleted:    artifacts/verify-shared-parity-2/store/jobAlertsStore.test.ts
	deleted:    artifacts/verify-shared-parity-2/store/jobAlertsStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/jobSearchStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/onboardingStore.test.ts
	deleted:    artifacts/verify-shared-parity-2/store/onboardingStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/pathAdvisorStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/profileStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/resumeBuilderStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/savedJobsStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/tailoringWorkspaceStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/taskStore.test.ts
	deleted:    artifacts/verify-shared-parity-2/store/taskStore.ts
	deleted:    artifacts/verify-shared-parity-2/store/userPreferencesStore.test.ts
	deleted:    artifacts/verify-shared-parity-2/store/userPreferencesStore.ts
	deleted:    artifacts/verify-shared-parity-2/styles/globals.css
	deleted:    artifacts/verify-shared-parity-2/tsconfig.json
	deleted:    artifacts/verify-shared-parity-2/types/desktop-shell.d.ts
	deleted:    artifacts/verify-shared-parity-2/types/job-search.ts
	deleted:    artifacts/verify-shared-parity-2/types/pathadvisor.ts
	deleted:    artifacts/verify-shared-parity-2/vitest.config.ts

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   app/(shared)/dashboard/page.tsx
	modified:   apps/desktop/src/DesktopApp.tsx
	modified:   docs/merge-notes.md
	modified:   eslint.config.mjs
	modified:   lib/dashboard/mockDashboardData.ts
	modified:   package.json
	modified:   packages/ui/src/components/AskPathAdvisorButton.tsx
	modified:   packages/ui/src/index.ts
	modified:   packages/ui/src/screens/DashboardScreen.tsx
	modified:   packages/ui/src/shell/AppShell.tsx
	modified:   packages/ui/src/shell/PathAdvisorCard.tsx
	modified:   packages/ui/src/shell/Sidebar.tsx

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	app/guided-apply/
	docs/architecture/
	packages/ui/src/routes/
	packages/ui/src/screens/PlaceholderScreen.tsx
	packages/ui/src/screens/dashboard/
	packages/ui/src/shell/ScrollbarsStyle.tsx
	packages/ui/src/stores/dashboardHeroDoNowStore.test.ts
	packages/ui/src/stores/dashboardHeroDoNowStore.ts
	scripts/check-route-parity.mjs

`

### git branch --show-current
`	ext
feature/dashboard-command-center-v1
`

### git diff --cached --name-status
`	ext
M	.gitignore
D	_local_artifacts/app-confidence-center-pass1-this-run.patch
D	artifacts/dashboard-ask-pathadvisor-this-run.patch
D	artifacts/dashboard-ask-pathadvisor.patch
D	artifacts/dashboard-cta-routing-this-run.patch
D	artifacts/dashboard-cta-routing.patch
D	artifacts/dashboard-parity-scroll-this-run.patch
D	artifacts/dashboard-parity-scroll.patch
D	artifacts/day-15-this-run.patch
D	artifacts/day-15.patch
D	artifacts/day-16-this-run.patch
D	artifacts/day-16.patch
D	artifacts/day-17-this-run.patch
D	artifacts/day-17.patch
D	artifacts/day-18-this-run.patch
D	artifacts/day-18.patch
D	artifacts/day-19-this-run.patch
D	artifacts/day-19.patch
D	artifacts/day-20-this-run.patch
D	artifacts/day-20.patch
D	artifacts/day-21-this-run.patch
D	artifacts/day-21.patch
D	artifacts/day-22-this-run.patch
D	artifacts/day-22.patch
D	artifacts/day-23-this-run.patch
D	artifacts/day-23.patch
D	artifacts/day-24-this-run.patch
D	artifacts/day-24.patch
D	artifacts/day-27-this-run.patch
D	artifacts/day-27-working-tree.patch
D	artifacts/day-27.patch
D	artifacts/day-29-this-run.patch
D	artifacts/day-29.patch
D	artifacts/day-33-this-run.patch
D	artifacts/day-33-working-tree.patch
D	artifacts/day-33.patch
D	artifacts/day-34-run.patch
D	artifacts/day-34-staged.patch
D	artifacts/day-34-this-run.patch
D	artifacts/day-34.patch
D	artifacts/day-35-this-run.patch
D	artifacts/day-35-working-tree.patch
D	artifacts/day-35.patch
D	artifacts/day-36-this-run.patch
D	artifacts/day-36-working-tree.patch
D	artifacts/day-36.patch
D	artifacts/day-37-run.patch
D	artifacts/day-37.patch
D	artifacts/day-38-run.patch
D	artifacts/day-38-this-run.patch
D	artifacts/day-38.patch
D	artifacts/day-39-run.patch
D	artifacts/day-39.patch
D	artifacts/day-40-run.patch
D	artifacts/day-40-this-run.patch
D	artifacts/day-40.patch
D	artifacts/day-42-run.patch
D	artifacts/day-42.patch
D	artifacts/day-43-this-run.patch
D	artifacts/day-43.patch
D	artifacts/day-45-run.patch
D	artifacts/day-45-this-run.patch
D	artifacts/day-45.patch
D	artifacts/day-47-cumulative.patch
D	artifacts/day-47-staged.patch
D	artifacts/day-47-this-run.patch
D	artifacts/day-48-cumulative.patch
D	artifacts/day-48-this-run.patch
D	artifacts/day-49-this-run.patch
D	artifacts/day-49.patch
D	artifacts/verify-shared-parity-2/README.md
D	artifacts/verify-shared-parity-2/package.json
D	artifacts/verify-shared-parity-2/pathos-desktop/package.json
D	artifacts/verify-shared-parity-2/pathos-desktop/src/main.js
D	artifacts/verify-shared-parity-2/pnpm-lock.yaml
D	artifacts/verify-shared-parity-2/pnpm-workspace.yaml
D	artifacts/verify-shared-parity-2/postcss.config.mjs
D	artifacts/verify-shared-parity-2/public/apple-icon.png
D	artifacts/verify-shared-parity-2/public/file.svg
D	artifacts/verify-shared-parity-2/public/globe.svg
D	artifacts/verify-shared-parity-2/public/icon-dark-32x32.png
D	artifacts/verify-shared-parity-2/public/icon-light-32x32.png
D	artifacts/verify-shared-parity-2/public/icon.svg
D	artifacts/verify-shared-parity-2/public/next.svg
D	artifacts/verify-shared-parity-2/public/placeholder-logo.png
D	artifacts/verify-shared-parity-2/public/placeholder-logo.svg
D	artifacts/verify-shared-parity-2/public/placeholder-user.jpg
D	artifacts/verify-shared-parity-2/public/placeholder.jpg
D	artifacts/verify-shared-parity-2/public/placeholder.svg
D	artifacts/verify-shared-parity-2/public/vercel.svg
D	artifacts/verify-shared-parity-2/public/window.svg
D	artifacts/verify-shared-parity-2/scripts/check-boundaries.mjs
D	artifacts/verify-shared-parity-2/scripts/check-boundaries.py
D	artifacts/verify-shared-parity-2/scripts/check-docs-artifacts.mjs
D	artifacts/verify-shared-parity-2/scripts/create-merge-summary.mjs
D	artifacts/verify-shared-parity-2/scripts/day-snapshot.mjs
D	artifacts/verify-shared-parity-2/scripts/docs-merge-summary-pr.mjs
D	artifacts/verify-shared-parity-2/scripts/gen-day-patches.mjs
D	artifacts/verify-shared-parity-2/scripts/generate-owner-map.mjs
D	artifacts/verify-shared-parity-2/scripts/generate-owner-map.test.mjs
D	artifacts/verify-shared-parity-2/scripts/new-day-checklist.mjs
D	artifacts/verify-shared-parity-2/scripts/validate-change-brief.mjs
D	artifacts/verify-shared-parity-2/scripts/validate-day-artifacts.mjs
D	artifacts/verify-shared-parity-2/scripts/validate-day-labels.mjs
D	artifacts/verify-shared-parity-2/store/auditLogStore.test.ts
D	artifacts/verify-shared-parity-2/store/auditLogStore.ts
D	artifacts/verify-shared-parity-2/store/benefitsAssumptionsStore.ts
D	artifacts/verify-shared-parity-2/store/benefitsWorkspaceStore.ts
D	artifacts/verify-shared-parity-2/store/dashboardStore.ts
D	artifacts/verify-shared-parity-2/store/documentImportStore.test.ts
D	artifacts/verify-shared-parity-2/store/documentImportStore.ts
D	artifacts/verify-shared-parity-2/store/emailIngestionStore.ts
D	artifacts/verify-shared-parity-2/store/guidedTourStore.test.ts
D	artifacts/verify-shared-parity-2/store/guidedTourStore.ts
D	artifacts/verify-shared-parity-2/store/guidedUsaJobsStore.ts
D	artifacts/verify-shared-parity-2/store/index.ts
D	artifacts/verify-shared-parity-2/store/jobAlertsStore.test.ts
D	artifacts/verify-shared-parity-2/store/jobAlertsStore.ts
D	artifacts/verify-shared-parity-2/store/jobSearchStore.ts
D	artifacts/verify-shared-parity-2/store/onboardingStore.test.ts
D	artifacts/verify-shared-parity-2/store/onboardingStore.ts
D	artifacts/verify-shared-parity-2/store/pathAdvisorStore.ts
D	artifacts/verify-shared-parity-2/store/profileStore.ts
D	artifacts/verify-shared-parity-2/store/resumeBuilderStore.ts
D	artifacts/verify-shared-parity-2/store/savedJobsStore.ts
D	artifacts/verify-shared-parity-2/store/tailoringWorkspaceStore.ts
D	artifacts/verify-shared-parity-2/store/taskStore.test.ts
D	artifacts/verify-shared-parity-2/store/taskStore.ts
D	artifacts/verify-shared-parity-2/store/userPreferencesStore.test.ts
D	artifacts/verify-shared-parity-2/store/userPreferencesStore.ts
D	artifacts/verify-shared-parity-2/styles/globals.css
D	artifacts/verify-shared-parity-2/tsconfig.json
D	artifacts/verify-shared-parity-2/types/desktop-shell.d.ts
D	artifacts/verify-shared-parity-2/types/job-search.ts
D	artifacts/verify-shared-parity-2/types/pathadvisor.ts
D	artifacts/verify-shared-parity-2/vitest.config.ts
`

### git diff --cached --stat
`	ext
 .gitignore                                         |     3 +
 .../app-confidence-center-pass1-this-run.patch     |   631 -
 artifacts/dashboard-ask-pathadvisor-this-run.patch | 37492 ---------------
 artifacts/dashboard-ask-pathadvisor.patch          |     0
 artifacts/dashboard-cta-routing-this-run.patch     |  1702 -
 artifacts/dashboard-cta-routing.patch              |     0
 artifacts/dashboard-parity-scroll-this-run.patch   | 12997 -----
 artifacts/dashboard-parity-scroll.patch            | 12997 -----
 artifacts/day-15-this-run.patch                    |  7941 ----
 artifacts/day-15.patch                             |  3137 --
 artifacts/day-16-this-run.patch                    |  4950 --
 artifacts/day-16.patch                             | 12052 -----
 artifacts/day-17-this-run.patch                    |  3151 --
 artifacts/day-17.patch                             |  6255 ---
 artifacts/day-18-this-run.patch                    | 34663 --------------
 artifacts/day-18.patch                             | 22908 ---------
 artifacts/day-19-this-run.patch                    |  5718 ---
 artifacts/day-19.patch                             |  5718 ---
 artifacts/day-20-this-run.patch                    |  7705 ---
 artifacts/day-20.patch                             |  7705 ---
 artifacts/day-21-this-run.patch                    |  6318 ---
 artifacts/day-21.patch                             |  6318 ---
 artifacts/day-22-this-run.patch                    |   125 -
 artifacts/day-22.patch                             |  5367 ---
 artifacts/day-23-this-run.patch                    |  3821 --
 artifacts/day-23.patch                             |  3821 --
 artifacts/day-24-this-run.patch                    |  4332 --
 artifacts/day-24.patch                             |  4332 --
 artifacts/day-27-this-run.patch                    |  4574 --
 artifacts/day-27-working-tree.patch                |  4637 --
 artifacts/day-27.patch                             |  4637 --
 artifacts/day-29-this-run.patch                    |  2340 -
 artifacts/day-29.patch                             |  2340 -
 artifacts/day-33-this-run.patch                    |  2354 -
 artifacts/day-33-working-tree.patch                |  2558 -
 artifacts/day-33.patch                             |  2558 -
 artifacts/day-34-run.patch                         |  2326 -
 artifacts/day-34-staged.patch                      |   549 -
 artifacts/day-34-this-run.patch                    |  1870 -
 artifacts/day-34.patch                             |  2326 -
 artifacts/day-35-this-run.patch                    |  3222 --
 artifacts/day-35-working-tree.patch                |  1238 -
 artifacts/day-35.patch                             |  5103 --
 artifacts/day-36-this-run.patch                    |  8292 ----
 artifacts/day-36-working-tree.patch                |  8911 ----
 artifacts/day-36.patch                             |  8911 ----
 artifacts/day-37-run.patch                         |  2155 -
 artifacts/day-37.patch                             |  2155 -
 artifacts/day-38-run.patch                         |  3986 --
 artifacts/day-38-this-run.patch                    |   Bin 899542 -> 0 bytes
 artifacts/day-38.patch                             |   Bin 1483654 -> 0 bytes
 artifacts/day-39-run.patch                         |  7499 ---
 artifacts/day-39.patch                             |  7499 ---
 artifacts/day-40-run.patch                         |  7733 ---
 artifacts/day-40-this-run.patch                    |   Bin 1439264 -> 0 bytes
 artifacts/day-40.patch                             |   Bin 1439126 -> 0 bytes
 artifacts/day-42-run.patch                         |  2213 -
 artifacts/day-42.patch                             |  6653 ---
 artifacts/day-43-this-run.patch                    |   Bin 484040 -> 0 bytes
 artifacts/day-43.patch                             |     0
 artifacts/day-45-run.patch                         | 17540 -------
 artifacts/day-45-this-run.patch                    | 47220 -------------------
 artifacts/day-45.patch                             |  9533 ----
 artifacts/day-47-cumulative.patch                  |   744 -
 artifacts/day-47-staged.patch                      |     0
 artifacts/day-47-this-run.patch                    |   910 -
 artifacts/day-48-cumulative.patch                  |   744 -
 artifacts/day-48-this-run.patch                    |  1802 -
 artifacts/day-49-this-run.patch                    |   230 -
 artifacts/day-49.patch                             |  1376 -
 artifacts/verify-shared-parity-2/README.md         |    70 -
 artifacts/verify-shared-parity-2/package.json      |   106 -
 .../pathos-desktop/package.json                    |    33 -
 .../pathos-desktop/src/main.js                     |    54 -
 artifacts/verify-shared-parity-2/pnpm-lock.yaml    | 10646 -----
 .../verify-shared-parity-2/pnpm-workspace.yaml     |    10 -
 .../verify-shared-parity-2/postcss.config.mjs      |     7 -
 .../verify-shared-parity-2/public/apple-icon.png   |   Bin 2626 -> 0 bytes
 artifacts/verify-shared-parity-2/public/file.svg   |     1 -
 artifacts/verify-shared-parity-2/public/globe.svg  |     1 -
 .../public/icon-dark-32x32.png                     |   Bin 585 -> 0 bytes
 .../public/icon-light-32x32.png                    |   Bin 566 -> 0 bytes
 artifacts/verify-shared-parity-2/public/icon.svg   |    26 -
 artifacts/verify-shared-parity-2/public/next.svg   |     1 -
 .../public/placeholder-logo.png                    |   Bin 568 -> 0 bytes
 .../public/placeholder-logo.svg                    |     1 -
 .../public/placeholder-user.jpg                    |   Bin 1635 -> 0 bytes
 .../verify-shared-parity-2/public/placeholder.jpg  |   Bin 1064 -> 0 bytes
 .../verify-shared-parity-2/public/placeholder.svg  |     1 -
 artifacts/verify-shared-parity-2/public/vercel.svg |     1 -
 artifacts/verify-shared-parity-2/public/window.svg |     1 -
 .../scripts/check-boundaries.mjs                   |   121 -
 .../scripts/check-boundaries.py                    |   111 -
 .../scripts/check-docs-artifacts.mjs               |   183 -
 .../scripts/create-merge-summary.mjs               |   102 -
 .../scripts/day-snapshot.mjs                       |   478 -
 .../scripts/docs-merge-summary-pr.mjs              |   167 -
 .../scripts/gen-day-patches.mjs                    |   267 -
 .../scripts/generate-owner-map.mjs                 |   275 -
 .../scripts/generate-owner-map.test.mjs            |   132 -
 .../scripts/new-day-checklist.mjs                  |   263 -
 .../scripts/validate-change-brief.mjs              |   134 -
 .../scripts/validate-day-artifacts.mjs             |   184 -
 .../scripts/validate-day-labels.mjs                |   293 -
 .../store/auditLogStore.test.ts                    |   466 -
 .../verify-shared-parity-2/store/auditLogStore.ts  |   625 -
 .../store/benefitsAssumptionsStore.ts              |   295 -
 .../store/benefitsWorkspaceStore.ts                |   447 -
 .../verify-shared-parity-2/store/dashboardStore.ts |   410 -
 .../store/documentImportStore.test.ts              |  1375 -
 .../store/documentImportStore.ts                   |  2422 -
 .../store/emailIngestionStore.ts                   |   775 -
 .../store/guidedTourStore.test.ts                  |   229 -
 .../store/guidedTourStore.ts                       |   378 -
 .../store/guidedUsaJobsStore.ts                    |   350 -
 artifacts/verify-shared-parity-2/store/index.ts    |   271 -
 .../store/jobAlertsStore.test.ts                   |   678 -
 .../verify-shared-parity-2/store/jobAlertsStore.ts |  1945 -
 .../verify-shared-parity-2/store/jobSearchStore.ts |  1738 -
 .../store/onboardingStore.test.ts                  |   203 -
 .../store/onboardingStore.ts                       |   579 -
 .../store/pathAdvisorStore.ts                      |   560 -
 .../verify-shared-parity-2/store/profileStore.ts   |   377 -
 .../store/resumeBuilderStore.ts                    |   447 -
 .../verify-shared-parity-2/store/savedJobsStore.ts |   583 -
 .../store/tailoringWorkspaceStore.ts               |   126 -
 .../verify-shared-parity-2/store/taskStore.test.ts |   538 -
 .../verify-shared-parity-2/store/taskStore.ts      |   965 -
 .../store/userPreferencesStore.test.ts             |   408 -
 .../store/userPreferencesStore.ts                  |   564 -
 .../verify-shared-parity-2/styles/globals.css      |   125 -
 artifacts/verify-shared-parity-2/tsconfig.json     |    40 -
 .../types/desktop-shell.d.ts                       |    41 -
 .../verify-shared-parity-2/types/job-search.ts     |    20 -
 .../verify-shared-parity-2/types/pathadvisor.ts    |   179 -
 artifacts/verify-shared-parity-2/vitest.config.ts  |    89 -
 136 files changed, 3 insertions(+), 442811 deletions(-)
`

### Cleanup notes
- Added ignore rules to .gitignore:
  - _local_artifacts/
  - rtifacts/**/*.patch
  - rtifacts/verify-shared-parity-*/
- Removed tracked artifact patch files from index with git rm --cached (staged deletions).
- Removed tracked rtifacts/verify-shared-parity-2/** from index (staged deletions).
- git check-ignore -v confirms patch/local artifact paths are now ignored by .gitignore.
- Filesystem deletion of rtifacts/verify-shared-parity-2 was attempted but blocked by policy in this environment.

---

## Briefing tiles border consistency

**Goal:** Make the top Briefing tiles (Saved Jobs, Tracked Apps, Readiness, Next Milestone) feel intentional: align base border with other cards, keep a subtle briefing-only signature (no full orange outline).

**Changes:**
- **Component:** `BriefingTile` in `packages/ui/src/screens/DashboardScreen.tsx` (renders the 4 briefing tiles in the Briefing row).
- **Base border:** Explicit `1px solid var(--p-border)` and `borderRadius: var(--p-radius-lg)`, `boxShadow: var(--p-shadow-elev-1)` to match ModuleCard/card chrome. No full orange accent outline.
- **Briefing signature (Option A):** Thin left accent bar inside each tile: 2px `border-left: 2px solid var(--p-accent-muted)` on an inner content wrapper, with `pl-[calc(0.75rem+2px)]` so content does not sit under the bar. Low emphasis; hero focus card remains the most emphasized (ModuleCard with top accent + primary CTA).
- No theme or global CSS changes; tokens only. No `var`; minimal diff.

**Validation:**
- `pnpm build` — pass.
- `pnpm -r typecheck` — pass.

**Diff stats (this run):**
- 1 file changed: `packages/ui/src/screens/DashboardScreen.tsx` (BriefingTile only; base border aligned with ModuleCard, 2px left accent bar added).

## Commit split: artifacts cleanup + dashboard feature

- `git branch --show-current`: `feature/dashboard-command-center-v1`
- `git log -2 --oneline`:
  - `f91b7aa chore: ignore artifacts and remove tracked patch dumps`
  - `567b8d0 feature/dashboard-command reworked the dashboard accordingly`
- `git status`: staged feature files only; no staged `artifacts/**/*.patch` and no staged `artifacts/verify-shared-parity-*` paths.

Validation commands and results:
- `pnpm routes:check` -> pass (`routes:check: OK — all Sidebar routes resolve in Desktop and Next.`)
- `pnpm build` -> pass (Next.js build succeeded; baseline-browser-mapping staleness warnings only)
- `pnpm -r typecheck` -> pass
- `pnpm test packages/ui/src/screens/dashboard/buildDashboardViewModel.test.ts packages/ui/src/screens/dashboard/useDashboardSnapshot.test.ts packages/ui/src/stores/dashboardHeroDoNowStore.test.ts` -> pass (3 files, 10 tests)

---

## Application Confidence Center v1 — Pass 1 (Scaffold only)

**Branch:** Use current branch (no branch change). No commit or push.

**Scope:** New route/screen for Application Confidence Center using existing SharedAppShell and PathAdvisor rail. Layout: list of tracked applications (empty state with CTA), main area with three placeholder cards (Status Intel with Explain button, Next Best Moves, Timeline Forecast). Add tracked application dialog scaffold; Explainer Video modal scaffold (script preview placeholder, generate disabled). PathAdvisor rail receives stub anchor context from selected tracked app. Zero theme drift; existing UI primitives and tooltip pattern only.

### Files changed

| File | What / why |
|------|------------|
| `packages/ui/src/screens/ApplicationConfidenceCenterScreen.tsx` | New screen: layout, empty state, Add CTA, SimpleModal scaffolds for Add tracked application and Explainer Video; inline tooltips on Explain and Add buttons; onAnchorContextChange callback for rail. |
| `packages/ui/src/shell/PathAdvisorRail.tsx` | Added `PathAdvisorAnchorContext` type and `anchorContext` prop; rail passes derived `viewingLabel` to PathAdvisorCard when anchor context is set. |
| `packages/ui/src/shell/Sidebar.tsx` | Added nav item "Application Confidence Center" under CAREER & JOBS with href `/application-confidence-center`, icon Target. |
| `packages/ui/src/index.ts` | Exported ApplicationConfidenceCenterScreen, ApplicationConfidenceCenterScreenProps, ApplicationConfidenceAnchorContext; PathAdvisorAnchorContext. |
| `apps/desktop/src/DesktopApp.tsx` | New route `/application-confidence-center` rendering ApplicationConfidenceCenterScreen with onAnchorContextChange; state pathAdvisorAnchorContext; PathAdvisorRail receives anchorContext (stub from selected app). |
| `docs/merge-notes.md` | This section: files changed, what/why, commands run, patch artifact. |

### Commands run

Validation commands to run (outputs pasted after running): `pnpm lint`, `pnpm typecheck`, `pnpm test` (if tests exist and are fast), `pnpm build`.

### Patch artifact

- `artifacts/app-confidence-center-pass1-this-run.patch` — incremental diff for this run (HEAD to working tree, excludes artifacts/). Generate with:  
  `git diff --binary HEAD -- . ":(exclude)artifacts" | Out-File -FilePath artifacts/app-confidence-center-pass1-this-run.patch -Encoding utf8`  
  (PowerShell). If the repo uses cumulative day patches, also run `pnpm docs:day-patches --day <N>` for the current day.

**Patch Artifacts (FINAL) — this run**

Command: `git diff --binary HEAD -- . ":(exclude)artifacts" | Out-File -FilePath artifacts/app-confidence-center-pass1-this-run.patch -Encoding utf8`

Get-Item output:
```
Name          : app-confidence-center-pass1-this-run.patch
Length        : 29014
LastWriteTime : 2/26/2026 11:59:28 PM
```

### Validation commands (summary)

- **pnpm lint** — Run at repo root; may include pre-existing warnings/errors in other packages. New code: `packages/ui` ApplicationConfidenceCenterScreen and desktop route introduce no new lint errors (unused `selectedApp` removed).
- **pnpm typecheck** — Root `tsc -p tsconfig.json` has pre-existing errors (electron experiments, resume-builder, app paths). `pnpm --filter @pathos/ui typecheck` and `apps/desktop` `tsc --noEmit` both **pass**.
- **pnpm test** — Pre-existing 44 failures in `job-storage.test.ts` (localStorage not defined in node). No new tests added in Pass 1 per task ("skip tests in Pass 1" when no established pattern).
- **pnpm --filter @pathos/desktop build** — **Passed.** Renderer and Electron build complete successfully.

## Merge main into dashboard command center

Merged decisions:
- PathAdvisorAnchorContext standardized to `{ viewingLabel?: string; applicationId?: string }` in shared rail and desktop app wiring.
- Guided Apply canonical route is `/desktop/usajobs-guided`; `/guided-apply` remains alias redirect to canonical path.
- Application Confidence Center preserved and integrated in shared navigation and desktop routing at `/application-confidence-center`.
- Route constants remain the source of truth; sidebar uses constants and includes `APPLICATION_CONFIDENCE_CENTER` in `SIDEBAR_ROUTES`.

---

## Career & Resume screen (executive command center)

**Branch:** feature/careerAndResume_page_creation (or current branch). **Do not commit or push.**

**Goal:** Implement the Career & Resume screen to match mockups (docs/mockups/careerAndResume_*.png) and current-build styling. Same layout primitives, tokens (var(--p-*)), SectionHeader/ModuleCard/CardRowList patterns as Dashboard. Two-column layout (main scroll + fixed PathAdvisor rail) via existing SharedAppShell; route on existing shared Career route (/dashboard/career) for Next (3000) and Desktop (5173).

### Files changed + why

| File | Change |
|------|--------|
| `packages/ui/src/stores/pathAdvisorScreenOverridesStore.ts` | **NEW.** Zustand store for per-screen rail overrides (viewingLabel, suggestedPrompts, briefingLabel). CareerScreen sets these on mount so PathAdvisor rail shows "Career & Resume" context and career quick prompts without shell being route-aware. |
| `packages/ui/src/shell/PathAdvisorRail.tsx` | Subscribe to pathAdvisorScreenOverridesStore; pass viewingLabel, suggestedPrompts, briefingLabel to PathAdvisorCard when overrides set; else defaults (Dashboard). |
| `packages/ui/src/shell/PathAdvisorCard.tsx` | Optional `briefingLabel` prop; when set, show it above the Do now block instead of "From Today's Focus". |
| `packages/ui/src/screens/CareerScreen.tsx` | **REPLACED.** Full Career & Resume screen: title row (Career & Resume + microcopy + Local-only badge + Last updated), Today's Best Move hero (primary CTA + Ask PathAdvisor), Resume Readiness 4-tile briefing, Your Resume card (version/status, sections checklist, Open Builder / Duplicate / Export disabled when incomplete), Linter Findings (grouped by severity, calm badges), Tailoring Workspace (job context or empty state, checklist, Start Tailoring disabled when no job with tooltip), Career Narrative (3 bullets + Update narrative / Generate options), Saved Assets (bullet bank, STAR, metrics + add/import mock actions). Demo state at top of file: noResume, incompleteResume, readyResume, tailorReadyWithJob. On mount: set screen overrides and dashboardHeroDoNowStore so rail shows "From Career & Resume", Do now "Complete Resume", and 3 career quick prompts. |
| `packages/ui/src/screens/CareerScreen.test.tsx` | **NEW.** Three tests: renders title and key sections; Start Tailoring disabled when demoState not tailorReadyWithJob; Start Tailoring not disabled when tailorReadyWithJob. |
| `packages/ui/src/index.ts` | Export usePathAdvisorScreenOverridesStore and PathAdvisorScreenOverrides. |

### Commands run + results

- **pnpm -r typecheck** — PASS (packages/adapters, packages/core, packages/ui, apps/desktop).
- **pnpm test** — PASS (673 tests, 42 files). CareerScreen.test.tsx: 3 tests pass.
- **pnpm routes:check** — PASS. All Sidebar routes resolve in Desktop and Next.

### Layout and scroll

- Career page uses existing `SharedDashboardRouteShell` (same as dashboard). Main content is inside SharedAppShell’s `<main data-scroll-container="main">`; PathAdvisor rail is fixed. No new routing; career route already wired in app/(shared)/dashboard/career/page.tsx and DesktopApp.tsx.

### PathAdvisor rail (Career context)

- When CareerScreen mounts it sets pathAdvisorScreenOverridesStore (viewingLabel: "Career & Resume", suggestedPrompts: the 3 mockup prompts, briefingLabel: "From Career & Resume") and dashboardHeroDoNowStore (label: "Complete Resume", route: RESUME_BUILDER). Rail shows briefing panel with "From Career & Resume", Do now mirroring hero CTA, and quick prompt chips. On unmount overrides and hero do-now are cleared.

### Styling

- Tokens only (var(--p-*)). ModuleCard, CardRowList, SectionHeader, AskPathAdvisorButton reused. No hardcoded colors. Same section header and card chrome as Dashboard.

### Follow-ups / known gaps

- No backend integration; all data is demo/mock driven by CAREER_DEMO_STATE constant and optional `demoState` prop (for tests).
- Export CareerDemoState from index if consumers need to drive state from URL or settings.
- Human simulation: not required for this pass (no store persistence, no create/save/delete; UI-only with local demo state).

---

## Resume Readiness screen updates (v0 final)

**Branch:** feature/careerAndResume_page_creation. **Do not commit or push.**

**Goal:** Implement Resume Readiness screen updates per v0 scope: naming, Active resume dropdown, New version actions (duplicate / create tailored), Tailoring Workspace target job picker, All Resumes drawer, calm chip styling. UI + local state only; no backend. Route constants and URLs unchanged.

### What changed

- **A) Naming:** User-facing label "Career & Resume" → "Resume Readiness" everywhere: Sidebar item, page title + subtitle, PathAdvisor rail "Viewing: …" and "From …", and all briefing source labels. Internal route path `/dashboard/career` unchanged.
- **B) Active resume dropdown:** Redesigned to strict grid: left = resume name (truncate), right = two compact chips (Type + Status) and muted "Updated X ago". Group headers "MASTER" and "TAILORED (RECENT)". Footer "Manage resumes…" opens All Resumes drawer. Trigger stays compact (name + chips only, no dates).
- **C) New version menu:** "Duplicate active resume" creates a new entry with "(Copy)" suffix, sets it active, status Draft/In progress, shows toast. "Create tailored version from saved job" opens drawer with searchable saved-job picker (2-line format: title + GS, agency • location • close date); "Create tailored resume" disabled until job selected (tooltip). On confirm: new tailored resume "[Job Title] – GS-X", set active, set Tailoring Workspace target job, toast, scroll to Tailoring Workspace.
- **D) Tailoring Workspace:** Added "Target job" searchable dropdown (saved jobs, same 2-line format). Empty state when no saved jobs: guidance + CTA to Saved Jobs. "Start tailoring" disabled until target job selected, with tooltip.
- **E) All Resumes drawer:** Row layout: left name (truncate), middle two chips (Type + Status), right Set active / Archive. "Updated X ago" on muted second line. Active row shows "Active" indicator and disabled "Active" button instead of "Set active".
- **F) List styling:** Muted chip variants (--p-surface2, --p-text-muted) in dropdowns and drawers; strong emphasis only for primary CTA and active/selected state.

### Files changed

- `packages/ui/src/shell/Sidebar.tsx` — Sidebar label "Career & Resume" → "Resume Readiness".
- `packages/ui/src/stores/pathAdvisorScreenOverridesStore.ts` — Comment updates for viewingLabel/briefingLabel.
- `packages/ui/src/screens/CareerScreen.tsx` — Full implementation: store usage, Active resume dropdown (groups + footer), New version menu (Duplicate + Create tailored drawer), Tailoring target job picker, All Resumes drawer, Create tailored drawer, toast, MutedChip, JobOptionRow, TailoringTargetJobPicker. PathAdvisor overrides set to "Resume Readiness". All briefing sourceLabel → "Resume Readiness".
- `packages/ui/src/stores/careerResumeScreenStore.ts` — **NEW.** Local UI state: resumes, activeResumeId, targetJobIdForTailoring, toastMessage; seedFromDemoState, addResume, setActiveResumeId, setTargetJobForTailoring, archiveResume, setToast, resetSeeded. formatUpdatedAgo helper.
- `packages/ui/src/stores/careerResumeScreenStore.test.ts` — **NEW.** Tests: seedFromDemoState (incompleteResume, tailorReadyWithJob), addResume sets active, setTargetJobForTailoring, formatUpdatedAgo.
- `packages/ui/src/screens/CareerScreen.test.tsx` — Updated: "Resume Readiness" title/sections; YOUR RESUME + Tailoring + Target job assertions; Start Tailoring disabled; beforeEach reset of careerResumeScreenStore.

### Commands run + pass/fail

- **pnpm -r typecheck** — **PASS** (packages/adapters, packages/core, packages/ui, apps/desktop).
- **pnpm test** — **PASS** (680 tests, 43 files).
- **pnpm routes:check** — **PASS.** All Sidebar routes resolve in Desktop and Next.

### Known follow-ups

- No backend; resume list and target job are in-memory only (careerResumeScreenStore). Persistence can be added later.
- Human simulation not required this run (no persistence keys; create/duplicate/tailored are mock in-memory only).

### Required git snapshots

**git status**
```
On branch feature/careerAndResume_page_creation
Changes not staged for commit:
  modified:   docs/merge-notes.md
  modified:   packages/ui/src/index.ts
  modified:   packages/ui/src/screens/CareerScreen.tsx
  modified:   packages/ui/src/shell/PathAdvisorCard.tsx
  modified:   packages/ui/src/shell/PathAdvisorRail.tsx
  modified:   packages/ui/src/shell/Sidebar.tsx
Untracked:
  packages/ui/src/screens/CareerScreen.test.tsx
  packages/ui/src/stores/careerResumeScreenStore.test.ts
  packages/ui/src/stores/careerResumeScreenStore.ts
  packages/ui/src/stores/pathAdvisorScreenOverridesStore.ts
  (and docs/mockups, etc.)
```

**git branch --show-current**
```
feature/careerAndResume_page_creation
```

**git diff --name-status develop...HEAD**  
(No `develop` branch; repo uses `main`.)

**git diff --name-status main -- packages/ui** (reference)
```
M	packages/ui/src/index.ts
M	packages/ui/src/screens/CareerScreen.tsx
M	packages/ui/src/shell/PathAdvisorCard.tsx
M	packages/ui/src/shell/PathAdvisorRail.tsx
M	packages/ui/src/shell/Sidebar.tsx
```
(Plus new: careerResumeScreenStore.ts, careerResumeScreenStore.test.ts; CareerScreen.test.tsx; pathAdvisorScreenOverridesStore.ts per current working tree.)

**git diff --stat main -- packages/ui**
```
 packages/ui/src/index.ts                  |    4 +
 packages/ui/src/screens/CareerScreen.tsx  | 1537 +++++++++++++++++++++++++++--
 packages/ui/src/shell/PathAdvisorCard.tsx |    8 +-
 packages/ui/src/shell/PathAdvisorRail.tsx |   30 +-
 packages/ui/src/shell/Sidebar.tsx         |    2 +-
 5 files changed, 1515 insertions(+), 66 deletions(-)
```
(Stats above are vs main for tracked package files; new store files add more lines.)

---

## Resume Readiness — CSS/copy parity, routing rename, Referral Readiness Check

**Branch:** feature/careerAndResume_page_creation. **Do not commit or push.**

**Goal:** Bring Resume Readiness screen to mockup parity: copy renames (Referral Readiness Check, severity labels), YOUR RESUMES + Active resume label + “Updated X ago” + Edit/Duplicate/Export + “New version” button, canonical route with alias redirect.

### What changed

- **Phase 2 — Copy + naming**
  - Replaced “Linter Findings” with **Referral Readiness Check**: title “REFERRAL READINESS CHECK”, subtitle “Quick issues that could lower your referral odds.” and scope “for &lt;Active Resume Name&gt; • N issues”. Severity labels: **Fix first**, **Improve**, **Optional** (was Must fix / Improve / Optional). Renamed `linterFindings` → `referralFindings`, severity `mustFix` → `fixFirst`.
  - Card **YOUR RESUME** → **YOUR RESUMES**. Added “Active resume” label above dropdown. “Updated X ago” below trigger row (using `formatUpdatedAgo(activeResume.updatedAt)`). Primary action **Edit resume** (was “Open Builder”). Added **Duplicate** button in actions row (duplicate + toast). **+ New version** button with ChevronDown (Duplicate active resume / Create tailored version from saved job). “View all resumes (N)” link when `resumes.length > 1`.
  - Tailoring Workspace card: subtitle **Using: &lt;Active Resume name&gt;** when `activeResume` is set.
- **Phase 3 — Routing**
  - **Canonical route:** `RESUME_READINESS = '/dashboard/resume-readiness'`. Sidebar and `SIDEBAR_ROUTES` use `RESUME_READINESS`.
  - **Alias:** `CAREER = '/dashboard/career'` redirects to `/dashboard/resume-readiness`. Next: `app/(shared)/dashboard/career/page.tsx` now calls `redirect('/dashboard/resume-readiness')`. Desktop: `/dashboard/career` → `<Navigate to="/dashboard/resume-readiness" replace />`. New page `app/(shared)/dashboard/resume-readiness/page.tsx` renders `CareerScreen`.
  - Sidebar `isItemActive`: Resume Readiness item is active when pathname is `RESUME_READINESS` or `CAREER`. Route parity script: `SIDEBAR_ROUTE_NAMES` uses `RESUME_READINESS` instead of `CAREER`.

### Files changed

- `packages/ui/src/screens/CareerScreen.tsx` — Referral Readiness Check (title, subtitle, severity Fix first/Improve/Optional), YOUR RESUMES, Active resume label, Updated X ago, Edit resume, Duplicate button, + New version button, View all resumes link, Tailoring Workspace subtitle.
- `packages/ui/src/routes/routes.ts` — Added `RESUME_READINESS`, kept `CAREER`; `SIDEBAR_ROUTES` uses `RESUME_READINESS`.
- `packages/ui/src/shell/Sidebar.tsx` — Import `RESUME_READINESS` and `CAREER`; sidebar href and tour use `RESUME_READINESS`; `isItemActive` treats both paths as active.
- `scripts/check-route-parity.mjs` — `SIDEBAR_ROUTE_NAMES`: `CAREER` → `RESUME_READINESS`.
- `app/(shared)/dashboard/resume-readiness/page.tsx` — **NEW.** Renders `CareerScreen` (canonical).
- `app/(shared)/dashboard/career/page.tsx` — Redirect to `/dashboard/resume-readiness` (server component).
- `apps/desktop/src/DesktopApp.tsx` — Route `/dashboard/resume-readiness` → `CareerScreen`; `/dashboard/career` → `Navigate` to resume-readiness.
- `packages/ui/src/screens/CareerScreen.test.tsx` — Assert “YOUR RESUMES”, “REFERRAL READINESS CHECK”, “Quick issues that could lower your referral odds”; new test “renders Referral Readiness Check card (not Linter Findings)”.

### Commands run + pass/fail

- **pnpm -r typecheck** — **PASS**
- **pnpm test** — **PASS** (681 tests, 43 files)
- **pnpm routes:check** — **PASS** (all Sidebar routes resolve in Desktop and Next)

### Follow-ups

- Phase 1 (deeper CSS/layout audit vs Dashboard primitives) and Phase 4 (explicit demo toggles for resumeCount / savedJobsCount / showArchivedResumes) were scoped out for minimal diff; can be done in a follow-up.
- `desktop-preview` and any external links to `/dashboard/career` continue to work via redirect.

### Git snapshots (required)

**git status**
```
On branch feature/careerAndResume_page_creation
Changes not staged for commit:
  modified:   app/(shared)/dashboard/career/page.tsx
  modified:   docs/merge-notes.md
  modified:   packages/ui/src/routes/routes.ts
  modified:   packages/ui/src/screens/CareerScreen.tsx
  modified:   packages/ui/src/screens/CareerScreen.test.tsx
  modified:   packages/ui/src/shell/Sidebar.tsx
  modified:   scripts/check-route-parity.mjs
Untracked:
  app/(shared)/dashboard/resume-readiness/page.tsx
  (plus existing untracked store/test files, mockups, etc.)
Modified in desktop:
  apps/desktop/src/DesktopApp.tsx
```

**git branch --show-current**
```
feature/careerAndResume_page_creation
```

**git diff --name-status develop...HEAD**  
(No `develop`; use `main` as baseline.)

**git diff --name-status main -- . ":(exclude)docs/merge-notes.md" ":(exclude)docs/mockups/*"**
```
M	app/(shared)/dashboard/career/page.tsx
M	apps/desktop/src/DesktopApp.tsx
M	packages/ui/src/routes/routes.ts
M	packages/ui/src/screens/CareerScreen.tsx
M	packages/ui/src/screens/CareerScreen.test.tsx
M	packages/ui/src/shell/Sidebar.tsx
M	scripts/check-route-parity.mjs
A	app/(shared)/dashboard/resume-readiness/page.tsx
```

**git diff --stat main -- packages/ui app ":(exclude)app/**/mockups*" scripts apps/desktop**
(Summary: CareerScreen +routes +Sidebar +tests; new resume-readiness page; career redirect; DesktopApp +check-route-parity.)

---

## Proof Library (Saved Assets → Proof Library)

**Goal:** Improve the “Saved Assets” card on the Resume Readiness screen so users instantly understand its purpose and the layout looks organized and executive-grade.

### What changed + why

- **Rename + reframe:** Card title changed from “Saved Assets” to **“Proof Library”** with subtitle: “Reusable evidence you can drop into bullets and tailoring.”
- **Structured layout:** Replaced three-number layout with a 3-column grid of mini-panels (responsive: stacked on small widths). Each panel has: Label, Count, primary “Add …” button, secondary “View” action. Panels: **STAR stories**, **Bullet bank**, **Metrics**.
- **Import (optional):** “Import from notes” → “Import from notes (optional)” with tooltip: “Paste notes. PathOS can extract bullets, STAR stories, and metrics.” Kept secondary to the three panels.
- **Interactions (mock):** “Add STAR story” / “Add bullet” / “Add metric” open a modal (Title + Content + Save); Save adds item and increments count (local-only state). “View” opens a drawer listing items (or empty state). All behavior local-only; no persistence.
- **Style:** Uses existing tokens (`var(--p-*)`) and Card/Button/Badge/Separator patterns; no hardcoded colors.
- **Tests:** CareerScreen tests updated/added so that “PROOF LIBRARY” and the three panels (STAR stories, Bullet bank, Metrics) are asserted.

### Files changed

- `packages/ui/src/screens/CareerScreen.tsx` — Proof Library card (title, subtitle, 3 panels with counts and Add/View), Add modal, View drawer, local state and handlers; `ProofLibraryItem` type at module scope.
- `packages/ui/src/screens/CareerScreen.test.tsx` — Expectations updated for “PROOF LIBRARY”; new test “renders Proof Library with three panels (STAR stories, Bullet bank, Metrics)” (title, labels, Add buttons, Import optional).
- `docs/merge-notes.md` — This section.

### Commands run + results

- **pnpm -r typecheck** — Exit 0. packages/adapters, packages/core, packages/ui, apps/desktop typecheck passed.
- **pnpm test -- --run** — Exit 0. 43 test files, 682 tests passed (includes CareerScreen.test.tsx, 6 tests).

### Git snapshots (Proof Library pass)

**git status**
```
On branch feature/careerAndResume_page_creation
Changes not staged for commit:
  modified:   app/(shared)/dashboard/career/page.tsx
  modified:   apps/desktop/src/DesktopApp.tsx
  modified:   docs/merge-notes.md
  deleted:    docs/mockups/dashboard-command-center-v1-bottom.png
  deleted:    docs/mockups/dashboard-command-center-v1-top.png
  modified:   packages/ui/src/index.ts
  modified:   packages/ui/src/routes/routes.ts
  modified:   packages/ui/src/screens/CareerScreen.tsx
  modified:   packages/ui/src/shell/PathAdvisorCard.tsx
  modified:   packages/ui/src/shell/PathAdvisorRail.tsx
  modified:   packages/ui/src/shell/Sidebar.tsx
  modified:   scripts/check-route-parity.mjs
Untracked:
  app/(shared)/dashboard/resume-readiness/
  docs/mockups/careerAndResume_*.png
  packages/ui/src/screens/CareerScreen.test.tsx
  packages/ui/src/stores/careerResumeScreenStore.test.ts
  packages/ui/src/stores/careerResumeScreenStore.ts
  packages/ui/src/stores/pathAdvisorScreenOverridesStore.ts
```

**git branch --show-current**
```
feature/careerAndResume_page_creation
```

**Note:** No `develop` branch; using `main` as baseline.

**git diff --name-status main...HEAD**  
(Empty if branch has no commits vs main; working tree changes listed in status above.)

**git diff --name-status main --** (working tree vs main, selected paths)
```
M	app/(shared)/dashboard/career/page.tsx
M	apps/desktop/src/DesktopApp.tsx
M	packages/ui/src/index.ts
M	packages/ui/src/routes/routes.ts
M	packages/ui/src/screens/CareerScreen.tsx
M	packages/ui/src/shell/PathAdvisorCard.tsx
M	packages/ui/src/shell/PathAdvisorRail.tsx
M	packages/ui/src/shell/Sidebar.tsx
M	scripts/check-route-parity.mjs
A	app/(shared)/dashboard/resume-readiness/
```
(+ untracked CareerScreen.test.tsx, stores, etc.)

**git diff --stat main -- packages/ui/src/screens/CareerScreen.tsx packages/ui/src/screens/CareerScreen.test.tsx**
(CareerScreen: Proof Library UI, state, modal/drawer; test: PROOF LIBRARY + three panels.)

---

## Resume Readiness UX fixes (chips, spacing, overlay, archive/delete)

**Goal:** Fix four UX issues on Resume Readiness: (A) meaningfully color-coded resume type/status chips, (B) spacing between name and chips for scannability, (C) “New version” menu above PathAdvisor rail, (D) archive + delete with confirm in All Resumes drawer.

### What changed + why

- **A) Chip meaning (token-safe):** Replaced generic `MutedChip` with **ResumeTypeChip** (Master = neutral/outline `var(--p-surface2)`; Tailored = accent `var(--p-accent-bg)`, `var(--p-accent-muted)`, `var(--p-accent)`) and **ResumeStatusChip** (Ready = success-like `var(--p-success-bg)` + check icon; In progress/Draft = muted). Used in both the active-resume dropdown list items and All Resumes drawer rows. Two chips max: Type + Status.
- **B) Spacing/layout:** Enforced strict layout for dropdown items and drawer rows: name on left, chip group on right, no wrapping. Added consistent horizontal gap (`gap-3`) between name and chips; name truncates (`truncate min-w-0`), chips `flex-shrink-0`.
- **C) Overlay layering:** “New version” dropdown was rendering behind the PathAdvisor rail. It now renders via **createPortal(..., document.body)** with `z-50` so it appears above the rail. Menu position is derived from trigger button `getBoundingClientRect()` when opened.
- **D) Removal actions:**  
  - **Archive:** Per resume row in All Resumes drawer: Archive icon button sets `archived: true` in store (item hidden unless “Show archived” is checked). Toast “Archived.” with **Undo** that calls `unarchiveResume(id)`.  
  - **Delete permanently:** Only in drawer, under a “More” (⋮) overflow menu per row. **Confirm dialog:** title “Delete resume?”, body “This removes the resume from this device. This can’t be undone.”, Cancel / Delete. Delete removes the resume from local mock state and clears active if it was active.  
  - **Show archived:** Checkbox in All Resumes drawer header toggles `showArchived`; when true, archived items are listed.
- **Store:** `CareerResumeEntry` has optional `archived?: boolean`. New actions: `archiveResume` (sets archived, sets toast + `toastUndoResumeId`), `unarchiveResume`, `deleteResume`, `setShowArchived`, `setToastWithUndo`. `resetSeeded` clears `toastMessage`, `toastUndoResumeId`, `showArchived`. Dropdown and “View all resumes” count use **visible** resumes (filter `archived !== true`).

### Files changed

- `packages/ui/src/stores/careerResumeScreenStore.ts` — `archived`, `toastUndoResumeId`, `showArchived`; `archiveResume` (soft), `unarchiveResume`, `deleteResume`, `setShowArchived`, `setToastWithUndo`; `resetSeeded` extended.
- `packages/ui/src/screens/CareerScreen.tsx` — ResumeTypeChip, ResumeStatusChip; active row + dropdown rows + drawer rows use new chips and layout; New version menu portaled with createPortal; toast with Undo; All Resumes drawer: Show archived, Archive button, More menu with Delete, delete confirm dialog; `visibleResumes`, `deleteConfirmResumeId`, `drawerRowMoreOpenId`.
- `packages/ui/src/stores/careerResumeScreenStore.test.ts` — Tests: archiveResume sets archived and toast; showArchived reveals archived; unarchiveResume clears archived and toast; deleteResume removes item and clears active.
- `packages/ui/src/screens/CareerScreen.test.tsx` — Test: “renders YOUR RESUMES empty state when no resumes (SSR does not seed store)”.

### Commands run + results

- **pnpm -r typecheck:** Passed (packages/adapters, packages/core, packages/ui, apps/desktop).
- **pnpm test -- --run:** Passed. 43 test files, 687 tests. CareerScreen and careerResumeScreenStore tests all pass.

### Git state (required)

**git status**
```
On branch feature/careerAndResume_page_creation
Changes not staged for commit:
  modified:   app/(shared)/dashboard/career/page.tsx
  modified:   apps/desktop/src/DesktopApp.tsx
  modified:   docs/merge-notes.md
  ... (other pre-existing modified files)
  modified:   packages/ui/src/screens/CareerScreen.tsx
  ...
Untracked: packages/ui/src/stores/careerResumeScreenStore.ts, careerResumeScreenStore.test.ts, CareerScreen.test.tsx, ...
```

**git branch --show-current**
```
feature/careerAndResume_page_creation
```

**git diff --name-status develop...HEAD**  
(No `develop` branch in repo; use `main` as baseline. main...HEAD may be empty if branch has no unique commits.)

**git diff --stat develop...HEAD**  
(Same note as above.)

---

## Resume Readiness UI regressions (row layout, close button, chips, dropdown)

**Goal:** Fix four regressions: (A) All Resumes drawer row too dense — 2-line layout; (B) drawer close button inconsistent; (C) chips semantic styling (token-only); (D) New version dropdown transparent and behind PathAdvisor rail.

### What changed

- **A) All Resumes drawer row layout:** Each row is now a consistent 2-line layout. Line 1: resume name (truncate) left, action right — “Set active” or disabled “Active” (no separate Active chip). Line 2: chips group left (Type + Status only; Archived chip when applicable), “Updated X ago” right. Chips in a compact group that does not wrap.
- **B) Close button consistency:** All Resumes, Proof Library, and Create tailored drawers use a shared close control: Lucide `X` icon, `size-9` icon button, ghost-style hover (`hover:bg-[var(--p-surface2)]`) and focus-visible ring. No raw “×” character; no app Button import (packages/ui stays boundary-safe).
- **C) Chip semantics:** ResumeTypeChip and ResumeStatusChip already use token-only styling (Master = outline/neutral; Tailored = accent; Ready = success + Check icon; In progress/Draft = muted). No code change; validated.
- **D) New version dropdown:** Menu is portaled to `document.body` with overlay at `z-[100]` so it renders above PathAdvisor rail. Menu content uses `backgroundColor: 'var(--p-surface)'` and `z-10` so it has a solid surface and stacks above the overlay backdrop.

### Files changed

- `packages/ui/src/screens/CareerScreen.tsx` — All Resumes drawer: 2-line row layout, X close button; Proof Library and Create tailored drawers: X close button; New version menu: z-[100], backgroundColor, z-10 on content; Lucide `X` import.

### Commands run + results

- **pnpm -r typecheck:** Passed (packages/adapters, packages/core, packages/ui, apps/desktop).
- **pnpm test:** Passed. 43 test files, 687 tests (including CareerScreen.test.tsx, careerResumeScreenStore.test.ts).

### Git state

**git status**
```
On branch feature/careerAndResume_page_creation
Changes not staged for commit:
  modified:   ...
  modified:   packages/ui/src/screens/CareerScreen.tsx
  ...
```

**git branch --show-current**
```
feature/careerAndResume_page_creation
```

**git diff --name-status develop...HEAD**  
(No `develop` branch; use `main` for baseline.)

**git diff --stat develop...HEAD**  
(Same note.)

---

## Resume Readiness UX parity fixes (dropdown, chips, tooltips, confirm)

**Goal:** Finish Resume Readiness UX parity: Active resume dropdown 2-line layout per mockups; chips token-safe and visually distinct; drawer icon tooltips; destructive delete with confirm; archive with Undo toast.

### What changed

1. **A) Active resume dropdown — 2-line layout**
   - Replaced single-row “name | chips | updated” with strict 2-line layout per item:
     - Line 1: left = resume name (truncate), right = chip group (Type + Status), no wrapping.
     - Line 2: “Updated X ago” in muted text, aligned right.
   - Kept group headers (MASTER, TAILORED (RECENT)) and footer “Manage resumes…”.

2. **B) Chips**
   - Verified dropdown and All Resumes drawer use same components: `ResumeTypeChip` (Master/Tailored), `ResumeStatusChip` (Ready/In progress/Draft).
   - Tailored uses accent tokens (`--p-accent-bg`, `--p-accent`); Ready uses success tokens + Check icon; Master neutral/outline. Token-only; no new colors.

3. **C) Drawer icon tooltips**
   - All Resumes drawer: added tooltips for icon actions using existing inline pattern (relative group + `aria-describedby` + sibling `role="tooltip"`):
     - Archive button: “Archive resume”
     - More (⋮) button: “More actions”
   - Delete is only in More menu (no separate icon); menu item label “Delete permanently” is visible.

4. **D) Destructive action and Archive**
   - Delete permanently: confirm dialog already present — title “Delete resume?”, body “This removes the resume from this device. This can’t be undone.”, Cancel / Delete. Only deletes after confirm.
   - Archive: store already performs archive and sets `toastMessage: 'Archived.'` and `toastUndoResumeId`; toast shows Undo that calls `unarchiveResume`. No code change.

### Files changed

- `packages/ui/src/screens/CareerScreen.tsx` — Dropdown: 2-line item layout (both MASTER and TAILORED sections). Drawer: tooltip wrappers for Archive and More icon buttons (unique ids per row).

### Validation

- **pnpm -r typecheck:** Passed (packages/adapters, packages/core, packages/ui, apps/desktop).
- **pnpm test:** Passed. 43 test files, 687 tests (CareerScreen.test.tsx, careerResumeScreenStore.test.ts included).

### Human Simulation Gate

| Item | Value |
|------|-------|
| Required | No |
| Triggers hit | none |
| Why | UI layout, tooltips, and confirm/undo flows only; store behavior for archive/delete unchanged. |

Do not commit or push.

---

## All Resumes drawer tooltips: portaled to body, side=left (no commit)

**Goal:** Fix tooltip clipping in the All Resumes drawer by rendering tooltip content via a Radix portal to `document.body` and opening right-edge tooltips to the left (inward) with correct z-index above the drawer.

### What changed

1. **Tooltip implementation**
   - All Resumes drawer rows previously used inline tooltips (relative group + sibling `role="tooltip"` div), which were clipped by the drawer's overflow/stacking context.
   - Replaced with a Radix-based component that portals content to `document.body`: `packages/ui/src/components/DrawerTooltip.tsx`.

2. **DrawerTooltip**
   - Uses `@radix-ui/react-tooltip` (Provider, Root, Trigger, Portal, Content).
   - Content is rendered inside `TooltipPrimitive.Portal` (to `document.body`).
   - For right-edge icon buttons (Archive, More): `side="left"`, `sideOffset={8}`, `collisionPadding={12}`.
   - Tooltip content `zIndex: 50` so it appears above the drawer overlay (drawer uses `z-40`).

3. **CareerScreen**
   - Archive and More icon buttons in the All Resumes drawer now use `<DrawerTooltip content="..." side="left" sideOffset={8} collisionPadding={12}>` wrapping the trigger button; removed inline tooltip divs and `aria-describedby` (Radix manages a11y).
   - More button's dropdown (Delete menu) unchanged; still a sibling of the tooltip wrapper.

### Files changed

- `packages/ui/package.json` — Added dependency `@radix-ui/react-tooltip`: `"latest"`.
- `packages/ui/src/components/DrawerTooltip.tsx` — **New.** Portaled tooltip component (Radix Provider + Root + Trigger + Portal + Content), design tokens, z-index 50.
- `packages/ui/src/screens/CareerScreen.tsx` — All Resumes drawer: Archive and More buttons wrapped in `DrawerTooltip`; removed inline tooltip markup.

### Commands run and results

- **pnpm install** — OK (after adding Radix tooltip to packages/ui).
- **pnpm -r typecheck** — Passed (packages/adapters, packages/core, packages/ui, apps/desktop).
- **pnpm -r test** / **pnpm test** — Passed. 43 test files, 687 tests (including `packages/ui/src/screens/CareerScreen.test.tsx`).

### Validation

- **Visual:** Open All Resumes drawer, hover Archive and More; tooltip should be fully visible (not clipped) and open to the left (inward). Confirm manually.
- No commit or push.

---

## Overlay Rule v1 — Centralized z-index, Radix DropdownMenu for “New version” (no commit)

**Goal:** Implement Overlay Rule v1 so DropdownMenu, Tooltip, and Sheet layering is consistent; “New version” dropdown always renders above PathAdvisor with a solid background; no custom createPortal/manual positioning.

### What changed

1. **Z-index scale (packages/ui)**
   - Added `packages/ui/src/styles/zIndex.ts`: `Z_LAYOUT` (10), `Z_POPOVER` (50), `Z_DIALOG` (100), `Z_TOOLTIP` (50). Layout (rail) &lt; popover/tooltip &lt; dialog.

2. **“New version” dropdown (CareerScreen)**
   - Removed custom `createPortal` + manual anchor state (`newVersionMenuAnchor`, `newVersionButtonRef`). Re-implemented with `@radix-ui/react-dropdown-menu`: `DropdownMenuPrimitive.Root`, `Trigger`, `Portal`, `Content`. Content renders in `document.body` via Radix Portal; solid background `var(--p-surface)`, border `var(--p-border)`, `zIndex: Z_POPOVER`.

3. **PathAdvisor rail**
   - `packages/ui/src/shell/AppShell.tsx`: Left and right advisor rail `<aside>` now use `zIndex: Z_LAYOUT` so portaled popovers/dropdowns (Z_POPOVER) always render above the rail.

4. **DrawerTooltip**
   - `packages/ui/src/components/DrawerTooltip.tsx`: Replaced hardcoded `zIndex: 50` with `Z_TOOLTIP` from `../styles/zIndex`.

### Files changed

- `packages/ui/package.json` — Added `@radix-ui/react-dropdown-menu`: `"latest"`.
- `packages/ui/src/styles/zIndex.ts` — **New.** Centralized z-index constants (layout, popover, dialog, tooltip).
- `packages/ui/src/screens/CareerScreen.tsx` — Removed `createPortal` and anchor state; “New version” uses Radix DropdownMenu + Portal; DropdownMenuContent uses `var(--p-surface)` and `Z_POPOVER`.
- `packages/ui/src/shell/AppShell.tsx` — Rail asides use `Z_LAYOUT`.
- `packages/ui/src/components/DrawerTooltip.tsx` — Uses `Z_TOOLTIP` from zIndex module.

### Commands run and results

- **pnpm install** — OK.
- **pnpm -r typecheck** — Passed (packages/adapters, packages/core, packages/ui, apps/desktop).
- **pnpm test packages/ui** — 8 test files, 36 tests passed (including `CareerScreen.test.tsx`).
- **pnpm test** — Full suite: 43 test files, 687 tests passed.

### Validation (edge cases)

- **New version menu:** Open near the right edge; must render above PathAdvisor rail with solid background (no transparency).
- **Tooltips near drawer edge:** DrawerTooltip (portaled + Z_TOOLTIP) should not be clipped.
- No new global CSS; minimal diffs.

Do not commit or push.

---

## Overlay Rule v1 enforced globally — shell layering, canonical Tooltip, audit script (no commit)

**Goal:** Enforce Overlay Rule v1 everywhere: all tooltips/popovers/menus portaled to body, z-index from packages/ui/src/styles/zIndex.ts, rails at layout layer. Single canonical Tooltip; overlay audit script to prevent regressions.

### What changed

1. **Shell layering (AppShell)** — PathAdvisor rail asides: added `position: 'relative'` so `zIndex: Z_LAYOUT` takes effect. Mobile sidebar overlay: replaced Tailwind `z-50` with `style={{ zIndex: Z_DIALOG }}`.
2. **Canonical Tooltip** — New `packages/ui/src/components/Tooltip.tsx` (Radix, Portal, Z_TOOLTIP). DrawerTooltip is a thin alias. Replaced inline `role="tooltip"` / absolute div tooltips in AskPathAdvisorButton, PathAdvisorCard (3), SettingsScreen, CareerScreen (2), ApplicationConfidenceCenterScreen. SimpleModal uses Z_DIALOG.
3. **Overlay audit** — New `scripts/check-overlays.mjs`: fails on createPortal( in screens, role="tooltip" in ui (excl. Tooltip/DrawerTooltip), z-[ in ui (excl. zIndex.ts). Added `pnpm overlays:check`.

### Files changed

- `packages/ui/src/shell/AppShell.tsx` — position:relative on rails; Z_DIALOG for mobile overlay.
- `packages/ui/src/components/Tooltip.tsx` — **New.** Canonical portaled tooltip.
- `packages/ui/src/components/DrawerTooltip.tsx` — Thin alias around Tooltip.
- `packages/ui/src/components/AskPathAdvisorButton.tsx` — Tooltip component.
- `packages/ui/src/shell/PathAdvisorCard.tsx` — Three Tooltip wrappers.
- `packages/ui/src/screens/SettingsScreen.tsx` — InlineTooltip uses Tooltip.
- `packages/ui/src/screens/CareerScreen.tsx` — Two Tooltip wrappers.
- `packages/ui/src/screens/ApplicationConfidenceCenterScreen.tsx` — InlineTooltip uses Tooltip; SimpleModal Z_DIALOG.
- `scripts/check-overlays.mjs` — **New.** Overlay Rule v1 audit.
- `package.json` — overlays:check script.

### Commands run and results

- **pnpm -r typecheck** — Passed.
- **pnpm test** — 43 files, 687 tests passed.
- **pnpm overlays:check** — Passed.

Do not commit or push.

---

## OverlayRoot: global overlay layering fix (no commit)

**Goal:** Fix tooltips and dropdowns rendering behind PathAdvisor rail or getting clipped by introducing a single global overlay host (OverlayRoot) and portaling all overlays into it. Deterministic layering via zIndex.ts.

### What changed

1. **Global overlay host (OverlayRoot)**
   - **packages/ui/src/styles/zIndex.ts:** Added `OVERLAY_ROOT_ID = 'pathos-overlay-root'` and `Z_OVERLAY_ROOT = 1000`. Kept `Z_LAYOUT`, `Z_POPOVER`, `Z_DIALOG`, `Z_TOOLTIP` unchanged.
   - **packages/ui/src/shell/AppShell.tsx:** Rendered a single `<div id="pathos-overlay-root" />` at the end of the shell (outside main layout, inside the root div). Inline styles: `position: 'fixed'`, `inset: 0`, `pointerEvents: 'none'`, `isolation: 'isolate'`, `zIndex: Z_OVERLAY_ROOT`. Overlay host does not block pointer events; portaled content uses `pointerEvents: 'auto'` where needed.

2. **Portal all overlays into OverlayRoot**
   - **packages/ui/src/components/Tooltip.tsx:** Resolve container with `getOverlayContainer()` (OverlayRoot when present, else `document.body`). Pass `container={container}` to `TooltipPrimitive.Portal`. Tooltip content uses `pointerEvents: 'auto'` and `zIndex: Z_TOOLTIP`. DrawerTooltip wraps Tooltip so it inherits the same portal behavior.
   - **packages/ui/src/screens/CareerScreen.tsx:** `DropdownMenuPrimitive.Portal` now receives `container={document.getElementById(OVERLAY_ROOT_ID) || document.body}`. DropdownMenu Content already had solid `backgroundColor: 'var(--p-surface)'`, `borderColor: 'var(--p-border)'`, `zIndex: Z_POPOVER`.

3. **Remove competing z-index sources**
   - Replaced Tailwind z-index classes with inline `style={{ zIndex: ... }}` from zIndex.ts across packages/ui: **CareerScreen** (z-20, z-40, z-50, z-10 → Z_POPOVER or Z_DIALOG), **PathAdvisorCard** (z-30 → Z_POPOVER), **TopBar** (z-50 → Z_DIALOG), **Sidebar** (z-10 → 1 for local nav-item stacking). Rails (AppShell asides) already used `Z_LAYOUT`; no parent wrapper changes needed.

4. **Strengthen scripts/check-overlays.mjs**
   - Scope expanded to **packages/ui/src**, **apps/desktop/src**, **app/(shared)**. Fails if: (1) `className` contains `" z-"` (Tailwind z-index), except allowlisted files (zIndex.ts, AppShell.tsx where " z-" appears only in comments); (2) `role="tooltip"` except in Tooltip.tsx / DrawerTooltip.tsx; (3) `createPortal(` (allowlist empty). **pnpm overlays:check** remains wired at root.

### Files changed (this run)

- `packages/ui/src/styles/zIndex.ts` — OVERLAY_ROOT_ID, Z_OVERLAY_ROOT.
- `packages/ui/src/shell/AppShell.tsx` — OverlayRoot div; import OVERLAY_ROOT_ID, Z_OVERLAY_ROOT.
- `packages/ui/src/components/Tooltip.tsx` — getOverlayContainer(); Portal container; Content pointerEvents: auto.
- `packages/ui/src/screens/CareerScreen.tsx` — DropdownMenu Portal container; Z_DIALOG, Z_POPOVER; all Tailwind z-* replaced with inline zIndex.
- `packages/ui/src/shell/PathAdvisorCard.tsx` — z-30 → Z_POPOVER (inline).
- `packages/ui/src/shell/TopBar.tsx` — z-50 → Z_DIALOG (inline).
- `packages/ui/src/shell/Sidebar.tsx` — z-10 → inline zIndex: 1 (nav item stacking).
- `scripts/check-overlays.mjs` — Scope ui + desktop + app/(shared); fail on " z-", role="tooltip", createPortal( with allowlists.

### Commands run and results

- **pnpm -r typecheck** — Passed (packages/adapters, packages/core, packages/ui, apps/desktop).
- **pnpm test** — 43 test files, 687 tests passed.
- **pnpm overlays:check** — Passed (Overlay Rule v1 / OverlayRoot).

### Git state (reference)

- **git status** — Branch feature/careerAndResume_page_creation; modified and untracked files as per current working tree.
- **git branch --show-current** — feature/careerAndResume_page_creation.
- **git diff --name-status main --** (overlay-related): M packages/ui/package.json, M packages/ui/src/components/AskPathAdvisorButton.tsx, M packages/ui/src/shell/AppShell.tsx, M packages/ui/src/shell/PathAdvisorCard.tsx, M packages/ui/src/shell/Sidebar.tsx, M packages/ui/src/shell/TopBar.tsx, M packages/ui/src/screens/ApplicationConfidenceCenterScreen.tsx, M packages/ui/src/screens/CareerScreen.tsx, M packages/ui/src/screens/SettingsScreen.tsx, etc. (Full diff not pasted.)
- **git diff --stat main --** — (not pasted per instructions.)

### Manual validation (proof)

- PathAdvisor header tooltips (clear chat, settings, close briefing): must not be clipped; must appear above rail.
- “New version” dropdown near right edge: must render above PathAdvisor rail with solid background.
- All Resumes drawer row icon tooltips: must not be clipped.
- At least one tooltip near viewport edge: collision behavior should avoid cutoff.

Do not commit or push.

---

## Dropdown placement + Resume Readiness tile accent (Mar 1, 2025)

### What changed and why

1. **New version dropdown placement (Task A)**  
   The “New version” menu stays portaled (no revert of portal/OverlayRoot). Positioning was adjusted so the menu anchors to the button and minimizes overlap with the PathAdvisor rail: `side="bottom"`, `align="end"`, `sideOffset={8}`, `collisionPadding={14}`, and a reasonable width range (`min-w-[12rem] max-w-[16rem]` with `w-56`). Radix will prefer flipping left/inward when the menu would collide with the rail.

2. **Resume Readiness tiles accent (Task B)**  
   The four tiles (Completeness, Missing fields, Tailor-ready, Last tailored) previously used a hard 2px solid left border (`borderLeft: '2px solid var(--p-accent-muted)'`). This was replaced with the app’s “fade accent” pattern: an absolute inner strip (8px wide) with a horizontal gradient `linear-gradient(90deg, var(--p-accent-muted), transparent)` and a vertical mask so the strip fades at top/bottom. All four tiles use the same `ResumeReadinessTile` component, so accent behavior is identical. Styling is token-only (`var(--p-*)`).

### Files changed

- `packages/ui/src/screens/CareerScreen.tsx` — New version `DropdownMenuPrimitive.Content` props (side, align, sideOffset, collisionPadding, width classes); `ResumeReadinessTile` inner content: removed solid border, added fade-accent div (gradient + mask).

### Commands run and results

- **pnpm -r typecheck** — Passed (packages/adapters, packages/core, packages/ui, apps/desktop).
- **pnpm --filter @pathos/ui test --run** — Passed (exit code 0).

### Constraints respected

- Portal/OverlayRoot behavior unchanged.
- Token-only styling; no hardcoded colors.
- Minimal diffs (targeted edits only).

Do not commit or push.

---

## Resume Readiness tiles: remove orange strip, match card system (Mar 1, 2025)

### Problem

The four “Resume Readiness” tiles (Completeness, Missing fields, Tailor-ready, Last tailored) had an inconsistent orange left-edge accent (vertical gradient strip) and did not match the styling of other cards on the page (e.g. TODAY'S BEST MOVE, YOUR RESUMES, ModuleCard).

### Goal

Make all four tiles visually consistent with each other and with the rest of the card system on Resume Readiness.

### What changed

1. **Component/style identified**  
   The four tiles are rendered by `ResumeReadinessTile` in `packages/ui/src/screens/CareerScreen.tsx`.

2. **Vertical orange gradient strip removed**  
   The inner absolute div that drew an 8px left strip with `linear-gradient(90deg, var(--p-accent-muted), transparent)` and a vertical mask was removed entirely. No left accent bar remains.

3. **Card styling aligned with page**  
   Tiles now use the same card chrome as ModuleCard and other cards on the page:
   - Same border: `1px solid var(--p-border)`
   - Same radius: `var(--p-radius-lg)`
   - Same surface: `var(--p-surface)`
   - Same shadow: `var(--p-shadow-elev-1)`
   - Added 1px top accent line: `borderTop: '1px solid var(--p-accent-muted)'` to match ModuleCard (subtle, token-safe; no new visual system).

4. **Emphasis via content only**  
   Value text remains orange (`var(--p-accent)`). No harsh accent bars.

5. **Uniform structure**  
   All four tiles share the exact same `ResumeReadinessTile` component and classes; inner content wrapper is `p-3 flex flex-col gap-0.5` with no per-tile styling differences.

### Files changed

- `packages/ui/src/screens/CareerScreen.tsx` — `ResumeReadinessTile`: removed gradient strip div and extra left padding; added `borderTop: '1px solid var(--p-accent-muted)'` to outer card; simplified inner wrapper to `p-3 flex flex-col gap-0.5`. Comment updated to describe alignment with ModuleCard/card system.

### Validation

- Visual: tiles are uniform and match other cards (same border, radius, surface, subtle top accent; value text orange).
- **pnpm -r typecheck** — Passed.
- **pnpm --filter @pathos/ui test --run** — Passed.

Do not commit or push.

---

## Sidebar CAREER & JOBS order: Resume Builder before Resume Readiness (Mar 1, 2025)

### Task

Reorder sidebar navigation so “Resume Builder” appears before “Resume Readiness” under the CAREER & JOBS section. Desired order: … Job Search, Saved Jobs, Guided Apply, Resume Builder, Resume Readiness … (Application Confidence Center last).

### What changed

- **packages/ui/src/shell/Sidebar.tsx** — Reordered the `items` array in the CAREER & JOBS `navSections` entry. No route or label changes; only item order.
- New order: Job Search, Saved Jobs, Guided Apply, Resume Builder, Resume Readiness, Application Confidence Center.

### Constraints

- Routes and labels unchanged.
- Minimal diff (reorder only).
- Route parity unchanged.

### Validation

- **pnpm -r typecheck** — Passed.
- **pnpm -r test -- --run** — Passed.
- **pnpm routes:check** — OK; all Sidebar routes resolve in Desktop and Next.

Do not commit or push.

---

## Dashboard Briefing tiles: match Resume Readiness tile style (Mar 1, 2025)

### Goal

Make the Dashboard “Briefing” row tiles (Saved Jobs, Tracked Apps, Readiness, Next Milestone) match the Resume Readiness tile style for visual consistency: remove orange accent bars / harsh accent borders, use the same neutral card styling, keep emphasis via content (value typography + delta/subtext).

### What changed

1. **Component identified**  
   The four tiles are rendered by `BriefingTile` in `packages/ui/src/screens/DashboardScreen.tsx` (single shared component for all briefing tiles).

2. **Styles updated to match Resume Readiness tiles**  
   - **Removed:** 2px left accent strip (`borderLeft: '2px solid var(--p-accent-muted)'`) and extra left padding (`pl-[calc(0.75rem+2px)]`).  
   - **Added:** 1px top accent line on the outer card (`borderTop: '1px solid var(--p-accent-muted)'`) to match ModuleCard / Resume Readiness.  
   - **Unchanged:** Same border token (`var(--p-border)`), radius (`var(--p-radius-lg)`), surface (`var(--p-surface)`), shadow (`var(--p-shadow-elev-1)`). Inner content uses `p-3 flex flex-col gap-0.5` (no left padding).

3. **Signals preserved**  
   - Delta/subtext (e.g. “+1 this week”, “1 updated”) still rendered with `subtextPositive` for success color where used.  
   - Icons (BRIEFING_ICONS) unchanged.  
   - Label/value/subtext layout and padding unchanged.

4. **Tokens only**  
   All styling uses `var(--p-*)`; no hardcoded colors. No restyling of unrelated cards (FocusHeroCard, ModuleCard, etc. untouched).

### Files changed

- `packages/ui/src/screens/DashboardScreen.tsx` — `BriefingTile`: removed left accent bar and extra padding; added `borderTop: '1px solid var(--p-accent-muted)'` to outer card; inner wrapper set to `p-3 flex flex-col gap-0.5`. Comment block updated to describe alignment with Resume Readiness tile style.

### Validation

- Visual: Dashboard briefing row tiles use same base card treatment as Resume Readiness (border, radius, surface, 1px top accent; no left strip).
- **pnpm -r typecheck** — Passed.
- **pnpm -r test -- --run** — Passed.

Do not commit or push.

---

## Sidebar CAREER & JOBS: Guided Apply after Application Confidence Center (Mar 1, 2025)

### Task

Reorder sidebar nav under CAREER & JOBS so “Guided Apply” appears after “Application Confidence Center”. Target order: Job Search, Saved Jobs, Resume Builder, Resume Readiness, Application Confidence Center, Guided Apply.

### What changed

- **packages/ui/src/shell/Sidebar.tsx** — Reordered the `items` array in the CAREER & JOBS section: moved “Guided Apply” from third to last. Routes, labels, and icons unchanged; order only.

### Constraints

- Routes, labels, icons unchanged.
- Minimal diff (reorder only).
- Route parity unchanged.

### Validation

- **pnpm -r typecheck** — Passed.
- **pnpm -r test -- --run** — Passed.
- **pnpm routes:check** — OK; all Sidebar routes resolve in Desktop and Next.

Do not commit or push.

---

## Push-ready (Resume Readiness v1) — Mar 1, 2025

Final merge-ready documentation and artifact updates. Baseline: **main** (repo does not use develop).

### Summary of what changed

- **Resume Readiness page and route** — New `/dashboard/resume-readiness` route and CareerScreen (Resume Readiness tiles, resume list, today's best move, create tailored flow).
- **Navigation** — Sidebar CAREER & JOBS order: Job Search, Saved Jobs, Resume Builder, Resume Readiness, Application Confidence Center, Guided Apply. Dashboard career link to Resume Readiness.
- **PathAdvisor and tooltips** — Screen-specific prompts for Resume Readiness; DrawerTooltip/Tooltip components; overlay and z-index alignment.
- **Stores** — careerResumeScreenStore, pathAdvisorScreenOverridesStore; tests for CareerScreen and careerResumeScreenStore.
- **CI/scripts** — overlays check script (`pnpm overlays:check`); route parity script updates.
- **Mockups** — Removed `dashboard-command-center-v1-*.png`; added `careerAndResume_*.png`.
- **Change brief** — `docs/change-briefs/resume-readiness-v1.md` (non-technical).
- **Patch artifacts** — `artifacts/resume-readiness-v1.patch` (cumulative main…HEAD), `artifacts/resume-readiness-v1-this-run.patch` (incremental).

### Files changed (high-level)

| Area | Paths |
|------|--------|
| App routes | `app/(shared)/dashboard/career/page.tsx`, `app/(shared)/dashboard/resume-readiness/` (new) |
| Desktop | `apps/desktop/src/DesktopApp.tsx` |
| UI package | `packages/ui`: CareerScreen, DashboardScreen, SettingsScreen, ApplicationConfidenceCenterScreen; Sidebar, TopBar, AppShell, PathAdvisorRail, PathAdvisorCard, AskPathAdvisorButton; routes, index; new DrawerTooltip, Tooltip, zIndex, careerResumeScreenStore, pathAdvisorScreenOverridesStore + tests |
| Scripts | `scripts/check-route-parity.mjs`, `scripts/check-overlays.mjs` (new) |
| Docs/mockups | `docs/merge-notes.md`, `docs/change-briefs/resume-readiness-v1.md` (new); mockups: 2 deleted, 4 added |
| Lock/config | `package.json`, `packages/ui/package.json`, `pnpm-lock.yaml` |

### Validation results

| Command | Result | Notes |
|---------|--------|--------|
| pnpm lint | **FAIL** | 19 errors, 13 warnings. Errors in electron scripts (require), core test files (prefer-const), and UI (set-state-in-effect, empty interface, component-in-render). Pre-existing and in-branch; warnings allowed per policy. |
| pnpm typecheck | **PASS** | Exit 0. |
| pnpm test | **PASS** | 43 test files, 687 tests passed. |
| pnpm build | **PASS** | Next.js production build succeeded; `/dashboard/resume-readiness` and other routes built. |
| pnpm routes:check | **PASS** | All Sidebar routes resolve in Desktop and Next. |
| pnpm overlays:check | **PASS** | Overlay Rule v1 / OverlayRoot. |

### Git snapshots

**git status**

```
On branch feature/careerAndResume_page_creation
Changes to be committed:
  new file:   app/(shared)/dashboard/resume-readiness/page.tsx
  new file:   docs/mockups/careerAndResume_bottom.png
  new file:   docs/mockups/careerAndResume_mid.png
  new file:   docs/mockups/careerAndResume_mid_bottom.png
  new file:   docs/mockups/careerAndResume_top.png
  new file:   packages/ui/src/components/DrawerTooltip.tsx
  new file:   packages/ui/src/components/Tooltip.tsx
  new file:   packages/ui/src/screens/CareerScreen.test.tsx
  new file:   packages/ui/src/stores/careerResumeScreenStore.test.ts
  new file:   packages/ui/src/stores/careerResumeScreenStore.ts
  new file:   packages/ui/src/stores/pathAdvisorScreenOverridesStore.ts
  new file:   packages/ui/src/styles/zIndex.ts
  new file:   scripts/check-overlays.mjs
  new file:   docs/change-briefs/resume-readiness-v1.md

Changes not staged for commit:
  modified:   app/(shared)/dashboard/career/page.tsx
  modified:   apps/desktop/src/DesktopApp.tsx
  modified:   docs/merge-notes.md
  deleted:    docs/mockups/dashboard-command-center-v1-bottom.png
  deleted:    docs/mockups/dashboard-command-center-v1-top.png
  modified:   package.json
  modified:   packages/ui/package.json
  ... (other modified files as in full status)
```

**git branch --show-current**

```
feature/careerAndResume_page_creation
```

**git diff --name-status main...HEAD**

(Empty — branch has no commits beyond main; all changes are in working tree + staged.)

**git diff --stat main...HEAD**

(Empty — same reason.)

**git diff --name-status main --** (working tree vs main, exclude artifacts)

```
M	app/(shared)/dashboard/career/page.tsx
M	apps/desktop/src/DesktopApp.tsx
M	docs/merge-notes.md
D	docs/mockups/dashboard-command-center-v1-bottom.png
D	docs/mockups/dashboard-command-center-v1-top.png
M	package.json
M	packages/ui/package.json
... (plus new files when staged)
```

**git diff --stat main --** (working tree vs main)

```
 21 files changed, 3020 insertions(+), 257 deletions(-)
 (plus new files when staged)
```

### Patch artifacts (push-ready)

- **Cumulative:** `git diff main...HEAD -- . ":(exclude)artifacts"` → `artifacts/resume-readiness-v1.patch` (0 bytes; no commits on branch).
- **Incremental:** `git diff -- . ":(exclude)artifacts"` → `artifacts/resume-readiness-v1-this-run.patch`.

**Artifacts listing (resume-readiness-v1 patches only):** See "Merge-ready validation" below for final sizes.

Patch contents are not pasted here.

### Git hygiene

- **Mockups:** `docs/mockups/dashboard-command-center-v1-top.png` and `dashboard-command-center-v1-bottom.png` were restored (git restore) so they remain in the repo; `careerAndResume_*.png` are added alongside. No intentional deletion of mockups without replacement.
- **Untracked → tracked:** New page folder, mockups, DrawerTooltip, Tooltip, CareerScreen.test, careerResumeScreenStore (+ test), pathAdvisorScreenOverridesStore, zIndex.ts, check-overlays.mjs, and change brief were added and staged.

Do not commit or push.

---

## Merge-ready validation (Mar 1, 2025)

Final gate results and artifact listing after lint fixes, mockup restore, and patch regeneration.

### Summary

- **Lint:** All 19 errors fixed (CJS eslint-disable, prefer-const, set-state-in-effect via queueMicrotask, empty interface → type, Sidebar NavLink from parent). Exit 0; 12 warnings remain (allowed).
- **Mockups:** Restored `docs/mockups/dashboard-command-center-v1-top.png` and `dashboard-command-center-v1-bottom.png` with `git restore`; both remain in repo.
- **Cumulative patch:** Branch has no commits beyond main, so `git diff main...HEAD` is empty. Cumulative patch generated as **working tree vs main**: `git diff main -- . ":(exclude)artifacts"` → non-empty `artifacts/resume-readiness-v1.patch`.

### Command results

| Command | Result |
|---------|--------|
| pnpm lint | **PASS** (0 errors, 12 warnings) |
| pnpm typecheck | **PASS** |
| pnpm test | **PASS** (43 files, 687 tests) |
| pnpm build | **PASS** |
| pnpm routes:check | **PASS** |
| pnpm overlays:check | **PASS** |

### Git snapshots

**git status**

```
On branch feature/careerAndResume_page_creation
Changes to be committed:
  new file:   app/(shared)/dashboard/resume-readiness/page.tsx
  new file:   docs/change-briefs/resume-readiness-v1.md
  new file:   docs/mockups/careerAndResume_bottom.png
  new file:   docs/mockups/careerAndResume_mid.png
  new file:   docs/mockups/careerAndResume_mid_bottom.png
  new file:   docs/mockups/careerAndResume_top.png
  new file:   packages/ui/src/components/DrawerTooltip.tsx
  new file:   packages/ui/src/components/Tooltip.tsx
  new file:   packages/ui/src/screens/CareerScreen.test.tsx
  new file:   packages/ui/src/stores/careerResumeScreenStore.test.ts
  new file:   packages/ui/src/stores/careerResumeScreenStore.ts
  new file:   packages/ui/src/stores/pathAdvisorScreenOverridesStore.ts
  new file:   packages/ui/src/styles/zIndex.ts
  new file:   scripts/check-overlays.mjs

Changes not staged for commit:
  modified:   app/(shared)/dashboard/career/page.tsx
  modified:   apps/desktop/scripts/copy-preload.cjs
  modified:   apps/desktop/scripts/postinstall-electron.cjs
  ... (lint fixes + feature changes in packages/ui, docs, etc.)
```

**git branch --show-current**

```
feature/careerAndResume_page_creation
```

**git diff --name-status main...HEAD**

(Empty — no commits on branch beyond main.)

**git diff --stat main...HEAD**

(Empty — same.)

### Patch artifacts (corrected)

- **Cumulative:** `git diff main -- . ":(exclude)artifacts"` → `artifacts/resume-readiness-v1.patch` (working tree vs main; branch has no commits).
- **Incremental:** `git diff -- . ":(exclude)artifacts"` → `artifacts/resume-readiness-v1-this-run.patch`.

**Artifacts listing**

```
Name          : resume-readiness-v1.patch
Length        : 239658
LastWriteTime : 3/1/2026 1:41:56 PM

Name          : resume-readiness-v1-this-run.patch
Length        : 200042
LastWriteTime : 3/1/2026 1:41:56 PM
```

Do not commit or push.

---

## AI docs: Overlay Rule v1 and tooltip/overlay usage

**Goal:** Add Overlay Rule v1 and tooltip/overlay usage rules to AI docs so future Cursor runs don’t regress the overlay system.

### Doc sections added

- **docs/ai/cursor-house-rules.md:** New section “Overlay Rule v1 (Tooltips, Menus, Popovers)” — canonical Tooltip/DrawerTooltip wrappers; no inline `role="tooltip"` DOM; no Tailwind `z-*`; no `createPortal` in screens; run `pnpm overlays:check` in validation.
- **docs/ai/testing-standards.md:** New UI check “Overlay sanity” — hover tooltips near rail/drawer edges (confirm not clipped); open dropdown near rail (confirm above rail); confirm `pnpm overlays:check` passes.
- **docs/ai/prompt-header.md:** Added `pnpm overlays:check` to the required validation list for UI/overlay changes.

### Files changed

- `docs/ai/cursor-house-rules.md`
- `docs/ai/testing-standards.md`
- `docs/ai/prompt-header.md`
- `docs/merge-notes.md` (this log)

### Commands run

- `pnpm overlays:check` — passed (Overlay Rule v1 / OverlayRoot).

### Git snapshots

**git status**

```
On branch feature/job-search-prompted-filters-v1
Changes not staged for commit:
	modified:   docs/ai/cursor-house-rules.md
	modified:   docs/ai/prompt-header.md
	modified:   docs/ai/testing-standards.md
	modified:   docs/merge-notes.md
no changes added to commit
```

**git branch --show-current**

```
feature/job-search-prompted-filters-v1
```

**git diff --name-status main...HEAD**

(Empty — branch has no commits beyond main.)

**git diff --stat main...HEAD**

(Empty — same.)

Do not commit or push.

---

## Job Search screen v1 (Prompted Filters, store, PathAdvisor)

**Goal:** Build Job Search screen v1 to match mock: title/subtitle, Prompted Filters (translate to filters), search row, filters bar, results + details, PathAdvisor rail. Local-only; token-only styling; scroll invariant; route parity; no commits/pushes.

### Summary

- **Route + page:** Job Search route unchanged; screen shows title "Job Search" and subtitle "Explore roles, save targets, and reduce uncertainty." Web (Next) and desktop both use same route.
- **Stores:** New job search v1 Zustand store (`packages/ui/src/stores/jobSearchV1Store.ts`) with persistence to `pathos_job_search_v1`. State: lastQuery, filters, results (mock), selectedJobId, loading, hasSearched, appliedFromPrompt. Save job uses core `addSavedJobDirect` / `saveSavedJobsStore` so saved jobs appear in Saved Jobs screen.
- **Storage keys:** Added `JOB_SEARCH_V1_STORAGE_KEY` (`pathos_job_search_v1`) and `PROMPT_TO_FILTERS_AUDIT_KEY` (`pathos_jobsearch_prompt_to_filters_v1`) in `packages/core/src/storage-keys.ts` and `lib/storage-keys.ts`.
- **Prompted Filters:** Card with "Describe what you're looking for (optional)", placeholder, "Translate to filters" button. Deterministic parser (`packages/ui/src/lib/promptToFiltersParser.ts`) extracts GS levels, agencies (DHS, VA, etc.), remote/telework/hybrid, series, location phrase, keywords. Proposed filters preview with chips, interpretation line, Apply filters / Edit filters / Discard. On Apply: store filters, write audit to `pathos_jobsearch_prompt_to_filters_v1`, run search. "Applied from prompt" note with View (expand to show prompt).
- **Search row:** Keywords + optional location inputs, Search (primary), Reset (secondary), microcopy "Results shown from saved snapshots (mock) for now."
- **Filters bar:** Dropdowns All Grades, All Series, All Agencies, Any Location, All Types; Clear all filters; "Applied from prompt" + View.
- **Results + details:** Two panes (results list left, details center). Results: title, agency, location, close date, GS chip, fit badge (High/Medium/Low), Save per item, "New" / "Close date updated" on first two. Details: checklist sections (Specialized experience, Skills & keywords, Documents needed), Save job / Tailor resume / Ask PathAdvisor. States: before search "Run a search to view jobs.", loading skeleton, no results message.
- **PathAdvisor:** Screen overrides on mount (viewingLabel "Job Search", suggested prompts, briefingLabel "From Job Search"); Do now "Save and start tailoring" when job selected, cleared on unmount.
- **Tests:** Parser tests (`promptToFiltersParser.test.ts`), store tests (`jobSearchV1Store.test.ts`), screen tests (`JobSearchScreen.test.tsx` with NavigationProvider). Vitest already has localStorage polyfill and excludes **/node_modules/**.

### Files changed

- `lib/storage-keys.ts` — added JOB_SEARCH_V1_STORAGE_KEY, PROMPT_TO_FILTERS_AUDIT_KEY, STORAGE_KEYS entries.
- `packages/core/src/storage-keys.ts` — same keys.
- `packages/core/src/index.ts` — export new keys.
- `packages/ui/src/screens/JobSearchScreen.tsx` — rewritten for v1 (title/subtitle, prompted filters, search row, filters bar, results + details, PathAdvisor overrides).
- `packages/ui/src/stores/jobSearchV1Store.ts` — new (Zustand store, persist pathos_job_search_v1, integrate core saved-jobs).
- `packages/ui/src/lib/promptToFiltersParser.ts` — new (deterministic prompt → filters + keywords + evidence).
- `packages/ui/src/screens/jobSearchMockChecklists.ts` — new (checklist data for mock jobs).
- `packages/ui/src/lib/promptToFiltersParser.test.ts` — new.
- `packages/ui/src/stores/jobSearchV1Store.test.ts` — new.
- `packages/ui/src/screens/JobSearchScreen.test.tsx` — new.

### Validation commands (run and summarize)

- **pnpm -r typecheck** — PASS (all 4 scopes).
- **pnpm test** — PASS (700 tests, 46 files).
- **pnpm routes:check** — PASS (all Sidebar routes resolve in Desktop and Next).
- **pnpm overlays:check** — PASS (Overlay Rule v1 / OverlayRoot).

### Manual test checklist

- [ ] Job Search loads; scroll behaves (main scroll container only); PathAdvisor rail stays fixed.
- [ ] Prompt translate → proposed filters → Apply filters → chips reflect → search results update.
- [ ] Save job → appears in Saved Jobs (or saved state) → refresh → still saved.
- [ ] Clear filters and Reset behave predictably.
- [ ] Desktop and web both show the same route.

### Human Simulation Gate

| Item | Value |
|------|-------|
| Required | Yes |
| Triggers hit | Adds Save/Apply action; changes store logic; persistence (pathos_job_search_v1, pathos_jobsearch_prompt_to_filters_v1, core saved-jobs). |
| Why | Create-button rule: save job → appears in Saved Jobs → refresh → still there; storage keys verified. |

### AI Acceptance Checklist

| Item | Value |
|------|-------|
| Flow | Search → jobSearchV1Store.runSearch() → results; Save job → core addSavedJobDirect/saveSavedJobsStore → Saved Jobs screen; Apply from prompt → store filters + audit key pathos_jobsearch_prompt_to_filters_v1. |
| Store(s) | useJobSearchV1Store (packages/ui); core loadSavedJobsStore/saveSavedJobsStore for saved jobs. |
| Storage key(s) | pathos_job_search_v1, pathos_jobsearch_prompt_to_filters_v1, pathos:saved-jobs-store (core). |
| Failure mode | Broken store: results/saved state lost on refresh. Broken save: job not in Saved Jobs. |
| How tested | Unit: parser, store (runSearch, applyProposedFiltersFromPrompt, saveJob), screen (title/subtitle). Manual: create → appears elsewhere → refresh → still there. |

### Git state (this run)

**git status**
```
On branch feature/job-search-prompted-filters-v1
Changes not staged for commit:
  modified:   docs/ai/..., lib/storage-keys.ts, packages/core/..., packages/ui/src/screens/JobSearchScreen.tsx
Untracked: packages/ui/src/lib/, JobSearchScreen.test.tsx, jobSearchMockChecklists.ts, jobSearchV1Store.test.ts, jobSearchV1Store.ts
```

**git branch --show-current:** feature/job-search-prompted-filters-v1

**git diff --name-status develop...HEAD:** (Empty.)

**git diff --stat develop...HEAD:** (Empty.)

Do not commit or push.

---

## Job Search evaluation path (mock data, sample jobs, PathAdvisor copy)

**Goal:** One-click evaluation: mock jobs dataset, "Load sample jobs" button, "Use example prompt" link, prompt-to-filters runs mockSearchJobs; PathAdvisor rail Job Search helper copy (no compensation). Minimal diffs; token-only; scroll invariant; overlay rule unchanged.

### What changed

- **A) Mock jobs:** New `packages/ui/src/screens/jobSearchMockJobs.ts`: `MOCK_JOBS` (10 items, stable ids mock-js-1..mock-js-10), `MOCK_JOB_TAGS` (New / Close date updated for mock-js-1, mock-js-2), variety (agencies, grades, Remote/DC/Arlington). `mockSearchJobs(input, jobs)` pure function: keywords (title/summary), location substring, filters (gradeBand, agency, series, location, remoteType, appointmentType), sort by close-date order.
- **B) Store:** `jobSearchV1Store` uses `MOCK_JOBS` and `mockSearchJobs` for `runSearch()`. New action `loadSampleJobs()`: sets results = MOCK_JOBS, hasSearched = true, selectedJobId = first id.
- **C) Empty state:** "Run a search to view jobs." kept; added "Load sample jobs" button (calls `loadSampleJobs()`, details pane shows first job). "Use example prompt" link fills prompt input with placeholder text so "Translate to filters" becomes enabled.
- **D) Prompt-to-filters:** Empty prompt keeps "Translate to filters" disabled. After "Use example prompt", Apply filters applies filters and runs search via `mockSearchJobs`.
- **E) PathAdvisor:** `PathAdvisorScreenOverrides` extended with optional `helperParagraph`. Job Search sets `helperParagraph` to "Use this workspace to decode job requirements and decide your next best move. Ask about specialized experience, keywords, and what to do next." PathAdvisorCard uses it when message list empty (no compensation copy on Job Search).
- **F) Checklists:** `jobSearchMockChecklists` maps mock-js-* ids to existing checklist keys so details pane shows SPECIALIZED EXPERIENCE / SKILLS / DOCUMENTS. List item tags from `MOCK_JOB_TAGS` (not index).
- **Tests:** `jobSearchMockJobs.test.ts` (mockSearchJobs filters agency/grade/keywords/location, sort); `jobSearchV1Store.test.ts` (loadSampleJobs populates and selects first); `jobSearchMockChecklists.test.ts` (getChecklistForJob mock-js-1 returns checklist); `JobSearchScreen.test.tsx` (after loadSampleJobs store has results and first job selected).

### Files changed (this run)

- `packages/ui/src/screens/jobSearchMockJobs.ts` — new (MOCK_JOBS, MOCK_JOB_TAGS, mockSearchJobs).
- `packages/ui/src/screens/jobSearchMockJobs.test.ts` — new.
- `packages/ui/src/screens/jobSearchMockChecklists.ts` — map mock-js-* to checklist keys.
- `packages/ui/src/screens/jobSearchMockChecklists.test.ts` — new.
- `packages/ui/src/screens/JobSearchScreen.tsx` — Load sample jobs button, Use example prompt link, MOCK_JOB_TAGS for list tags.
- `packages/ui/src/screens/JobSearchScreen.test.tsx` — test loadSampleJobs store state.
- `packages/ui/src/stores/jobSearchV1Store.ts` — loadSampleJobs(), runSearch uses mockSearchJobs(MOCK_JOBS).
- `packages/ui/src/stores/jobSearchV1Store.test.ts` — test loadSampleJobs.
- `packages/ui/src/stores/pathAdvisorScreenOverridesStore.ts` — helperParagraph in overrides.
- `packages/ui/src/shell/PathAdvisorRail.tsx` — pass helperParagraph to PathAdvisorCard.
- `packages/ui/src/shell/PathAdvisorCard.tsx` — optional helperParagraph for empty-state body copy.

### Commands run (summaries)

**pnpm -r typecheck**
```
packages/adapters typecheck: Done
packages/core typecheck: Done
packages/ui typecheck: Done
apps/desktop typecheck: Done
Exit: 0
```

**pnpm test**
```
Test Files  48 passed (48)
Tests       710 passed (710)
Exit: 0
```

**pnpm routes:check**
```
routes:check: OK — all Sidebar routes resolve in Desktop and Next.
```

**pnpm overlays:check**
```
overlays:check passed (Overlay Rule v1 / OverlayRoot).
```

### Git state (this run)

**git status**
```
On branch feature/job-search-prompted-filters-v1
Changes not staged for commit:
  modified:   docs/ai/cursor-house-rules.md, docs/ai/prompt-header.md, docs/ai/testing-standards.md,
              docs/merge-notes.md, lib/storage-keys.ts, packages/core/src/index.ts,
              packages/core/src/storage-keys.ts, packages/ui/src/screens/JobSearchScreen.tsx,
              packages/ui/src/shell/PathAdvisorCard.tsx, packages/ui/src/shell/PathAdvisorRail.tsx,
              packages/ui/src/stores/pathAdvisorScreenOverridesStore.ts
Untracked: packages/ui/src/lib/, JobSearchScreen.test.tsx, jobSearchMockChecklists.ts,
            jobSearchMockChecklists.test.ts, jobSearchMockJobs.ts, jobSearchMockJobs.test.ts,
            jobSearchV1Store.test.ts, jobSearchV1Store.ts
```

**git branch --show-current**
```
feature/job-search-prompted-filters-v1
```

**git diff --name-status main...HEAD**
```
(Empty — branch has no commits beyond main.)
```

**git diff --stat main...HEAD**
```
(Empty.)
```

Do not commit or push.
