#!/usr/bin/env node
/**
 * CSV-to-SQL Generator for AptiPath360 Grade 11/12 Question Bank.
 * Reads stream-specific CSV files and generates a SQL migration script.
 */
const fs = require('fs');
const path = require('path');

const CSV_DIR = __dirname;
const OUTPUT_FILE = path.join(path.dirname(CSV_DIR), '..', 'aptipath_v3_grade_11_12_migration.sql');

const CSV_FILES = [
  { file: 'grade_11_12_pcm_questions.csv', stream: 'PCM' },
  { file: 'grade_11_12_pcb_questions.csv', stream: 'PCB' },
  { file: 'grade_11_12_commerce_questions.csv', stream: 'COMMERCE' },
  { file: 'grade_11_12_humanities_questions.csv', stream: 'HUMANITIES' },
];

function escapeSQL(str) {
  if (str === null || str === undefined) return 'NULL';
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "''");
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
  const lines = content.split('\n').filter((l) => l.trim().length > 0);
  const header = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    if (fields.length < 10) continue;
    const row = {};
    header.forEach((h, idx) => {
      row[h.trim()] = (fields[idx] || '').trim();
    });
    rows.push(row);
  }

  return rows;
}

function generateSQL() {
  const streamCounts = {};
  let totalRows = 0;
  let globalSeq = 0;
  const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  let sql = '';
  sql += '-- ============================================================\n';
  sql += '-- AptiPath360 V3 Grade 11/12 Question Bank Migration\n';
  sql += `-- Generated: ${new Date().toISOString()}\n`;
  sql += '-- Streams: PCM, PCB, COMMERCE, HUMANITIES\n';
  sql += '-- ============================================================\n\n';
  sql += 'USE robodynamics_db;\n';
  sql += 'START TRANSACTION;\n\n';

  sql += '-- ============================================================\n';
  sql += '-- PHASE 1: Add new columns to rd_ci_question_bank (safe)\n';
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
    { name: 'archived_at', type: 'DATETIME DEFAULT NULL' },
    { name: 'archive_reason', type: 'VARCHAR(255) DEFAULT NULL' },
    { name: 'archive_batch', type: 'VARCHAR(100) DEFAULT NULL' },
  ];
  sql += 'DELIMITER //\n';
  sql += 'DROP PROCEDURE IF EXISTS aptipath_add_columns//\n';
  sql += 'CREATE PROCEDURE aptipath_add_columns()\n';
  sql += 'BEGIN\n';
  for (const col of alterCols) {
    sql += '  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS\n';
    sql += "      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rd_ci_question_bank'\n";
    sql += `      AND COLUMN_NAME = '${col.name}') THEN\n`;
    sql += `    ALTER TABLE rd_ci_question_bank ADD COLUMN ${col.name} ${col.type};\n`;
    sql += '  END IF;\n';
  }
  sql += 'END//\n';
  sql += 'DELIMITER ;\n';
  sql += 'CALL aptipath_add_columns();\n';
  sql += 'DROP PROCEDURE IF EXISTS aptipath_add_columns;\n\n';

  sql += '-- ============================================================\n';
  sql += '-- PHASE 2: Archive existing active Grade 11/12 questions\n';
  sql += '-- ============================================================\n\n';
  sql += `SET @archive_batch = '${dateTag}_grade_11_12_refresh';\n\n`;
  sql += "UPDATE rd_ci_question_bank\n";
  sql += "   SET status = 'ARCHIVED',\n";
  sql += "       archived_at = NOW(),\n";
  sql += "       archive_reason = 'Replaced by refreshed Grade 11/12 stream-specific question set',\n";
  sql += "       archive_batch = @archive_batch\n";
  sql += " WHERE module_code = 'APTIPATH'\n";
  sql += "   AND assessment_version = 'v3'\n";
  sql += "   AND status = 'ACTIVE'\n";
  sql += "   AND (grade_level = 'GRADE_11_12' OR question_code LIKE 'APG11%');\n\n";

  sql += '-- ============================================================\n';
  sql += '-- PHASE 3: Insert Grade 11/12 questions by stream\n';
  sql += '-- ============================================================\n\n';

  for (const csvDef of CSV_FILES) {
    const filePath = path.join(CSV_DIR, csvDef.file);
    if (!fs.existsSync(filePath)) {
      sql += `-- WARNING: File not found: ${csvDef.file}\n\n`;
      streamCounts[csvDef.stream] = 0;
      continue;
    }

    const rows = processCSV(filePath);
    streamCounts[csvDef.stream] = rows.length;
    totalRows += rows.length;

    sql += `-- ---- ${csvDef.stream}: ${rows.length} questions from ${csvDef.file} ----\n\n`;

    for (const r of rows) {
      globalSeq++;
      const questionCode = r.ci_question_id || '';
      const moduleCode = 'APTIPATH';
      const assessmentVersion = 'v3';
      const gradeLevel = r.grade || 'GRADE_11_12';
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

      sql += 'INSERT INTO rd_ci_question_bank\n';
      sql += '  (module_code, assessment_version, question_code, sequence_no, section_code,\n';
      sql += '   question_type, question_text, options_json, correct_option, weightage,\n';
      sql += '   grade_level, bloom_level, difficulty, is_behavioral, career_cluster_map,\n';
      sql += '   adaptive_trigger, explanation, time_limit_secs,\n';
      sql += '   status, created_at, updated_at)\n';
      sql += 'VALUES\n';
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
      sql += `   ${parseInt(timeLimitSecs, 10) || 60},\n`;
      sql += "   'ACTIVE', NOW(), NOW())\n";
      sql += 'ON DUPLICATE KEY UPDATE\n';
      sql += '  sequence_no = VALUES(sequence_no),\n';
      sql += '  section_code = VALUES(section_code),\n';
      sql += '  question_type = VALUES(question_type),\n';
      sql += '  question_text = VALUES(question_text),\n';
      sql += '  options_json = VALUES(options_json),\n';
      sql += '  correct_option = VALUES(correct_option),\n';
      sql += '  weightage = VALUES(weightage),\n';
      sql += '  grade_level = VALUES(grade_level),\n';
      sql += '  bloom_level = VALUES(bloom_level),\n';
      sql += '  difficulty = VALUES(difficulty),\n';
      sql += '  is_behavioral = VALUES(is_behavioral),\n';
      sql += '  career_cluster_map = VALUES(career_cluster_map),\n';
      sql += '  adaptive_trigger = VALUES(adaptive_trigger),\n';
      sql += '  explanation = VALUES(explanation),\n';
      sql += '  time_limit_secs = VALUES(time_limit_secs),\n';
      sql += "  status = 'ACTIVE',\n";
      sql += '  archived_at = NULL,\n';
      sql += '  archive_reason = NULL,\n';
      sql += '  archive_batch = NULL,\n';
      sql += '  updated_at = NOW();\n\n';
    }
  }

  sql += '-- ============================================================\n';
  sql += '-- PHASE 4: Verification queries\n';
  sql += '-- ============================================================\n\n';
  sql += "-- Active counts for Grade 11/12 by stream\n";
  sql += "SELECT\n";
  sql += "  CASE\n";
  sql += "    WHEN question_code LIKE 'APG11PCM_%' THEN 'PCM'\n";
  sql += "    WHEN question_code LIKE 'APG11PCB_%' THEN 'PCB'\n";
  sql += "    WHEN question_code LIKE 'APG11COM_%' THEN 'COMMERCE'\n";
  sql += "    WHEN question_code LIKE 'APG11HUM_%' THEN 'HUMANITIES'\n";
  sql += "    ELSE 'UNKNOWN'\n";
  sql += "  END AS stream,\n";
  sql += "  COUNT(*) AS question_count\n";
  sql += "FROM rd_ci_question_bank\n";
  sql += "WHERE module_code = 'APTIPATH'\n";
  sql += "  AND assessment_version = 'v3'\n";
  sql += "  AND grade_level = 'GRADE_11_12'\n";
  sql += "  AND status = 'ACTIVE'\n";
  sql += "GROUP BY stream\n";
  sql += "ORDER BY stream;\n\n";
  sql += "-- Active counts by section\n";
  sql += "SELECT section_code, COUNT(*) AS cnt\n";
  sql += "FROM rd_ci_question_bank\n";
  sql += "WHERE module_code = 'APTIPATH'\n";
  sql += "  AND assessment_version = 'v3'\n";
  sql += "  AND grade_level = 'GRADE_11_12'\n";
  sql += "  AND status = 'ACTIVE'\n";
  sql += "GROUP BY section_code\n";
  sql += "ORDER BY section_code;\n\n";
  sql += '-- Archived count for this batch\n';
  sql += 'SELECT COUNT(*) AS archived_count\n';
  sql += 'FROM rd_ci_question_bank\n';
  sql += "WHERE module_code = 'APTIPATH'\n";
  sql += "  AND assessment_version = 'v3'\n";
  sql += "  AND status = 'ARCHIVED'\n";
  sql += '  AND archive_batch = @archive_batch;\n\n';
  sql += 'COMMIT;\n';
  sql += '-- END OF MIGRATION\n';

  return { sql, streamCounts, totalRows };
}

try {
  const { sql, streamCounts, totalRows } = generateSQL();
  const outputPath = path.resolve(OUTPUT_FILE);
  fs.writeFileSync(outputPath, sql, 'utf8');
  const lines = sql.split('\n').length;
  console.log(`SUCCESS: Generated ${lines} lines of SQL`);
  console.log(`Output: ${outputPath}`);
  for (const def of CSV_FILES) {
    console.log(`${def.stream}: ${streamCounts[def.stream] || 0} questions`);
  }
  console.log(`Total: ${totalRows} questions`);
} catch (err) {
  console.error('ERROR:', err.message);
  process.exit(1);
}
