#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

ACTIONS = (
    "reteach_simpler",
    "hint_ladder_up",
    "steady_practice",
    "increase_challenge",
)


@dataclass
class SessionState:
    error_streak: int = 0
    confidence_last: str = "unknown"
    last_response_ms: int = 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train adaptive tutor policy from AI tutor event logs.")
    parser.add_argument("--events", required=True, help="Input events file (.json or .jsonl)")
    parser.add_argument(
        "--output",
        default="/opt/robodynamics/vedic_math/policies/adaptive_policy_v1.json",
        help="Output policy JSON path",
    )
    parser.add_argument(
        "--mastery-output",
        default="",
        help="Optional output path for student mastery snapshot JSON",
    )
    parser.add_argument("--alpha", type=float, default=1.0, help="Beta posterior alpha prior")
    parser.add_argument("--beta", type=float, default=1.0, help="Beta posterior beta prior")
    parser.add_argument("--min-support", type=int, default=5, help="Minimum support for runtime recommendation")
    return parser.parse_args()


def _coerce_int(value: Any, default: int = 0) -> int:
    try:
        return int(value)
    except Exception:
        return default


def _coerce_bool(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    text = str(value or "").strip().lower()
    return text in {"1", "true", "yes", "y", "on"}


def _norm(value: Any, default: str = "unknown") -> str:
    text = str(value or "").strip().lower()
    return text or default


def _bucket_error(error_streak: int) -> str:
    if error_streak >= 3:
        return "high"
    if error_streak >= 1:
        return "medium"
    return "low"


def _bucket_speed(response_ms: int) -> str:
    if response_ms <= 0:
        return "unknown"
    if response_ms <= 10000:
        return "fast"
    if response_ms <= 22000:
        return "steady"
    return "slow"


def _context_keys(chapter: str, exercise: str, confidence: str, error_bucket: str, speed_bucket: str) -> List[str]:
    return [
        f"chapter={chapter}|exercise={exercise}|confidence={confidence}|error={error_bucket}|speed={speed_bucket}",
        f"chapter={chapter}|exercise={exercise}|error={error_bucket}|speed={speed_bucket}",
        f"chapter={chapter}|error={error_bucket}|speed={speed_bucket}",
        f"chapter={chapter}|confidence={confidence}",
        f"global|error={error_bucket}|speed={speed_bucket}",
        "global",
    ]


def _event_time(event: Dict[str, Any]) -> datetime:
    raw = event.get("createdAt") or event.get("created_at") or ""
    text = str(raw).strip()
    if not text:
        return datetime.min
    try:
        # Support Z suffix.
        text = text.replace("Z", "+00:00")
        return datetime.fromisoformat(text)
    except Exception:
        return datetime.min


def load_events(path: Path) -> List[Dict[str, Any]]:
    raw = path.read_text(encoding="utf-8", errors="ignore")
    if not raw.strip():
        return []
    if path.suffix.lower() == ".jsonl":
        out: List[Dict[str, Any]] = []
        for line in raw.splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                item = json.loads(line)
            except Exception:
                continue
            if isinstance(item, dict):
                out.append(item)
        return out

    parsed = json.loads(raw)
    if isinstance(parsed, dict):
        events = parsed.get("events") or parsed.get("data") or []
        if isinstance(events, list):
            return [e for e in events if isinstance(e, dict)]
        return []
    if isinstance(parsed, list):
        return [e for e in parsed if isinstance(e, dict)]
    return []


def extract_meta(event: Dict[str, Any]) -> Dict[str, Any]:
    meta = event.get("meta")
    if isinstance(meta, dict):
        return meta
    payload = event.get("payload_json")
    if isinstance(payload, dict):
        return payload
    if isinstance(payload, str):
        try:
            parsed = json.loads(payload)
            if isinstance(parsed, dict):
                return parsed
        except Exception:
            pass
    return {}


def iter_answer_samples(events: Iterable[Dict[str, Any]]) -> Iterable[Tuple[Dict[str, Any], bool, str]]:
    session_state: Dict[str, SessionState] = {}

    for event in sorted(events, key=_event_time):
        event_type = _norm(event.get("eventType") or event.get("event_type"), "")
        if event_type != "answer_submitted":
            continue
        meta = extract_meta(event)
        action = _norm(meta.get("tutorAction") or meta.get("tutor_action"), "")
        if action not in ACTIONS:
            continue

        session_id = str(event.get("sessionId") or event.get("session_id") or "").strip()
        if not session_id:
            continue

        state = session_state.setdefault(session_id, SessionState())
        correct = _coerce_bool(event.get("isCorrect") if "isCorrect" in event else event.get("is_correct"))
        response_ms = _coerce_int(meta.get("responseTimeMs") if "responseTimeMs" in meta else meta.get("response_time_ms"), state.last_response_ms)
        confidence = _norm(meta.get("confidence"), state.confidence_last)

        if correct:
            state.error_streak = 0
        else:
            state.error_streak += 1
        state.last_response_ms = max(0, response_ms)
        state.confidence_last = confidence

        chapter = _norm(meta.get("chapterCode") or event.get("lessonCode") or event.get("lesson_code"))
        exercise = _norm(meta.get("exerciseGroup"), "unknown")
        error_bucket = _bucket_error(state.error_streak)
        speed_bucket = _bucket_speed(state.last_response_ms)

        sample = {
            "chapter": chapter,
            "exercise": exercise,
            "confidence": confidence,
            "error_bucket": error_bucket,
            "speed_bucket": speed_bucket,
            "student_id": _coerce_int(event.get("childId") if event.get("childId") is not None else event.get("userId"), 0),
        }
        yield sample, correct, action


def train_policy(samples: Iterable[Tuple[Dict[str, Any], bool, str]], alpha: float, beta: float) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    stats: Dict[str, Dict[str, Dict[str, int]]] = defaultdict(
        lambda: {a: {"success": 0, "fail": 0} for a in ACTIONS}
    )
    mastery: Dict[str, Dict[str, float]] = {}
    sample_count = 0

    for sample, correct, action in samples:
        sample_count += 1
        keys = _context_keys(
            chapter=sample["chapter"],
            exercise=sample["exercise"],
            confidence=sample["confidence"],
            error_bucket=sample["error_bucket"],
            speed_bucket=sample["speed_bucket"],
        )
        for key in keys:
            if correct:
                stats[key][action]["success"] += 1
            else:
                stats[key][action]["fail"] += 1

        student_id = int(sample.get("student_id", 0))
        if student_id > 0:
            mastery_key = f"student={student_id}|chapter={sample['chapter']}|exercise={sample['exercise']}"
            previous = mastery.get(mastery_key, {}).get("mastery", 0.5)
            reward = 1.0 if correct else 0.0
            updated = 0.65 * previous + 0.35 * reward
            mastery[mastery_key] = {
                "mastery": round(updated, 4),
                "attempts": int(mastery.get(mastery_key, {}).get("attempts", 0)) + 1,
            }

    contexts: Dict[str, Any] = {}
    for key, action_map in stats.items():
        per_action: Dict[str, Any] = {}
        best_action = "steady_practice"
        best_mean = -1.0
        support = 0

        for action in ACTIONS:
            success = int(action_map[action]["success"])
            fail = int(action_map[action]["fail"])
            total = success + fail
            support += total
            posterior = (success + alpha) / (total + alpha + beta) if (total + alpha + beta) > 0 else 0.5
            per_action[action] = {
                "success": success,
                "fail": fail,
                "support": total,
                "posteriorMean": round(posterior, 6),
            }
            if posterior > best_mean:
                best_mean = posterior
                best_action = action

        contexts[key] = {
            "support": support,
            "bestAction": best_action,
            "bestPosteriorMean": round(best_mean, 6),
            "actions": per_action,
        }

    policy = {
        "version": "adaptive_policy_v1",
        "generatedAt": datetime.utcnow().isoformat() + "Z",
        "actions": list(ACTIONS),
        "alpha": alpha,
        "beta": beta,
        "trainingSamples": sample_count,
        "contexts": contexts,
    }
    mastery_payload = {
        "version": "student_mastery_snapshot_v1",
        "generatedAt": datetime.utcnow().isoformat() + "Z",
        "students": mastery,
    }
    return policy, mastery_payload


def main() -> None:
    args = parse_args()
    input_path = Path(args.events).resolve()
    output_path = Path(args.output).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    events = load_events(input_path)
    policy, mastery = train_policy(
        iter_answer_samples(events),
        alpha=float(args.alpha),
        beta=float(args.beta),
    )

    policy["minSupport"] = int(max(1, args.min_support))
    output_path.write_text(json.dumps(policy, indent=2), encoding="utf-8")
    print(f"[done] policy={output_path} contexts={len(policy.get('contexts', {}))} samples={policy.get('trainingSamples', 0)}")

    if args.mastery_output:
        mastery_path = Path(args.mastery_output).resolve()
        mastery_path.parent.mkdir(parents=True, exist_ok=True)
        mastery_path.write_text(json.dumps(mastery, indent=2), encoding="utf-8")
        print(f"[done] mastery={mastery_path} students={len(mastery.get('students', {}))}")


if __name__ == "__main__":
    main()

