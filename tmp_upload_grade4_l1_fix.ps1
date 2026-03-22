$ErrorActionPreference = "Stop"
$pw = if ($env:PROD_SSH_PASS) { $env:PROD_SSH_PASS } else { "Jatni@752050" }
$hostName = "168.231.123.108"
$user = "root"
$pscp = "C:\Program Files\PuTTY\pscp.exe"
$uploads = @(
  @{ local = "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\app\services\rule_engine.py"; remote = "/tmp/ms_rule_engine.py" },
  @{ local = "C:\roboworkspace\robodynamics\ai-tutor\web\app\ai-tutor\tutor\TutorClient.tsx"; remote = "/tmp/ms_TutorClient.tsx" }
)
foreach ($item in $uploads) {
  & $pscp -batch -pw $pw $item.local "$user@${hostName}:$($item.remote)"
  if ($LASTEXITCODE -ne 0) { throw "Upload failed: $($item.local)" }
}
