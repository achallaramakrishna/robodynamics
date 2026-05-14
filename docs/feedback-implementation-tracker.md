# RoboDynamics Feedback Implementation Tracker

Last updated: 2026-05-13

This document captures the main feedback items raised during recent RoboDynamics and Vaani work, along with the implementation status.

## Status Key

- `Deployed`
- `Implemented locally`
- `Analysis only`
- `Pending`

## Shared Platform And Homepage

### 1. Root homepage should not force users into MindSutra
- Feedback:
  - `https://robodynamics.in/` should not redirect users into one tutor.
  - All AI tutors should get equal importance.
- Action taken:
  - Replaced the old redirect behavior with a shared homepage/dashboard model.
  - Added multi-tutor discovery on the homepage.
- Status:
  - `Deployed`

### 2. Logged-in users should see dashboard behavior
- Feedback:
  - Once logged in, the homepage should act like a dashboard.
  - `My AI Tutors` should be visible for the learner.
- Action taken:
  - Added logged-in dashboard-style rendering on the homepage.
  - Added DB-backed tutor ownership / enrollment support.
- Status:
  - `Deployed`

### 3. Tutor launch should go to the learner's actual level
- Feedback:
  - Clicking tutors like MindSutra and MindSparc should open the learner’s correct level.
- Action taken:
  - Added shared current-level launch logic.
  - Wired dashboard / enroll behavior to use level-aware tutor launch.
- Status:
  - `Deployed`

### 4. Homepage should use standard product-site sections
- Feedback:
  - Add standard elements like login, register, pricing, FAQ, trust, and how-it-works.
- Action taken:
  - Expanded the homepage into a fuller marketing + dashboard experience.
- Status:
  - `Deployed`

### 5. Restore darker branding
- Feedback:
  - The previous darker branding felt stronger than the lighter version.
- Action taken:
  - Switched the homepage back to a darker visual theme.
- Status:
  - `Deployed`

### 6. Tutor cards should stand out more
- Feedback:
  - Tutor descriptions should have stronger contrast, possibly white or lighter panels.
- Action taken:
  - Added brighter inner content panels for tutor descriptions.
- Status:
  - `Implemented locally`

### 7. Vaani was missing from homepage / enroll
- Feedback:
  - Vaani should appear in both `/` and `/enroll`.
- Action taken:
  - Added Vaani back into the shared tutor registry and homepage product family.
- Status:
  - `Deployed`

### 8. If header says Dashboard, it should also show Logout
- Feedback:
  - Logged-in state should clearly offer logout.
- Action taken:
  - Added a real shared logout route.
  - Updated homepage auth actions to support logout behavior.
- Status:
  - `Implemented locally`

### 9. Login page should include Reset PIN
- Feedback:
  - Login should expose a reset-PIN path.
- Action taken:
  - Added a reset-PIN UI flow.
  - Added a backend reset-PIN route.
  - Added login-page link to reset PIN.
- Status:
  - `Implemented locally`

### 10. There should be a common header and footer across pages
- Feedback:
  - Shared header/footer should be consistent for logged-in and logged-out users.
  - This should eventually apply across all products.
- Action taken:
  - Phase 1 completed for shared `web` app:
    - added `PlatformChrome`
    - wired it into root layout
    - removed duplicate homepage header/footer
- Status:
  - `Implemented locally`

### 11. Separate tutor apps also need shared chrome
- Feedback:
  - Shared header/footer should work across all products, not only the shared web app.
- Action taken:
  - Plan created.
  - Shared web-app phase completed first.
- Status:
  - `Pending`

## Branding And Naming

### 12. Rename products to match Vaani / Kaveri tone
- Feedback:
  - Suggested more Indian, brand-consistent names.
- Chosen names:
  - `MindSutra` -> `Vedika`
  - `MindSparc` -> `Yukti`
  - `MoneyMind` -> `Artha`
- Action taken:
  - Applied Phase 1 branding rename across shared surfaces.
- Status:
  - `Deployed`

### 13. Remove Python AI from public discovery; use Vidya as Python tutor
- Feedback:
  - `Python AI / CodeSutra` should not be public-facing if Vidya is the learner-facing product.
- Action taken:
  - Removed / hid Python AI from public discovery surfaces.
- Status:
  - `Implemented`

## Shared Auth, Accounts, And Enrollment

### 14. Store tutor ownership in the database instead of session cookie
- Feedback:
  - Tutor ownership and `My AI Tutors` should be database-backed.
- Action taken:
  - Moved product enrollment ownership into MySQL.
  - Homepage and enroll flow now use DB-backed tutor enrollments.
- Status:
  - `Deployed`

### 15. Fix login issues
- Feedback:
  - Shared login flow was not behaving correctly.
- Action taken:
  - Corrected shared login redirect behavior.
  - Improved post-auth routing into homepage/dashboard behavior.
- Status:
  - `Implemented`

### 16. Production table for shared auth users
- Feedback:
  - Needed clarity on where prod auth users are stored.
- Action taken:
  - Identified `ms_challenge_users` as the shared auth table.
- Status:
  - `Implemented`

### 17. Reset a production PIN for a specific family account
- Feedback:
  - Needed a temporary usable PIN for login verification.
- Action taken:
  - Reset the prod PIN for the requested phone number and shared the temporary PIN.
- Status:
  - `Implemented`

## Vaani: Pedagogy, Review, And Content

### 18. Review Vaani Levels 1-6
- Feedback:
  - Requested feedback on engagement, visual appeal, functionality, and pedagogy.
- Action taken:
  - Reviewed all live Vaani level pages and provided structured analysis.
- Status:
  - `Analysis only`

### 19. Provide level-by-level suggestions
- Feedback:
  - Requested suggestions for each Vaani level.
- Action taken:
  - Created level-by-level recommendations for Levels 1-6.
- Status:
  - `Analysis only`

### 20. Complete L6 MCQ rewrites and L1-L5 terminology pass
- Feedback:
  - Improve Level 6 pedagogy and clean up L1-L5 terminology / anchors.
- Action taken:
  - Completed targeted remaining Level 6 MCQ and pedagogy fixes.
  - Performed terminology / anchor-word cleanup pass for Levels 1-5.
- Status:
  - `Implemented locally`

## Vaani: Gamification, Progress, And Backend

### 21. Add points and badges to improve engagement
- Feedback:
  - Students should score points and badges.
- Action taken:
  - Designed and wired Vaani gamification and progress tracking.
- Status:
  - `Deployed`

### 22. Deploy gamification and production progress sync
- Feedback:
  - Complete planned deployment items including progress backend.
- Action taken:
  - Deployed gamification.
  - Verified HTTPS.
  - Replaced Supabase plan with MySQL-backed progress sync per instruction.
- Status:
  - `Deployed`

## Vaani: Writing Support, Stroke Guides, And Worksheets

### 23. Teach letters stroke-by-stroke like a real teacher
- Feedback:
  - Introduce animated stroke-building guidance for letters.
- Action taken:
  - Built animated stroke-guide system.
  - Integrated it into tracing flow.
- Status:
  - `Implemented locally`

### 24. Extend stroke animation across more letters
- Feedback:
  - Expand stroke-build support to more of the alphabet.
- Action taken:
  - Extended coverage across vowels and major consonant groups in multiple batches.
- Status:
  - `Implemented locally`

### 25. Practice sheets should also show step-by-step letter construction
- Feedback:
  - Printable sheets should teach how the letter is built.
- Action taken:
  - Updated worksheet generator to include step-by-step build sections using stroke-guide data.
- Status:
  - `Implemented locally`

## Vaani: Audio, Images, And Animation

### 26. Level 2 needs more image richness
- Feedback:
  - Level 2 felt less visual than Level 1.
- Action taken:
  - Added stronger image presence to Level 2 overview and lesson steps.
- Status:
  - `Deployed`

### 27. Hindi full selection was speaking English
- Feedback:
  - Level 2 lesson was still speaking English even when Hindi full was selected.
- Action taken:
  - Corrected the Level 2 language-selection logic.
- Status:
  - `Deployed`

### 28. Multiple audios were playing at once
- Feedback:
  - Audio must follow the dropdown selection only and never overlap.
- Action taken:
  - Enforced single-audio playback.
  - Canceled stale / overlapping audio and TTS responses.
  - Reduced duplicate triggers.
- Status:
  - `Deployed`

### 29. Images should feel more alive, almost like video
- Feedback:
  - Add motion like cat running, book opening, gentle animation effects.
- Action taken:
  - Added lightweight lesson-visual animation layer.
- Status:
  - `Deployed`

### 30. Identify weaker images by level
- Feedback:
  - Wanted a way to shortlist weaker images for regeneration.
- Action taken:
  - Reviewed image quality differences and highlighted Level 2 inconsistency as an art-direction issue.
- Status:
  - `Analysis only`

## Vaani: Navigation And Level Access

### 31. From a level page, the learner should be able to jump to other levels
- Feedback:
  - On Vaani Level 2, the student should be able to return to all levels or jump directly to Level 3.
- Action taken:
  - Added `All Levels` link.
  - Added direct Level 1-6 pills on the Vaani level page.
- Status:
  - `Implemented locally`

## Vaani: Empty Space And Visual Density

### 32. Level pages have too much empty space
- Feedback:
  - Level 2 page had too much empty space and needed stronger visual appeal.
  - This improvement should later extend across lesson steps for all levels.
- Action taken:
  - Created implementation plan.
  - Started first level-overview visual-density pass in `VaaniCourseClient.tsx`.
  - Added:
    - utility band under progress
    - denser selected-lesson summary chips
    - richer support cards:
      - `What you will practice`
      - `Why this matters`
      - `Parent tip`
      - `Next reward`
- Status:
  - `Implemented locally`

### 33. Extend visual-density improvements across lesson steps
- Feedback:
  - Improve visual appeal not just on overview pages, but across all lesson steps in all levels.
- Action taken:
  - Detailed plan created for lesson-step redesign.
- Status:
  - `Pending`

## Vidya: Sandbox & Feedback Precision

### 34. Precise string execution checks triggering non-descriptive Logic Errors
- Feedback:
  - Python string execution checks are highly precise. Minor typos like `print("Hello Coder !")` (extra space before punctuation `!`) trigger a confusing `Logic Error` when expected output is `Hello Coder!`.
- Action taken:
  - Built an intelligent output mismatch analyzer inside `VidyaLessonEngine.tsx`.
  - Added dedicated detection for punctuation spacing mismatches, case sensitivity discrepancies, and general space alignment issues.
  - Added formatted, child-friendly debugging guidance explaining exactly why the mismatch occurred and how to resolve it.
- Status:
  - `Implemented locally`

## What Is Still Pending

### Highest-priority pending items
- Deploy shared web-app `PlatformChrome`
- Deploy shared auth `Logout` and `Reset PIN`
- Deploy Vaani level-switcher (`All Levels` + level pills)
- Deploy latest Vaani visual-density pass
- Extend common header/footer pattern to Vaani and Kaveri
- Extend Vaani visual-density improvements into lesson-step pages

## Suggested Next Update Fields

For future edits to this tracker, use:
- `Feedback`
- `Implementation`
- `Status`
- `File / Area`
- `Next step`
