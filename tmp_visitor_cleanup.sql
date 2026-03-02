DELETE FROM rd_visitor_logs
WHERE user_agent IS NULL
  AND http_method IS NULL
  AND country_code IS NULL
  AND user_id IS NULL;
SELECT 'REMAINING_LOW_CONTEXT', COUNT(*)
FROM rd_visitor_logs
WHERE user_agent IS NULL
  AND http_method IS NULL
  AND country_code IS NULL
  AND user_id IS NULL;
