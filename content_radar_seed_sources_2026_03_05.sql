USE robodynamics_db;

START TRANSACTION;

UPDATE rd_content_radar_source
SET is_active = 0,
    updated_at = NOW();

INSERT INTO rd_content_radar_source
  (source_name, source_type, feed_url, base_url, authority_weight, is_active, notes, created_at, updated_at)
VALUES
  ('The Hindu Education', 'RSS', 'https://www.thehindu.com/education/feeder/default.rss', 'https://www.thehindu.com', 88, 1, 'India education reporting', NOW(), NOW()),
  ('Indian Express Education', 'RSS', 'https://indianexpress.com/section/education/feed/', 'https://indianexpress.com', 86, 1, 'India school and exam coverage', NOW(), NOW()),
  ('YourStory', 'RSS', 'https://yourstory.com/feed', 'https://yourstory.com', 82, 1, 'Indian startup and innovation coverage', NOW(), NOW()),
  ('Google News India AI Startups', 'RSS', 'https://news.google.com/rss/search?q=india+AI+startup+students+careers&hl=en-IN&gl=IN&ceid=IN:en', 'https://news.google.com', 76, 1, 'India AI startup trends relevant to parents and students', NOW(), NOW()),
  ('Google News India Education Policy', 'RSS', 'https://news.google.com/rss/search?q=india+education+policy+cbse+ncert&hl=en-IN&gl=IN&ceid=IN:en', 'https://news.google.com', 74, 1, 'India policy and curriculum updates', NOW(), NOW()),
  ('Google News India Future Careers', 'RSS', 'https://news.google.com/rss/search?q=india+future+skills+careers+students&hl=en-IN&gl=IN&ceid=IN:en', 'https://news.google.com', 74, 1, 'India skills and career pathways', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  source_name = VALUES(source_name),
  source_type = VALUES(source_type),
  base_url = VALUES(base_url),
  authority_weight = VALUES(authority_weight),
  is_active = VALUES(is_active),
  notes = VALUES(notes),
  updated_at = NOW();

COMMIT;
