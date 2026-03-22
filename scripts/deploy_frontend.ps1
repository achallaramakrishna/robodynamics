<#
.SYNOPSIS
    Fast frontend-only deploy — uploads changed web code, builds, restarts web service.
    Use this for TutorClient / CSS / page / lib changes.
    Use deploy_ai_tutor.ps1 (full) only when content JSONs, SVGs, or backend also changed.
.EXAMPLE
    $env:PROD_SSH_PASS = "yourpassword"
    .\scripts\deploy_frontend.ps1
#>

param(
    [string]$ServerHost = "168.231.123.108",
    [string]$User       = "root",
    [string]$RepoRoot   = "$PSScriptRoot\.."
)

$ErrorActionPreference = "Stop"
$ai  = "$RepoRoot\ai-tutor"
$web = "$ai\web"

function Get-Password {
    if ($env:PROD_SSH_PASS) { return $env:PROD_SSH_PASS }
    $s = Read-Host "Enter prod SSH password" -AsSecureString
    return [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($s))
}

function Scp([string]$Local, [string]$Remote) {
    $pw = Get-Password
    Write-Host "  -> $([System.IO.Path]::GetFileName($Local))"
    $r = Start-Process pscp -ArgumentList @("-batch","-pw",$pw,$Local,"${User}@${ServerHost}:$Remote") -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "SCP failed: $Local" }
}

function Remote([string]$Cmd) {
    $pw = Get-Password
    $r = Start-Process plink -ArgumentList @("-batch","-pw",$pw,"${User}@${ServerHost}",$Cmd) -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "Remote command failed" }
}

Write-Host "=== Frontend Deploy ===" -ForegroundColor Cyan

# ── Upload changed web source files ─────────────────────────────────────────
Write-Host "Uploading frontend source ..." -ForegroundColor Yellow
Scp "$web\lib\types.ts"                                        "/tmp/fe_types.ts"
Scp "$web\lib\avatarVoices.ts"                                 "/tmp/fe_avatarVoices.ts"
Scp "$web\app\ai-tutor\tutor\TutorClient.tsx"                  "/tmp/fe_TutorClient.tsx"
Scp "$web\app\ai-tutor\tutor\tutor.css"                        "/tmp/fe_tutor.css"
Scp "$web\app\ai-tutor\tutor\page.tsx"                         "/tmp/fe_tutor_page.tsx"
Scp "$web\app\ai-tutor\tutor\RobotAvatar.tsx"                  "/tmp/fe_RobotAvatar.tsx"
Scp "$web\app\ai-tutor\demo\page.tsx"                          "/tmp/fe_demo_page.tsx"

# ── Upload backend files that changed (question-loop fix etc.) ───────────────
Write-Host "Uploading backend source ..." -ForegroundColor Yellow
Scp "$ai\tutor-api\app\main.py"                                "/tmp/fe_main.py"
Scp "$ai\tutor-api\app\models.py"                              "/tmp/fe_models.py"

Write-Host "Installing, building, restarting ..." -ForegroundColor Cyan

$remote = @'
set -euo pipefail
WEB=/opt/robodynamics/ai-tutor/web

# Install frontend files
install -D -m 644 /tmp/fe_types.ts          $WEB/lib/types.ts
install -D -m 644 /tmp/fe_avatarVoices.ts   $WEB/lib/avatarVoices.ts
install -D -m 644 /tmp/fe_TutorClient.tsx   $WEB/app/ai-tutor/tutor/TutorClient.tsx
install -D -m 644 /tmp/fe_tutor.css         $WEB/app/ai-tutor/tutor/tutor.css
install -D -m 644 /tmp/fe_tutor_page.tsx    $WEB/app/ai-tutor/tutor/page.tsx
install -D -m 644 /tmp/fe_RobotAvatar.tsx   $WEB/app/ai-tutor/tutor/RobotAvatar.tsx
install -D -m 644 /tmp/fe_demo_page.tsx    $WEB/app/ai-tutor/demo/page.tsx

# Install backend files
API=/opt/robodynamics/ai-tutor/tutor-api/app
install -D -m 644 /tmp/fe_main.py           $API/main.py
install -D -m 644 /tmp/fe_models.py         $API/models.py

echo "FILES_INSTALLED"

# Build Next.js
cd $WEB
npm run build >/tmp/rd_fe_build_latest.log 2>&1 || (tail -n 120 /tmp/rd_fe_build_latest.log; exit 1)
echo "BUILD_OK"

# Sync standalone output (required for node server.js)
cp -r $WEB/public      $WEB/.next/standalone/
cp -r $WEB/.next/static $WEB/.next/standalone/.next/
echo "STANDALONE_SYNCED"

# Restart services
systemctl restart rd-ai-tutor-api
systemctl restart rd-ai-tutor-web
sleep 2

echo "API=$(systemctl is-active rd-ai-tutor-api)"
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"
curl -ksS -o /dev/null -w "HEALTH=%{http_code}\n" "https://robodynamics.in/ai-tutor-api/health" || true
'@

Remote $remote

Write-Host "=== Frontend deploy complete ===" -ForegroundColor Green
