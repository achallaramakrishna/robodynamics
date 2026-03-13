#!/bin/bash
set -e
mysql -uroot -pJatni@752050 -D robodynamics_db -N -s -e "SHOW TABLES LIKE 'vida_path%'; SHOW TABLES LIKE '%answer%'; SHOW TABLES LIKE '%question%';"
