set -e
mysql -uroot -p'Jatni@752050' -D robodynamics_db -e "
INSERT INTO rd_ci_intake_response (
  ci_subscription_id,
  parent_user_id,
  student_user_id,
  respondent_type,
  section_code,
  question_code,
  answer_value
)
SELECT
  s.ci_subscription_id,
  s.parent_user_id,
  s.student_user_id,
  'STUDENT',
  'PROFILE',
  v.question_code,
  v.answer_value
FROM rd_ci_subscription s
JOIN (
  SELECT 10 AS ci_subscription_id, 'S_CURR_SCHOOL_01' AS question_code, 'Robo Dynamics Test School' AS answer_value
  UNION ALL SELECT 10, 'S_CURR_GRADE_01', '10'
  UNION ALL SELECT 10, 'S_CURR_BOARD_01', 'CBSE'
  UNION ALL SELECT 10, 'S_GOAL_01', 'ENGINEERING_RESEARCH'
  UNION ALL SELECT 10, 'S_LIFE_01', 'I want to become a skilled engineer solving real-world problems.'
  UNION ALL SELECT 10, 'S_HOBBY_01', 'Robotics projects, coding basics, and puzzle solving'
  UNION ALL SELECT 10, 'S_DISLIKE_01', 'Lengthy rote memorization without understanding'
  UNION ALL SELECT 10, 'S_STYLE_01', 'PRACTICAL'
  UNION ALL SELECT 10, 'S_ACHIEVE_01', 'Built a small sensor project for school exhibition'
  UNION ALL SELECT 10, 'S_FEAR_01', 'Making mistakes in timed tests'
  UNION ALL SELECT 10, 'S_SUPPORT_01', 'Need regular feedback and a weekly practice plan'

  UNION ALL SELECT 9, 'S_CURR_SCHOOL_01', 'Robo Dynamics Senior Secondary School'
  UNION ALL SELECT 9, 'S_CURR_GRADE_01', '12'
  UNION ALL SELECT 9, 'S_CURR_BOARD_01', 'CBSE'
  UNION ALL SELECT 9, 'S_CURR_STREAM_01', 'PCM'
  UNION ALL SELECT 9, 'S_CURR_SUBJECTS_01', 'Physics, Chemistry, Mathematics'
  UNION ALL SELECT 9, 'S_GOAL_01', 'ENGINEERING_RESEARCH'
  UNION ALL SELECT 9, 'S_LIFE_01', 'I see myself in a top engineering program and building products.'
  UNION ALL SELECT 9, 'S_HOBBY_01', 'Math challenges, coding practice, and electronics kits'
  UNION ALL SELECT 9, 'S_DISLIKE_01', 'Unstructured study sessions and distractions'
  UNION ALL SELECT 9, 'S_STYLE_01', 'SELF_STUDY'
  UNION ALL SELECT 9, 'S_ACHIEVE_01', 'Scored well in science olympiad and school assessments'
  UNION ALL SELECT 9, 'S_FEAR_01', 'Underperforming in board exams due to stress'
  UNION ALL SELECT 9, 'S_SUPPORT_01', 'Need mock-test analysis and focused revision guidance'

  UNION ALL SELECT 3, 'S_HOBBY_01', 'Reading, creative writing, and analytical puzzles'
  UNION ALL SELECT 3, 'S_DISLIKE_01', 'Monotonous tasks with no learning value'
  UNION ALL SELECT 3, 'S_STYLE_01', 'DISCUSSION'
  UNION ALL SELECT 3, 'S_ACHIEVE_01', 'Won school-level quiz and presented in science club'
  UNION ALL SELECT 3, 'S_FEAR_01', 'Fear of choosing the wrong career direction'
  UNION ALL SELECT 3, 'S_SUPPORT_01', 'Need mentoring to align strengths with career options'
  UNION ALL SELECT 3, 'S_CURR_SUBJECTS_01', 'Physics, Chemistry, Mathematics'
) v
  ON v.ci_subscription_id = s.ci_subscription_id
WHERE UPPER(IFNULL(s.module_code,''))='APTIPATH'
  AND UPPER(IFNULL(s.status,''))='ACTIVE'
ON DUPLICATE KEY UPDATE
  answer_value = VALUES(answer_value),
  updated_at = CURRENT_TIMESTAMP;

SELECT 'UPSERT_DONE' AS status;
"
