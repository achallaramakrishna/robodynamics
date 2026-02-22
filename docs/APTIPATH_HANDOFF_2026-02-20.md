# AptiPath Handoff (2026-02-20)

This file captures decisions and next steps so the project can continue safely from any machine/session.

## Progress Update (2026-02-21)

### Phase 1 implementation status

1. `DONE` Persist subscription + entitlement in DB:
   - `rd_ci_subscription` live and populated (example: `parenttest1 -> studenttest1`, module `APTIPATH`, status `ACTIVE`).
2. `DONE` Parent intake + student AptiPath flow end-to-end:
   - Parent workspace: `src/main/webapp/WEB-INF/views/parent/aptipath-home.jsp`
   - Parent intake page/save: `src/main/webapp/WEB-INF/views/parent/aptipath-intake.jsp`
   - Student home: `src/main/webapp/WEB-INF/views/student/aptipath-home.jsp`
   - Student test + result:
     - `src/main/webapp/WEB-INF/views/student/aptipath-test.jsp`
     - `src/main/webapp/WEB-INF/views/student/aptipath-result.jsp`
3. `DONE` Student login routing for AptiPath subscribers:
   - Login now lands parent/student on module hub (`/platform/modules`) and role-specific module URLs.
4. `DONE` Recommendation snapshot persistence:
   - `rd_ci_recommendation_snapshot` writing correctly on test submit.
5. `DONE` Basic analytics/reporting:
   - API: `/aptipath/api/analytics/summary`
   - Current sample output verified:
     - `activeAptiPathSubscriptions=1`
     - `totalAssessmentSessions=2`
     - `completedSessions=2`

### New/updated persistence added

1. `rd_ci_assessment_response` entity + DAO + service:
   - `src/main/java/com/robodynamics/model/RDCIAssessmentResponse.java`
   - `src/main/java/com/robodynamics/dao/RDCIAssessmentResponseDao.java`
   - `src/main/java/com/robodynamics/service/RDCIAssessmentResponseService.java`
2. Question bank support + auto-seed:
   - `src/main/java/com/robodynamics/model/RDCIQuestionBank.java`
   - `src/main/java/com/robodynamics/dao/RDCIQuestionBankDao.java`
   - `src/main/java/com/robodynamics/service/RDCIQuestionBankService.java`
3. DB migration for missing question bank table:
   - `aptipath_phase1_question_bank_migration_2026_02_21.sql`

### Current test UX state (latest)

1. Baseline-first then adaptive progression.
2. Section-based sprint framing in UI.
3. Confidence capture per question (`LOW/MEDIUM/HIGH`) stored in DB.
4. Time tracking per question + overall duration.
5. Session-safe resume via browser session state.

### Verified demo users

1. Parent: `parenttest1 / parenttest1`
2. Student: `studenttest1 / studenttest1`
3. Key URLs:
   - Login: `http://localhost:8085/robodynamics/login`
   - Module hub: `http://localhost:8085/robodynamics/platform/modules`
   - Parent AptiPath: `http://localhost:8085/robodynamics/aptipath/parent/home`
   - Student AptiPath: `http://localhost:8085/robodynamics/aptipath/student/home`

### Known scope decision (important)

1. Full-platform UX overhaul (parent/student/mentor/admin consistency) is intentionally postponed.
2. Immediate focus remains AptiPath Phase 1 stability only.

## Confirmed Product Direction

- Module name direction: `AptiPath` (Career Intelligence workflow for classes 8/9/10).
- Parent-first positioning: pedagogical, simple language, India-focused.
- `rd_users` remains the single user table for all users (parent/student/admin etc.).
- Existing enrolled students can also opt into AptiPath.
- Parent answers must be used as context, not to override student aptitude.

## Scoring Direction (approved approach)

- Student aptitude/performance: `70%`
- Student interest/work-style: `20%`
- Parent context: `10%`

## Adaptive Test Direction

- Baseline block first, then adaptive path.
- Adapt on:
  - accuracy
  - response time
  - confidence (optional)
- Keep fairness:
  - minimum domain coverage
  - anchor questions
  - confidence-based stopping with max question cap

## Current DB Reality (important)

- Existing tables can support base quiz delivery:
  - `rd_quizzes`
  - `rd_quiz_questions`
  - `rd_quiz_options`
  - `rd_user_quiz_results`
  - `rd_user_quiz_answers`
- Existing parent needs table (`rd_parent_needs`) is too limited for full AptiPath.
- Checkout/subscription state currently uses HTTP session in `RDSubscriptionCheckoutController`; it is not durable.
- `hibernate.hbm2ddl.auto=none`, so schema must be migrated explicitly.

## Phase 1 (must complete before agent automation)

1. Persist subscription and entitlement in DB (no session-only state).
2. Parent intake + student AptiPath test flow end-to-end.
3. Student login routing for AptiPath subscribers.
4. Recommendation snapshot persistence (Plan A/B/C with version).
5. Basic analytics and reporting.

## Proposed New Tables (same `robodynamics_db`)

- `rd_ci_subscription`
- `rd_ci_assessment_session`
- `rd_ci_question_bank`
- `rd_ci_assessment_response`
- `rd_ci_score_index`
- `rd_ci_recommendation_snapshot`

## Phase 2 (after Phase 1 stabilization)

- Question versioning lifecycle:
  - `DRAFT -> REVIEW -> ACTIVE -> RETIRED`
- Question performance metrics:
  - attempt count
  - accuracy
  - average time
  - skip rate
  - discrimination
  - freshness
- Research/content updater agent with SME approval gate.

## AI Counsellor Agent Plan (future)

- Worker 1: Intake Analyst
- Worker 2: Adaptive Test Conductor
- Worker 3: Career Recommender
- Worker 4: Parent Explainer
- Worker 5: Research & Content Updater

Guardrails:
- Human approval before publishing question bank changes.
- Versioning + audit trail for every publish.
- Never let conversational output override psychometric scores directly.

## Where to Continue Next Session

Phase 1 core is complete. Continue with Phase 1 stabilization and quality hardening in this order:

1. Add `rd_ci_score_index` write path on test submit (currently table exists, write logic pending).
2. Add parent-view recommendation card in parent workspace (read latest child recommendation snapshot).
3. Add guardrails in student test:
   - prevent submit if too many unanswered core questions
   - autosave to DB mid-test (optional API endpoint)
4. Add structured question metadata for stronger adaptivity:
   - difficulty tier (`EASY/MEDIUM/HARD`)
   - domain tags (`COGNITIVE`, `INTEREST`, `READINESS`, `WELLBEING`)
5. Add smoke tests for:
   - parent intake submit
   - student test submit
   - recommendation persistence
   - module routing by role (no student->admin navigation)

## Resume Prompt (copy into next session)

`Continue AptiPath stabilization from docs/APTIPATH_HANDOFF_2026-02-20.md. Start with rd_ci_score_index persistence on test submit, then parent recommendation view, then adaptive metadata hardening and smoke tests. Do not start broad platform UX overhaul yet.`

## Parent Mind Map (what parents are really asking)

Use these as canonical concern buckets and tag every intake/test/report item to one or more buckets.

| Code | Parent question in mind | What AptiPath must answer |
|---|---|---|
| PC01 | PCM or not? | Stream fit score with evidence |
| PC02 | If not JEE/NEET, then what? | Non-JEE/NEET pathways and exam map |
| PC03 | Coaching vs school + tuition? | Delivery model recommendation |
| PC04 | Will child get balanced college life? | Intensity vs balance profile |
| PC05 | What if first plan fails? | Plan A/B/C with fallback logic |
| PC06 | Is this affordable for us? | Budget-fit options and scholarship prompts |
| PC07 | What careers beyond engineering/medicine? | Career cluster shortlist with fit reasons |
| PC08 | Will AI remove this career? | AI resilience and skill-gap report |
| PC09 | Is my child under pressure/stress? | Wellbeing risk flag and intervention prompts |
| PC10 | Parent-child disagreement | Alignment score and mediation prompts |

## Discovery Questionnaire Blueprint (before scored test)

### Parent block (target 12 core + optional extension)

Core:
1. Current class and board
2. Preferred stream
3. Exam target intent (KCET/JEE/NEET/CUET/none)
4. Coaching preference
5. Budget range (monthly and annual)
6. Commute/relocation constraints
7. Language preference
8. Openness to non-traditional careers
9. Concern about AI job disruption
10. Observed child stress level
11. Family success definition (marks vs balance)
12. Top 3 hopes and top 3 fears

Optional extension:
- Scholarship awareness
- Entrepreneurship openness
- Study abroad openness
- Parent review cadence and communication channel

### Student block (target 25 core + optional extension)

Core:
1. Subject likes/dislikes
2. Aptitude confidence (math/science/verbal/spatial)
3. Learning style
4. Focus duration
5. Study habit consistency
6. Interest in research/build/design/business/people-impact
7. Risk tolerance and ambiguity tolerance
8. Self-pressure and external pressure indicators
9. AI tool comfort and responsible use
10. Preferred work type ranking (people/data/machines/ideas/nature)
11. Career curiosity list (top 3)
12. Career avoidance list (top 3)

Optional extension:
- Hobby/project behavior outside syllabus
- Leadership and teamwork confidence
- Communication/public speaking comfort

### Joint block (parent + student)

1. Agreed top 3 options
2. Major disagreement points
3. Decision model (parent-led/student-led/joint)
4. Backup agreement (Plan B/C)
5. Time and intensity agreement
6. Budget-expectation alignment
7. Shared 12-month goal statement

## AptiPath Assessment Design (classes 8/9/10)

Target duration: `70 to 90 minutes` total.

Modules:
1. Core Aptitude
2. Applied Problem Solving
3. Interest and Work Preference
4. Values and Motivation
5. Learning Behavior
6. AI-era Readiness
7. Career Reality Check
8. Parent-Student Alignment Overlay

Suggested question mix:
- MCQ
- Scenario-based choices
- Rank ordering
- Forced trade-off choices
- Short reflective prompts (non-scored or lightly scored)

Adaptive logic:
1. Baseline block (fixed starter)
2. Dynamic branching by accuracy/time/confidence
3. Validation block for uncertain domains
4. Stop on confidence threshold or max question cap

Fairness constraints:
- Minimum coverage per core domain
- Anchor questions in each level
- No over-branching in first few questions

## Recommendation Output Contract

Every student report should contain:
1. Stream fit scorecard (with confidence)
2. Career cluster shortlist (top options + why fit)
3. Plan A/B/C pathway
4. Exam and admission path map (India-first)
5. AI-era readiness and skill-gap roadmap
6. Parent-student alignment summary
7. 90-day action plan (student + parent)

## AI-era Skills to Assess Explicitly

1. Analytical reasoning
2. Problem decomposition
3. Communication clarity
4. Collaboration and teamwork
5. Creativity and design thinking
6. Digital and data literacy
7. AI tool fluency and verification behavior
8. Ethical judgment and responsibility
9. Adaptability and learning agility
10. Self-management and resilience

## Career Universe (post-12) to represent in recommendations

Do not limit discovery to engineering/medicine. Organize recommendations by clusters:

1. Engineering and Technology
2. Health and Life Sciences
3. Pure Sciences and Research
4. Commerce, Finance and Business
5. Law, Policy and Governance
6. Design, Media and Communication
7. Humanities and Social Sciences
8. Education and Psychology
9. Agriculture, Environment and Sustainability
10. Skilled Trades, Vocational and Applied Tech
11. Defense, Civil Services and Public Systems
12. Sports, Performance and Creative Industries
13. Emerging AI-native and interdisciplinary careers

## India Pathway Guidance Rules

1. Show exam routes based on intent (JEE/NEET/KCET/CUET/state/private).
2. Show board-sensitive preparation notes (CBSE/ICSE/State).
3. Include affordability filters (fees, location, travel, scholarships).
4. Recommend at least one low-risk fallback path for every primary recommendation.
5. Explain trade-offs in parent-friendly language.

## Engagement Design Rules

1. Keep intake conversational, not intimidating.
2. Use progress milestones and clear time estimates.
3. Mix question formats to reduce fatigue.
4. Give micro-feedback at module boundaries.
5. End with immediate, actionable next steps.

## Analytics Model (internal)

Track and monitor these indices:
1. Pressure Index
2. Exploration Index
3. Career Awareness Index
4. Financial Feasibility Index
5. Exam Readiness Index
6. AI Readiness Index
7. Parent-Student Alignment Index
8. Wellbeing Risk Index

Family profiles for segmentation:
- Locked Path
- Confused but Open
- High Pressure High Potential
- Exploratory
- Resource-Constrained

## Research Anchors (used for strategy)

Global and India references reviewed for career-readiness direction:

1. WEF Future of Jobs (skills and role shifts)
2. OECD reports on teenage career preparation and aspiration mismatch
3. OECD work on AI and skill demand shifts
4. CBSE career guidance announcements and ecosystem updates
5. NCS (National Career Service) ecosystem and data points
6. NSDC and sector-skill council structure
7. NCVET / NSQF / NQR frameworks
8. National Credit Framework direction
9. NTA/JoSAA/NEET admission route references
10. NIRF ranking framework and parameters
11. Singapore MOE ECG / MySkillsFuture approach
12. UK Gatsby Benchmarks and statutory guidance
13. iCeGS and IER career guidance research institutions
14. Stanford Life Design career exploration framework
15. O*NET and US BLS occupation trend datasets

## Source Link Pack (for future content team)

- WEF Future of Jobs: https://www.weforum.org/press/2025/01/future-of-jobs-report-2025/
- OECD teenage career preparation: https://www.oecd.org/en/publications/the-state-of-global-teenage-career-preparation_454fbbff-en.html
- OECD AI and skills: https://www.oecd.org/en/publications/ai-and-the-changing-demand-for-skills-in-the-labour-market_104f74fe-en.html
- CBSE career guidance note: https://cbseacademic.nic.in/web_material/Circulars/2025/95_Circular_2025.pdf
- National Career Service: https://www.ncs.gov.in/
- NCS brochure: https://www.ncs.gov.in/Documents/NCS_BROCHURE.pdf
- PIB NCS update: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2148693
- NSDC SSC: https://nsdcindia.org/sector-skill-councils
- NCVET NQR: https://ncvet.gov.in/nqr
- NSQF overview: https://ncvet.gov.in/nsqf
- National Credit Framework: https://www.education.gov.in/national-credit-framework
- Samagra vocational: https://samagra.education.gov.in/vocational_education.html
- NTA: https://www.nta.ac.in/
- NMC NEET: https://www.nmc.org.in/neet/
- JoSAA: https://josaa.nic.in/
- NIRF rankings: https://www.nirfindia.org/Rankings/2025/Ranking.html
- NIRF parameters: https://www.nirfindia.org/Docs/RankingFramework2025.pdf
- Singapore ECG: https://www.moe.gov.sg/education-in-sg/our-programmes/education-and-career-guidance
- MySkillsFuture: https://www.myskillsfuture.gov.sg/
- Gatsby benchmarks: https://www.gatsby.org.uk/education/focus-areas/good-career-guidance
- UK statutory career guidance: https://www.gov.uk/government/publications/careers-guidance-provision-for-young-people-in-schools
- iCeGS: https://www.derby.ac.uk/research/centres-groups/icegs/
- IER Warwick: https://warwick.ac.uk/fac/soc/ier/
- Stanford Life Design Lab: https://designingyour.life/
- O*NET: https://www.onetcenter.org/tools.html
- US BLS fastest growing occupations: https://www.bls.gov/ooh/fastest-growing.htm

## Phase 2 Agent Mission (explicit)

After Phase 1 launch, create an `AI Councillor Content Agent` that:
1. Scans trusted sources monthly.
2. Proposes question updates/new questions by domain.
3. Creates draft versions only.
4. Routes to SME review.
5. Publishes after approval with version bump.
6. Tracks post-publish performance and flags stale questions.
