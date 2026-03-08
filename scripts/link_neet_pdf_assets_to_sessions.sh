#!/usr/bin/env bash
set -euo pipefail

# Links chapter PDFs to rd_course_session_details for AI Tutor chapters.
# Expected filesystem pattern:
#   /opt/robodynamics/session_materials/{courseId}/chapter/*.pdf
#
# Required env vars:
#   DB_USER, DB_PASS, DB_NAME
# Optional env vars:
#   DB_HOST (default: 127.0.0.1)
#   DB_PORT (default: 3306)
#   MATERIALS_BASE (default: /opt/robodynamics/session_materials)
#
# Usage examples:
#   DB_USER=root DB_PASS=secret DB_NAME=robodynamics ./scripts/link_neet_pdf_assets_to_sessions.sh
#   DB_USER=root DB_PASS=secret DB_NAME=robodynamics ./scripts/link_neet_pdf_assets_to_sessions.sh 138 131 132

: "${DB_USER:?Set DB_USER}"
: "${DB_PASS:?Set DB_PASS}"
: "${DB_NAME:?Set DB_NAME}"
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
MATERIALS_BASE="${MATERIALS_BASE:-/opt/robodynamics/session_materials}"

if [ "$#" -gt 0 ]; then
  COURSE_IDS=("$@")
else
  COURSE_IDS=(138 131 132)
fi

mysql_exec() {
  local sql="$1"
  MYSQL_PWD="$DB_PASS" mysql \
    --batch --skip-column-names \
    -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" \
    -e "$sql"
}

sql_escape() {
  local s="$1"
  s="${s//\\/\\\\}"
  s="${s//\'/\'\'}"
  printf '%s' "$s"
}

for course_id in "${COURSE_IDS[@]}"; do
  chapter_dir="${MATERIALS_BASE}/${course_id}/chapter"
  if [ ! -d "$chapter_dir" ]; then
    echo "[SKIP] course=${course_id} no chapter dir: ${chapter_dir}"
    continue
  fi

  mapfile -t pdfs < <(find "$chapter_dir" -maxdepth 1 -type f \( -iname '*.pdf' \) | sort)
  if [ "${#pdfs[@]}" -eq 0 ]; then
    echo "[SKIP] course=${course_id} no PDFs under ${chapter_dir}"
    continue
  fi

  mapfile -t sessions < <(
    mysql_exec "
      SELECT
        course_session_id,
        session_title
      FROM rd_course_sessions
      WHERE course_id = ${course_id}
        AND session_type = 'session'
      ORDER BY
        COALESCE(tier_order, 9999),
        COALESCE(session_id, 9999),
        course_session_id
    "
  )
  if [ "${#sessions[@]}" -eq 0 ]; then
    echo "[SKIP] course=${course_id} no session rows in rd_course_sessions"
    continue
  fi

  pair_count="${#pdfs[@]}"
  if [ "${#sessions[@]}" -lt "$pair_count" ]; then
    pair_count="${#sessions[@]}"
  fi

  echo "[INFO] course=${course_id} sessions=${#sessions[@]} pdfs=${#pdfs[@]} linking=${pair_count}"

  for ((i=0; i<pair_count; i++)); do
    line="${sessions[$i]}"
    IFS=$'\t' read -r course_session_id session_title <<< "$line"
    pdf_path="${pdfs[$i]}"
    pdf_name="$(basename "$pdf_path")"
    rel_file="chapter/${pdf_name}"

    esc_rel_file="$(sql_escape "$rel_file")"
    esc_topic="$(sql_escape "${session_title:-Chapter ${i}}")"

    exists="$(
      mysql_exec "
        SELECT COUNT(*)
        FROM rd_course_session_details
        WHERE course_session_id = ${course_session_id}
          AND file = '${esc_rel_file}'
          AND type IN ('pdf', 'notes')
      "
    )"
    if [ "${exists:-0}" -gt 0 ]; then
      echo "  [OK] session=${course_session_id} already linked ${rel_file}"
      continue
    fi

    next_detail_id="$(
      mysql_exec "
        SELECT COALESCE(MAX(session_detail_id), 0) + 1
        FROM rd_course_session_details
        WHERE course_session_id = ${course_session_id}
      "
    )"

    mysql_exec "
      INSERT INTO rd_course_session_details (
        course_id,
        course_session_id,
        topic,
        type,
        file,
        creation_date,
        version,
        session_detail_id,
        has_animation,
        assignment
      ) VALUES (
        ${course_id},
        ${course_session_id},
        '${esc_topic}',
        'pdf',
        '${esc_rel_file}',
        NOW(),
        1,
        ${next_detail_id},
        0,
        0
      )
    "
    echo "  [LINKED] session=${course_session_id} -> ${rel_file}"
  done
done

echo "[DONE] PDF linking completed."
