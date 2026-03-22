$ErrorActionPreference = "Stop"
$pw = if ($env:PROD_SSH_PASS) { $env:PROD_SSH_PASS } else { "Jatni@752050" }
$hostName = "168.231.123.108"
$user = "root"
$plink = "C:\Program Files\PuTTY\plink.exe"
$pscp = "C:\Program Files\PuTTY\pscp.exe"
& powershell -ExecutionPolicy Bypass -File C:\roboworkspace\robodynamics\tmp_upload_autostart_fix.ps1
& $pscp -batch -pw $pw C:\roboworkspace\robodynamics\tmp_remote_autostart_fix.sh "$user@${hostName}:/tmp/remote_autostart_fix.sh"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: remote script" }
& $plink -batch -pw $pw "$user@${hostName}" -m C:\roboworkspace\robodynamics\tmp_remote_autostart_fix.sh
if ($LASTEXITCODE -ne 0) { throw "Remote autostart deploy failed" }
