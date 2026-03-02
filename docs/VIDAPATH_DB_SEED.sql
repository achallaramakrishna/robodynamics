-- VidaPath DB tables and seed for question bank + future careers.
-- Run this on the robodynamics_db (e.g., `mysql -u root -p achalla robodynamics_db --local-infile=1 < docs/VIDAPATH_DB_SEED.sql`).

SET @@SESSION.sql_mode = 'TRADITIONAL';

CREATE TABLE IF NOT EXISTS vida_path_question_bank (
    question_id VARCHAR(64) NOT NULL PRIMARY KEY,
    section VARCHAR(128) NOT NULL,
    grade_band VARCHAR(32) NOT NULL DEFAULT 'GRADE_10',
    question_text TEXT NOT NULL,
    question_type VARCHAR(64) NOT NULL,
    is_archived TINYINT(1) NOT NULL DEFAULT 0,
    archived_at DATETIME NULL,
    content_version VARCHAR(32) NOT NULL DEFAULT 'GRADE_V2_2026_02_28',
    tags TEXT,
    adaptivity_notes TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vida_path_future_career (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    career_cluster VARCHAR(128) NOT NULL,
    career_name VARCHAR(256) NOT NULL,
    description TEXT,
    required_skills TEXT,
    projected_growth_india VARCHAR(128),
    projected_growth_global VARCHAR(128),
    relevant_grades VARCHAR(64)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM vida_path_question_bank;
DELETE FROM vida_path_future_career;

-- Adjust the paths below to wherever the CSVs are available on the prod host.
SET @question_csv = '/opt/robodynamics/docs/question_bank_career_discovery.csv';
SET @career_csv = '/opt/robodynamics/docs/future_careers.csv';

LOAD DATA LOCAL INFILE @question_csv
INTO TABLE vida_path_question_bank
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' ESCAPED BY '\\\\'
LINES TERMINATED BY '\\n'
IGNORE 1 ROWS
(section, question_id, grade_band, question_text, question_type, tags, adaptivity_notes)
SET is_archived = 0, archived_at = NULL, content_version = 'GRADE_V2_2026_02_28';

LOAD DATA LOCAL INFILE @career_csv
INTO TABLE vida_path_future_career
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' ESCAPED BY '\\\\'
LINES TERMINATED BY '\\n'
IGNORE 1 ROWS
(career_cluster, career_name, description, required_skills, projected_growth_india, projected_growth_global, relevant_grades);

SELECT 'vida_path_question_bank row count:' AS message, COUNT(*) FROM vida_path_question_bank;
SELECT 'vida_path_future_career row count:' AS message, COUNT(*) FROM vida_path_future_career;
