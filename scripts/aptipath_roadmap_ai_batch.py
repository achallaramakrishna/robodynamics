#!/usr/bin/env python3
"""
Batch-generate AptiPath career roadmap rows using ranked career usage frequency.

Key behavior:
- Ranks careers by frequency in recommendation snapshots (`topCareerMatches[0..4]`).
- Calls AI endpoint for each selected career and tier (BASIC / PRO).
- Enforces required roadmap section coverage and fills gaps with rule-based fallback rows.
- Upserts into `rd_ci_career_roadmap` with metadata source tagging.

Usage examples:
  python scripts/aptipath_roadmap_ai_batch.py --top-n 100 --tiers BASIC,PRO
  python scripts/aptipath_roadmap_ai_batch.py --career-codes AP3_CAR_0001,AP3_CAR_0002 --dry-run
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any
from urllib import parse, request


SECTION_ORDER = [
    "OVERVIEW",
    "WHAT_TO_STUDY",
    "SKILLS",
    "PROJECTS",
    "WHERE_TO_STUDY",
    "ACTION_90",
    "MILESTONE",
    "UPGRADE",
]

ALLOWED_SECTIONS = set(SECTION_ORDER)
DEFAULT_MODULE_CODE = "APTIPATH"
DEFAULT_ASSESSMENT_VERSION = "v3"


@dataclass
class CareerMeta:
    career_code: str
    career_name: str
    cluster_name: str
    required_subjects_csv: str
    entrance_exams_csv: str
    pathway_hint: str
    freq: int


@dataclass
class Config:
    mysql_bin: str
    mysql_host: str
    mysql_port: int
    mysql_user: str
    mysql_password: str
    mysql_db: str
    ai_url: str
    ai_mode: str
    request_timeout: int
    openai_api_key: str
    openai_model: str
    openai_api_url: str
    openai_max_tokens: int
    app_config_path: str
    module_code: str
    assessment_version: str
    metadata_source: str
    top_n: int
    min_frequency: int
    tiers: list[str]
    career_codes: list[str]
    exclude_metadata_like: list[str]
    skip_complete: bool
    dry_run: bool
    max_errors: int
    verbose: bool


class MysqlCli:
    def __init__(self, cfg: Config) -> None:
        self.cfg = cfg

    def _cmd(self, sql: str) -> list[str]:
        cmd = [
            self.cfg.mysql_bin,
            "-N",
            "-B",
            "-h",
            self.cfg.mysql_host,
            "-P",
            str(self.cfg.mysql_port),
            "-u",
            self.cfg.mysql_user,
            "-D",
            self.cfg.mysql_db,
            "-e",
            sql,
        ]
        if self.cfg.mysql_password:
            cmd.insert(-2, f"-p{self.cfg.mysql_password}")
        return cmd

    def query(self, sql: str) -> list[list[str]]:
        proc = subprocess.run(self._cmd(sql), text=True, capture_output=True)
        if proc.returncode != 0:
            stderr = (proc.stderr or "").strip()
            stdout = (proc.stdout or "").strip()
            detail = stderr or stdout or f"mysql exited with code {proc.returncode}"
            raise RuntimeError(detail)
        out = proc.stdout or ""
        rows = []
        for line in out.splitlines():
            if not line.strip():
                continue
            rows.append(line.split("\t"))
        return rows

    def exec(self, sql: str) -> None:
        proc = subprocess.run(self._cmd(sql), text=True, capture_output=True)
        if proc.returncode != 0:
            stderr = (proc.stderr or "").strip()
            stdout = (proc.stdout or "").strip()
            detail = stderr or stdout or f"mysql exited with code {proc.returncode}"
            raise RuntimeError(detail)


def log(msg: str) -> None:
    print(msg, flush=True)


def compact(value: Any) -> str:
    return " ".join(str(value or "").split())


def esc_sql(value: Any) -> str:
    text = str(value or "")
    return text.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ").replace("\r", " ").strip()


def parse_json_payload(text: str) -> dict[str, Any]:
    raw = (text or "").strip()
    if not raw or raw.lower().startswith("error:"):
        return {}
    try:
        parsed = json.loads(raw)
        return parsed if isinstance(parsed, dict) else {}
    except Exception:
        pass

    match = re.search(r"\{[\s\S]*\}", raw)
    if not match:
        return {}
    try:
        parsed = json.loads(match.group(0))
        return parsed if isinstance(parsed, dict) else {}
    except Exception:
        return {}


def normalize_section(section_type: Any) -> str:
    text = compact(section_type).upper().replace("-", "_").replace(" ", "_")
    while "__" in text:
        text = text.replace("__", "_")
    aliases = {
        "STUDY": "WHAT_TO_STUDY",
        "EXAMS": "WHERE_TO_STUDY",
        "PHASE": "MILESTONE",
        "PLAN_90": "ACTION_90",
        "NINETY_DAY_PLAN": "ACTION_90",
        "LONG_TERM_MILESTONE": "MILESTONE",
        "LONG_TERM_MILESTONES": "MILESTONE",
        "RELEVANCE": "OVERVIEW",
        "SALARY": "OVERVIEW",
        "DATABASE_SCALE": "MILESTONE",
    }
    return aliases.get(text, text)


def required_counts(tier: str) -> dict[str, int]:
    tier_u = tier.upper()
    base = {key: 1 for key in SECTION_ORDER}
    base["ACTION_90"] = 3
    base["MILESTONE"] = 3 if tier_u == "PRO" else 2
    base["WHAT_TO_STUDY"] = 3 if tier_u == "PRO" else 1
    return base


def fallback_rows(meta: CareerMeta, tier: str, pro_price: str = "Rs 2999") -> list[dict[str, Any]]:
    name = meta.career_name or meta.career_code
    cluster = meta.cluster_name or "emerging industries"
    subjects = meta.required_subjects_csv or "Math, Science, Computer fundamentals"
    exams = meta.entrance_exams_csv or "JEE / CUET / institution-specific entrances"
    hint = meta.pathway_hint or "Build consistent execution through projects and mentor feedback."
    rows: list[dict[str, Any]] = []

    def add(sec: str, order: int, title: str, detail: str) -> None:
        rows.append(
            {
                "sectionType": sec,
                "itemOrder": int(order),
                "title": compact(title)[:120],
                "detailText": compact(detail)[:500],
            }
        )

    add("OVERVIEW", 1, "Career Overview", f"{name} is a strong pathway in {cluster} for India 2026-2036.")
    if tier.upper() == "PRO":
        add("WHAT_TO_STUDY", 1, "Academic Plan", f"Build grade-wise depth in {subjects}.")
        add("WHAT_TO_STUDY", 2, "Exam Focus", f"Align preparation to {exams}.")
        add("WHAT_TO_STUDY", 3, "Higher-Ed Path", f"Map degree and specialization routes for {name}.")
    else:
        add("WHAT_TO_STUDY", 1, "Study Focus", f"Prioritize {subjects} with weekly review.")

    add("SKILLS", 1, "Skills", hint)
    add("PROJECTS", 1, "Projects", f"Complete portfolio projects aligned to {name}.")
    add("WHERE_TO_STUDY", 1, "Where to Study", f"Primary routes: {exams}.")
    add("ACTION_90", 1, "Days 1-30", "Baseline, schedule, and weak-area closure.")
    add("ACTION_90", 2, "Days 31-60", "Project milestone plus mock analysis.")
    add("ACTION_90", 3, "Days 61-90", "Review outcomes and lock next quarter plan.")
    add("MILESTONE", 1, "By 2030", f"Build strong readiness for {name} pathways.")
    add("MILESTONE", 2, "By 2032", "Convert readiness to internships/projects.")
    if tier.upper() == "PRO":
        add("MILESTONE", 3, "By 2036", "Reach specialization and role maturity.")
    add("UPGRADE", 1, "Pro Depth", f"Choose Pro Plan ({pro_price}) for deeper strategy in {name}.")
    return rows


def enforce_rows(ai_rows: list[Any], meta: CareerMeta, tier: str) -> list[dict[str, Any]]:
    by_section: dict[str, list[dict[str, Any]]] = {}
    for raw in ai_rows or []:
        if not isinstance(raw, dict):
            continue
        sec = normalize_section(raw.get("sectionType"))
        if sec not in ALLOWED_SECTIONS:
            continue
        title = compact(raw.get("title") or sec.replace("_", " ").title())[:120]
        detail = compact(raw.get("detailText") or raw.get("detail"))[:500]
        if not detail:
            continue
        by_section.setdefault(sec, []).append({"sectionType": sec, "title": title, "detailText": detail})

    required = required_counts(tier)
    fallback = fallback_rows(meta, tier)
    fallback_by_sec: dict[str, list[dict[str, Any]]] = {}
    for row in fallback:
        fallback_by_sec.setdefault(row["sectionType"], []).append(row)

    for sec in SECTION_ORDER:
        needed = required[sec]
        while len(by_section.get(sec, [])) < needed:
            candidates = fallback_by_sec.get(sec, [])
            if not candidates:
                break
            idx = min(len(by_section.get(sec, [])), len(candidates) - 1)
            c = candidates[idx]
            by_section.setdefault(sec, []).append(
                {
                    "sectionType": sec,
                    "title": c["title"],
                    "detailText": c["detailText"],
                }
            )

    final_rows: list[dict[str, Any]] = []
    for sec in SECTION_ORDER:
        for i, row in enumerate(by_section.get(sec, []), start=1):
            final_rows.append(
                {
                    "sectionType": sec,
                    "itemOrder": i,
                    "title": row["title"][:120],
                    "detailText": row["detailText"][:500],
                }
            )
    return final_rows


def build_prompt(meta: CareerMeta, tier: str) -> str:
    tier_u = tier.upper()
    if tier_u == "PRO":
        req = (
            "- Include sections: OVERVIEW(1), WHAT_TO_STUDY(>=3), SKILLS(>=1), PROJECTS(>=1), "
            "WHERE_TO_STUDY(>=1), ACTION_90(=3), MILESTONE(>=3), UPGRADE(>=1)."
        )
    else:
        req = (
            "- Include sections: OVERVIEW(1), WHAT_TO_STUDY(>=1), SKILLS(>=1), PROJECTS(>=1), "
            "WHERE_TO_STUDY(>=1), ACTION_90(=3), MILESTONE(>=2), UPGRADE(>=1)."
        )

    return (
        "Return strict JSON only: "
        '{"rows":[{"sectionType":"...","itemOrder":1,"title":"...","detailText":"..."}]}\n'
        "No markdown and no extra prose.\n"
        "India context for 2026-2036.\n"
        f"{req}\n"
        "Allowed sectionType: OVERVIEW, WHAT_TO_STUDY, SKILLS, PROJECTS, WHERE_TO_STUDY, ACTION_90, MILESTONE, UPGRADE.\n"
        "Title <= 70 chars. detailText <= 220 chars.\n"
        f"careerCode={meta.career_code}\n"
        f"careerName={meta.career_name}\n"
        f"cluster={meta.cluster_name}\n"
        f"planTier={tier_u}\n"
        "gradeStage=ANY\n"
        f"requiredSubjects={meta.required_subjects_csv}\n"
        f"entranceExams={meta.entrance_exams_csv}\n"
        f"pathwayHint={meta.pathway_hint}"
    )


def ask_ai(prompt: str, cfg: Config) -> str:
    if cfg.ai_mode == "openai":
        return ask_openai_direct(prompt, cfg)
    if cfg.ai_mode == "auto" and cfg.openai_api_key:
        return ask_openai_direct(prompt, cfg)
    return ask_proxy(prompt, cfg)


def ask_proxy(prompt: str, cfg: Config) -> str:
    body = parse.urlencode({"prompt": prompt}).encode("utf-8")
    req = request.Request(cfg.ai_url, data=body, method="POST")
    with request.urlopen(req, timeout=cfg.request_timeout) as resp:  # nosec B310
        return resp.read().decode("utf-8", errors="replace")


def ask_openai_direct(prompt: str, cfg: Config) -> str:
    if not cfg.openai_api_key:
        raise RuntimeError("OpenAI API key is not configured.")
    payload = {
        "model": cfg.openai_model or "gpt-4o-mini",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max(120, min(int(cfg.openai_max_tokens), 3200)),
    }
    body = json.dumps(payload).encode("utf-8")
    req = request.Request(cfg.openai_api_url, data=body, method="POST")
    req.add_header("Authorization", f"Bearer {cfg.openai_api_key}")
    req.add_header("Content-Type", "application/json")
    with request.urlopen(req, timeout=cfg.request_timeout) as resp:  # nosec B310
        text = resp.read().decode("utf-8", errors="replace")
    try:
        parsed = json.loads(text)
    except Exception as ex:
        raise RuntimeError(f"Invalid OpenAI JSON response: {ex}") from ex

    # Chat Completions response format
    if isinstance(parsed, dict):
        choices = parsed.get("choices")
        if isinstance(choices, list) and choices:
            message = choices[0].get("message") if isinstance(choices[0], dict) else None
            content = message.get("content") if isinstance(message, dict) else None
            if isinstance(content, str) and content.strip():
                return content
        # Responses API-style fallback
        output = parsed.get("output")
        if isinstance(output, list):
            for item in output:
                if not isinstance(item, dict):
                    continue
                content = item.get("content")
                if not isinstance(content, list):
                    continue
                for part in content:
                    if isinstance(part, dict):
                        txt = part.get("text")
                        if isinstance(txt, str) and txt.strip():
                            return txt
        output_text = parsed.get("output_text")
        if isinstance(output_text, str) and output_text.strip():
            return output_text

    raise RuntimeError("No assistant content returned by OpenAI.")


def get_candidates(db: MysqlCli, cfg: Config) -> list[CareerMeta]:
    if cfg.career_codes:
        in_codes = ",".join(f"'{esc_sql(code.upper())}'" for code in cfg.career_codes)
        sql = f"""
SELECT c.career_code,
       IFNULL(c.career_name,''),
       IFNULL(c.cluster_name,''),
       IFNULL(c.required_subjects_csv,''),
       IFNULL(c.entrance_exams_csv,''),
       IFNULL(c.pathway_hint,''),
       0
FROM rd_ci_career_catalog c
WHERE c.module_code = '{esc_sql(cfg.module_code)}'
  AND c.assessment_version = '{esc_sql(cfg.assessment_version)}'
  AND c.status = 'ACTIVE'
  AND c.career_code IN ({in_codes})
ORDER BY c.sort_order ASC, c.career_code ASC
"""
        rows = db.query(sql)
        return [to_career_meta(row) for row in rows if len(row) >= 7]

    exclude_cte = ""
    exclude_join = ""
    exclude_where = ""
    if cfg.exclude_metadata_like:
        like_expr = " OR ".join(
            f"metadata_json LIKE '%{esc_sql(pattern)}%'" for pattern in cfg.exclude_metadata_like if pattern
        )
        if like_expr:
            exclude_cte = f""",
excluded AS (
  SELECT DISTINCT career_code
  FROM rd_ci_career_roadmap
  WHERE module_code = '{esc_sql(cfg.module_code)}'
    AND assessment_version = '{esc_sql(cfg.assessment_version)}'
    AND status = 'ACTIVE'
    AND ({like_expr})
)
"""
            exclude_join = "LEFT JOIN excluded e ON e.career_code = c.career_code"
            exclude_where = "AND e.career_code IS NULL"

    limit_sql = ""
    if cfg.top_n > 0:
        limit_sql = f"LIMIT {int(cfg.top_n)}"

    sql = f"""
WITH freq AS (
  SELECT career_code, COUNT(*) AS freq
  FROM (
    SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[0].careerCode')) AS career_code
      FROM rd_ci_recommendation_snapshot rs
    UNION ALL
    SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[1].careerCode'))
      FROM rd_ci_recommendation_snapshot rs
    UNION ALL
    SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[2].careerCode'))
      FROM rd_ci_recommendation_snapshot rs
    UNION ALL
    SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[3].careerCode'))
      FROM rd_ci_recommendation_snapshot rs
    UNION ALL
    SELECT JSON_UNQUOTE(JSON_EXTRACT(rs.career_clusters_json,'$.topCareerMatches[4].careerCode'))
      FROM rd_ci_recommendation_snapshot rs
  ) x
  WHERE career_code IS NOT NULL AND career_code <> ''
  GROUP BY career_code
){exclude_cte}
SELECT c.career_code,
       IFNULL(c.career_name,''),
       IFNULL(c.cluster_name,''),
       IFNULL(c.required_subjects_csv,''),
       IFNULL(c.entrance_exams_csv,''),
       IFNULL(c.pathway_hint,''),
       IFNULL(f.freq,0)
FROM rd_ci_career_catalog c
LEFT JOIN freq f ON f.career_code = c.career_code
{exclude_join}
WHERE c.module_code = '{esc_sql(cfg.module_code)}'
  AND c.assessment_version = '{esc_sql(cfg.assessment_version)}'
  AND c.status = 'ACTIVE'
  AND IFNULL(f.freq,0) >= {int(cfg.min_frequency)}
  {exclude_where}
ORDER BY IFNULL(f.freq,0) DESC, c.sort_order ASC, c.career_code ASC
{limit_sql}
"""
    rows = db.query(sql)
    return [to_career_meta(row) for row in rows if len(row) >= 7]


def to_career_meta(row: list[str]) -> CareerMeta:
    return CareerMeta(
        career_code=(row[0] or "").strip().upper(),
        career_name=compact(row[1]),
        cluster_name=compact(row[2]),
        required_subjects_csv=compact(row[3]),
        entrance_exams_csv=compact(row[4]),
        pathway_hint=compact(row[5]),
        freq=int((row[6] or "0").strip() or "0"),
    )


def fetch_section_counts(db: MysqlCli, cfg: Config, career_code: str, tier: str) -> dict[str, int]:
    sql = f"""
SELECT section_type, COUNT(*)
FROM rd_ci_career_roadmap
WHERE module_code = '{esc_sql(cfg.module_code)}'
  AND assessment_version = '{esc_sql(cfg.assessment_version)}'
  AND career_code = '{esc_sql(career_code)}'
  AND plan_tier = '{esc_sql(tier.upper())}'
  AND grade_stage = 'ANY'
  AND status = 'ACTIVE'
GROUP BY section_type
"""
    counts: dict[str, int] = {}
    for row in db.query(sql):
        if len(row) < 2:
            continue
        sec = normalize_section(row[0])
        if sec not in ALLOWED_SECTIONS:
            continue
        counts[sec] = counts.get(sec, 0) + int((row[1] or "0").strip() or "0")
    return counts


def is_complete(db: MysqlCli, cfg: Config, career_code: str, tier: str) -> bool:
    have = fetch_section_counts(db, cfg, career_code, tier)
    need = required_counts(tier)
    for sec, min_count in need.items():
        if have.get(sec, 0) < min_count:
            return False
    return True


def upsert_rows(db: MysqlCli, cfg: Config, meta: CareerMeta, tier: str, rows: list[dict[str, Any]]) -> None:
    if not rows:
        return

    code = meta.career_code
    tier_u = tier.upper()
    section_in = ",".join(f"'{esc_sql(row['sectionType'])}'" for row in rows)

    delete_sql = f"""
DELETE FROM rd_ci_career_roadmap
WHERE module_code = '{esc_sql(cfg.module_code)}'
  AND assessment_version = '{esc_sql(cfg.assessment_version)}'
  AND career_code = '{esc_sql(code)}'
  AND plan_tier = '{esc_sql(tier_u)}'
  AND grade_stage = 'ANY'
  AND section_type IN ({section_in})
"""
    db.exec(delete_sql)

    generated_at_utc = datetime.now(UTC).isoformat()
    values = []
    for row in rows:
        metadata_json = json.dumps(
            {
                "source": cfg.metadata_source,
                "generatedAtUtc": generated_at_utc,
                "tier": tier_u,
                "freqRankSignal": meta.freq,
            },
            separators=(",", ":"),
        )
        values.append(
            "('{module}','{version}','{code}','{tier}','ANY','{section}',{order},'{title}','{detail}','{meta}','ACTIVE',NOW(),NOW())".format(
                module=esc_sql(cfg.module_code),
                version=esc_sql(cfg.assessment_version),
                code=esc_sql(code),
                tier=esc_sql(tier_u),
                section=esc_sql(row["sectionType"]),
                order=int(row["itemOrder"]),
                title=esc_sql(row["title"]),
                detail=esc_sql(row["detailText"]),
                meta=esc_sql(metadata_json),
            )
        )

    insert_sql = """
INSERT INTO rd_ci_career_roadmap
  (module_code,assessment_version,career_code,plan_tier,grade_stage,section_type,item_order,title,detail_text,metadata_json,status,created_at,updated_at)
VALUES
{values}
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  detail_text = VALUES(detail_text),
  metadata_json = VALUES(metadata_json),
  status = 'ACTIVE',
  updated_at = NOW()
""".format(values=",\n".join(values))
    db.exec(insert_sql)


def parse_tiers(raw: str) -> list[str]:
    tiers = [part.strip().upper() for part in (raw or "").split(",") if part.strip()]
    if not tiers:
        raise ValueError("No tiers provided.")
    for tier in tiers:
        if tier not in {"BASIC", "PRO"}:
            raise ValueError(f"Unsupported tier: {tier}")
    return tiers


def parse_csv_codes(raw: str) -> list[str]:
    return [item.strip().upper() for item in (raw or "").split(",") if item.strip()]


def load_properties_file(path: str) -> dict[str, str]:
    props: dict[str, str] = {}
    if not path:
        return props
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as handle:
            for raw in handle:
                line = raw.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                props[key.strip()] = value.strip()
    except OSError:
        return props
    return props


def parse_args() -> Config:
    parser = argparse.ArgumentParser(
        description="Batch enrich AptiPath career roadmaps by ranking order using AI + fallback coverage."
    )
    parser.add_argument("--mysql-bin", default="mysql")
    parser.add_argument("--mysql-host", default="127.0.0.1")
    parser.add_argument("--mysql-port", type=int, default=3306)
    parser.add_argument("--mysql-user", default="root")
    parser.add_argument("--mysql-password", default="")
    parser.add_argument("--mysql-db", default="robodynamics_db")
    parser.add_argument("--ai-url", default="http://127.0.0.1:8080/api/ai/ask")
    parser.add_argument("--ai-mode", default="auto", choices=["auto", "proxy", "openai"])
    parser.add_argument("--request-timeout", type=int, default=90)
    parser.add_argument("--openai-api-key", default=os.environ.get("OPENAI_API_KEY", ""))
    parser.add_argument("--openai-model", default="gpt-4o-mini")
    parser.add_argument("--openai-api-url", default="https://api.openai.com/v1/chat/completions")
    parser.add_argument("--openai-max-tokens", type=int, default=1800)
    parser.add_argument("--app-config-path", default="src/main/resources/app-config.properties")
    parser.add_argument("--module-code", default=DEFAULT_MODULE_CODE)
    parser.add_argument("--assessment-version", default=DEFAULT_ASSESSMENT_VERSION)
    parser.add_argument("--metadata-source", default="OPENAI_BATCH_RANKED_V1")
    parser.add_argument("--top-n", type=int, default=100)
    parser.add_argument("--min-frequency", type=int, default=0)
    parser.add_argument("--tiers", default="BASIC,PRO")
    parser.add_argument("--career-codes", default="")
    parser.add_argument("--exclude-metadata-like", default="")
    parser.add_argument("--skip-complete", action="store_true", default=True)
    parser.add_argument("--include-complete", action="store_true", default=False)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--max-errors", type=int, default=25)
    parser.add_argument("--verbose", action="store_true")

    ns = parser.parse_args()

    tiers = parse_tiers(ns.tiers)
    career_codes = parse_csv_codes(ns.career_codes)
    exclude_like = [s.strip() for s in (ns.exclude_metadata_like or "").split(",") if s.strip()]
    skip_complete = ns.skip_complete and not ns.include_complete

    props = load_properties_file(ns.app_config_path)
    resolved_api_key = (ns.openai_api_key or "").strip()
    if not resolved_api_key:
        resolved_api_key = props.get("openai.api.key", "").strip()

    resolved_model = (ns.openai_model or "").strip()
    if not resolved_model:
        resolved_model = props.get("openai.chat.model", "").strip() or "gpt-4o-mini"

    return Config(
        mysql_bin=ns.mysql_bin,
        mysql_host=ns.mysql_host,
        mysql_port=ns.mysql_port,
        mysql_user=ns.mysql_user,
        mysql_password=ns.mysql_password,
        mysql_db=ns.mysql_db,
        ai_url=ns.ai_url,
        ai_mode=ns.ai_mode,
        request_timeout=ns.request_timeout,
        openai_api_key=resolved_api_key,
        openai_model=resolved_model,
        openai_api_url=(ns.openai_api_url or "").strip() or "https://api.openai.com/v1/chat/completions",
        openai_max_tokens=max(120, ns.openai_max_tokens),
        app_config_path=ns.app_config_path,
        module_code=ns.module_code.strip().upper() or DEFAULT_MODULE_CODE,
        assessment_version=ns.assessment_version.strip() or DEFAULT_ASSESSMENT_VERSION,
        metadata_source=ns.metadata_source.strip() or "OPENAI_BATCH_RANKED_V1",
        top_n=max(0, ns.top_n),
        min_frequency=max(0, ns.min_frequency),
        tiers=tiers,
        career_codes=career_codes,
        exclude_metadata_like=exclude_like,
        skip_complete=skip_complete,
        dry_run=bool(ns.dry_run),
        max_errors=max(1, ns.max_errors),
        verbose=bool(ns.verbose),
    )


def resolve_mysql_bin(configured: str) -> str:
    candidate = (configured or "").strip().strip('"')
    if candidate:
        resolved = shutil.which(candidate)
        if resolved:
            return resolved
        if candidate.lower().endswith(".exe") and shutil.which(candidate):
            return candidate
        if candidate and shutil.which(candidate) is None:
            # Candidate might already be an absolute path.
            if shutil.which(candidate) is not None:
                return candidate
            # Fall through to known Windows paths only when default-like value is used.
            if candidate.lower() not in {"mysql", "mysql.exe"}:
                return candidate

    found = shutil.which("mysql") or shutil.which("mysql.exe")
    if found:
        return found

    windows_candidates = [
        r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
        r"C:\Program Files\MySQL\MySQL Workbench 8.0\mysql.exe",
    ]
    for path in windows_candidates:
        if shutil.which(path):
            return path
        try:
            with open(path, "rb"):
                return path
        except OSError:
            continue
    return configured


def main() -> int:
    cfg = parse_args()
    cfg.mysql_bin = resolve_mysql_bin(cfg.mysql_bin)
    db = MysqlCli(cfg)

    if cfg.ai_mode in {"auto", "openai"} and cfg.openai_api_key:
        log(f"AI_MODE={cfg.ai_mode} MODEL={cfg.openai_model} (direct OpenAI)")
    else:
        log(f"AI_MODE={cfg.ai_mode} URL={cfg.ai_url} (proxy)")

    try:
        candidates = get_candidates(db, cfg)
    except Exception as ex:
        log(f"ERROR selecting candidates: {ex}")
        return 2

    if not candidates:
        log("No candidate careers found.")
        return 0

    log(f"CANDIDATES={len(candidates)} TIERS={','.join(cfg.tiers)} DRY_RUN={cfg.dry_run}")
    log("TOP_CODES=" + ",".join(c.career_code for c in candidates[: min(len(candidates), 30)]))

    ok = 0
    skipped = 0
    failed = 0

    for idx, meta in enumerate(candidates, start=1):
        for tier in cfg.tiers:
            try:
                if cfg.skip_complete and is_complete(db, cfg, meta.career_code, tier):
                    skipped += 1
                    log(f"SKIP {idx}/{len(candidates)} {meta.career_code} {tier} reason=already_complete")
                    continue

                prompt = build_prompt(meta, tier)
                ai_text = ask_ai(prompt, cfg)
                payload = parse_json_payload(ai_text)
                rows = enforce_rows(payload.get("rows", []), meta, tier)

                if cfg.dry_run:
                    ok += 1
                    if cfg.verbose:
                        counts: dict[str, int] = {}
                        for row in rows:
                            counts[row["sectionType"]] = counts.get(row["sectionType"], 0) + 1
                        log(
                            f"DRY_OK {idx}/{len(candidates)} {meta.career_code} {tier} rows={len(rows)} sections={json.dumps(counts, separators=(',', ':'))}"
                        )
                    else:
                        log(f"DRY_OK {idx}/{len(candidates)} {meta.career_code} {tier} rows={len(rows)}")
                    continue

                upsert_rows(db, cfg, meta, tier, rows)
                ok += 1
                log(f"OK {idx}/{len(candidates)} {meta.career_code} {tier} rows={len(rows)} freq={meta.freq}")
            except Exception as ex:
                failed += 1
                log(f"FAIL {idx}/{len(candidates)} {meta.career_code} {tier} err={str(ex)[:240]}")
                if failed >= cfg.max_errors:
                    log(f"ABORT reached max errors ({cfg.max_errors})")
                    log(f"SUMMARY ok={ok} skipped={skipped} failed={failed}")
                    return 2

    log(f"SUMMARY ok={ok} skipped={skipped} failed={failed}")
    return 0 if failed == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
