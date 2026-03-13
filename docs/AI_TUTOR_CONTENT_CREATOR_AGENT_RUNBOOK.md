# AI Tutor Content Creator Agent Runbook

## 1. Ownership

The `Content Creator` agent owns source-to-content generation for the AI Tutor platform.

It is responsible for turning chapter source material into tutor-ready instructional assets.

This agent should own:
- Lesson plans
- Teaching scripts
- Worked examples
- Question pools
- Teaching flow stages
- Chapter draft artifacts for review

This agent should not own:
- Runtime tutoring orchestration
- Student session state
- Voice transport or TTS routing
- Publishing directly to production without review

## 2. Inputs

For each chapter, the agent takes:
- `courseId`
- `chapterCode`
- `sourcePdfPath`
- `chapter metadata`
- `content standard / validation rules`

Current Vedic Math source inputs:
- PDFs: `docs/vedic_math/chap_*.pdf`
- Draft chapter JSON: `ai-tutor/tutor-api/content-template/vedic_math/chapter/*.json`
- Validation standard: `ai-tutor/scripts/standards/vedic_math_standard.json`

## 3. Outputs

The agent must produce these artifacts per chapter:
- `lesson plan`
- `chapter JSON draft`
- `workedExamples`
- `teachingFlowStages`
- `questionPool`
- `review notes`

Optional derived outputs:
- extracted PDF summary
- teacher board plan
- practice checkpoints
- remediation prompts

## 4. Workflow

The Content Creator workflow should be:

1. Read the chapter PDF.
2. Extract chapter summary, section flow, worked examples, and practice blocks.
3. Build a lesson plan.
4. Build or update the chapter JSON draft.
5. Add tutor-ready structures:
   - `workedExamples`
   - `teachingFlowStages`
   - `questionPool`
6. Run validation.
7. Hand off to reviewer/validator agent.
8. Publish only after approval.

## 5. Agent Contract

Suggested request shape:

```json
{
  "courseId": "vedic_math",
  "chapterCode": "L4_VERTICAL_CROSSWISE",
  "sourcePdfPath": "docs/vedic_math/chap_4_left_to_right.pdf",
  "mode": "draft",
  "targets": [
    "lesson_plan",
    "chapter_json",
    "question_pool"
  ]
}
```

Suggested response shape:

```json
{
  "status": "draft_ready",
  "courseId": "vedic_math",
  "chapterCode": "L4_VERTICAL_CROSSWISE",
  "artifacts": {
    "lessonPlanPath": "docs/vedic_math/lesson_plans.md",
    "chapterJsonPath": "ai-tutor/tutor-api/content-template/vedic_math/chapter/L4_VERTICAL_CROSSWISE.json"
  },
  "validation": {
    "readyForReview": false,
    "blockingIssues": [
      "workedExamples below minimum",
      "questionPool below minimum"
    ]
  }
}
```

## 6. Done Definition

The Content Creator agent should not mark a chapter complete unless all of these are true:
- `workedExamples >= 4`
- `teachingFlowStages >= 7`
- `questionPool >= 24`
- `questionPool` includes `easy`, `medium`, and `hard`
- screenplay is present and usable by the tutor
- the chapter passes schema and completeness validation

For Vedic Math specifically, use:
- `ai-tutor/scripts/validate_content.py vedic_math <chapter>`

## 7. Current Local Tools

Current local scripts that belong to this lane:
- `scripts/build_vedic_chapter_scripts.js`
- `ai-tutor/scripts/generate_vedic_lesson_plans.js`
- `ai-tutor/scripts/generate_question_pools.py`
- `ai-tutor/scripts/backfill_vedic_question_pools.js`
- `ai-tutor/scripts/validate_content.py`

Interpretation:
- `generate_vedic_lesson_plans.js` is a content-creator tool, not a tutor-runtime tool.
- `generate_question_pools.py` and `backfill_vedic_question_pools.js` are content-creator draft builders.
- `validate_content.py` is the gate before reviewer/publisher handoff.

## 8. Handoff Boundary

Recommended agent separation:
- `Content Creator`: builds content from PDFs and chapter briefs.
- `Content Reviewer`: checks pedagogy, structure, and consistency.
- `Content Validator`: runs schema, completeness, math, and AI-quality checks.
- `Tutor Runtime`: consumes only approved chapter JSON and never invents canonical lesson content.

## 9. Immediate Application To The Current Task

The current Vedic Math lesson-plan work should be treated as:
- Content Creator input: chapter PDFs in `docs/vedic_math`
- Content Creator output: lesson-plan book plus chapter draft updates
- Next gate: validator/reviewer

That means the correct product framing is:
- not "build lesson plans directly in the runtime"
- but "have the Content Creator generate lesson plans as a first-class artifact"

