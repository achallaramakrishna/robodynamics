# Lesson 1: 10 Student Behavior Scenarios

- Generated: `2026-03-12T21:38:30+05:30`
- Tutor tester: `Asha`
- Student simulator: `Niagh`
- Lesson: `L1_COMPLETING_WHOLE`
- Scope: live lesson behavior review for page 2

## Scoring Method

- `9-10`: launch-strong
- `7-8`: acceptable but needs polish
- `5-6`: weak
- `<5`: launch blocker

## Overall Result

- Deterministic lesson progression score: `100/100`
- Live classroom-flow score: `84/100`
- Student behavior readiness score: `80/100`

## Scenario Matrix

### S1. Careful Beginner

- Behavior: waits for Raj, then types the answer carefully.
- Expected: Raj explains, reads the question, asks to try, waits, then confirms.
- Current result: good after the runtime fix.
- Score: `9/10`
- Feedback: this is the cleanest path and should now feel close to the intended launch flow.

### S2. Fast Correct Student

- Behavior: answers quickly on the first try.
- Expected: short praise, XP update, clean advance.
- Current result: strong. [L1_SIMULATION_LATEST.md](C:/roboworkspace/robodynamics/docs/vedic_math/L1_SIMULATION_LATEST.md) shows clean advancement through all groups.
- Score: `9/10`
- Feedback: progression works well; the remaining issue is not logic, it is making the explanation shorter before the first answer.

### S3. Hesitant But Correct

- Behavior: pauses, then types the correct answer.
- Expected: no pressure, stable student mode, no duplicate prompts.
- Current result: acceptable.
- Score: `8/10`
- Feedback: the screen now waits correctly, but the tutor could still use a softer nudge if the student stays inactive for several seconds.

### S4. Wrong Then Recover

- Behavior: first answer is wrong, second answer is correct.
- Expected: one retry line, one hint, same step retained, then advance.
- Current result: strong. The deterministic simulator shows clean retry handling in B, E, and H.
- Score: `9/10`
- Feedback: retry logic is good; spoken retry tone can still be made warmer.

### S5. Silent Or Stuck Student

- Behavior: student does nothing after Raj asks.
- Expected: Raj should notice the pause and give a small recovery prompt.
- Current result: weak.
- Score: `6/10`
- Feedback: the current flow waits correctly, but it does not yet proactively rescue silence with a timed “let me help” teacher intervention.

### S6. Student With Mic Blocked

- Behavior: browser microphone permission is denied.
- Expected: tutor should still work through text input without confusion.
- Current result: good.
- Score: `8/10`
- Feedback: the text fallback exists and the UI message is clear. This is acceptable for launch.

### S7. Voice-Answer Student

- Behavior: student responds by speaking.
- Expected: Raj speaks with Sarvam, student answer is captured by mic, then feedback is spoken.
- Current result: acceptable with one risk.
- Score: `7/10`
- Feedback: the interaction path exists, but the first tutor utterance on prod must be revalidated because earlier it could start on browser voice before Sarvam took over.

### S8. Help-Seeking Student

- Behavior: student wants help before answering.
- Expected: the board should reopen only as needed, without cluttering the screen.
- Current result: acceptable.
- Score: `8/10`
- Feedback: `Show Steps` in student mode is the right minimal fallback. This is much better than a permanent help panel.

### S9. Frustrated Student

- Behavior: gets one wrong answer and becomes unsure.
- Expected: Raj should reduce pressure, simplify, and encourage.
- Current result: weak-to-acceptable.
- Score: `7/10`
- Feedback: feedback exists, but the emotional recovery path is still generic. It needs more human tutoring tone.

### S10. Skip-Heavy Student

- Behavior: keeps skipping to move fast.
- Expected: tutor should allow progress but preserve coherence.
- Current result: acceptable.
- Score: `7/10`
- Feedback: technically it works, but too much skipping can reduce teaching value. This is a pedagogy risk, not a runtime crash.

## Best Current Paths

- `S1 Careful Beginner`
- `S2 Fast Correct Student`
- `S4 Wrong Then Recover`

## Weakest Current Paths

- `S5 Silent Or Stuck Student`
- `S7 Voice-Answer Student`
- `S9 Frustrated Student`

## Summary

Lesson 1 is now strong on progression and much closer on flow, but it is not perfect yet. The major launch blockers are no longer answer-checking or step advancement. The remaining risk is interaction quality:

1. first-turn tutor speech must be confirmed on Sarvam in prod
2. silence recovery needs a better teacher intervention
3. Step A explanation is still longer than ideal for a minimal Duolingo-style lesson
