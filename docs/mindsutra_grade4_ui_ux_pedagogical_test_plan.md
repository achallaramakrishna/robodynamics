# MindSutra Grade 4 AI Tutor

## UI/UX + Pedagogical Test Plan

Date: March 19, 2026  
Scope: Grade 4 MindSutra Vedic Math experience across home page, course page, demo, paid tutor flow, student dashboard, parent dashboard, and lesson pedagogy.

## Goal

This test plan defines what a strong Grade 4 AI Tutor experience should feel like for both parent and student.

The product should:
- make Grade 4 easy to discover from the home page
- clearly show what the course contains before purchase
- let users try a limited but meaningful demo
- move the student from course overview to tutor mode without confusion
- teach with empathy, clarity, and proper concept introduction
- show real progress, badges, milestones, and learning evidence
- help parents trust the product through visible progress and pedagogy

## Core Product Promise

For Grade 4, the AI Tutor should feel like a patient real tutor:
- it introduces the concept before asking the question
- it teaches in small steps
- it checks if the child understood
- it adapts if the child is confused, silent, careless, or curious
- it motivates without overwhelming
- it makes the parent feel the child is learning, not just clicking through screens

## Primary Personas

### Parent
- usually comes from the home page or a shared link
- wants to know: what is this, what will my child learn, is it safe, is it worth paying for, how will I track progress

### Student
- may be 8 to 10 years old
- wants clear next actions, low friction, visual guidance, encouragement, and visible rewards

## Success Criteria

The Grade 4 experience passes only if:
- a parent can discover the Grade 4 course in under 10 seconds from the home page
- a parent can understand course contents, demo access, and pricing without guessing
- a student can see lesson structure before starting
- demo clearly feels limited but valuable
- paid flow clearly feels complete and progress-aware
- tutor introduces each subtopic before the first question
- tutor periodically asks for clarity with options like `Clear`, `Maybe`, `Not Clear`
- student and parent dashboards show the same real learning story from different views
- badges, XP, milestones, accuracy, and chapter progress are understandable
- there is always a clear way to go back from tutor mode to course main page/dashboard

## Test Areas

1. Discovery and first impression
2. Grade 4 course detail page
3. Demo flow versus paid flow
4. Tutor teaching flow
5. Student motivation and engagement
6. Student dashboard
7. Parent dashboard
8. Navigation and state continuity
9. Pedagogy and adaptive tutoring
10. Trust, clarity, and purchase readiness

## Scenario Matrix

### A. Home Page Discovery

#### TC-H01 Grade 4 card visibility
Purpose: Parent should immediately notice that Grade 4 Vedic Math exists.

Expected:
- home page shows a visible Grade 4 entry or a MindSutra card that clearly mentions Grade 4
- card contains minimal but useful information only
- card includes: `Grade 4`, `Vedic Math AI Tutor`, short value proposition, and a clear CTA

#### TC-H02 Home page information density
Purpose: Card should not overload the parent.

Expected:
- card is brief
- no long syllabus on home card
- includes only: grade range, value statement, demo/purchase/discover actions

#### TC-H03 Home to Grade 4 course page transition
Purpose: Parent should land on the correct Grade 4 course details page.

Expected:
- clicking Grade 4 card opens Grade 4 course page, not a generic Grade 5 or generic Vedic page
- page heading confirms `Grade 4`
- user does not need to re-select grade again unless they want to compare grades

#### TC-H04 Home page action options
Purpose: Parent should understand next options without confusion.

Expected:
- card offers `Explore`, and optionally `Try Demo` and `Buy`
- CTA labels are plain English
- no ambiguity between demo and paid access

### B. Grade 4 Course Detail Page

#### TC-C01 Course page hero clarity
Purpose: Parent should understand the course in 5 seconds.

Expected:
- page clearly says this is `Grade 4 Vedic Math AI Tutor`
- short summary explains what the child will learn
- visible demo CTA
- visible purchase CTA

#### TC-C02 Udemy-like course details
Purpose: Parent should get the confidence of a proper course page.

Expected:
- full lesson list is shown
- each lesson can expand into subtopics or outcomes
- chapter durations are visible
- learning goals are written in simple English
- course page looks like a real curriculum page, not just a marketing page

#### TC-C03 Detailed lesson-wise breakup
Purpose: Student and parent should both understand the structure before starting.

Expected:
- each Grade 4 lesson shows:
  - lesson title
  - concept focus
  - subtopics
  - practice type
  - expected outcome
  - whether demo is available for it

#### TC-C04 Purchase visibility
Purpose: Parent should never wonder where to buy.

Expected:
- purchase CTA visible above the fold
- purchase CTA repeated lower on the page
- pricing and access model are clear

#### TC-C05 Demo visibility
Purpose: Parent should be able to try before buying.

Expected:
- demo CTA clearly visible
- demo explains what is included and what is locked

#### TC-C06 Course page trust signals
Purpose: Build purchase confidence.

Expected:
- page shows parent-facing benefits
- page explains CBSE/grade relevance
- page shows how progress will be tracked
- page explains how AI adapts to mistakes and confusion

### C. Demo Flow vs Paid Flow

#### TC-D01 Demo entry clarity
Purpose: Demo should feel intentional, not accidental.

Expected:
- demo starts from Grade 4 only when launched from Grade 4 page
- demo confirms this is a preview
- demo states what is accessible: lesson count, chapter count, or exercise groups

#### TC-D02 Demo content quality
Purpose: Demo should be meaningful enough to create confidence.

Expected:
- demo includes topic intro, one worked explanation, guided practice, and limited independent practice
- demo is not just a raw question launcher

#### TC-D03 Demo limitation clarity
Purpose: User should know what unlocks after purchase.

Expected:
- locked items are shown clearly but positively
- message explains what full course includes
- upgrade CTA is available without interrupting the learning badly

#### TC-D04 Paid flow completeness
Purpose: Paid mode should feel richer than demo.

Expected:
- complete lesson path is visible
- full progress save/resume works
- all chapter groups are accessible according to enrollment
- badges, milestones, and dashboard sync are active

#### TC-D05 Demo-to-paid continuity
Purpose: Student should not feel they are starting from zero after purchase.

Expected:
- system can preserve last seen chapter or suggest where to continue
- parent understands what demo covered and what remains

### D. Tutor Main Page and Tutor Mode

#### TC-T01 Course main page before tutor mode
Purpose: Student should not be thrown directly into tutor mode without context.

Expected:
- when student opens Grade 4 course, they first see a course main page/dashboard
- page includes:
  - lesson list
  - current progress
  - recommended next lesson
  - badges/XP summary
  - demo or resume action

#### TC-T02 Enter tutor mode from chosen lesson
Purpose: Student should choose or resume clearly.

Expected:
- starting a lesson from main page opens tutor mode for that lesson/subtopic
- tutor mode reflects selected chapter and group

#### TC-T03 Back navigation from tutor mode
Purpose: Student should be able to return safely.

Expected:
- visible back button exists
- back returns to course main page/dashboard
- progress is preserved

#### TC-T04 Resume behavior
Purpose: Student should continue where they left off.

Expected:
- reopening the course shows current lesson and next suggested step
- resume CTA goes to the exact saved state or nearest safe checkpoint

### E. Pedagogical Flow Inside the Tutor

#### TC-P01 Topic introduction before question
Purpose: Tutor should teach before testing.

Expected:
- each subtopic starts with topic name and concept intro
- tutor explains what the child is about to learn
- only then does it move to guided question

#### TC-P02 Small-step teaching
Purpose: Grade 4 students need short working memory load.

Expected:
- concept is broken into tiny steps
- one idea at a time
- examples are age-appropriate
- wording is simple and concrete

#### TC-P03 Concept clarity checkpoints
Purpose: Tutor should explicitly ask if the child understood.

Expected:
- after explanation or demo, tutor asks something like:
  - `Is this clear?`
  - options: `Clear`, `Maybe`, `Not Clear`
- response changes the teaching path:
  - `Clear` moves forward
  - `Maybe` gives one more example
  - `Not Clear` reteaches in simpler words

#### TC-P04 Guided practice before independent practice
Purpose: Student should not be left alone too early.

Expected:
- demo step
- do-one-together step
- student try step
- only then independent practice

#### TC-P05 Empathetic correction
Purpose: Wrong answers should not feel harsh.

Expected:
- tutor response is supportive
- it explains the mistake type
- it retries with one smaller step
- it avoids shaming language

#### TC-P06 Behavior adaptation
Purpose: Tutor should respond to real student behavior.

Expected scenarios:
- silent student
- repeated wrong answers
- rushed/careless answers
- curious student asking many doubts
- slow but careful learner

Expected:
- tutor changes pace, hint level, or explanation style
- tutor encourages appropriately

#### TC-P07 Doubt handling
Purpose: Student should be able to ask for help naturally.

Expected:
- doubt input is visible and easy
- tutor answers the exact doubt in context
- tutor returns the child back to the lesson flow

#### TC-P08 Grade 4 language quality
Purpose: Content should fit Grade 4 comprehension.

Expected:
- no jargon without explanation
- short sentences
- familiar examples
- instructions readable by student and parent

### F. Engagement and Motivation

#### TC-E01 Reward visibility
Purpose: Student should feel progress in-session.

Expected:
- XP, badges, or stars are visible
- rewards correspond to actual learning moments
- rewards do not distract from teaching

#### TC-E02 Milestone logic
Purpose: Milestones should feel earned.

Expected:
- milestones are tied to chapter completion, streaks, accuracy, or concept mastery
- milestone text is understandable

#### TC-E03 Engagement without overload
Purpose: Product should be lively but not noisy.

Expected:
- visuals are engaging
- animations support learning
- screen is not cluttered
- primary action is always obvious

### G. Student Dashboard

#### TC-S01 Course-specific progress
Purpose: Student should see Grade 4 progress clearly.

Expected:
- dashboard shows Grade 4 course progress
- shows completed lessons, current lesson, next lesson
- shows badges, XP, streak, milestones

#### TC-S02 Accuracy and confidence visibility
Purpose: Student should know where they are improving.

Expected:
- accuracy shown by lesson or chapter
- recent sessions visible
- weak areas shown in child-friendly language

#### TC-S03 Navigation from dashboard
Purpose: Dashboard should be actionable.

Expected:
- student can resume current lesson
- student can open course details
- student can review completed lessons

#### TC-S04 Real data integrity
Purpose: Dashboard must reflect real tutor activity.

Expected:
- progress changes after real lesson activity
- data is not obviously placeholder or mismatched by grade

### H. Parent Dashboard

#### TC-PR01 Parent summary clarity
Purpose: Parent should get an instant summary.

Expected:
- chapters completed
- time spent
- accuracy
- streak
- current lesson

#### TC-PR02 Lesson-level visibility
Purpose: Parent should understand exactly where the child is.

Expected:
- chapter-by-chapter status
- current chapter and subtopic
- mastered, in-progress, locked state

#### TC-PR03 Weak area visibility
Purpose: Parent should know where help is needed.

Expected:
- weak concepts are explicit
- wording is educational, not alarming
- parent can see what tutor is doing about it

#### TC-PR04 Evidence of pedagogy
Purpose: Parent should trust the AI tutor as a real tutor.

Expected:
- dashboard explains:
  - what concepts were taught
  - where child needed retries
  - what was mastered
  - what needs revision

#### TC-PR05 Real data integrity
Purpose: Parent dashboard must reflect actual student activity.

Expected:
- data matches student dashboard and recent tutor sessions
- no generic or mock data behavior

### I. Navigation and Continuity

#### TC-N01 Home to course to tutor to dashboard loop
Purpose: Full journey should feel connected.

Expected:
- home page -> Grade 4 page -> lesson start -> tutor mode -> back to main page -> dashboard
- no dead ends
- no confusing resets

#### TC-N02 Grade switching
Purpose: Parent comparing grades should not lose context.

Expected:
- switching between grades changes course details correctly
- Grade 4 stays distinct from Grade 5

#### TC-N03 Deep links
Purpose: Shared or bookmarked links should remain safe.

Expected:
- direct links to Grade 4 course or demo open the correct grade
- no generic fallback to another grade or legacy course

### J. Trust and Purchase Readiness

#### TC-B01 Purchase confidence
Purpose: Parent should understand what is being bought.

Expected:
- price, refund, access model, and outcomes are easy to find
- parent can compare demo vs full access

#### TC-B02 Safety and independence
Purpose: Parent should feel comfortable letting the child use it alone.

Expected:
- product explains safe usage
- no unexpected exits or confusing controls
- child can recover from mistakes or misclicks

## Behavior-Driven Pedagogical Scenarios

These are mandatory because the AI Tutor should feel human-like, adaptive, and empathetic.

### TC-BH01 Student says `I did not understand`
Expected:
- tutor acknowledges confusion calmly
- reteaches with simpler wording
- gives one smaller example
- asks again if clear

### TC-BH02 Student answers wrong twice
Expected:
- tutor does not repeat same explanation mechanically
- changes approach
- points to the exact mistake
- returns confidence to the child

### TC-BH03 Student is silent
Expected:
- tutor prompts gently
- offers hint or multiple-choice scaffold
- avoids sounding impatient

### TC-BH04 Student is fast but careless
Expected:
- tutor praises speed
- asks for one self-check step
- highlights accuracy over rushing

### TC-BH05 Student is curious and asks many doubts
Expected:
- tutor answers in context
- keeps thread coherent
- does not punish curiosity by blocking flow

### TC-BH06 Student says concept is clear
Expected:
- tutor advances
- does not over-explain

### TC-BH07 Student says `Maybe`
Expected:
- tutor gives one more worked example
- checks clarity again

### TC-BH08 Student says `Not Clear`
Expected:
- tutor simplifies the concept
- uses a different explanation mode
- avoids advancing too soon

## Acceptance Checklist for Grade 4

Grade 4 is ready only if all of the following are true:
- Grade 4 is visible from home page
- Grade 4 has its own proper course page
- Grade 4 lesson list is detailed and understandable
- demo starts correctly from Grade 4
- tutor introduces concept before question
- tutor asks clarity checkpoints during learning
- tutor supports doubt, confusion, silence, and retry behavior
- student dashboard shows real Grade 4 progress
- parent dashboard shows real Grade 4 progress
- badges, XP, milestones, and next steps are visible
- tutor mode has a reliable back path to course main page
- demo and paid flows are clearly different

## Early Risk Notes From Current Build

These are not final findings, but they should be checked first during the gap audit:
- home page MindSutra card is generic and currently points its demo/link emphasis to Grade 5, not Grade 4
- student dashboard and parent dashboard have mock fallback behavior, so trust and data integrity need explicit testing
- course discovery is strong at brand level but not yet Grade 4-first
- pedagogy exists inside tutor flow, but explicit `Clear / Maybe / Not Clear` learner controls are not yet visible as a dedicated UX pattern
- lesson/course/main-page continuity needs validation: course page, course dashboard, tutor mode, and back navigation must behave as one connected product

## Recommended Next Step

Run this plan in three phases:

1. Paper audit
Verify each expected experience against current UI and API behavior.

2. Live UX gap audit
Walk through Grade 4 as:
- new parent
- demo student
- paid student
- parent reviewing dashboard

3. Fix strategy
Prioritize:
- discovery and Grade 4 positioning
- course main page and lesson breakup
- demo vs paid clarity
- clarity checkpoints in tutor pedagogy
- real dashboard data integrity