#!/usr/bin/env bash
mysql -uroot -p'Jatni@752050' -D robodynamics_db -e "
SELECT cs.course_session_id,
       cs.session_title,
       SUM(CASE WHEN d.type='flashcard' THEN 1 ELSE 0 END) AS flashcard,
       SUM(CASE WHEN d.type='matchinggame' THEN 1 ELSE 0 END) AS matchinggame,
       SUM(CASE WHEN d.type='matchingpair' THEN 1 ELSE 0 END) AS matchingpair,
       SUM(CASE WHEN d.type='quiz' THEN 1 ELSE 0 END) AS quiz,
       SUM(CASE WHEN d.type='exampaper' THEN 1 ELSE 0 END) AS exampaper,
       SUM(CASE WHEN d.type='labmanual' THEN 1 ELSE 0 END) AS labmanual
FROM rd_course_sessions cs
LEFT JOIN rd_course_session_details d
  ON d.course_session_id = cs.course_session_id
 AND d.course_id = 162
WHERE cs.course_id = 162
GROUP BY cs.course_session_id, cs.session_title
ORDER BY cs.course_session_id;
" 
