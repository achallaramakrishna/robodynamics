-- AptiPath360 content and mapping validation queries
-- Run on MySQL (8.0+ recommended)
--
-- Baseline (from current seed files in repo):
--   v3 question inserts       : 800
--   v3 career catalog inserts : 500
--   v3 career adjustments     : 103
--
-- You can change @module and @version if needed.

SET @module := 'APTIPATH';
SET @version := 'v3';
SET @from_date := '2026-02-22 00:00:00';

/* =========================================================
   0) "Newly added" rows checks by created_at
   ========================================================= */

SELECT
    module_code,
    assessment_version,
    COUNT(*) AS new_questions_since_cutoff
FROM rd_ci_question_bank
WHERE module_code = @module
  AND created_at >= @from_date
GROUP BY module_code, assessment_version
ORDER BY assessment_version;

SELECT
    module_code,
    assessment_version,
    COUNT(*) AS new_careers_since_cutoff
FROM rd_ci_career_catalog
WHERE module_code = @module
  AND created_at >= @from_date
GROUP BY module_code, assessment_version
ORDER BY assessment_version;

/* =========================================================
   1) Question bank checks (rd_ci_question_bank)
   ========================================================= */

-- 1.1 Active questions by version
SELECT
    module_code,
    assessment_version,
    COUNT(*) AS active_questions,
    COUNT(DISTINCT section_code) AS distinct_sections,
    COUNT(DISTINCT question_type) AS distinct_question_types
FROM rd_ci_question_bank
WHERE module_code = @module
  AND status = 'ACTIVE'
GROUP BY module_code, assessment_version
ORDER BY assessment_version;

-- 1.2 Section distribution for selected version
SELECT
    section_code,
    COUNT(*) AS question_count
FROM rd_ci_question_bank
WHERE module_code = @module
  AND assessment_version = @version
  AND status = 'ACTIVE'
GROUP BY section_code
ORDER BY question_count DESC, section_code;

-- 1.3 Question type distribution (should not be only one type for production quality)
SELECT
    question_type,
    COUNT(*) AS question_count
FROM rd_ci_question_bank
WHERE module_code = @module
  AND assessment_version = @version
  AND status = 'ACTIVE'
GROUP BY question_type
ORDER BY question_count DESC, question_type;

-- 1.4 Required section minimums (based on controller stage rules)
SELECT
    section_code,
    COUNT(*) AS available_questions,
    CASE
      WHEN section_code = 'CORE_APTITUDE'      AND COUNT(*) >= 14 THEN 'OK'
      WHEN section_code = 'APPLIED_CHALLENGE'  AND COUNT(*) >= 10 THEN 'OK'
      WHEN section_code = 'INTEREST_WORK'      AND COUNT(*) >= 6  THEN 'OK'
      WHEN section_code = 'VALUES_MOTIVATION'  AND COUNT(*) >= 5  THEN 'OK'
      WHEN section_code = 'LEARNING_BEHAVIOR'  AND COUNT(*) >= 5  THEN 'OK'
      WHEN section_code = 'AI_READINESS'       AND COUNT(*) >= 6  THEN 'OK'
      WHEN section_code = 'CAREER_REALITY'     AND COUNT(*) >= 5  THEN 'OK'
      WHEN section_code = 'STEM_FOUNDATION'    AND COUNT(*) >= 8  THEN 'OK'
      WHEN section_code = 'BIOLOGY_FOUNDATION' AND COUNT(*) >= 5  THEN 'OK'
      WHEN section_code = 'GENERAL_AWARENESS'  AND COUNT(*) >= 4  THEN 'OK'
      WHEN section_code = 'REASONING_IQ'       AND COUNT(*) >= 4  THEN 'OK'
      ELSE 'CHECK'
    END AS post12_coverage_status
FROM rd_ci_question_bank
WHERE module_code = @module
  AND assessment_version = @version
  AND status = 'ACTIVE'
GROUP BY section_code
ORDER BY section_code;

-- 1.5 Stage keyword coverage in question text/code (used by filtering logic)
SELECT stage, matched_questions,
       CASE WHEN matched_questions > 0 THEN 'OK' ELSE 'MISSING' END AS status
FROM (
    SELECT 'FOUNDATION_8_9' AS stage, COUNT(*) AS matched_questions
    FROM rd_ci_question_bank
    WHERE module_code = @module
      AND assessment_version = @version
      AND status = 'ACTIVE'
      AND UPPER(CONCAT(COALESCE(question_code, ''), ' ', COALESCE(question_text, '')))
          REGEXP 'GRADE 8|GRADE 9|FOUNDATION|SCHOOL LEVEL|BASIC'
    UNION ALL
    SELECT 'SECONDARY_10_12' AS stage, COUNT(*) AS matched_questions
    FROM rd_ci_question_bank
    WHERE module_code = @module
      AND assessment_version = @version
      AND status = 'ACTIVE'
      AND UPPER(CONCAT(COALESCE(question_code, ''), ' ', COALESCE(question_text, '')))
          REGEXP 'GRADE 10|GRADE 11|GRADE 12|BOARD|JEE|NEET'
    UNION ALL
    SELECT 'POST12_COLLEGE' AS stage, COUNT(*) AS matched_questions
    FROM rd_ci_question_bank
    WHERE module_code = @module
      AND assessment_version = @version
      AND status = 'ACTIVE'
      AND UPPER(CONCAT(COALESCE(question_code, ''), ' ', COALESCE(question_text, '')))
          REGEXP 'COLLEGE|UNDERGRAD|UG|PG|SEMESTER|INTERNSHIP|PLACEMENT|BTECH|B\\.E|MTECH|BARCH|BBA|MBA|LLB|MBBS'
) t
ORDER BY stage;

-- 1.6 Program-track keyword coverage in question text/code
SELECT track, matched_questions,
       CASE WHEN matched_questions > 0 THEN 'OK' ELSE 'MISSING' END AS status
FROM (
    SELECT 'TECH_TRACK' AS track, COUNT(*) AS matched_questions
    FROM rd_ci_question_bank
    WHERE module_code = @module AND assessment_version = @version AND status = 'ACTIVE'
      AND UPPER(CONCAT(COALESCE(question_code, ''), ' ', COALESCE(question_text, '')))
          REGEXP 'ENGINEERING|TECH|AI|CODING|PROGRAMMING|ALGORITHM|DATA|ROBOT|ELECTRONIC|SOFTWARE|HARDWARE'
    UNION ALL
    SELECT 'MEDICAL_TRACK' AS track, COUNT(*) AS matched_questions
    FROM rd_ci_question_bank
    WHERE module_code = @module AND assessment_version = @version AND status = 'ACTIVE'
      AND UPPER(CONCAT(COALESCE(question_code, ''), ' ', COALESCE(question_text, '')))
          REGEXP 'MEDICAL|BIOLOGY|HEALTH|CLINICAL|LIFE SCIENCE|ANATOMY|PHYSIOLOGY|PATIENT|PHARMA|NEET'
    UNION ALL
    SELECT 'COMMERCE_TRACK' AS track, COUNT(*) AS matched_questions
    FROM rd_ci_question_bank
    WHERE module_code = @module AND assessment_version = @version AND status = 'ACTIVE'
      AND UPPER(CONCAT(COALESCE(question_code, ''), ' ', COALESCE(question_text, '')))
          REGEXP 'BUSINESS|FINANCE|COMMERCE|MANAGEMENT|CAT|MARKET|ACCOUNT|BANK|INVEST|OPERATIONS'
    UNION ALL
    SELECT 'LAW_POLICY_TRACK' AS track, COUNT(*) AS matched_questions
    FROM rd_ci_question_bank
    WHERE module_code = @module AND assessment_version = @version AND status = 'ACTIVE'
      AND UPPER(CONCAT(COALESCE(question_code, ''), ' ', COALESCE(question_text, '')))
          REGEXP 'LAW|LEGAL|CLAT|POLICY|GOVERNANCE|CONSTITUTION|HUMANITIES|COMMUNICATION'
    UNION ALL
    SELECT 'DESIGN_CREATIVE_TRACK' AS track, COUNT(*) AS matched_questions
    FROM rd_ci_question_bank
    WHERE module_code = @module AND assessment_version = @version AND status = 'ACTIVE'
      AND UPPER(CONCAT(COALESCE(question_code, ''), ' ', COALESCE(question_text, '')))
          REGEXP 'DESIGN|CREATIVE|UX|UI|VISUAL|MEDIA|PRODUCT|ARCHITECTURE|PORTFOLIO'
    UNION ALL
    SELECT 'SCIENCE_RESEARCH_TRACK' AS track, COUNT(*) AS matched_questions
    FROM rd_ci_question_bank
    WHERE module_code = @module AND assessment_version = @version AND status = 'ACTIVE'
      AND UPPER(CONCAT(COALESCE(question_code, ''), ' ', COALESCE(question_text, '')))
          REGEXP 'RESEARCH|SCIENTIFIC|LAB|EXPERIMENT|STATISTICS|ENVIRONMENT|AGRICULTURE|CHEMISTRY|PHYSICS'
    UNION ALL
    SELECT 'SERVICE_TRACK' AS track, COUNT(*) AS matched_questions
    FROM rd_ci_question_bank
    WHERE module_code = @module AND assessment_version = @version AND status = 'ACTIVE'
      AND UPPER(CONCAT(COALESCE(question_code, ''), ' ', COALESCE(question_text, '')))
          REGEXP 'HOSPITALITY|CUSTOMER|AVIATION|MARITIME|TRAVEL|TEAM|LEADERSHIP|SERVICE'
) t
ORDER BY track;

-- 1.7 Data quality checks (duplicates + null/blank fields)
SELECT question_code, COUNT(*) AS duplicate_count
FROM rd_ci_question_bank
WHERE module_code = @module
  AND assessment_version = @version
GROUP BY question_code
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, question_code;

SELECT
    SUM(CASE WHEN section_code IS NULL OR TRIM(section_code) = '' THEN 1 ELSE 0 END) AS missing_section_code,
    SUM(CASE WHEN question_text IS NULL OR TRIM(question_text) = '' THEN 1 ELSE 0 END) AS missing_question_text,
    SUM(CASE WHEN question_type IS NULL OR TRIM(question_type) = '' THEN 1 ELSE 0 END) AS missing_question_type,
    SUM(CASE WHEN options_json IS NULL OR TRIM(options_json) = '' THEN 1 ELSE 0 END) AS missing_options_json
FROM rd_ci_question_bank
WHERE module_code = @module
  AND assessment_version = @version
  AND status = 'ACTIVE';

/* =========================================================
   2) Career catalog checks (rd_ci_career_catalog)
   ========================================================= */

-- 2.1 Active careers by version
SELECT
    module_code,
    assessment_version,
    COUNT(*) AS active_careers,
    COUNT(DISTINCT cluster_name) AS distinct_clusters,
    COUNT(DISTINCT target_phase) AS distinct_target_phases
FROM rd_ci_career_catalog
WHERE module_code = @module
  AND status = 'ACTIVE'
GROUP BY module_code, assessment_version
ORDER BY assessment_version;

-- 2.2 Cluster distribution for selected version
SELECT
    cluster_name,
    COUNT(*) AS career_count
FROM rd_ci_career_catalog
WHERE module_code = @module
  AND assessment_version = @version
  AND status = 'ACTIVE'
GROUP BY cluster_name
ORDER BY career_count DESC, cluster_name;

-- 2.3 Target-phase distribution (FOUNDATION / SECONDARY / POST12 checks)
SELECT
    COALESCE(NULLIF(TRIM(target_phase), ''), 'BLANK') AS target_phase,
    COUNT(*) AS career_count
FROM rd_ci_career_catalog
WHERE module_code = @module
  AND assessment_version = @version
  AND status = 'ACTIVE'
GROUP BY COALESCE(NULLIF(TRIM(target_phase), ''), 'BLANK')
ORDER BY career_count DESC, target_phase;

-- 2.4 "Primary 65 careers first" coverage
SELECT
    SUM(CASE WHEN CAST(SUBSTRING_INDEX(career_code, '_', -1) AS UNSIGNED) BETWEEN 1 AND 65 THEN 1 ELSE 0 END) AS primary_65_present,
    SUM(CASE WHEN CAST(SUBSTRING_INDEX(career_code, '_', -1) AS UNSIGNED) > 65 THEN 1 ELSE 0 END) AS beyond_65_present,
    COUNT(*) AS total_active_careers
FROM rd_ci_career_catalog
WHERE module_code = @module
  AND assessment_version = @version
  AND status = 'ACTIVE';

-- 2.5 Data quality checks (duplicates + null/blank fields)
SELECT career_code, COUNT(*) AS duplicate_count
FROM rd_ci_career_catalog
WHERE module_code = @module
  AND assessment_version = @version
GROUP BY career_code
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, career_code;

SELECT
    SUM(CASE WHEN career_name IS NULL OR TRIM(career_name) = '' THEN 1 ELSE 0 END) AS missing_career_name,
    SUM(CASE WHEN cluster_name IS NULL OR TRIM(cluster_name) = '' THEN 1 ELSE 0 END) AS missing_cluster_name,
    SUM(CASE WHEN target_phase IS NULL OR TRIM(target_phase) = '' THEN 1 ELSE 0 END) AS missing_target_phase,
    SUM(CASE WHEN required_subjects_csv IS NULL OR TRIM(required_subjects_csv) = '' THEN 1 ELSE 0 END) AS missing_required_subjects
FROM rd_ci_career_catalog
WHERE module_code = @module
  AND assessment_version = @version
  AND status = 'ACTIVE';

/* =========================================================
   3) Career adjustment and mapping integrity
   ========================================================= */

-- 3.1 Adjustment distribution
SELECT
    signal_type,
    signal_band,
    COUNT(*) AS adjustment_count
FROM rd_ci_career_adjustment
WHERE module_code = @module
  AND assessment_version = @version
  AND status = 'ACTIVE'
GROUP BY signal_type, signal_band
ORDER BY signal_type, signal_band;

-- 3.2 Orphan adjustments (cluster in adjustment but not in catalog)
SELECT
    a.cluster_name,
    COUNT(*) AS orphan_adjustment_rows
FROM rd_ci_career_adjustment a
LEFT JOIN rd_ci_career_catalog c
       ON c.module_code = a.module_code
      AND c.assessment_version = a.assessment_version
      AND c.cluster_name = a.cluster_name
      AND c.status = 'ACTIVE'
WHERE a.module_code = @module
  AND a.assessment_version = @version
  AND a.status = 'ACTIVE'
  AND c.ci_career_catalog_id IS NULL
GROUP BY a.cluster_name
ORDER BY orphan_adjustment_rows DESC, a.cluster_name;

-- 3.3 Clusters with no active adjustments
SELECT
    c.cluster_name,
    COUNT(*) AS active_career_rows
FROM rd_ci_career_catalog c
LEFT JOIN rd_ci_career_adjustment a
       ON a.module_code = c.module_code
      AND a.assessment_version = c.assessment_version
      AND a.cluster_name = c.cluster_name
      AND a.status = 'ACTIVE'
WHERE c.module_code = @module
  AND c.assessment_version = @version
  AND c.status = 'ACTIVE'
  AND a.ci_career_adjustment_id IS NULL
GROUP BY c.cluster_name
ORDER BY active_career_rows DESC, c.cluster_name;

/* =========================================================
   4) Runtime integrity checks (responses and snapshots)
   ========================================================= */

-- 4.1 Assessment responses pointing to missing question codes
SELECT
    COUNT(*) AS orphan_assessment_responses
FROM rd_ci_assessment_response r
LEFT JOIN rd_ci_question_bank q
       ON q.question_code = r.question_code
      AND q.module_code = @module
      AND q.assessment_version = @version
WHERE q.ci_question_id IS NULL;

-- 4.2 Intake profile completeness for academic context fields
SELECT
    question_code,
    COUNT(*) AS response_rows
FROM rd_ci_intake_response
WHERE question_code IN (
    'S_CURR_SCHOOL_01',
    'S_CURR_GRADE_01',
    'S_CURR_BOARD_01',
    'S_CURR_STREAM_01',
    'S_CURR_SUBJECTS_01',
    'S_CURR_PROGRAM_01',
    'S_CURR_YEARS_LEFT_01'
)
GROUP BY question_code
ORDER BY question_code;

-- 4.3 Recommendation snapshot volume by recommendation version
SELECT
    recommendation_version,
    COUNT(*) AS snapshot_count
FROM rd_ci_recommendation_snapshot
GROUP BY recommendation_version
ORDER BY snapshot_count DESC, recommendation_version;

/* =========================================================
   5) Legacy table checks (if still used in your environment)
   ========================================================= */

SELECT
    COUNT(*) AS legacy_question_count
FROM vida_path_question_bank;

SELECT
    COUNT(*) AS legacy_career_count
FROM vida_path_future_career;
