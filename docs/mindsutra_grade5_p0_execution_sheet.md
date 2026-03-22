# MindSutra Grade 5 P0 Execution Sheet

Date: March 19, 2026
Scope: Launch-blocking checks only for MindSutra Grade 5.
Status legend: Pass / Fail / Partial / Not Run

## Entry, Routing, and Course Integrity

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG5-P0-01 | Grade 5 is discoverable from intended homepage/product flow | Fail | Production root still old AptiPath360 home during last audit | Root home not aligned | FE/JSP |
| MSG5-P0-02 | Product-first navigation reaches MindSutra cleanly | Partial | `/mindsutra` exists in prod | Root still not product-first | FE |
| MSG5-P0-03 | Grade 5 course page resolves correctly | Pass | `/vedic-math/grade-5` exists in product design and routing | None | FE |
| MSG5-P0-04 | Grade 5 demo resolves to Grade 5 tutor | Partial | Demo redirect token showed `grade=5` | Need renewed verification after route cleanup | FE/BE |
| MSG5-P0-05 | Grade 5 loads Grade 5 course ID | Pass | Production start API returned `courseId=vedic_math_g5` | None | BE |
| MSG5-P0-06 | Grade 5 loads intended Grade 5 chapter | Fail | Tested launch normalized to `VM_G5_L1_NIKHILAM_NEAR100` instead of requested chapter | Chapter mapping gap | BE/Content |
| MSG5-P0-07 | No fallback to legacy generic vedic tutor | Pass | No `courseId=vedic_math` in checked Grade 5 launch | None | BE |
| MSG5-P0-08 | Deep links open correct Grade 5 route | Partial | Grade 5 route works but chapter normalization issue remains | Chapter selection trust issue | FE/BE |

## Course and Demo Integrity

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG5-P0-09 | Grade 5 course title/description are correct | Partial | Product page design exists in repo | Live browser audit not yet run | FE/Content |
| MSG5-P0-10 | Lesson plan shown matches Grade 5 tutor content | Partial | API and course-page content need side-by-side verification | Pending | FE/Content |
| MSG5-P0-11 | Demo is a learning preview, not a raw question dump | Partial | Backend structure supports preview flow | Browser validation pending | FE |
| MSG5-P0-12 | Demo limits are clearly communicated | Partial | Expected on course page | Live page audit pending | FE |
| MSG5-P0-13 | Paid value is clearly richer than demo | Partial | Product promise exists | Dashboards/course-hub still unresolved | FE/BE |

## Tutor Pedagogy Basics

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG5-P0-14 | Topic is introduced before first question | Partial | Tutor code supports intro-first sequencing | Needs live Grade 5 validation | FE/BE |
| MSG5-P0-15 | Tutor teaches in small steps | Pass | Grade-based chapter structure exists for Grade 5 | None | Content/BE |
| MSG5-P0-16 | Worked example exists | Pass | Grade 5 chapter content includes worked/demo patterns | None | Content |
| MSG5-P0-17 | Guided practice exists | Pass | Grade 5 flow supports exercise progression | None | Content |
| MSG5-P0-18 | Supportive mistake feedback exists | Pass | Tutor/content patterns support retry feedback | None | Content/BE |
| MSG5-P0-19 | Retry uses smaller-step support | Partial | Logic exists | Need live validation | FE/BE |
| MSG5-P0-20 | Grade 5 language is appropriate | Partial | Expected from content | Need live audit | Content |

## Adaptive Teaching Core

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG5-P0-21 | Tutor is not locked only to grade label | Partial | Some adaptive logic exists | No full mastery-routing proof | BE |
| MSG5-P0-22 | Baseline learner understanding is assessed | Fail | No proven diagnostic flow in prod | Missing | Product/BE |
| MSG5-P0-23 | Foundation gaps can be detected | Partial | Behavior engine exists | No explicit mastery-gap UI/model | BE |
| MSG5-P0-24 | Advanced readiness can be detected | Partial | Some adaptive behavior exists | No explicit acceleration proof | BE |
| MSG5-P0-25 | Personalized starting point exists | Fail | Still course-start-first, not mastery-start-first | Missing | Product/BE |
| MSG5-P0-26 | Weak foundations trigger recovery path | Partial | Retry logic exists | Structured remedial flow not proven | BE/Content |
| MSG5-P0-27 | Strong learners can be accelerated | Fail | No proof in production | Missing | Product/BE |
| MSG5-P0-28 | Student-safe language avoids harmful labels | Pass | Current tutor language is supportive | None | Content |

## Parent and Student Trust Loop

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG5-P0-29 | Student dashboard is live-backed | Fail | Production student API 404 during audit window | Missing | FE/BE |
| MSG5-P0-30 | Parent dashboard is live-backed | Fail | Production parent API 404 during audit window | Missing | FE/BE |
| MSG5-P0-31 | Parent and student dashboards tell same story | Fail | Cannot verify without live APIs | Trust loop broken | FE/BE |
| MSG5-P0-32 | Parent sees current lesson, weak areas, next step | Fail | Not production-backed | Missing | FE/BE |
| MSG5-P0-33 | Student sees progress, resume, achievements | Partial | UI exists | Real data missing | FE/BE |

## Course Hub and Tutor Continuity

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG5-P0-34 | Enrolled learner has course hub/main page | Fail | Not proven in live flow | Missing | FE/Product |
| MSG5-P0-35 | Course hub shows lesson map and next action | Fail | Not proven | Missing | FE |
| MSG5-P0-36 | Tutor mode enters from chosen lesson | Partial | Demo/course path exists | Paid continuity missing | FE |
| MSG5-P0-37 | Tutor mode has reliable back path | Partial | Code support exists | Browser validation pending | FE |
| MSG5-P0-38 | Progress is preserved on exit/resume | Partial | Resume mechanics exist in code | Production flow unverified | FE/BE |

## Pricing and Entitlement Trust

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG5-P0-39 | Grade 5 price is shown correctly | Partial | Need live Grade 5 page check | Pending | FE |
| MSG5-P0-40 | Course page and CTA prices match | Partial | Pending Grade 5 page audit | Pending | FE |
| MSG5-P0-41 | Checkout receives correct Grade 5 pricing | Not Run | Not audited | Need checkout validation | FE/BE |
| MSG5-P0-42 | Purchased entitlement matches Grade 5 SKU | Not Run | Not audited | Need payment/enrollment test | BE |
| MSG5-P0-43 | Refund/access terms are visible and clear | Partial | Pending live Grade 5 page check | Pending | FE |

## Reliability and Access

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG5-P0-44 | No critical 404s on key Grade 5 routes | Fail | Dashboard APIs 404 in prod audit | Critical route gap | FE/BE |
| MSG5-P0-45 | Tutor start/resume/check-answer stack works | Partial | Start routing works | More API path validation needed | BE |
| MSG5-P0-46 | Typing fallback works if mic fails | Partial | Code supports it | Browser validation pending | FE |
| MSG5-P0-47 | Mobile usability is acceptable | Not Run | No live mobile/browser pass yet | Need browser audit | FE |

## Short-Form Attention Fitness

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG5-P0-48 | Time to first interaction is short | Partial | Intro-first sequencing exists | Need live measurement | FE |
| MSG5-P0-49 | Time to first success is short | Not Run | Not measured yet | Need timed user-flow test | Product/FE |
| MSG5-P0-50 | Long explanations are split into short beats | Partial | Content likely chunked | Needs live review | Content/FE |
| MSG5-P0-51 | Long topics are segmented | Pass | Grade 5 content has grouped structure | None | Content |
| MSG5-P0-52 | Learner sees micro-progress cues | Partial | Tutor UI includes rewards/progress | Live proof pending | FE |

## Current P0 Outcome

- Pass: 12
- Fail: 15
- Partial: 21
- Not Run: 4

## Immediate Blockers
- root homepage still not aligned to launch navigation path
- requested Grade 5 chapter is not always the chapter that starts
- no live-backed dashboards
- no course hub before tutor mode
- no mastery-based placement proof
- no advanced acceleration proof