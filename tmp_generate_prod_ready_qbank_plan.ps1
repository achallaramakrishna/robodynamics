$inPath = "artifacts/prod_qbank_all_subjects_gap_queue_sorted_2026-03-01.tsv"
$planPath = "artifacts/prod_qbank_prod_ready_plan_2026-03-01.tsv"
$coursePath = "artifacts/prod_qbank_course_targets_2026-03-01.tsv"
$mathWave1Path = "artifacts/prod_qbank_math_wave1_2026-03-01.tsv"
$allWavePath = "artifacts/prod_qbank_execution_waves_2026-03-01.tsv"

$rows = Import-Csv -Path $inPath -Delimiter "`t"

function Get-TargetConfig($subject) {
  switch ($subject) {
    'MATH'      { return @{total=45; mcq=20; short=12; long=8; fill=5; base=100} }
    'SCIENCE'   { return @{total=42; mcq=18; short=12; long=8; fill=4; base=88} }
    'PHYSICS'   { return @{total=42; mcq=18; short=12; long=8; fill=4; base=87} }
    'CHEMISTRY' { return @{total=42; mcq=18; short=12; long=8; fill=4; base=86} }
    'HINDI'     { return @{total=36; mcq=12; short=12; long=8; fill=4; base=78} }
    default     { return @{total=36; mcq=14; short=10; long=8; fill=4; base=72} }
  }
}

function NeedsImage($subject, $title) {
  $t = ($title | Out-String).ToLower()
  if ($subject -in @('SCIENCE','PHYSICS','CHEMISTRY')) { return $true }
  if ($subject -eq 'MATH' -and $t -match 'geometry|shape|symmetry|graph|chart|data|mensuration|construction|coordinate|triangle|circle|polygon|perimeter|area|volume|3-dimensional|nets') { return $true }
  return $false
}

function Get-Wave($subject, [int]$courseId) {
  if ($subject -eq 'MATH' -and $courseId -in 65,154,149) { return 'WAVE_M1' }
  if ($subject -eq 'MATH') { return 'WAVE_M2' }
  if ($subject -eq 'HINDI') { return 'WAVE_L1' }
  if ($subject -eq 'SCIENCE') { return 'WAVE_S1' }
  if ($subject -in @('PHYSICS','CHEMISTRY')) { return 'WAVE_S2' }
  return 'WAVE_O1'
}

$plan = foreach ($r in $rows) {
  $subject = "$($r.subject_bucket)"
  $cfg = Get-TargetConfig $subject
  $courseId = [int]$r.course_id
  $pdfCount = [int]$r.pdf_count
  $imgReq = NeedsImage $subject $r.session_title
  $imgTarget = if ($imgReq) { [int][Math]::Max(8, [Math]::Round($cfg.total * 0.25)) } else { [int][Math]::Max(3, [Math]::Round($cfg.total * 0.10)) }
  $priority = $cfg.base + [Math]::Min(9, $pdfCount)
  $wave = Get-Wave $subject $courseId

  [PSCustomObject]@{
    wave = $wave
    priority_score = $priority
    subject_bucket = $subject
    course_id = $courseId
    course_name = $r.course_name
    course_session_id = [int]$r.course_session_id
    session_order = if ([string]::IsNullOrWhiteSpace($r.session_order)) { '' } else { [int]$r.session_order }
    session_title = $r.session_title
    pdf_count = $pdfCount
    sample_pdf = $r.sample_pdf
    current_question_count = [int]$r.question_count
    target_total_questions = $cfg.total
    target_mcq = $cfg.mcq
    target_short_answer = $cfg.short
    target_long_answer = $cfg.long
    target_fill_in_blank = $cfg.fill
    image_required = if ($imgReq) { 'YES' } else { 'OPTIONAL' }
    target_questions_with_images = $imgTarget
    image_root_path = "/opt/robodynamics/session_materials/$courseId/images"
    chapter_json_output = "/opt/robodynamics/session_materials/$courseId/qbank/chapter_$($r.course_session_id).json"
    qa_status = 'PENDING'
    publish_status = 'PENDING'
  }
}

$planSorted = $plan | Sort-Object wave, @{Expression='priority_score';Descending=$true}, course_id, session_order
$planSorted | Export-Csv -Path $planPath -Delimiter "`t" -NoTypeInformation

$courseTargets = $planSorted |
  Group-Object course_id,course_name,subject_bucket,wave |
  ForEach-Object {
    $first = $_.Group | Select-Object -First 1
    [PSCustomObject]@{
      wave = $first.wave
      subject_bucket = $first.subject_bucket
      course_id = $first.course_id
      course_name = $first.course_name
      chapters_to_fill = $_.Count
      target_total_questions = ($_.Group | Measure-Object -Property target_total_questions -Sum).Sum
      target_mcq = ($_.Group | Measure-Object -Property target_mcq -Sum).Sum
      target_short_answer = ($_.Group | Measure-Object -Property target_short_answer -Sum).Sum
      target_long_answer = ($_.Group | Measure-Object -Property target_long_answer -Sum).Sum
      target_fill_in_blank = ($_.Group | Measure-Object -Property target_fill_in_blank -Sum).Sum
      target_questions_with_images = ($_.Group | Measure-Object -Property target_questions_with_images -Sum).Sum
    }
  } | Sort-Object wave, subject_bucket, {[int]$_.course_id}

$courseTargets | Export-Csv -Path $coursePath -Delimiter "`t" -NoTypeInformation

$mathWave1 = $planSorted | Where-Object { $_.wave -eq 'WAVE_M1' }
$mathWave1 | Export-Csv -Path $mathWave1Path -Delimiter "`t" -NoTypeInformation

$waveSummary = $planSorted |
  Group-Object wave,subject_bucket |
  ForEach-Object {
    $first = $_.Group | Select-Object -First 1
    [PSCustomObject]@{
      wave = $first.wave
      subject_bucket = $first.subject_bucket
      chapters = $_.Count
      total_questions_target = ($_.Group | Measure-Object -Property target_total_questions -Sum).Sum
      image_questions_target = ($_.Group | Measure-Object -Property target_questions_with_images -Sum).Sum
    }
  } | Sort-Object wave, subject_bucket

$waveSummary | Export-Csv -Path $allWavePath -Delimiter "`t" -NoTypeInformation

"PLAN_ROWS=$($planSorted.Count)"
"COURSE_TARGET_ROWS=$($courseTargets.Count)"
"MATH_WAVE1_ROWS=$($mathWave1.Count)"
"WAVE_ROWS=$($waveSummary.Count)"
