$ErrorActionPreference = "Stop"
$pw = if ($env:PROD_SSH_PASS) { $env:PROD_SSH_PASS } else { "Jatni@752050" }
$hostName = "168.231.123.108"
$user = "root"
$plink = "C:\Program Files\PuTTY\plink.exe"
$pscp = "C:\Program Files\PuTTY\pscp.exe"
$localScript = "C:\roboworkspace\robodynamics\tmp_remote_p0_prod_deploy.sh"
& $pscp -batch -pw $pw $localScript "$user@${hostName}:/tmp/remote_p0_prod_deploy.sh"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: remote deploy script" }
& $plink -batch -pw $pw "$user@${hostName}" -m $localScript
if ($LASTEXITCODE -ne 0) { throw "Remote deploy failed" }
