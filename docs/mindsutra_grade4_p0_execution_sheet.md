# MindSutra Grade 4 P0 Execution Sheet

Date: March 19, 2026
Scope: Launch-blocking checks only for MindSutra Grade 4.
Status legend: Pass / Fail / Partial / Not Run

## Entry, Routing, and Course Integrity

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG4-P0-01 | Grade 4 is discoverable from the intended homepage/product flow | Fail | Production root still old AptiPath360 home during last audit | Root home not aligned | FE/JSP |
| MSG4-P0-02 | Product-first navigation reaches MindSutra cleanly | Partial | `/mindsutra` exists in prod | Root still not product-first | FE |
| MSG4-P0-03 | Grade 4 course page resolves correctly | Pass | `/vedic-math/grade-4` live | None | FE |
| MSG4-P0-04 | Grade 4 demo resolves to Grade 4 tutor | Pass | Demo redirect token shows `grade=4` | None | FE/BE |
| MSG4-P0-05 | Grade 4 loads Grade 4 course ID | Pass | `courseId=vedic_math_g4` in prod start API | None | BE |
| MSG4-P0-06 | Grade 4 loads Grade 4 active chapter | Pass | `activeChapterCode=VM_G4_L1_FAST_ADDITION` | None | BE |
| MSG4-P0-07 | No fallback to legacy generic vedic tutor | Pass | No `courseId=vedic_math` in checked Grade 4 launch | None | BE |
| MSG4-P0-08 | Deep links open correct Grade 4 route | Pass | Grade 4 demo deep link works | None | FE/BE |

## Course and Demo Integrity

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG4-P0-09 | Grade 4 course title/description are correct | Pass | Grade 4 course page content matches Grade 4 | None | FE/Content |
| MSG4-P0-10 | Lesson plan shown matches Grade 4 course | Partial | Course page has Grade 4 list, API has Grade 4 lesson payload | Needs browser comparison lesson-to-tutor | FE/Content |
| MSG4-P0-11 | Demo is a learning preview, not a raw question dump | Partial | Backend supports intro/demo/guided structure | Visual click-through still pending | FE |
| MSG4-P0-12 | Demo limits are clearly communicated | Pass | Course page explains free preview/locked content | None | FE |
| MSG4-P0-13 | Paid value is clearly richer than demo | Partial | Pricing/course page suggests this | Dashboard/course-hub proof missing | FE/BE |

## Tutor Pedagogy Basics

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG4-P0-14 | Topic is introduced before first question | Partial | Payload contains intro hooks and subtopic intro | Browser verification pending | FE/BE |
| MSG4-P0-15 | Tutor teaches in small steps | Pass | Lesson payload contains chunked exercise flow and prompts | None | Content/BE |
| MSG4-P0-16 | Worked example exists | Pass | `workedExamples` and `boardDemo` present | None | Content |
| MSG4-P0-17 | Guided practice exists | Pass | Guided prompts and exercise progression present | None | Content |
| MSG4-P0-18 | Supportive mistake feedback exists | Pass | `instantFeedbackRetry` and encouragement present | None | Content/BE |
| MSG4-P0-19 | Retry uses smaller-step support | Partial | Retry text exists | Need end-to-end check that UI uses it correctly | FE/BE |
| MSG4-P0-20 | Grade 4 language is appropriate | Pass | Payload is simple and mostly age-appropriate | None | Content |

## Adaptive Teaching Core

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG4-P0-21 | Tutor is not locked only to grade label | Partial | Behavior/archetype logic exists | No live mastery-band placement UX yet | BE/FE |
| MSG4-P0-22 | Baseline learner understanding is assessed | Fail | No proven production diagnostic for Grade 4 flow | Placement missing | Product/BE |
| MSG4-P0-23 | Foundation gaps can be detected | Partial | Behavior classifier exists | No explicit learning-gap model visible | BE |
| MSG4-P0-24 | Advanced readiness can be detected | Partial | Some adaptive logic exists | No explicit acceleration proof | BE |
| MSG4-P0-25 | Personalized starting point exists | Fail | Course still starts from default chapter flow | No placement-based entry | Product/BE |
| MSG4-P0-26 | Weak foundations trigger recovery path | Partial | Retry/behavior adaptation exists | No structured remedial path validated | BE/Content |
| MSG4-P0-27 | Strong learners can be accelerated | Fail | No proof of advanced routing | Missing | Product/BE |
| MSG4-P0-28 | Student-safe language avoids harmful labels | Pass | Current messages are encouraging | None | Content |

## Parent and Student Trust Loop

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG4-P0-29 | Student dashboard is live-backed | Fail | `/api/student/home` returned 404 in prod audit | Dashboard backend missing | FE/BE |
| MSG4-P0-30 | Parent dashboard is live-backed | Fail | `/api/parent/dashboard` returned 404 in prod audit | Dashboard backend missing | FE/BE |
| MSG4-P0-31 | Parent and student dashboards tell same story | Fail | Cannot verify due to missing APIs | Trust loop broken | FE/BE |
| MSG4-P0-32 | Parent sees current lesson, weak areas, next step | Fail | Not production-backed | Missing | FE/BE |
| MSG4-P0-33 | Student sees progress, resume, achievements | Partial | Student page exists | Real data missing | FE/BE |

## Course Hub and Tutor Continuity

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG4-P0-34 | Enrolled learner has course hub/main page | Fail | No proven live Grade 4 course hub before tutor mode | Missing | FE/Product |
| MSG4-P0-35 | Course hub shows lesson map and next action | Fail | Not established in live flow | Missing | FE |
| MSG4-P0-36 | Tutor mode enters from chosen lesson | Partial | Lesson launch exists from demo/course CTA | Paid course-hub path not proven | FE |
| MSG4-P0-37 | Tutor mode has reliable back path | Partial | Code contains save-and-back behavior | Browser verification pending | FE |
| MSG4-P0-38 | Progress is preserved on exit/resume | Partial | Resume code exists | Production flow not proven | FE/BE |

## Pricing and Entitlement Trust

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG4-P0-39 | Grade 4 price is shown correctly | Pass | Grade 4 page shows single-grade price | None | FE |
| MSG4-P0-40 | Course page and CTA prices match | Pass | Main and sticky CTA match on page HTML | None | FE |
| MSG4-P0-41 | Checkout receives correct Grade 4 pricing | Not Run | Not audited yet | Need checkout validation | FE/BE |
| MSG4-P0-42 | Purchased entitlement matches Grade 4 SKU | Not Run | Not audited yet | Need payment/enrollment test | BE |
| MSG4-P0-43 | Refund/access terms are visible and clear | Pass | Course page shows refund/lifetime access messaging | None | FE |

## Reliability and Access

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG4-P0-44 | No critical 404s on key Grade 4 routes | Fail | Dashboard APIs 404 | Critical route gap | FE/BE |
| MSG4-P0-45 | Tutor start/resume/check-answer stack works | Partial | Start API verified | Full stack not fully re-audited | BE |
| MSG4-P0-46 | Typing fallback works if mic fails | Partial | Code supports typed answer | Browser validation pending | FE |
| MSG4-P0-47 | Mobile usability is acceptable | Not Run | No live mobile/browser pass yet | Need browser audit | FE |

## Short-Form Attention Fitness

| ID | Check | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| MSG4-P0-48 | Time to first interaction is short | Partial | Intro-first fix deployed | Real timing needs browser test | FE |
| MSG4-P0-49 | Time to first success is short | Not Run | Not measured yet | Need timed user-flow test | Product/FE |
| MSG4-P0-50 | Long explanations are split into short beats | Partial | Content is chunked in payload | Live pacing still needs review | Content/FE |
| MSG4-P0-51 | Long topics are segmented | Pass | Chapter exercise flow split into A-I groups | None | Content |
| MSG4-P0-52 | Learner sees micro-progress cues | Partial | Tutor includes XP/badges/progress UI | Live proof still needed | FE |

## Current P0 Outcome

- Pass: 18
- Fail: 13
- Partial: 17
- Not Run: 4

## Immediate Blockers
- homepage/root discovery path not aligned to product-first launch path
- no live-backed student dashboard
- no live-backed parent dashboard
- no real course hub before tutor mode
- no proven adaptive placement/starting-point logic
- no proven advanced acceleration path
- some core tutor-flow items still need browser validation