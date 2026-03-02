#!/bin/sh
set -e
mysql -uroot -p'Jatni@752050' -Nse "SELECT 'Q_BEFORE', assessment_version, COUNT(1) FROM rd_ci_question_bank WHERE module_code='APTIPATH' AND status='ACTIVE' GROUP BY assessment_version;" robodynamics_db
mysql -uroot -p'Jatni@752050' -Nse "SELECT 'CAREER_BEFORE', assessment_version, COUNT(1) FROM rd_ci_career_catalog WHERE module_code='APTIPATH' AND status='ACTIVE' GROUP BY assessment_version;" robodynamics_db
mysql -uroot -p'Jatni@752050' -Nse "SELECT 'ADJ_BEFORE', assessment_version, COUNT(1) FROM rd_ci_career_adjustment WHERE module_code='APTIPATH' AND status='ACTIVE' GROUP BY assessment_version;" robodynamics_db
