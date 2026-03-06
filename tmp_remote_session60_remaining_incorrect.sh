mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
SELECT r.ci_assessment_response_id, r.question_code, COALESCE(r.selected_option,''), COALESCE(r.is_correct,0)
FROM rd_ci_assessment_response r
WHERE r.ci_assessment_session_id=60
  AND COALESCE(r.is_correct,0)<>1
ORDER BY r.ci_assessment_response_id;
SQL
