# MoneyMind QA Bug Report

Date: 2026-05-06  
Product: MoneyMind  
Scope: live production route checks, representative lesson payload checks, simulator/API checks, repo/source audit

## Overall Score

`6/10`

MoneyMind is structurally stronger than MindSutra and MindSparc. The lesson registry, learn flow, catalog, and content footprint are real. But it is not fully customer-ready because the simulator backend is failing in production, some media URLs return `404`, and the local source of truth is incomplete.

## What Was Verified

- live routes `/moneymind`, `/moneymind/course/level-1` through `/level-6` returned `200 OK`
- representative lesson routes `/moneymind/learn/level-1/MM_L1_1` through `/level-6/MM_L6_1` returned `200 OK`
- live simulator/API routes were checked:
  - `/api/moneymind/merchants`
  - `/api/moneymind/wallet/101`
  - `/api/moneymind/bank/accounts/101`
  - `/api/moneymind/chat`
- representative course and lesson payloads were inspected from production HTML
- local course, lesson, simulator, and catalog files were inspected

## P1 Bugs

### 1. Core MoneyMind simulator APIs are failing in production

The following production endpoints returned `500 Internal Server Error` on 2026-05-06:
- `https://robodynamics.in/api/moneymind/merchants`
- `https://robodynamics.in/api/moneymind/wallet/101`
- `https://robodynamics.in/api/moneymind/bank/accounts/101`

Their bodies returned:
- `{"error":"fetch failed"}`

Impact:
- UPI simulator cannot fetch merchants
- ATM simulator cannot fetch wallet or account data
- bank portal cannot load accounts
- core “interactive lab” value proposition is broken

### 2. Course preview assets and lesson media URLs are missing in production

The following production assets returned `404 Not Found` on 2026-05-06:
- `https://robodynamics.in/moneymind/previews/MM_L1_1.png`
- `https://robodynamics.in/moneymind/l2/bank-building.png`

This is especially serious because the live payload explicitly references these assets.

Impact:
- course previews can silently degrade
- lesson visuals may appear broken during core learning flows
- customer trust drops quickly when a “premium” tutoring product shows missing media

### 3. Simulator components are written to fake success even if backend actions fail

In [BankPortal.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/components/moneymind/BankPortal.tsx), account creation intentionally falls back to a success state even when the API request fails.

Relevant behavior:
- `createAccount('SAVINGS')` is attempted
- on error, the code comments:
  - `Even if API fails, let's simulate success for the lesson experience`

Impact:
- the product can teach false system behavior
- QA can miss real backend defects
- users may think actions worked when they did not

## P2 Bugs

### 4. Important source files referenced by the app are missing from this checkout

The course page imports:
- `@/lib/moneymindCourseData`

But that file is not present in this checkout.

References:
- [page.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/moneymind/course/[level]/page.tsx:1)

Impact:
- repo is not a reliable source of truth
- future debugging and maintenance are harder
- local QA/build confidence is reduced

### 5. MoneyMind API route source files are not present in this checkout

The UI clearly depends on:
- `/api/moneymind/chat`
- `/api/moneymind/progress/complete`
- wallet, bank, merchant, ATM, and UPI API routes

But in this checkout, I did not find matching `app/api/moneymind/...` route files.

Impact:
- backend behavior cannot be audited or fixed from this repo state
- production may be drifting away from the checked-in source

### 6. Course page preview experience is weaker than the actual lesson product

The live course page for Level 1 shows generic copy such as:
- `Master the concept of What is Money? in this interactive mission.`
- `High-fidelity simulator loaded for this module.`

But the actual lesson payload is much richer, with:
- concrete objective
- multi-step pedagogy
- worked examples
- role-play framing

Impact:
- the course page undersells the product
- conversion quality is weaker than it needs to be

### 7. `Resume` appears too eagerly on course pages

In the live Level 1 course page, the selected lesson shows both:
- `Start Lesson`
- `Resume`

even at zero progress.

Impact:
- confusing onboarding state
- signals weak progress logic on the course shell

## P3 Bugs

### 8. There are visible encoding/copy-quality issues in the local UI source

Several local source files show mojibake/encoding corruption such as:
- `Â·`
- garbled emoji sequences like `ðŸ...`
- corrupted bullet/arrow symbols

Observed in:
- [MoneyMindCourseClient.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/moneymind/course/[level]/MoneyMindCourseClient.tsx:43)
- [LessonPlayer.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/moneymind/learn/[level]/[lessonId]/LessonPlayer.tsx:17)
- [moneyMindCatalog.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/moneyMindCatalog.ts:1)
- [page.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/moneymind/page.tsx:5)

The live site did not show the worst of this in the inspected pages, but it is a maintenance and presentation risk.

### 9. Product-level naming and level framing are inconsistent in local source

In the local lesson player, the level labels are:
- `Level 2 — Earning & Saving`
- `Level 3 — Smart Spending`
- `Level 4 — Banking Basics`
- `Level 5 — Digital Money`
- `Level 6 — Money Mindset`

But the actual catalog names are:
- `Bank & ATM Explorer`
- `Digital Money & Safety Lab`
- `Smart Spending & Budgeting`
- `Grow, Protect & Decide`
- `Real-World Readiness`

Impact:
- inconsistent user expectations
- weakens the professionalism of the curriculum system

## Strengths

MoneyMind does have meaningful advantages:

- live lesson routes work across all 6 levels
- lesson payloads are richer and more pedagogically structured than the course shell suggests
- the curriculum progression is commercially strong
- the product has a clearer “real-world learning” identity than most of the other tutor products
- Levels 1-6 form a believable revenue product if the backend/media issues are fixed

## Business Readiness View

### What is already good

- strongest monetizable concept among the current portfolio
- good breadth across childhood to teen finance
- lesson architecture exists
- level progression is clear

### What blocks revenue today

- failing simulator APIs
- missing production media assets
- incomplete repo source of truth
- course shell not doing justice to lesson depth

## Recommended Fix Order

1. Restore/fix all `/api/moneymind/*` backend paths, starting with merchants, wallet, and bank accounts.
2. Fix missing media assets referenced by course and lesson payloads.
3. Restore missing source files such as `moneymindCourseData` into the repo.
4. Remove fake-success fallback behavior from simulator actions.
5. Improve course card copy and preview rendering so the top-of-funnel matches actual lesson quality.
6. Clean encoding/copy corruption in local UI files.

## Final Verdict

MoneyMind is the closest of the current products to being a real sellable business product, but it is still not launch-clean.

Current readiness:
- concept: `8.5/10`
- curriculum/product structure: `7.5/10`
- technical reliability: `4.5/10`
- simulator trustworthiness: `4/10`
- media completeness: `4.5/10`
- customer readiness overall: `6/10`

