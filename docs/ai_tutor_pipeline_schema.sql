CREATE TABLE IF NOT EXISTS rd_ai_tutor_pipeline_run (
  pipeline_run_id VARCHAR(36) PRIMARY KEY,
  agent_id VARCHAR(64) NOT NULL DEFAULT 'project_manager',
  course_id VARCHAR(64) NOT NULL,
  chapter_selection_json JSON DEFAULT NULL,
  requested_stages_json JSON DEFAULT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'RUNNING',
  artifact_root VARCHAR(512) DEFAULT NULL,
  created_by VARCHAR(64) DEFAULT 'system',
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME DEFAULT NULL,
  notes TEXT DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS rd_ai_tutor_agent_run (
  agent_run_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  pipeline_run_id VARCHAR(36) NOT NULL,
  agent_id VARCHAR(64) NOT NULL,
  course_id VARCHAR(64) NOT NULL,
  chapter_code VARCHAR(32) DEFAULT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'PENDING',
  input_payload_json JSON DEFAULT NULL,
  output_summary_json JSON DEFAULT NULL,
  error_message TEXT DEFAULT NULL,
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME DEFAULT NULL,
  CONSTRAINT fk_ai_tutor_agent_run_pipeline
    FOREIGN KEY (pipeline_run_id) REFERENCES rd_ai_tutor_pipeline_run(pipeline_run_id)
    ON DELETE CASCADE,
  INDEX idx_ai_tutor_agent_run_lookup (pipeline_run_id, agent_id, chapter_code)
);

CREATE TABLE IF NOT EXISTS rd_ai_tutor_agent_artifact (
  artifact_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  pipeline_run_id VARCHAR(36) NOT NULL,
  agent_id VARCHAR(64) NOT NULL,
  course_id VARCHAR(64) NOT NULL,
  chapter_code VARCHAR(32) DEFAULT NULL,
  artifact_type VARCHAR(64) NOT NULL,
  artifact_path VARCHAR(512) NOT NULL,
  artifact_sha256 VARCHAR(64) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_tutor_agent_artifact_pipeline
    FOREIGN KEY (pipeline_run_id) REFERENCES rd_ai_tutor_pipeline_run(pipeline_run_id)
    ON DELETE CASCADE,
  INDEX idx_ai_tutor_agent_artifact_lookup (pipeline_run_id, agent_id, chapter_code)
);

CREATE TABLE IF NOT EXISTS rd_ai_tutor_publish_decision (
  decision_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  pipeline_run_id VARCHAR(36) NOT NULL,
  course_id VARCHAR(64) NOT NULL,
  chapter_code VARCHAR(32) NOT NULL,
  machine_decision VARCHAR(32) NOT NULL,
  machine_status VARCHAR(32) NOT NULL,
  human_status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  decision_notes TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_tutor_publish_decision_pipeline
    FOREIGN KEY (pipeline_run_id) REFERENCES rd_ai_tutor_pipeline_run(pipeline_run_id)
    ON DELETE CASCADE,
  UNIQUE KEY uq_ai_tutor_publish_decision_run (pipeline_run_id, chapter_code)
);
