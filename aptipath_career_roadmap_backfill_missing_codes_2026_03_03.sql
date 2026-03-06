USE robodynamics_db;

START TRANSACTION;

SET @module_code := 'APTIPATH';
SET @assessment_version := 'v3';

DROP TEMPORARY TABLE IF EXISTS tmp_missing_roadmap_codes;
CREATE TEMPORARY TABLE tmp_missing_roadmap_codes AS
SELECT
    c.module_code,
    c.assessment_version,
    c.career_code,
    c.career_name,
    c.cluster_name,
    c.required_subjects_csv,
    c.entrance_exams_csv,
    c.pathway_hint,
    c.exam_hint,
    c.prerequisite_summary,
    c.sort_order,
    TRIM(BOTH '_' FROM REGEXP_REPLACE(UPPER(c.career_name), '[^A-Z0-9]+', '_')) AS name_normalized_code
FROM rd_ci_career_catalog c
LEFT JOIN rd_ci_career_roadmap r
       ON r.module_code = c.module_code
      AND r.assessment_version = c.assessment_version
      AND r.career_code = c.career_code
      AND r.plan_tier = 'BASIC'
      AND r.grade_stage = 'ANY'
      AND r.status = 'ACTIVE'
WHERE c.module_code = @module_code
  AND c.assessment_version = @assessment_version
  AND c.status = 'ACTIVE'
  AND r.ci_career_roadmap_id IS NULL;

SELECT COUNT(*) AS missing_career_codes_before_backfill
FROM tmp_missing_roadmap_codes;

INSERT INTO rd_ci_career_roadmap
  (module_code, assessment_version, career_code, plan_tier, grade_stage,
   section_type, item_order, title, detail_text, status, created_at, updated_at)
SELECT
    m.module_code,
    m.assessment_version,
    m.career_code,
    'BASIC',
    'ANY',
    t.section_type,
    t.item_order,
    t.title,
    t.detail_text,
    'ACTIVE',
    NOW(),
    NOW()
FROM tmp_missing_roadmap_codes m
JOIN rd_ci_career_roadmap t
  ON t.module_code = m.module_code
 AND t.assessment_version = m.assessment_version
 AND t.career_code = m.name_normalized_code
 AND t.plan_tier = 'BASIC'
 AND t.grade_stage = 'ANY'
 AND t.status = 'ACTIVE'
LEFT JOIN rd_ci_career_roadmap ex
  ON ex.module_code = m.module_code
 AND ex.assessment_version = m.assessment_version
 AND ex.career_code = m.career_code
 AND ex.plan_tier = 'BASIC'
 AND ex.grade_stage = 'ANY'
 AND ex.section_type = t.section_type
 AND ex.item_order = t.item_order
WHERE ex.ci_career_roadmap_id IS NULL;

SET @rows_inserted_from_existing_templates := ROW_COUNT();

INSERT INTO rd_ci_career_roadmap
  (module_code, assessment_version, career_code, plan_tier, grade_stage,
   section_type, item_order, title, detail_text, status, created_at, updated_at)
SELECT
    m.module_code,
    m.assessment_version,
    m.career_code,
    'BASIC',
    'ANY',
    sec.section_type,
    sec.item_order,
    sec.title,
    CASE
      WHEN sec.section_type = 'OVERVIEW' THEN CONCAT(
        m.career_name, ' is a high-potential pathway in ', m.cluster_name,
        '. This Basic roadmap gives a clear direction for students and parents.'
      )
      WHEN sec.section_type = 'RELEVANCE' THEN CONCAT(
        '2026-2036 relevance: ', m.career_name,
        ' is expected to remain relevant as opportunities expand in ', m.cluster_name, '.'
      )
      WHEN sec.section_type = 'SALARY' THEN
        'Starting salary varies by location, institute quality, and skill depth. Typical entry range in India: INR 4-18 LPA.'
      WHEN sec.section_type = 'PHASE' AND sec.item_order = 1 THEN CONCAT(
        'Build strong fundamentals in ',
        IFNULL(NULLIF(m.required_subjects_csv, ''), 'core subjects'),
        '; strengthen communication and problem-solving habits.'
      )
      WHEN sec.section_type = 'PHASE' AND sec.item_order = 2 THEN CONCAT(
        'Choose stream and subjects aligned to this pathway. ',
        IFNULL(NULLIF(m.prerequisite_summary, ''), 'Build exam discipline with weekly revision and mocks.')
      )
      WHEN sec.section_type = 'PHASE' AND sec.item_order = 3 THEN CONCAT(
        'Pursue relevant post-12 programs and shortlist colleges by fit, outcomes, and affordability. ',
        IFNULL(NULLIF(m.exam_hint, ''), '')
      )
      WHEN sec.section_type = 'PHASE' AND sec.item_order = 4 THEN CONCAT(
        'Build portfolio proof through projects, certifications, and internships. ',
        IFNULL(NULLIF(m.pathway_hint, ''), '')
      )
      WHEN sec.section_type = 'PHASE' AND sec.item_order = 5 THEN
        'Target entry roles, improve interview readiness, and continue structured upskilling with mentor feedback.'
      WHEN sec.section_type = 'UPGRADE' THEN CONCAT(
        'In Pro (INR 1299), unlock grade-specific, board-specific, and exam-specific action plans for ',
        m.career_name, '.'
      )
      ELSE ''
    END AS detail_text,
    'ACTIVE',
    NOW(),
    NOW()
FROM tmp_missing_roadmap_codes m
JOIN (
    SELECT 'OVERVIEW' AS section_type, 1 AS item_order, 'Career Overview' AS title
    UNION ALL SELECT 'RELEVANCE', 1, '2026-2036 Relevance'
    UNION ALL SELECT 'SALARY', 1, 'Starting Salary Band'
    UNION ALL SELECT 'PHASE', 1, 'Foundation (Grades 8-10)'
    UNION ALL SELECT 'PHASE', 2, 'Preparation (Grades 11-12)'
    UNION ALL SELECT 'PHASE', 3, 'Higher Education (Post-12)'
    UNION ALL SELECT 'PHASE', 4, 'Skill Building and Experience'
    UNION ALL SELECT 'PHASE', 5, 'Career Launch (2034-2036)'
    UNION ALL SELECT 'UPGRADE', 1, 'Upgrade to Pro'
) sec
LEFT JOIN rd_ci_career_roadmap ex
  ON ex.module_code = m.module_code
 AND ex.assessment_version = m.assessment_version
 AND ex.career_code = m.career_code
 AND ex.plan_tier = 'BASIC'
 AND ex.grade_stage = 'ANY'
 AND ex.section_type = sec.section_type
 AND ex.item_order = sec.item_order
WHERE ex.ci_career_roadmap_id IS NULL;

SET @rows_inserted_from_fallback_templates := ROW_COUNT();

SELECT
    @rows_inserted_from_existing_templates AS rows_inserted_from_existing_templates,
    @rows_inserted_from_fallback_templates AS rows_inserted_from_fallback_templates;

SELECT
    COUNT(DISTINCT c.career_code) AS active_career_codes,
    COUNT(DISTINCT r.career_code) AS basic_roadmap_codes_after_backfill
FROM rd_ci_career_catalog c
LEFT JOIN rd_ci_career_roadmap r
       ON r.module_code = c.module_code
      AND r.assessment_version = c.assessment_version
      AND r.career_code = c.career_code
      AND r.plan_tier = 'BASIC'
      AND r.grade_stage = 'ANY'
      AND r.status = 'ACTIVE'
WHERE c.module_code = @module_code
  AND c.assessment_version = @assessment_version
  AND c.status = 'ACTIVE';

SELECT
    c.career_code,
    c.career_name
FROM rd_ci_career_catalog c
LEFT JOIN rd_ci_career_roadmap r
       ON r.module_code = c.module_code
      AND r.assessment_version = c.assessment_version
      AND r.career_code = c.career_code
      AND r.plan_tier = 'BASIC'
      AND r.grade_stage = 'ANY'
      AND r.status = 'ACTIVE'
WHERE c.module_code = @module_code
  AND c.assessment_version = @assessment_version
  AND c.status = 'ACTIVE'
  AND r.ci_career_roadmap_id IS NULL
ORDER BY c.sort_order, c.career_code;

COMMIT;
