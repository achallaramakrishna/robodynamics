INSERT IGNORE INTO rd_courses (course_id, course_name, course_type, description, is_active, created_at) VALUES
  ('vedic_math_g4', 'MindSutra Grade 4 Vedic Math', 'AI_TUTOR', 'CBSE Grade 4 Vedic Math complements tables 11-19 doubling near-100 criss-cross', 1, NOW()),
  ('vedic_math_g5', 'MindSutra Grade 5 Vedic Math', 'AI_TUTOR', 'CBSE Grade 5 Vedic Math Nikhilam 3-digit criss-cross fractions decimals flag division', 1, NOW()),
  ('vedic_math_g6', 'MindSutra Grade 6 Vedic Math', 'AI_TUTOR', 'CBSE Grade 6 Vedic Math vinculum integers HCF LCM squares Paravartya algebra', 1, NOW()),
  ('vedic_math_g7', 'MindSutra Grade 7 Vedic Math', 'AI_TUTOR', 'CBSE Grade 7 Vedic Math squaring rational numbers linear equations cubics identities', 1, NOW()),
  ('vedic_math_g8', 'MindSutra Grade 8 Vedic Math', 'AI_TUTOR', 'CBSE Grade 8 Vedic Math square roots advanced identities simultaneous equations divisibility', 1, NOW());
SELECT course_id, course_name, is_active FROM rd_courses WHERE course_id LIKE 'vedic_math%' ORDER BY course_id;
