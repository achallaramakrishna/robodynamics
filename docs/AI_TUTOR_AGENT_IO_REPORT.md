# AI Tutor Agent I/O Report

Date: 2026-03-10
Scope: AI Tutor content-production pipeline for source PDF to publish decision

## 1. Why This Report Exists

The most important design rule for the AI Tutor platform is:

- every agent must have a clear input contract
- every agent must produce a named output artifact
- every downstream agent must consume those artifacts, not hidden prompt state

This report defines those contracts for the first practical version of the platform.

## 2. Pipeline Summary

The pipeline should be controlled by a top-level `Project Manager` agent.

This agent does not generate content itself.
It orchestrates the other agents, tracks blockers, decides which chapter moves next, and emits course-level readiness.

| Stage | Agent | Main Input | Main Output | Nature |
|---|---|---|---|---|
| 0 | Project Manager | Course config, chapter inventory, stage policy | Build manifest, chapter board, readiness report | Deterministic orchestrator |
| 1 | Pedagogical Architect | Course brief, grade band, subject standard | Standardized blueprint JSON | Mostly deterministic |
| 2 | Content Generator | Chapter PDF + blueprint JSON + standard JSON | Chapter lesson-plan JSON draft | Mixed, can be deterministic + LLM |
| 3 | Deterministic Validator | Lesson-plan JSON or chapter JSON | Validation report JSON | Code only |
| 4 | Pedagogy Reviewer | Deterministically validated JSON | Pedagogy review JSON | LLM |
| 5 | UI/UX Reviewer | Rendered lesson state or UI snapshots | UX review JSON | Mixed |
| 6 | Student Simulator | Lesson JSON + learner profile | Student simulation JSON | LLM-guided |
| 7 | Human Approval / Publish | All reports | Approval decision + publish status | Human + code |

## 3. Artifact Chain

The pipeline should move through these artifacts in order:

1. `course_build_manifest.json`
2. `chapter_status_board.json`
3. `course_readiness_report.json`
4. `course_standard.json`
5. `course_blueprint.json`
6. `chapter_lesson_plan.json`
7. `deterministic_validation_report.json`
8. `pedagogy_review_report.json`
9. `ui_ux_review_report.json`
10. `student_simulation_report.json`
11. `publish_decision.json`

No stage should skip directly to publish.

## 4. Agent-by-Agent I/O

### 4.0 Project Manager

Purpose:
- orchestrates the full course build
- tracks stage order, blockers, reruns, and chapter-level movement
- produces course-level execution status

#### Inputs

Required input fields:

```json
{
  "courseId": "vedic_math",
  "courseConfigPath": "ai-tutor/pipeline/course-configs/vedic_math.json",
  "chapterSelection": ["L1_COMPLETING_WHOLE", "L2_DOUBLING_HALVING"],
  "stageSelection": [
    "pedagogical_architect",
    "content_generator",
    "deterministic_validator",
    "pedagogy_reviewer",
    "ui_ux_reviewer",
    "student_simulator",
    "publish_orchestrator"
  ]
}
```

#### Outputs

Primary output artifacts:

```json
{
  "course_build_manifest": {
    "pipelineRunId": "uuid",
    "courseId": "vedic_math",
    "stageOrder": ["..."],
    "artifactRoot": "ai-tutor/artifacts/pipeline/vedic_math/<runId>"
  },
  "chapter_status_board": {
    "chapters": [
      {
        "chapterCode": "L1_COMPLETING_WHOLE",
        "nextAgent": "pedagogy_reviewer",
        "blockers": []
      }
    ]
  },
  "course_readiness_report": {
    "totalChapters": 16,
    "deterministicReadyCount": 3,
    "blockedCount": 13
  }
}
```

Downstream consumer:
- every other agent
- human operator

The PM agent is the controller.
The publish orchestrator is only the final machine decision stage.

### 4.1 Pedagogical Architect

Purpose:
- defines the pedagogical contract before any chapter is generated

#### Inputs

Required input fields:

```json
{
  "courseId": "vedic_math",
  "courseTitle": "Vedic Math",
  "gradeBand": "5-8",
  "subject": "mathematics",
  "curriculumContext": "India tutoring enrichment",
  "standardPath": "ai-tutor/scripts/standards/vedic_math_standard.json",
  "courseBrief": {
    "teachingStyle": "interactive mental math tutor",
    "targetSessionMinutes": 25,
    "difficultyModel": ["easy", "medium", "hard"],
    "deliveryModes": ["voice", "board", "text"]
  }
}
```

Optional inputs:
- board constraints
- assessment philosophy
- tutor persona
- language/localization defaults
- Bloom coverage targets

#### Outputs

Primary output artifact:

```json
{
  "artifactType": "course_blueprint",
  "courseId": "vedic_math",
  "version": "1.0.0",
  "gradeBand": "5-8",
  "pedagogicalContract": {
    "requiredTeachingPhases": ["INTRO", "EXPLAIN", "DEMO", "GUIDED", "PRACTICE", "CHECK", "CHECKPOINT"],
    "difficultyLadder": ["easy", "medium", "hard"],
    "sessionModel": {
      "estimatedMinutes": 25,
      "workedExamplesMin": 4,
      "questionPoolMin": 24
    }
  },
  "chapterBlueprints": [
    {
      "chapterCode": "L1_COMPLETING_WHOLE",
      "title": "Lesson 1: Completing the Whole",
      "learningGoals": ["..."],
      "summaryTopics": ["..."],
      "phaseIntentMap": {
        "INTRO": "...",
        "EXPLAIN": "...",
        "DEMO": "...",
        "GUIDED": "...",
        "PRACTICE": "...",
        "CHECK": "...",
        "CHECKPOINT": "..."
      }
    }
  ]
}
```

Downstream consumer:
- Content Generator

#### Publish / storage expectation

- saved once per course version
- should be reusable across all chapters

---

### 4.2 Content Generator

Purpose:
- converts chapter source material into a tutor-ready chapter lesson draft

#### Inputs

Required input fields:

```json
{
  "courseId": "vedic_math",
  "chapterCode": "L4_VERTICAL_CROSSWISE",
  "sourcePdfPath": "docs/vedic_math/chap_4_left_to_right.pdf",
  "standardPath": "ai-tutor/scripts/standards/vedic_math_standard.json",
  "blueprintPath": "artifacts/ai_tutor_pipeline/vedic_math/course_blueprint.json",
  "chapterMetadataPath": "ai-tutor/tutor-api/content-template/vedic_math/chapter/L4_VERTICAL_CROSSWISE.json"
}
```

Minimum logical inputs:
- source chapter PDF
- pedagogical blueprint
- quality standard
- course/chapter identity

#### Outputs

Primary output artifact:

```json
{
  "artifactType": "chapter_lesson_plan",
  "courseId": "vedic_math",
  "chapterCode": "L4_VERTICAL_CROSSWISE",
  "title": "Lesson 4: Left to Right Arithmetic",
  "sourcePdfPath": "docs/vedic_math/chap_4_left_to_right.pdf",
  "estimatedMinutes": 30,
  "learningGoals": ["..."],
  "summaryTopics": ["..."],
  "lessonSequence": [
    {
      "phase": "INTRO",
      "topic": "Addition from Left to Right",
      "teacherObjective": "...",
      "studentAction": "..."
    }
  ],
  "workedExamples": [
    {
      "question": "...",
      "method": "...",
      "answer": "..."
    }
  ],
  "practiceCheckpoints": [
    {
      "label": "Practice A",
      "prompt": "..."
    }
  ],
  "boardPlan": ["..."],
  "exitTicket": "..."
}
```

Optional outputs:
- screenplay draft
- question anchors
- remediation prompts
- extracted source summary

Downstream consumer:
- Deterministic Validator

#### Quality rule

The generator is allowed to draft.
It is not allowed to self-approve.

---

### 4.3 Deterministic Validator

Purpose:
- executes non-negotiable structural checks before any LLM review is paid for

#### Inputs

Required input:

```json
{
  "courseId": "vedic_math",
  "chapterCode": "L4_VERTICAL_CROSSWISE",
  "artifactPath": "artifacts/ai_tutor_pipeline/vedic_math/L4_VERTICAL_CROSSWISE/chapter_lesson_plan.json",
  "standardPath": "ai-tutor/scripts/standards/vedic_math_standard.json"
}
```

#### Outputs

Primary output artifact:

```json
{
  "artifactType": "deterministic_validation_report",
  "courseId": "vedic_math",
  "chapterCode": "L4_VERTICAL_CROSSWISE",
  "status": "pass_with_warnings",
  "layers": {
    "l1_schema": {
      "pass": true,
      "score": 20,
      "issues": []
    },
    "l2_completeness": {
      "pass": true,
      "score": 22,
      "issues": []
    },
    "l3_math": {
      "pass": true,
      "score": 30,
      "issues": []
    }
  },
  "overallScore": 96,
  "blockingIssues": [],
  "warnings": ["question ids not in canonical format"]
}
```

Checks that belong here:
- schema presence
- field types
- counts and thresholds
- phase completeness
- difficulty coverage
- arithmetic correctness
- broken references
- question-id patterns
- timing sanity

Checks that do not belong here:
- “Is this explanation inspiring?”
- “Is this culturally engaging?”
- “Does this feel repetitive?”

Downstream consumer:
- Pedagogy Reviewer
- Publish Orchestrator

---

### 4.4 Pedagogy Reviewer

Purpose:
- evaluates the teaching quality after deterministic checks pass

#### Inputs

Required input:

```json
{
  "courseId": "vedic_math",
  "chapterCode": "L4_VERTICAL_CROSSWISE",
  "validatedArtifactPath": "artifacts/.../chapter_lesson_plan.json",
  "validationReportPath": "artifacts/.../deterministic_validation_report.json",
  "reviewModel": "claude-sonnet or openai-gpt"
}
```

#### Outputs

Primary output artifact:

```json
{
  "artifactType": "pedagogy_review_report",
  "courseId": "vedic_math",
  "chapterCode": "L4_VERTICAL_CROSSWISE",
  "status": "reviewed",
  "scores": {
    "teaching_clarity": 8.3,
    "difficulty_progression": 7.8,
    "example_quality": 8.0,
    "engagement": 7.1,
    "bloom_coverage": 7.4
  },
  "overallScore": 7.72,
  "topIssues": ["..."],
  "suggestedFixes": ["..."],
  "approvalRecommendation": "approve_with_minor_edits"
}
```

This report should never replace the deterministic validator.

Downstream consumer:
- Human reviewer
- Publish Orchestrator

---

### 4.5 UI/UX Reviewer

Purpose:
- checks the learner experience of the rendered flow, not only the content JSON

#### Inputs

Required input:

```json
{
  "courseId": "vedic_math",
  "chapterCode": "L4_VERTICAL_CROSSWISE",
  "lessonJsonPath": "artifacts/.../chapter_lesson_plan.json",
  "uiSnapshotPaths": [
    "artifacts/.../screen_intro.png",
    "artifacts/.../screen_guided.png"
  ],
  "uiStateDumpPath": "artifacts/.../ui_state.json"
}
```

#### Outputs

Primary output artifact:

```json
{
  "artifactType": "ui_ux_review_report",
  "courseId": "vedic_math",
  "chapterCode": "L4_VERTICAL_CROSSWISE",
  "status": "reviewed",
  "frictionPoints": [
    "Too much text on intro screen",
    "Hint button is not obvious"
  ],
  "accessibilityIssues": [
    "Low contrast on board annotation"
  ],
  "engagementRisks": [
    "Long delay before learner interaction"
  ],
  "suggestedFixes": [
    "Move first learner action earlier",
    "Reduce one paragraph to one line"
  ]
}
```

Downstream consumer:
- Human reviewer
- Publish Orchestrator

---

### 4.6 Student Simulator

Purpose:
- simulates likely student reactions for a defined learner profile

#### Inputs

Required input:

```json
{
  "courseId": "vedic_math",
  "chapterCode": "L4_VERTICAL_CROSSWISE",
  "lessonJsonPath": "artifacts/.../chapter_lesson_plan.json",
  "learnerProfile": {
    "gradeBand": "5-8",
    "confidence": "medium",
    "pace": "average",
    "weaknesses": ["mental subtraction", "multi-step attention"],
    "languageComfort": "english"
  }
}
```

#### Outputs

Primary output artifact:

```json
{
  "artifactType": "student_simulation_report",
  "courseId": "vedic_math",
  "chapterCode": "L4_VERTICAL_CROSSWISE",
  "status": "simulated",
  "stuckMoments": [
    "I understood the first example but got lost at the carry step"
  ],
  "repetitionRisks": [
    "Two explanation beats felt too similar"
  ],
  "hintEffectiveness": [
    {
      "hint": "focus on the left-most place value first",
      "helped": true
    }
  ],
  "recommendedFixes": [
    "Add one simpler transition example before 3-digit subtraction"
  ]
}
```

Important rule:
- this report is advisory
- it must never be the sole publish gate

Downstream consumer:
- Human reviewer
- Publish Orchestrator

---

### 4.7 Human Approval / Publish

Purpose:
- final release authority after all machine reports exist

#### Inputs

Required input:

```json
{
  "courseId": "vedic_math",
  "chapterCode": "L4_VERTICAL_CROSSWISE",
  "lessonArtifactPath": "...",
  "validationReportPath": "...",
  "pedagogyReviewPath": "...",
  "uiUxReviewPath": "...",
  "studentSimulationPath": "...",
  "reviewedBy": "admin or content lead"
}
```

#### Outputs

Primary output artifact:

```json
{
  "artifactType": "publish_decision",
  "courseId": "vedic_math",
  "chapterCode": "L4_VERTICAL_CROSSWISE",
  "decision": "approved",
  "publishStatus": "approved",
  "approvedBy": "content_lead",
  "approvedAt": "2026-03-10T18:30:00",
  "notes": "Pedagogy strong, minor UI edits can ship later"
}
```

Downstream consumer:
- publish registry
- runtime catalog
- deployment workflow

## 5. Recommended Persistence Tables

To support these I/O contracts, the platform should store:

- `rd_ai_tutor_pipeline_run`
- `rd_ai_tutor_agent_run`
- `rd_ai_tutor_agent_artifact`
- `rd_ai_tutor_agent_issue`
- `rd_ai_tutor_publish_decision`
- `rd_ai_tutor_human_approval`

### What each table should track

`rd_ai_tutor_pipeline_run`
- one row per end-to-end chapter workflow

`rd_ai_tutor_agent_run`
- one row per agent execution

`rd_ai_tutor_agent_artifact`
- one row per produced output file/json/report

`rd_ai_tutor_agent_issue`
- normalized blocking issues, warnings, and recommendations

`rd_ai_tutor_publish_decision`
- final machine + workflow decision state

`rd_ai_tutor_human_approval`
- actual human sign-off record

## 6. Cost-Control Rule

Invoke agents in this order:

1. Pedagogical Architect
2. Content Generator
3. Deterministic Validator
4. Pedagogy Reviewer
5. UI/UX Reviewer
6. Student Simulator
7. Human Approval

LLM-backed stages must run only if deterministic validation passes or passes with minor warnings.

## 7. Repo Mapping For This Project

Current repo assets already aligned to the pipeline:

- Standard contract:
  - `ai-tutor/scripts/standards/vedic_math_standard.json`
- Content artifact base:
  - `ai-tutor/tutor-api/content-template/vedic_math/chapter/*.json`
- Deterministic validator:
  - `ai-tutor/scripts/validate_content.py`
- Publish registry:
  - `ai-tutor/scripts/publish_gate.py`
- Source PDFs:
  - `docs/vedic_math/chap_*.pdf`

The missing system pieces to formalize are:
- pipeline orchestrator
- explicit agent contracts in code
- agent-run audit tables
- artifact registry
- LLM review wrappers for pedagogy, UX, and simulation

## 8. Practical Recommendation

Start with these four agents first:

1. Pedagogical Architect
2. Content Generator
3. Deterministic Validator
4. Publish Orchestrator

Then add:

5. Pedagogy Reviewer
6. Student Simulator

Then add UI/UX reviewer once the learner UI is stable enough to inspect systematically.

This keeps the system implementable without overbuilding.
