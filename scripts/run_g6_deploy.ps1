<#
.SYNOPSIS
    Step 1: Insert G6 course into rd_courses on prod.
    Step 2: Run full AI Tutor deploy (chapters + routing files).
#>

$ErrorActionPreference = "Stop"
$ServerHost = "168.231.123.108"
$User = "root"
$Pass = "Jatni@752050"
$plink = "C:\Program Files\PuTTY\plink.exe"
$pscp  = "C:\Program Files\PuTTY\pscp.exe"

function Run-Remote([string]$Cmd) {
    Write-Host "`n>>> $Cmd" -ForegroundColor DarkCyan
    $r = Start-Process -FilePath $plink `
        -ArgumentList @("-batch","-pw",$Pass,"${User}@${ServerHost}",$Cmd) `
        -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "Remote command failed (exit $($r.ExitCode))" }
}

# ── Step 1: Register G6 course ────────────────────────────────────────────────
Write-Host "`n=== STEP 1: Registering aptitude_reasoning_g6 in rd_courses ===" -ForegroundColor Cyan

$sqlInsert = @"
mysql -u root -p'Jatni@752050' robodynamics_db -e "INSERT IGNORE INTO rd_courses (course_id, course_name, course_type, description, is_active, created_at) VALUES ('aptitude_reasoning_g6', 'MindSpark Grade 6 Aptitude Reasoning', 'AI_TUTOR', 'Series coding-decoding analogies Venn diagrams clocks data tables for Grade 6', 1, NOW());"
mysql -u root -p'Jatni@752050' robodynamics_db -e "SELECT course_id, course_name, is_active FROM rd_courses WHERE course_id LIKE 'aptitude%' ORDER BY course_id;"
"@

Run-Remote $sqlInsert
Write-Host "SQL done." -ForegroundColor Green

# ── Step 2: Run full AI Tutor deploy ─────────────────────────────────────────
Write-Host "`n=== STEP 2: Running AI Tutor deploy ===" -ForegroundColor Cyan
$env:PROD_SSH_PASS = $Pass

$deployScript = Join-Path $PSScriptRoot "deploy_ai_tutor.ps1"
& powershell.exe -ExecutionPolicy Bypass -File $deployScript

Write-Host "`n=== ALL DONE ===" -ForegroundColor Green
