$ErrorActionPreference = "Stop"
$pw = if ($env:PROD_SSH_PASS) { $env:PROD_SSH_PASS } else { "Jatni@752050" }
$hostName = "168.231.123.108"
$user = "root"
$pscp = "C:\Program Files\PuTTY\pscp.exe"
& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\app\services\generic_course_engine.py" "$user@${hostName}:/tmp/ms_generic_course_engine.py"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: generic_course_engine.py" }
