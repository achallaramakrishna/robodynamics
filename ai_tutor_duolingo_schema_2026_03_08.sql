-- Duolingo-style persistence schema for AI Tutor (Vedic Maths and other courses).
-- Date: 2026-03-08
-- Safe to run multiple times (CREATE TABLE IF NOT EXISTS + idempotent badge seed).

CREATE TABLE IF NOT EXISTS rd_ai_tutor_user_progress (
  user_progress_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_user_id INT NOT NULL,
  course_id VARCHAR(64) NOT NULL,
  module_code VARCHAR(32) NOT NULL,
  chapter_code VARCHAR(64) NOT NULL DEFAULT '',
  hearts_max SMALLINT NOT NULL DEFAULT 5,
  hearts_current SMALLINT NOT NULL DEFAULT 5,
  xp_total INT NOT NULL DEFAULT 0,
  streak_days INT NOT NULL DEFAULT 0,
  streak_best INT NOT NULL DEFAULT 0,
  mastery_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  lesson_completion_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  last_activity_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ai_tutor_user_progress (student_user_id, course_id, chapter_code),
  INDEX idx_ai_tutor_user_progress_course (course_id, module_code),
  INDEX idx_ai_tutor_user_progress_activity (last_activity_at)
);

CREATE TABLE IF NOT EXISTS rd_ai_tutor_skill_progress (
  skill_progress_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_user_id INT NOT NULL,
  course_id VARCHAR(64) NOT NULL,
  chapter_code VARCHAR(64) NOT NULL,
  exercise_group VARCHAR(8) NOT NULL,
  subtopic_code VARCHAR(128) NOT NULL,
  mastery_score TINYINT UNSIGNED NOT NULL DEFAULT 0,
  attempt_count INT NOT NULL DEFAULT 0,
  correct_count INT NOT NULL DEFAULT 0,
  avg_response_ms INT NOT NULL DEFAULT 0,
  status VARCHAR(16) NOT NULL DEFAULT 'LOCKED',
  last_practiced_at DATETIME NULL,
  next_review_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ai_tutor_skill_progress (student_user_id, course_id, chapter_code, exercise_group, subtopic_code),
  INDEX idx_ai_tutor_skill_progress_review (student_user_id, next_review_at),
  INDEX idx_ai_tutor_skill_progress_status (status, chapter_code)
);

CREATE TABLE IF NOT EXISTS rd_ai_tutor_badge (
  badge_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  badge_code VARCHAR(64) NOT NULL,
  title VARCHAR(128) NOT NULL,
  description VARCHAR(255) NOT NULL,
  icon_name VARCHAR(128) NOT NULL DEFAULT '',
  criteria_json JSON NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ai_tutor_badge_code (badge_code)
);

CREATE TABLE IF NOT EXISTS rd_ai_tutor_user_badge (
  user_badge_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_user_id INT NOT NULL,
  badge_code VARCHAR(64) NOT NULL,
  source_course_id VARCHAR(64) NOT NULL DEFAULT '',
  source_chapter_code VARCHAR(64) NOT NULL DEFAULT '',
  source_session_id VARCHAR(64) NULL,
  award_meta_json JSON NULL,
  awarded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ai_tutor_user_badge (student_user_id, badge_code),
  INDEX idx_ai_tutor_user_badge_awarded (awarded_at),
  INDEX idx_ai_tutor_user_badge_student (student_user_id)
);

CREATE TABLE IF NOT EXISTS rd_ai_tutor_review_queue (
  review_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_user_id INT NOT NULL,
  course_id VARCHAR(64) NOT NULL,
  chapter_code VARCHAR(64) NOT NULL,
  exercise_group VARCHAR(8) NOT NULL,
  subtopic_code VARCHAR(128) NOT NULL,
  priority SMALLINT NOT NULL DEFAULT 100,
  due_at DATETIME NOT NULL,
  state VARCHAR(16) NOT NULL DEFAULT 'DUE',
  mastery_snapshot TINYINT UNSIGNED NOT NULL DEFAULT 0,
  attempt_count INT NOT NULL DEFAULT 0,
  last_attempt_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ai_tutor_review_item (student_user_id, course_id, chapter_code, exercise_group, subtopic_code, due_at),
  INDEX idx_ai_tutor_review_due (student_user_id, state, due_at),
  INDEX idx_ai_tutor_review_course (course_id, chapter_code, state)
);

INSERT INTO rd_ai_tutor_badge (badge_code, title, description, icon_name, criteria_json, is_active)
VALUES
  ('FIRST_STEPS', 'First Steps', 'Complete your first tutor question.', 'badge_first_steps', JSON_OBJECT('correct_answers', 1), 1),
  ('STREAK_3', '3 Day Streak', 'Practice for 3 consecutive days.', 'badge_streak_3', JSON_OBJECT('streak_days', 3), 1),
  ('STREAK_7', '7 Day Streak', 'Practice for 7 consecutive days.', 'badge_streak_7', JSON_OBJECT('streak_days', 7), 1),
  ('PERFECT_SET', 'Perfect Set', 'Complete one lesson path with no heart loss.', 'badge_perfect_set', JSON_OBJECT('hearts_lost', 0, 'lesson_completion_pct', 100), 1),
  ('XP_500', 'XP 500', 'Reach 500 XP.', 'badge_xp_500', JSON_OBJECT('xp_total', 500), 1)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  description = VALUES(description),
  icon_name = VALUES(icon_name),
  criteria_json = VALUES(criteria_json),
  is_active = VALUES(is_active),
  updated_at = CURRENT_TIMESTAMP;
