set -e
mysql -uroot -pJatni@752050 -D robodynamics_db -e "SELECT post_id,title,image_url,is_published FROM rd_blog_post WHERE is_published=1 ORDER BY post_id DESC LIMIT 8;"
