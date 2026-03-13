# AI Tutor Launch Scenario Report

- Generated: 2026-03-12T13:53:07.442543+00:00
- Scenarios run: `5`
- Passed: `5`
- Failed: `0`
- Overall score: `100.0/100`

## Scenario Results

### launch_01: Intro To Lesson Handoff

- Result: `PASS`
- Score: `100.0/100`
- Summary: Start Lesson lands directly on the first real question payload.
- Evidence:
  - `activeExerciseGroup=A`
  - `questionId=L1_A_H_b582b5`
  - `questionText=6 + 8 = ?  Explain the method in a sentence, then give the answer.`
  - `hasDuolingoArc=True`

### launch_02: Correct First Answer Progression

- Result: `PASS`
- Score: `100.0/100`
- Summary: Correct-first answer advances XP and lesson completion.
- Evidence:
  - `questionId=L1_A_E_492c9a`
  - `correct=True`
  - `xp=10`
  - `completion=11.11`

### launch_03: Wrong Then Recover

- Result: `PASS`
- Score: `100.0/100`
- Summary: Wrong-first recovery behaves correctly: hearts drop, retry stays alive, correct answer restores momentum.
- Evidence:
  - `wrongAccepted=False`
  - `wrongHearts=4`
  - `rightAccepted=True`
  - `rightXp=10`

### launch_04: Chapter Completion Path

- Result: `PASS`
- Score: `100.0/100`
- Summary: A clean chapter run reaches full completion.
- Evidence:
  - `groups=9`
  - `finalCompletion=100.0`
  - `finalXp=90`
  - `finalHearts=5`

### launch_05: Question ID Integrity

- Result: `PASS`
- Score: `100.0/100`
- Summary: Every chapter uses unique question IDs.
- Evidence:
  - `No repeated questionId values found.`
