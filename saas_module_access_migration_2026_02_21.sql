-- ============================================================
-- SaaS Module Access Migration
-- Date: 2026-02-21
-- Run on: robodynamics_db
-- Purpose:
--   Multi-tenant/module access foundation for individuals + schools.
-- ============================================================

USE robodynamics_db;

-- ------------------------------------------------------------
-- 1) Companies (tenant entities)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rd_companies (
    company_id BIGINT NOT NULL AUTO_INCREMENT,
    company_code VARCHAR(80) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_type VARCHAR(32) NOT NULL DEFAULT 'INDIVIDUAL',
    website_domain VARCHAR(255) NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (company_id),
    UNIQUE KEY uk_rd_companies_code (company_code),
    KEY idx_rd_companies_type (company_type),
    KEY idx_rd_companies_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 2) Module catalog
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rd_modules (
    module_id INT NOT NULL AUTO_INCREMENT,
    module_code VARCHAR(60) NOT NULL,
    module_name VARCHAR(120) NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (module_id),
    UNIQUE KEY uk_rd_modules_code (module_code),
    KEY idx_rd_modules_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO rd_modules (module_code, module_name, status)
VALUES
    ('APTIPATH', 'AptiPath', 'ACTIVE'),
    ('EXAM_PREP', 'Exam Paper / Test Prep', 'ACTIVE'),
    ('COURSE', 'Courses', 'ACTIVE')
ON DUPLICATE KEY UPDATE
    module_name = VALUES(module_name),
    status = VALUES(status),
    updated_at = CURRENT_TIMESTAMP;

-- ------------------------------------------------------------
-- 3) Company -> Module permissions (license/entitlement)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rd_company_permissions (
    company_permission_id BIGINT NOT NULL AUTO_INCREMENT,
    company_id BIGINT NOT NULL,
    module_id INT NOT NULL,
    access_status VARCHAR(24) NOT NULL DEFAULT 'ACTIVE',
    plan_code VARCHAR(80) NULL,
    seat_limit INT NULL,
    expires_at DATETIME NULL,
    settings_json JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (company_permission_id),
    UNIQUE KEY uk_rd_company_permissions_company_module (company_id, module_id),
    KEY idx_rd_company_permissions_status (access_status),
    KEY idx_rd_company_permissions_expires (expires_at),
    CONSTRAINT fk_rd_company_permissions_company
        FOREIGN KEY (company_id) REFERENCES rd_companies (company_id),
    CONSTRAINT fk_rd_company_permissions_module
        FOREIGN KEY (module_id) REFERENCES rd_modules (module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 4) User -> Company mapping
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rd_user_company_map (
    user_company_map_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    company_id BIGINT NOT NULL,
    company_role VARCHAR(40) NOT NULL DEFAULT 'MEMBER',
    status VARCHAR(24) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_company_map_id),
    UNIQUE KEY uk_rd_user_company_map_user_company (user_id, company_id),
    KEY idx_rd_user_company_map_company (company_id),
    KEY idx_rd_user_company_map_status (status),
    CONSTRAINT fk_rd_user_company_map_user
        FOREIGN KEY (user_id) REFERENCES rd_users (user_id),
    CONSTRAINT fk_rd_user_company_map_company
        FOREIGN KEY (company_id) REFERENCES rd_companies (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 5) User-level module/feature permissions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rd_user_permissions (
    user_permission_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    company_id BIGINT NULL,
    module_id INT NOT NULL,
    access_status VARCHAR(24) NOT NULL DEFAULT 'ACTIVE',
    feature_code VARCHAR(120) NULL,
    feature_access VARCHAR(24) NOT NULL DEFAULT 'ALLOW',
    settings_json JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_permission_id),
    UNIQUE KEY uk_rd_user_permissions_user_module_feature (user_id, module_id, feature_code),
    KEY idx_rd_user_permissions_company (company_id),
    KEY idx_rd_user_permissions_status (access_status),
    KEY idx_rd_user_permissions_feature (feature_code),
    CONSTRAINT fk_rd_user_permissions_user
        FOREIGN KEY (user_id) REFERENCES rd_users (user_id),
    CONSTRAINT fk_rd_user_permissions_company
        FOREIGN KEY (company_id) REFERENCES rd_companies (company_id),
    CONSTRAINT fk_rd_user_permissions_module
        FOREIGN KEY (module_id) REFERENCES rd_modules (module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT 'SaaS module access migration completed.' AS status;
