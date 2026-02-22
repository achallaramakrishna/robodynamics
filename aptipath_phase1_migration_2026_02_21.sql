-- ============================================================
-- AptiPath Phase 1 Migration Script
-- Date: 2026-02-21
-- Run on: robodynamics_db
-- Scope:
--   1) rd_ci_subscription
--   2) rd_ci_assessment_session
-- ============================================================

USE robodynamics_db;

-- ------------------------------------------------------------
-- Table 1: rd_ci_subscription
-- Stores durable checkout/subscription entitlement records.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rd_ci_subscription (
    ci_subscription_id BIGINT NOT NULL AUTO_INCREMENT,
    parent_user_id INT NULL,
    student_user_id INT NULL,

    plan_key VARCHAR(80) NOT NULL,
    plan_name VARCHAR(160) NOT NULL,
    plan_type VARCHAR(40) NOT NULL,
    billing_label VARCHAR(32) NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'ACTIVE',

    base_amount INT NOT NULL DEFAULT 0,
    gst_amount INT NOT NULL DEFAULT 0,
    total_amount INT NOT NULL DEFAULT 0,
    gst_percent DECIMAL(5,2) NULL,
    currency VARCHAR(8) NOT NULL DEFAULT 'INR',

    payment_provider VARCHAR(32) NOT NULL DEFAULT 'RAZORPAY',
    provider_order_id VARCHAR(120) NULL,
    provider_payment_id VARCHAR(120) NULL,
    provider_signature VARCHAR(255) NULL,

    course_id INT NULL,

    start_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (ci_subscription_id),
    UNIQUE KEY uk_ci_subscription_provider_order (provider_order_id),
    KEY idx_ci_subscription_parent (parent_user_id),
    KEY idx_ci_subscription_student (student_user_id),
    KEY idx_ci_subscription_status (status),
    KEY idx_ci_subscription_plan_key (plan_key),
    CONSTRAINT fk_ci_subscription_parent_user
        FOREIGN KEY (parent_user_id) REFERENCES rd_users (user_id),
    CONSTRAINT fk_ci_subscription_student_user
        FOREIGN KEY (student_user_id) REFERENCES rd_users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table 2: rd_ci_assessment_session
-- Stores one AptiPath assessment attempt lifecycle.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rd_ci_assessment_session (
    ci_assessment_session_id BIGINT NOT NULL AUTO_INCREMENT,
    ci_subscription_id BIGINT NOT NULL,
    student_user_id INT NOT NULL,

    assessment_version VARCHAR(40) NOT NULL DEFAULT 'v1',
    status VARCHAR(24) NOT NULL DEFAULT 'CREATED',
    attempt_no INT NOT NULL DEFAULT 1,

    started_at DATETIME NULL,
    completed_at DATETIME NULL,
    duration_seconds INT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (ci_assessment_session_id),
    UNIQUE KEY uk_ci_assessment_subscription_attempt (ci_subscription_id, attempt_no),
    KEY idx_ci_assessment_student (student_user_id),
    KEY idx_ci_assessment_status (status),
    KEY idx_ci_assessment_subscription (ci_subscription_id),
    CONSTRAINT fk_ci_assessment_subscription
        FOREIGN KEY (ci_subscription_id) REFERENCES rd_ci_subscription (ci_subscription_id),
    CONSTRAINT fk_ci_assessment_student
        FOREIGN KEY (student_user_id) REFERENCES rd_users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT 'AptiPath Phase 1 migration completed.' AS status;
