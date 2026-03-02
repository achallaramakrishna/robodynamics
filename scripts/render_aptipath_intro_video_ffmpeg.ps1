param(
    [string]$FfmpegPath = "ffmpeg",
    [string]$OutDir = "artifacts/aptipath-video"
)

$ErrorActionPreference = "Stop"

if (!(Test-Path -Path $OutDir)) {
    throw "Output directory not found: $OutDir. Run scripts/generate_aptipath_intro_assets.ps1 first."
}

$sceneDurations = @(5,6,8,10,9,7)
$sceneCount = $sceneDurations.Count
$sceneFiles = @()

for ($i = 1; $i -le $sceneCount; $i++) {
    $idx = "{0:D2}" -f $i
    $img = Join-Path $OutDir ("scenes/scene{0}.png" -f $idx)
    if (!(Test-Path -Path $img)) {
        throw "Scene image missing: $img"
    }
    $dur = $sceneDurations[$i - 1]
    $sceneMp4 = Join-Path $OutDir ("scene{0}.mp4" -f $idx)
    & $FfmpegPath -y -loop 1 -t $dur -i $img `
        -vf "scale=1920:1080,format=yuv420p,fps=30" `
        -c:v libx264 -preset medium -pix_fmt yuv420p -an $sceneMp4 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "ffmpeg failed while rendering scene $idx"
    }
    $sceneFiles += $sceneMp4
}

$concatList = Join-Path $OutDir "scene_concat.txt"
$concatLines = @()
foreach ($sf in $sceneFiles) {
    $safe = ((Resolve-Path $sf).Path -replace "\\", "/")
    $concatLines += "file '$safe'"
}
Set-Content -Path $concatList -Value $concatLines -Encoding ASCII

$videoNoAudio = Join-Path $OutDir "aptipath360_intro_45s_noaudio.mp4"
& $FfmpegPath -y -f concat -safe 0 -i $concatList -c:v libx264 -preset medium -pix_fmt yuv420p -an $videoNoAudio | Out-Null
if ($LASTEXITCODE -ne 0) {
    throw "ffmpeg failed while concatenating scenes."
}

$voice = Join-Path $OutDir "aptipath360_voiceover.wav"
if (!(Test-Path -Path $voice)) {
    throw "Voice file missing: $voice"
}

$final = Join-Path $OutDir "aptipath360_intro_45s.mp4"
& $FfmpegPath -y -i $videoNoAudio -i $voice `
    -c:v copy -c:a aac -b:a 192k -shortest $final | Out-Null
if ($LASTEXITCODE -ne 0) {
    throw "ffmpeg failed while muxing final audio/video."
}

Write-Host "VIDEO_READY"
Write-Host ("VIDEO=" + (Resolve-Path $final).Path)
