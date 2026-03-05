# Day 59 — Career Readiness tab v1

**Date:** March 5, 2026  
**Type:** New screen / UX

---

## What Changed

A new **Career Readiness** tab/screen in the PathOS desktop and web app. It shows your competitiveness baseline for federal roles with a primary score, trajectory chart, radar chart, top gaps, and an action plan. The PathAdvisor rail shows context-specific INSIGHT and NEXT BEST ACTION when you are on this screen.

### 1. New route and navigation

- **Route:** `/dashboard/career-readiness` (Desktop and Next).
- **Sidebar:** “Career Readiness” added in OVERVIEW, after Dashboard and before Job Search. Active state highlights when you are on this screen.
- **PathAdvisor:** Shows “Viewing: Career Readiness” and “Privacy: Local only” when on this screen.

### 2. Screen layout and content

- **Title:** “Career Readiness” with subtitle “Your competitiveness baseline for federal roles.”
- **Header controls:** Target role dropdown (default: “General readiness (recommended)”), status text “Local-only • Updated 2 min ago”, and a Recompute (refresh) icon button.
- **Primary score card:** Large score (e.g. 74 / 100), badge “Competitive with improvements”, short explanation, and two buttons: “Improve readiness” and “View top opportunities.”
- **Two-column row:**
  - **Readiness Trajectory:** Small line chart (Today 74, 3 mo 78, 6 mo 84, 12 mo 90), microcopy “Trajectory is based on selected actions. Local-only.”, and collapsible “Show assumptions.”
  - **Readiness Radar:** Pentagon radar chart (Target Alignment, Specialized Exp, Resume Evidence, Keywords Coverage, Leadership & Scope) and “Top gaps holding you back” with three rows (Resume Evidence +6, Target Alignment +4, Leadership & Scope +3), each with a CTA button.
- **Action Plan card:** Checklist of four actions with impact (+4, +3, etc.) and effort (S/M/L). “Projected readiness” updates when you check/uncheck items (base 74 + sum of selected impacts, capped at 100). “Clear selections” link.
- **Evidence & Inputs:** Collapsed by default; expand to see profile fields used, resume used, target role used, and “Computed locally. Not shared.”

### 3. PathAdvisor rail on Career Readiness

- **INSIGHT** card with three bullets (e.g. qualification baseline strong for GS-13 analyst roles; resume evidence biggest limiting factor; leadership signals moderate).
- **NEXT BEST ACTION** card: “Add 3 quantified accomplishments (+4).” with “Start” button.
- Collapsed sections: “Explain scoring”, “How this works.”
- Bottom “Ask PathAdvisor…” input unchanged.

### 4. Data and behavior

- All data is **local-only mock** (no backend). Score, trajectory, radar, gaps, and action plan items come from a mock object in the UI package.
- Action plan checkboxes update “Projected readiness” live (e.g. one item +4 selected → 78).
- No new theme or spacing system; uses existing PathOS CSS tokens and components (cards, buttons, dropdowns, badges).

---

## Why This Matters

- Users get a single place to see how competitive they are for federal roles and what to do next.
- Readiness is framed as deterministic and local-only, with clear evidence and action items.
- PathAdvisor stays in sync with the screen so guidance is relevant.

---

## What the User Will Notice

- A new **Career Readiness** item in the left nav under OVERVIEW (below Dashboard).
- Clicking it opens the Career Readiness screen with score, charts, gaps, and action plan.
- The right PathAdvisor panel shows “Viewing: Career Readiness”, INSIGHT bullets, and a NEXT BEST ACTION with “Start.”
- Checking/unchecking action items changes “Projected readiness” immediately.
- Expanding “Evidence & Inputs” shows what inputs were used and a privacy note.

---

## Risks / Limitations

- **Mock data only:** Score, trajectory, radar, and gaps are hardcoded. No persistence of selections yet (v1 keeps state in component; refresh resets).
- **Charts:** Line and radar are simple SVG implementations; no Recharts in the UI package. Colors use theme accent.
- **Route parity:** Both Desktop app and Next app resolve `/dashboard/career-readiness`; if one is missing, sidebar link could 404 there.
- **Day number:** If the canonical day is not 59, rename artifacts and this brief (e.g. day-XX) and note in merge-notes.

---

## UX fixes (second run — March 5, 2026)

**What changed for users**

- **Trajectory card** no longer has a big empty gap; the chart area is shorter and the card feels balanced. The same “Today 74”, “3 mo 78”, etc. labels are still there.
- **Radar chart** labels (Target Alignment, Specialized Exp, etc.) are no longer cut off; there is enough padding so they stay visible at normal desktop widths. The chart stays centered.
- **Score card** now explains what the score is for: a line under the badge says things like “Baseline competitiveness across common federal roles.” when “General readiness” is selected, so “competitive for what?” is clear.
- **Evidence & Inputs** is easier to notice when collapsed: it has a subtle border highlight, an “Audit details” badge, and a short line: “See what inputs were used for scoring.” It still starts collapsed.
- **Show assumptions** under the trajectory chart looks clickable (hover state and chevron). When you expand it, the extra text is spaced tightly.

**Why it matters**

- The screen looks and feels more consistent with the rest of PathOS and with the intended design.
- Users can see what the score refers to, find the evidence section more easily, and use the charts without clipped labels or wasted space.

---

## Card balance and radar labels (third run — March 5, 2026)

**What changed for users**

- **Trajectory and Radar cards** now have the same height and feel like equal partners. The Trajectory card no longer looks like a small strip in a big box; its chart is a bit larger and centered in the card. Both cards sit in a row with a shared minimum height so the layout is balanced.
- **Radar chart labels** (e.g. “Keywords Coverage”, “Leadership & Scope”) no longer blow up to huge size on wider screens. The radar is drawn at a fixed size so the labels stay readable and stay inside the card at common desktop widths.

**Why it matters**

- The two charts are easier to compare and the page feels more polished. Users no longer see oversized or clipped radar text.

---

## Readiness Trajectory: Actual vs Possible (v0 parity — March 5, 2026)

**What users will notice**

- The **Readiness Trajectory** chart now shows **two lines**: your actual progress over time (solid orange) and where you could be if you complete selected actions (dashed, muted). A small legend in the card shows “Actual” and “Possible.”
- Clearer **trust framing**: under the chart, copy explains what each line means and that data is local-only. “Show assumptions” expands to a short list (e.g. selected actions completed, target role unchanged). Hovering a point on the chart shows both values and a note that “Possible” assumes selected actions completed.

**Why it matters**

- Users can compare **plan vs evidence** in one place: the solid line is where they are, the dashed line is where they could be. The microcopy and tooltip make it obvious what is factual (actual progress) and what is conditional (possible path), so the feature stays trust-first and transparent.
