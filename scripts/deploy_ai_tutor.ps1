<#
.SYNOPSIS
    Deploy AI Tutor changes (backend + frontend) to production.
.DESCRIPTION
    SCPs changed files to /tmp on server, then runs remote install+build+restart.
    Set $env:PROD_SSH_PASS before running, or you will be prompted.
.EXAMPLE
    $env:PROD_SSH_PASS = "yourpassword"
    .\scripts\deploy_ai_tutor.ps1
#>

param(
    [string]$ServerHost = "168.231.123.108",
    [string]$User = "root",
    [string]$RepoRoot = "$PSScriptRoot\.."
)

$ErrorActionPreference = "Stop"

function Get-Password {
    if ($env:PROD_SSH_PASS) { return $env:PROD_SSH_PASS }
    $secure = Read-Host "Enter prod SSH password" -AsSecureString
    return [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
}

function Scp-File([string]$Local, [string]$Remote) {
    $pw = Get-Password
    Write-Host "  SCP $Local -> $Remote"
    $r = Start-Process -FilePath pscp -ArgumentList @("-batch","-pw",$pw,$Local,"${User}@${ServerHost}:$Remote") -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "SCP failed for $Local" }
}

function Run-Remote([string]$Cmd) {
    $pw = Get-Password
    $r = Start-Process -FilePath plink -ArgumentList @("-batch","-pw",$pw,"${User}@${ServerHost}",$Cmd) -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "Remote command failed" }
}

$ai = "$RepoRoot\ai-tutor"

Write-Host "=== AI Tutor Deploy ===" -ForegroundColor Cyan
Write-Host "Uploading files to /tmp ..."

Scp-File "$ai\tutor-api\app\main.py"                                                               "/tmp/ai_main.py"
Scp-File "$ai\tutor-api\app\models.py"                                                            "/tmp/ai_models.py"
Scp-File "$ai\tutor-api\app\services\generic_course_engine.py"                                    "/tmp/ai_generic_course_engine.py"
Scp-File "$ai\tutor-api\app\services\course_script_loader.py"                                     "/tmp/ai_course_script_loader.py"
Scp-File "$ai\tutor-api\app\services\engine_registry.py"                                          "/tmp/ai_engine_registry.py"
Scp-File "$ai\tutor-api\app\services\behavior_classifier.py"                                      "/tmp/ai_behavior_classifier.py"
Scp-File "$ai\tutor-api\app\services\conversation_engine.py"                                      "/tmp/ai_conversation_engine.py"
Scp-File "$ai\tutor-api\app\services\session_store.py"                                            "/tmp/ai_session_store.py"
Scp-File "$ai\tutor-api\app\services\session_snapshot.py"                                         "/tmp/ai_session_snapshot.py"
Scp-File "$ai\tutor-api\app\services\token_service.py"                                            "/tmp/ai_token_service.py"
Scp-File "$ai\web\lib\types.ts"                                                                    "/tmp/ai_types.ts"
Scp-File "$ai\web\app\ai-tutor\tutor\TutorClient.tsx"                                             "/tmp/ai_TutorClient.tsx"
Scp-File "$ai\web\app\ai-tutor\tutor\tutor.css"                                                   "/tmp/ai_tutor_css.css"
Scp-File "$ai\web\app\ai-tutor\tutor\page.tsx"                                                    "/tmp/ai_tutor_page.tsx"
Scp-File "$ai\web\app\ai-tutor\tutor\RobotAvatar.tsx"                                             "/tmp/ai_RobotAvatar.tsx"
Scp-File "$ai\web\lib\avatarVoices.ts"                                                             "/tmp/ai_avatarVoices.ts"
Scp-File "$ai\web\app\ai-tutor\demo\page.tsx"                                                     "/tmp/ai_demo_page.tsx"
Scp-File "$ai\web\app\ai-tutor\page.tsx"                                                          "/tmp/ai_aitutor_root_page.tsx"
Scp-File "$ai\tutor-api\policies\adaptive_policy_v1.json"                                         "/tmp/adaptive_policy_v1.json"

# â”€â”€ Home + product landing pages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Write-Host "Uploading home + product landing pages ..." -ForegroundColor Yellow
Scp-File "$ai\web\app\page.tsx"                                                                    "/tmp/ms_home_page.tsx"
Scp-File "$ai\web\app\mindsutra\page.tsx"                                                          "/tmp/ms_mindsutra_landing.tsx"

# â”€â”€ MindSutra storefront + auth + checkout + dashboards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Write-Host "Uploading MindSutra storefront pages ..." -ForegroundColor Yellow
Scp-File "$ai\web\app\vedic-math\page.tsx"                                                        "/tmp/ms_vedic_root.tsx"
Scp-File "$ai\web\app\vedic-math\[grade]\layout.tsx"                                              "/tmp/ms_vedic_grade_layout.tsx"
Scp-File "$ai\web\app\vedic-math\[grade]\page.tsx"                                                "/tmp/ms_vedic_grade_page.tsx"
Scp-File "$ai\web\app\vedic-math\[grade]\VedicMathGradeClient.tsx"                                "/tmp/ms_vedic_grade_client.tsx"
Scp-File "$ai\web\app\auth\register\page.tsx"                                                     "/tmp/ms_auth_register.tsx"
Scp-File "$ai\web\app\auth\login\page.tsx"                                                        "/tmp/ms_auth_login.tsx"
Scp-File "$ai\web\app\checkout\[grade]\page.tsx"                                                  "/tmp/ms_checkout_grade.tsx"
Scp-File "$ai\web\app\checkout\success\page.tsx"                                                  "/tmp/ms_checkout_success.tsx"
Scp-File "$ai\web\lib\mindsutraChapters.ts"                                                       "/tmp/ms_mindsutra_chapters.ts"
Scp-File "$ai\web\app\student\home\page.tsx"                                                      "/tmp/ms_student_home_page.tsx"
Scp-File "$ai\web\app\student\home\StudentHomeClient.tsx"                                         "/tmp/ms_student_home_client.tsx"
Scp-File "$ai\web\app\parent\dashboard\page.tsx"                                                  "/tmp/ms_parent_dash_page.tsx"
Scp-File "$ai\web\app\parent\dashboard\ParentDashboardClient.tsx"                                 "/tmp/ms_parent_dash_client.tsx"
Scp-File "$ai\web\app\api\auth\register\route.ts"                                                 "/tmp/ms_api_auth_register.ts"
Scp-File "$ai\web\app\api\auth\login\route.ts"                                                    "/tmp/ms_api_auth_login.ts"
Scp-File "$ai\web\app\api\auth\otp\send\route.ts"                                                 "/tmp/ms_api_otp_send.ts"
Scp-File "$ai\web\app\api\auth\otp\verify\route.ts"                                               "/tmp/ms_api_otp_verify.ts"
Scp-File "$ai\web\app\api\payment\create-order\route.ts"                                          "/tmp/ms_api_payment_order.ts"
Scp-File "$ai\web\app\api\payment\verify\route.ts"                                                "/tmp/ms_api_payment_verify.ts"

# â”€â”€ All 16 Vedic Math chapter JSONs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Write-Host "Uploading Vedic Math chapter JSONs ..." -ForegroundColor Yellow
$chapterDir = "$ai\tutor-api\content-template\vedic_math\chapter"
Get-ChildItem "$chapterDir\*.json" | ForEach-Object {
    Scp-File $_.FullName "/tmp/chapter_$($_.Name)"
}

# â”€â”€ MindSpark G6 chapter JSONs + index â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Write-Host "Uploading MindSpark Grade 6 chapter JSONs ..." -ForegroundColor Yellow
$g6ChapterDir = "$ai\tutor-api\content-template\aptitude_reasoning\grade_6\chapter"
Get-ChildItem "$g6ChapterDir\*.json" | ForEach-Object {
    Scp-File $_.FullName "/tmp/ms_g6_chapter_$($_.Name)"
}
Scp-File "$ai\tutor-api\content-template\aptitude_reasoning\grade_6\chapters.json" "/tmp/ms_g6_chapters_index.json"

# â”€â”€ MindSutra Vedic Math grade chapters (G4â€“G8) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Write-Host "Uploading MindSutra Vedic Math grade chapters (G4-G8) ..." -ForegroundColor Yellow
foreach ($g in @(4,5,6,7,8)) {
    $gradeDir = "$ai\tutor-api\content-template\vedic_math\grade_$g\chapter"
    if (Test-Path $gradeDir) {
        Get-ChildItem "$gradeDir\*.json" | ForEach-Object {
            Scp-File $_.FullName "/tmp/vm_g${g}_chapter_$($_.Name)"
        }
        Scp-File "$ai\tutor-api\content-template\vedic_math\grade_$g\chapters.json" "/tmp/vm_g${g}_chapters_index.json"
    }
}

# â”€â”€ New vm_* SVG assets â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Write-Host "Uploading new Vedic Math SVG assets ..." -ForegroundColor Yellow
$svgDir = "$ai\web\public\math-svgs\vedic"
Get-ChildItem "$svgDir\vm_*.svg" | ForEach-Object {
    Scp-File $_.FullName "/tmp/vm_svg_$($_.Name)"
}

Write-Host "Installing files, building, restarting ..." -ForegroundColor Cyan

$remote = @'
set -euo pipefail

install -D -m 644 /tmp/ai_main.py                    /opt/robodynamics/ai-tutor/tutor-api/app/main.py
install -D -m 644 /tmp/ai_models.py                  /opt/robodynamics/ai-tutor/tutor-api/app/models.py
install -D -m 644 /tmp/ai_generic_course_engine.py   /opt/robodynamics/ai-tutor/tutor-api/app/services/generic_course_engine.py
install -D -m 644 /tmp/ai_course_script_loader.py    /opt/robodynamics/ai-tutor/tutor-api/app/services/course_script_loader.py
install -D -m 644 /tmp/ai_engine_registry.py         /opt/robodynamics/ai-tutor/tutor-api/app/services/engine_registry.py
install -D -m 644 /tmp/ai_behavior_classifier.py     /opt/robodynamics/ai-tutor/tutor-api/app/services/behavior_classifier.py
install -D -m 644 /tmp/ai_conversation_engine.py     /opt/robodynamics/ai-tutor/tutor-api/app/services/conversation_engine.py
install -D -m 644 /tmp/ai_session_store.py           /opt/robodynamics/ai-tutor/tutor-api/app/services/session_store.py
install -D -m 644 /tmp/ai_session_snapshot.py        /opt/robodynamics/ai-tutor/tutor-api/app/services/session_snapshot.py
install -D -m 644 /tmp/ai_token_service.py           /opt/robodynamics/ai-tutor/tutor-api/app/services/token_service.py
install -D -m 644 /tmp/ai_types.ts                   /opt/robodynamics/ai-tutor/web/lib/types.ts
install -D -m 644 /tmp/ai_TutorClient.tsx            /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx
install -D -m 644 /tmp/ai_tutor_css.css              /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/tutor.css
install -D -m 644 /tmp/ai_tutor_page.tsx             /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/page.tsx
install -D -m 644 /tmp/ai_RobotAvatar.tsx            /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/RobotAvatar.tsx
install -D -m 644 /tmp/ai_avatarVoices.ts            /opt/robodynamics/ai-tutor/web/lib/avatarVoices.ts
install -D -m 644 /tmp/ai_demo_page.tsx              /opt/robodynamics/ai-tutor/web/app/ai-tutor/demo/page.tsx
install -D -m 644 /tmp/ai_aitutor_root_page.tsx      /opt/robodynamics/ai-tutor/web/app/ai-tutor/page.tsx
install -D -m 644 /tmp/adaptive_policy_v1.json        /opt/robodynamics/vedic_math/policies/adaptive_policy_v1.json
mkdir -p /opt/robodynamics/ai-tutor/data

# Home + product landing pages
WEB=/opt/robodynamics/ai-tutor/web/app
install -D -m 644 /tmp/ms_home_page.tsx              $WEB/page.tsx
install -D -m 644 /tmp/ms_mindsutra_landing.tsx      $WEB/mindsutra/page.tsx

# MindSutra storefront + auth + checkout + dashboards
install -D -m 644 /tmp/ms_vedic_root.tsx             $WEB/vedic-math/page.tsx
install -D -m 644 /tmp/ms_vedic_grade_layout.tsx     "$WEB/vedic-math/[grade]/layout.tsx"
install -D -m 644 /tmp/ms_vedic_grade_page.tsx       "$WEB/vedic-math/[grade]/page.tsx"
install -D -m 644 /tmp/ms_vedic_grade_client.tsx    "$WEB/vedic-math/[grade]/VedicMathGradeClient.tsx"
install -D -m 644 /tmp/ms_auth_register.tsx          $WEB/auth/register/page.tsx
install -D -m 644 /tmp/ms_auth_login.tsx             $WEB/auth/login/page.tsx
install -D -m 644 /tmp/ms_checkout_grade.tsx         "$WEB/checkout/[grade]/page.tsx"
install -D -m 644 /tmp/ms_checkout_success.tsx       $WEB/checkout/success/page.tsx
install -D -m 644 /tmp/ms_mindsutra_chapters.ts      /opt/robodynamics/ai-tutor/web/lib/mindsutraChapters.ts
install -D -m 644 /tmp/ms_student_home_page.tsx      $WEB/student/home/page.tsx
install -D -m 644 /tmp/ms_student_home_client.tsx    $WEB/student/home/StudentHomeClient.tsx
install -D -m 644 /tmp/ms_parent_dash_page.tsx       $WEB/parent/dashboard/page.tsx
install -D -m 644 /tmp/ms_parent_dash_client.tsx     $WEB/parent/dashboard/ParentDashboardClient.tsx
install -D -m 644 /tmp/ms_api_auth_register.ts       $WEB/api/auth/register/route.ts
install -D -m 644 /tmp/ms_api_auth_login.ts          $WEB/api/auth/login/route.ts
install -D -m 644 /tmp/ms_api_otp_send.ts            $WEB/api/auth/otp/send/route.ts
install -D -m 644 /tmp/ms_api_otp_verify.ts          $WEB/api/auth/otp/verify/route.ts
install -D -m 644 /tmp/ms_api_payment_order.ts       $WEB/api/payment/create-order/route.ts
install -D -m 644 /tmp/ms_api_payment_verify.ts      $WEB/api/payment/verify/route.ts
echo "STOREFRONT_INSTALLED"

# Install all chapter JSONs
CHAPTER_DEST=/opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter
mkdir -p $CHAPTER_DEST
for f in /tmp/chapter_*.json; do
  name=$(basename "$f" | sed 's/^chapter_//')
  install -m 644 "$f" "$CHAPTER_DEST/$name"
done
echo "CHAPTERS_INSTALLED"

# Install MindSpark G6 chapters
MS_G6_DEST=/opt/robodynamics/ai-tutor/tutor-api/content-template/aptitude_reasoning/grade_6/chapter
mkdir -p $MS_G6_DEST
for f in /tmp/ms_g6_chapter_*.json; do
  name=$(basename "$f" | sed 's/^ms_g6_chapter_//')
  install -m 644 "$f" "$MS_G6_DEST/$name"
done
install -m 644 /tmp/ms_g6_chapters_index.json /opt/robodynamics/ai-tutor/tutor-api/content-template/aptitude_reasoning/grade_6/chapters.json
echo "MINDSPARK_G6_INSTALLED"

# Install MindSutra Vedic Math grade chapters (G4-G8)
for g in 4 5 6 7 8; do
  VM_GRADE_DEST=/opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_${g}/chapter
  mkdir -p $VM_GRADE_DEST
  for f in /tmp/vm_g${g}_chapter_*.json; do
    [ -e "$f" ] || continue
    name=$(basename "$f" | sed "s/^vm_g${g}_chapter_//")
    install -m 644 "$f" "$VM_GRADE_DEST/$name"
  done
  INDEX=/tmp/vm_g${g}_chapters_index.json
  [ -f "$INDEX" ] && install -m 644 "$INDEX" /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_${g}/chapters.json
done
echo "VEDIC_GRADES_INSTALLED"

# Install new vm_* SVG assets
SVG_DEST=/opt/robodynamics/ai-tutor/web/public/math-svgs/vedic
mkdir -p $SVG_DEST
for f in /tmp/vm_svg_vm_*.svg; do
  [ -e "$f" ] || continue
  name=$(basename "$f" | sed 's/^vm_svg_//')
  install -m 644 "$f" "$SVG_DEST/$name"
done
echo "SVG_ASSETS_INSTALLED"

echo "FILES_INSTALLED"

cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_latest.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_latest.log; exit 1)

echo "BUILD_OK"

# Sync public + static assets into standalone output (required for node server.js)
cp -r /opt/robodynamics/ai-tutor/web/public /opt/robodynamics/ai-tutor/web/.next/standalone/
cp -r /opt/robodynamics/ai-tutor/web/.next/static /opt/robodynamics/ai-tutor/web/.next/standalone/.next/

echo "STANDALONE_SYNCED"

systemctl restart rd-ai-tutor-api
systemctl restart rd-ai-tutor-web
sleep 2

echo "API=$(systemctl is-active rd-ai-tutor-api)"
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"

curl -ksS -o /dev/null -w "HEALTH=%{http_code}\n" "https://robodynamics.in/ai-tutor-api/health" || true
'@

Run-Remote $remote

Write-Host "=== Deploy complete ===" -ForegroundColor Green

