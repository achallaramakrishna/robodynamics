<#
.SYNOPSIS
    Step 1: Insert MindSutra Vedic Math G4-G8 courses into rd_courses on prod.
    Step 2: Run full AI Tutor deploy (grade chapters + SVGs + frontend).
#>

$ErrorActionPreference = "Stop"
$ServerHost = "168.231.123.108"
$User = "root"
$Pass = "Jatni@752050"
$plink = "C:\Program Files\PuTTY\plink.exe"

function Run-Remote([string]$Cmd) {
    Write-Host "`n>>> $Cmd" -ForegroundColor DarkCyan
    $r = Start-Process -FilePath $plink `
        -ArgumentList @("-batch","-pw",$Pass,"${User}@${ServerHost}",$Cmd) `
        -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "Remote command failed (exit $($r.ExitCode))" }
}

# ── Step 1: Register MindSutra G4-G8 courses ─────────────────────────────────
Write-Host "`n=== STEP 1: Registering vedic_math_g4 through g8 in rd_courses ===" -ForegroundColor Cyan

# Write SQL to a temp file to avoid quoting issues over SSH
$sqlFile = "$PSScriptRoot\mindsutrag4_g8_insert.sql"
@"
INSERT IGNORE INTO rd_courses (course_id, course_name, course_type, description, is_active, created_at) VALUES
  ('vedic_math_g4', 'MindSutra Grade 4 Vedic Math', 'AI_TUTOR', 'CBSE Grade 4 Vedic Math complements tables 11-19 doubling near-100 criss-cross', 1, NOW()),
  ('vedic_math_g5', 'MindSutra Grade 5 Vedic Math', 'AI_TUTOR', 'CBSE Grade 5 Vedic Math Nikhilam 3-digit criss-cross fractions decimals flag division', 1, NOW()),
  ('vedic_math_g6', 'MindSutra Grade 6 Vedic Math', 'AI_TUTOR', 'CBSE Grade 6 Vedic Math vinculum integers HCF LCM squares Paravartya algebra', 1, NOW()),
  ('vedic_math_g7', 'MindSutra Grade 7 Vedic Math', 'AI_TUTOR', 'CBSE Grade 7 Vedic Math squaring rational numbers linear equations cubics identities', 1, NOW()),
  ('vedic_math_g8', 'MindSutra Grade 8 Vedic Math', 'AI_TUTOR', 'CBSE Grade 8 Vedic Math square roots advanced identities simultaneous equations divisibility', 1, NOW());
SELECT course_id, course_name, is_active FROM rd_courses WHERE course_id LIKE 'vedic_math%' ORDER BY course_id;
"@ | Out-File -FilePath $sqlFile -Encoding utf8

# SCP the SQL file then execute it
$pw = $Pass
Write-Host "  SCP SQL file to server..."
$r = Start-Process -FilePath "C:\Program Files\PuTTY\pscp.exe" `
    -ArgumentList @("-batch","-pw",$pw,$sqlFile,"${User}@${ServerHost}:/tmp/mindsutrag4_g8_insert.sql") `
    -NoNewWindow -PassThru -Wait
if ($r.ExitCode -ne 0) { throw "SCP of SQL file failed" }

Run-Remote "mysql -u root -p'Jatni@752050' robodynamics_db < /tmp/mindsutrag4_g8_insert.sql"
Write-Host "SQL done." -ForegroundColor Green

# ── Step 2: Run full AI Tutor deploy ─────────────────────────────────────────
Write-Host "`n=== STEP 2: Running AI Tutor deploy (chapters + SVGs + frontend) ===" -ForegroundColor Cyan
$env:PROD_SSH_PASS = $Pass

$deployScript = Join-Path $PSScriptRoot "deploy_ai_tutor.ps1"
& powershell.exe -ExecutionPolicy Bypass -File $deployScript

Write-Host "`n=== ALL DONE - MindSutra G4-G8 live ===" -ForegroundColor Green
