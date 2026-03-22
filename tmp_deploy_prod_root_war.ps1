param(
    [string]$ServerHost = "168.231.123.108",
    [string]$User = "root",
    [string]$WarPath = "C:\roboworkspace\robodynamics\target\robodynamics-0.0.1-SNAPSHOT.war"
)

$ErrorActionPreference = "Stop"
$Password = "Jatni@752050"

if (-not (Test-Path $WarPath)) {
    throw "WAR not found: $WarPath"
}

$pscp = "C:\Program Files\PuTTY\pscp.exe"
$plink = "C:\Program Files\PuTTY\plink.exe"

$scp = Start-Process -FilePath $pscp -ArgumentList @(
    "-batch",
    "-pw", $Password,
    $WarPath,
    "${User}@${ServerHost}:/tmp/robodynamics-root.war"
) -NoNewWindow -PassThru -Wait

if ($scp.ExitCode -ne 0) {
    throw "WAR upload failed"
}

$remote = @'
set -euo pipefail
systemctl stop tomcat || systemctl stop tomcat9 || true
rm -rf /opt/tomcat/webapps/ROOT /opt/tomcat/webapps/ROOT.war
install -m 644 /tmp/robodynamics-root.war /opt/tomcat/webapps/ROOT.war
systemctl start tomcat || systemctl start tomcat9
sleep 12
systemctl is-active tomcat || systemctl is-active tomcat9
'@

$run = Start-Process -FilePath $plink -ArgumentList @(
    "-batch",
    "-pw", $Password,
    "${User}@${ServerHost}",
    $remote
) -NoNewWindow -PassThru -Wait

if ($run.ExitCode -ne 0) {
    throw "Remote deploy failed"
}

Write-Output "PROD_WAR_DEPLOYED"
