# Lesson 1 Login Live Interaction

- Tutor Tester: `Asha`
- Student Simulator: `Niagh`
- Lesson: `L1_COMPLETING_WHOLE`
- Scope: login -> start lesson -> first question -> first answer -> first feedback

## Expected Flow

1. Niagh logs in and sees the intro screen.
2. Raj introduces the lesson briefly.
3. Niagh clicks `Start Lesson`.
4. Raj begins Lesson 1, Step A.
5. Raj reads the actual question shown on screen.
6. Raj asks Niagh to try.
7. Niagh answers.
8. Raj gives spoken feedback and moves forward.

## Actual Implemented Flow

1. Niagh logs in and reaches the intro screen.
2. Niagh clicks `Start Lesson`.
3. Tutor start API opens Lesson 1 on Exercise Group `A`.
4. Runtime question shown to Niagh is:
   `9 + 6 = ? Show your two steps.`
5. Raj's current teaching flow then does:
   - coach line: `Scene 1: Introduction to Completing the Whole. We focus on friendly numbers and mental structure.`
   - board demo: `Write the chapter theme and show one quick whole: 24 + 26 = 50.`
   - read-aloud line: `In one sentence, what does 'completing the whole' mean?`
   - try line: `Niagh, try this one. Say your first step, then your answer. In one sentence, what does 'completing the whole' mean? Micro-practice: explain how 24 + 26 becomes 50 using whole completion.`
6. Niagh answers: `15`
7. Feedback is returned correctly, but it is primarily shown in the UI feedback card.

## Gap

- Raj is not reading the actual visible question first.
- Raj is combining `tryPrompt`, `masteryCheck`, and `reviewPrompt` into one overloaded turn.
- Feedback is not yet consistently delivered as a clean tutor reply after the student answers.

## Launch Decision

Lesson 1 login handoff is working, but the first live teaching turn is not yet launch-clean.

The first-turn fix should be:

1. Raj reads `question.questionText`.
2. Raj asks only `tryPrompt`.
3. Niagh answers.
4. Raj speaks feedback.
5. `reviewPrompt` appears only on retry or remediation.
