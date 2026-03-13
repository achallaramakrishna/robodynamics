#!/usr/bin/env bash
mysql -uroot -p'"'"'Jatni@752050'"'"' -D robodynamics_db -N -s -e "SHOW TABLES LIKE 'vida%';"
