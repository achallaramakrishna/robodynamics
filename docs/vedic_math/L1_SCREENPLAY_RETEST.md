# Lesson 1 Screenplay Retest

- Generated: `2026-03-12T21:38:30+05:30`
- Tutor tester: `Asha`
- Student simulator: `Niagh`
- Lesson: `L1_COMPLETING_WHOLE`
- Scope: page 2 screenplay, lesson-state transitions, tutor voice path

## What Was Wrong

The page-2 flow was still breaking the intended classroom rhythm:

1. Raj was entering student-turn too early because authored screenplay beats in Step A used `pauseType: "student_response"` before the real runtime exercise.
2. Raj was speaking the runtime question while the UI was still in coach mode, so the board and the question appeared together.
3. Coach-mode buttons (`Show Steps`, `Try It`) were visible during explanation, which made the screen feel unfinished and noisy.
4. Browser voice fallback was still available in code, which could cause a Windows voice before Sarvam TTS became available.

## Runtime Fix Applied

The live client in [TutorClient.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx) now does this:

1. completes the explanation beats first
2. defers screenplay checkpoint pauses during the first teaching pass
3. switches the UI into student mode before Raj reads the actual question
4. asks only one clean try prompt after the real question
5. removes coach-mode action buttons from the explanation surface
6. keeps browser voice fallback disabled so tutor speech stays on Sarvam-only TTS

## Expected Lesson 1 Turn Order

1. Student logs in and lands on page 1.
2. Raj introduces the session on page 1 only.
3. Student clicks `Start Lesson`.
4. Page 2 opens in coach mode.
5. Raj explains the method on the board.
6. Page 2 switches to student mode.
7. Raj reads the visible exercise question.
8. Raj says a short try prompt.
9. Student answers.
10. Raj speaks feedback and either advances or retries.

## Retest Verdict

- Deterministic progression score: `100/100`
  Source: [L1_SIMULATION_LATEST.md](C:/roboworkspace/robodynamics/docs/vedic_math/L1_SIMULATION_LATEST.md)
- Live screenplay readiness score: `84/100`

## Why The Scores Differ

The deterministic simulator checks answer validation, hearts, XP, retry, and advancement. It does not validate whether page 2 feels like a real teacher-student exchange. That is why Lesson 1 can score `100/100` for progression but still fail launch quality on live screenplay/UX.

## Current Remaining Risks

- Step A authored screenplay content is still verbose for a minimal Duolingo-like lesson surface.
- The first live Sarvam utterance must be rechecked on production after deploy, because earlier prod behavior mixed browser voice and Sarvam voice.
- The current test is still runtime/code-path verification plus API simulation, not a headless browser replay.

## Launch Recommendation

Lesson 1 progression is strong enough to continue, but launch readiness still depends on:

1. confirming the first spoken line on prod is Sarvam, not browser TTS
2. confirming page 2 now shows only one active state at a time
3. tightening overly long Step A explanation content after live verification
