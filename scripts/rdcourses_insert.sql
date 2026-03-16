INSERT INTO rd_courses (course_name, course_type, course_description, shortDescription, grade_range, category, is_active, is_featured, course_status)
SELECT * FROM (SELECT
  'MindSutra Grade 4 Vedic Math','AI_TUTOR',
  'CBSE Grade 4 Vedic Math AI Tutor - complements, tables 11-19, doubling, near-100, criss-cross multiplication',
  'Grade 4 Vedic Math with AI tutor - mental math shortcuts for 9-10 year olds',
  '4','Mathematics',1,0,'active') t
WHERE NOT EXISTS (SELECT 1 FROM rd_courses WHERE course_name='MindSutra Grade 4 Vedic Math');

INSERT INTO rd_courses (course_name, course_type, course_description, shortDescription, grade_range, category, is_active, is_featured, course_status)
SELECT * FROM (SELECT
  'MindSutra Grade 5 Vedic Math','AI_TUTOR',
  'CBSE Grade 5 Vedic Math AI Tutor - Nikhilam 3-digit, criss-cross, fractions, decimals, flag division',
  'Grade 5 Vedic Math with AI tutor - advanced mental math for 10-11 year olds',
  '5','Mathematics',1,0,'active') t
WHERE NOT EXISTS (SELECT 1 FROM rd_courses WHERE course_name='MindSutra Grade 5 Vedic Math');

INSERT INTO rd_courses (course_name, course_type, course_description, shortDescription, grade_range, category, is_active, is_featured, course_status)
SELECT * FROM (SELECT
  'MindSutra Grade 6 Vedic Math','AI_TUTOR',
  'CBSE Grade 6 Vedic Math AI Tutor - vinculum, integers, HCF/LCM, squares, Paravartya, algebra',
  'Grade 6 Vedic Math with AI tutor - vinculum and algebra for 11-12 year olds',
  '6','Mathematics',1,0,'active') t
WHERE NOT EXISTS (SELECT 1 FROM rd_courses WHERE course_name='MindSutra Grade 6 Vedic Math');

INSERT INTO rd_courses (course_name, course_type, course_description, shortDescription, grade_range, category, is_active, is_featured, course_status)
SELECT * FROM (SELECT
  'MindSutra Grade 7 Vedic Math','AI_TUTOR',
  'CBSE Grade 7 Vedic Math AI Tutor - squaring, rational numbers, linear equations, cubics, identities',
  'Grade 7 Vedic Math with AI tutor - algebra and identities for 12-13 year olds',
  '7','Mathematics',1,0,'active') t
WHERE NOT EXISTS (SELECT 1 FROM rd_courses WHERE course_name='MindSutra Grade 7 Vedic Math');

INSERT INTO rd_courses (course_name, course_type, course_description, shortDescription, grade_range, category, is_active, is_featured, course_status)
SELECT * FROM (SELECT
  'MindSutra Grade 8 Vedic Math','AI_TUTOR',
  'CBSE Grade 8 Vedic Math AI Tutor - square roots, advanced identities, simultaneous equations, divisibility',
  'Grade 8 Vedic Math with AI tutor - advanced algebra for 13-14 year olds',
  '8','Mathematics',1,0,'active') t
WHERE NOT EXISTS (SELECT 1 FROM rd_courses WHERE course_name='MindSutra Grade 8 Vedic Math');

SELECT course_id, course_name, course_type, grade_range, is_active FROM rd_courses WHERE course_type='AI_TUTOR' ORDER BY course_id;
