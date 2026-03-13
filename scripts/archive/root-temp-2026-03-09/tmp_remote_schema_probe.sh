mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
SHOW TABLES LIKE 'rd_user';
SHOW TABLES LIKE 'rd_users';
SHOW COLUMNS FROM rd_user;
SQL
