# Page 2 Student Simulator Scenario

- Tutor Tester: `Asha`
- Student Simulator: `Niagh`
- Lesson under test: `L1_COMPLETING_WHOLE`
- Scope: page 2 only

## Goal

Test the real live lesson surface after login and `Start Lesson`, using the same page area for:

- tutor explanation
- whiteboard demo
- student attempt
- tutor feedback

## Scenario

### Scenario S1: First Live Lesson Turn

Expected sequence:

1. Niagh logs in and clicks `Start Lesson`.
2. Page 2 opens directly on Lesson 1, Step A.
3. Raj briefly introduces the step.
4. Raj reads the actual visible exercise question.
5. Raj asks Niagh to try.
6. Niagh answers.
7. Raj gives spoken feedback.
8. Raj either advances or reteaches.

Pass criteria:

- page 2 opens without dashboard-like clutter
- one main lesson surface is visible
- whiteboard text does not overlap
- Raj reads the actual question on screen
- Raj does not ask mastery and review prompts in the same first-turn line
- feedback comes after student response

### Scenario S2: Wrong Then Recover

Expected sequence:

1. Raj reads the actual exercise.
2. Raj asks Niagh to try.
3. Niagh gives a wrong answer.
4. Raj gives a short retry line.
5. Raj optionally gives one smaller hint or board repair.
6. Niagh retries.
7. Raj confirms the corrected answer and advances.

Pass criteria:

- hearts reduce correctly
- retry remains in the same lesson context
- retry prompt is shorter than the original teaching block
- review prompt appears only after the wrong answer path

### Scenario S3: Correct Then Advance

Expected sequence:

1. Raj reads the question.
2. Niagh answers correctly.
3. Raj gives short praise.
4. progress advances
5. next question loads cleanly

Pass criteria:

- XP increases
- completion increases
- next step loads without stale text from the previous step

## Actual Functionality Tested

The current test set exercises:

- tutor start handoff
- first question load
- correct-first answer path
- wrong-then-recover path
- chapter progression
- question ID integrity

Supporting reports:

- [L1_LOGIN_LIVE_INTERACTION.md](C:/roboworkspace/robodynamics/docs/vedic_math/L1_LOGIN_LIVE_INTERACTION.md)
- [L1_EXPECTED_VS_ACTUAL_GAP_REPORT.md](C:/roboworkspace/robodynamics/docs/vedic_math/L1_EXPECTED_VS_ACTUAL_GAP_REPORT.md)
- [LAUNCH_SCENARIO_REPORT.md](C:/roboworkspace/robodynamics/docs/vedic_math/LAUNCH_SCENARIO_REPORT.md)

## Current Known Gaps

- whiteboard header text overlap was observed in `screen.png`
- content JSON still contains read-aloud prompts that do not always match runtime question text
- some conversation quality still depends on runtime composition, not only authored lesson content

## Launch Standard For Page 2

Page 2 is launch-ready only if:

1. the layout is minimal
2. the whiteboard is visually clean
3. Raj reads the visible question
4. Raj asks one clean try prompt
5. Niagh answers
6. Raj reacts after the answer
7. progression updates without confusion
