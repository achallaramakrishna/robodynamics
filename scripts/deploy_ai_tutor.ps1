<#
.SYNOPSIS
    Deploy AI Tutor changes (backend + frontend) to production.
.DESCRIPTION
    SCPs changed files to /tmp on server, then runs remote install+build+restart.
    Set $env:PROD_SSH_PASS before running, or you will be prompted.
.EXAMPLE
    $env:PROD_SSH_PASS = "yourpassword"
    .\scripts\deploy_ai_tutor.ps1
#>

param(
    [string]$ServerHost = "168.231.123.108",
    [string]$User = "Jatni",
    [string]$RepoRoot = "$PSScriptRoot\.."
)

$ErrorActionPreference = "Stop"

function Get-Password {
    if ($env:PROD_SSH_PASS) { return $env:PROD_SSH_PASS }
    $secure = Read-Host "Enter prod SSH password" -AsSecureString
    return [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
}

function Scp-File([string]$Local, [string]$Remote) {
    $pw = Get-Password
    Write-Host "  SCP $Local -> $Remote"
    $r = Start-Process -FilePath pscp -ArgumentList @("-batch","-pw",$pw,$Local,"${User}@${ServerHost}:$Remote") -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "SCP failed for $Local" }
}

function Run-Remote([string]$Cmd) {
    $pw = Get-Password
    $r = Start-Process -FilePath plink -ArgumentList @("-batch","-pw",$pw,"${User}@${ServerHost}",$Cmd) -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "Remote command failed" }
}

$ai = "$RepoRoot\ai-tutor"

Write-Host "=== AI Tutor Deploy ===" -ForegroundColor Cyan
Write-Host "Uploading files to /tmp ..."

Scp-File "$ai\tutor-api\app\main.py"                                                               "/tmp/ai_main.py"
Scp-File "$ai\tutor-api\app\services\generic_course_engine.py"                                    "/tmp/ai_generic_course_engine.py"
Scp-File "$ai\web\app\ai-tutor\vedic\VedicTutorClient.tsx"                                        "/tmp/ai_VedicTutorClient.tsx"
Scp-File "$ai\tutor-api\content-template\vedic_math\chapter\L2_DOUBLING_HALVING.json"            "/tmp/ai_L2_DOUBLING_HALVING.json"

Write-Host "Installing files, building, restarting ..." -ForegroundColor Cyan

$remote = @'
set -euo pipefail

install -D -m 644 /tmp/ai_main.py                    /opt/robodynamics/ai-tutor/tutor-api/app/main.py
install -D -m 644 /tmp/ai_generic_course_engine.py   /opt/robodynamics/ai-tutor/tutor-api/app/services/generic_course_engine.py
install -D -m 644 /tmp/ai_VedicTutorClient.tsx        /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/VedicTutorClient.tsx
install -D -m 644 /tmp/ai_L2_DOUBLING_HALVING.json   /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L2_DOUBLING_HALVING.json

echo "FILES_INSTALLED"

cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_latest.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_latest.log; exit 1)

echo "BUILD_OK"

systemctl restart rd-ai-tutor-api
systemctl restart rd-ai-tutor-web
sleep 2

echo "API=$(systemctl is-active rd-ai-tutor-api)"
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"

curl -ksS -o /dev/null -w "HEALTH=%{http_code}\n" "https://robodynamics.in/ai-tutor-api/health" || true
'@

Run-Remote $remote

Write-Host "=== Deploy complete ===" -ForegroundColor Green
