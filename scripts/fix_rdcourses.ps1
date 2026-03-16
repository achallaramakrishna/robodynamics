<#
.SYNOPSIS
    Phase A: DESCRIBE rd_courses → fetch schema.
    Phase B: ALTER TABLE + INSERT vedic_math_g4-g8.
#>

param(
    [ValidateSet("A","B")]
    [string]$Phase = "A"
)

$ErrorActionPreference = "Stop"
$ServerHost = "168.231.123.108"
$User       = "root"
$Pass       = "Jatni@752050"
$plink      = "C:\Program Files\PuTTY\plink.exe"
$pscp       = "C:\Program Files\PuTTY\pscp.exe"

function Run-Remote([string]$Cmd) {
    Write-Host "`n>>> $Cmd" -ForegroundColor DarkCyan
    $r = Start-Process -FilePath $plink `
        -ArgumentList @("-batch","-pw",$Pass,"${User}@${ServerHost}",$Cmd) `
        -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "Remote command failed (exit $($r.ExitCode))" }
}

if ($Phase -eq "A") {
    Write-Host "`n=== PHASE A: Inspecting rd_courses schema ===" -ForegroundColor Cyan

    $schemaSQL = "$PSScriptRoot\schema_check.sql"
    @"
DESCRIBE rd_courses;
SELECT * FROM rd_courses LIMIT 5;
"@ | Out-File -FilePath $schemaSQL -Encoding utf8

    # SCP SQL file up
    $r = Start-Process -FilePath $pscp `
        -ArgumentList @("-batch","-pw",$Pass,$schemaSQL,"${User}@${ServerHost}:/tmp/schema_check.sql") `
        -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "SCP schema_check.sql failed" }

    # Run it, pipe output to a file
    Run-Remote "mysql -u root -p'Jatni@752050' robodynamics_db < /tmp/schema_check.sql > /tmp/rd_courses_schema.txt 2>&1"

    # SCP result back
    $outFile = "$PSScriptRoot\rd_courses_schema.txt"
    $r = Start-Process -FilePath $pscp `
        -ArgumentList @("-batch","-pw",$Pass,"${User}@${ServerHost}:/tmp/rd_courses_schema.txt",$outFile) `
        -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "SCP rd_courses_schema.txt back failed" }

    Write-Host "`n=== rd_courses schema ===" -ForegroundColor Green
    Get-Content $outFile | ForEach-Object { Write-Host $_ }
}

if ($Phase -eq "B") {
    Write-Host "`n=== PHASE B: ALTER + INSERT vedic_math G4-G8 ===" -ForegroundColor Cyan

    $fixSQL = "$PSScriptRoot\rdcourses_vedic_fix.sql"
    @"
-- Step 1: Add course_type column if missing
ALTER TABLE rd_courses ADD COLUMN IF NOT EXISTS course_type VARCHAR(50) NULL COMMENT 'AI_TUTOR, VIDEO, etc.';

-- Step 2: Insert G4-G8 MindSutra AI Tutor courses (skip if name already exists)
INSERT INTO rd_courses (course_name, course_type, course_description, shortDescription, grade_range, category, is_active, is_featured, course_status)
SELECT * FROM (SELECT
  'MindSutra Grade 4 Vedic Math','AI_TUTOR',
  'CBSE Grade 4 Vedic Math AI Tutor - complements, tables 11-19, doubling, near-100, criss-cross multiplication',
  'Grade 4 Vedic Math with AI tutor - mental math shortcuts for 9-10 year olds',
  '4','Mathematics',1,0,'active') t
WHERE NOT EXISTS (SELECT 1 FROM rd_courses WHERE course_name='MindSutra Grade 4 Vedic Math');

INSERT INTO rd_courses (course_name, course_type, course_description, shortDescription, grade_range, category, is_active, is_featured, course_status)
SELECT * FROM (SELECT
  'MindSutra Grade 5 Vedic Math','AI_TUTOR',
  'CBSE Grade 5 Vedic Math AI Tutor - Nikhilam 3-digit, criss-cross, fractions, decimals, flag division',
  'Grade 5 Vedic Math with AI tutor - advanced mental math for 10-11 year olds',
  '5','Mathematics',1,0,'active') t
WHERE NOT EXISTS (SELECT 1 FROM rd_courses WHERE course_name='MindSutra Grade 5 Vedic Math');

INSERT INTO rd_courses (course_name, course_type, course_description, shortDescription, grade_range, category, is_active, is_featured, course_status)
SELECT * FROM (SELECT
  'MindSutra Grade 6 Vedic Math','AI_TUTOR',
  'CBSE Grade 6 Vedic Math AI Tutor - vinculum, integers, HCF/LCM, squares, Paravartya, algebra',
  'Grade 6 Vedic Math with AI tutor - vinculum and algebra for 11-12 year olds',
  '6','Mathematics',1,0,'active') t
WHERE NOT EXISTS (SELECT 1 FROM rd_courses WHERE course_name='MindSutra Grade 6 Vedic Math');

INSERT INTO rd_courses (course_name, course_type, course_description, shortDescription, grade_range, category, is_active, is_featured, course_status)
SELECT * FROM (SELECT
  'MindSutra Grade 7 Vedic Math','AI_TUTOR',
  'CBSE Grade 7 Vedic Math AI Tutor - squaring, rational numbers, linear equations, cubics, identities',
  'Grade 7 Vedic Math with AI tutor - algebra and identities for 12-13 year olds',
  '7','Mathematics',1,0,'active') t
WHERE NOT EXISTS (SELECT 1 FROM rd_courses WHERE course_name='MindSutra Grade 7 Vedic Math');

INSERT INTO rd_courses (course_name, course_type, course_description, shortDescription, grade_range, category, is_active, is_featured, course_status)
SELECT * FROM (SELECT
  'MindSutra Grade 8 Vedic Math','AI_TUTOR',
  'CBSE Grade 8 Vedic Math AI Tutor - square roots, advanced identities, simultaneous equations, divisibility',
  'Grade 8 Vedic Math with AI tutor - advanced algebra for 13-14 year olds',
  '8','Mathematics',1,0,'active') t
WHERE NOT EXISTS (SELECT 1 FROM rd_courses WHERE course_name='MindSutra Grade 8 Vedic Math');

-- Show AI_TUTOR courses
SELECT course_id, course_name, course_type, grade_range, is_active FROM rd_courses WHERE course_type='AI_TUTOR' ORDER BY course_id;
"@ | Out-File -FilePath $fixSQL -Encoding utf8

    # SCP SQL file up
    $r = Start-Process -FilePath $pscp `
        -ArgumentList @("-batch","-pw",$Pass,$fixSQL,"${User}@${ServerHost}:/tmp/rdcourses_vedic_fix.sql") `
        -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "SCP rdcourses_vedic_fix.sql failed" }

    # Run it
    Run-Remote "mysql -u root -p'Jatni@752050' robodynamics_db < /tmp/rdcourses_vedic_fix.sql > /tmp/rdcourses_fix_result.txt 2>&1"

    # SCP result back
    $resultFile = "$PSScriptRoot\rdcourses_fix_result.txt"
    $r = Start-Process -FilePath $pscp `
        -ArgumentList @("-batch","-pw",$Pass,"${User}@${ServerHost}:/tmp/rdcourses_fix_result.txt",$resultFile) `
        -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "SCP result back failed" }

    Write-Host "`n=== INSERT result ===" -ForegroundColor Green
    Get-Content $resultFile | ForEach-Object { Write-Host $_ }
}
