-- AptiPath question bank inspection helpers
-- Run on: robodynamics_db

USE robodynamics_db;

-- 1) Version-wise coverage
SELECT assessment_version,
       COUNT(*) AS question_count
FROM rd_ci_question_bank
WHERE module_code = 'APTIPATH'
GROUP BY assessment_version
ORDER BY assessment_version;

-- 2) Human-readable options JSON
SELECT ci_question_id,
       module_code,
       assessment_version,
       question_code,
       section_code,
       sequence_no,
       question_type,
       question_text,
       JSON_PRETTY(options_json) AS options_pretty,
       correct_option,
       weightage,
       status,
       created_at,
       updated_at
FROM rd_ci_question_bank
WHERE module_code = 'APTIPATH'
ORDER BY assessment_version, sequence_no;

-- 3) Reusable readable view for admin/reporting
CREATE OR REPLACE VIEW rd_ci_question_bank_readable_v AS
SELECT ci_question_id,
       module_code,
       assessment_version,
       question_code,
       section_code,
       sequence_no,
       question_type,
       question_text,
       JSON_PRETTY(options_json) AS options_pretty,
       correct_option,
       weightage,
       status,
       created_at,
       updated_at
FROM rd_ci_question_bank
WHERE module_code = 'APTIPATH';

