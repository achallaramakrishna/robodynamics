<#
.SYNOPSIS
    Full build + deploy: Java WAR + AI Tutor Next.js + DB seed.
.DESCRIPTION
    Step 1: Build Java WAR (mvn package)
    Step 2: Deploy WAR to Tomcat (deploy_prod.ps1)
    Step 3: Deploy AI Tutor Next.js + content (deploy_ai_tutor.ps1)
    Step 4: Run DB seed for Vedic Math G4-G8 (run_vedic_db_seed.ps1)
.EXAMPLE
    $env:PROD_SSH_PASS = "yourpassword"
    .\scripts\build_and_deploy_full.ps1
    # or skip steps:
    .\scripts\build_and_deploy_full.ps1 -SkipJava -SkipDb
#>

param(
    [switch]$SkipJava,
    [switch]$SkipAiTutor,
    [switch]$SkipDb,
    [string]$RepoRoot = "$PSScriptRoot\.."
)

$ErrorActionPreference = "Stop"
$sw = [System.Diagnostics.Stopwatch]::StartNew()

function Banner([string]$msg, [string]$color = "Cyan") {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════" -ForegroundColor $color
    Write-Host "  $msg" -ForegroundColor $color
    Write-Host "═══════════════════════════════════════════" -ForegroundColor $color
}

# ── Step 1: Build Java WAR ──────────────────────────────────────────
if (-not $SkipJava) {
    Banner "Step 1/4 — Building Java WAR (mvn package)" "Yellow"
    Push-Location $RepoRoot
    try {
        $mvn = "C:\apache-maven-3.9.12\bin\mvn.cmd"
        if (-not (Test-Path $mvn)) { $mvn = "mvn" }
        & $mvn package -DskipTests -q
        if ($LASTEXITCODE -ne 0) { throw "mvn package failed" }
        Write-Host "  WAR built: target\robodynamics-0.0.1-SNAPSHOT.war" -ForegroundColor Green
    } finally { Pop-Location }
} else {
    Write-Host "[SKIP] Java build skipped" -ForegroundColor Gray
}

# ── Step 2: Deploy Java WAR ─────────────────────────────────────────
if (-not $SkipJava) {
    Banner "Step 2/4 — Deploying Java WAR to Tomcat" "Yellow"
    & "$PSScriptRoot\production\deploy_prod.ps1"
    Write-Host "  Java WAR deployed" -ForegroundColor Green
} else {
    Write-Host "[SKIP] Java deploy skipped" -ForegroundColor Gray
}

# ── Step 3: Deploy AI Tutor (Next.js + content) ─────────────────────
if (-not $SkipAiTutor) {
    Banner "Step 3/4 — Deploying AI Tutor (Next.js + content)" "Yellow"
    & "$PSScriptRoot\deploy_ai_tutor.ps1" -RepoRoot $RepoRoot
    Write-Host "  AI Tutor deployed" -ForegroundColor Green
} else {
    Write-Host "[SKIP] AI Tutor deploy skipped" -ForegroundColor Gray
}

# ── Step 4: DB Seed ──────────────────────────────────────────────────
if (-not $SkipDb) {
    Banner "Step 4/4 — Running Vedic Math DB seed" "Yellow"
    & "$PSScriptRoot\run_vedic_db_seed.ps1" -RepoRoot $RepoRoot
    Write-Host "  DB seed complete" -ForegroundColor Green
} else {
    Write-Host "[SKIP] DB seed skipped" -ForegroundColor Gray
}

$sw.Stop()
Banner "ALL DONE in $([int]$sw.Elapsed.TotalSeconds)s" "Green"
Write-Host ""
Write-Host "Live URLs:" -ForegroundColor Cyan
Write-Host "  Landing : https://robodynamics.in/vedic-math/grade-5" -ForegroundColor White
Write-Host "  Demo    : https://robodynamics.in/ai-tutor/demo?grade=5&chapter=VM_G5_L1_NIKHILAM_NEAR100&fresh=1" -ForegroundColor White
Write-Host "  Checkout: https://robodynamics.in/checkout/grade-5" -ForegroundColor White
Write-Host "  Parent  : https://robodynamics.in/parent/dashboard" -ForegroundColor White
Write-Host "  Student : https://robodynamics.in/student/home" -ForegroundColor White
