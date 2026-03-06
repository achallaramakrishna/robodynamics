set -e
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
START TRANSACTION;
SET @uid := (SELECT user_id FROM rd_users WHERE user_name='venkata' LIMIT 1);
SET @mid := (SELECT module_id FROM rd_modules WHERE module_code='EXAM_PREP' LIMIT 1);

SET @existing := (
  SELECT user_permission_id
  FROM rd_user_permissions
  WHERE user_id=@uid AND module_id=@mid AND feature_code IS NULL
  ORDER BY user_permission_id DESC
  LIMIT 1
);

UPDATE rd_user_permissions
SET access_status='ACTIVE', feature_access='ALLOW', updated_at=NOW()
WHERE user_permission_id=@existing;

INSERT INTO rd_user_permissions (user_id, company_id, module_id, access_status, feature_code, feature_access, settings_json, created_at, updated_at)
SELECT @uid, NULL, @mid, 'ACTIVE', NULL, 'ALLOW', NULL, NOW(), NOW()
WHERE @uid IS NOT NULL AND @mid IS NOT NULL AND @existing IS NULL;

COMMIT;

SELECT @uid AS user_id, @mid AS module_id, COALESCE(@existing, LAST_INSERT_ID()) AS permission_row_id;
SELECT p.user_permission_id,p.user_id,m.module_code,p.access_status,p.feature_code,p.feature_access,DATE_FORMAT(p.updated_at,'%Y-%m-%d %H:%i:%s')
FROM rd_user_permissions p
JOIN rd_modules m ON m.module_id=p.module_id
WHERE p.user_id=@uid AND m.module_code='EXAM_PREP'
ORDER BY p.user_permission_id DESC;
"
