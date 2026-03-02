#!/usr/bin/env node
/**
 * Career Catalog SQL Generator
 * Reads career_signal_matrix.csv and generates SQL to refresh rd_ci_career_catalog
 */
const fs = require('fs');
const path = require('path');

const CSV_FILE = path.join(__dirname, 'career_signal_matrix.csv');
const OUTPUT_FILE = path.join(__dirname, '..', 'aptipath_v3_career_catalog_refresh.sql');

function escapeSQL(str) {
  if (!str) return 'NULL';
  return str.replace(/\\/g, '\\\\').replace(/'/g, "''");
}

function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && !inQuotes) { inQuotes = true; continue; }
    if (ch === '"' && inQuotes) {
      if (i + 1 < line.length && line[i + 1] === '"') { current += '"'; i++; continue; }
      inQuotes = false; continue;
    }
    if (ch === ',' && !inQuotes) { fields.push(current); current = ''; continue; }
    current += ch;
  }
  fields.push(current);
  return fields;
}

const content = fs.readFileSync(CSV_FILE, 'utf8');
const lines = content.split('\n').filter(l => l.trim().length > 0);
const header = parseCSVLine(lines[0]);
const rows = [];
for (let i = 1; i < lines.length; i++) {
  const fields = parseCSVLine(lines[i]);
  if (fields.length < 5) continue;
  const row = {};
  header.forEach((h, idx) => { row[h.trim()] = (fields[idx] || '').trim(); });
  rows.push(row);
}

let sql = '';
sql += '-- ============================================================\n';
sql += '-- AptiPath360 V3 Career Catalog Refresh\n';
sql += '-- Generated: ' + new Date().toISOString().split('T')[0] + '\n';
sql += '-- Total Careers: ' + rows.length + '\n';
sql += '-- ============================================================\n\n';
sql += 'USE robodynamics_db;\n';
sql += 'START TRANSACTION;\n\n';

// Archive existing
sql += '-- Archive existing career catalog entries\n';
sql += "UPDATE rd_ci_career_catalog\n";
sql += "   SET status = 'ARCHIVED', updated_at = NOW()\n";
sql += " WHERE module_code = 'APTIPATH' AND assessment_version = 'v3' AND status = 'ACTIVE';\n\n";

// Insert fresh
sql += '-- Insert fresh career catalog from career_signal_matrix.csv\n\n';

for (let i = 0; i < rows.length; i++) {
  const r = rows[i];
  const careerCode = (r.career_cluster + '_' + r.career_name).toUpperCase()
    .replace(/[^A-Z0-9]/g, '_').replace(/__+/g, '_').replace(/^_|_$/g, '');

  // Map min levels based on stream
  let minMath = 0, minPhysics = 0, minChem = 0, minBio = 0, minLang = 0;
  const stream = (r.stream_required || '').toUpperCase();
  if (stream.includes('PCM')) { minMath = 3; minPhysics = 3; minChem = 2; }
  if (stream.includes('PCB')) { minBio = 3; minChem = 2; }
  if (stream.includes('COMMERCE')) { minMath = 2; }
  if (stream.includes('HUMANITIES')) { minLang = 3; }

  // Determine target phase
  let targetPhase = 'ALL';
  if (r.post_12_specialization && r.post_12_specialization.includes('Engineering')) targetPhase = 'FOUNDATION,SECONDARY';
  else if (r.post_12_specialization && r.post_12_specialization.includes('Medical')) targetPhase = 'FOUNDATION,SECONDARY';

  sql += `INSERT INTO rd_ci_career_catalog\n`;
  sql += `  (module_code, assessment_version, career_code, career_name, cluster_name,\n`;
  sql += `   fit_strategy, pathway_hint, exam_hint, prerequisite_summary,\n`;
  sql += `   required_subjects_csv, entrance_exams_csv,\n`;
  sql += `   min_math_level, min_physics_level, min_chemistry_level, min_biology_level, min_language_level,\n`;
  sql += `   target_phase, sort_order, status, created_at, updated_at)\n`;
  sql += `VALUES\n`;
  sql += `  ('APTIPATH', 'v3',\n`;
  sql += `   '${escapeSQL(careerCode)}',\n`;
  sql += `   '${escapeSQL(r.career_name)}',\n`;
  sql += `   '${escapeSQL(r.career_cluster)}',\n`;
  sql += `   '${escapeSQL(r.grade_8_9_signals)}',\n`;
  sql += `   '${escapeSQL(r.education_path)}',\n`;
  sql += `   '${escapeSQL(r.key_exams)}',\n`;
  sql += `   '${escapeSQL((r.stream_required || '') + ' stream | Growth: ' + (r.projected_growth_india || 'N/A') + ' (India) | Entry salary: ' + (r.salary_range_entry_inr || 'N/A'))}',\n`;
  sql += `   '${escapeSQL(r.stream_required)}',\n`;
  sql += `   '${escapeSQL(r.key_exams)}',\n`;
  sql += `   ${minMath}, ${minPhysics}, ${minChem}, ${minBio}, ${minLang},\n`;
  sql += `   '${escapeSQL(targetPhase)}',\n`;
  sql += `   ${i + 1}, 'ACTIVE', NOW(), NOW());\n\n`;
}

// Verification
sql += '-- Verification\n';
sql += "SELECT cluster_name, COUNT(*) AS career_count\n";
sql += "  FROM rd_ci_career_catalog\n";
sql += " WHERE module_code = 'APTIPATH' AND assessment_version = 'v3' AND status = 'ACTIVE'\n";
sql += " GROUP BY cluster_name ORDER BY cluster_name;\n\n";
sql += 'COMMIT;\n';

fs.writeFileSync(path.resolve(OUTPUT_FILE), sql, 'utf8');
console.log(`SUCCESS: Generated career catalog SQL for ${rows.length} careers`);
console.log(`Output: ${path.resolve(OUTPUT_FILE)}`);
