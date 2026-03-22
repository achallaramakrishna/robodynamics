# Generic Platform P0 Execution Sheet

Date: March 19, 2026
Scope: Launch-blocking checks for the shared AI tutor engine and platform.
Status legend: Pass / Fail / Partial / Not Run

## Platform Routing and Genericity

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| GP-P0-01 | Product-first homepage exists for launch path | Fail | Production root still old AptiPath360 home during audit | Root deployment gap | FE/JSP |
| GP-P0-02 | Product route and product family stay aligned | Partial | `/mindsutra` exists; other families uneven | Not fully unified | FE |
| GP-P0-03 | No cross-product fallback | Partial | MindSutra fixed; full cross-family audit pending | Need MindSpark checks | BE |
| GP-P0-04 | No cross-grade fallback | Partial | Grade-to-course routing improved | More grades need full verification | BE |
| GP-P0-05 | No generic legacy fallback for grade-based products | Partial | MindSutra G4/G5 largely protected | Need platform-wide confirmation | BE |
| GP-P0-06 | Deep links are SKU-safe | Partial | Some live checks passed | Need broader SKU audit | FE/BE |

## Shared Tutor Engine Integrity

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| GP-P0-07 | Tutor shell works across SKUs by configuration | Partial | Shared tutor route and content-template architecture exist | Needs cross-SKU production validation | FE/BE |
| GP-P0-08 | Course/chapter metadata comes from selected course, not hard-coded page assumptions | Partial | Backend content-template is generic; some page constants remain | Need audit across products | FE/BE/Content |
| GP-P0-09 | Intro-first flow is generic, not only Grade 4-specific | Partial | Shared tutor code updated; needs cross-grade proof | Browser validation pending | FE |
| GP-P0-10 | Typing fallback exists if voice fails | Partial | Code support exists | Needs live validation | FE |
| GP-P0-11 | Core tutor APIs are stable (`catalog`, `start`, `resume`, `next-question`, `check-answer`) | Partial | `start` verified; others not fully audited in prod | Need full API sweep | BE |

## Adaptive Platform Core

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| GP-P0-12 | Platform does not teach only by grade | Fail | No proven mastery-placement product flow | Missing | Product/BE |
| GP-P0-13 | Baseline diagnostic / starting-level logic exists | Fail | Not proven in prod | Missing | Product/BE |
| GP-P0-14 | Foundation-gap recovery path exists | Partial | Retry/adaptation exists | Structured route not proven | BE/Content |
| GP-P0-15 | Strong-learner acceleration exists | Fail | Not proven | Missing | Product/BE |
| GP-P0-16 | Learner model updates over time | Partial | Behavior classifier exists | Mastery model not exposed/validated | BE |

## Dashboards and Trust Loop

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| GP-P0-17 | Student dashboard API is live | Fail | `/api/student/home` returned 404 | Missing | FE/BE |
| GP-P0-18 | Parent dashboard API is live | Fail | `/api/parent/dashboard` returned 404 | Missing | FE/BE |
| GP-P0-19 | Dashboards are course-aware and SKU-safe | Fail | Cannot verify without live APIs | Missing | FE/BE |
| GP-P0-20 | Dashboards show real data, not placeholders | Fail | Current live state does not prove real backing | Missing | FE/BE |

## Pricing, Entitlement, and Reliability

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| GP-P0-21 | Selected SKU price stays consistent through flow | Partial | Product pages support pricing, but not fully audited across SKUs | Need validation | FE/BE |
| GP-P0-22 | Entitlement matches purchased SKU | Not Run | Not audited | Need payment path validation | BE |
| GP-P0-23 | No critical 404s on key product/tutor/dashboard routes | Fail | Dashboard endpoints 404 | Critical | FE/BE |
| GP-P0-24 | Mobile launch path is usable | Not Run | No browser/mobile audit yet | Need audit | FE |
| GP-P0-25 | Time to first interaction remains short in tutor flow | Partial | Shared intro fix exists | Need live timing audit | FE |

## Current P0 Outcome

- Pass: 0
- Fail: 10
- Partial: 13
- Not Run: 2

## Immediate Platform Blockers
- production root homepage not aligned to launch UX
- no live dashboard APIs
- no proven mastery-based placement system
- no proven advanced acceleration path
- shared generic engine still needs cross-SKU launch validation
- key reliability gaps remain on production routes