# Student Behavior Model

This document defines the learner behaviors the tutor must recognize and accommodate during a live course session.

The current system handles only part of this space. For launch, behavior handling should be explicit rather than accidental.

## Goal

The tutor should not react the same way to every learner.

It must adapt based on:

- speed
- correctness
- retries
- help-seeking
- confidence
- skip behavior
- frustration signals

## Behavior Personas

### 1. Correct Fast

Traits:

- answers correctly on first attempt
- responds quickly
- high streak

Tutor response:

- keep explanation short
- promote faster
- offer challenge variant
- reward immediately

### 2. Careful Correct

Traits:

- answers correctly
- moderate or slow response time
- low skip behavior

Tutor response:

- keep current pace
- confirm reasoning
- move forward without over-explaining

### 3. Hesitant But Teachable

Traits:

- pauses often
- asks for reassurance
- succeeds after one hint

Tutor response:

- give one worked cue
- encourage explicitly
- ask student to try again quickly

### 4. Wrong But Confident

Traits:

- submits wrong answer quickly
- confidence signal is high
- repeats similar mistakes

Tutor response:

- correct misconception directly
- show one counter-example
- avoid long encouragement-only replies

### 5. Repeatedly Confused

Traits:

- multiple wrong attempts
- low mastery trend
- same subtopic keeps failing

Tutor response:

- reteach simpler
- break the task into smaller steps
- move to review loop if needed

### 6. Silent Or Stuck

Traits:

- long no-response gap
- does not type or speak
- may reopen help without answering

Tutor response:

- offer a smaller first step
- ask a simpler question
- give a starter hint before expecting full answer

### 7. Help-Seeking

Traits:

- asks many doubts
- wants examples before answering
- chat-heavy behavior

Tutor response:

- answer briefly
- return to task quickly
- avoid turning lesson into open-ended chat

### 8. Guessing Randomly

Traits:

- very fast wrong answers
- no pattern of reasoning
- multiple inconsistent guesses

Tutor response:

- slow the learner down
- require one explicit reasoning step
- present one worked example

### 9. Frustrated

Traits:

- repeated wrong answers
- skip tendency increases
- doubt tone becomes emotional
- hearts decline quickly

Tutor response:

- shorten the task
- reduce challenge
- use supportive phrasing
- create a quick win

### 10. Advanced Or Bored

Traits:

- fast correct streak
- very high mastery
- low need for help

Tutor response:

- compress explanation
- unlock challenge task
- reduce repetition

### 11. Skip-Heavy

Traits:

- uses skip often
- moves through lessons without attempts

Tutor response:

- detect avoidance
- present a smaller mandatory attempt
- reduce passive progression

### 12. Example-First Learner

Traits:

- prefers explanation before trying
- may hesitate if asked to solve immediately

Tutor response:

- show one mini-example
- then immediately ask for attempt

### 13. Try-First Learner

Traits:

- wants to solve before hearing a full explanation

Tutor response:

- ask student to try first
- explain only after answer or failure

## Runtime Detection Signals

Each behavior should be inferred from signals already available or easy to add.

### Existing Signals

- `responseTimeMs`
- `correct / incorrect`
- `attempt count`
- `streak`
- `hearts`
- `masteryPct`
- `reviewQueue`
- `doubt count`
- `skip count`
- `confidence`
- `voice vs text`

### Recommended Additional Signals

- no-response timeout count
- repeated misconception tag
- chat-to-answer ratio
- fast-wrong frequency
- challenge acceptance rate

## Behavior Detection Rules

Recommended first deterministic rules:

- `correct_fast`
  correct on first attempt and `responseTimeMs` below target threshold

- `hesitant_but_teachable`
  long response time plus correct after one hint/retry

- `wrong_but_confident`
  wrong answer plus confidence `high`

- `repeatedly_confused`
  two or more wrong attempts in same step or same subtopic weakness repeated

- `silent_or_stuck`
  no answer after timeout threshold

- `help_seeking`
  doubt count above threshold before answer

- `guessing_randomly`
  multiple fast wrong answers with low consistency

- `frustrated`
  error streak plus heart drop plus skip increase

- `advanced_bored`
  repeated correct-fast pattern plus high mastery

- `skip_heavy`
  skip count above threshold in lesson

## Tutor Response Policy

For every behavior, define:

- explanation length
- whether to ask or explain first
- whether to show worked example
- whether to use hint ladder
- whether to simplify
- whether to promote
- reward tone

### Minimal Response Matrix

- `correct_fast`
  short praise, next challenge

- `careful_correct`
  confirm method, continue

- `hesitant_but_teachable`
  one hint, one try prompt

- `wrong_but_confident`
  direct misconception correction

- `repeatedly_confused`
  reteach simpler, smaller step

- `silent_or_stuck`
  starter prompt, partial answer invitation

- `help_seeking`
  short answer, bring back to task

- `guessing_randomly`
  require reasoning, then retry

- `frustrated`
  supportive line, easier success task

- `advanced_bored`
  compress and promote

- `skip_heavy`
  limit passive skipping, force small attempt

## Content Hooks Required

Each lesson step should support these optional fields:

- `standardPrompt`
- `readAloudPrompt`
- `tryPrompt`
- `stuckPrompt`
- `frustratedPrompt`
- `advancedPrompt`
- `helpReturnPrompt`
- `reviewPrompt`
- `instantFeedbackWin`
- `instantFeedbackRetry`

Without these hooks, behavior adaptation will remain shallow.

## UI Constraint

Behavior adaptation should not create more panels.

The lesson UI must remain:

- one main lesson surface
- one active prompt
- one answer area
- one small progress line

Behavior changes should alter wording, difficulty, and next action, not create a cluttered screen.

## Student Simulator Coverage

The simulator should run these paths per chapter:

- correct-first path
- wrong-first path
- help-seeking path
- slow response path
- repeated-confusion path
- skip-heavy path
- advanced-fast path

Current simulator status:

- implemented for correct-first and wrong-first rotation
- needs expansion for the rest

Reference:

- [simulate_pedagogical_flow.py](C:/roboworkspace/robodynamics/ai-tutor/tutor-api/scripts/simulate_pedagogical_flow.py)

## OpenAI Touchpoints

OpenAI can help at these behavior stages:

- review whether detection rules are reasonable
- improve recovery phrasing per behavior
- analyze simulator reports by behavior persona
- suggest missing tutor reactions

OpenAI should not determine final runtime behavior transitions by itself.

## Recommended Implementation Order

1. publish persona list
2. add deterministic detection rules
3. add behavior-specific content hooks
4. wire runtime behavior state
5. expand simulator scenarios
6. review reports with OpenAI
7. tune and release

## Launch-Phase Recommendation

For the immediate launch window:

- support at least these behaviors first:
  - correct fast
  - hesitant but teachable
  - repeatedly confused
  - help seeking
  - frustrated
  - advanced / bored
- keep the UI minimal and unchanged
- expand behavior intelligence behind the scenes
