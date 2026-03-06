param(
    [string]$InputPath = "docs/career_roadmap.txt",
    [string]$OutputPath = "aptipath_career_roadmap_seed_from_txt_2026_03_03.sql",
    [string]$ModuleCode = "APTIPATH",
    [string]$AssessmentVersion = "v3"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Normalize-Text {
    param([string]$Value)

    if ($null -eq $Value) {
        return ""
    }

    $v = $Value
    $v = $v -replace "\uFEFF", ""

    # Unicode punctuation normalization.
    $v = $v.Replace([string][char]0x2013, "-")
    $v = $v.Replace([string][char]0x2014, "-")
    $v = $v.Replace([string][char]0x2018, "'")
    $v = $v.Replace([string][char]0x2019, "'")
    $v = $v.Replace([string][char]0x201C, '"')
    $v = $v.Replace([string][char]0x201D, '"')
    $v = $v.Replace([string][char]0x20B9, "INR ")

    # Common mojibake sequences from copy/paste workflows.
    $mojiDash = [string]([char]0x00E2) + [char]0x20AC + [char]0x201C
    $mojiEmDash = [string]([char]0x00E2) + [char]0x20AC + [char]0x201D
    $mojiQuote = [string]([char]0x00E2) + [char]0x20AC + [char]0x2122
    $mojiRupee = [string]([char]0x00E2) + [char]0x201A + [char]0x00B9
    $v = $v.Replace($mojiDash, "-")
    $v = $v.Replace($mojiEmDash, "-")
    $v = $v.Replace($mojiQuote, "'")
    $v = $v.Replace($mojiRupee, "INR ")

    # Keep final text ASCII and compact.
    $v = [regex]::Replace($v, "[^\x20-\x7E]", " ")
    $v = $v -replace "`t", " "
    $v = $v -replace "\s+", " "
    return $v.Trim()
}

function Normalize-CareerCode {
    param([string]$CareerName)
    $value = Normalize-Text $CareerName
    if ([string]::IsNullOrWhiteSpace($value)) {
        return ""
    }
    $value = $value.ToUpperInvariant()
    $value = [regex]::Replace($value, "[^A-Z0-9]+", "_")
    $value = [regex]::Replace($value, "_+", "_")
    return $value.Trim("_")
}

function Escape-Sql {
    param([string]$Value)
    $v = Normalize-Text $Value
    return $v.Replace("'", "''")
}

function Parse-CareerBlock {
    param(
        [int]$Sequence,
        [string]$CareerName,
        [string[]]$BlockLines
    )

    if ($BlockLines.Count -eq 0) {
        return $null
    }

    $lines = @()
    foreach ($raw in $BlockLines) {
        $line = Normalize-Text $raw
        if (-not [string]::IsNullOrWhiteSpace($line)) {
            $lines += $line
        }
    }
    if ($lines.Count -eq 0) {
        return $null
    }

    $overviewIndex = [Array]::IndexOf($lines, "Career Overview")
    $roadmapIndex = [Array]::IndexOf($lines, "General Roadmap")
    $upgradeIndex = [Array]::IndexOf($lines, "Upgrade to Pro for Details")
    if ($overviewIndex -lt 0 -or $roadmapIndex -lt 0 -or $upgradeIndex -lt 0) {
        return $null
    }
    if ($roadmapIndex -le $overviewIndex) {
        return $null
    }

    $overviewParts = @()
    for ($i = $overviewIndex + 1; $i -lt $roadmapIndex; $i++) {
        $part = Normalize-Text $lines[$i]
        if (-not [string]::IsNullOrWhiteSpace($part)) {
            $overviewParts += $part
        }
    }
    if ($overviewParts.Count -eq 0) {
        return $null
    }

    $overview = ($overviewParts -join " ").Trim()
    $salary = ""
    $salaryMatch = [regex]::Match($overview, "(?i)Starting salary\s*:\s*([^\.!\?]+(?:LPA|per annum)?)")
    if ($salaryMatch.Success) {
        $salary = "Starting salary: " + $salaryMatch.Groups[1].Value.Trim(". ").Trim()
    } else {
        $salary = "Starting salary varies by exam route, college quality, and skill portfolio."
    }

    $overviewCore = [regex]::Replace($overview, "(?i)\s*Starting salary\s*:\s*[^\.!\?]+[\.!\?]?", "")
    $overviewCore = Normalize-Text $overviewCore
    if ([string]::IsNullOrWhiteSpace($overviewCore)) {
        $overviewCore = $overview
    }
    $relevance = "2026-2036 relevance: " + $overviewCore

    $phases = @()
    $phaseRegex = "^(Foundation \([^)]+\)|Preparation \([^)]+\)|Higher Education \([^)]+\)|Skill Building ?& ?Experience|Career Launch \([^)]+\))\s*:\s*(.+)$"
    foreach ($line in $lines) {
        $m = [regex]::Match($line, $phaseRegex, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($m.Success) {
            $title = Normalize-Text $m.Groups[1].Value
            $detail = Normalize-Text $m.Groups[2].Value
            if (-not [string]::IsNullOrWhiteSpace($title) -and -not [string]::IsNullOrWhiteSpace($detail)) {
                $phases += [PSCustomObject]@{
                    Title = $title
                    Detail = $detail
                }
            }
        }
    }
    if ($phases.Count -lt 4) {
        return $null
    }

    $upgrade = ""
    for ($i = $upgradeIndex + 1; $i -lt $lines.Count; $i++) {
        $candidate = Normalize-Text $lines[$i]
        if (-not [string]::IsNullOrWhiteSpace($candidate)) {
            $upgrade = $candidate
            break
        }
    }
    if ([string]::IsNullOrWhiteSpace($upgrade)) {
        return $null
    }

    $careerCode = Normalize-CareerCode $CareerName
    if ([string]::IsNullOrWhiteSpace($careerCode)) {
        return $null
    }

    return [PSCustomObject]@{
        Sequence = $Sequence
        CareerName = Normalize-Text $CareerName
        CareerCode = $careerCode
        Overview = $overviewCore
        Relevance = $relevance
        Salary = $salary
        Phases = $phases
        Upgrade = $upgrade
    }
}

if (-not (Test-Path -Path $InputPath -PathType Leaf)) {
    throw "Input file not found: $InputPath"
}

$rawText = Get-Content -Path $InputPath -Raw -Encoding UTF8
$rawText = $rawText -replace "`r`n", "`n"
$lines = $rawText -split "`n"

$parsedEntries = @()
$idx = 0
while ($idx -lt $lines.Count) {
    $line = Normalize-Text $lines[$idx]
    $match = [regex]::Match($line, "^\s*(\d{1,3})\.\s+(.+?)\s*$")
    if (-not $match.Success) {
        $idx++
        continue
    }

    $sequence = [int]$match.Groups[1].Value
    $careerName = Normalize-Text $match.Groups[2].Value
    if ([string]::IsNullOrWhiteSpace($careerName)) {
        $idx++
        continue
    }

    $next = $idx + 1
    $blockLines = @()
    while ($next -lt $lines.Count) {
        $nextLine = Normalize-Text $lines[$next]
        if ([regex]::IsMatch($nextLine, "^\s*\d{1,3}\.\s+.+$")) {
            break
        }
        $blockLines += $lines[$next]
        $next++
    }

    $entry = Parse-CareerBlock -Sequence $sequence -CareerName $careerName -BlockLines $blockLines
    if ($null -ne $entry) {
        $parsedEntries += $entry
    }
    $idx = $next
}

if ($parsedEntries.Count -eq 0) {
    throw "No valid roadmap entries parsed from $InputPath"
}

# Keep latest parsed version for each career (removes repeated blocks).
$deduped = @{}
foreach ($entry in $parsedEntries) {
    $deduped[$entry.CareerCode] = $entry
}
$finalEntries = @($deduped.Values | Sort-Object CareerName)

$valueRows = @()
$careerCodes = @()
foreach ($entry in $finalEntries) {
    $codeSql = Escape-Sql $entry.CareerCode
    $careerCodes += "'" + $codeSql + "'"

    $valueRows += "('$ModuleCode','$AssessmentVersion','$codeSql','BASIC','ANY','OVERVIEW',1,'Career Overview','$(Escape-Sql $entry.Overview)','ACTIVE',NOW(),NOW())"
    $valueRows += "('$ModuleCode','$AssessmentVersion','$codeSql','BASIC','ANY','RELEVANCE',1,'2026-2036 Relevance','$(Escape-Sql $entry.Relevance)','ACTIVE',NOW(),NOW())"
    $valueRows += "('$ModuleCode','$AssessmentVersion','$codeSql','BASIC','ANY','SALARY',1,'Starting Salary Band','$(Escape-Sql $entry.Salary)','ACTIVE',NOW(),NOW())"

    $phaseOrder = 1
    foreach ($phase in $entry.Phases) {
        $valueRows += "('$ModuleCode','$AssessmentVersion','$codeSql','BASIC','ANY','PHASE',$phaseOrder,'$(Escape-Sql $phase.Title)','$(Escape-Sql $phase.Detail)','ACTIVE',NOW(),NOW())"
        $phaseOrder++
    }

    $valueRows += "('$ModuleCode','$AssessmentVersion','$codeSql','BASIC','ANY','UPGRADE',1,'Upgrade to Pro','$(Escape-Sql $entry.Upgrade)','ACTIVE',NOW(),NOW())"
}

$sql = @()
$sql += "USE robodynamics_db;"
$sql += ""
$sql += "START TRANSACTION;"
$sql += ""
$sql += "DELETE FROM rd_ci_career_roadmap"
$sql += "WHERE module_code = '$ModuleCode'"
$sql += "  AND assessment_version = '$AssessmentVersion'"
$sql += "  AND plan_tier = 'BASIC'"
$sql += "  AND grade_stage = 'ANY'"
$sql += "  AND career_code IN (" + ($careerCodes -join ",") + ");"
$sql += ""
$sql += "INSERT INTO rd_ci_career_roadmap"
$sql += "  (module_code, assessment_version, career_code, plan_tier, grade_stage, section_type, item_order, title, detail_text, status, created_at, updated_at)"
$sql += "VALUES"
$sql += "  " + ($valueRows -join ",`n  ")
$sql += "ON DUPLICATE KEY UPDATE"
$sql += "  title = VALUES(title),"
$sql += "  detail_text = VALUES(detail_text),"
$sql += "  status = 'ACTIVE',"
$sql += "  updated_at = NOW();"
$sql += ""
$sql += "COMMIT;"
$sql += ""

Set-Content -Path $OutputPath -Value ($sql -join "`n") -Encoding UTF8

Write-Host ("Parsed entries: " + $parsedEntries.Count)
Write-Host ("Unique careers written: " + $finalEntries.Count)
Write-Host ("Output SQL: " + $OutputPath)
