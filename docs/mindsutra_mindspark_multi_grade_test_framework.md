# MindSutra + MindSpark Multi-Grade Test Framework

## Reusable Product, UX, and Pedagogical Test Cases

Date: March 19, 2026  
Scope: Reusable test framework for all grade-based AI tutor courses on the platform.

## Products Covered

### MindSutra
- Grade 4
- Grade 5
- Grade 6
- Grade 7
- Grade 8

### MindSpark
- Grade 4
- Grade 5
- Grade 6
- Grade 7
- Grade 8

## Why This Framework Exists

The AI tutor platform must not be hard-coded to one course.

A good platform should let us run the same product tests on:
- MindSutra Grade 4
- MindSutra Grade 5
- MindSutra Grade 6
- MindSutra Grade 7
- MindSutra Grade 8
- MindSpark Grade 4
- MindSpark Grade 5
- MindSpark Grade 6
- MindSpark Grade 7
- MindSpark Grade 8

The content should change by course and grade, but the platform quality bar should remain the same.

## Test Design Principle

There are two layers of tests:

1. Course Journey Tests
These are reusable and should pass for every course-grade combination.

2. Platform Generic Tests
These prove the engine, routing, dashboards, demo rules, and persistence are not hard-coded to one tutor.

## Course SKUs Under Test

| SKU | Product | Grade | Expected Course Type |
|---|---|---:|---|
| MS-G4 | MindSutra | 4 | Vedic Math |
| MS-G5 | MindSutra | 5 | Vedic Math |
| MS-G6 | MindSutra | 6 | Vedic Math |
| MS-G7 | MindSutra | 7 | Vedic Math |
| MS-G8 | MindSutra | 8 | Vedic Math |
| MP-G4 | MindSpark | 4 | Aptitude & Reasoning |
| MP-G5 | MindSpark | 5 | Aptitude & Reasoning |
| MP-G6 | MindSpark | 6 | Aptitude & Reasoning |
| MP-G7 | MindSpark | 7 | Aptitude & Reasoning |
| MP-G8 | MindSpark | 8 | Aptitude & Reasoning |

## Execution Model

### Reusable Course Journey Suite
- 52 tests per SKU
- 10 SKUs total
- Total course-level executions: 520

### Generic Platform Suite
- 14 platform tests
- run once per release, and again after major routing/dashboard changes

### Total Recommended Release Checks`r`n- 546 checks total

## Part A: Reusable Course Journey Suite

These 52 tests should be run for each of the 10 SKUs.

## 1. Discovery and Entry

### TC-R01 Course discoverability
Expected:
- user can discover the course from the correct product surface
- grade and product are visible without guessing

### TC-R02 Correct CTA set
Expected:
- user sees clear `Explore`, `Demo`, and `Buy` or equivalent actions

### TC-R03 Correct grade/course landing
Expected:
- clicking the course opens the correct grade-specific page
- no redirect to the wrong grade
- no redirect to the wrong product

### TC-R04 Minimal card clarity
Expected:
- product card stays short and useful
- no overload on the discovery surface

## 2. Course Detail Page

### TC-R05 Correct course title
Expected:
- page title matches product + grade

### TC-R06 Correct course description
Expected:
- description matches the course domain
- Vedic Math for MindSutra
- Aptitude & Reasoning for MindSpark

### TC-R07 Correct lesson count
Expected:
- lesson count shown matches actual course structure

### TC-R08 Detailed lesson breakup
Expected:
- each lesson shows title, duration, goals, and subtopic framing

### TC-R09 Demo CTA visibility
Expected:
- free preview/demo CTA is visible and course-specific

### TC-R10 Purchase CTA visibility
Expected:
- buy CTA is visible above the fold and later in the page

### TC-R11 Parent trust content
Expected:
- page explains why this course matters for the child/grade

### TC-R12 Outcome clarity
Expected:
- page explains what the student should be able to do after the course

## 3. Demo vs Paid Flow

### TC-R13 Demo starts from the right course
Expected:
- demo uses the selected SKU, not a generic fallback

### TC-R14 Demo starts from the right grade
Expected:
- grade shown in token, chapter, and course mapping is correct

### TC-R15 Demo has intro value
Expected:
- demo is a learning preview, not just a question launcher

### TC-R16 Demo limit clarity
Expected:
- preview boundaries are clearly shown

### TC-R17 Paid value differentiation
Expected:
- full course benefits are clearly richer than the demo

## 4. Course Main Page and Navigation

### TC-R18 Course main page exists
Expected:
- after entering the course as an enrolled student, there is a course hub/dashboard

### TC-R19 Course hub shows lesson map
Expected:
- learner can see lessons and current progress

### TC-R20 Recommended next step
Expected:
- learner sees where to continue

### TC-R21 Resume works
Expected:
- learner can resume from current chapter/subtopic safely

### TC-R22 Tutor-mode entry
Expected:
- chosen lesson opens the correct tutor mode

### TC-R23 Back-to-course navigation
Expected:
- learner can return from tutor mode to course hub

## 5. Pedagogical Flow

### TC-R24 Topic intro before question
Expected:
- tutor introduces the concept before the first question

### TC-R25 Small-step explanation
Expected:
- tutor teaches one concept chunk at a time

### TC-R26 Worked example exists
Expected:
- learner sees one demonstration or modeled example

### TC-R27 Guided practice exists
Expected:
- tutor and student do one step together before independent work

### TC-R28 Independent attempt exists
Expected:
- learner gets a chance to try alone

### TC-R29 Checkpoint question exists
Expected:
- tutor checks understanding before moving on

### TC-R30 Correctness feedback quality
Expected:
- right/wrong feedback is supportive and specific

### TC-R31 Retry strategy
Expected:
- wrong answer triggers a better retry path, not repetition only

### TC-R32 Grade-appropriate language
Expected:
- language difficulty fits the grade and course domain

## 6. Clarity and Empathy

### TC-R33 Explicit clarity check
Expected:
- tutor asks whether learner understood the concept

### TC-R34 Clarity options visible
Expected:
- learner can choose options like `Clear`, `Maybe`, `Not Clear`

### TC-R35 Re-explain on confusion
Expected:
- `Not Clear` triggers simpler re-teaching

### TC-R36 Medium-support path
Expected:
- `Maybe` triggers one more example or scaffold

### TC-R37 Progression on confidence
Expected:
- `Clear` lets learner move forward without over-explaining

### TC-R38 Empathy for mistakes
Expected:
- tutor stays calm and encouraging after wrong answers

## 7. Adaptive Behavior

### TC-R39 Silent learner handling
Expected:
- tutor notices silence and gives a gentle recovery path

### TC-R40 Repeated error handling
Expected:
- tutor changes explanation after repeated wrong attempts

### TC-R41 Rushed learner handling
Expected:
- tutor slows down and emphasizes accuracy where needed

### TC-R42 Curious learner handling
Expected:
- doubts can be asked and answered in context

### TC-R43 Slow learner handling
Expected:
- tutor remains patient and keeps steps small

## 8. Engagement and Motivation

### TC-R44 XP visibility
Expected:
- learner can see points/XP progress

### TC-R45 Badge visibility
Expected:
- learner can see badges or similar reward objects

### TC-R46 Milestone visibility
Expected:
- learner can see milestone progress

### TC-R47 Engagement without clutter
Expected:
- rewards and visuals support learning without confusion

## 9. Student Dashboard

### TC-R48 Course-specific student progress
Expected:
- dashboard shows the active course and grade correctly

### TC-R49 Lesson/chapter progress
Expected:
- completed, in-progress, and next items are visible

### TC-R50 Performance visibility
Expected:
- accuracy, recent sessions, and weak areas are visible

## 10. Parent Dashboard

### TC-R51 Course-specific parent progress
Expected:
- parent dashboard shows the right course and grade

### TC-R52 Parent evidence of learning
Expected:
- parent can see chapter progress, weak areas, and what the tutor is doing next

## Part B: Generic Platform Tests

These 14 tests prove the engine is reusable and not hard-coded to one AI tutor.

### TC-G01 Correct course resolution by SKU
Expected:
- selected product + grade resolves to the correct course ID
- no generic fallback to unrelated course

### TC-G02 Correct chapter resolution by SKU
Expected:
- selected chapter belongs to the selected course and grade
- invalid chapter should fail safely or normalize within the same selected course only

### TC-G03 No cross-product fallback
Expected:
- MindSutra never falls into MindSpark
- MindSpark never falls into MindSutra

### TC-G04 No cross-grade fallback
Expected:
- Grade 4 never opens Grade 5 content unless user explicitly switches

### TC-G05 Catalog isolation
Expected:
- course page, demo page, and tutor page all reference the same course metadata

### TC-G06 Demo route genericity
Expected:
- same demo framework works across all SKUs by parameter only

### TC-G07 Tutor route genericity
Expected:
- same tutor route and engine shell works across all SKUs by course config only

### TC-G08 Dashboard data isolation
Expected:
- student and parent dashboards show data tied to the enrolled SKU only

### TC-G09 Progress persistence isolation
Expected:
- progress saved in one SKU does not overwrite another SKU

### TC-G10 Badge and XP isolation
Expected:
- badges, XP, milestones, and streaks attach to the right course/grade scope

### TC-G11 Checkout/product isolation
Expected:
- price, title, checkout route, and entitlement match the selected SKU

### TC-G12 Content-template genericity
Expected:
- lesson plan and chapter metadata come from course content files, not hard-coded UI constants only

### TC-G13 API contract consistency
Expected:
- `catalog`, `start`, `resume`, `next-question`, and dashboard APIs behave consistently across SKUs

### TC-G14 Unsupported SKU handling
Expected:
- invalid product/grade/chapter combinations fail clearly and safely, not by silently falling into another tutor

## Part C: Adaptive Placement and Personalization Tests

These 12 tests are mandatory for proving that the tutor is not teaching only by enrolled grade.

They should be run for every product family and for representative SKUs during release validation.

### TC-A01 Baseline diagnostic exists
Expected:
- first-time learner is assessed for actual mastery, not only enrolled grade

### TC-A02 Below-grade foundation detection
Expected:
- if a higher-grade learner lacks lower-grade basics, the tutor identifies the prerequisite gap

### TC-A03 Above-grade readiness detection
Expected:
- if a lower-grade learner shows advanced readiness, the tutor recognizes it safely

### TC-A04 Personalized starting point
Expected:
- tutor chooses the right lesson entry point based on mastery and not only course grade label

### TC-A05 Foundation recovery path
Expected:
- weak learners receive a structured remediation plan before being pushed into harder content

### TC-A06 Advanced learner acceleration
Expected:
- strong learners are not forced through unnecessary repetitive basics

### TC-A07 Dynamic learner-model refresh
Expected:
- learner profile updates after sessions based on performance, pace, confusion, and consistency

### TC-A08 Enrolled grade vs working level separation
Expected:
- system distinguishes between school grade and current working mastery level

### TC-A09 Parent-facing adaptive visibility
Expected:
- parent dashboard shows actual foundation gaps, current working band, and readiness signals in clear language

### TC-A10 Student-safe adaptive language
Expected:
- student messaging stays encouraging and never labels the child as weak or below-grade in a harmful way

### TC-A11 Curriculum bridge planning
Expected:
- remediation still links back to enrolled-grade curriculum goals so the child can catch up meaningfully

### TC-A12 No one-size-fits-all chapter delivery
Expected:
- the same lesson can be delivered differently depending on learner profile, confidence, and prior understanding

## Updated Release Gates

### Gate A: Single-SKU Readiness
Example:
- MindSutra Grade 4 passes all 52 reusable journey tests
- adaptive tests relevant to that SKU pass

### Gate B: Product-Family Readiness
Example:
- MindSutra Grade 4 and Grade 5 both pass all 52 reusable tests
- MindSpark Grade 4 and Grade 5 both pass all 52 reusable tests
- all 14 generic platform tests pass
- adaptive placement tests pass for representative strong and weak learner profiles

### Gate C: Full Platform Readiness
Example:
- all 10 SKUs pass all 52 reusable tests
- all 14 generic platform tests pass
- all 12 adaptive placement tests pass

## Important Product Principle

The tutor must not assume:
- all Grade 4 students are the same
- all Grade 6 students are ready for Grade 6 delivery
- all younger students must be kept to lower difficulty

The platform should use:
- grade for curriculum alignment
- mastery for actual teaching path
- behavior and confidence for pacing and support style
## Part D: Pricing and Packaging Tests

These 10 tests validate whether grade-based pricing, bundles, and checkout logic are trustworthy and consistent.

### TC-PG01 Grade-specific price resolution
Expected:
- selected grade shows the correct price for that exact SKU

### TC-PG02 Product-page pricing consistency
Expected:
- product page, course page, sticky CTA, and purchase CTA all show the same grade price

### TC-PG03 Checkout pricing consistency
Expected:
- checkout receives and displays the same price shown on the course page

### TC-PG04 Demo-to-buy pricing consistency
Expected:
- upgrade CTA from demo shows the correct grade-specific price

### TC-PG05 Bundle comparison clarity
Expected:
- single-grade vs multi-grade vs family bundle comparisons are easy to understand

### TC-PG06 Upgrade-path clarity
Expected:
- if parent buys one grade and later wants a higher grade or full bundle, the upgrade path is understandable

### TC-PG07 No wrong-grade price leakage
Expected:
- navigating between grades never leaves stale pricing from another grade on screen

### TC-PG08 Enrollment-price alignment
Expected:
- purchased grade, entitlement, and dashboard access match the price plan that was bought

### TC-PG09 Parent trust in pricing logic
Expected:
- if grades have different prices, the value difference is understandable and not arbitrary

### TC-PG10 Refund and access clarity
Expected:
- refund terms, access duration, and renewal model are clear for every grade and bundle
## Part E: Assessment Reliability and Learner Modeling Tests

These 8 tests validate whether the system can trust its own learner model over time.

### TC-LM01 Diagnostic reliability over time
Expected:
- placement is refined across multiple sessions and not frozen from one short diagnostic only

### TC-LM02 Guessing detection
Expected:
- system can detect patterns suggesting lucky guessing or shallow correctness

### TC-LM03 Inconsistent performance handling
Expected:
- if learner swings between high and low performance, tutor avoids overreacting from a single data point

### TC-LM04 Parent-help or external-help suspicion
Expected:
- unexpected jumps in performance trigger re-validation instead of blind promotion

### TC-LM05 Confidence vs correctness separation
Expected:
- learner model distinguishes between confident mastery and fragile correctness

### TC-LM06 Explain-your-step checks
Expected:
- system sometimes checks process understanding, not only final answer correctness

### TC-LM07 Stable mastery thresholding
Expected:
- promotion to harder paths requires enough evidence, not one good streak alone

### TC-LM08 Placement recovery after bad session
Expected:
- one poor session does not permanently demote a learner unfairly

## Part F: Misconception and Remediation Tests

These 8 tests validate whether the tutor understands the kind of mistake, not just that an answer was wrong.

### TC-MR01 Error-type detection
Expected:
- tutor distinguishes between conceptual, procedural, careless, and memory errors

### TC-MR02 Misconception-specific reteaching
Expected:
- reteaching changes according to the type of misunderstanding

### TC-MR03 Place-value and number-sense mistake handling
Expected:
- foundational arithmetic confusions trigger targeted remediation

### TC-MR04 Carry/borrow confusion handling
Expected:
- tutor identifies and repairs carry/borrow misconceptions explicitly

### TC-MR05 Pattern memorization risk detection
Expected:
- tutor checks whether learner is memorizing surface patterns without understanding

### TC-MR06 Reasoning-fallacy detection
Expected:
- in MindSpark, tutor identifies weak logic steps, not just final wrong choices

### TC-MR07 Micro-remediation step design
Expected:
- tutor can break a concept into an even smaller corrective step after repeated failure

### TC-MR08 Return-to-main-flow recovery
Expected:
- after remediation, learner is cleanly brought back into the main lesson sequence

## Part G: Retention, Revision, and Progression Tests

These 7 tests validate whether the tutor supports durable learning rather than one-time completion.

### TC-RV01 Spaced revision support
Expected:
- previously learned concepts are revisited after a meaningful delay

### TC-RV02 Weak-topic revisit
Expected:
- weak concepts come back automatically in later sessions

### TC-RV03 Lesson recap quality
Expected:
- end-of-session recap reflects what was actually learned and what remains weak

### TC-RV04 Forgetting recovery path
Expected:
- if learner forgets an earlier concept, tutor rebuilds without shame

### TC-RV05 Bridge-back to current curriculum
Expected:
- revision and remediation still move learner toward enrolled-grade outcomes

### TC-RV06 Promotion after retention proof
Expected:
- harder material is assigned only after earlier mastery holds over time

### TC-RV07 Milestones reflect retained mastery
Expected:
- badges and milestones are tied to real retained progress, not only first-pass completion

## Part H: Parent Communication and Trust Tests

These 7 tests validate whether the parent-facing experience creates trust and clarity.

### TC-PT01 Dashboard narrative quality
Expected:
- dashboard explains what the child learned, not just numbers and percentages

### TC-PT02 Parent action guidance
Expected:
- dashboard tells parent what to do next or what not to worry about

### TC-PT03 AI tutor trust explanation
Expected:
- product explains why the tutor is reliable: remembers progress, adapts, and revises intelligently

### TC-PT04 Learning-level explanation
Expected:
- parent can understand enrolled grade, current mastery band, and foundation gaps clearly

### TC-PT05 Non-alarming weakness reporting
Expected:
- weak-area messaging is informative, not shaming or panic-inducing

### TC-PT06 Human-escalation recommendation
Expected:
- if learner repeatedly struggles beyond normal adaptation, product can recommend extra support appropriately

### TC-PT07 Promise-vs-reality consistency
Expected:
- what marketing promises about dashboards, adaptation, and tutor empathy matches the actual product behavior

## Part I: Voice, Device, and Accessibility Resilience Tests

These 8 tests validate whether the tutor survives real-world conditions.

### TC-VD01 No-mic fallback
Expected:
- learner can continue by typing if voice permission is denied

### TC-VD02 Speech-recognition failure recovery
Expected:
- tutor recovers cleanly from bad transcript or inaudible input

### TC-VD03 Replay and repeat support
Expected:
- learner can replay explanations or prompts easily

### TC-VD04 Cross-device continuity
Expected:
- progress and session continuity survive movement across phone, tablet, and laptop

### TC-VD05 Mobile usability
Expected:
- buttons, navigation, and lesson reading remain easy on a small phone screen

### TC-VD06 Visual accessibility
Expected:
- contrast, text size, and focus visibility are strong enough for children and parents

### TC-VD07 Low-friction recovery from misclicks
Expected:
- learner can safely recover from accidental exits, back presses, or route changes

### TC-VD08 Performance under slow conditions
Expected:
- tutor remains usable under slow network or delayed media responses without breaking flow

## Part J: Analytics and Observability Tests

These 7 tests validate whether the product can be improved through real usage data.

### TC-AN01 Funnel event coverage
Expected:
- home visit, product visit, course visit, demo start, lesson start, and purchase intent are trackable

### TC-AN02 Learning event coverage
Expected:
- explanation viewed, checkpoint answered, retry loop, doubt asked, and lesson completion are trackable

### TC-AN03 Confusion signal tracking
Expected:
- hesitation, repeated wrong answers, and clarity-check responses are logged meaningfully

### TC-AN04 Drop-off visibility
Expected:
- system can identify where learners abandon the flow

### TC-AN05 Dashboard data traceability
Expected:
- visible progress metrics can be tied back to underlying learning events

### TC-AN06 Cross-SKU comparability
Expected:
- analytics model works consistently across MindSutra and MindSpark SKUs

### TC-AN07 Release monitoring readiness
Expected:
- errors, broken routes, and failed tutor sessions are observable after launch
## Part K: Short-Form Attention and Engagement Tests

These 8 tests validate whether the tutor can hold the attention of students who are used to fast interactive content without becoming shallow or noisy.

### TC-SF01 Time to first interaction
Expected:
- learner gets to interact quickly and is not forced through a long passive intro first

### TC-SF02 Time to first success
Expected:
- learner gets an early win or confidence-building checkpoint near the start of the lesson

### TC-SF03 Explanation chunk size
Expected:
- explanations are broken into short learning beats rather than long uninterrupted tutor monologues

### TC-SF04 Micro-progression visibility
Expected:
- learner sees small progress updates frequently enough to stay engaged

### TC-SF05 Re-engagement after drift
Expected:
- if learner slows down, hesitates, or drifts, tutor re-hooks attention quickly

### TC-SF06 Long-topic segmentation
Expected:
- longer lessons are split into short subtopic sections with natural checkpoints

### TC-SF07 Reward cadence
Expected:
- praise, XP, badges, and encouragement appear at healthy intervals without feeling spammy

### TC-SF08 Optional depth instead of forced depth
Expected:
- deeper explanation is available when needed, but all students are not forced through unnecessary long detail
## Pass Criteria by Release

### SKU Readiness
A SKU is release-ready only if:
- all 52 reusable course journey tests pass
- no platform generic test blocks that SKU

### Platform Readiness
The platform is launch-ready only if:
- at least two representative SKUs from each product family pass
- all 14 generic platform tests pass
- dashboards are real-data backed
- no cross-course or cross-grade fallback remains

## Suggested Release Gates

### Gate A: Single-SKU Readiness
Example:
- MindSutra Grade 4 passes all 52

### Gate B: Product-Family Readiness
Example:
- MindSutra Grade 4 and Grade 5 both pass all 52
- MindSpark Grade 4 and Grade 5 both pass all 52
- all 14 generic platform tests pass

### Gate C: Full Platform Readiness
Example:
- all 10 SKUs pass all 52
- all 14 generic platform tests pass

## Execution Table Template

Use this row format during audits:

| Test ID | SKU | Status | Evidence | Gap | Owner |
|---|---|---|---|---|---|
| TC-R01 | MS-G4 | Pass/Fail/Partial/NI | URL, API, screenshot, DOM, payload | short gap note | FE/BE/Content |

## Recommended Next Documents

After this framework, create:
- one execution sheet for MindSutra Grade 4
- one execution sheet for MindSutra Grade 5
- one platform generic test execution sheet

## Immediate Recommendation

Use this new framework as the master test basis.

That means:
- keep the old Grade 4 document as the first detailed audit
- use this new framework for all MindSutra and MindSpark SKUs
- do not approve launch based on one course only
- require proof that the same engine and UX work generically across courses