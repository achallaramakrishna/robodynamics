#!/bin/bash
set -euo pipefail
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SHOW TABLES LIKE 'rd_exam_answer%';"
