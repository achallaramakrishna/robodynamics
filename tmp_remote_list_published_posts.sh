set -e
mysql -uroot -pJatni@752050 -D robodynamics_db -e "SELECT post_id,title,is_published,href FROM rd_blog_post WHERE is_published=1 ORDER BY post_id DESC;"
