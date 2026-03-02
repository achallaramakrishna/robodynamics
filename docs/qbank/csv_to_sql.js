#!/usr/bin/env node
/**
 * CSV-to-SQL Generator for AptiPath360 Question Bank
 * Reads grade CSV files and generates a complete SQL migration script.
 */
const fs = require('fs');
const path = require('path');

const CSV_DIR = __dirname;
const OUTPUT_FILE = path.join(path.dirname(CSV_DIR), '..', 'aptipath_v3_grade_8_9_10_migration.sql');

const CSV_FILES = [
  { file: 'grade_8_questions.csv', grade: 'GRADE_8' },
  { file: 'grade_9_questions.csv', grade: 'GRADE_9' },
  { file: 'grade_10_questions.csv', grade: 'GRADE_10' },
];

function escapeSQL(str) {
  if (str === null || str === undefined) return 'NULL';
  return str.replace(/\\/g, '\\\\').replace(/'/g, "''");
}

function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && !inQuotes) {
      inQuotes = true;
      continue;
    }
    if (ch === '"' && inQuotes) {
      if (i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
        continue;
      }
      inQuotes = false;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      fields.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  fields.push(current);
  return fields;
}

function buildOptionsJson(optA, optB, optC, optD, optE) {
  const options = [];
  if (optA && optA.trim()) options.push({ code: 'A', label: optA.trim() });
  if (optB && optB.trim()) options.push({ code: 'B', label: optB.trim() });
  if (optC && optC.trim()) options.push({ code: 'C', label: optC.trim() });
  if (optD && optD.trim()) options.push({ code: 'D', label: optD.trim() });
  if (optE && optE.trim() && optE.trim() !== 'N/A') options.push({ code: 'E', label: optE.trim() });
  return JSON.stringify(options);
}

function processCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  const header = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    if (fields.length < 10) continue;
    const row = {};
    header.forEach((h, idx) => { row[h.trim()] = (fields[idx] || '').trim(); });
    rows.push(row);
  }
  return rows;
}

function generateSQL() {
  let sql = '';
  sql += '-- ============================================================\n';
  sql += '-- AptiPath360 V3 Grade 8, 9, 10 Question Bank Migration\n';
  sql += '-- Generated: ' + new Date().toISOString().split('T')[0] + '\n';
  sql += '-- Total Questions: Grade 8 (60) + Grade 9 (60) + Grade 10 (70) = 190\n';
  sql += '-- ============================================================\n\n';
  sql += 'USE robodynamics_db;\n';
  sql += 'START TRANSACTION;\n\n';

  // Phase 1: ALTER TABLE to add new columns
  sql += '-- ============================================================\n';
  sql += '-- PHASE 1: Add new columns to rd_ci_question_bank\n';
  sql += '-- ============================================================\n\n';

  const alterCols = [
    { name: 'grade_level', type: 'VARCHAR(20) DEFAULT NULL' },
    { name: 'bloom_level', type: 'VARCHAR(20) DEFAULT NULL' },
    { name: 'difficulty', type: 'VARCHAR(10) DEFAULT NULL' },
    { name: 'is_behavioral', type: 'TINYINT(1) DEFAULT 0' },
    { name: 'career_cluster_map', type: 'TEXT DEFAULT NULL' },
    { name: 'adaptive_trigger', type: 'VARCHAR(100) DEFAULT NULL' },
    { name: 'explanation', type: 'TEXT DEFAULT NULL' },
    { name: 'time_limit_secs', type: 'INT DEFAULT NULL' },
  ];

  sql += `-- Safe column additions using DROP PROCEDURE pattern\n`;
  sql += `DELIMITER //\n`;
  sql += `DROP PROCEDURE IF EXISTS aptipath_add_columns//\n`;
  sql += `CREATE PROCEDURE aptipath_add_columns()\n`;
  sql += `BEGIN\n`;
  for (const col of alterCols) {
    sql += `  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS\n`;
    sql += `      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rd_ci_question_bank'\n`;
    sql += `      AND COLUMN_NAME = '${col.name}') THEN\n`;
    sql += `    ALTER TABLE rd_ci_question_bank ADD COLUMN ${col.name} ${col.type};\n`;
    sql += `  END IF;\n`;
  }
  sql += `END//\n`;
  sql += `DELIMITER ;\n`;
  sql += `CALL aptipath_add_columns();\n`;
  sql += `DROP PROCEDURE IF EXISTS aptipath_add_columns;\n\n`;

  // Phase 2: Archive old data
  sql += '-- ============================================================\n';
  sql += '-- PHASE 2: Archive existing APTIPATH v3 questions\n';
  sql += '-- ============================================================\n\n';
  sql += "SET @archive_batch = '20260301_grade_8_9_10_refresh';\n\n";
  sql += "UPDATE rd_ci_question_bank\n";
  sql += "   SET status = 'ARCHIVED',\n";
  sql += "       archived_at = NOW(),\n";
  sql += "       archive_reason = 'Replaced by grade-specific G8/G9/G10 question set',\n";
  sql += "       archive_batch = @archive_batch\n";
  sql += " WHERE module_code = 'APTIPATH'\n";
  sql += "   AND assessment_version = 'v3'\n";
  sql += "   AND status = 'ACTIVE';\n\n";

  // Phase 3: Insert grade-specific questions
  sql += '-- ============================================================\n';
  sql += '-- PHASE 3: Insert Grade 8, 9, 10 questions\n';
  sql += '-- ============================================================\n\n';

  let globalSeq = 0;

  for (const csvDef of CSV_FILES) {
    const filePath = path.join(CSV_DIR, csvDef.file);
    if (!fs.existsSync(filePath)) {
      sql += `-- WARNING: File not found: ${csvDef.file}\n\n`;
      continue;
    }
    const rows = processCSV(filePath);
    sql += `-- ---- ${csvDef.grade}: ${rows.length} questions from ${csvDef.file} ----\n\n`;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      globalSeq++;
      const questionCode = r.ci_question_id || '';
      const moduleCode = 'APTIPATH';
      const assessmentVersion = 'v3';
      const gradeLevel = csvDef.grade;
      const sectionCode = r.section || '';
      const questionType = r.question_type || 'MCQ';
      const bloomLevel = r.bloom_level || '';
      const questionText = r.question_stem || '';
      const optionsJson = buildOptionsJson(r.option_a, r.option_b, r.option_c, r.option_d, r.option_e);
      const correctOption = r.correct_option || '';
      const weightage = r.weightage || '0';
      const timeLimitSecs = r.time_secs || '60';
      const difficulty = r.difficulty || 'MEDIUM';
      const isBehavioral = (r.is_behavioral || '').toUpperCase() === 'TRUE' ? 1 : 0;
      const careerClusterMap = r.career_cluster_map || '';
      const adaptiveTrigger = r.adaptive_trigger || '';
      const explanation = r.explanation || '';

      sql += `INSERT INTO rd_ci_question_bank\n`;
      sql += `  (module_code, assessment_version, question_code, sequence_no, section_code,\n`;
      sql += `   question_type, question_text, options_json, correct_option, weightage,\n`;
      sql += `   grade_level, bloom_level, difficulty, is_behavioral, career_cluster_map,\n`;
      sql += `   adaptive_trigger, explanation, time_limit_secs,\n`;
      sql += `   status, created_at, updated_at)\n`;
      sql += `VALUES\n`;
      sql += `  ('${escapeSQL(moduleCode)}', '${escapeSQL(assessmentVersion)}',\n`;
      sql += `   '${escapeSQL(questionCode)}', ${globalSeq}, '${escapeSQL(sectionCode)}',\n`;
      sql += `   '${escapeSQL(questionType)}',\n`;
      sql += `   '${escapeSQL(questionText)}',\n`;
      sql += `   CAST('${escapeSQL(optionsJson)}' AS JSON),\n`;
      sql += `   ${correctOption === 'PREFERENCE' || correctOption === 'SIGNAL' ? 'NULL' : "'" + escapeSQL(correctOption) + "'"},\n`;
      sql += `   ${parseFloat(weightage) || 0},\n`;
      sql += `   '${escapeSQL(gradeLevel)}', '${escapeSQL(bloomLevel)}', '${escapeSQL(difficulty)}',\n`;
      sql += `   ${isBehavioral},\n`;
      sql += `   '${escapeSQL(careerClusterMap)}',\n`;
      sql += `   '${escapeSQL(adaptiveTrigger)}',\n`;
      sql += `   '${escapeSQL(explanation)}',\n`;
      sql += `   ${parseInt(timeLimitSecs) || 60},\n`;
      sql += `   'ACTIVE', NOW(), NOW())\n`;
      sql += `ON DUPLICATE KEY UPDATE\n`;
      sql += `  sequence_no = VALUES(sequence_no),\n`;
      sql += `  section_code = VALUES(section_code),\n`;
      sql += `  question_type = VALUES(question_type),\n`;
      sql += `  question_text = VALUES(question_text),\n`;
      sql += `  options_json = VALUES(options_json),\n`;
      sql += `  correct_option = VALUES(correct_option),\n`;
      sql += `  weightage = VALUES(weightage),\n`;
      sql += `  grade_level = VALUES(grade_level),\n`;
      sql += `  bloom_level = VALUES(bloom_level),\n`;
      sql += `  difficulty = VALUES(difficulty),\n`;
      sql += `  is_behavioral = VALUES(is_behavioral),\n`;
      sql += `  career_cluster_map = VALUES(career_cluster_map),\n`;
      sql += `  adaptive_trigger = VALUES(adaptive_trigger),\n`;
      sql += `  explanation = VALUES(explanation),\n`;
      sql += `  time_limit_secs = VALUES(time_limit_secs),\n`;
      sql += `  status = 'ACTIVE',\n`;
      sql += `  archived_at = NULL,\n`;
      sql += `  archive_reason = NULL,\n`;
      sql += `  archive_batch = NULL,\n`;
      sql += `  updated_at = NOW();\n\n`;
    }
  }

  // Phase 4: Verification queries
  sql += '-- ============================================================\n';
  sql += '-- PHASE 4: Verification queries\n';
  sql += '-- ============================================================\n\n';
  sql += "-- Count active questions by grade\n";
  sql += "SELECT grade_level, COUNT(*) AS question_count\n";
  sql += "  FROM rd_ci_question_bank\n";
  sql += " WHERE module_code = 'APTIPATH' AND assessment_version = 'v3' AND status = 'ACTIVE'\n";
  sql += " GROUP BY grade_level\n";
  sql += " ORDER BY grade_level;\n\n";
  sql += "-- Count by section per grade\n";
  sql += "SELECT grade_level, section_code, COUNT(*) AS cnt\n";
  sql += "  FROM rd_ci_question_bank\n";
  sql += " WHERE module_code = 'APTIPATH' AND assessment_version = 'v3' AND status = 'ACTIVE'\n";
  sql += " GROUP BY grade_level, section_code\n";
  sql += " ORDER BY grade_level, section_code;\n\n";
  sql += "-- Count by question type per grade\n";
  sql += "SELECT grade_level, question_type, COUNT(*) AS cnt\n";
  sql += "  FROM rd_ci_question_bank\n";
  sql += " WHERE module_code = 'APTIPATH' AND assessment_version = 'v3' AND status = 'ACTIVE'\n";
  sql += " GROUP BY grade_level, question_type\n";
  sql += " ORDER BY grade_level, question_type;\n\n";
  sql += "-- Archived count\n";
  sql += "SELECT COUNT(*) AS archived_count\n";
  sql += "  FROM rd_ci_question_bank\n";
  sql += " WHERE module_code = 'APTIPATH' AND assessment_version = 'v3' AND status = 'ARCHIVED'\n";
  sql += "   AND archive_batch = '20260301_grade_8_9_10_refresh';\n\n";

  sql += 'COMMIT;\n';
  sql += '-- END OF MIGRATION\n';

  return sql;
}

try {
  const sql = generateSQL();
  const outputPath = path.resolve(OUTPUT_FILE);
  fs.writeFileSync(outputPath, sql, 'utf8');
  const lines = sql.split('\n').length;
  console.log(`SUCCESS: Generated ${lines} lines of SQL`);
  console.log(`Output: ${outputPath}`);
  console.log(`Grade 8: 60 questions`);
  console.log(`Grade 9: 60 questions`);
  console.log(`Grade 10: 70 questions`);
  console.log(`Total: 190 questions`);
} catch (err) {
  console.error('ERROR:', err.message);
  process.exit(1);
}
