param(
    [string]$ServerHost = "168.231.123.108",
    [string]$User = "root",
    [string]$Password = "",
    [string]$RemoteDir = "/opt/robodynamics/docs/db_backups",
    [string]$LocalDir = "",
    [int]$KeepLocal = 20,
    [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($LocalDir)) {
    $LocalDir = Join-Path $PSScriptRoot "..\docs\db_backups_prod"
}

if ([string]::IsNullOrWhiteSpace($Password)) {
    $Password = $env:RD_PROD_ROOT_PASSWORD
}
if ([string]::IsNullOrWhiteSpace($Password)) {
    throw "Provide -Password or set RD_PROD_ROOT_PASSWORD."
}

$plink = "C:\Program Files\PuTTY\plink.exe"
$pscp = "C:\Program Files\PuTTY\pscp.exe"
if (-not (Test-Path $plink)) { throw "plink.exe not found at $plink" }
if (-not (Test-Path $pscp)) { throw "pscp.exe not found at $pscp" }

New-Item -ItemType Directory -Path $LocalDir -Force | Out-Null

$remoteLatestCmd = "ls -1t $RemoteDir/robodynamics_db_*.sql.gz 2>/dev/null | head -n 1"
$latestRemote = & $plink -batch -pw $Password "$User@$ServerHost" $remoteLatestCmd
$latestRemote = ($latestRemote | Out-String).Trim()
if ([string]::IsNullOrWhiteSpace($latestRemote)) {
    throw "No remote backup found in $RemoteDir"
}

$latestName = Split-Path -Path $latestRemote -Leaf
$localGz = Join-Path $LocalDir $latestName
$remoteSha = "$latestRemote.sha256"
$localSha = "$localGz.sha256"

$shouldDownload = $Force -or -not (Test-Path $localGz)
if ($shouldDownload) {
    & $pscp -batch -pw $Password "$User@$ServerHost`:$latestRemote" "$localGz" | Out-Null
    & $pscp -batch -pw $Password "$User@$ServerHost`:$remoteSha" "$localSha" | Out-Null
} elseif (-not (Test-Path $localSha)) {
    & $pscp -batch -pw $Password "$User@$ServerHost`:$remoteSha" "$localSha" | Out-Null
}

# Verify checksum
$shaContent = Get-Content -Path $localSha -Raw
$expected = ($shaContent -split "\s+")[0].Trim().ToLowerInvariant()
$actual = (Get-FileHash -Path $localGz -Algorithm SHA256).Hash.ToLowerInvariant()
if ($expected -ne $actual) {
    throw "Checksum mismatch for $latestName (expected=$expected, actual=$actual)."
}

# Local retention
if ($KeepLocal -gt 0) {
    $allBackups = @(Get-ChildItem -Path $LocalDir -Filter "robodynamics_db_*.sql.gz" | Sort-Object LastWriteTime -Descending)
    if ($allBackups.Count -gt $KeepLocal) {
        $toDelete = @($allBackups | Select-Object -Skip $KeepLocal)
        foreach ($item in $toDelete) {
            Remove-Item -Path $item.FullName -Force -ErrorAction SilentlyContinue
            $shaToDelete = "$($item.FullName).sha256"
            if (Test-Path $shaToDelete) {
                Remove-Item -Path $shaToDelete -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Write-Output "SYNC_OK $localGz"
