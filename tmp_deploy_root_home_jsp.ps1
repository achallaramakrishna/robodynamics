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

$views = Join-Path $RepoRoot "src\main\webapp\WEB-INF\views"

Scp-File "$views\home.jsp" "/tmp/rd_home.jsp"
Scp-File "$views\header.jsp" "/tmp/rd_header.jsp"

$remote = @'
set -euo pipefail
install -m 644 /tmp/rd_home.jsp /opt/tomcat/webapps/ROOT/WEB-INF/views/home.jsp
install -m 644 /tmp/rd_header.jsp /opt/tomcat/webapps/ROOT/WEB-INF/views/header.jsp
echo "JSP_DEPLOYED"
'@

Run-Remote $remote
