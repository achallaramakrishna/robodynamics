param(
    [string]$ServerHost = "168.231.123.108",
    [string]$User = "root",
    [string]$RepoRoot = "C:\roboworkspace\robodynamics"
)

$ErrorActionPreference = "Stop"
$Password = "Jatni@752050"
$pscp = "C:\Program Files\PuTTY\pscp.exe"
$plink = "C:\Program Files\PuTTY\plink.exe"

$footer = Join-Path $RepoRoot "src\main\webapp\WEB-INF\views\footer.jsp"

if (-not (Test-Path $footer)) {
    throw "footer.jsp not found"
}

$scp = Start-Process -FilePath $pscp -ArgumentList @(
    "-batch",
    "-pw", $Password,
    $footer,
    "${User}@${ServerHost}:/tmp/rd_footer.jsp"
) -NoNewWindow -PassThru -Wait

if ($scp.ExitCode -ne 0) {
    throw "SCP failed for footer.jsp"
}

$remote = @'
set -euo pipefail
install -m 644 /tmp/rd_footer.jsp /opt/tomcat/webapps/ROOT/WEB-INF/views/footer.jsp
echo "FOOTER_DEPLOYED"
'@

$run = Start-Process -FilePath $plink -ArgumentList @(
    "-batch",
    "-pw", $Password,
    "${User}@${ServerHost}",
    $remote
) -NoNewWindow -PassThru -Wait

if ($run.ExitCode -ne 0) {
    throw "Remote footer deploy failed"
}

Write-Output "FOOTER_DEPLOYED"
