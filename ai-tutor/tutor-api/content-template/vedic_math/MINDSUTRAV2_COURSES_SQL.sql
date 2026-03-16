-- MindSutra v2 — Grade-specific Vedic Math courses (G4–G8)
-- Run on prod: mysql -u root -p robodynamics_db < MINDSUTRAV2_COURSES_SQL.sql

INSERT IGNORE INTO rd_courses (
  course_id, course_name, description, subject, grade_band,
  track_type, engine_type, total_chapters, status, created_at
) VALUES
  (
    'vedic_math_g4',
    'MindSutra Grade 4 — Vedic Math',
    'CBSE Grade 4 aligned: fast addition, multiplication tables 11–19, borrow-free subtraction, doubling/halving, ×5/×25 shortcuts, near-100 arithmetic, and intro to criss-cross multiplication. Builds number sense and mental math confidence.',
    'Mathematics',
    'Grade 4',
    'ai-tutor',
    'generic_course',
    8,
    'active',
    NOW()
  ),
  (
    'vedic_math_g5',
    'MindSutra Grade 5 — Vedic Math',
    'CBSE Grade 5 aligned: Nikhilam multiplication near base 100, 3-digit cross-multiplication, division by 9 running trick, squaring near 50, fractions by inspection, decimal speed methods, and flag division. Pushes mental math to the next level.',
    'Mathematics',
    'Grade 5',
    'ai-tutor',
    'generic_course',
    8,
    'active',
    NOW()
  ),
  (
    'vedic_math_g6',
    'MindSutra Grade 6 — Vedic Math',
    'CBSE Grade 6 aligned: Vinculum (bar) numbers, integer multiplication, Nikhilam near any base, ratio racing, HCF/LCM Vedic speed method, squaring any 2-digit number, Paravartya division, and algebra by inspection. Rigorous and engaging for middle school.',
    'Mathematics',
    'Grade 6',
    'ai-tutor',
    'generic_course',
    8,
    'active',
    NOW()
  ),
  (
    'vedic_math_g7',
    'MindSutra Grade 7 — Vedic Math',
    'CBSE Grade 7 aligned: Power squaring near base, rational number speed, linear equations by sutra, 2-digit cubing, Nikhilam near 1000, exponent patterns, geometry shortcuts, and algebraic identity recognition. Competition-ready mental math.',
    'Mathematics',
    'Grade 7',
    'ai-tutor',
    'generic_course',
    8,
    'active',
    NOW()
  ),
  (
    'vedic_math_g8',
    'MindSutra Grade 8 — Vedic Math',
    'CBSE Grade 8 aligned: Square roots by digit-grouping, cube root inspection, advanced algebraic identities, simultaneous equations by Paravartya, 4-digit criss-cross, percentage speed methods, Nikhilam near 10000, and advanced divisibility tests. Board exam level mastery.',
    'Mathematics',
    'Grade 8',
    'ai-tutor',
    'generic_course',
    8,
    'active',
    NOW()
  );

-- Verify inserts
SELECT course_id, course_name, grade_band, total_chapters, status
FROM rd_courses
WHERE course_id LIKE 'vedic_math_g%'
ORDER BY course_id;
