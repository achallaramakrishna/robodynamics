-- ============================================================
-- AptiPath Question Bank Migration (Phase 1 test runner)
-- Date: 2026-02-21
-- Run on: robodynamics_db
-- ============================================================

USE robodynamics_db;

CREATE TABLE IF NOT EXISTS rd_ci_question_bank (
    ci_question_id BIGINT NOT NULL AUTO_INCREMENT,
    module_code VARCHAR(40) NOT NULL,
    assessment_version VARCHAR(40) NOT NULL DEFAULT 'v1',
    question_code VARCHAR(120) NOT NULL,
    sequence_no INT NOT NULL,
    section_code VARCHAR(40) NULL,
    question_type VARCHAR(40) NOT NULL,
    question_text VARCHAR(2000) NOT NULL,
    options_json JSON NOT NULL,
    correct_option VARCHAR(255) NULL,
    media_image_url VARCHAR(512) NULL,
    media_video_url VARCHAR(512) NULL,
    media_animation_url VARCHAR(512) NULL,
    weightage DECIMAL(6,2) NOT NULL DEFAULT 1.00,
    status VARCHAR(24) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ci_question_id),
    UNIQUE KEY uk_ci_question_code_version (module_code, assessment_version, question_code),
    KEY idx_ci_question_module_version (module_code, assessment_version),
    KEY idx_ci_question_status (status),
    KEY idx_ci_question_sequence (sequence_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT 'AptiPath question bank migration completed.' AS status;
