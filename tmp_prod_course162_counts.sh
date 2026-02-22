#!/usr/bin/env bash
mysql -uroot -p'Jatni@752050' -D robodynamics_db <<'SQL'
select count(*) as session_count from rd_course_sessions where course_id=162;
select type, count(*) as cnt from rd_course_session_details where course_id=162 group by type order by type;
SQL
