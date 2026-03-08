$ErrorActionPreference = 'Stop'

$root = 'C:\roboworkspace\robodynamics'
$ts = Get-Date -Format 'yyyyMMdd_HHmmss'
$logPath = Join-Path $root ("tmp_vedic_e2e_full_" + $ts + ".log")
$jsonPath = Join-Path $root ("tmp_vedic_e2e_full_" + $ts + ".json")
$cookiePath = Join-Path $root ("tmp_robo_cookies_e2e_" + $ts + ".txt")

function LogLine([string]$msg) {
  $line = "[{0}] {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $msg
  Add-Content -Path $logPath -Value $line
  Write-Output $line
}

function Get-QueryParam([string]$url, [string]$key) {
  if (-not $url) { return '' }
  if ($url -match ("(?:[?&])" + [Regex]::Escape($key) + "=([^&]+)")) {
    return [uri]::UnescapeDataString($matches[1])
  }
  return ''
}

function Get-AnswerFromQuestion($q) {
  if ($null -ne $q.expectedAnswer -and ("$($q.expectedAnswer)").Trim().Length -gt 0) {
    return ("$($q.expectedAnswer)").Trim()
  }
  $sol = ("$($q.solution)")
  if ($sol -match '(-?\d+)\s*$') { return $matches[1] }
  if ($sol -match 'answer\s*(?:is|:)\s*(-?\d+)' ) { return $matches[1] }
  return '10'
}

$summary = [ordered]@{
  testedAt = (Get-Date).ToString('s')
  login = @{}
  launch = @{}
  session = @{}
  groups = @()
  final = @{}
  logPath = $logPath
}

LogLine 'STEP 1: Load login page and establish cookie jar.'
$null = curl.exe -ksS -c $cookiePath 'https://robodynamics.in/login' -o NUL

LogLine 'STEP 2: Login as niagh and verify redirect to modules.'
$loginFlow = curl.exe -ksS -L -b $cookiePath -c $cookiePath -d 'userName=niagh&password=niagh' -o NUL -w 'FINAL_URL=%{url_effective}\nHTTP=%{http_code}\n' 'https://robodynamics.in/login'
$loginFinal = (($loginFlow -split "`n") | Where-Object { $_ -like 'FINAL_URL=*' } | Select-Object -First 1).Replace('FINAL_URL=','').Trim()
$loginHttp = (($loginFlow -split "`n") | Where-Object { $_ -like 'HTTP=*' } | Select-Object -First 1).Replace('HTTP=','').Trim()
$summary.login = @{ finalUrl = $loginFinal; http = $loginHttp }
LogLine ("Login result: HTTP={0}, URL={1}" -f $loginHttp, $loginFinal)

LogLine 'STEP 3: Open Vedic launch URL and extract launch token.'
$launchFlow = curl.exe -ksS -L -b $cookiePath -c $cookiePath -o NUL -w 'FINAL_URL=%{url_effective}\nHTTP=%{http_code}\n' 'https://robodynamics.in/ai-tutor/launch?module=VEDIC_MATH'
$launchFinal = (($launchFlow -split "`n") | Where-Object { $_ -like 'FINAL_URL=*' } | Select-Object -First 1).Replace('FINAL_URL=','').Trim()
$launchHttp = (($launchFlow -split "`n") | Where-Object { $_ -like 'HTTP=*' } | Select-Object -First 1).Replace('HTTP=','').Trim()
$token = Get-QueryParam -url $launchFinal -key 'token'
$summary.launch = @{ finalUrl = $launchFinal; http = $launchHttp; tokenPrefix = ($token.Substring(0, [Math]::Min(16, $token.Length))) }
if (-not $token) { throw 'Unable to extract launch token from /ai-tutor/launch redirect URL.' }
LogLine ("Launch result: HTTP={0}, URL={1}" -f $launchHttp, $launchFinal)

LogLine 'STEP 4: Start Vedic tutor session for Chapter 1 Exercise A.'
$startPayload = @{ token=$token; courseId='vedic_math'; chapterCode='L1_COMPLETING_WHOLE'; exerciseGroup='A' } | ConvertTo-Json -Compress
$start = Invoke-RestMethod -Method Post -Uri 'https://robodynamics.in/api/vedic/start' -ContentType 'application/json' -Body $startPayload
$sessionId = "$($start.sessionId)"
if (-not $sessionId) { throw 'Session id missing from start response.' }
$summary.session = @{
  sessionId = $sessionId
  chapter = "$($start.activeChapterCode)"
  activeExerciseGroup = "$($start.activeExerciseGroup)"
  lessonTitle = "$($start.lesson.title)"
}
LogLine ("Session started: {0} | chapter={1} | group={2}" -f $sessionId, $start.activeChapterCode, $start.activeExerciseGroup)

$groups = @('A','B','C','D','E','F','G','H','I')
$currentQuestion = $start.question
$lastProgress = $start.sessionProgress

foreach ($g in $groups) {
  LogLine ("--- Exercise {0} ---" -f $g)
  if ($g -ne 'A') {
    $nextPayload = @{ sessionId=$sessionId; courseId='vedic_math'; chapterCode='L1_COMPLETING_WHOLE'; exerciseGroup=$g } | ConvertTo-Json -Compress
    $next = Invoke-RestMethod -Method Post -Uri 'https://robodynamics.in/api/vedic/next-question' -ContentType 'application/json' -Body $nextPayload
    $currentQuestion = $next.question
    $lastProgress = $next.sessionProgress
    LogLine ("Next question loaded: qid={0} group={1} skill={2}" -f $currentQuestion.questionId, $currentQuestion.exerciseGroup, $currentQuestion.skill)
  } else {
    LogLine ("Initial question: qid={0} group={1} skill={2}" -f $currentQuestion.questionId, $currentQuestion.exerciseGroup, $currentQuestion.skill)
  }

  $answer = Get-AnswerFromQuestion -q $currentQuestion
  $checkPayload = @{
    sessionId = $sessionId
    questionId = "$($currentQuestion.questionId)"
    learnerAnswer = $answer
    responseTimeMs = 1800
    confidence = 'medium'
  } | ConvertTo-Json -Compress
  $check = Invoke-RestMethod -Method Post -Uri 'https://robodynamics.in/api/vedic/check-answer' -ContentType 'application/json' -Body $checkPayload

  $wasRetried = $false
  if (-not $check.correct -and ("$($check.expectedAnswer)").Trim().Length -gt 0) {
    $wasRetried = $true
    LogLine ("First check incorrect for {0}; retrying with expectedAnswer={1}" -f $g, $check.expectedAnswer)
    $retryPayload = @{
      sessionId = $sessionId
      questionId = "$($currentQuestion.questionId)"
      learnerAnswer = "$($check.expectedAnswer)"
      responseTimeMs = 1200
      confidence = 'medium'
    } | ConvertTo-Json -Compress
    $check = Invoke-RestMethod -Method Post -Uri 'https://robodynamics.in/api/vedic/check-answer' -ContentType 'application/json' -Body $retryPayload
  }

  $lastProgress = $check.sessionProgress
  $entry = [ordered]@{
    group = $g
    questionId = "$($currentQuestion.questionId)"
    skill = "$($currentQuestion.skill)"
    questionText = "$($currentQuestion.questionText)"
    submittedAnswer = $answer
    expectedAnswer = "$($check.expectedAnswer)"
    correct = [bool]$check.correct
    retried = $wasRetried
    hearts = $check.sessionProgress.hearts
    xp = $check.sessionProgress.xp
    streak = $check.sessionProgress.streak
    completionPct = $check.sessionProgress.lessonCompletionPct
  }
  $summary.groups += $entry

  LogLine ("Check result: correct={0}, expected={1}, hearts={2}, xp={3}, streak={4}, completion={5}%" -f $check.correct, $check.expectedAnswer, $check.sessionProgress.hearts, $check.sessionProgress.xp, $check.sessionProgress.streak, $check.sessionProgress.lessonCompletionPct)
}

$lessonPath = @($lastProgress.lessonPath)
$completedCount = @($lessonPath | Where-Object { $_.status -eq 'completed' }).Count
$summary.final = [ordered]@{
  hearts = $lastProgress.hearts
  xp = $lastProgress.xp
  streak = $lastProgress.streak
  masteryPct = $lastProgress.masteryPct
  lessonCompletionPct = $lastProgress.lessonCompletionPct
  completedPathItems = $completedCount
  totalPathItems = $lessonPath.Count
  allCompleted = ($lessonPath.Count -gt 0 -and $completedCount -eq $lessonPath.Count)
}

$summary | ConvertTo-Json -Depth 8 | Set-Content -Path $jsonPath -Encoding UTF8
LogLine ("FINAL: lessonCompletion={0}% | completed={1}/{2} | allCompleted={3} | hearts={4} | xp={5}" -f $summary.final.lessonCompletionPct, $summary.final.completedPathItems, $summary.final.totalPathItems, $summary.final.allCompleted, $summary.final.hearts, $summary.final.xp)
LogLine ("Saved JSON summary: {0}" -f $jsonPath)
LogLine ("Saved text log: {0}" -f $logPath)

Write-Output "JSON_PATH=$jsonPath"
Write-Output "LOG_PATH=$logPath"
