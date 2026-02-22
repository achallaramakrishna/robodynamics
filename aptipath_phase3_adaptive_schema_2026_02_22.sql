-- AptiPath Phase 3 schema draft for 1000+ adaptive tree routing
-- Date: 2026-02-22

ALTER TABLE rd_ci_question_bank
  ADD COLUMN difficulty_level VARCHAR(20) NULL AFTER question_type,
  ADD COLUMN concept_code VARCHAR(80) NULL AFTER difficulty_level,
  ADD COLUMN subconcept_code VARCHAR(80) NULL AFTER concept_code,
  ADD COLUMN branch_tag VARCHAR(20) NULL AFTER subconcept_code,
  ADD COLUMN target_grade_min INT NULL AFTER branch_tag,
  ADD COLUMN target_grade_max INT NULL AFTER target_grade_min,
  ADD COLUMN modality VARCHAR(20) NULL AFTER target_grade_max,
  ADD COLUMN max_duration_seconds INT NULL AFTER modality;

CREATE TABLE IF NOT EXISTS rd_ci_question_edge (
  ci_question_edge_id BIGINT NOT NULL AUTO_INCREMENT,
  from_question_code VARCHAR(120) NOT NULL,
  outcome_bucket VARCHAR(30) NOT NULL,
  to_question_code VARCHAR(120) NOT NULL,
  edge_weight DECIMAL(6,2) NOT NULL DEFAULT 1.00,
  is_active VARCHAR(10) NOT NULL DEFAULT 'YES',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (ci_question_edge_id),
  KEY idx_qedge_from (from_question_code),
  KEY idx_qedge_outcome (outcome_bucket),
  KEY idx_qedge_to (to_question_code)
);

CREATE TABLE IF NOT EXISTS rd_ci_skill_dimension (
  skill_code VARCHAR(80) NOT NULL,
  skill_name VARCHAR(160) NOT NULL,
  dimension_type VARCHAR(40) NOT NULL,
  description_text VARCHAR(1000) NULL,
  is_active VARCHAR(10) NOT NULL DEFAULT 'YES',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (skill_code),
  KEY idx_skill_dimension_type (dimension_type)
);

CREATE TABLE IF NOT EXISTS rd_ci_question_skill_map (
  ci_question_skill_map_id BIGINT NOT NULL AUTO_INCREMENT,
  question_code VARCHAR(120) NOT NULL,
  skill_code VARCHAR(80) NOT NULL,
  weight DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  is_active VARCHAR(10) NOT NULL DEFAULT 'YES',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (ci_question_skill_map_id),
  UNIQUE KEY uq_qskill (question_code, skill_code),
  KEY idx_qskill_q (question_code),
  KEY idx_qskill_skill (skill_code)
);

CREATE TABLE IF NOT EXISTS rd_ci_response_evidence (
  ci_response_evidence_id BIGINT NOT NULL AUTO_INCREMENT,
  ci_assessment_response_id BIGINT NOT NULL,
  evidence_type VARCHAR(30) NOT NULL,
  evidence_url VARCHAR(512) NULL,
  rubric_json JSON NULL,
  auto_score DECIMAL(6,2) NULL,
  mentor_score DECIMAL(6,2) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (ci_response_evidence_id),
  KEY idx_resp_evidence_resp (ci_assessment_response_id),
  KEY idx_resp_evidence_type (evidence_type)
);

CREATE TABLE IF NOT EXISTS rd_ci_skill_score_snapshot (
  ci_skill_score_snapshot_id BIGINT NOT NULL AUTO_INCREMENT,
  ci_assessment_session_id BIGINT NOT NULL,
  skill_code VARCHAR(80) NOT NULL,
  score DECIMAL(6,2) NOT NULL,
  confidence DECIMAL(6,2) NULL,
  scoring_version VARCHAR(40) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ci_skill_score_snapshot_id),
  KEY idx_skill_snap_session (ci_assessment_session_id),
  KEY idx_skill_snap_skill (skill_code)
);
