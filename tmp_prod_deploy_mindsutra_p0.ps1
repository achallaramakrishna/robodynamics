$ErrorActionPreference = "Stop"
$pw = if ($env:PROD_SSH_PASS) { $env:PROD_SSH_PASS } else { "Jatni@752050" }
$hostName = "168.231.123.108"
$user = "root"
$plink = "C:\Program Files\PuTTY\plink.exe"
$pscp = "C:\Program Files\PuTTY\pscp.exe"
$repo = "C:\roboworkspace\robodynamics\ai-tutor\web"

$uploads = @(
  @{ local = "$repo\lib\appSession.ts"; remote = "/tmp/ms_appSession.ts" },
  @{ local = "$repo\lib\mindsutraCatalog.ts"; remote = "/tmp/ms_mindsutraCatalog.ts" },
  @{ local = "$repo\app\api\auth\login\route.ts"; remote = "/tmp/ms_api_auth_login.ts" },
  @{ local = "$repo\app\api\auth\register\route.ts"; remote = "/tmp/ms_api_auth_register.ts" },
  @{ local = "$repo\app\api\student\home\route.ts"; remote = "/tmp/ms_api_student_home.ts" },
  @{ local = "$repo\app\api\parent\dashboard\route.ts"; remote = "/tmp/ms_api_parent_dashboard.ts" },
  @{ local = "$repo\app\api\payment\verify\route.ts"; remote = "/tmp/ms_api_payment_verify.ts" },
  @{ local = "$repo\app\checkout\success\page.tsx"; remote = "/tmp/ms_checkout_success.tsx" },
  @{ local = "$repo\app\checkout\[grade]\page.tsx"; remote = "/tmp/ms_checkout_grade.tsx" },
  @{ local = "$repo\app\student\home\StudentHomeClient.tsx"; remote = "/tmp/ms_student_home_client.tsx" },
  @{ local = "$repo\app\student\course\[grade]\page.tsx"; remote = "/tmp/ms_student_course_page.tsx" },
  @{ local = "$repo\app\student\course\[grade]\StudentCourseHubClient.tsx"; remote = "/tmp/ms_student_course_client.tsx" }
)

foreach ($item in $uploads) {
  & $pscp -batch -pw $pw $item.local "$user@${hostName}:$($item.remote)"
  if ($LASTEXITCODE -ne 0) { throw "Upload failed: $($item.local)" }
}

$remoteScript = @"
set -euo pipefail
WEB=/opt/robodynamics/ai-tutor/web/app
LIB=/opt/robodynamics/ai-tutor/web/lib
install -D -m 644 /tmp/ms_appSession.ts \$LIB/appSession.ts
install -D -m 644 /tmp/ms_mindsutraCatalog.ts \$LIB/mindsutraCatalog.ts
install -D -m 644 /tmp/ms_api_auth_login.ts \$WEB/api/auth/login/route.ts
install -D -m 644 /tmp/ms_api_auth_register.ts \$WEB/api/auth/register/route.ts
install -D -m 644 /tmp/ms_api_student_home.ts \$WEB/api/student/home/route.ts
install -D -m 644 /tmp/ms_api_parent_dashboard.ts \$WEB/api/parent/dashboard/route.ts
install -D -m 644 /tmp/ms_api_payment_verify.ts \$WEB/api/payment/verify/route.ts
install -D -m 644 /tmp/ms_checkout_success.tsx \$WEB/checkout/success/page.tsx
install -D -m 644 /tmp/ms_checkout_grade.tsx "\$WEB/checkout/[grade]/page.tsx"
install -D -m 644 /tmp/ms_student_home_client.tsx \$WEB/student/home/StudentHomeClient.tsx
install -D -m 644 /tmp/ms_student_course_page.tsx "\$WEB/student/course/[grade]/page.tsx"
install -D -m 644 /tmp/ms_student_course_client.tsx "\$WEB/student/course/[grade]/StudentCourseHubClient.tsx"
find /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor -maxdepth 1 -type f \( -name 'TutorClient*.backup*.tsx' -o -name 'TutorClient*.localbackup*.tsx' -o -name 'TutorClient*.corrupt*.tsx' -o -name 'TutorClient.prodbackup*.tsx' \) -delete
find /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic -maxdepth 1 -type f \( -name 'VedicTutorClient*.tsx' -o -name '*.backup*.tsx' -o -name '*.localbackup*.tsx' -o -name '*.corrupt*.tsx' \) -delete
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_p0.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_p0.log; exit 1)
cp -r /opt/robodynamics/ai-tutor/web/public /opt/robodynamics/ai-tutor/web/.next/standalone/
cp -r /opt/robodynamics/ai-tutor/web/.next/static /opt/robodynamics/ai-tutor/web/.next/standalone/.next/
systemctl restart rd-ai-tutor-web
sleep 3
echo "WEB=`$(systemctl is-active rd-ai-tutor-web)"
curl -ksS -D - -o /dev/null https://robodynamics.in/student/home | head -n 20
curl -ksS -D - -o /dev/null https://robodynamics.in/student/course/grade-5 | head -n 20
curl -ksS -D - -o /dev/null https://robodynamics.in/parent/dashboard | head -n 20
"@
$remoteLocalPath = "C:\roboworkspace\robodynamics\tmp_remote_p0_prod_deploy.sh"
Set-Content -Path $remoteLocalPath -Value $remoteScript
& $pscp -batch -pw $pw $remoteLocalPath "$user@${hostName}:/tmp/remote_p0_prod_deploy.sh"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: remote deploy script" }
& $plink -batch -pw $pw "$user@${hostName}" -m $remoteLocalPath
if ($LASTEXITCODE -ne 0) { throw "Remote deploy failed" }
