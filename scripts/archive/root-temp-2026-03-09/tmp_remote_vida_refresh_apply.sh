set -e
mysql -uroot -pJatni@752050 --local-infile=1 robodynamics_db < /tmp/VIDAPATH_GRADE_BASED_REFRESH_2026_02_28.sql
