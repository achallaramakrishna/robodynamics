#!/bin/bash
set -euo pipefail
mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s -e "SHOW TABLES LIKE '%user%';"
