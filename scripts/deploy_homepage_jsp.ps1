param(
    [string]$ServerHost = "168.231.123.108",
    [string]$User = "root",
    [string]$Pass = "Jatni@752050"
)

$views     = "C:\roboworkspace\robodynamics\src\main\webapp\WEB-INF\views"
$plink     = "plink"
$pscp      = "pscp"

function Scp-File([string]$Local, [string]$Remote) {
    Write-Host "  SCP $Local -> $Remote"
    $r = Start-Process $pscp -ArgumentList @("-batch","-pw",$Pass,$Local,"${User}@${ServerHost}:$Remote") -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "SCP failed for $Local" }
}

function Run-Remote([string]$Cmd) {
    $r = Start-Process $plink -ArgumentList @("-batch","-pw",$Pass,"${User}@${ServerHost}",$Cmd) -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "Remote command failed" }
}

Write-Host "=== Deploying home page JSPs ===" -ForegroundColor Cyan

Scp-File "$views\index.jsp"  "/tmp/rd_index.jsp"
Scp-File "$views\header.jsp" "/tmp/rd_header.jsp"

Write-Host "  Installing to Tomcat..."
Run-Remote "install -m644 /tmp/rd_index.jsp /opt/tomcat/webapps/ROOT/WEB-INF/views/index.jsp && install -m644 /tmp/rd_header.jsp /opt/tomcat/webapps/ROOT/WEB-INF/views/header.jsp && echo JSP_DEPLOYED"

Write-Host ""
Write-Host "Done! Home page live at: https://robodynamics.in/" -ForegroundColor Green
