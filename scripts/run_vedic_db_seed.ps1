<#
.SYNOPSIS
    Run the Vedic Math G4-G8 LMS DB seed on production.
.DESCRIPTION
    - Adds course_type column to rd_courses (if missing)
    - Inserts 5 MindSutra Vedic Math courses (G4-G8)
    - Creates course offerings (1 year, Rs.1999 each)
    - Lists all users
    - Enrolls existing student-role users in all 5 courses
.EXAMPLE
    $env:PROD_SSH_PASS = "yourpassword"
    .\scripts\run_vedic_db_seed.ps1
#>

param(
    [string]$ServerHost   = "168.231.123.108",
    [string]$User         = "root",
    [string]$MysqlUser    = "root",
    [string]$MysqlPass    = "achalla",
    [string]$MysqlDb      = "robodynamics_db",
    [string]$RepoRoot     = "$PSScriptRoot\.."
)

$ErrorActionPreference = "Stop"

function Get-SshPass {
    if ($env:PROD_SSH_PASS) { return $env:PROD_SSH_PASS }
    $secure = Read-Host "Enter prod SSH password" -AsSecureString
    return [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
}

function Scp-File([string]$Local, [string]$Remote) {
    $pw = Get-SshPass
    Write-Host "  SCP $Local -> ${User}@${ServerHost}:$Remote" -ForegroundColor Gray
    $r = Start-Process -FilePath pscp -ArgumentList @("-batch","-pw",$pw,$Local,"${User}@${ServerHost}:$Remote") `
        -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "SCP failed: $Local" }
}

function Run-Remote([string]$Cmd) {
    $pw = Get-SshPass
    $r = Start-Process -FilePath plink -ArgumentList @("-batch","-pw",$pw,"${User}@${ServerHost}",$Cmd) `
        -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "Remote command failed: $Cmd" }
}

Write-Host ""
Write-Host "=== MindSutra Vedic Math G4-G8 DB Seed ===" -ForegroundColor Cyan
Write-Host "Server : $ServerHost"
Write-Host "DB     : $MysqlDb"
Write-Host ""

# 1. Upload SQL file
$sqlFile = "$RepoRoot\vedic_math_g4_g8_lms_seed_2026_03_16.sql"
Write-Host "Step 1: Uploading SQL file..." -ForegroundColor Yellow
Scp-File $sqlFile "/tmp/vedic_math_seed.sql"
Write-Host "  Uploaded." -ForegroundColor Green

# 2. Run SQL on server and capture output
Write-Host ""
Write-Host "Step 2: Running SQL on production MySQL..." -ForegroundColor Yellow
Write-Host "        (Output will appear below)" -ForegroundColor Gray
Write-Host "--------------------------------------------------------"

$mysqlCmd = "mysql -u${MysqlUser} -p${MysqlPass} ${MysqlDb} < /tmp/vedic_math_seed.sql 2>&1; echo EXIT_CODE:$?"

$pw = Get-SshPass
$outputFile = "$RepoRoot\tmp_vedic_seed_output.txt"

# Run and capture output to file
$proc = Start-Process -FilePath plink `
    -ArgumentList @("-batch","-pw",$pw,"${User}@${ServerHost}",$mysqlCmd) `
    -NoNewWindow -Wait -PassThru -RedirectStandardOutput $outputFile -RedirectStandardError "$RepoRoot\tmp_vedic_seed_err.txt"

# Show output
if (Test-Path $outputFile) {
    Get-Content $outputFile | ForEach-Object { Write-Host $_ }
}
if (Test-Path "$RepoRoot\tmp_vedic_seed_err.txt") {
    $err = Get-Content "$RepoRoot\tmp_vedic_seed_err.txt"
    if ($err) {
        Write-Host "STDERR:" -ForegroundColor Red
        $err | ForEach-Object { Write-Host $_ -ForegroundColor Red }
    }
}

Write-Host "--------------------------------------------------------"
Write-Host ""

if ($proc.ExitCode -eq 0) {
    Write-Host "=== DB SEED COMPLETE ===" -ForegroundColor Green
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Review the user list above and note student user_ids"
    Write-Host "  2. Run the full deploy: .\scripts\deploy_ai_tutor.ps1"
    Write-Host "  3. Test demo: https://robodynamics.in/vedic-math/grade-5"
} else {
    Write-Host "=== DB SEED FAILED (exit $($proc.ExitCode)) ===" -ForegroundColor Red
    Write-Host "Check tmp_vedic_seed_err.txt for details"
}
