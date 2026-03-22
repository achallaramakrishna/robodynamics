$ErrorActionPreference = "Stop"
$pw = if ($env:PROD_SSH_PASS) { $env:PROD_SSH_PASS } else { "Jatni@752050" }
$hostName = "168.231.123.108"
$user = "root"
$pscp = "C:\Program Files\PuTTY\pscp.exe"
& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\ai-tutor\web\app\student\course\[grade]\StudentCourseHubClient.tsx" "$user@${hostName}:/tmp/ms_student_course_hub_client.tsx"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: StudentCourseHubClient.tsx" }
