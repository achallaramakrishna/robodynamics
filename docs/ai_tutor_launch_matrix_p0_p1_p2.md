# AI Tutor Launch Matrix

Date: March 19, 2026  
Source: `mindsutra_mindspark_multi_grade_test_framework.md`

## Purpose

The full framework has 611 checks.
That is too large to use directly for day-to-day release decisions.

This launch matrix converts the framework into 3 practical levels:
- `P0` = launch blockers
- `P1` = must-fix soon after core launch, or before wider rollout
- `P2` = quality enhancers and scale-readiness improvements

## Priority Rules

### P0
If a P0 item fails, launch should be blocked.

### P1
Launch may still happen only if product leadership explicitly accepts the risk.
These should be fixed immediately after P0.

### P2
Important for polish, scale, optimization, and long-term quality.
These should not be ignored, but they do not block an initial controlled launch by default.

## P0 Launch Blockers

These are the minimum conditions for a trustworthy launch.

### A. Entry, Routing, and Course Integrity
- Product homepage clearly exposes AptiPath360 and the tutor product families
- Product-first navigation is clear: `Home -> Product -> Grade -> Course -> Tutor`
- Selected product resolves to the correct product family
- Selected grade resolves to the correct course
- Selected chapter resolves inside the correct course
- No cross-product fallback
- No cross-grade fallback
- No legacy generic tutor fallback for grade-based products
- Deep links open the correct course and grade

### B. Course and Demo Integrity
- Course page title, grade, and description are correct
- Course page lesson plan matches actual tutor content
- Demo launches from the correct course and grade
- Demo is a learning preview, not just a question dump
- Demo limitation is clearly communicated
- Paid flow clearly differs from demo flow

### C. Tutor Pedagogy Basics
- Topic is introduced before the first question
- Tutor teaches in small steps
- Tutor includes a worked example or demonstration
- Tutor includes guided practice before independent practice
- Tutor gives supportive feedback after mistakes
- Tutor can retry with a smaller step after failure
- Tutor language fits the student grade and product domain

### D. Adaptive Teaching Core
- Tutor does not teach only by enrolled grade
- Baseline learner understanding is assessed
- Foundation gaps can be detected
- Advanced readiness can be detected
- Tutor can choose a personalized starting point
- Tutor can create a recovery path for weak foundations
- Tutor can accelerate stronger students safely
- Learner model updates across sessions
- Student is never harmed by below-grade labeling language

### E. Parent and Student Trust Loop
- Student dashboard is live-backed and course-specific
- Parent dashboard is live-backed and course-specific
- Student and parent dashboards reflect the same learning story
- Dashboard shows real progress, not mock or placeholder data
- Parent can see current lesson, weak areas, and next step
- Student can see current progress, resume point, and achievements

### F. Course Hub and Tutor Continuity
- Enrolled learner lands on a course hub or clear course main page
- Course hub shows lesson map and next recommended action
- Tutor mode can be entered from the selected lesson
- Tutor mode has a reliable back path to course hub
- Progress is preserved on exit and resume

### G. Pricing and Entitlement Trust
- Correct price is shown for the selected grade/SKU
- Product page, course page, demo CTA, and checkout all show the same price
- Bundle logic is clear and consistent
- Purchased entitlement matches the purchased grade/product
- Refund and access terms are visible and correct

### H. Reliability and Access
- No critical 404s on key routes
- Login/register flow works for target launch path
- Checkout flow works for launch products
- Tutor start/resume/next-question/check-answer APIs work
- No hard block if mic permission is denied
- Typing fallback works when voice fails
- Product is usable on mobile

### I. Short-Form Attention Fitness
- Time to first interaction is short enough to hold attention
- Time to first success is short enough to build momentum
- Long explanations are broken into short beats
- Long topics are segmented into smaller chunks
- Learner gets visible micro-progress signals

### J. Safety of Claims
- Marketing promises about dashboards and adaptation match real product behavior
- Product does not overclaim where support is not actually implemented
- Tutor can recommend escalation or extra help in persistent struggle cases

## P1 High-Importance Follow-Up

These are important for wider rollout, retention, and differentiation.

### A. Stronger Adaptive Quality
- Misconception-specific reteaching
- Distinguishing conceptual vs careless errors
- Confidence vs correctness separation
- More precise learner archetype handling
- Parent-facing mastery-band explanation

### B. Retention and Revision
- Spaced revision support
- Weak-topic revisit automation
- End-of-session recap quality
- Forgetting recovery path
- Promotion based on retained mastery, not first-pass only

### C. Engagement Quality
- Badge and XP progression feels earned
- Milestones are meaningful
- Reward cadence is healthy, not noisy
- Optional deeper explanation exists for curious learners

### D. Parent Trust and Guidance
- Dashboard explains what child learned in plain English
- Dashboard gives recommended next action to parent
- Weak-area reporting is specific but non-alarming
- Parent can understand bridge from current mastery to enrolled grade goals

### E. Cross-Device and UX Resilience
- Cross-device resume continuity
- Recovery from accidental exit or back press
- Replay/repeat explanation controls
- Better mobile ergonomics and layout polish

### F. Observability
- Core funnel analytics are live
- Tutor event analytics are live
- Confusion and retry loops are measurable
- Release monitoring is strong enough to detect failures quickly

## P2 Quality, Scale, and Optimization

These improve long-term product strength but do not usually block an initial controlled launch.

### A. Advanced learner-model robustness
- better re-validation after inconsistent sessions
- stronger anti-guessing logic
- stronger external-help detection heuristics

### B. Richer remediation intelligence
- more granular misconception catalogs by domain
- more sophisticated recovery tree design
- deeper bridge-back sequencing after remediation

### C. Premium engagement systems
- richer achievement design
- more meaningful streak design
- more dynamic celebration systems
- deeper challenge ladders for advanced learners

### D. Accessibility maturity
- broader accessibility review
- more robust keyboard and assistive support
- readability and dysfluency-friendly optimizations

### E. Analytics maturity
- cross-SKU benchmarking dashboards
- deeper cohort analysis
- segment-level conversion and retention analysis

## Recommended Operational Rollout

### Phase 1: Controlled Launch Gate
Use only P0.

Required before launch:
- all applicable P0 items pass for the launch SKU set
- no critical route, dashboard, or course-resolution failures remain

### Phase 2: Early Stabilization Gate
Use P1 after P0.

Required after first launch:
- P1 issues are triaged and assigned
- top retention and trust gaps are closed quickly

### Phase 3: Scale Gate
Use P2.

Required before wider marketing scale:
- platform robustness, analytics depth, and accessibility maturity improve enough to support expansion

## Immediate P0 Execution Recommendation

Start with these 3 execution sheets:
- `MindSutra Grade 4 P0`
- `MindSutra Grade 5 P0`
- `Generic Platform P0`

Then add:
- `MindSpark Grade 4 P0`
- `MindSpark Grade 5 P0`

## Decision Rule

Do not ask "did we pass 611 checks?"
Ask:
- did we pass all P0 checks for the launch SKUs?
- do we understand the accepted P1 risks?
- is there a plan for P2 after launch?