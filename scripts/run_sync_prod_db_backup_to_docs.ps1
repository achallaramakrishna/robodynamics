Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$syncScript = Join-Path $PSScriptRoot "sync_prod_db_backup_to_docs.ps1"
$logDir = Join-Path $PSScriptRoot "..\docs\db_backups_prod"
$logFile = Join-Path $logDir "sync.log"

New-Item -ItemType Directory -Path $logDir -Force | Out-Null

$stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $logFile -Value "[$stamp] START sync_prod_db_backup_to_docs"

try {
    $result = & $syncScript 2>&1 | Out-String
    $stampDone = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $logFile -Value $result.TrimEnd()
    Add-Content -Path $logFile -Value "[$stampDone] DONE"
}
catch {
    $stampErr = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $logFile -Value "[$stampErr] ERROR $($_.Exception.Message)"
    throw
}

