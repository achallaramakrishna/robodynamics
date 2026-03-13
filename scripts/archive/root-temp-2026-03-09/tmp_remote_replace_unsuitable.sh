mysql -uroot -pJatni@752050 -D robodynamics_db <<'SQL'
START TRANSACTION;

UPDATE rd_content_radar_item
SET status='REJECTED',
    editor_notes='Rejected: not suitable for Indian parent context',
    updated_at=NOW(),
    awareness_post_id=NULL
WHERE item_id IN (18,27);

DELETE FROM rd_blog_post
WHERE post_id IN (
  SELECT post_id FROM (
    SELECT post_id FROM rd_blog_post
    WHERE title LIKE 'Parent Alert: Supreme Court%'
  ) x
);

SET @item1 := 50;
SET @item2 := 66;

INSERT INTO rd_blog_post(title, excerpt, is_published, image_url, href)
SELECT
  CONCAT('Parent Alert: ', title),
  CONCAT(SUBSTRING(IFNULL(summary_text,''),1,240), ' Source: ', IFNULL(source_name,'')),
  1,
  '',
  LEFT(canonical_url,250)
FROM rd_content_radar_item
WHERE item_id=@item1;
SET @post1 := LAST_INSERT_ID();

UPDATE rd_content_radar_item
SET status='PUBLISHED', awareness_post_id=@post1, updated_at=NOW()
WHERE item_id=@item1;

INSERT INTO rd_blog_post(title, excerpt, is_published, image_url, href)
SELECT
  CONCAT('Parent Alert: ', title),
  CONCAT(SUBSTRING(IFNULL(summary_text,''),1,240), ' Source: ', IFNULL(source_name,'')),
  1,
  '',
  LEFT(canonical_url,250)
FROM rd_content_radar_item
WHERE item_id=@item2;
SET @post2 := LAST_INSERT_ID();

UPDATE rd_content_radar_item
SET status='PUBLISHED', awareness_post_id=@post2, updated_at=NOW()
WHERE item_id=@item2;

COMMIT;

SELECT post_id,title,is_published FROM rd_blog_post ORDER BY post_id DESC LIMIT 10;
SELECT item_id,status,awareness_post_id FROM rd_content_radar_item WHERE item_id IN (18,27,50,66) ORDER BY item_id;
SQL