-- Optional persistence tables for AI tutor events and progress.
-- Current Java implementation stores events in-memory for starter rollout.

CREATE TABLE IF NOT EXISTS rd_ai_tutor_session (
  session_id VARCHAR(64) PRIMARY KEY,
  module_code VARCHAR(32) NOT NULL,
  lesson_code VARCHAR(64),
  parent_user_id INT,
  student_user_id INT,
  child_user_id INT,
  grade_level VARCHAR(16),
  status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at DATETIME,
  last_event_at DATETIME
);

CREATE TABLE IF NOT EXISTS rd_ai_tutor_event (
  event_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id VARCHAR(64) NOT NULL,
  event_type VARCHAR(64) NOT NULL,
  lesson_code VARCHAR(64),
  question_id VARCHAR(64),
  is_correct TINYINT(1),
  score_delta INT,
  skill_code VARCHAR(64),
  payload_json JSON,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ai_tutor_event_session (session_id),
  INDEX idx_ai_tutor_event_created (created_at)
);

CREATE TABLE IF NOT EXISTS rd_ai_tutor_progress (
  progress_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_user_id INT NOT NULL,
  module_code VARCHAR(32) NOT NULL,
  lesson_code VARCHAR(64) NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  correct_count INT NOT NULL DEFAULT 0,
  accuracy_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  last_practiced_at DATETIME,
  UNIQUE KEY uq_ai_tutor_progress (student_user_id, module_code, lesson_code)
);

