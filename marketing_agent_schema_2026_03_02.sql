-- ============================================================
-- Marketing Agent MVP Schema
-- Date: 2026-03-02
-- ============================================================

USE robodynamics_db;

START TRANSACTION;

CREATE TABLE IF NOT EXISTS rd_marketing_lead_profile (
  profile_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  lead_id BIGINT NOT NULL,
  parent_name VARCHAR(120) NULL,
  student_name VARCHAR(120) NULL,
  student_grade VARCHAR(20) NULL,
  board VARCHAR(40) NULL,
  city VARCHAR(80) NULL,
  source_channel VARCHAR(40) NULL,
  campaign_id VARCHAR(80) NULL,
  consent_opt_in TINYINT(1) NOT NULL DEFAULT 0,
  consent_time DATETIME NULL,
  lead_score INT NOT NULL DEFAULT 0,
  funnel_stage VARCHAR(30) NOT NULL DEFAULT 'NEW',
  owner_user_id INT NULL,
  last_inbound_at DATETIME NULL,
  last_outbound_at DATETIME NULL,
  last_agent_action_at DATETIME NULL,
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_marketing_profile_lead (lead_id),
  KEY idx_marketing_profile_stage (funnel_stage),
  KEY idx_marketing_profile_score (lead_score),
  CONSTRAINT fk_marketing_profile_lead
    FOREIGN KEY (lead_id) REFERENCES rd_leads(lead_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rd_marketing_message_log (
  msg_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  lead_id BIGINT NOT NULL,
  direction VARCHAR(10) NOT NULL,
  channel VARCHAR(20) NOT NULL DEFAULT 'WHATSAPP',
  twilio_sid VARCHAR(64) NULL,
  message_type VARCHAR(20) NULL,
  body TEXT NULL,
  intent_tag VARCHAR(60) NULL,
  status VARCHAR(20) NULL,
  sent_at DATETIME NULL,
  delivered_at DATETIME NULL,
  read_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_marketing_msg_lead (lead_id),
  KEY idx_marketing_msg_direction (direction),
  KEY idx_marketing_msg_created (created_at),
  CONSTRAINT fk_marketing_msg_lead
    FOREIGN KEY (lead_id) REFERENCES rd_leads(lead_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rd_marketing_agent_task (
  task_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  lead_id BIGINT NOT NULL,
  agent_name VARCHAR(60) NOT NULL,
  task_type VARCHAR(60) NOT NULL,
  task_payload TEXT NULL,
  task_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  run_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_marketing_task_lead_status (lead_id, task_status),
  KEY idx_marketing_task_run_at (run_at),
  CONSTRAINT fk_marketing_task_lead
    FOREIGN KEY (lead_id) REFERENCES rd_leads(lead_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rd_marketing_booking (
  booking_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  lead_id BIGINT NOT NULL,
  slot_time DATETIME NOT NULL,
  mode VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'BOOKED',
  notes VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_marketing_booking_lead (lead_id),
  KEY idx_marketing_booking_status (status),
  KEY idx_marketing_booking_created (created_at),
  CONSTRAINT fk_marketing_booking_lead
    FOREIGN KEY (lead_id) REFERENCES rd_leads(lead_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rd_marketing_consent_audit (
  audit_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  lead_id BIGINT NULL,
  phone_e164 VARCHAR(20) NOT NULL,
  event_type VARCHAR(30) NOT NULL,
  event_source VARCHAR(40) NULL,
  event_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  details VARCHAR(255) NULL,
  KEY idx_marketing_consent_phone (phone_e164),
  KEY idx_marketing_consent_event_time (event_time),
  CONSTRAINT fk_marketing_consent_lead
    FOREIGN KEY (lead_id) REFERENCES rd_leads(lead_id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;

-- Optional KPI sanity checks
SELECT 'rd_marketing_lead_profile' AS tbl, COUNT(*) AS cnt FROM rd_marketing_lead_profile
UNION ALL
SELECT 'rd_marketing_message_log', COUNT(*) FROM rd_marketing_message_log
UNION ALL
SELECT 'rd_marketing_agent_task', COUNT(*) FROM rd_marketing_agent_task
UNION ALL
SELECT 'rd_marketing_booking', COUNT(*) FROM rd_marketing_booking
UNION ALL
SELECT 'rd_marketing_consent_audit', COUNT(*) FROM rd_marketing_consent_audit;
