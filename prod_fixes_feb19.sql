-- ============================================================
-- Robodynamics Production Fix Script
-- Date: Feb 19, 2026
-- Run on: robodynamics_db
-- Description: Fixes HTTP 500 errors found during broken link audit
-- ============================================================

USE robodynamics_db;

-- ============================================================
-- FIX 1: rd_enquiries — entity mapped to wrong column names
-- The RDEnquiry.java entity was updated to match these columns:
--   parent_name, student_name, mobile, created_at, message, source
-- No schema change needed — columns already exist in DB.
-- This is a Java code fix only (RDEnquiry.java).
-- ============================================================
-- Verify columns exist (informational):
-- DESCRIBE rd_enquiries;


-- ============================================================
-- FIX 2: rd_badges — entity had 'badge_image_url' which doesn't exist
-- The RDBadge.java entity was updated to map 'points_threshold' instead.
-- No schema change needed — column already exists in DB.
-- This is a Java code fix only (RDBadge.java).
-- ============================================================
-- Verify columns exist (informational):
-- DESCRIBE rd_badges;


-- ============================================================
-- FIX 3: rd_quiz_questions — 144 rows have orphaned slide_id values
-- (slide was deleted but quiz questions still reference it)
-- Safe fix: set slide_id = NULL for orphaned references
-- ============================================================
UPDATE rd_quiz_questions qq
LEFT JOIN rd_slides s ON qq.slide_id = s.slide_id
SET qq.slide_id = NULL
WHERE qq.slide_id IS NOT NULL
  AND s.slide_id IS NULL;

-- Verify:
-- SELECT COUNT(*) FROM rd_quiz_questions WHERE slide_id IS NOT NULL AND slide_id NOT IN (SELECT slide_id FROM rd_slides);


-- ============================================================
-- FIX 4: rd_quiz_test — 2 rows have orphaned quiz_id values
-- (quiz was deleted but test still references it)
-- Safe fix: delete the orphaned quiz test rows
-- ============================================================
DELETE FROM rd_quiz_test
WHERE quiz_id NOT IN (SELECT quiz_id FROM rd_quizzes)
  AND quiz_id IS NOT NULL;

-- Verify:
-- SELECT COUNT(*) FROM rd_quiz_test qt LEFT JOIN rd_quizzes q ON qt.quiz_id = q.quiz_id WHERE q.quiz_id IS NULL;


-- ============================================================
-- FIX 5: rd_enquiries — saveEnquiry POST sets enquiry_date field
-- The controller sets theEnquiry.setEnquiryDate(new Date()) before saving.
-- Since enquiry_date is now mapped to 'created_at' (timestamp with DEFAULT),
-- we can let the DB default handle it. No schema change needed.
-- ============================================================


-- ============================================================
-- SUMMARY OF CHANGES
-- ============================================================
-- Java code changes (already applied in source):
--   1. RDEnquiry.java      - Fixed @Column mappings to match actual DB columns
--   2. RDBadge.java        - Replaced badge_image_url with points_threshold
--   3. RDGoalServiceImpl.java - Added @Transactional (was missing, caused HibernateException)
--   4. workshop-form.jsp   - Replaced <form:file> with <input type="file"> (JSP compile error)
--   5. RDResultController.java - Added null guard for quiz/rdUser (NullPointerException)
--   6. RDCompetitionDashboardController.java - Fixed doubled context path in redirectUrl
--   7. RDAdminCompetitionController.java (6 places) - Fixed doubled context path in redirectUrl
--   8. RDStudentExamController.java - Fixed doubled context path in redirectUrl
--   9. quizzes/error.jsp   - Created missing JSP (mentor login redirect target)
--  10. badges/list.jsp     - Created missing JSP for /badges route
--  11. manageTests.jsp     - Created missing JSP for /quiztest/quiz/tests route
--
-- DB changes (this script):
--   FIX 3: Cleared 144 orphaned slide_id values in rd_quiz_questions
--   FIX 4: Deleted 2 orphaned rows in rd_quiz_test
-- ============================================================

SELECT 'Production fix script completed successfully.' AS status;
