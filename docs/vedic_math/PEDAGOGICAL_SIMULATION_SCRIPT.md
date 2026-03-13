# Pedagogical Simulation Script

This note publishes the student-simulator script and explains how the score is calculated.

## Runnable Script

- Source: [simulate_pedagogical_flow.py](C:/roboworkspace/robodynamics/ai-tutor/tutor-api/scripts/simulate_pedagogical_flow.py)
- Output report: [PEDAGOGICAL_SIMULATION_REPORT.md](C:/roboworkspace/robodynamics/docs/vedic_math/PEDAGOGICAL_SIMULATION_REPORT.md)
- Output data: [PEDAGOGICAL_SIMULATION_REPORT.json](C:/roboworkspace/robodynamics/docs/vedic_math/PEDAGOGICAL_SIMULATION_REPORT.json)

## What It Does

- Starts a real tutor session for each Vedic Math chapter.
- Walks the chapter exercise flow from A to I.
- Simulates a student response on every group.
- Probes retry behavior on a rotating pattern by answering wrongly first on some groups, then answering correctly.
- Verifies that:
  - the expected answer is accepted,
  - hearts and XP update sensibly,
  - lesson completion progresses,
  - question IDs do not repeat unexpectedly inside a chapter.

## Scoring Method

- Chapter score starts from successful end-state completion rate.
- Penalty: `4` points for each group-level issue.
- Penalty: `2` points for each chapter-level issue not already counted at group level.
- Overall score is the average of all chapter scores.

In short:

```text
chapter score = completion success rate - issue penalties
overall score = average(chapter scores)
```

## Latest Published Result

- Overall score: `98.12 / 100`
- Chapters simulated: `16`
- Exercise groups simulated: `144`
- Attempts submitted: `192`
- Issues flagged: `15`

## Main Flagged Pattern

- The simulator found repeated `questionId` reuse in some chapters, which reduced completion/XP progression even when the learner answered correctly.
- That is why some chapters show `66.67%` completion with only one flagged issue.

## Command

Run from the repo root with Python 3.13:

```powershell
& 'C:\Users\Achalla Ramakrishna\AppData\Local\Programs\Python\Python313\python.exe' `
  'C:\roboworkspace\robodynamics\ai-tutor\tutor-api\scripts\simulate_pedagogical_flow.py'
```
