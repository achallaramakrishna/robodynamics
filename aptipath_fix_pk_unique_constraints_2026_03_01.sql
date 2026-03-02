-- ============================================================
-- AptiPath: Fix Primary Keys & Add Missing Unique Constraints
-- Date: 2026-03-01
--
-- Fixes:
--   1) rd_ci_skill_dimension: Add auto-increment surrogate PK,
--      keep skill_code as UNIQUE business key
--   2) rd_ci_question_edge: Add UNIQUE constraint
--   3) rd_ci_response_evidence: Add UNIQUE constraint
--   4) rd_ci_skill_score_snapshot: Add UNIQUE constraint
-- ============================================================

USE robodynamics_db;
START TRANSACTION;

-- ============================================================
-- 1) rd_ci_skill_dimension
--    Currently uses skill_code (VARCHAR) as PK, no auto-increment.
--    Add a BIGINT AUTO_INCREMENT surrogate PK and keep skill_code
--    as a UNIQUE business key.
-- ============================================================

-- Check if the table needs migration (still has VARCHAR PK)
-- We do this safely: add column if not exists, then swap PK

-- Step 1a: Add surrogate PK column if it doesn't exist
SET @col_exists = (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'rd_ci_skill_dimension'
      AND column_name = 'ci_skill_dimension_id'
);
SET @sql_add_col = IF(
    @col_exists = 0,
    'ALTER TABLE rd_ci_skill_dimension
       ADD COLUMN ci_skill_dimension_id BIGINT NOT NULL AUTO_INCREMENT FIRST,
       DROP PRIMARY KEY,
       ADD PRIMARY KEY (ci_skill_dimension_id),
       ADD UNIQUE KEY uk_skill_dimension_code (skill_code)',
    'SELECT ''rd_ci_skill_dimension already has surrogate PK'' AS status'
);
PREPARE stmt FROM @sql_add_col;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


-- ============================================================
-- 2) rd_ci_question_edge
--    Has AUTO_INCREMENT PK but no UNIQUE constraint.
--    Add unique on (from_question_code, outcome_bucket, to_question_code)
-- ============================================================

SET @uk_exists = (
    SELECT COUNT(*)
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'rd_ci_question_edge'
      AND index_name = 'uk_question_edge_from_outcome_to'
);
SET @sql_uk = IF(
    @uk_exists = 0,
    'ALTER TABLE rd_ci_question_edge
       ADD UNIQUE KEY uk_question_edge_from_outcome_to (from_question_code, outcome_bucket, to_question_code)',
    'SELECT ''rd_ci_question_edge UNIQUE already exists'' AS status'
);
PREPARE stmt FROM @sql_uk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


-- ============================================================
-- 3) rd_ci_response_evidence
--    Has AUTO_INCREMENT PK but no UNIQUE constraint.
--    Add unique on (ci_assessment_response_id, evidence_type)
-- ============================================================

SET @uk_exists = (
    SELECT COUNT(*)
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'rd_ci_response_evidence'
      AND index_name = 'uk_response_evidence_resp_type'
);
SET @sql_uk = IF(
    @uk_exists = 0,
    'ALTER TABLE rd_ci_response_evidence
       ADD UNIQUE KEY uk_response_evidence_resp_type (ci_assessment_response_id, evidence_type)',
    'SELECT ''rd_ci_response_evidence UNIQUE already exists'' AS status'
);
PREPARE stmt FROM @sql_uk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


-- ============================================================
-- 4) rd_ci_skill_score_snapshot
--    Has AUTO_INCREMENT PK but no UNIQUE constraint.
--    Add unique on (ci_assessment_session_id, skill_code, scoring_version)
-- ============================================================

SET @uk_exists = (
    SELECT COUNT(*)
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'rd_ci_skill_score_snapshot'
      AND index_name = 'uk_skill_score_session_skill_ver'
);
SET @sql_uk = IF(
    @uk_exists = 0,
    'ALTER TABLE rd_ci_skill_score_snapshot
       ADD UNIQUE KEY uk_skill_score_session_skill_ver (ci_assessment_session_id, skill_code, scoring_version)',
    'SELECT ''rd_ci_skill_score_snapshot UNIQUE already exists'' AS status'
);
PREPARE stmt FROM @sql_uk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


-- ============================================================
-- Verification: Show all tables with their PK and UNIQUE keys
-- ============================================================

SELECT
    t.TABLE_NAME,
    GROUP_CONCAT(
        DISTINCT CASE WHEN s.INDEX_NAME = 'PRIMARY'
            THEN CONCAT('PK(', s.COLUMN_NAME, ')')
        END
        ORDER BY s.SEQ_IN_INDEX
        SEPARATOR ', '
    ) AS primary_key,
    GROUP_CONCAT(
        DISTINCT CASE WHEN s.NON_UNIQUE = 0 AND s.INDEX_NAME != 'PRIMARY'
            THEN CONCAT(s.INDEX_NAME, '(', s.COLUMN_NAME, ')')
        END
        SEPARATOR ', '
    ) AS unique_keys
FROM information_schema.TABLES t
LEFT JOIN information_schema.STATISTICS s
    ON t.TABLE_SCHEMA = s.TABLE_SCHEMA
   AND t.TABLE_NAME = s.TABLE_NAME
WHERE t.TABLE_SCHEMA = DATABASE()
  AND t.TABLE_NAME LIKE 'rd_ci_%'
GROUP BY t.TABLE_NAME
ORDER BY t.TABLE_NAME;

COMMIT;

SELECT 'AptiPath PK & UNIQUE constraint fixes completed successfully.' AS status;
