import base64
import json
import tarfile
from pathlib import Path
from typing import List, Dict


REUSABLE_INDEX = Path("artifacts/examprep_qbank_2026-03-04/reusable_packs/manifest_index.json")
REUSABLE_ROOT = Path("artifacts/examprep_qbank_2026-03-04/reusable_packs")
OUT_SQL = REUSABLE_ROOT / "import_validation.sql"
OUT_BUNDLE = REUSABLE_ROOT / "reusable_packs_bundle.tgz"
OUT_REMOTE_SCRIPT = Path("tmp_remote_import_reusable_packs.sh")


def sql_escape(text: str) -> str:
    return text.replace("\\", "\\\\").replace("'", "''")


def build_sql(packs: List[Dict]) -> None:
    lines: List[str] = []
    lines.append("-- Reusable Packs Import Validation SQL")
    lines.append("-- Generated on 2026-03-04")
    lines.append("")
    lines.append("DROP TEMPORARY TABLE IF EXISTS tmp_reusable_pack_targets;")
    lines.append(
        "CREATE TEMPORARY TABLE tmp_reusable_pack_targets ("
        "course_id INT NOT NULL, "
        "course_session_id INT NOT NULL, "
        "course_name VARCHAR(255), "
        "session_title VARCHAR(255), "
        "expected_questions INT NOT NULL, "
        "PRIMARY KEY (course_id, course_session_id));"
    )
    lines.append("")
    lines.append("INSERT INTO tmp_reusable_pack_targets (course_id, course_session_id, course_name, session_title, expected_questions) VALUES")
    value_rows = []
    for p in packs:
        value_rows.append(
            f"({int(p['course_id'])}, {int(p['course_session_id'])}, "
            f"'{sql_escape(str(p.get('course_name', '')))}', "
            f"'{sql_escape(str(p.get('session_title', '')))}', "
            f"{int(p.get('question_count', 0))})"
        )
    lines.append(",\n".join(value_rows) + ";")
    lines.append("")
    lines.append("-- Current question counts for target sessions")
    lines.append(
        "SELECT t.course_id, t.course_name, t.course_session_id, t.session_title, "
        "t.expected_questions, COALESCE(COUNT(q.question_id), 0) AS current_questions "
        "FROM tmp_reusable_pack_targets t "
        "LEFT JOIN rd_quiz_questions q ON q.course_session_id = t.course_session_id "
        "GROUP BY t.course_id, t.course_name, t.course_session_id, t.session_title, t.expected_questions "
        "ORDER BY t.course_id, t.course_session_id;"
    )
    lines.append("")
    lines.append("-- Image coverage in imported questions")
    lines.append(
        "SELECT t.course_id, t.course_session_id, "
        "SUM(CASE WHEN q.question_image IS NOT NULL AND TRIM(q.question_image) <> '' THEN 1 ELSE 0 END) AS with_image, "
        "COUNT(q.question_id) AS total_questions "
        "FROM tmp_reusable_pack_targets t "
        "LEFT JOIN rd_quiz_questions q ON q.course_session_id = t.course_session_id "
        "GROUP BY t.course_id, t.course_session_id "
        "ORDER BY t.course_id, t.course_session_id;"
    )
    lines.append("")
    lines.append("-- Optional cleanup (UNCOMMENT ONLY IF YOU WANT REIMPORT)")
    lines.append("-- DELETE FROM rd_quiz_options WHERE question_id IN (")
    lines.append("--   SELECT q.question_id FROM rd_quiz_questions q")
    lines.append("--   JOIN tmp_reusable_pack_targets t ON t.course_session_id = q.course_session_id")
    lines.append("-- );")
    lines.append("-- DELETE FROM rd_quiz_questions WHERE course_session_id IN (")
    lines.append("--   SELECT course_session_id FROM tmp_reusable_pack_targets")
    lines.append("-- );")
    lines.append("")
    OUT_SQL.write_text("\n".join(lines), encoding="utf-8")


def build_bundle(packs: List[Dict]) -> None:
    OUT_BUNDLE.parent.mkdir(parents=True, exist_ok=True)
    with tarfile.open(OUT_BUNDLE, "w:gz") as tar:
        included = set()
        for p in packs:
            pack_json = Path(str(p["pack_json"]).replace("\\", "/"))
            if not pack_json.exists():
                continue
            rel_json = pack_json.relative_to(REUSABLE_ROOT)
            json_arc = rel_json.as_posix()
            if json_arc not in included:
                tar.add(pack_json, arcname=json_arc)
                included.add(json_arc)

            img_dir = pack_json.parent / "images"
            if img_dir.exists():
                for svg in sorted(img_dir.glob("*.svg")):
                    rel_svg = svg.relative_to(REUSABLE_ROOT).as_posix()
                    if rel_svg not in included:
                        tar.add(svg, arcname=rel_svg)
                        included.add(rel_svg)


def build_remote_script(packs: List[Dict]) -> None:
    bundle_b64 = base64.b64encode(OUT_BUNDLE.read_bytes()).decode("ascii")
    map_lines = []
    for p in packs:
        pack_json = Path(str(p["pack_json"]).replace("\\", "/"))
        rel_json = pack_json.relative_to(REUSABLE_ROOT).as_posix()
        rel_img = (pack_json.parent / "images").relative_to(REUSABLE_ROOT).as_posix()
        map_lines.append(f"{int(p['course_id'])}|{int(p['course_session_id'])}|{rel_json}|{rel_img}")

    script_lines: List[str] = [
        "#!/bin/bash",
        "set -euo pipefail",
        "",
        'BASE="http://127.0.0.1:8080"',
        'COOKIE="/tmp/rd_reusable_pack_cookie.txt"',
        'WORK="/tmp/rd_reusable_pack_$(date +%s)"',
        'BUNDLE="$WORK/reusable_packs_bundle.tgz"',
        'UNPACK="$WORK/unpack"',
        "",
        'mkdir -p "$WORK" "$UNPACK"',
        "cat > \"$WORK/reusable_packs_bundle.b64\" <<'B64'",
        bundle_b64,
        "B64",
        "base64 -d \"$WORK/reusable_packs_bundle.b64\" > \"$BUNDLE\"",
        "tar -xzf \"$BUNDLE\" -C \"$UNPACK\"",
        "",
        "rm -f \"$COOKIE\"",
        "curl -s -c \"$COOKIE\" -b \"$COOKIE\" -o \"$WORK/login_body.txt\" -w \"LOGIN_HTTP=%{http_code}\\n\" \\",
        "  -d \"userName=anirudh&password=anirudh\" \"$BASE/login\"",
        "",
        "echo \"IMPORT_START\"",
        "",
        "while IFS='|' read -r COURSE_ID SESSION_ID REL_JSON REL_IMG_DIR; do",
        "  [ -z \"$COURSE_ID\" ] && continue",
        "  DEST=\"/opt/robodynamics/session_materials/${COURSE_ID}/images\"",
        "  mkdir -p \"$DEST\"",
        "  cp -f \"$UNPACK/$REL_IMG_DIR\"/*.svg \"$DEST/\" 2>/dev/null || true",
        "  chmod 644 \"$DEST\"/*.svg 2>/dev/null || true",
        "",
        "  BEFORE=$(mysql -uroot -pJatni@752050 robodynamics_db -Nse \"SELECT COUNT(*) FROM rd_quiz_questions WHERE course_session_id=${SESSION_ID};\")",
        "  echo \"SESSION=${SESSION_ID} COURSE=${COURSE_ID} BEFORE=${BEFORE}\"",
        "",
        "  if [ \"${BEFORE}\" -gt 0 ]; then",
        "    echo \"SESSION=${SESSION_ID} STATUS=SKIP_EXISTING\"",
        "    continue",
        "  fi",
        "",
        "  RESP_FILE=\"$WORK/upload_${COURSE_ID}_${SESSION_ID}.json\"",
        "  curl -s -b \"$COOKIE\" -o \"$RESP_FILE\" -w \"UPLOAD_HTTP=%{http_code}\\n\" \\",
        "    -F \"courseId=${COURSE_ID}\" \\",
        "    -F \"sessionId=${SESSION_ID}\" \\",
        "    -F \"file=@$UNPACK/$REL_JSON;type=application/json\" \\",
        "    \"$BASE/exam-prep/api/upload-question-bank\"",
        "",
        "  AFTER=$(mysql -uroot -pJatni@752050 robodynamics_db -Nse \"SELECT COUNT(*) FROM rd_quiz_questions WHERE course_session_id=${SESSION_ID};\")",
        "  echo \"SESSION=${SESSION_ID} COURSE=${COURSE_ID} AFTER=${AFTER}\"",
        "done <<'MAP'",
    ]
    script_lines.extend(map_lines)
    script_lines.extend(
        [
            "MAP",
            "",
            "echo \"IMPORT_END\"",
        ]
    )
    OUT_REMOTE_SCRIPT.write_text("\n".join(script_lines) + "\n", encoding="utf-8")


def main() -> None:
    if not REUSABLE_INDEX.exists():
        raise FileNotFoundError(f"Index not found: {REUSABLE_INDEX}")
    index = json.loads(REUSABLE_INDEX.read_text(encoding="utf-8"))
    packs = index.get("packs", [])
    if not packs:
        raise ValueError("No packs found in reusable index.")

    build_sql(packs)
    build_bundle(packs)
    build_remote_script(packs)
    print(f"Wrote SQL: {OUT_SQL}")
    print(f"Wrote bundle: {OUT_BUNDLE}")
    print(f"Wrote remote script: {OUT_REMOTE_SCRIPT}")


if __name__ == "__main__":
    main()

