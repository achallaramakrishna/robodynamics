$ErrorActionPreference = "Stop"
$pw = if ($env:PROD_SSH_PASS) { $env:PROD_SSH_PASS } else { "Jatni@752050" }
$hostName = "168.231.123.108"
$user = "root"
$plink = "C:\Program Files\PuTTY\plink.exe"
$pscp = "C:\Program Files\PuTTY\pscp.exe"

$uploads = @(
  @{ local = "C:\roboworkspace\robodynamics\ai-tutor\web\app\ai-tutor\demo\page.tsx"; remote = "/tmp/ms_ai_demo_page.tsx" },
  @{ local = "C:\roboworkspace\robodynamics\ai-tutor\web\app\student\course\[grade]\StudentCourseHubClient.tsx"; remote = "/tmp/ms_student_course_client.tsx" },
  @{ local = "C:\roboworkspace\robodynamics\ai-tutor\web\app\checkout\success\page.tsx"; remote = "/tmp/ms_checkout_success.tsx" }
)

foreach ($item in $uploads) {
  & $pscp -batch -pw $pw $item.local "$user@${hostName}:$($item.remote)"
  if ($LASTEXITCODE -ne 0) { throw "Upload failed: $($item.local)" }
}
