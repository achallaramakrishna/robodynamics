# AI Tutor ML Phase 1

This phase adds a practical "learn from experience" loop without replacing the current rule engine.

## Goal

Use real tutor session data to improve action selection:
- `reteach_simpler`
- `hint_ladder_up`
- `steady_practice`
- `increase_challenge`

## Data Flow

1. Tutor session emits `ANSWER_SUBMITTED` events with:
- correctness
- response time
- confidence
- chapter/exercise context
- chosen tutor action

2. Offline trainer builds a policy model from historical events.

3. Runtime service loads the policy JSON and recommends the best next action by context bucket.

4. If policy has low support or no match, fallback logic/OpenAI quality refresh continues.

## Runtime Integration

Runtime file:
- [adaptive_policy.py](C:\roboworkspace\robodynamics\ai-tutor\tutor-api\app\services\adaptive_policy.py)

Hooked into:
- [quality_refresh.py](C:\roboworkspace\robodynamics\ai-tutor\tutor-api\app\services\quality_refresh.py)

If a valid policy file is present, tutor action is selected from policy first.

## Training Script

Trainer:
- [train_adaptive_policy.py](C:\roboworkspace\robodynamics\ai-tutor\tutor-api\scripts\train_adaptive_policy.py)

Input:
- JSON or JSONL event export with `ANSWER_SUBMITTED` events.

Output:
- `adaptive_policy_v1.json` (context -> best action)
- optional student mastery snapshot JSON

Example:

```bash
python3 ai-tutor/tutor-api/scripts/train_adaptive_policy.py \
  --events /opt/robodynamics/vedic_math/events/ai_tutor_events.jsonl \
  --output /opt/robodynamics/vedic_math/policies/adaptive_policy_v1.json \
  --mastery-output /opt/robodynamics/vedic_math/policies/mastery_snapshot_v1.json \
  --min-support 8
```

## Environment Variables

- `AI_TUTOR_ADAPTIVE_POLICY_ENABLED=true`
- `AI_TUTOR_ADAPTIVE_POLICY_PATH=/opt/robodynamics/vedic_math/policies/adaptive_policy_v1.json`
- `AI_TUTOR_ADAPTIVE_POLICY_MIN_OBS=5`

## SQL Schema

Phase 1 schema extension:
- [ai_tutor_ml_phase1.sql](C:\roboworkspace\robodynamics\docs\ai_tutor_ml_phase1.sql)

Adds:
- `rd_ai_tutor_training_run`
- `rd_ai_tutor_policy_model`
- `rd_ai_tutor_student_mastery`
- `vw_ai_tutor_answer_events` view

