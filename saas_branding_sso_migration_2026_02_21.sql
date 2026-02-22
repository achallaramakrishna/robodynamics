-- ============================================================
-- SaaS Branding + SSO Migration
-- Date: 2026-02-21
-- Run on: robodynamics_db
-- Purpose:
--   White-label embed support for schools/colleges/companies.
-- ============================================================

USE robodynamics_db;

-- ------------------------------------------------------------
-- 1) Company branding
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rd_company_branding (
    company_branding_id BIGINT NOT NULL AUTO_INCREMENT,
    company_id BIGINT NOT NULL,
    branding_name VARCHAR(120) NULL,
    logo_url VARCHAR(500) NULL,
    primary_color VARCHAR(20) NULL,
    secondary_color VARCHAR(20) NULL,
    footer_html TEXT NULL,
    powered_by_label VARCHAR(255) NULL,
    hide_rd_header TINYINT(1) NOT NULL DEFAULT 1,
    status VARCHAR(24) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (company_branding_id),
    UNIQUE KEY uk_rd_company_branding_company (company_id),
    KEY idx_rd_company_branding_status (status),
    CONSTRAINT fk_rd_company_branding_company
        FOREIGN KEY (company_id) REFERENCES rd_companies (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 2) Company SSO/integration config
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rd_company_sso_config (
    company_sso_config_id BIGINT NOT NULL AUTO_INCREMENT,
    company_id BIGINT NOT NULL,
    issuer VARCHAR(255) NULL,
    shared_secret VARCHAR(512) NOT NULL,
    token_ttl_seconds INT NOT NULL DEFAULT 300,
    allowed_domains VARCHAR(1000) NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (company_sso_config_id),
    UNIQUE KEY uk_rd_company_sso_config_company (company_id),
    KEY idx_rd_company_sso_status (status),
    CONSTRAINT fk_rd_company_sso_company
        FOREIGN KEY (company_id) REFERENCES rd_companies (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Seed default branding for ROBODYNAMICS if available
-- ------------------------------------------------------------
SET @rd_company_id = (
    SELECT company_id FROM rd_companies WHERE company_code = 'ROBODYNAMICS' LIMIT 1
);

INSERT INTO rd_company_branding (
    company_id, branding_name, logo_url, primary_color, secondary_color,
    footer_html, powered_by_label, hide_rd_header, status
)
SELECT
    @rd_company_id,
    'Robo Dynamics',
    NULL,
    '#0f766e',
    '#0b1f3a',
    NULL,
    'Powered by Robo Dynamics',
    1,
    'ACTIVE'
WHERE @rd_company_id IS NOT NULL
ON DUPLICATE KEY UPDATE
    branding_name = VALUES(branding_name),
    primary_color = VALUES(primary_color),
    secondary_color = VALUES(secondary_color),
    powered_by_label = VALUES(powered_by_label),
    hide_rd_header = VALUES(hide_rd_header),
    status = 'ACTIVE',
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO rd_company_sso_config (
    company_id, issuer, shared_secret, token_ttl_seconds, allowed_domains, status
)
SELECT
    @rd_company_id,
    'ROBODYNAMICS_PORTAL',
    'rd_default_shared_secret_change_me',
    600,
    NULL,
    'ACTIVE'
WHERE @rd_company_id IS NOT NULL
ON DUPLICATE KEY UPDATE
    issuer = VALUES(issuer),
    token_ttl_seconds = VALUES(token_ttl_seconds),
    status = 'ACTIVE',
    updated_at = CURRENT_TIMESTAMP;

SELECT 'SaaS branding + SSO migration completed.' AS status;
