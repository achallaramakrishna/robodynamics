-- VidaPath grade-based question refresh (2026-02-28)
-- Usage (on server): mysql -uroot -p'***' --local-infile=1 robodynamics_db < /tmp/VIDAPATH_GRADE_BASED_REFRESH_2026_02_28.sql

START TRANSACTION;

SET @add_grade_band := (
    SELECT IF(
        EXISTS(
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = DATABASE()
              AND table_name = 'vida_path_question_bank'
              AND column_name = 'grade_band'
        ),
        'SELECT 1',
        'ALTER TABLE vida_path_question_bank ADD COLUMN grade_band VARCHAR(32) NOT NULL DEFAULT ''GRADE_10'' AFTER question_id'
    )
);
PREPARE stmt FROM @add_grade_band;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_is_archived := (
    SELECT IF(
        EXISTS(
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = DATABASE()
              AND table_name = 'vida_path_question_bank'
              AND column_name = 'is_archived'
        ),
        'SELECT 1',
        'ALTER TABLE vida_path_question_bank ADD COLUMN is_archived TINYINT(1) NOT NULL DEFAULT 0 AFTER question_type'
    )
);
PREPARE stmt FROM @add_is_archived;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_archived_at := (
    SELECT IF(
        EXISTS(
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = DATABASE()
              AND table_name = 'vida_path_question_bank'
              AND column_name = 'archived_at'
        ),
        'SELECT 1',
        'ALTER TABLE vida_path_question_bank ADD COLUMN archived_at DATETIME NULL AFTER is_archived'
    )
);
PREPARE stmt FROM @add_archived_at;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_content_version := (
    SELECT IF(
        EXISTS(
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = DATABASE()
              AND table_name = 'vida_path_question_bank'
              AND column_name = 'content_version'
        ),
        'SELECT 1',
        'ALTER TABLE vida_path_question_bank ADD COLUMN content_version VARCHAR(32) NOT NULL DEFAULT ''LEGACY_V1'' AFTER archived_at'
    )
);
PREPARE stmt FROM @add_content_version;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS vida_path_question_bank_archive (
    archive_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    question_id VARCHAR(64) NOT NULL,
    section VARCHAR(128) NOT NULL,
    grade_band VARCHAR(32) NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(64) NOT NULL,
    tags TEXT,
    adaptivity_notes TEXT,
    is_archived TINYINT(1) NOT NULL,
    archived_at DATETIME NULL,
    content_version VARCHAR(32) NOT NULL,
    archive_note VARCHAR(128) NOT NULL,
    archived_on DATETIME NOT NULL,
    KEY idx_vpq_archive_qid (question_id),
    KEY idx_vpq_archive_on (archived_on)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO vida_path_question_bank_archive (
    question_id, section, grade_band, question_text, question_type, tags, adaptivity_notes,
    is_archived, archived_at, content_version, archive_note, archived_on
)
SELECT
    question_id,
    section,
    COALESCE(NULLIF(grade_band, ''), 'GRADE_10'),
    question_text,
    question_type,
    tags,
    adaptivity_notes,
    is_archived,
    archived_at,
    COALESCE(NULLIF(content_version, ''), 'LEGACY_V1'),
    'pre_grade_refresh_2026_02_28',
    NOW()
FROM vida_path_question_bank
WHERE is_archived = 0;

UPDATE vida_path_question_bank
SET
    grade_band = COALESCE(NULLIF(grade_band, ''), 'GRADE_10'),
    is_archived = 1,
    archived_at = NOW(),
    content_version = COALESCE(NULLIF(content_version, ''), 'LEGACY_V1')
WHERE is_archived = 0;

LOAD DATA INFILE '/var/lib/mysql-files/question_bank_career_discovery.csv'
INTO TABLE vida_path_question_bank
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' ESCAPED BY '\\'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(section, question_id, grade_band, question_text, question_type, tags, @adaptivity_notes)
SET
    adaptivity_notes = NULLIF(TRIM(TRAILING '\r' FROM @adaptivity_notes), ''),
    is_archived = 0,
    archived_at = NULL,
    content_version = 'GRADE_V2_2026_02_28';

CREATE TABLE IF NOT EXISTS vida_path_future_career_archive (
    archive_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    career_cluster VARCHAR(128) NOT NULL,
    career_name VARCHAR(256) NOT NULL,
    description TEXT,
    required_skills TEXT,
    projected_growth_india VARCHAR(128),
    projected_growth_global VARCHAR(128),
    relevant_grades VARCHAR(64),
    archive_note VARCHAR(128) NOT NULL,
    archived_on DATETIME NOT NULL,
    KEY idx_vfc_archive_on (archived_on)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO vida_path_future_career_archive (
    career_cluster, career_name, description, required_skills,
    projected_growth_india, projected_growth_global, relevant_grades,
    archive_note, archived_on
)
SELECT
    career_cluster, career_name, description, required_skills,
    projected_growth_india, projected_growth_global, relevant_grades,
    'pre_refresh_2026_02_28',
    NOW()
FROM vida_path_future_career;

TRUNCATE TABLE vida_path_future_career;

LOAD DATA INFILE '/var/lib/mysql-files/future_careers.csv'
INTO TABLE vida_path_future_career
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' ESCAPED BY '\\'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(career_cluster, career_name, description, required_skills, projected_growth_india, projected_growth_global, @relevant_grades)
SET relevant_grades = NULLIF(TRIM(TRAILING '\r' FROM @relevant_grades), '');

COMMIT;

SELECT 'ACTIVE_QUESTIONS' AS metric, COUNT(*) AS value FROM vida_path_question_bank WHERE is_archived = 0;
SELECT 'ARCHIVED_QUESTIONS' AS metric, COUNT(*) AS value FROM vida_path_question_bank WHERE is_archived = 1;
SELECT 'FUTURE_CAREERS' AS metric, COUNT(*) AS value FROM vida_path_future_career;
SELECT grade_band, section, COUNT(*) AS question_count
FROM vida_path_question_bank
WHERE is_archived = 0
GROUP BY grade_band, section
ORDER BY grade_band, section;
