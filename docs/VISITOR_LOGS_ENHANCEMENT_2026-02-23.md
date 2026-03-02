# Visitor Logs Enhancement (2026-02-23)

## What changed
- Visitor logs now capture richer context:
  - `ip`, `url`, `query_string`, `http_method`, `referrer`, `user_agent`, `device_type`, `session_id`
  - `is_logged_in`, `user_id`, `user_name`, `profile_id`
  - header-derived location: `country_code`, `region`, `city`
- Activity report email now includes:
  - total/unique traffic
  - logged-in vs anonymous visits
  - distinct logged-in users
  - top URLs, top users, top countries
- Daily visitor-log retention cleanup added (default: keep 14 days).

## Mandatory DB migration before deploy
Run:

`visitor_logs_enhancement_2026_02_23.sql`

If migration is not run, the app will fail when accessing `rd_visitor_logs` due missing columns.

## Properties added
In `app-config.properties`:
- `rd.visitor.logging.enabled=true`
- `rd.activity.report.enabled=true`
- `rd.activity.report.to=achallaramakrishna@gmail.com`
- `rd.activity.report.hours=3`
- `rd.activity.report.maxTopUrls=10`
- `rd.activity.report.sendWhenNoActivity=false`
- `rd.activity.report.cron=0 0 */3 * * *`
- `rd.visitor.cleanup.enabled=true`
- `rd.visitor.cleanup.keepDays=14`
- `rd.visitor.cleanup.cron=0 15 3 * * *`

## One-time old log cleanup
If you want to remove old low-context entries completely:
- In SQL file, uncomment `DELETE FROM rd_visitor_logs;` and run once.

Safer alternative:
- Keep retention cleanup only, or run:
  - `DELETE FROM rd_visitor_logs WHERE timestamp < DATE_SUB(NOW(), INTERVAL 90 DAY);`
