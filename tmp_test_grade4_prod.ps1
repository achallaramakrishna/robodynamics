$ErrorActionPreference = "Stop"

$base = "https://robodynamics.in"
$chapters = @(
  @{ code = "VM_G4_L1_FAST_ADDITION"; title = "All From 9, Last From 10" },
  @{ code = "VM_G4_L2_TABLES_11_TO_19"; title = "Lightning Tables 11-19" },
  @{ code = "VM_G4_L3_DOUBLING_HALVING"; title = "Doubling and Halving Tricks" },
  @{ code = "VM_G4_L4_MULT_BY_11"; title = "The 11 Times Trick" },
  @{ code = "VM_G4_L5_SUBT_BORROW_FREE"; title = "No More Borrowing!" },
  @{ code = "VM_G4_L6_MULT_BY_5_25"; title = "x5 and x25 in a Flash" },
  @{ code = "VM_G4_L7_NEAR_100"; title = "Near 100 Magic" },
  @{ code = "VM_G4_L8_CRISS_CROSS_2DIG"; title = "The X-Factor Multiplication" }
)

function Get-DemoToken([string]$chapterCode) {
  $url = "$base/ai-tutor/demo?grade=4&chapter=$chapterCode&fresh=1"
  $headers = & curl.exe -ksSI $url
  if ($LASTEXITCODE -ne 0) {
    throw "curl failed for demo endpoint $chapterCode"
  }
  $statusLine = ($headers | Select-Object -First 1)
  if ($statusLine -notmatch "HTTP/\S+\s+(301|302|303|307|308)\b") {
    throw "Demo endpoint for $chapterCode did not redirect. Status: $statusLine"
  }
  $locationHeader = $headers | Where-Object { $_ -match '^Location:\s+' } | Select-Object -First 1
  $location = ""
  if ($locationHeader) {
    $location = ($locationHeader -replace '^Location:\s+', "").Trim()
  }
  if (-not $location) {
    throw "Demo endpoint for $chapterCode did not include Location header"
  }
  $token = ""
  if ($location -match '[?&]token=([^&]+)') {
    $token = [System.Uri]::UnescapeDataString($matches[1])
  }
  if (-not $token) {
    throw "Token missing in redirect for $chapterCode"
  }
  return $token
}

function Post-Json([string]$url, [hashtable]$body) {
  $json = $body | ConvertTo-Json -Depth 10
  return Invoke-RestMethod -Uri $url -Method Post -ContentType "application/json" -Body $json
}

function First-Value($object, [string[]]$names) {
  foreach ($name in $names) {
    if ($null -ne $object.PSObject.Properties[$name]) {
      $value = $object.$name
      if ($null -ne $value -and [string]::IsNullOrWhiteSpace([string]$value) -eq $false) {
        return [string]$value
      }
    }
  }
  return ""
}

$results = @()

foreach ($chapter in $chapters) {
  $code = $chapter.code
  $expectedTitle = $chapter.title
  $row = [ordered]@{
    chapter = $code
    expectedTitle = $expectedTitle
    token = $false
    startOk = $false
    activeChapterMatches = $false
    lessonTitleOk = $false
    coachIntroPresent = $false
    screenplayIntro = $false
    screenplayExplain = $false
    screenplayDemo = $false
    screenplayGuided = $false
    nextQuestionOk = $false
    questionGroupA = $false
    questionHasText = $false
    wrongAnswerRejected = $false
    wrongAnswerHasExplanation = $false
    wrongAnswerHasExpected = $false
    doubtReplyOk = $false
    sessionId = ""
    lessonTitle = ""
    activeChapterCode = ""
    questionText = ""
    doubtReply = ""
    failure = ""
  }

  try {
    $token = Get-DemoToken $code
    $row.token = $true

    $start = Post-Json "$base/api/vedic/start" @{
      token = $token
      grade = "4"
      chapter_code = $code
    }

    $row.startOk = $true
    $row.sessionId = [string]$start.sessionId
    $row.activeChapterCode = [string]$start.activeChapterCode
    $row.activeChapterMatches = ($row.activeChapterCode -eq $code)
    $row.lessonTitle = [string]$start.lesson.title
    $row.lessonTitleOk = ($row.lessonTitle -match [Regex]::Escape($expectedTitle))

    $coachIntro = [string]$start.lesson.duolingoLessonArc.onboarding.coachIntro
    $row.coachIntroPresent = (-not [string]::IsNullOrWhiteSpace($coachIntro))

    $screenplay = @($start.lesson.screenplay)
    $cues = @($screenplay | ForEach-Object { $_.cue })
    $row.screenplayIntro = $cues -contains "intro"
    $row.screenplayExplain = $cues -contains "explain"
    $row.screenplayDemo = $cues -contains "demo"
    $row.screenplayGuided = $cues -contains "guided"

    $next = Post-Json "$base/api/vedic/next-question" @{
      sessionId = $row.sessionId
    }
    $row.nextQuestionOk = $true
    $row.questionText = [string]$next.question.questionText
    $row.questionHasText = (-not [string]::IsNullOrWhiteSpace($row.questionText))
    $row.questionGroupA = ([string]$next.question.exerciseGroup -eq "A")

    $wrong = Post-Json "$base/api/vedic/check-answer" @{
      sessionId = $row.sessionId
      questionId = [string]$next.question.questionId
      learnerAnswer = "999"
    }
    $row.wrongAnswerRejected = ($wrong.correct -eq $false -or $wrong.is_correct -eq $false -or $wrong.isCorrect -eq $false)
    $explanation = First-Value $wrong @("explanation", "feedback", "encouragement")
    $expected = First-Value $wrong @("expectedAnswer", "correct_answer", "correctAnswer")
    $row.wrongAnswerHasExplanation = (-not [string]::IsNullOrWhiteSpace($explanation))
    $row.wrongAnswerHasExpected = (-not [string]::IsNullOrWhiteSpace($expected))

    $doubt = Post-Json "$base/api/vedic/doubt" @{
      sessionId = $row.sessionId
      message = "Can you explain this in simple words for a Grade 4 student?"
    }
    $reply = First-Value $doubt @("reply", "response")
    $row.doubtReply = $reply
    $row.doubtReplyOk = ($reply.Length -ge 20)
  }
  catch {
    $row.failure = $_.Exception.Message
  }

  $results += [pscustomobject]$row
}

$summary = $results | Select-Object chapter, activeChapterCode, lessonTitle, token, startOk, activeChapterMatches, lessonTitleOk, coachIntroPresent, screenplayIntro, screenplayExplain, screenplayDemo, screenplayGuided, nextQuestionOk, questionGroupA, questionHasText, wrongAnswerRejected, wrongAnswerHasExplanation, wrongAnswerHasExpected, doubtReplyOk, failure
$summary | Format-Table -AutoSize

"`nJSON_SUMMARY_START"
$results | ConvertTo-Json -Depth 10
"JSON_SUMMARY_END"
