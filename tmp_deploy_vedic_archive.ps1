param(
    [string]$ServerHost = "168.231.123.108",
    [string]$User = "root",
    [string]$RepoRoot = "C:\roboworkspace\robodynamics"
)

$ErrorActionPreference = "Stop"

function Get-Password {
    if ($env:PROD_SSH_PASS) { return $env:PROD_SSH_PASS }
    throw "PROD_SSH_PASS is required"
}

function Scp-File([string]$Local, [string]$Remote) {
    $pw = Get-Password
    $r = Start-Process -FilePath pscp -ArgumentList @("-batch","-pw",$pw,$Local,"${User}@${ServerHost}:$Remote") -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "SCP failed for $Local" }
}

function Run-Remote([string]$Cmd) {
    $pw = Get-Password
    $r = Start-Process -FilePath plink -ArgumentList @("-batch","-pw",$pw,"${User}@${ServerHost}",$Cmd) -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "Remote command failed" }
}

$ai = Join-Path $RepoRoot "ai-tutor"
Scp-File "$ai\tutor-api\app\main.py" "/tmp/ai_main.py"
Scp-File "$ai\tutor-api\app\services\engine_registry.py" "/tmp/ai_engine_registry.py"
Scp-File "$ai\web\app\ai-tutor\tutor\TutorClient.tsx" "/tmp/ai_TutorClient.tsx"

$remote = @'
set -euo pipefail
install -D -m 644 /tmp/ai_main.py /opt/robodynamics/ai-tutor/tutor-api/app/main.py
install -D -m 644 /tmp/ai_engine_registry.py /opt/robodynamics/ai-tutor/tutor-api/app/services/engine_registry.py
install -D -m 644 /tmp/ai_TutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_archive.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_archive.log; exit 1)
cp -r /opt/robodynamics/ai-tutor/web/public /opt/robodynamics/ai-tutor/web/.next/standalone/
cp -r /opt/robodynamics/ai-tutor/web/.next/static /opt/robodynamics/ai-tutor/web/.next/standalone/.next/
systemctl restart rd-ai-tutor-api
systemctl restart rd-ai-tutor-web
sleep 2
echo "API=$(systemctl is-active rd-ai-tutor-api)"
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"
curl -ksS -o /dev/null -w "HEALTH=%{http_code}\n" "https://robodynamics.in/ai-tutor-api/health" || true
'@

Run-Remote $remote
