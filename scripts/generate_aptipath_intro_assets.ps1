param(
    [string]$OutDir = "artifacts/aptipath-video"
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Speech

function Ensure-Dir([string]$path) {
    if (!(Test-Path -Path $path)) {
        New-Item -ItemType Directory -Path $path | Out-Null
    }
}

function Write-SilentWav([string]$path, [int]$seconds) {
    $sampleRate = 16000
    $bitsPerSample = 16
    $channels = 1
    $blockAlign = ($channels * $bitsPerSample) / 8
    $byteRate = $sampleRate * $blockAlign
    $dataSize = $sampleRate * $blockAlign * $seconds
    $riffSize = 36 + $dataSize

    $fs = [System.IO.File]::Create($path)
    $bw = New-Object System.IO.BinaryWriter($fs)
    try {
        $bw.Write([System.Text.Encoding]::ASCII.GetBytes("RIFF"))
        $bw.Write([int]$riffSize)
        $bw.Write([System.Text.Encoding]::ASCII.GetBytes("WAVE"))
        $bw.Write([System.Text.Encoding]::ASCII.GetBytes("fmt "))
        $bw.Write([int]16)
        $bw.Write([int16]1)
        $bw.Write([int16]$channels)
        $bw.Write([int]$sampleRate)
        $bw.Write([int]$byteRate)
        $bw.Write([int16]$blockAlign)
        $bw.Write([int16]$bitsPerSample)
        $bw.Write([System.Text.Encoding]::ASCII.GetBytes("data"))
        $bw.Write([int]$dataSize)
        $zero = New-Object byte[] $dataSize
        $bw.Write($zero)
    } finally {
        $bw.Flush()
        $bw.Close()
        $fs.Close()
    }
}

function Draw-SceneImage(
    [string]$path,
    [string]$title,
    [string]$subtitle,
    [string]$accent,
    [int]$index
) {
    $width = 1920
    $height = 1080

    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
    $bg1 = [System.Drawing.ColorTranslator]::FromHtml("#0b1f3a")
    $bg2 = [System.Drawing.ColorTranslator]::FromHtml("#102f54")
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        $bg1,
        $bg2,
        [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
    )
    $g.FillRectangle($brush, $rect)

    $accentColor = [System.Drawing.ColorTranslator]::FromHtml($accent)
    $softAccent = [System.Drawing.Color]::FromArgb(70, $accentColor)
    $orbBrush = New-Object System.Drawing.SolidBrush($softAccent)
    $g.FillEllipse($orbBrush, $width - 520, -120, 700, 700)
    $g.FillEllipse($orbBrush, -220, 680, 680, 680)

    $titleFont = New-Object System.Drawing.Font("Segoe UI Semibold", 64, [System.Drawing.FontStyle]::Bold)
    $subtitleFont = New-Object System.Drawing.Font("Segoe UI", 40, [System.Drawing.FontStyle]::Regular)
    $tagFont = New-Object System.Drawing.Font("Segoe UI", 30, [System.Drawing.FontStyle]::Bold)

    $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $subColor = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#b8d8ff"))
    $accentBrush = New-Object System.Drawing.SolidBrush($accentColor)

    $tag = "AptiPath360"
    $g.DrawString($tag, $tagFont, $accentBrush, 120, 100)
    $titleRect = New-Object System.Drawing.RectangleF(120, 220, 1680, 300)
    $subtitleRect = New-Object System.Drawing.RectangleF(120, 580, 1680, 220)
    $g.DrawString($title, $titleFont, $white, $titleRect)
    $g.DrawString($subtitle, $subtitleFont, $subColor, $subtitleRect)
    $g.DrawString(("Scene " + $index), $tagFont, $subColor, 120, 930)

    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)

    $tagFont.Dispose()
    $subtitleFont.Dispose()
    $titleFont.Dispose()
    $accentBrush.Dispose()
    $subColor.Dispose()
    $white.Dispose()
    $orbBrush.Dispose()
    $brush.Dispose()
    $g.Dispose()
    $bmp.Dispose()
}

$scenes = @(
    @{
        Index = 1
        Duration = 5
        Accent = "#4ad4ff"
        Title = "Too many options. Too much confusion."
        Subtitle = "Very little clarity for your child."
        Voice = "Too many career options. Too much confusion. And very little clarity for your child."
    },
    @{
        Index = 2
        Duration = 6
        Accent = "#7ff2a2"
        Title = "Introducing AptiPath360"
        Subtitle = "Career Discovery for Grade 8 to Post-12."
        Voice = "Introducing AptiPath360 by Robo Dynamics, a guided Career Discovery system for students from Grade 8 to Post 12."
    },
    @{
        Index = 3
        Duration = 8
        Accent = "#ffd36a"
        Title = "Simple parent-first activation flow"
        Subtitle = "Register, pay, generate student link, student login."
        Voice = "Simple parent first flow. Register, complete payment, and instantly generate your student's secure test link."
    },
    @{
        Index = 4
        Duration = 10
        Accent = "#ff9d9d"
        Title = "Adaptive student assessment experience"
        Subtitle = "MCQ, Slider, Drag-Rank. Personalized by grade, stream, and program."
        Voice = "The student takes an adaptive assessment, personalized by grade, stream, and program, like Science, Commerce, Humanities, B.Tech, B.B.A, and more."
    },
    @{
        Index = 5
        Duration = 9
        Accent = "#c3a3ff"
        Title = "Powerful report for real decisions"
        Subtitle = "Top careers, strengths, stream-fit insights, and 90-day plan."
        Voice = "You get a powerful report: top career matches, strengths, stream fit insights, and a practical 90 day action plan."
    },
    @{
        Index = 6
        Duration = 7
        Accent = "#86e0d1"
        Title = "Start AptiPath360 today"
        Subtitle = "Support: +91 8374377311 (Call / WhatsApp)"
        Voice = "AptiPath360 helps families make smarter career decisions early. Start today. For support, call or WhatsApp plus nine one eight three seven four three seven seven three one one."
    }
)

Ensure-Dir $OutDir
$scenesDir = Join-Path $OutDir "scenes"
Ensure-Dir $scenesDir

foreach ($scene in $scenes) {
    $file = Join-Path $scenesDir ("scene{0:D2}.png" -f [int]$scene.Index)
    Draw-SceneImage -path $file -title $scene.Title -subtitle $scene.Subtitle -accent $scene.Accent -index ([int]$scene.Index)
}

$voicePath = Join-Path $OutDir "aptipath360_voiceover.wav"
$voiceScriptPath = Join-Path $OutDir "aptipath360_voiceover_script.txt"
($scenes | ForEach-Object { $_.Voice }) -join [Environment]::NewLine + [Environment]::NewLine | Set-Content -Path $voiceScriptPath -Encoding UTF8

$voiceReady = $false
try {
    $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $synth.Rate = -1
    $synth.Volume = 100
    $synth.SetOutputToWaveFile($voicePath)
    foreach ($scene in $scenes) {
        $synth.Speak($scene.Voice)
        $synth.Speak("<break time='300ms'/>")
    }
    $synth.SetOutputToDefaultAudioDevice()
    $synth.Dispose()
    $voiceReady = $true
} catch {
    Write-SilentWav -path $voicePath -seconds 45
    $voiceReady = $false
}

$srtPath = Join-Path $OutDir "aptipath360_voiceover.srt"
$cursor = [TimeSpan]::FromSeconds(0)
$srtLines = New-Object System.Collections.Generic.List[string]
$counter = 1
foreach ($scene in $scenes) {
    $start = $cursor
    $cursor = $cursor.Add([TimeSpan]::FromSeconds([int]$scene.Duration))
    $end = $cursor
    $fmt = {
        param([TimeSpan]$t)
        return "{0:00}:{1:00}:{2:00},{3:000}" -f $t.Hours, $t.Minutes, $t.Seconds, $t.Milliseconds
    }
    $srtLines.Add([string]$counter)
    $srtLines.Add((& $fmt $start) + " --> " + (& $fmt $end))
    $srtLines.Add([string]$scene.Voice)
    $srtLines.Add("")
    $counter++
}
Set-Content -Path $srtPath -Value $srtLines -Encoding UTF8

$manifestPath = Join-Path $OutDir "scene_manifest.json"
$manifest = [pscustomobject]@{
    title = "AptiPath360 Homepage Intro"
    durationSeconds = 45
    scenes = $scenes | ForEach-Object {
        [pscustomobject]@{
            index = $_.Index
            duration = $_.Duration
            title = $_.Title
            subtitle = $_.Subtitle
            voice = $_.Voice
            image = ("scenes/scene{0:D2}.png" -f [int]$_.Index)
        }
    }
}
$manifest | ConvertTo-Json -Depth 5 | Set-Content -Path $manifestPath -Encoding UTF8

$htmlPath = Join-Path $OutDir "aptipath360_intro_preview.html"
$html = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>AptiPath360 Intro Preview</title>
  <style>
    body { margin:0; font-family: Segoe UI, Arial, sans-serif; background:#091a33; color:#fff; }
    .wrap { max-width:1200px; margin:20px auto; padding:0 16px; }
    .stage { position:relative; width:100%; aspect-ratio:16/9; border-radius:18px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,.35); }
    .stage img { width:100%; height:100%; object-fit:cover; display:block; }
    .hud { display:flex; gap:10px; align-items:center; margin:14px 0; }
    button { background:#1fae85; color:#041623; border:0; border-radius:999px; padding:10px 18px; font-weight:700; cursor:pointer; }
    .progress { flex:1; height:8px; background:#21436e; border-radius:999px; overflow:hidden; }
    .bar { height:100%; width:0%; background:#67d8ff; transition:width .2s linear; }
    .meta { opacity:.9; font-size:14px; }
  </style>
</head>
<body>
  <div class="wrap">
    <h2>AptiPath360 Intro Preview (45s)</h2>
    <div class="stage">
      <img id="sceneImage" src="scenes/scene01.png" alt="scene">
    </div>
    <div class="hud">
      <button id="playBtn">Play</button>
      <div class="progress"><div class="bar" id="bar"></div></div>
      <div class="meta" id="meta">00:00 / 00:45</div>
    </div>
    <audio id="vo" src="aptipath360_voiceover.wav"></audio>
  </div>
  <script>
    const scenes = [
      { img: "scenes/scene01.png", d: 5 },
      { img: "scenes/scene02.png", d: 6 },
      { img: "scenes/scene03.png", d: 8 },
      { img: "scenes/scene04.png", d: 10 },
      { img: "scenes/scene05.png", d: 9 },
      { img: "scenes/scene06.png", d: 7 }
    ];
    const total = scenes.reduce((a,s)=>a+s.d,0);
    const img = document.getElementById("sceneImage");
    const vo = document.getElementById("vo");
    const playBtn = document.getElementById("playBtn");
    const bar = document.getElementById("bar");
    const meta = document.getElementById("meta");
    let timer = null;
    function fmt(t){ const m = String(Math.floor(t/60)).padStart(2,"0"); const s = String(Math.floor(t%60)).padStart(2,"0"); return `${m}:${s}`; }
    function currentScene(second){
      let acc = 0;
      for (const s of scenes){ acc += s.d; if (second < acc) return s; }
      return scenes[scenes.length-1];
    }
    function tick(){
      const t = vo.currentTime || 0;
      const ratio = Math.min(1, t/total);
      bar.style.width = `${ratio*100}%`;
      meta.textContent = `${fmt(t)} / ${fmt(total)}`;
      const scene = currentScene(t);
      if (!img.src.endsWith(scene.img)) img.src = scene.img;
      if (t >= total){
        clearInterval(timer); timer = null; playBtn.textContent = "Replay";
      }
    }
    playBtn.addEventListener("click", () => {
      vo.currentTime = 0;
      vo.play();
      playBtn.textContent = "Playing...";
      if (timer) clearInterval(timer);
      timer = setInterval(tick, 100);
    });
    vo.addEventListener("ended", () => {
      if (timer) clearInterval(timer);
      playBtn.textContent = "Replay";
      bar.style.width = "100%";
    });
  </script>
</body>
</html>
"@
Set-Content -Path $htmlPath -Value $html -Encoding UTF8

Write-Host "ASSETS_READY"
Write-Host ("OUT_DIR=" + (Resolve-Path $OutDir).Path)
Write-Host ("VOICE=" + (Resolve-Path $voicePath).Path)
Write-Host ("VOICE_READY=" + $voiceReady)
Write-Host ("PREVIEW_HTML=" + (Resolve-Path $htmlPath).Path)
