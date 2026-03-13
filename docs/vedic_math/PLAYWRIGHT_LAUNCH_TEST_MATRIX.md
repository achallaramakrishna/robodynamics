# AI Tutor Playwright Launch Test Matrix

## Why This Exists

The Playwright suite should do two jobs at the same time:

1. prove that the intended student flow works
2. expose the loopholes where ai-tutor breaks under realistic student behavior

That means the suite cannot be only a happy-path smoke test.

It needs a combination of:

- good scenarios
- bad scenarios

Good scenarios confirm that the lesson feels correct when the student follows the expected path.

Bad scenarios pressure the product at the exact places where launch users will break it:

- silence
- wrong answers
- misconception answers
- help-seeking
- mic failure
- skip-heavy behavior
- frustration

If a bad scenario fails, that is not a test-design problem. It is usually a product loophole that should be fixed before launch.

## How AI Tutor Should Work

The intended learner flow is:

1. student opens Lesson 1
2. onboarding is clear and short
3. student starts the mission
4. Raj teaches briefly on the same surface
5. the UI switches cleanly from Coach turn to Your turn
6. one clear question and one answer area become visible
7. student answers by text or voice
8. tutor gives immediate feedback
9. learner either retries the same step or advances
10. student can pause and resume without losing the current question
11. student can jump back to previous lessons and restart cleanly
12. hearts, XP, and progression remain coherent

If this flow breaks, the student experiences confusion, not pedagogy.

## Good Scenario Meaning

A good scenario asks:

- does the intended flow work when the learner behaves normally?
- is the handoff from coach to question seamless?
- does a correct answer move the lesson forward cleanly?
- can a learner ask for help without losing context?

If a good scenario fails, the baseline experience is not launch-ready.

## Bad Scenario Meaning

A bad scenario asks:

- what happens when the learner does not behave ideally?
- does the tutor recover, or does it stall?
- does the UI stay coherent after a wrong answer, silence, skip, or mic issue?
- does the tutor become more helpful under pressure, or more confusing?

If a bad scenario fails, Playwright is showing a loophole in the ai-tutor product.

That loophole should be treated as product work, not ignored as an edge case.

## Launch Rule

The most important launch rule is this:

The student must always know whose turn it is and what action to take next.

So the highest-value Playwright checks are:

- onboarding clarity
- coach-to-question handoff
- answer input visibility
- retry continuity
- recovery after silence or failure

## Scenario Buckets

### Good Scenarios

| ID | Scenario | Why it matters |
| --- | --- | --- |
| L1-G01 | Careful Beginner Handoff | Validates the first-time student flow |
| L1-G02 | Fast Correct Student | Validates clean progression and momentum |
| L1-G03 | Help-Seeking Student | Validates guidance without losing context |
| L1-G04 | Mic Blocked Text Fallback | Validates text-first continuity when voice is unavailable |
| L1-G05 | Interrupted Student | Validates pause-and-resume continuity during real interruptions |
| L1-G06 | Returning Student | Validates going back to a previous lesson for revision |

### Bad Scenarios

| ID | Scenario | Loophole it is trying to expose |
| --- | --- | --- |
| L1-B01 | Silent Or Stuck Student | Tutor leaves learner waiting forever |
| L1-B02 | Wrong Then Recover | Retry loop breaks step continuity |
| L1-B03 | Wrong But Confident | Tutor gives generic instead of corrective feedback |
| L1-B04 | Voice Answer Student | Voice flow exists but is not dependable |
| L1-B05 | Skip-Heavy Student | Skip creates stale or mixed question state |
| L1-B06 | Frustrated Student | Retry tone and simplification are too weak |

## How To Read Playwright Results

A Playwright pass means:

- the learner behavior is supported
- the current surface is coherent
- the state transition is stable

A Playwright failure means one of these:

- the UI state is broken
- the timing of the lesson is wrong
- the handoff between tutoring and answering is unclear
- recovery behavior is missing
- the tutor is not adapting well enough for launch

So test failures should map directly into fix work.

## What Should Count As A Launch Blocker

These are blocker-level findings:

1. answer input never appears after coach turn
2. question appears but the learner cannot act
3. wrong answer does not preserve a clean retry state
4. help flow breaks the lesson surface
5. silence has no recovery prompt
6. mic denial blocks typed completion
7. pause and resume loses the saved working step
8. previous-lesson navigation cannot restart cleanly
9. skip leaves stale or mixed state on screen

## Repo Files

- Playwright behavior matrix:
  [l1-launch-matrix.ts](/C:/roboworkspace/robodynamics/ai-tutor/web/tests/prod/l1-launch-matrix.ts)

- Existing production Playwright spec:
  [l1-scenarios.spec.ts](/C:/roboworkspace/robodynamics/ai-tutor/web/tests/prod/l1-scenarios.spec.ts)



