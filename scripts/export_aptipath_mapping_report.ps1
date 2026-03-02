param(
    [string]$DbUser = "root",
    [string]$DbPassword = "achalla",
    [string]$DbName = "robodynamics_db",
    [string]$OutputDir = "docs"
)

$ErrorActionPreference = "Stop"

$mysqlsh = "C:\Program Files\MySQL\MySQL Shell 8.0\bin\mysqlsh.exe"
if (-not (Test-Path $mysqlsh)) {
    throw "mysqlsh not found at: $mysqlsh"
}

if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

function Invoke-NdjsonQuery {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Sql
    )
    $lines = & $mysqlsh --sql --result-format=json/raw -u $DbUser "-p$DbPassword" -D $DbName -e $Sql 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "mysqlsh query failed."
    }
    $rows = @()
    foreach ($line in $lines) {
        $trimmed = [string]$line
        if ($trimmed -match '^\s*\{') {
            $rows += ($trimmed | ConvertFrom-Json)
        }
    }
    return $rows
}

$questionSql = @"
SELECT
  ci_question_id,
  question_code,
  section_code,
  question_type,
  sequence_no,
  weightage
FROM rd_ci_question_bank
WHERE module_code='APTIPATH'
  AND assessment_version='v3'
  AND status='ACTIVE'
ORDER BY sequence_no, ci_question_id;
"@

$primaryCareerSql = @"
SELECT
  ci_career_catalog_id,
  career_code,
  career_name,
  cluster_name,
  target_phase,
  status
FROM rd_ci_career_catalog
WHERE module_code='APTIPATH'
  AND assessment_version='v3'
  AND status='ACTIVE'
  AND career_code REGEXP '^AP3_CAR_[0-9]{4}$'
  AND CAST(RIGHT(career_code, 4) AS UNSIGNED) BETWEEN 1 AND 65
ORDER BY CAST(RIGHT(career_code, 4) AS UNSIGNED);
"@

$allCareerSql = @"
SELECT COUNT(*) AS active_career_count
FROM rd_ci_career_catalog
WHERE module_code='APTIPATH'
  AND assessment_version='v3'
  AND status='ACTIVE';
"@

$questions = Invoke-NdjsonQuery -Sql $questionSql
$primaryCareers = Invoke-NdjsonQuery -Sql $primaryCareerSql
$activeCareerCountRow = Invoke-NdjsonQuery -Sql $allCareerSql | Select-Object -First 1

$combos = New-Object System.Collections.Generic.List[object]
foreach ($q in $questions) {
    foreach ($c in $primaryCareers) {
        $combos.Add([PSCustomObject]@{
                question_id       = $q.ci_question_id
                question_code     = $q.question_code
                section_code      = $q.section_code
                question_type     = $q.question_type
                sequence_no       = $q.sequence_no
                weightage         = $q.weightage
                career_catalog_id = $c.ci_career_catalog_id
                career_code       = $c.career_code
                career_name       = $c.career_name
                cluster_name      = $c.cluster_name
                target_phase      = $c.target_phase
                mapping_scope     = "PRIMARY_65"
            })
    }
}

$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$csvPath = Join-Path $OutputDir "aptipath_mapping_combinations_primary65_$stamp.csv"
$summaryPath = Join-Path $OutputDir "aptipath_mapping_validation_summary_$stamp.json"

$combos | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8

$summary = [PSCustomObject]@{
    generated_at_utc           = (Get-Date).ToUniversalTime().ToString("o")
    database_name              = $DbName
    module_code                = "APTIPATH"
    assessment_version         = "v3"
    active_question_count      = @($questions).Count
    active_career_count_total  = [int]$activeCareerCountRow.active_career_count
    primary_65_career_count    = @($primaryCareers).Count
    expected_primary_65_count  = 65
    combination_count          = @($combos).Count
    primary_65_complete        = (@($primaryCareers).Count -eq 65)
    question_catalog_available = (@($questions).Count -gt 0)
}

$summary | ConvertTo-Json -Depth 5 | Set-Content -Path $summaryPath -Encoding UTF8

Write-Output ("MAPPING_CSV=" + $csvPath)
Write-Output ("MAPPING_SUMMARY=" + $summaryPath)
Write-Output ("QUESTION_COUNT=" + $summary.active_question_count)
Write-Output ("PRIMARY65_COUNT=" + $summary.primary_65_career_count)
Write-Output ("COMBINATION_COUNT=" + $summary.combination_count)
