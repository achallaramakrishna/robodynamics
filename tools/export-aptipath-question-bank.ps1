param(
    [string]$DbUser = "root",
    [Parameter(Mandatory = $true)]
    [string]$DbPassword,
    [string]$DbHost = "localhost",
    [int]$DbPort = 3306,
    [string]$DbName = "robodynamics_db",
    [string]$AssessmentVersion = "v2",
    [string]$OutputPath = "docs/data/aptipath_question_bank_v2_readable.json",
    [string]$SummaryPath = "docs/data/aptipath_question_bank_v2_summary.json"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$mysqlshPath = "C:\Program Files\MySQL\MySQL Shell 8.0\bin\mysqlsh.exe"
if (-not (Test-Path $mysqlshPath)) {
    throw "mysqlsh not found at '$mysqlshPath'."
}

$workspaceRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$mysqlshConfigPath = Join-Path $workspaceRoot ".mysqlsh"
New-Item -ItemType Directory -Force -Path $mysqlshConfigPath | Out-Null
$env:MYSQLSH_USER_CONFIG_HOME = $mysqlshConfigPath

$outputFullPath = Join-Path $workspaceRoot $OutputPath
$summaryFullPath = Join-Path $workspaceRoot $SummaryPath
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $outputFullPath) | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $summaryFullPath) | Out-Null

$query = @"
SELECT
    ci_question_id,
    module_code,
    assessment_version,
    question_code,
    sequence_no,
    section_code,
    question_type,
    question_text,
    options_json,
    correct_option,
    weightage,
    status,
    created_at,
    updated_at
FROM rd_ci_question_bank
WHERE assessment_version='${AssessmentVersion}'
ORDER BY sequence_no;
"@

$dbUri = "{0}:{1}@{2}:{3}/{4}" -f $DbUser, $DbPassword, $DbHost, $DbPort, $DbName
$tempPath = Join-Path $env:TEMP ("aptipath_qb_{0}.json" -f [guid]::NewGuid().ToString("N"))

try {
    & $mysqlshPath --result-format=json/array --sql --uri $dbUri --execute $query 2>$null | Set-Content -Path $tempPath -Encoding UTF8
    if ($LASTEXITCODE -ne 0) {
        throw "mysqlsh query failed."
    }

    $records = Get-Content -Path $tempPath -Raw | ConvertFrom-Json
    if (-not $records) {
        $records = @()
    }

    $records | ConvertTo-Json -Depth 25 | Set-Content -Path $outputFullPath -Encoding UTF8

    $summary = [ordered]@{
        generatedAt        = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
        databaseName       = $DbName
        assessmentVersion  = $AssessmentVersion
        totalQuestions     = @($records).Count
        sectionBreakdown   = @()
    }

    $sectionGroups = $records | Group-Object -Property section_code | Sort-Object Name
    foreach ($group in $sectionGroups) {
        $summary.sectionBreakdown += [ordered]@{
            sectionCode = $group.Name
            count       = $group.Count
        }
    }

    $summary | ConvertTo-Json -Depth 10 | Set-Content -Path $summaryFullPath -Encoding UTF8
}
finally {
    if (Test-Path $tempPath) {
        Remove-Item -Path $tempPath -Force
    }
}

Write-Host ("Export complete: {0}" -f $outputFullPath)
Write-Host ("Summary complete: {0}" -f $summaryFullPath)
