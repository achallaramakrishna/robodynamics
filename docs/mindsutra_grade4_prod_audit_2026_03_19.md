# MindSutra Grade 4 Production Audit

Date: March 19, 2026  
Environment: Production (`https://robodynamics.in`)  
Scope: Grade 4 user journey against the Grade 4 UI/UX and pedagogical test plan.

## Status Summary

Total scenarios audited: 52

- Pass: 14
- Partial: 20
- Fail: 13
- Not Implemented: 5

## What This Means

Grade 4 content and the Grade 4 course page are now live in production, and the tutor backend is loading the correct Grade 4 lesson plan.

But the end-to-end product experience is not yet Grade 4-ready for parent trust.

The biggest production gaps are:
- the main site home page is still the old AptiPath360 home page, not the MindSutra home page
- student and parent dashboard APIs are not live on production at `/api/student/home` and `/api/parent/dashboard`
- explicit `Clear / Maybe / Not Clear` clarity controls are not implemented as a visible learner UX
- there is no clear course-main-page/dashboard flow that sits between course detail and tutor mode for the enrolled student journey

## Production Evidence Used

Verified directly in production:
- `https://robodynamics.in/` returns the old AptiPath360 page, not MindSutra
- `https://robodynamics.in/mindsutra` is live and shows Grade 4-8 course cards
- `https://robodynamics.in/vedic-math/grade-4` is live and shows the Grade 4 course detail page
- `https://robodynamics.in/ai-tutor/demo?grade=4&chapter=VM_G4_L1_FAST_ADDITION&fresh=1` redirects correctly to Grade 4 tutor session
- production tutor start API returns `courseId=vedic_math_g4` and `activeChapterCode=VM_G4_L1_FAST_ADDITION`
- `https://robodynamics.in/api/student/home` returns `404`
- `https://robodynamics.in/api/parent/dashboard` returns `404`

Verified from the deployed app logic and route behavior:
- tutor has intro/demo/guided/checkpoint structure
- tutor has adaptive behavior logic and doubt-handling hooks
- tutor does not expose a dedicated visible `Clear / Maybe / Not Clear` checkpoint UI

## Audit Matrix

### A. Home Page Discovery

- `TC-H01` Fail: Root home page does not show Grade 4 MindSutra discovery. Production root is still AptiPath360.
- `TC-H02` Fail: Home page information density is for AptiPath360, not Grade 4 tutor discovery.
- `TC-H03` Fail: From production root, parent is not naturally led into Grade 4 course flow.
- `TC-H04` Fail: Root home page does not provide clear Grade 4 `Explore / Demo / Buy` actions.

### B. Grade 4 Course Detail Page

- `TC-C01` Pass: Grade 4 course page hero is clear, grade-specific, and has demo and purchase CTAs.
- `TC-C02` Pass: Course page provides Udemy-like structure with chapter list, durations, and curriculum framing.
- `TC-C03` Partial: Lesson-wise breakup exists, but practice type and student-facing lesson dashboard continuity are incomplete.
- `TC-C04` Pass: Purchase CTA is visible above the fold and again later on the page.
- `TC-C05` Pass: Demo CTA is clearly visible and grade-specific.
- `TC-C06` Pass: Course page includes parent benefits, CBSE alignment, progress messaging, and AI adaptation claims.

### C. Demo Flow vs Paid Flow

- `TC-D01` Pass: Grade 4 demo starts with the correct Grade 4 route and tokenized tutor launch.
- `TC-D02` Partial: Backend payload supports intro/demo/guided flow, but browser-level proof of the visual demo sequence still needs click-through validation.
- `TC-D03` Pass: Course page explains free preview vs locked content and gives upgrade CTA.
- `TC-D04` Partial: Paid richness is promised, but production dashboards and real progress plumbing are not fully live.
- `TC-D05` Fail: Demo-to-paid continuity is not yet proven as a real saved progression journey.

### D. Tutor Main Page and Tutor Mode

- `TC-T01` Not Implemented: No proven enrolled-student course main page/dashboard exists between course detail and tutor mode.
- `TC-T02` Partial: Student can launch tutor from Grade 4 course/demo entry, but lesson-selection continuity for paid course mode is incomplete.
- `TC-T03` Partial: Tutor code supports exit/back behavior, but production browser validation is still needed.
- `TC-T04` Partial: Resume mechanics exist, but not yet validated as a full Grade 4 enrolled-course experience.

### E. Pedagogical Flow Inside the Tutor

- `TC-P01` Partial: Tutor backend clearly has topic intro hooks and intro-first lesson structure, but browser verification is still needed for final presentation order.
- `TC-P02` Pass: Grade 4 lesson payload is broken into small, age-appropriate subtopics and learning goals.
- `TC-P03` Not Implemented: Dedicated visible `Clear / Maybe / Not Clear` concept-check controls are not present.
- `TC-P04` Pass: Tutor flow supports intro, demo, guided practice, and checkpoint progression.
- `TC-P05` Pass: Retry and supportive correction language are present in lesson payloads and tutor logic.
- `TC-P06` Partial: Adaptive behavior engine exists, but production browser validation across student behaviors is still pending.
- `TC-P07` Partial: Doubt-handling exists in tutor logic, but end-to-end UX still needs live click-through testing.
- `TC-P08` Pass: Grade 4 language is mostly simple and child-appropriate in the live payload.

### F. Engagement and Motivation

- `TC-E01` Partial: Tutor UI includes XP/badges/reward elements, but production proof of real Grade 4 reward progression is incomplete.
- `TC-E02` Partial: Milestone concepts exist, but real earned milestone flow is not yet validated in production.
- `TC-E03` Partial: Visual engagement looks strong on course page and tutor design, but browser-based usability validation is still needed.

### G. Student Dashboard

- `TC-S01` Fail: No live production student API is available at `/api/student/home`; Grade 4 dashboard cannot be trusted as real data.
- `TC-S02` Fail: Accuracy/confidence/weak-area view is not production-backed for Grade 4.
- `TC-S03` Partial: Student dashboard page exists, but without live API support this remains incomplete.
- `TC-S04` Fail: Real data integrity for student dashboard is not established in production.

### H. Parent Dashboard

- `TC-PR01` Fail: No live production parent API is available at `/api/parent/dashboard`.
- `TC-PR02` Fail: Chapter-level parent visibility is not production-backed.
- `TC-PR03` Partial: Parent weak-area design is present in course messaging/mock dashboard framing, but not live-backed.
- `TC-PR04` Fail: Real evidence-of-pedagogy dashboard view is not established in production.
- `TC-PR05` Fail: Parent dashboard data integrity is not established in production.

### I. Navigation and Continuity

- `TC-N01` Fail: Full loop from production home -> Grade 4 course -> tutor -> dashboard is broken because the root home page is still the old product and dashboards are not live-backed.
- `TC-N02` Pass: Grade switching across `/vedic-math/grade-4` to `/grade-8` works correctly on the MindSutra experience.
- `TC-N03` Pass: Grade 4 deep links and demo links open the correct grade-specific course/tutor route.

### J. Trust and Purchase Readiness

- `TC-B01` Pass: Grade 4 course page clearly explains pricing, bundles, refund framing, and purchase options.
- `TC-B02` Partial: Safety and independent-use messaging exist, but the full support/recovery UX still needs browser validation.

### Behavior-Driven Pedagogical Scenarios

- `TC-BH01` Partial: Tutor can respond to confusion and retries, but live Grade 4 validation is still needed.
- `TC-BH02` Partial: Retry behavior exists, but adaptive variation across repeated wrong answers still needs structured live testing.
- `TC-BH03` Partial: Silence recovery logic exists, but browser/live audio behavior still needs testing.
- `TC-BH04` Partial: Adaptive archetype logic suggests support for rushed/careless behavior, but production validation is pending.
- `TC-BH05` Partial: Curious-student doubt flow appears supported, but needs live UX verification.
- `TC-BH06` Not Implemented: No explicit learner UI for `Concept is clear` response.
- `TC-BH07` Not Implemented: No explicit learner UI for `Maybe` response.
- `TC-BH08` Not Implemented: No explicit learner UI for `Not Clear` response.

## Highest Priority Gaps

1. Production root home page
Current root page is not MindSutra. Grade 4 discovery from the real home page fails.

2. Real dashboards
Student and parent dashboard APIs are returning `404` in production, so the trust loop is broken.

3. Course-main-page continuity
There is still no clean enrolled-student Grade 4 course hub that acts as a course dashboard before entering tutor mode.

4. Clarity checkpoint UX
The tutor should explicitly ask `Is this clear?` with choices like `Clear`, `Maybe`, `Not Clear`.

5. End-to-end browser verification
Some tutor-flow items are likely working in code, but still need browser click-through to confirm the child actually sees them correctly.

## Recommendation

Do the next phase in this order:

1. Fix the product entry point
Make MindSutra visible from the real production home page, with a Grade 4 card and Grade 4 CTA path.

2. Fix dashboard production wiring
Student and parent dashboards must return real Grade 4 data before we claim parent visibility.

3. Build Grade 4 course hub
After purchase/login, student should land on a Grade 4 main page with lesson list, progress, badges, milestones, and resume.

4. Add clarity controls
Implement visible `Clear / Maybe / Not Clear` checkpoints inside tutor flow.

5. Run browser audit
After the above fixes, run a full browser-based Grade 4 audit again.