-- ============================================================
-- AptiPath Phase 1 Extension Migration
-- Date: 2026-02-21
-- Run on: robodynamics_db
-- Scope:
--   1) Add explicit module tagging to rd_ci_subscription
--   2) Parent/Student intake persistence table
--   3) Assessment response persistence table
--   4) Recommendation snapshot table
--   5) Score index table for analytics/reporting
-- ============================================================

USE robodynamics_db;

-- ------------------------------------------------------------
-- 1) Explicit module code on subscription (module ownership)
-- ------------------------------------------------------------
SET @module_code_col_exists = (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'rd_ci_subscription'
      AND column_name = 'module_code'
);
SET @sql_module_col = IF(
    @module_code_col_exists = 0,
    'ALTER TABLE rd_ci_subscription ADD COLUMN module_code VARCHAR(40) NULL AFTER plan_type',
    'SELECT 1'
);
PREPARE stmt_module_col FROM @sql_module_col;
EXECUTE stmt_module_col;
DEALLOCATE PREPARE stmt_module_col;

UPDATE rd_ci_subscription
SET module_code = CASE
    WHEN lower(plan_type) = 'career'  THEN 'APTIPATH'
    WHEN lower(plan_type) = 'exam'    THEN 'EXAM_PREP'
    WHEN lower(plan_type) = 'tuition' THEN 'TUITION'
    ELSE 'GENERAL'
END
WHERE module_code IS NULL OR trim(module_code) = '';

ALTER TABLE rd_ci_subscription
    MODIFY module_code VARCHAR(40) NOT NULL;

SET @module_code_idx_exists = (
    SELECT COUNT(*)
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'rd_ci_subscription'
      AND index_name = 'idx_ci_subscription_module_code'
);
SET @sql_module_idx = IF(
    @module_code_idx_exists = 0,
    'CREATE INDEX idx_ci_subscription_module_code ON rd_ci_subscription(module_code)',
    'SELECT 1'
);
PREPARE stmt_module_idx FROM @sql_module_idx;
EXECUTE stmt_module_idx;
DEALLOCATE PREPARE stmt_module_idx;

-- ------------------------------------------------------------
-- 2) rd_ci_intake_response
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rd_ci_intake_response (
    ci_intake_response_id BIGINT NOT NULL AUTO_INCREMENT,
    ci_subscription_id BIGINT NOT NULL,
    parent_user_id INT NULL,
    student_user_id INT NULL,

    respondent_type VARCHAR(20) NOT NULL,
    section_code VARCHAR(40) NULL,
    question_code VARCHAR(120) NOT NULL,
    answer_value VARCHAR(1000) NULL,
    answer_json JSON NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (ci_intake_response_id),
    UNIQUE KEY uk_ci_intake_sub_respondent_question (ci_subscription_id, respondent_type, question_code),
    KEY idx_ci_intake_subscription (ci_subscription_id),
    KEY idx_ci_intake_parent (parent_user_id),
    KEY idx_ci_intake_student (student_user_id),
    KEY idx_ci_intake_respondent (respondent_type),
    CONSTRAINT fk_ci_intake_subscription
        FOREIGN KEY (ci_subscription_id) REFERENCES rd_ci_subscription (ci_subscription_id),
    CONSTRAINT fk_ci_intake_parent_user
        FOREIGN KEY (parent_user_id) REFERENCES rd_users (user_id),
    CONSTRAINT fk_ci_intake_student_user
        FOREIGN KEY (student_user_id) REFERENCES rd_users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 3) rd_ci_assessment_response
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rd_ci_assessment_response (
    ci_assessment_response_id BIGINT NOT NULL AUTO_INCREMENT,
    ci_assessment_session_id BIGINT NOT NULL,

    question_code VARCHAR(120) NOT NULL,
    selected_option VARCHAR(255) NULL,
    response_json JSON NULL,
    time_spent_seconds INT NULL,
    confidence_level VARCHAR(20) NULL,
    is_correct TINYINT(1) NULL,
    score_awarded DECIMAL(6,2) NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (ci_assessment_response_id),
    UNIQUE KEY uk_ci_assessment_response_session_question (ci_assessment_session_id, question_code),
    KEY idx_ci_assessment_response_session (ci_assessment_session_id),
    KEY idx_ci_assessment_response_question (question_code),
    CONSTRAINT fk_ci_assessment_response_session
        FOREIGN KEY (ci_assessment_session_id) REFERENCES rd_ci_assessment_session (ci_assessment_session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 4) rd_ci_recommendation_snapshot
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rd_ci_recommendation_snapshot (
    ci_recommendation_snapshot_id BIGINT NOT NULL AUTO_INCREMENT,
    ci_assessment_session_id BIGINT NOT NULL,
    recommendation_version VARCHAR(40) NOT NULL DEFAULT 'v1',

    stream_fit_json JSON NULL,
    career_clusters_json JSON NULL,
    plan_a_json JSON NULL,
    plan_b_json JSON NULL,
    plan_c_json JSON NULL,
    summary_text TEXT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (ci_recommendation_snapshot_id),
    UNIQUE KEY uk_ci_recommendation_session_version (ci_assessment_session_id, recommendation_version),
    KEY idx_ci_recommendation_session (ci_assessment_session_id),
    CONSTRAINT fk_ci_recommendation_session
        FOREIGN KEY (ci_assessment_session_id) REFERENCES rd_ci_assessment_session (ci_assessment_session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 5) rd_ci_score_index
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rd_ci_score_index (
    ci_score_index_id BIGINT NOT NULL AUTO_INCREMENT,
    ci_assessment_session_id BIGINT NOT NULL,

    aptitude_score DECIMAL(6,2) NULL,
    interest_score DECIMAL(6,2) NULL,
    parent_context_score DECIMAL(6,2) NULL,
    overall_fit_score DECIMAL(6,2) NULL,

    pressure_index DECIMAL(6,2) NULL,
    exploration_index DECIMAL(6,2) NULL,
    exam_readiness_index DECIMAL(6,2) NULL,
    ai_readiness_index DECIMAL(6,2) NULL,
    alignment_index DECIMAL(6,2) NULL,
    wellbeing_risk_index DECIMAL(6,2) NULL,

    scoring_version VARCHAR(40) NOT NULL DEFAULT 'v1',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (ci_score_index_id),
    UNIQUE KEY uk_ci_score_index_session (ci_assessment_session_id),
    KEY idx_ci_score_index_version (scoring_version),
    CONSTRAINT fk_ci_score_index_session
        FOREIGN KEY (ci_assessment_session_id) REFERENCES rd_ci_assessment_session (ci_assessment_session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT 'AptiPath Phase 1 extension migration completed.' AS status;
