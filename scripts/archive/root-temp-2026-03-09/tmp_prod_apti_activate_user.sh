#!/usr/bin/env bash
set -euo pipefail
mysql -uroot -p'Jatni@752050' -Nse "
INSERT INTO robodynamics_db.rd_ci_subscription (
  parent_user_id, student_user_id, plan_key, plan_name, plan_type, module_code,
  billing_label, status, base_amount, gst_amount, total_amount, gst_percent,
  currency, payment_provider, start_at, end_at, created_at, updated_at
)
SELECT
  388, 389,
  'career-premium', 'Career Intelligence Premium', 'career', 'APTIPATH',
  'ONE_TIME', 'ACTIVE', 1999, 360, 2359, 18.00,
  'INR', 'MANUAL', NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY), NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1
  FROM robodynamics_db.rd_ci_subscription
  WHERE module_code='APTIPATH'
    AND student_user_id=389
    AND status='ACTIVE'
);

SELECT s.ci_subscription_id,
       s.status,
       s.plan_key,
       p.user_name AS parent_username,
       p.password AS parent_password,
       st.user_name AS student_username,
       st.password AS student_password,
       DATE_FORMAT(s.created_at,'%Y-%m-%d %H:%i:%s') AS created_at
FROM robodynamics_db.rd_ci_subscription s
LEFT JOIN robodynamics_db.rd_users p ON p.user_id=s.parent_user_id
LEFT JOIN robodynamics_db.rd_users st ON st.user_id=s.student_user_id
WHERE s.module_code='APTIPATH'
ORDER BY s.ci_subscription_id DESC
LIMIT 10;
"
