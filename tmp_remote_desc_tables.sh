#!/bin/bash
set -euo pipefail
mysql -uroot -p'Jatni@752050' -D robodynamics_db -e "DESCRIBE rd_ci_assessment_session; DESCRIBE rd_ci_assessment_response; DESCRIBE rd_user;"
