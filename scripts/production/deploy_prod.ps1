<#
.SYNOPSIS
    Uploads the latest WAR and performs the Tomcat rotation on prod via plink/pscp.

.DESCRIPTION
    Reads the SSH password from the PROD_SSH_PASS environment variable and uses it
    to drive `pscp`/`plink`. The script uploads the local WAR to /root, backs up the
    previous ROOT.war, deploys the new one, fixes ownership, and restarts Tomcat.

.NOTES
    - Requires `plink` and `pscp` on PATH.
    - Set `$env:PROD_SSH_PASS` before running, or the script will prompt for it.
    - Adjust parameters below if your host/user/paths differ.
    - This script is intentionally idempotent; it exits early if the WAR upload fails.
#>

param(
    [string]$ServerHost = "168.231.123.108",
    [string]$User = "Jatni",
    [string]$LocalWar = "target/robodynamics-0.0.1-SNAPSHOT.war",
    [string]$RemoteTempWar = "/root/robodynamics-0.0.1-SNAPSHOT.war",
    [string]$RemoteRootWar = "/opt/tomcat/webapps/ROOT.war",
    [string]$BackupDir = "/opt/tomcat/webapps/backup"
)

function Get-Password {
    if (-not $env:PROD_SSH_PASS) {
        $secure = Read-Host "Enter PROD SSH password" -AsSecureString
        return [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
    }
    return $env:PROD_SSH_PASS
}

function Run-Plink {
    param([string]$RemoteCommand)
    $password = Get-Password
    $arguments = @("-batch", "-pw", $password, "$User@$ServerHost", $RemoteCommand)
    $process = Start-Process -FilePath plink -ArgumentList $arguments -NoNewWindow -PassThru -Wait
    if ($process.ExitCode -ne 0) {
        throw "plink failed with exit code $($process.ExitCode)"
    }
}

function Upload-War {
    $password = Get-Password
    $arguments = @("-batch", "-pw", $password, $LocalWar, "${User}@${ServerHost}:$RemoteTempWar")
    $process = Start-Process -FilePath pscp -ArgumentList $arguments -NoNewWindow -PassThru -Wait
    if ($process.ExitCode -ne 0) {
        throw "pscp failed with exit code $($process.ExitCode)"
    }
}

if (-not (Test-Path $LocalWar)) {
    throw "Local WAR not found at $LocalWar; run package first."
}

Upload-War

$cmd = @"
set -e
sudo mkdir -p $BackupDir
sudo systemctl stop tomcat
TIMESTAMP=`$(date +%Y%m%d_%H%M%S)
sudo cp $RemoteRootWar $BackupDir/ROOT.war.`$TIMESTAMP.bak
sudo rm -rf /opt/tomcat/webapps/ROOT
sudo mv $RemoteTempWar $RemoteRootWar
sudo chown tomcat:tomcat $RemoteRootWar
sudo systemctl start tomcat
sudo systemctl status tomcat
"@

Run-Plink $cmd
