#!/bin/bash
set -e
mysql -uroot -p'Jatni@752050' -D robodynamics_db -N <<'SQL'
SELECT 'TOTAL_ROWS', COUNT(*) FROM rd_visitor_logs;
SELECT 'LAST_24H_VISITS', COUNT(*) FROM rd_visitor_logs WHERE timestamp >= NOW() - INTERVAL 24 HOUR;
SELECT 'LAST_24H_LOGGED_IN_VISITS', COUNT(*) FROM rd_visitor_logs WHERE timestamp >= NOW() - INTERVAL 24 HOUR AND is_logged_in = 1;
SELECT 'LAST_24H_ANON_VISITS', COUNT(*) FROM rd_visitor_logs WHERE timestamp >= NOW() - INTERVAL 24 HOUR AND (is_logged_in = 0 OR is_logged_in IS NULL);
SELECT 'LAST_24H_DISTINCT_USERS', COUNT(DISTINCT user_id) FROM rd_visitor_logs WHERE timestamp >= NOW() - INTERVAL 24 HOUR AND is_logged_in = 1 AND user_id IS NOT NULL;
SELECT 'LAST_24H_DISTINCT_IPS', COUNT(DISTINCT ip_address) FROM rd_visitor_logs WHERE timestamp >= NOW() - INTERVAL 24 HOUR;
SELECT 'LAST_24H_COUNTRY_FILLED', COUNT(*) FROM rd_visitor_logs WHERE timestamp >= NOW() - INTERVAL 24 HOUR AND country_code IS NOT NULL;
SELECT 'LEGACY_LOW_CONTEXT_ROWS', COUNT(*) FROM rd_visitor_logs WHERE user_agent IS NULL AND http_method IS NULL AND country_code IS NULL AND user_id IS NULL;
SELECT CONCAT('TOP_COUNTRY_', IFNULL(country_code,'UNKNOWN')), COUNT(*) FROM rd_visitor_logs WHERE timestamp >= NOW() - INTERVAL 24 HOUR GROUP BY country_code ORDER BY COUNT(*) DESC LIMIT 5;
SELECT CONCAT('TOP_USER_', user_id, '_', IFNULL(user_name,'UNKNOWN')), COUNT(*) FROM rd_visitor_logs WHERE timestamp >= NOW() - INTERVAL 24 HOUR AND is_logged_in = 1 AND user_id IS NOT NULL GROUP BY user_id, user_name ORDER BY COUNT(*) DESC LIMIT 5;
SQL
