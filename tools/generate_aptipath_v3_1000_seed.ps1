param(
    [string]$OutputSqlPath = "aptipath_v3_seed_1000_plus_2026_02_22.sql",
    [int]$StartSequence = 4000
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$rand = [System.Random]::new(20260222)

function Escape-Sql {
    param([string]$Text)
    if ($null -eq $Text) { return "" }
    return $Text.Replace("'", "''")
}

function New-Option {
    param(
        [string]$Code,
        [string]$Label
    )
    return [ordered]@{
        code = $Code
        label = $Label
    }
}

function Shuffle-Options {
    param([object[]]$Options)
    $arr = @($Options)
    for ($i = $arr.Count - 1; $i -gt 0; $i--) {
        $j = $rand.Next(0, $i + 1)
        $tmp = $arr[$i]
        $arr[$i] = $arr[$j]
        $arr[$j] = $tmp
    }
    $codes = @("A", "B", "C", "D")
    for ($k = 0; $k -lt $arr.Count; $k++) {
        $arr[$k]["code"] = $codes[$k]
    }
    return ,$arr
}

$sqlLines = New-Object System.Collections.Generic.List[string]

function Add-SqlLine {
    param([string]$Sql)
    $sqlLines.Add($Sql)
}

function Add-Question {
    param(
        [string]$QuestionCode,
        [int]$SequenceNo,
        [string]$SectionCode,
        [string]$QuestionType,
        [string]$QuestionText,
        [object[]]$Options,
        [string]$CorrectCode
    )

    $optJson = $Options | ConvertTo-Json -Compress
    $moduleCode = "APTIPATH"
    $version = "v3"
    $weightage = "1.00"
    $status = "ACTIVE"
    $qText = Escape-Sql $QuestionText
    $jsonEsc = Escape-Sql $optJson
    $correctSql = if ([string]::IsNullOrWhiteSpace($CorrectCode)) { "NULL" } else { "'" + (Escape-Sql $CorrectCode) + "'" }

    Add-SqlLine ("INSERT INTO rd_ci_question_bank " +
        "(module_code, assessment_version, question_code, sequence_no, section_code, question_type, question_text, options_json, correct_option, media_image_url, media_video_url, media_animation_url, weightage, status) VALUES (" +
        "'{0}','{1}','{2}',{3},'{4}','{5}','{6}','{7}',{8},NULL,NULL,NULL,{9},'{10}');" -f
        $moduleCode, $version, $QuestionCode, $SequenceNo, $SectionCode, $QuestionType, $qText, $jsonEsc, $correctSql, $weightage, $status)
}

function Build-CoreAptitudeQuestion {
    param([int]$Index)

    $typeIndex = $Index % 4
    if ($typeIndex -eq 0) {
        $unit = $rand.Next(9, 41)
        $baseQty = $rand.Next(12, 30)
        $askQty = $rand.Next(5, 24)
        $total = $unit * $baseQty
        $correct = $unit * $askQty
        $q = "Core aptitude: If {0} items cost {1} rupees, what is the cost of {2} items?" -f $baseQty, $total, $askQty
        $vals = @($correct, ($correct + $unit), ([Math]::Max(1, ($correct - $unit))), ($correct + ($unit * 2)))
    } elseif ($typeIndex -eq 1) {
        $base = $rand.Next(120, 801)
        $pct = @(5, 10, 15, 20, 25, 30, 35) | Get-Random
        $correct = [int]($base + (($base * $pct) / 100))
        $q = "Core aptitude: A quantity is {0}. After a {1}% increase, what is the new value?" -f $base, $pct
        $vals = @($correct, [int]($base + (($base * ($pct - 5)) / 100)), [int]($base + (($base * ($pct + 5)) / 100)), [int]($base + (($base * ($pct + 10)) / 100)))
    } elseif ($typeIndex -eq 2) {
        $start = $rand.Next(6, 28)
        $diff = $rand.Next(2, 9)
        $a = $start
        $b = $start + $diff
        $c = $b + $diff
        $d = $c + $diff
        $correct = $d + $diff
        $q = "Core aptitude: Find the next number in the sequence: {0}, {1}, {2}, {3}, ?" -f $a, $b, $c, $d
        $vals = @($correct, ($correct + 1), ($correct + 2), ($correct - 1))
    } else {
        $verbalSet = @(
            @{ Stem = "Choose the word closest in meaning to 'meticulous'."; Correct = "Careful"; D1 = "Careless"; D2 = "Rapid"; D3 = "Noisy" },
            @{ Stem = "Choose the word opposite in meaning to 'transparent'."; Correct = "Opaque"; D1 = "Visible"; D2 = "Smooth"; D3 = "Flexible" },
            @{ Stem = "Choose the best completion: 'He was known for his ____ explanation, so everyone understood.'"; Correct = "clear"; D1 = "vague"; D2 = "silent"; D3 = "random" },
            @{ Stem = "Choose the word closest in meaning to 'resilient'."; Correct = "Adaptable"; D1 = "Fragile"; D2 = "Rigid"; D3 = "Uncertain" }
        )
        $item = $verbalSet[$rand.Next(0, $verbalSet.Count)]
        $q = "Core aptitude: {0}" -f $item.Stem
        $vals = @($item.Correct, $item.D1, $item.D2, $item.D3)
    }

    $options = @()
    if ($typeIndex -le 2) {
        foreach ($v in $vals) { $options += New-Option -Code "X" -Label ([string]$v) }
    } else {
        foreach ($v in $vals) { $options += New-Option -Code "X" -Label $v }
    }
    $options = Shuffle-Options $options
    $correctCode = ($options | Where-Object { $_.label -eq [string]$vals[0] } | Select-Object -First 1).code
    if ($typeIndex -eq 3) {
        $correctCode = ($options | Where-Object { $_.label -eq $vals[0] } | Select-Object -First 1).code
    }
    return [ordered]@{ Text = $q; Options = $options; Correct = $correctCode }
}

function Build-AppliedQuestion {
    param([int]$Index)
    $sets = @(
        @{ Stem = "Applied challenge: You scored low in one chapter test. What is the best next step?"; Best = "Review errors, classify mistake types, and create a 7-day fix plan."; B = "Ignore it and move to new topics."; C = "Only re-read notes once."; D = "Memorize answers without analysis." },
        @{ Stem = "Applied challenge: You have 2 hours before a mock test. What is the best approach?"; Best = "Do a timed mixed set and review mistakes for 20 minutes."; B = "Watch random videos only."; C = "Attempt one hard question repeatedly."; D = "Skip revision and rest the whole time." },
        @{ Stem = "Applied challenge: You feel panic before a difficult exam. Best immediate action?"; Best = "Use a 3-minute breathing reset and start with medium-difficulty questions."; B = "Leave the test."; C = "Scroll social media."; D = "Spend 20 minutes on one hard problem." },
        @{ Stem = "Applied challenge: Your study plan keeps failing after day 3. What should you do?"; Best = "Reduce scope, lock daily minimum targets, and track completion visibly."; B = "Make a bigger plan."; C = "Wait for motivation."; D = "Study only when tests are near." }
    )
    $row = $sets[$Index % $sets.Count]
    $options = Shuffle-Options @(
        (New-Option -Code "X" -Label $row.Best),
        (New-Option -Code "X" -Label $row.B),
        (New-Option -Code "X" -Label $row.C),
        (New-Option -Code "X" -Label $row.D)
    )
    $correctCode = ($options | Where-Object { $_.label -eq $row.Best } | Select-Object -First 1).code
    return [ordered]@{ Text = $row.Stem; Options = $options; Correct = $correctCode }
}

function Build-ScaleQuestion {
    param(
        [string]$SectionCode,
        [int]$Index
    )
    $stemMap = @{
        "INTEREST_WORK" = @(
            "Interest and work: I stay engaged for long periods when solving open-ended problems.",
            "Interest and work: I enjoy building projects that combine creativity and logic.",
            "Interest and work: I prefer tasks where I can explain ideas to others clearly.",
            "Interest and work: I naturally explore career possibilities beyond standard options."
        )
        "VALUES_MOTIVATION" = @(
            "Values and motivation: Long-term impact matters more to me than short-term rewards.",
            "Values and motivation: I can stay committed to a goal even when progress is slow.",
            "Values and motivation: I value disciplined effort more than quick results.",
            "Values and motivation: I am willing to try unfamiliar paths if they fit my strengths."
        )
        "LEARNING_BEHAVIOR" = @(
            "Learning behavior: I complete revision cycles on schedule.",
            "Learning behavior: I maintain an error log and use it for improvement.",
            "Learning behavior: I can study consistently even when I am not in the mood.",
            "Learning behavior: I recover quickly after a poor test score."
        )
        "CAREER_REALITY" = @(
            "Career reality: I can handle uncertainty while still taking focused action.",
            "Career reality: I can communicate my goals clearly to parents and mentors.",
            "Career reality: I can balance pressure with healthy routines.",
            "Career reality: I am ready to invest sustained effort for difficult career goals."
        )
    }
    $stems = $stemMap[$SectionCode]
    $text = $stems[$Index % $stems.Count]
    $options = @(
        (New-Option -Code "A" -Label "Strongly agree"),
        (New-Option -Code "B" -Label "Agree"),
        (New-Option -Code "C" -Label "Not sure"),
        (New-Option -Code "D" -Label "Disagree")
    )
    return [ordered]@{ Text = $text; Options = $options; Correct = $null }
}

function Build-AIQuestion {
    param([int]$Index)
    $rows = @(
        @{ Stem = "AI readiness: When AI gives an answer, what is the best academic practice?"; Best = "Verify with textbook steps or trusted sources before using it."; B = "Use it directly because AI is always right."; C = "Skip checking if it looks fluent."; D = "Copy it without understanding." },
        @{ Stem = "AI readiness: Best way to prompt AI for exam preparation?"; Best = "Ask for stepwise reasoning, alternate methods, and common mistakes."; B = "Ask only for final answers."; C = "Use very vague prompts."; D = "Generate random content without context." },
        @{ Stem = "AI readiness: How should you use AI for writing assignments?"; Best = "Use it for structure ideas, then write in your own words with citations."; B = "Paste AI output unchanged."; C = "Avoid references entirely."; D = "Use AI to bypass learning." },
        @{ Stem = "AI readiness: If two AI tools disagree on the same problem, what should you do?"; Best = "Compare steps, validate with authoritative material, and resolve logically."; B = "Choose the longer answer."; C = "Pick randomly."; D = "Avoid the topic completely." }
    )
    $row = $rows[$Index % $rows.Count]
    $options = Shuffle-Options @(
        (New-Option -Code "X" -Label $row.Best),
        (New-Option -Code "X" -Label $row.B),
        (New-Option -Code "X" -Label $row.C),
        (New-Option -Code "X" -Label $row.D)
    )
    $correctCode = ($options | Where-Object { $_.label -eq $row.Best } | Select-Object -First 1).code
    return [ordered]@{ Text = $row.Stem; Options = $options; Correct = $correctCode }
}

$targetAdds = [ordered]@{
    CORE_APTITUDE = 220
    APPLIED_CHALLENGE = 170
    INTEREST_WORK = 100
    VALUES_MOTIVATION = 90
    LEARNING_BEHAVIOR = 80
    AI_READINESS = 70
    CAREER_REALITY = 70
}

$prefix = @{
    CORE_APTITUDE = "AP3X_CA_"
    APPLIED_CHALLENGE = "AP3X_AC_"
    INTEREST_WORK = "AP3X_IW_"
    VALUES_MOTIVATION = "AP3X_VM_"
    LEARNING_BEHAVIOR = "AP3X_LB_"
    AI_READINESS = "AP3X_AR_"
    CAREER_REALITY = "AP3X_CR_"
}

Add-SqlLine "START TRANSACTION;"
Add-SqlLine "DELETE FROM rd_ci_question_bank WHERE module_code='APTIPATH' AND assessment_version='v3' AND question_code LIKE 'AP3X_%';"

$seq = $StartSequence
foreach ($section in $targetAdds.Keys) {
    $count = [int]$targetAdds[$section]
    for ($i = 1; $i -le $count; $i++) {
        $code = "{0}{1}" -f $prefix[$section], $i.ToString("0000")
        if ($section -eq "CORE_APTITUDE") {
            $q = Build-CoreAptitudeQuestion -Index $i
        } elseif ($section -eq "APPLIED_CHALLENGE") {
            $q = Build-AppliedQuestion -Index $i
        } elseif ($section -eq "AI_READINESS") {
            $q = Build-AIQuestion -Index $i
        } else {
            $q = Build-ScaleQuestion -SectionCode $section -Index $i
        }
        Add-Question -QuestionCode $code -SequenceNo $seq -SectionCode $section -QuestionType "MCQ" -QuestionText $q.Text -Options $q.Options -CorrectCode $q.Correct
        $seq++
    }
}

Add-SqlLine "COMMIT;"

$sqlText = $sqlLines -join [Environment]::NewLine
[System.IO.File]::WriteAllText($OutputSqlPath, $sqlText, (New-Object System.Text.UTF8Encoding($false)))

$totalAdds = ($targetAdds.Values | Measure-Object -Sum).Sum
Write-Output ("Generated SQL: {0}" -f $OutputSqlPath)
Write-Output ("Questions added in script: {0}" -f $totalAdds)
