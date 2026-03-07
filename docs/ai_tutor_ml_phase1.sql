-- AI Tutor ML Phase 1 schema extension.
-- Depends on base tables from docs/ai_tutor_schema.sql
--   rd_ai_tutor_session
--   rd_ai_tutor_event
--   rd_ai_tutor_progress

CREATE TABLE IF NOT EXISTS rd_ai_tutor_training_run (
  run_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  model_type VARCHAR(64) NOT NULL,
  model_version VARCHAR(64) NOT NULL,
  input_event_count INT NOT NULL DEFAULT 0,
  sample_count INT NOT NULL DEFAULT 0,
  metrics_json JSON,
  artifact_uri VARCHAR(512),
  status VARCHAR(24) NOT NULL DEFAULT 'COMPLETED',
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  INDEX idx_ai_tutor_training_model (model_type, model_version),
  INDEX idx_ai_tutor_training_started (started_at)
);

CREATE TABLE IF NOT EXISTS rd_ai_tutor_policy_model (
  model_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  model_type VARCHAR(64) NOT NULL,
  model_version VARCHAR(64) NOT NULL,
  model_json JSON NOT NULL,
  min_support INT NOT NULL DEFAULT 5,
  is_active TINYINT(1) NOT NULL DEFAULT 0,
  created_by VARCHAR(128),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  activated_at DATETIME,
  UNIQUE KEY uq_ai_tutor_policy_model (model_type, model_version),
  INDEX idx_ai_tutor_policy_active (model_type, is_active)
);

CREATE TABLE IF NOT EXISTS rd_ai_tutor_student_mastery (
  mastery_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_user_id INT NOT NULL,
  module_code VARCHAR(32) NOT NULL,
  chapter_code VARCHAR(64) NOT NULL,
  exercise_group VARCHAR(8) NOT NULL,
  mastery_score DECIMAL(5,4) NOT NULL DEFAULT 0.5000,
  confidence_band VARCHAR(16) NOT NULL DEFAULT 'unknown',
  attempts INT NOT NULL DEFAULT 0,
  correct_count INT NOT NULL DEFAULT 0,
  last_response_ms INT NOT NULL DEFAULT 0,
  error_streak INT NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ai_tutor_mastery (student_user_id, module_code, chapter_code, exercise_group),
  INDEX idx_ai_tutor_mastery_student (student_user_id, module_code),
  INDEX idx_ai_tutor_mastery_chapter (module_code, chapter_code, exercise_group)
);

-- Optional helper view for policy training extraction from event stream.
-- Filters to answer submissions with tutor action in payload_json/meta.
CREATE OR REPLACE VIEW vw_ai_tutor_answer_events AS
SELECT
  event_id,
  session_id,
  lesson_code AS chapter_code,
  question_id,
  is_correct,
  created_at,
  JSON_UNQUOTE(JSON_EXTRACT(payload_json, '$.chapterCode')) AS payload_chapter_code,
  JSON_UNQUOTE(JSON_EXTRACT(payload_json, '$.exerciseGroup')) AS exercise_group,
  JSON_UNQUOTE(JSON_EXTRACT(payload_json, '$.confidence')) AS confidence,
  JSON_UNQUOTE(JSON_EXTRACT(payload_json, '$.tutorAction')) AS tutor_action,
  CAST(JSON_UNQUOTE(JSON_EXTRACT(payload_json, '$.responseTimeMs')) AS SIGNED) AS response_time_ms
FROM rd_ai_tutor_event
WHERE UPPER(event_type) = 'ANSWER_SUBMITTED';

