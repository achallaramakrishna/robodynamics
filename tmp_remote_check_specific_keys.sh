mysql -uroot -pJatni@752050 -D robodynamics_db -N -s <<'SQL'
SELECT career_code, COUNT(*) FROM rd_ci_career_roadmap WHERE career_code IN ('AI_ML_ENGINEER','ROBOTICS_MAINTENANCE_TECHNICIAN') GROUP BY career_code;
SQL
