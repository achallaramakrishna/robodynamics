set -e
mysql -uroot -pJatni@752050 -D robodynamics_db -e "SELECT source_id,source_name,is_active,authority_weight,feed_url FROM rd_content_radar_source ORDER BY source_id DESC;"
