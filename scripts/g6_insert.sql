INSERT IGNORE INTO rd_courses (course_id, course_name, course_type, description, is_active, created_at)
VALUES ('aptitude_reasoning_g6', 'MindSpark Grade 6 Aptitude Reasoning', 'AI_TUTOR',
        'Series coding-decoding analogies Venn diagrams clocks data tables for Grade 6', 1, NOW());

SELECT course_id, course_name, is_active FROM rd_courses WHERE course_id LIKE 'aptitude%' ORDER BY course_id;
