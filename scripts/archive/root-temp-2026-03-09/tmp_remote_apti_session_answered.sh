#!/bin/bash
set -euo pipefail
mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
SELECT
  u.username,
  s.ci_assessment_session_id,
  s.status,
  DATE_FORMAT(s.completed_at, '%Y-%m-%d %H:%i:%s') AS completed_at,
  COUNT(r.ci_assessment_response_id) AS response_rows,
  SUM(CASE WHEN COALESCE(TRIM(r.selected_option),'') <> '' THEN 1 ELSE 0 END) AS answered_rows
FROM rd_ci_assessment_session s
JOIN rd_user u ON u.user_id = s.student_user_id
LEFT JOIN rd_ci_assessment_response r ON r.assessment_session_id = s.ci_assessment_session_id
WHERE u.username IN ('sashank_1','sashank','ridhianish','krishvi','student01')
  AND s.assessment_version = 'v3'
  AND s.ci_assessment_session_id = (
      SELECT MAX(s2.ci_assessment_session_id)
      FROM rd_ci_assessment_session s2
      WHERE s2.student_user_id = s.student_user_id
        AND s2.assessment_version = 'v3'
  )
GROUP BY u.username, s.ci_assessment_session_id, s.status, s.completed_at
ORDER BY u.username;
SQL
