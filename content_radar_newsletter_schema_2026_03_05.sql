USE robodynamics_db;

START TRANSACTION;

CREATE TABLE IF NOT EXISTS rd_content_radar_source (
  source_id BIGINT NOT NULL AUTO_INCREMENT,
  source_name VARCHAR(255) NOT NULL,
  source_type VARCHAR(40) NOT NULL DEFAULT 'RSS',
  feed_url VARCHAR(512) NOT NULL,
  base_url VARCHAR(255) DEFAULT NULL,
  authority_weight INT NOT NULL DEFAULT 70,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  notes VARCHAR(1000) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (source_id),
  UNIQUE KEY uq_content_radar_source_feed_url (feed_url),
  KEY idx_content_radar_source_active (is_active),
  KEY idx_content_radar_source_weight (authority_weight)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rd_content_radar_item (
  item_id BIGINT NOT NULL AUTO_INCREMENT,
  source_id BIGINT NOT NULL,
  source_name VARCHAR(255) NOT NULL,
  external_guid VARCHAR(255) DEFAULT NULL,
  content_type VARCHAR(40) NOT NULL DEFAULT 'ARTICLE',
  title VARCHAR(500) NOT NULL,
  canonical_url VARCHAR(512) NOT NULL,
  summary_text TEXT DEFAULT NULL,
  published_at DATETIME DEFAULT NULL,
  fetched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  keyword_hits INT NOT NULL DEFAULT 0,
  authority_score INT NOT NULL DEFAULT 0,
  freshness_score INT NOT NULL DEFAULT 0,
  trend_score INT NOT NULL DEFAULT 0,
  relevance_score INT NOT NULL DEFAULT 0,
  total_score INT NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'DISCOVERED',
  editor_notes VARCHAR(1000) DEFAULT NULL,
  draft_title VARCHAR(500) DEFAULT NULL,
  draft_excerpt VARCHAR(1000) DEFAULT NULL,
  draft_body TEXT DEFAULT NULL,
  attribution_required TINYINT(1) NOT NULL DEFAULT 1,
  awareness_post_id INT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (item_id),
  UNIQUE KEY uq_content_radar_item_canonical_url (canonical_url),
  UNIQUE KEY uq_content_radar_item_source_guid (source_id, external_guid),
  KEY idx_content_radar_item_status (status),
  KEY idx_content_radar_item_score (total_score),
  KEY idx_content_radar_item_fetched (fetched_at),
  KEY idx_content_radar_item_published (published_at),
  KEY idx_content_radar_item_awareness_post (awareness_post_id),
  CONSTRAINT fk_content_radar_item_source
    FOREIGN KEY (source_id) REFERENCES rd_content_radar_source(source_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rd_newsletter_issue (
  issue_id BIGINT NOT NULL AUTO_INCREMENT,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  title VARCHAR(500) NOT NULL,
  subject_line VARCHAR(500) NOT NULL,
  body_html TEXT DEFAULT NULL,
  source_item_ids VARCHAR(1000) DEFAULT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
  awareness_post_id INT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  approved_at DATETIME DEFAULT NULL,
  approved_by_user_id INT DEFAULT NULL,
  PRIMARY KEY (issue_id),
  UNIQUE KEY uq_newsletter_issue_week_start (week_start),
  KEY idx_newsletter_issue_status (status),
  KEY idx_newsletter_issue_awareness_post (awareness_post_id),
  KEY idx_newsletter_issue_approved_by (approved_by_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
