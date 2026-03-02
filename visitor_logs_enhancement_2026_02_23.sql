-- Visitor logs enhancement for richer analytics and reporting
-- Apply on production DB before deploying the updated WAR.
-- Note: This script is intended for one-time execution.

ALTER TABLE rd_visitor_logs ADD COLUMN query_string VARCHAR(1000) NULL AFTER url;
ALTER TABLE rd_visitor_logs ADD COLUMN http_method VARCHAR(10) NULL AFTER query_string;
ALTER TABLE rd_visitor_logs ADD COLUMN referrer VARCHAR(500) NULL AFTER http_method;
ALTER TABLE rd_visitor_logs ADD COLUMN user_agent VARCHAR(600) NULL AFTER referrer;
ALTER TABLE rd_visitor_logs ADD COLUMN device_type VARCHAR(20) NULL AFTER user_agent;
ALTER TABLE rd_visitor_logs ADD COLUMN session_id VARCHAR(120) NULL AFTER device_type;
ALTER TABLE rd_visitor_logs ADD COLUMN is_logged_in TINYINT(1) NULL AFTER session_id;
ALTER TABLE rd_visitor_logs ADD COLUMN user_id INT NULL AFTER is_logged_in;
ALTER TABLE rd_visitor_logs ADD COLUMN user_name VARCHAR(120) NULL AFTER user_id;
ALTER TABLE rd_visitor_logs ADD COLUMN profile_id INT NULL AFTER user_name;
ALTER TABLE rd_visitor_logs ADD COLUMN country_code VARCHAR(16) NULL AFTER profile_id;
ALTER TABLE rd_visitor_logs ADD COLUMN region VARCHAR(100) NULL AFTER country_code;
ALTER TABLE rd_visitor_logs ADD COLUMN city VARCHAR(100) NULL AFTER region;

CREATE INDEX idx_rd_visitor_logs_ts ON rd_visitor_logs (timestamp);
CREATE INDEX idx_rd_visitor_logs_user_ts ON rd_visitor_logs (user_id, timestamp);
CREATE INDEX idx_rd_visitor_logs_logged_ts ON rd_visitor_logs (is_logged_in, timestamp);
CREATE INDEX idx_rd_visitor_logs_country_ts ON rd_visitor_logs (country_code, timestamp);

-- One-time cleanup for old low-context rows:
-- Uncomment only if you want to drop pre-enhancement logs immediately.
-- DELETE FROM rd_visitor_logs;

-- Targeted cleanup for legacy rows captured before enrichment:
-- DELETE FROM rd_visitor_logs
-- WHERE user_agent IS NULL
--   AND http_method IS NULL
--   AND country_code IS NULL
--   AND user_id IS NULL;

-- Safer retention cleanup sample:
-- DELETE FROM rd_visitor_logs
-- WHERE timestamp < DATE_SUB(NOW(), INTERVAL 90 DAY);
