set -e
mysql -uroot -pJatni@752050 -D robodynamics_db -e "SELECT post_id,title FROM rd_blog_post WHERE title LIKE 'Parent Alert:%' OR title LIKE 'Parent Alert -%'; SELECT post_id,title FROM rd_blog_post ORDER BY post_id DESC LIMIT 8;"
