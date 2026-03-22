param(
    [string]$ServerHost = "168.231.123.108",
    [string]$User = "root",
    [string]$Pass = "Jatni@752050"
)

$plink = "plink"
$pscp  = "pscp"
$web   = "C:\roboworkspace\robodynamics\ai-tutor\web"

function Scp([string]$Local, [string]$Remote) {
    Write-Host "  SCP $Local"
    $r = Start-Process $pscp -ArgumentList @("-batch","-pw",$Pass,$Local,"${User}@${ServerHost}:$Remote") -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "SCP failed: $Local" }
}

function Remote([string]$Cmd) {
    $r = Start-Process $plink -ArgumentList @("-batch","-pw",$Pass,"${User}@${ServerHost}",$Cmd) -NoNewWindow -PassThru -Wait
    if ($r.ExitCode -ne 0) { throw "Remote failed: $Cmd" }
}

Write-Host "=== Deploy: mindsutra catalog redesign + layout crash fix ===" -ForegroundColor Cyan

# Upload changed files
Scp "$web\app\page.tsx"                                      "/tmp/fix_home_page.tsx"
Scp "$web\app\mindsutra\page.tsx"                            "/tmp/fix_mindsutra.tsx"
Scp "$web\app\auth\register\page.tsx"                        "/tmp/fix_auth_register.tsx"
Scp "$web\app\checkout\success\page.tsx"                     "/tmp/fix_checkout_success.tsx"
Scp "$web\app\vedic-math\[grade]\layout.tsx"                 "/tmp/fix_vedicmath_layout.tsx"

Write-Host "  Installing files..." -ForegroundColor Yellow
Remote "install -D -m 644 /tmp/fix_home_page.tsx /opt/robodynamics/ai-tutor/web/app/page.tsx && install -D -m 644 /tmp/fix_mindsutra.tsx /opt/robodynamics/ai-tutor/web/app/mindsutra/page.tsx && echo PAGE_FILES_INSTALLED"
Remote "install -D -m 644 /tmp/fix_auth_register.tsx /opt/robodynamics/ai-tutor/web/app/auth/register/page.tsx && install -D -m 644 /tmp/fix_checkout_success.tsx /opt/robodynamics/ai-tutor/web/app/checkout/success/page.tsx && echo SUSPENSE_FILES_INSTALLED"
Remote "install -D -m 644 /tmp/fix_vedicmath_layout.tsx '/opt/robodynamics/ai-tutor/web/app/vedic-math/[grade]/layout.tsx' && echo LAYOUT_FIX_INSTALLED"

Write-Host "  Building Next.js (this takes ~2-3 min)..." -ForegroundColor Yellow
Remote "cd /opt/robodynamics/ai-tutor/web && npm run build"

Write-Host "  Restarting app..." -ForegroundColor Yellow
Remote "systemctl restart rd-ai-tutor-web.service && echo RESTARTED"

Write-Host ""
Write-Host "SUCCESS!" -ForegroundColor Green
Write-Host "  Home     : https://robodynamics.in/robodynamics/" -ForegroundColor White
Write-Host "  MindSutra: https://robodynamics.in/robodynamics/mindsutra" -ForegroundColor White
Write-Host "  Grade 5  : https://robodynamics.in/robodynamics/vedic-math/grade-5" -ForegroundColor White
