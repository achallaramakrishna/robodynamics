SELECT 'TOTAL_ROWS' AS metric, COUNT(*) AS value FROM rd_visitor_logs;
SELECT 'LAST_24H_VISITS' AS metric, COUNT(*) AS value FROM rd_visitor_logs WHERE timestamp >= NOW() - INTERVAL 24 HOUR;
SELECT 'LAST_24H_LOGGED_IN_VISITS' AS metric, COUNT(*) AS value FROM rd_visitor_logs WHERE timestamp >= NOW() - INTERVAL 24 HOUR AND is_logged_in = 1;
SELECT 'LAST_24H_ANON_VISITS' AS metric, COUNT(*) AS value FROM rd_visitor_logs WHERE timestamp >= NOW() - INTERVAL 24 HOUR AND (is_logged_in = 0 OR is_logged_in IS NULL);
SELECT 'LAST_24H_DISTINCT_USERS' AS metric, COUNT(DISTINCT user_id) AS value FROM rd_visitor_logs WHERE timestamp >= NOW() - INTERVAL 24 HOUR AND is_logged_in = 1 AND user_id IS NOT NULL;
SELECT 'LAST_24H_DISTINCT_IPS' AS metric, COUNT(DISTINCT ip_address) AS value FROM rd_visitor_logs WHERE timestamp >= NOW() - INTERVAL 24 HOUR;
SELECT 'LAST_24H_COUNTRY_FILLED' AS metric, COUNT(*) AS value FROM rd_visitor_logs WHERE timestamp >= NOW() - INTERVAL 24 HOUR AND country_code IS NOT NULL;
SELECT IFNULL(country_code, 'UNKNOWN') AS country, COUNT(*) AS visits FROM rd_visitor_logs WHERE timestamp >= NOW() - INTERVAL 24 HOUR GROUP BY country_code ORDER BY visits DESC LIMIT 5;
SELECT user_id, IFNULL(user_name, 'UNKNOWN') AS user_name, COUNT(*) AS visits FROM rd_visitor_logs WHERE timestamp >= NOW() - INTERVAL 24 HOUR AND is_logged_in = 1 AND user_id IS NOT NULL GROUP BY user_id, user_name ORDER BY visits DESC LIMIT 5;
