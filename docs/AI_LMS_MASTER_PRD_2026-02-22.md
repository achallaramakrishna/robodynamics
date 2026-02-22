# Robo Dynamics AI LMS Master PRD

## 1. Product Vision
Build Robo Dynamics into an AI-powered LMS that supports:
- Grade 8-12 school learning
- Coding/robotics skill learning
- Competitive exam preparation (NEET/JEE/CAT)

The platform should function as:
- System of Record: users, courses, sessions, assets, attempts, progress
- System of Intelligence: mastery, risk, recommendation, readiness
- System of Action: study plans, interventions, alerts, follow-ups

## 2. Product Goals
- Improve student outcomes and consistency
- Provide structured guidance to parents
- Improve mentor intervention effectiveness
- Enable admin/company-admin data-driven operations
- Preserve all existing LMS flows without regressions

## 3. Learning Modes
- `SCHOOL`: grade-based academic outcomes
- `SKILL`: coding/robotics outcomes
- `COMPETITIVE`: exam strategy and rank-readiness outcomes

Default mode remains existing behavior to avoid breakage.

## 4. Core AI Features
### 4.1 AI Tutor
- Concept teaching in step-by-step format
- Doubt solving with multiple explanation styles
- Adaptive practice generation
- Hint-first behavior (no answer dumping)

### 4.2 Student Copilot
- Daily and weekly plan
- Next best 60-minute recommendation
- Weak-topic recovery queue
- Revision scheduling

### 4.3 Competitive Exam Coach
- Exam blueprint planning (NEET/JEE/CAT)
- Sectional/full mock simulation
- Post-test error analytics:
  - concept gaps
  - speed issues
  - careless errors
  - question selection mistakes
- Automatic replan after each test

### 4.4 Parent Copilot
- Weekly digest with simple status and actions
- Anxiety-aware home support guidance
- Early warning visibility

### 4.5 Mentor Copilot
- At-risk student queue
- Suggested interventions
- Follow-up and closure tracking

### 4.6 Admin and Company Admin Intelligence
- Cohort readiness and retention insights
- Mentor utilization and intervention impact
- Tenant-level controls and analytics (company_admin)

## 5. Use Case View (High-Level)
- Student learns with AI Tutor, adaptive practice, and dynamic planning
- Parent receives weekly progress and support actions
- Mentor receives prioritized intervention queue
- Admin monitors cohort quality and operational KPIs
- Company Admin manages tenant-level visibility and outcomes

## 6. Question Intelligence System (Rank-Focused)
### 6.1 Data Sources
- PYQs (previous year questions)
- Licensed/internal mock papers
- Mentor-authored question bank
- AI-generated candidate questions (reviewed only)

### 6.2 Mandatory Question Metadata
- exam, subject, chapter, topic, subtopic
- difficulty, question type, marks, negative marking
- answer key, full solution, expected time
- source type, rights status, review status

### 6.3 Publishing Workflow
1. Ingest and parse
2. Auto-map to taxonomy
3. Subject-expert validation
4. Pedagogy review
5. Duplicate/similarity checks
6. Publish only expert-verified items

### 6.4 Model Paper Generation
- Blueprint constraints: syllabus coverage, weightage, difficulty mix, time profile
- Paper types:
  - mastery paper
  - exam simulation paper
  - challenge paper
- Anti-repeat and anti-clone rules
- Student-specific personalization by weak-topic profile

## 7. Data and Telemetry Strategy
Capture structured events from all critical touchpoints:
- session start/finish
- asset consumption
- question-level attempts
- confidence and time-per-question
- mentor interventions
- parent signal inputs

Daily quality checks:
- required fields completeness
- taxonomy compliance
- duplicate/outlier detection

## 8. Safety and Trust
- Explainability panel for recommendations (“why this suggestion”)
- Human escalation path for high-risk or high-anxiety learners
- AI audit logs for major decisions
- Clear boundary: AI supports learning; does not replace medical mental-health care

## 9. Technical Architecture
### 9.1 Current Core (retain)
- Spring MVC LMS (existing role-based system)
- Existing JSP flows and modules

### 9.2 AI Layer (additive)
- Separate AI service (FastAPI/Python)
- Recommendation and tutor APIs
- Async processing and cache (Redis)
- Retrieval and embeddings for content intelligence

### 9.3 Compatibility Rule
No replacement of existing flows in Phase 1.
Competitive and AI features behind role/mode/tenant feature flags.

## 10. 20-Week Delivery Roadmap
- Weeks 1-2: foundation, modes, regression harness
- Weeks 3-6: student AI tutor and learning flow
- Weeks 7-10: competitive exam engine and analysis
- Weeks 11-14: mentor/parent copilots
- Weeks 15-18: admin/company-admin intelligence
- Weeks 19-20: hardening, rollout, KPI verification

## 11. KPI Framework
Primary KPIs:
- weak-topic closure rate
- mock score/percentile improvement
- plan adherence and consistency
- intervention success rate
- engagement time in quality learning actions

Secondary KPIs:
- parent confidence index
- mentor response time to high-risk alerts
- cohort readiness trend

## 12. Recently Implemented Platform Changes (Current State)
- Admin/Mentor calendars collapsed-by-default (click to open)
- AptiPath shell consistency for embedded vs non-embedded usage
- Student course monitor redesign to reduce nested scrolling and improve session flow
- Company Admin MVP foundation:
  - role id 7
  - role routing
  - company admin dashboard controller/view
  - header navigation entry

## 13. Rollout Strategy
- Phase-wise launch by tenant and mode flags
- Start with pilot cohorts
- Measure outcomes and tune models weekly
- Keep mentor-in-loop for all high-stakes learner decisions

## 14. Immediate Next Steps
1. Finalize taxonomy for NEET/JEE/CAT chapter-topic mapping
2. Approve AI Tutor guardrails and escalation policy
3. Create Jira board from this PRD (epics, stories, milestones)
4. Begin Sprint 1 implementation with no-regression checkpoints

