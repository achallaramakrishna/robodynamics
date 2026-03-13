$inPlan = "artifacts/prod_qbank_prod_ready_plan_2026-03-01.tsv"
$outAug = "artifacts/prod_qbank_ai_augmented_plan_2026-03-01.tsv"
$outMathManifest = "artifacts/prod_qbank_ai_prompt_manifest_math_wave1_2026-03-01.tsv"

$rows = Import-Csv -Path $inPlan -Delimiter "`t"

$aug = foreach ($r in $rows) {
  $subject = $r.subject_bucket
  $target = [int]$r.target_total_questions

  $seedMin = switch ($subject) {
    'MATH' { 14 }
    'SCIENCE' { 16 }
    'PHYSICS' { 16 }
    'CHEMISTRY' { 16 }
    'HINDI' { 12 }
    default { 12 }
  }
  $seedMax = [Math]::Min($target - 8, $seedMin + 8)
  $aiMin = [Math]::Max(8, $target - $seedMax)
  $aiMax = [Math]::Max($aiMin, $target - $seedMin)

  $difficultyGuide = if ($subject -eq 'MATH') { 'Easy:30%, Medium:45%, Hard:20%, Expert:5%' } else { 'Easy:30%, Medium:50%, Hard:15%, Expert:5%' }
  $examStyle = if ($subject -eq 'HINDI') { 'board-language clarity + grammar + comprehension' } else { 'board-exam style with conceptual + application + mixed format' }

  [PSCustomObject]@{
    wave = $r.wave
    priority_score = $r.priority_score
    subject_bucket = $subject
    course_id = $r.course_id
    course_name = $r.course_name
    course_session_id = $r.course_session_id
    session_order = $r.session_order
    session_title = $r.session_title
    target_total_questions = $target
    target_mcq = $r.target_mcq
    target_short_answer = $r.target_short_answer
    target_long_answer = $r.target_long_answer
    target_fill_in_blank = $r.target_fill_in_blank
    seed_extraction_min = $seedMin
    seed_extraction_max = $seedMax
    ai_generation_min = $aiMin
    ai_generation_max = $aiMax
    ai_generation_rule = "AI should generate exactly the shortfall after extraction to reach target_total_questions; if extraction quality is low, regenerate up to ai_generation_max."
    difficulty_distribution = $difficultyGuide
    exam_style_requirement = $examStyle
    image_required = $r.image_required
    target_questions_with_images = $r.target_questions_with_images
    image_instruction = if ($r.image_required -eq 'YES') { 'Use diagrams/graphs/figures where concept needs visual reasoning.' } else { 'Use images only when it improves clarity.' }
    source_pdf = $r.sample_pdf
    chapter_json_output = $r.chapter_json_output
    qa_status = $r.qa_status
    publish_status = $r.publish_status
  }
}

$aug | Export-Csv -Path $outAug -Delimiter "`t" -NoTypeInformation

$mathManifest = $aug | Where-Object { $_.wave -eq 'WAVE_M1' } | ForEach-Object {
  $prompt = @"
Generate exam-ready $($_.subject_bucket) questions for:
- Course: $($_.course_name) (course_id=$($_.course_id))
- Chapter: $($_.session_title) (course_session_id=$($_.course_session_id))
- Board style: CBSE/ICSE school exam

Required final chapter bank target:
- Total: $($_.target_total_questions)
- MCQ: $($_.target_mcq)
- Short Answer: $($_.target_short_answer)
- Long Answer: $($_.target_long_answer)
- Fill in blank: $($_.target_fill_in_blank)
- Difficulty mix: $($_.difficulty_distribution)

Use extracted textbook questions as seed, then generate AI questions only for shortfall.
AI generation limit for this chapter: $($_.ai_generation_min) to $($_.ai_generation_max).

Quality rules:
- No duplicates or near-duplicates.
- Exactly one correct option for MCQ; at least 4 options.
- Correct answers and concise explanations required.
- Keep strictly chapter-scoped.
- Image policy: $($_.image_instruction)

Output strict JSON with fields:
question_text, question_type, difficulty_level, max_marks, correct_answer, explanation, question_image, additional_info, options[]
"@

  [PSCustomObject]@{
    wave = $_.wave
    course_id = $_.course_id
    course_name = $_.course_name
    course_session_id = $_.course_session_id
    session_title = $_.session_title
    target_total_questions = $_.target_total_questions
    ai_generation_min = $_.ai_generation_min
    ai_generation_max = $_.ai_generation_max
    image_required = $_.image_required
    prompt = ($prompt -replace "`r?`n", " ")
  }
}

$mathManifest | Export-Csv -Path $outMathManifest -Delimiter "`t" -NoTypeInformation

"AUG_ROWS=$($aug.Count)"
"MATH_MANIFEST_ROWS=$($mathManifest.Count)"
